# FoodHub - Online Food Ordering System

FoodHub is a full-stack Online Food Ordering System built using the MERN stack.

The application allows customers to browse restaurants, view food items, add items to cart, place orders, make demo online payments, track orders and submit reviews.

The system also provides separate functionality for Restaurant Owners, Delivery Partners and Admin users.

---

## Features

### Customer

- User registration and login
- JWT authentication
- Update profile
- Browse restaurants
- Search restaurants
- Filter restaurants by cuisine and rating
- View restaurant details
- Browse food items
- Search and filter food items
- Add food items to cart
- Update cart quantity
- Remove items from cart
- Place orders
- Cash on Delivery
- Demo online payment
- View order history
- Track order status
- Cancel eligible orders
- Submit restaurant reviews
- View submitted reviews

### Restaurant Owner

- Restaurant owner registration and login
- Create restaurant
- Update restaurant
- Delete restaurant
- Manage restaurant profile
- Create food categories
- Update food categories
- Delete food categories
- Add food items
- Update food items
- Delete food items
- Update food availability
- View restaurant orders
- Filter orders by status
- Update order status
- View restaurant order statistics

### Delivery Partner

- Delivery partner registration and login
- View available deliveries
- Accept delivery
- View assigned deliveries
- Update delivery status
- Mark order as OutForDelivery
- Mark order as Delivered

### Admin

- Admin login
- View dashboard statistics
- View all users
- Filter users by role
- Activate/deactivate users
- View all restaurants
- Activate/deactivate restaurants
- View all orders
- Filter orders by status
- Manage platform data

---

## User Roles

### Customer

Customers can browse restaurants, order food, make payments, track orders and submit reviews.

### Restaurant Owner

Restaurant owners can manage their restaurant, categories, food items and restaurant orders.

### Delivery Partner

Delivery partners can accept available deliveries and update delivery status.

### Admin

Admin users can manage users, restaurants and orders.

---

## Technology Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- CORS

### API Testing

- Postman

### Database

- MongoDB Atlas

### Deployment

- Vercel - Frontend
- Render - Backend
- MongoDB Atlas - Database

---

## Project Structure

```text
FoodHub/
│
├── Backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   ├── foodController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   ├── restaurantController.js
│   │   └── reviewController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Restaurant.js
│   │   ├── Category.js
│   │   ├── FoodItem.js
│   │   ├── Order.js
│   │   ├── Payment.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── restaurantRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── foodRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── adminRoutes.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── FrontEnd/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── ER-Diagram.png
└── Postman_collection.json
├── Database-Schema.md   
├── API-Documentation.md
└── README.md
```

---

# Local Setup

## 1. Clone Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd FoodHub
```

## 2. Backend Setup

```bash
cd Backend
npm install
npm start
```

Backend URL:

```text
http://localhost:8000
```

API Base URL:

```text
http://localhost:8000/api
```

## 3. Frontend Setup

Open another terminal:

```bash
cd FrontEnd
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

# Environment Variables

Create a `.env` file inside the `Backend` folder.

Example:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Use the exact MongoDB environment variable name used by the backend configuration.

Do not commit the `.env` file to GitHub.

---

# MongoDB Atlas

MongoDB Atlas is used as the cloud database for deployment.

Create a MongoDB Atlas cluster and add its connection string to the backend environment variables.

Example:

```env
MONGO_URI=your_mongodb_atlas_connection_string
```

The database connection string must remain private.

---

# Authentication

FoodHub uses JWT authentication.

After login, the backend generates a JWT token.

Protected APIs require:

```text
Authorization: Bearer <JWT_TOKEN>
```

The frontend stores the token in local storage and sends it with protected API requests.

---

# Password Security

User passwords are hashed using `bcryptjs`.

Plain-text passwords are not stored in the database.

---

# API Documentation

Complete API documentation is available at:

```text
docs/API-Documentation.md
```

The documentation covers:

- Authentication
- Restaurants
- Categories
- Food Items
- Orders
- Payments
- Reviews
- Admin APIs

---

# Postman Testing

The Postman collection is available at:

```text
postman/FoodHub-API.postman_collection.json
```

Local API base URL:

```text
http://localhost:8000/api
```

The collection uses:

```text
{{baseUrl}}
```

for the API base URL.

Protected requests use:

```text
Bearer {{token}}
```

The collection also contains variables for:

```text
restaurantId
categoryId
foodId
orderId
userId
```

---

# Tested API Flow

The main application flow was tested using Postman.

```text
Customer Register
       ↓
Customer Login
       ↓
Get Profile
       ↓
Restaurant Owner Register/Login
       ↓
Create Restaurant
       ↓
Create Category
       ↓
Create Food
       ↓
Customer Places Order
       ↓
Process Demo Online Payment
       ↓
Restaurant Owner Receives Order
       ↓
Accepted
       ↓
Preparing
       ↓
ReadyForPickup
       ↓
Delivery Partner Login
       ↓
View Available Delivery
       ↓
Accept Delivery
       ↓
OutForDelivery
       ↓
Delivered
       ↓
Customer Submits Review
```

---

# Order Status Flow

```text
Placed
   ↓
Accepted
   ↓
Preparing
   ↓
ReadyForPickup
   ↓
OutForDelivery
   ↓
Delivered
```

Eligible orders can also be cancelled.

---

# Payment

FoodHub supports two payment methods.

### Cash on Delivery

```text
CashOnDelivery
```

### Online Payment

The project contains a demo online payment flow.

The payment API creates a payment record and updates the order payment status.

No real payment gateway is connected.

---

# Database

FoodHub uses MongoDB with Mongoose.

Main collections/models:

```text
Users
Restaurants
Categories
FoodItems
Orders
Payments
Reviews
```

Detailed database information is available in:

```text
docs/Database-Schema.md
```

---

# Database Relationships

```text
User 1 ---- N Restaurant
User 1 ---- N Order
User 1 ---- N Review

Restaurant 1 ---- N Category
Restaurant 1 ---- N FoodItem
Restaurant 1 ---- N Order
Restaurant 1 ---- N Review

Category 1 ---- N FoodItem

Order 1 ---- N OrderItem
Order 1 ---- 1 Payment
```

The complete ER diagram is available at:

```text
docs/ER-Diagram.png
```

---

# Validation and Error Handling

The application includes:

- Required field validation
- Mongoose schema validation
- JWT token validation
- Role-based authorization
- Protected routes
- API error handling middleware
- Restaurant availability validation
- Food availability validation
- Order status validation
- Invalid request handling

---

# Role Based Access

### Customer

- Browse restaurants
- Browse food
- Manage cart
- Place orders
- Make payments
- Track orders
- Cancel eligible orders
- Submit reviews

### Restaurant Owner

- Manage restaurant
- Manage categories
- Manage food items
- View restaurant orders
- Update order status
- View restaurant statistics

### Delivery Partner

- View available deliveries
- Accept deliveries
- View assigned deliveries
- Update delivery status

### Admin

- View statistics
- Manage users
- Manage restaurants
- Manage orders
- Update user status
- Update restaurant status

---

# Demo Credentials

These accounts are for demonstration/testing.

## Admin

```text
Email: admin@gmail.com
Password: 123456
Role: admin
```

## Customer

```text
Email: customer@gmail.com
Password: 123456
Role: customer
```

## Restaurant Owner

```text
Email: restaurant@gmail.com
Password: 123456
Role: restaurantOwner
```

```text
Email: savej@gmail.com
Password: 123456
Role: restaurantOwner
```

## Delivery Partner

```text
Email: delivery@gmail.com
Password: 123456
Role: deliveryPartner
```

### Important

These demo accounts must exist in the deployed MongoDB Atlas database.

The final project does not use the deleted seed script, so these accounts need to be created through the application/API before sharing the deployed demo credentials.

Do not use personal passwords or sensitive credentials.

---

# Deployment

FoodHub is designed for deployment using:

```text
Frontend  → Vercel
Backend   → Render
Database  → MongoDB Atlas
```

---

# MongoDB Atlas Deployment

1. Create a MongoDB Atlas account.
2. Create a cluster.
3. Create a database user.
4. Configure network access.
5. Copy the MongoDB connection string.
6. Add the connection string to the Render environment variables.

Example:

```env
MONGO_URI=your_mongodb_atlas_connection_string
```

---

# Backend Deployment - Render

Backend directory:

```text
Backend
```

Install command:

```bash
npm install
```

Start command:

```bash
npm start
```

Add these environment variables in Render:

```text
PORT
MONGO_URI
JWT_SECRET
```

After deployment, Render will provide a backend URL similar to:

```text
https://foodhub-backend.onrender.com
```

API Base URL:

```text
https://foodhub-backend.onrender.com/api
```

---

# Frontend Deployment - Vercel

Frontend directory:

```text
FrontEnd
```

Install command:

```bash
npm install
```

Build command:

```bash
npm run build
```

After deployment, Vercel will provide a frontend URL similar to:

```text
https://foodhub-frontend.vercel.app
```

---

# Frontend API URL After Deployment

Before deployment, the frontend uses:

```text
http://localhost:8000/api
```

Update:

```text
FrontEnd/src/services/api.js
```

to the deployed Render backend URL:

```js
baseURL: "https://YOUR-RENDER-BACKEND-URL.onrender.com/api"
```

Then build and deploy the frontend again on Vercel.

---

# CORS

The backend uses CORS middleware.

For production deployment, the backend should allow requests from the deployed Vercel frontend URL.

Example:

```text
https://your-foodhub.vercel.app
```

---

# Deployment URLs

## Frontend

```text
https://YOUR-FOODHUB-FRONTEND.vercel.app
```

## Backend

```text
https://YOUR-FOODHUB-BACKEND.onrender.com
```

## API

```text
https://YOUR-FOODHUB-BACKEND.onrender.com/api
```

## Database

```text
MongoDB Atlas
```

Replace the placeholder URLs after deployment.

---

# Running the Application

### Backend

```bash
cd Backend
npm install
npm start
```

### Frontend

```bash
cd FrontEnd
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

---

# Documentation Files

### API Documentation

```text
docs/API-Documentation.md
```

### Database Schema

```text
docs/Database-Schema.md
```

### ER Diagram

```text
docs/ER-Diagram.png
```

### Postman Collection

```text
postman/FoodHub-API.postman_collection.json
```

---

# Important Notes

- Do not upload `.env` to GitHub.
- Do not expose MongoDB Atlas credentials.
- Do not expose the JWT secret.
- The online payment feature is a demo implementation.
- MongoDB Atlas is used for the deployed database.
- Render is used for the backend.
- Vercel is used for the frontend.
- The frontend API URL must be changed from localhost to the Render backend URL after deployment.
- Demo accounts must exist in the deployed database before sharing their credentials.

---

# Future Improvements

- Real payment gateway integration
- Image upload
- Email notifications
- Real-time order tracking
- Location-based delivery tracking
- Advanced admin analytics
- Cloud image storage

---

# Project Documentation

```text
FoodHub/
│
├── docs/
│   ├── API-Documentation.md
│   ├── Database-Schema.md
│   └── ER-Diagram.png
│
├── postman/
│   └── FoodHub-API.postman_collection.json
│
└── README.md
```

---

## Author

FoodHub - Online Food Ordering System

Built using the MERN Stack.
