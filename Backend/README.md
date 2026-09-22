# Online Food Ordering & Restaurant Management System

A full stack MERN application where customers browse restaurants and order food, restaurant owners
manage their menu and incoming orders, delivery partners handle deliveries, and an admin manages the
whole platform. Every feature is connected end to end: React → Axios → Express → MongoDB.

The project is split into two folders:

```
Backend/    Node.js + Express + MongoDB REST API
FrontEnd/   React (Vite) client application
```

---

## Features

### Customer
- Register and login
- Browse restaurants, search by name or cuisine, filter by cuisine and rating
- Search dishes by name and filter by price range
- View restaurant details, menu by category and search inside the menu
- Add items to cart, change quantity, remove items (one restaurant per cart)
- Checkout with delivery address and contact number
- Mock online payment or cash on delivery
- Track order status step by step
- View order history and order details
- Rate and review a restaurant after the order is delivered
- View and update profile

### Restaurant Owner
- Login and view dashboard statistics (new, active, delivered, cancelled orders, revenue, rating)
- Create and update restaurant information
- Manage food categories
- Add, edit and delete food items
- Mark food items available or unavailable
- View incoming orders with customer and payment details
- Accept or reject orders
- Update status: Preparing → Ready For Pickup

### Delivery Partner
- Login and see all orders that are ready for pickup
- Accept a delivery
- View restaurant pickup details and customer delivery details
- Mark order as picked up / out for delivery
- Mark order as delivered
- View delivery history

### Admin
- Login and view platform statistics
- View customers, restaurant owners and delivery partners
- Activate or deactivate users
- View all restaurants and activate or deactivate them
- View all orders with status filter

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router, Axios, Tailwind CSS, Vite |
| Backend | Node.js, Express 5 |
| Database | MongoDB with Mongoose |
| Auth | JWT + bcryptjs |
| Payment | Mock payment API (no real gateway) |

---

## Project Structure

```
Backend/
├── config/
│   └── db.js                     MongoDB connection
├── controllers/
│   ├── authController.js
│   ├── restaurantController.js
│   ├── categoryController.js
│   ├── foodController.js
│   ├── orderController.js
│   ├── paymentController.js
│   ├── reviewController.js
│   └── adminController.js
├── middleware/
│   ├── authMiddleware.js         authenticateUser, authorizeRoles
│   └── errorMiddleware.js        notFound, errorHandler
├── models/
│   ├── User.js
│   ├── Restaurant.js
│   ├── Category.js
│   ├── FoodItem.js
│   ├── Order.js
│   ├── Payment.js
│   └── Review.js
├── routes/
│   ├── authRoutes.js
│   ├── restaurantRoutes.js
│   ├── categoryRoutes.js
│   ├── foodRoutes.js
│   ├── orderRoutes.js
│   ├── paymentRoutes.js
│   ├── reviewRoutes.js
│   └── adminRoutes.js
├── seed/
│   └── seedData.js               demo users, restaurants, menus, orders
├── .env
├── .env.example
├── server.js
└── package.json

FrontEnd/
├── src/
│   ├── components/               Navbar, Layout, ProtectedRoute, cards, managers
│   ├── context/                  AuthContext, CartContext
│   ├── pages/
│   │   ├── Home.jsx, Login.jsx, Register.jsx, Restaurants.jsx,
│   │   │   RestaurantDetail.jsx, Profile.jsx
│   │   ├── customer/             Cart, Checkout, MyOrders, OrderDetail
│   │   ├── restaurant/           Dashboard, Menu, Orders, RestaurantProfile
│   │   ├── delivery/             Dashboard, MyDeliveries, History
│   │   └── admin/                Dashboard, Users, Restaurants, Orders
│   ├── services/
│   │   └── api.js                Axios instance with JWT interceptor
│   ├── utils/
│   │   └── helpers.js            formatting, status labels, error messages
│   ├── App.jsx                   all routes
│   ├── main.jsx
│   └── index.css
├── .env
├── .env.example
└── package.json
```

---

## MongoDB Setup

The project works with a local MongoDB or with MongoDB Atlas.

**Local MongoDB**

1. Install MongoDB Community Server and make sure the service is running.
2. Use this connection string in `Backend/.env`:

```
MONGODB_URI=mongodb://127.0.0.1:27017/food_ordering
```

**MongoDB Atlas**

1. Create a free cluster and a database user.
2. Allow access from your IP address.
3. Copy the connection string into `Backend/.env`:

```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/food_ordering
```

The database and all collections are created automatically on the first run.

---

## Environment Variables

**Backend/.env**

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/food_ordering
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
SEED_PASSWORD=123456
```

**FrontEnd/.env**

```
VITE_API_URL=http://localhost:5000/api
```

Both folders contain a `.env.example` file. Copy it to `.env` and fill in your own values.
Do not commit the real `.env` file.

---

## Installation

```bash
cd Backend
npm install
```

```bash
cd FrontEnd
npm install
```

---

## Seed Data

Load demo users, restaurants, menus and sample orders:

```bash
cd Backend
npm run seed
```

The seed script clears the existing collections and inserts:

- 1 admin
- 2 customers
- 3 restaurant owners
- 2 delivery partners
- 3 restaurants with categories and food items
- 3 sample orders (one Delivered with a review, one Placed, one Ready For Pickup)

---

## Start the Application

**Backend** (runs on http://localhost:5000)

```bash
cd Backend
npm run dev
```

**Frontend** (runs on http://localhost:5173)

```bash
cd FrontEnd
npm run dev
```

---

## Demo Credentials

All demo accounts use the password **123456** (set by `SEED_PASSWORD` in `Backend/.env`).

| Role | Email |
|---|---|
| Admin | admin@example.com |
| Customer | customer@example.com |
| Customer 2 | customer2@example.com |
| Restaurant Owner (Spice Garden) | restaurant@example.com |
| Restaurant Owner (Pizza Point) | restaurant2@example.com |
| Restaurant Owner (Wok Express) | restaurant3@example.com |
| Delivery Partner | delivery@example.com |
| Delivery Partner 2 | delivery2@example.com |

---

## Order Lifecycle

```
Placed → Accepted → Preparing → ReadyForPickup → OutForDelivery → Delivered
```

`Cancelled` is allowed only while the order is still `Placed` or `Accepted`.

Who can change what:

| Role | Allowed change |
|---|---|
| Customer | Placed/Accepted → Cancelled |
| Restaurant Owner | Placed → Accepted or Cancelled, Accepted → Preparing, Preparing → ReadyForPickup |
| Delivery Partner | ReadyForPickup → OutForDelivery, OutForDelivery → Delivered |
| Admin | Placed/Accepted/Preparing → Cancelled |

Any other transition is rejected by the API with status 400.

---

## Payment

There is **no real payment gateway** in this project. `POST /api/payments/process` is a mock
endpoint: it validates the order, generates a transaction id, saves a `Payment` document and marks
the order as paid.

Response:

```json
{
  "success": true,
  "transactionId": "TXN-482913",
  "status": "Paid",
  "message": "Payment successful"
}
```

---

## API Overview

Protected routes need the header `Authorization: Bearer <token>`.

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a customer, restaurant owner or delivery partner |
| POST | `/api/auth/login` | Public | Login and receive a JWT |
| GET | `/api/auth/me` | Logged in | Current user profile |
| PUT | `/api/auth/me` | Logged in | Update name, phone, address |

### Restaurants
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/restaurants` | Public | List active restaurants (`search`, `cuisine`, `minRating`) |
| GET | `/api/restaurants/cuisines` | Public | Cuisine list for the filter dropdown |
| GET | `/api/restaurants/:id` | Public | Restaurant details |
| GET | `/api/restaurants/:id/reviews` | Public | Reviews of a restaurant |
| GET | `/api/restaurants/my-restaurant` | Owner | The logged in owner's restaurant |
| POST | `/api/restaurants` | Owner | Create restaurant (one per owner) |
| PUT | `/api/restaurants/:id` | Owner, Admin | Update restaurant |
| DELETE | `/api/restaurants/:id` | Owner, Admin | Delete restaurant with its menu |

### Categories
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/categories?restaurant=<id>` | Public | Categories of a restaurant |
| POST | `/api/categories` | Owner | Create a category |
| PUT | `/api/categories/:id` | Owner | Rename a category |
| DELETE | `/api/categories/:id` | Owner | Delete an empty category |

### Food Items
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/foods` | Public | Filters: `restaurant`, `category`, `search`, `minPrice`, `maxPrice`, `available` |
| GET | `/api/foods/:id` | Public | Single food item |
| POST | `/api/foods` | Owner | Add food item |
| PUT | `/api/foods/:id` | Owner | Edit food item or toggle availability |
| DELETE | `/api/foods/:id` | Owner | Delete food item |

### Orders
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/orders` | Customer | Place an order (prices are taken from the database, not the client) |
| GET | `/api/orders/my-orders` | Customer | Order history |
| GET | `/api/orders/:id` | Owner of the data | Order details |
| PUT | `/api/orders/:id/status` | Role based | Update order status |
| GET | `/api/orders/restaurant` | Owner | Orders of the owner's restaurant (`status` filter) |
| GET | `/api/orders/restaurant/stats` | Owner | Dashboard statistics |
| GET | `/api/orders/delivery/available` | Delivery | Orders ready for pickup and unassigned |
| GET | `/api/orders/delivery/my` | Delivery | Own deliveries (`status` filter) |
| PUT | `/api/orders/:id/accept-delivery` | Delivery | Assign the order to yourself |

### Payments
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/payments/process` | Customer | Mock payment for an order |
| GET | `/api/payments/order/:orderId` | Customer, Admin | Payment record of an order |

### Reviews
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/reviews` | Customer | Review a delivered order (one review per order) |
| GET | `/api/reviews/my-reviews` | Customer | Own reviews |

### Admin
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/admin/stats` | Admin | Platform statistics |
| GET | `/api/admin/users?role=` | Admin | Users, optionally filtered by role |
| GET | `/api/admin/restaurants` | Admin | All restaurants with owner details |
| GET | `/api/admin/orders?status=` | Admin | All orders |
| PUT | `/api/admin/restaurants/:id/status` | Admin | Activate or deactivate a restaurant |
| PUT | `/api/admin/users/:id/status` | Admin | Activate or deactivate a user |

---

## Error Handling

The API returns proper HTTP status codes with a readable `message`:

| Code | Meaning |
|---|---|
| 400 | Validation error or an invalid action |
| 401 | Missing, invalid or expired token / wrong credentials |
| 403 | Logged in but not allowed for this role or resource |
| 404 | Record or route not found |
| 500 | Unexpected server error (details stay in the server log) |

The frontend reads `error.response.data.message` and shows it in the page instead of failing
silently.

---

## Demo Flow

1. Login as `customer@example.com` → open a restaurant → add dishes to the cart.
2. Go to the cart → **Proceed to Checkout** → confirm address → **Place Order** (mock payment runs).
3. Login as that restaurant's owner (`restaurant@example.com`) → **Orders** → Accept → Start
   Preparing → Mark Ready For Pickup.
4. Login as `delivery@example.com` → **Available Orders** → Accept Delivery → **My Deliveries** →
   Picked Up → Mark As Delivered.
5. Login as the customer again → **My Orders** → open the order → give a rating and review.
6. Login as `admin@example.com` → dashboard, users, restaurants and all orders.
