import express from "express"
import RestaurantsCtrl from "./restaurants.controller.js" // EDIT
import ReviewsCtrl from "./reviews.controller.js" // EDIT
import multer from "multer";
import UploadsCtrl from "./uploads.controller.js";

const router = express.Router()
const upload = multer(); // No destination specified, so files are stored in memory

router.route("/").get(RestaurantsCtrl.apiGetRestaurants) // EDIT
router.route("/id/:id").get(RestaurantsCtrl.apiGetRestaurantById)
router.route("/cuisines").get(RestaurantsCtrl.apiGetRestaurantCuisines)

router // EDIT
    .route("/review")
    .post(ReviewsCtrl.apiPostReview)
    .put(ReviewsCtrl.apiUpdateReview)
    .delete(ReviewsCtrl.apiDeleteReview)

router
    .route("/upload")
    .post(upload.single("image"), UploadsCtrl.apiUploadImage);

export default router