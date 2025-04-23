const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js")
const reviewController = require("../controllers/reviews.js")

//Reviews Route
//Post Route
router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.reviewPost));
    
//Reviews Delete Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.reviewDelete));
    
module.exports = router;    