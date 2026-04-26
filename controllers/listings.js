const Listing = require("../models/listing");

// Uses free OpenStreetMap Nominatim API â€” no API key or credit card required
const getGeometryFromLocation = async (location) => {
    try {
        const encoded = encodeURIComponent(location);
        const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`;
        const response = await fetch(url, {
            headers: { "User-Agent": "WanderlustApp/1.0" }
        });
        const data = await response.json();

        if (!data || data.length === 0) return null;

        return {
            type: "Point",
            coordinates: [parseFloat(data[0].lon), parseFloat(data[0].lat)]
        };
    } catch (err) {
        console.error("Nominatim Geocoding Error:", err.message);
        return null;
    }
};

module.exports.index = async (req, res) => {
    const { category } = req.query;
    let filter = {};
    if (category) filter.category = category;
    let allListings = await Listing.find(filter);
    res.render("./listings/index.ejs", { allListings, activeCategory: category || null });
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

    let url = req.file.path;
    let filename = req.file.filename;

    // Geocode the location using free Nominatim API
    const geometry = await getGeometryFromLocation(req.body.listing.location);

    const listingData = { ...req.body.listing };
    delete listingData.image; // prevent string image from overriding the object

    const newListing = new Listing(listingData);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    // Use geometry if found, otherwise default to [0,0] so listing still saves
    newListing.geometry = geometry || { type: "Point", coordinates: [0, 0] };

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
        const geometry = await getGeometryFromLocation(nextLocation);
        // Only update geometry if found; otherwise keep existing or use default
        listing.geometry = geometry || listing.geometry || { type: "Point", coordinates: [0, 0] };
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

