import { Router } from "express"
import { z } from "zod"

import { sendContactEmail, sendAutoReplyEmail } from "../services/mail.service"
import { checkEmailCooldown, isDuplicateMessage } from "../services/antiSpam.service"
import { contactLimiter } from "../middlewares/rateLimit"
import { prisma } from "../lib/prisma"
import { logInfo, logError } from "../lib/logger"
import { sendDiscordMessage } from "../lib/discord"
import { turnstile } from "../middlewares/turnstale"



const router = Router()

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(5),
  company: z.string().optional(),
})

router.post("/contact", turnstile, contactLimiter, async (req, res) => {
  try {
    const data = contactSchema.parse(req.body)

    // 1️⃣ Honeypot
    if (data.company) {
      return res.status(200).json({ ok: true })
    }

    // 2️⃣ Shadow-ban básico
    if (!req.headers["user-agent"]) {
      return res.status(200).json({ ok: true })
    }

    // 3️⃣ Cooldown por email
    const canSend = await checkEmailCooldown(data.email)
    if (!canSend) {
      return res.status(429).json({
        ok: false,
        message: "Please wait before sending another message.",
      })
    }

    // 4️⃣ Mensaje duplicado
    const duplicated = await isDuplicateMessage(
      data.email,
      data.message
    )

    if (duplicated) {
      return res.status(429).json({
        ok: false,
        message: "Duplicate message detected.",
      })
    }

    // 5️⃣ Guardar en DB
    await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        message: data.message,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      },
    })

    // 6️⃣ Log
    logInfo("CONTACT_FORM", {
      email: data.email,
      ip: req.ip,
    })

    // 7️⃣ Discord
    await sendDiscordMessage(
      `📩 **Nuevo contacto**
👤 ${data.name}
📧 ${data.email}
💬 ${data.message}`
    )

    // 8️⃣ Email
    if (process.env.RESEND_API_KEY) {
      await sendContactEmail(data)
      await sendAutoReplyEmail(data)
    }

    return res.status(200).json({
      ok: true,
      message: "Mensaje enviado correctamente",
    })

  } catch (error: any) {
    logError("CONTACT_FORM_ERROR", {
      error: error?.message,
      ip: req.ip,
    })

    return res.status(400).json({
      ok: false,
      message: "No se pudo enviar el mensaje",
    })
  }
})


export default router
