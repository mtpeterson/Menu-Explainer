import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
import RestaurantsDAO from "./dao/restaurantsDAO.js";
import ReviewsDAO from "./dao/reviewsDAO.js";

dotenv.config();

const MongoClient = mongodb.MongoClient;
const port = process.env.PORT || 8000;

console.log("Starting MongoDB connection...");

MongoClient.connect(
  process.env.MONGODB_URI,
  {
    maxPoolSize: 50,
    wtimeoutMS: 2500,
  }
)
.catch(err => {
  console.error("MongoDB Connection Error:", err.stack);
  process.exit(1);
})
.then(async client => {
  if (!client) {
    console.error("MongoDB client is undefined");
    process.exit(1);
  }
  console.log("Connected to MongoDB successfully");
  console.log("Calling injectDB methods");
  await RestaurantsDAO.injectDB(client);
  await ReviewsDAO.injectDB(client);
  console.log("injectDB methods called");

  const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });

  // Handle termination signals to close the server gracefully
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
    });
  });
})
.catch(err => {
  console.error("Error in .then block:", err.stack);
  process.exit(1);
});
