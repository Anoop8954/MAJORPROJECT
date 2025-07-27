const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");

const multer = require("multer");
const {storage} = require("../cloudConfi.js")
const upload = multer({storage});

router.route("/")
.get(wrapAsync(listingController.index))
.post( 
    isLoggedIn, 
    upload.single("listing[image]"),
    validateListing, 
    wrapAsync (listingController.createListing)
);

//New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.delete( 
    isLoggedIn, 
    isOwner, 
    wrapAsync (listingController.deleteListing))
.put(isLoggedIn, 
    isOwner, 
    // upload.single("listing[image]"),
    validateListing, 
    wrapAsync(listingController.updateListing)
);

//Edit route
router.get("/:id/edit", 
    isLoggedIn, 
    isOwner, 
    wrapAsync (listingController.editListing));

module.exports = router;
