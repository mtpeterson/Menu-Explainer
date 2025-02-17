import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"

dotenv.config()

console.log("Starting script...")

const MongoClient = mongodb.MongoClient
const port = process.env.PORT || 8000
const dbUri = process.env.MENUEXPLAINER_DB_URI

if (!dbUri) {
    console.error("MENUEXPLAINER_DB_URI is not set!")
    process.exit(1)
}

console.log(`Attempting to connect to MongoDB at ${dbUri}`)

MongoClient.connect(
    dbUri,
    {
        maxPoolSize: 50,
        wtimeoutMS: 2500,
        useNewUrlParser: true
    }
)
.catch(err => {
    console.error("MongoDB Connection Error:", err.stack)
    process.exit(1)
})
.then(async client => {
    if (!client) {
        console.error("MongoDB client is null!")
        process.exit(1)
    }

    console.log("Connected to MongoDB successfully")

    app.listen(port, () => {
        console.log(`Listening on port ${port}`)
    })
})
