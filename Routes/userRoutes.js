const express = require("express");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");
const addUser = require("../Controllers/userController");

const router = express.Router();

router.get("/addNew" , ClerkExpressRequireAuth() , addUser);

module.exports = router;