const { Query } = require("mongoose");
const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const { response } = require("express");
const mapToken = process.env.MAP_Token;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });



module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) =>{
    let {id} = req.params;
   const listing = await Listing.findById(id).populate({path: "reviews",populate:{path:"author"}}).populate("owner");
   if(!listing){
    req.flash("error","Listing you requested for does not exist!");
    res.redirect("/listings")
   }
   console.log(listing);
   res.render("listings/show", { listing:listing });
};

module.exports.createListing = async (req, res, next) => {
    const response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send();

    const { title, description, price, location, country } = req.body.listing;
    const url = req.file.path;
    const filename = req.file.filename;

    const newListing = new Listing({
        title,
        description,
        price,
        location,
        country,
        image: { url, filename },
        geometry: response.body.features[0].geometry,
        owner: req.user._id
    });

    await newListing.save();
    req.flash("success", "New listing created!");
    res.status(201).redirect("/listings");
    console.log("✅ req.isAuthenticated():", req.isAuthenticated?.());
    console.log("✅ req.user:", req.user);

};


module.exports.editListing = async(req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings")
       }
      let originalImg = listing.image.url;
      originalImg =  originalImg.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing, originalImg})
};

module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
}
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async(req, res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings")
};
