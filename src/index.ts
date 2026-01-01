import "dotenv/config"
import { app } from "./app"
import { errorHandler } from "./middlewares/errorHandler"

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.use(errorHandler)

