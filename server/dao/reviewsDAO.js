import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let reviews;

export default class ReviewsDAO {
  static async injectDB(conn) {
    if (reviews) {
      console.log("Reviews collection already initialized");
      return;
    }
    try {
      console.log(`Connecting to database: ${process.env.RESTREVIEWS_NS}`);
      const db = await conn.db(process.env.RESTREVIEWS_NS);
      console.log("Database connection established");
      reviews = await db.collection("reviews");
      console.log("Connected to reviews collection");
    } catch (e) {
      console.error(`Unable to establish a collection handle in reviewsDAO: ${e}`);
    }
  }

  static async addReview(restaurantId, user, review, date) {
    try {
      if (!reviews) {
        throw new Error("Reviews collection is not initialized");
      }
      console.log("Adding review to the reviews collection");
      const reviewDoc = {
        name: user.name,
        user_id: user._id,
        date: date,
        text: review,
        restaurant_id: new ObjectId(restaurantId),
      };
      console.log("Review document:", reviewDoc);
      const result = await reviews.insertOne(reviewDoc);
      console.log("Review added successfully:", result);
      return result;
    } catch (e) {
      console.error(`Unable to post review: ${e}`);
      return { error: e };
    }
  }

  static async updateReview(reviewId, userId, text, date) {
    try {
      if (!reviews) {
        throw new Error("Reviews collection is not initialized");
      }
      const updateResponse = await reviews.updateOne(
        { user_id: userId, _id: new ObjectId(reviewId) },
        { $set: { text: text, date: date } }
      );
      return updateResponse;
    } catch (e) {
      console.error(`Unable to update review: ${e}`);
      return { error: e };
    }
  }

  static async deleteReview(reviewId, userId) {
    try {
      const deleteResponse = await reviews.deleteOne({
        _id: new ObjectId(reviewId),
        user_id: userId,
      });

      return deleteResponse;
    } catch (e) {
      console.error(`Unable to delete review: ${e}`);
      return { error: e };
    }
  }
}