# FoodHub - Online Food Ordering System

FoodHub is a full-stack Online Food Ordering System built using the MERN stack.

The application allows customers to browse restaurants, view food items, add items to cart, place orders, make demo online payments, track orders and submit reviews.

The system also provides separate functionality for Restaurant Owners, Delivery Partners and Admin users.

---

## Features

### Customer

- User registration and login
- JWT authentication
- Browse and search restaurants
- Filter restaurants by cuisine and rating
- Browse and filter food items
- Add items to cart
- Place orders
- Cash on Delivery
- Demo online payment
- View and track orders
- Cancel eligible orders
- Submit restaurant reviews

### Restaurant Owner

- Create and manage restaurant
- Manage categories and food items
- Manage food availability
- View restaurant orders
- Update order status
- View restaurant statistics

### Delivery Partner

- View available deliveries
- Accept deliveries
- View assigned deliveries
- Update delivery status
- Mark orders as OutForDelivery and Delivered

### Admin

- View dashboard statistics
- Manage users
- Manage restaurants
- Manage orders
- Activate/deactivate users and restaurants

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

### Other

- Postman
- Docker
- MongoDB Atlas
- Vercel
- Render

---

## Project Structure

```text
FoodHub/
│
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   └── server.js
│
├── FrontEnd/
│   ├── src/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── .dockerignore
│   ├── package.json
│   └── vite.config.js
│
├── ER-Diagram.png
├── Postman_collection.json
├── Database-Schema.md
├── API-Documentation.md
├── docker-compose.yml
└── README.md
```

## Local Setup

### Backend

```bash
cd Backend
npm install
npm start
```

Backend:

```text
http://localhost:8000
```

### Frontend

Open another terminal:

```bash
cd FrontEnd
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## Environment Variables

Create a `.env` file inside the `Backend` folder.

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Do not commit the `.env` file to GitHub.

---

## Authentication

FoodHub uses JWT authentication.

Protected APIs require:

```text
Authorization: Bearer <JWT_TOKEN>
```

Passwords are hashed using `bcryptjs`.

---

## API Documentation

Complete API documentation:

```text
docs/API-Documentation.md
```

The documentation covers authentication, restaurants, categories, food items, orders, payments, reviews and admin APIs.

---

## Postman

Postman collection:

```text
postman/FoodHub-API.postman_collection.json
```

The main API flow was tested using Postman.

---

## Database

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

Detailed schema:

```text
docs/Database-Schema.md
```

ER diagram:

```text
docs/ER-Diagram.png
```

---

## Order Status Flow

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

Orders can also be cancelled when eligible.

---

## Payment

FoodHub supports:

- Cash on Delivery
- Demo online payment

No real payment gateway is connected.

---

## Docker

Docker is included for running the frontend and backend as containers.

Build and start the application:

```bash
docker compose up --build
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:8000
```

MongoDB is hosted on MongoDB Atlas.

---

## Deployment

```text
Frontend  → Vercel
Backend   → Render
Database  → MongoDB Atlas
```

### Frontend

```text
https://food-ordering-restaurant-management.vercel.app
```

### Backend

```text
https://foodhub-backend-kg38.onrender.com
```

### API

```text
https://foodhub-backend-kg38.onrender.com/api
```

---

## Demo Credentials

All demo accounts use the password:

```text
123456
```

### Admin

```text
Email: admin@gmail.com
Role: admin
```

### Customer

```text
Email: customer@gmail.com
Role: customer
```

### Restaurant Owner

```text
Email: restaurant@gmail.com
Role: restaurantOwner
```

### Delivery Partner

```text
Email: delivery@gmail.com
Role: deliveryPartner
```

---

## Important Notes

- Do not upload `.env` to GitHub.
- Do not expose MongoDB Atlas credentials or JWT secret.
- Online payment is a demo implementation.
- MongoDB Atlas is used for the deployed database.
- Render is used for the backend.
- Vercel is used for the frontend.
- Docker is included for local containerized setup.

---

## Author

FoodHub - Online Food Ordering System

Built using the MERN Stack.
