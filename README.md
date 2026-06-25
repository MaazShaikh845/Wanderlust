# Wanderlust 🌍✈️

Welcome to **Wanderlust**, a full-stack web application designed for travelers to discover, explore, and share unique accommodations and travel experiences around the world. Inspired by platforms like Airbnb, Wanderlust provides a seamless interface for users to book stays or list their own properties.

🚀 **[Live Demo of Wanderlust](https://wanderlust-k9xi.onrender.com/listings)**

---

## 🛠️ Technologies Used

This project is built using the **MEN (MongoDB, Express, Node.js)** stack, along with several other modern web technologies.

### Frontend
- **HTML5 & CSS3:** For the structural foundation and styling of the web pages.
- **EJS (Embedded JavaScript):** A templating engine used to generate HTML markup with plain JavaScript.
- **Bootstrap 5:** For responsive design, pre-built components, and a mobile-first layout.
- **Mapbox GL JS:** Interactive, customizable maps integrated to show the exact location of the listings.

### Backend
- **Node.js:** JavaScript runtime environment for executing server-side code.
- **Express.js:** Fast, unopinionated, minimalist web framework for Node.js used for routing and handling HTTP requests.
- **RESTful APIs:** The backend is structured around REST architecture for handling CRUD operations.

### Database
- **MongoDB:** A NoSQL database used to store application data (users, listings, reviews).
- **Mongoose:** An Object Data Modeling (ODM) library for MongoDB and Node.js, providing a straight-forward, schema-based solution to model application data.
- **MongoDB Atlas:** Cloud database service used for hosting the MongoDB database in production.

### Authentication & Security
- **Passport.js:** Authentication middleware for Node.js.
- **passport-local & passport-local-mongoose:** Used for local authentication strategy (username and password).
- **Express Session:** For managing user sessions across different requests.
- **Joi:** Data validation library used to validate the schema for listings and reviews before saving them to the database.

### Storage & Additional Utilities
- **Cloudinary:** Cloud-based image and video management service used to store listing photos.
- **Multer & multer-storage-cloudinary:** Middleware for handling `multipart/form-data`, primarily used for uploading files (images) to Cloudinary.
- **Connect-Flash:** Middleware for flashing temporal messages to the user (e.g., success or error notifications).
- **Connect-Mongo:** MongoDB session store for Express, ensuring sessions are persisted in the database instead of memory.
- **Method-Override:** Allows the use of HTTP verbs such as PUT or DELETE in places where the client doesn't support it (like HTML forms).

---

## ✨ Features & Functionalities

Here is a breakdown of what you can do on Wanderlust:

### 1. User Authentication & Authorization
- **Sign Up / Log In:** Users can create a new account or log in securely using their credentials.
- **Session Management:** Once logged in, users stay authenticated across different pages thanks to secure sessions.
- **Protected Routes:** Certain actions (like creating a listing or leaving a review) are restricted to logged-in users only. A user can only edit or delete their *own* listings and reviews.

### 2. Listings Management (CRUD Operations)
- **View Listings:** Anyone can view the available travel listings on the home page.
- **View Details:** Users can click on a listing to see comprehensive details, including price, location, description, owner, and reviews.
- **Create Listing:** Authenticated users can create a new listing by providing details and uploading an image.
- **Edit/Delete Listing:** The owner of a listing can edit its details or permanently delete it.

### 3. Categories & Filtering
- Listings can be categorized into various types such as *Trending, Rooms, Iconic Cities, Mountains, Castles, Amazing Pools, Camping, Farms, Arctic, Domes, and Boats*.
- (If implemented) Users can filter the listings on the homepage based on these categories to find exactly what they are looking for.

### 4. Interactive Maps (Mapbox Integration)
- Every listing displays an interactive map powered by **Mapbox**.
- The server automatically performs forward geocoding (converting the text location into geographic coordinates) when a listing is created, and drops a pin on the map on the listing's detail page.

### 5. Review System
- **Leave a Review:** Logged-in users can leave a rating (1-5 stars) and a text review for any listing.
- **Delete Review:** Users have the authority to delete their own reviews.
- **Cascading Deletion:** If a listing is deleted, all the reviews associated with that listing are automatically removed from the database to prevent orphaned data.

### 6. Image Uploads (Cloudinary)
- When creating or editing a listing, users can upload image files directly from their device.
- Images are safely uploaded to **Cloudinary**, and the generated secure URL is stored in the MongoDB database, optimizing performance and storage.

### 7. Error Handling & Validation
- **Server-Side Validation:** All incoming data for listings and reviews is strictly validated using **Joi** before interacting with the database.
- **Flash Messages:** Users receive instant visual feedback (success/error alerts) for their actions, such as "Successfully created a new listing!" or "You must be logged in to do that."
- **Custom Error Pages:** Any application errors (like 404 Page Not Found or 500 Internal Server Error) are caught and presented on a customized, user-friendly error page.

---

## 💻 Running the Project Locally

If you'd like to clone and run this project on your local machine, follow these steps:

### Prerequisites
Make sure you have Node.js and MongoDB installed on your computer.

### 1. Clone the repository
```bash
git clone https://github.com/MaazShaikh845/Wanderlust.git
cd Wanderlust
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory of the project and add the following keys. You will need to get your own API credentials for Cloudinary and Mapbox.
```env
PORT=8080
SECRET=your_secret_key
ATLASDB_URL=your_mongodb_connection_string
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
MAP_TOKEN=your_mapbox_public_token
```

### 4. Start the server
```bash
node app.js
```
*Or, if you have nodemon installed:*
```bash
nodemon app.js
```

The application should now be running on `http://localhost:8080`.

---
*Created by [shaikhMaaz](https://github.com/MaazShaikh845)*
