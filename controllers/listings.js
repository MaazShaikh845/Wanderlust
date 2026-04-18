const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;

const getMapTokenError = () => {
    const token = process.env.MAP_TOKEN;

    if (!token) {
        return "Mapbox token is missing in environment variables!";
    }

    if (token.startsWith('"') || token.endsWith('"') || token.startsWith("'") || token.endsWith("'")) {
        return "Mapbox token contains quotes. Please remove them from your environment settings.";
    }

    return null;
};

const getGeometryFromLocation = async (location) => {
    const token = process.env.MAP_TOKEN;
    if (!token) return null;
    
    try {
        const geocodingClient = mbxGeocoding({ accessToken: token });
        const response = await geocodingClient.forwardGeocode({
            query: location,
            limit: 1,
        }).send();

        return response.body.features[0]?.geometry || null;
    } catch (err) {
        console.error("Mapbox Geocoding Error:", err.message);
        return null;
    }
};

module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let{id} = req.params;
    let listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if(!listing) {
        req.flash("error", "Listing You Requested Does Not Exist!");
        return res.redirect('/listings');
    }
    res.render("listings/show.ejs", {listing});
};

module.exports.createListing = async (req, res) => {
    if (!req.file) {
        req.flash("error", "Please upload an image for the listing.");
        return res.redirect("/listings/new");
    }

    const mapTokenError = getMapTokenError();
    if (mapTokenError) {
        req.flash("error", mapTokenError);
        return res.redirect("/listings/new");
    }

    const geometry = await getGeometryFromLocation(req.body.listing.location);
    if (!geometry) {
        req.flash("error", "Location not found. Please enter a valid location.");
        return res.redirect("/listings/new");
    }

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};

    newListing.geometry = geometry;

    let savedListing = await newListing.save();
    console.log(savedListing);

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let{id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing You Requested Does Not Exist!");
        return res.redirect('/listings');
    }

    let originalImageUrl = listing.image?.url || null;
    if (originalImageUrl) {
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    }
    res.render("./listings/edit.ejs", {listing, originalImageUrl});
};

module.exports.updateListing = async (req, res) => {
    let{id} = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing You Requested Does Not Exist!");
        return res.redirect("/listings");
    }

    const nextLocation = req.body.listing.location;
    const shouldRefreshGeometry = nextLocation && nextLocation !== listing.location;

    Object.assign(listing, req.body.listing);

    if (shouldRefreshGeometry || !listing.geometry) {
        const mapTokenError = getMapTokenError();
        if (mapTokenError) {
            req.flash("error", mapTokenError);
            return res.redirect(`/listings/${id}/edit`);
        }

        const geometry = await getGeometryFromLocation(nextLocation);
        if (!geometry) {
            req.flash("error", "Location not found. Please enter a valid location.");
            return res.redirect(`/listings/${id}/edit`);
        }

        listing.geometry = geometry;
    }

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
    }

    await listing.save();

    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let{id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing  Deleted");
    res.redirect("/listings");
    console.log(deleteListing);
};
