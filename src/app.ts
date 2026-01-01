import express from "express"
import cors from "cors"
import { requestLogger } from "./middlewares/logger"
import contactRoute from "./routes/contact.route"
import helmet from "helmet"
import adminRoutes from "./routes/admin.route"


export const app = express()
app.set("trust proxy", 1)


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


app.use(helmet())

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH" ,"DELETE"],
    allowedHeaders: ["Content-Type", "x-admin-key"],
  })
)

app.use(express.json())
app.use(requestLogger)

app.use("/api", adminRoutes)
app.use("/api", contactRoute)


app.get("/", (_, res) => {
  res.send("InfraxelLab API OK")
})
