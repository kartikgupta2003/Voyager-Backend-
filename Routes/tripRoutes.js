const express = require("express");
const {createTrip , fetchTrip , getPhoto , fetchAllTrips} = require("../Controllers/tripController");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");


const router = express.Router();


router.post("/plan" , ClerkExpressRequireAuth() , createTrip);
router.post("/fetch" , ClerkExpressRequireAuth() , fetchTrip);
router.get("/photo" , ClerkExpressRequireAuth()  , getPhoto);
router.post("/fetchAll" , ClerkExpressRequireAuth() , fetchAllTrips);

module.exports = router;