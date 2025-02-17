import express from "express"
import cors from "cors"
import restaurants from "./api/restaurants.route.js" // EDIT

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/v1/restaurants", restaurants) // EDIT
app.use("*", (req, res) => res.status(404).json({ error: "not found"}))

const port = process.env.PORT || 5001
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

export default app