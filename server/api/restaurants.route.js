import express from "express"
import RestaurantsCtrl from "./restaurants.controller.js" // EDIT
import ReviewsCtrl from "./reviews.controller.js" // EDIT

const router = express.Router()

router.route("/").get(RestaurantsCtrl.apiGetRestaurants) // EDIT
router.route("/id/:id").get(RestaurantsCtrl.apiGetRestaurantById)
router.route("/cuisines").get(RestaurantsCtrl.apiGetRestaurantCuisines)

router // EDIT
    .route("/review")
    .post(ReviewsCtrl.apiPostReview)
    .put(ReviewsCtrl.apiUpdateReview)
    .delete(ReviewsCtrl.apiDeleteReview)

export default router