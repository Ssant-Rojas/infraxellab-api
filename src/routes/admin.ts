import { Router } from "express"
import { prisma } from "../lib/prisma"
import { adminAuth } from "../middlewares/adminAuth"

const router = Router()

router.get("/messages", adminAuth, async (req, res) => {
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 20
  const skip = (page - 1) * limit

  const [messages, total] = await Promise.all([
    prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.contactMessage.count(),
  ])

  res.json({
    page,
    total,
    totalPages: Math.ceil(total / limit),
    data: messages,
  })
})

export default router
