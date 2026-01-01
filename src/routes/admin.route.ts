import { Router } from "express"
import { prisma } from "../lib/prisma"
import { adminAuth } from "../middlewares/adminAuth"
import { adminIpAllowlist } from "../middlewares/adminIpAllowlist"
import { Prisma } from "@prisma/client"

const router = Router()

/**
 * GET /api/admin/messages
 */
router.get(
  "/admin/messages",
  adminAuth,
  adminIpAllowlist,
  async (req, res) => {
    const page = Number(req.query.page || 1)
    const limit = Math.min(Number(req.query.limit || 20), 100)
    const skip = (page - 1) * limit

    const search = String(req.query.search || "").trim()
    const spam = req.query.spam as string | undefined

    const where: Prisma.ContactMessageWhereInput = {
      ...(search && {
        OR: [
          { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { message: { contains: search, mode: Prisma.QueryMode.insensitive } },
        ],
      }),
      ...(spam === "true" && { isSpam: true }),
      ...(spam === "false" && { isSpam: false }),
    }

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.contactMessage.count({ where }),
    ])

    res.json({
      ok: true,
      page,
      limit,
      total,
      data: messages,
    })
  }
)

/**
 * PATCH /api/admin/messages/:id/spam
 */
router.patch(
  "/admin/messages/:id/spam",
  adminAuth,
  adminIpAllowlist,
  async (req, res) => {
    const { id } = req.params

    const msg = await prisma.contactMessage.findUnique({ where: { id } })
    if (!msg) {
      return res.status(404).json({ ok: false, error: "Not found" })
    }

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { isSpam: !msg.isSpam },
    })

    res.json({ ok: true, data: updated })
  }
)

/**
 * DELETE /api/admin/messages/:id
 */
router.delete(
  "/admin/messages/:id",
  adminAuth,
  adminIpAllowlist,
  async (req, res) => {
    const { id } = req.params

    try {
      await prisma.contactMessage.delete({
        where: { id },
      })

      res.json({ ok: true })
    } catch {
      res.status(404).json({
        ok: false,
        error: "Message not found",
      })
    }
  }
)

export default router
