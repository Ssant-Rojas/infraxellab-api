import express from "express"
import cors from "cors"
import { requestLogger } from "./middlewares/logger"
import contactRoute from "./routes/contact.route"
import helmet from "helmet"


export const app = express()


const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [
        "https://infraxellab.com",
        "https://www.infraxellab.com",
      ]
    : [
        "http://localhost:4000",
        "http://127.0.0.1:4000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
      ]

      app.get("/health", (_, res) => {
  res.json({
    status: "ok",
    service: "infraxellab-api",
    env: process.env.NODE_ENV,
    email: !!process.env.RESEND_API_KEY,
    time: new Date().toISOString(),
  })
})

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["POST"],
    allowedHeaders: ["Content-Type"],
  })
)


app.use(express.json())
app.use(requestLogger) // 👁️ OBSERVABILIDAD GLOBAL
app.set("trust proxy", 1)
app.use(helmet())

app.use("/api", contactRoute)

app.get("/", (_, res) => {
  res.send("InfraxelLab API OK")
})
