const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
    await mongoose.connect(MONGO_URL);
};

const seedOwnerId = process.env.SEED_OWNER_ID;
const coordinatesByLocation = {
    "Malibu": [-118.7798, 34.0259],
    "New York City": [-74.0060, 40.7128],
    "Aspen": [-106.8370, 39.1911],
    "Florence": [11.2558, 43.7696],
    "Portland": [-122.6784, 45.5152],
    "Cancun": [-86.8515, 21.1619],
    "Lake Tahoe": [-120.0324, 39.0968],
    "Los Angeles": [-118.2437, 34.0522],
    "Verbier": [7.2286, 46.0964],
    "Serengeti National Park": [34.6857, -2.3333],
    "Amsterdam": [4.9041, 52.3676],
    "Fiji": [178.0650, -17.7134],
    "Cotswolds": [-1.8433, 51.8330],
    "Boston": [-71.0589, 42.3601],
    "Bali": [115.1889, -8.4095],
    "Banff": [-115.5708, 51.1784],
    "Miami": [-80.1918, 25.7617],
    "Phuket": [98.3923, 7.8804],
    "Scottish Highlands": [-4.6790, 57.1200],
    "Dubai": [55.2708, 25.2048],
    "Montana": [-110.3626, 46.8797],
    "Mykonos": [25.3289, 37.4467],
    "Costa Rica": [-84.0907, 9.9281],
    "Charleston": [-79.9311, 32.7765],
    "Tokyo": [139.6917, 35.6895],
    "New Hampshire": [-71.5724, 43.1939],
    "Maldives": [73.2207, 3.2028],
};

const getSeedGeometry = (location) => {
    const coordinates = coordinatesByLocation[location];

    if (!coordinates) {
        console.warn(`Missing seed coordinates for "${location}". Falling back to [0, 0].`);
    }

    return {
        type: "Point",
        coordinates: coordinates || [0, 0],
    };
};

const initDB = async () => {
    await Listing.deleteMany({});
    const seedListings = initData.data.map((obj) => {
        const listing = {
            ...obj,
            geometry: obj.geometry || getSeedGeometry(obj.location),
        };

        if (seedOwnerId) {
            listing.owner = seedOwnerId;
        }

        return listing;
    });

    await Listing.insertMany(seedListings);
    console.log("data was saved");
}

main()
    .then(() => {
        console.log("Connected to DB");
        return initDB();
    })
    .then(() => mongoose.connection.close())
    .catch(async (err) => {
        console.log(err);
        await mongoose.connection.close();
        process.exitCode = 1;
    });
