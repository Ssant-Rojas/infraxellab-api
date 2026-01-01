import { prisma } from "../lib/prisma"

const EMAIL_COOLDOWN_MINUTES = 5

export async function checkEmailCooldown(email: string) {
  const since = new Date(
    Date.now() - EMAIL_COOLDOWN_MINUTES * 60 * 1000
  )

  const recent = await prisma.contactMessage.findFirst({
    where: {
      email,
      createdAt: {
        gte: since,
      },
    },
  })

  return !recent
}

export async function isDuplicateMessage(
  email: string,
  message: string
) {
  const recent = await prisma.contactMessage.findFirst({
    where: {
      email,
      message,
    },
  })

  return Boolean(recent)
}
