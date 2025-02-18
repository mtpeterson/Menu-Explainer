import express from "express"
import RestaurantsCtrl from "./restaurants.controller.js" // EDIT

const router = express.Router()

router.route("/").get(RestaurantsCtrl.apiGetRestaurants) // EDIT

export default router