import { Router } from "express"
import { z } from "zod"
import { sendContactEmail, sendAutoReplyEmail } from "../services/mail.service"
import { logInfo, logError } from "../lib/logger"
import { contactLimiter } from "../middlewares/rateLimit"
import { sendDiscordMessage } from "../lib/discord"

const router = Router()

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(5),
  company: z.string().optional(),
})

router.post("/contact", contactLimiter, async (req, res) => {
  try {
    const data = contactSchema.parse(req.body)

    if (data.company) {
      return res.status(200).json({ ok: true })
    }

    logInfo("CONTACT_FORM", {
      ip: req.ip,
      email: data.email,
      ua: req.headers["user-agent"],
    })

    if (process.env.RESEND_API_KEY) {
      await sendContactEmail(data)
      await sendAutoReplyEmail(data)
    }

    await sendDiscordMessage(
      `📩 **Nuevo contacto**
👤 ${data.name}
📧 ${data.email}
💬 ${data.message}`
    )

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
      message:
        error?.message ||
        "No se pudo enviar el mensaje. Intenta más tarde.",
    })
  }
})

export default router
