# FoodHub API Documentation

## Base URL

http://localhost:8000/api


The FoodHub backend is a REST API built with Node.js, Express.js and MongoDB.

## Authentication

Protected APIs use JWT authentication. Send the token in the request header:


Authorization: Bearer <JWT_TOKEN>


### User Roles

 customer
 restaurantOwner
 deliveryPartner
 admin



# 1. Authentication APIs

## Register User

**POST** `/auth/register`

Authentication: Not required

### Request Body

```json
{
    "name": "Country Edu",
    "email": "you@gmail.com",
    "password": "123456",
    "phone": "9876543210",
    "role": "customer",
    "address": "Dehradun"
}
```

### Response

```json
{
    "message": "Registration successful",
    "token": "<JWT_TOKEN>",
    "user": {}
}
```

## Login

**POST** `/auth/login`

Authentication: Not required

### Request Body

```json
{
    "email": "you@gmail.com",
    "password": "123456"
}
```

### Response

```json
{
    "token": "<JWT_TOKEN>",
    "user": {}
}
```

## Get Current User

**GET** `/auth/me`

Authentication: Required

### Response

```json
{
    "data": {}
}
```

## Update Current User

**PUT** `/auth/me`

Authentication: Required

### Request Body

```json
{
    "name": "CountryEdu",
    "phone": "9876543210",
    "address": "Haryana"
}
```

### Response

```json
{
    "message": "Profile updated successfully",
    "user": {}
}
```

---

# 2. Restaurant APIs

## Get Restaurants

**GET** `/restaurants`

Authentication: Not required

### Query Parameters

- `search`
- `cuisine`
- `rating`
- `price`

Example:

```text
GET /restaurants?search=pizza
```

### Response

```json
{
    "data": []
}
```

## Get Cuisines

**GET** `/restaurants/cuisines`

Authentication: Not required

### Response

```json
{
    "data": []
}
```

## Get Restaurant By ID

**GET** `/restaurants/:id`

Authentication: Not required

Example:

```text
GET /restaurants/RESTAURANT_ID
```

### Response

```json
{
    "data": {}
}
```

## Get Restaurant Reviews

**GET** `/restaurants/:id/reviews`

Authentication: Not required

### Response

```json
{
    "data": []
}
```

## Get My Restaurant

**GET** `/restaurants/my-restaurant`

Authentication: Required

Role: `restaurantOwner`

### Response

```json
{
    "data": {}
}
```

## Create Restaurant

**POST** `/restaurants`

Authentication: Required

Role: `restaurantOwner`

### Request Body

```json
{
    "name": "Spice Garden",
    "description": "North Indian food",
    "address": "MG Road",
    "cuisine": "North Indian",
    "image": "https://example.com/restaurant.jpg"
}
```

### Response

```json
{
    "message": "Restaurant created successfully",
    "data": {}
}
```

## Update Restaurant

**PUT** `/restaurants/:id`

Authentication: Required

Role: `restaurantOwner`

### Request Body

```json
{
    "name": "Spice Garden",
    "description": "Updated description",
    "address": "Updated address",
    "cuisine": "North Indian",
    "image": "https://example.com/restaurant.jpg"
}
```

## Delete Restaurant

**DELETE** `/restaurants/:id`

Authentication: Required

Role: `restaurantOwner`

---

# 3. Category APIs

## Get Categories

**GET** `/categories`

Authentication: Required

### Query Parameter

```text
restaurant=RESTAURANT_ID
```

Example:

```text
GET /categories?restaurant=RESTAURANT_ID
```

### Response

```json
{
    "data": []
}
```

## Create Category

**POST** `/categories`

Authentication: Required

Role: `restaurantOwner`

### Request Body

```json
{
    "name": "Starters",
    "restaurant": "RESTAURANT_ID"
}
```

## Update Category

**PUT** `/categories/:id`

Authentication: Required

Role: `restaurantOwner`

### Request Body

```json
{
    "name": "Main Course"
}
```

## Delete Category

**DELETE** `/categories/:id`

Authentication: Required

Role: `restaurantOwner`

---

# 4. Food APIs

## Get Food Items

**GET** `/foods`

Authentication: Not required

### Query Parameters

- `restaurant`
- `category`
- `search`

Example:

```text
GET /foods?restaurant=RESTAURANT_ID
```

### Response

```json
{
    "data": []
}
```

## Get Food Item By ID

**GET** `/foods/:id`

Authentication: Not required

### Response

```json
{
    "data": {}
}
```

## Create Food Item

**POST** `/foods`

Authentication: Required

Role: `restaurantOwner`

### Request Body

```json
{
    "restaurant": "RESTAURANT_ID",
    "category": "CATEGORY_ID",
    "name": "Paneer Tikka",
    "description": "Paneer grilled with spices",
    "price": 220,
    "image": "https://example.com/food.jpg",
    "isAvailable": true
}
```

## Update Food Item

**PUT** `/foods/:id`

Authentication: Required

Role: `restaurantOwner`

### Request Body

```json
{
    "name": "Paneer Tikka",
    "description": "Updated description",
    "price": 240,
    "isAvailable": true
}
```

## Delete Food Item

**DELETE** `/foods/:id`

Authentication: Required

Role: `restaurantOwner`

---

# 5. Order APIs

All order APIs require JWT authentication.

## Place Order

**POST** `/orders`

Role: `customer`

### Request Body

```json
{
    "restaurant": "RESTAURANT_ID",
    "items": [
        {
            "foodItem": "FOOD_ID",
            "quantity": 2
        }
    ],
    "deliveryAddress": "Dehradun",
    "contactNumber": "9876543210",
    "paymentMethod": "Online"
}
```

`paymentMethod` is `Online` or `CashOnDelivery`.

### Response

```json
{
    "message": "Order placed successfully",
    "data": {}
}
```

## Get My Orders

**GET** `/orders/my-orders`

Role: `customer`

### Response

```json
{
    "data": []
}
```

## Get Restaurant Orders

**GET** `/orders/restaurant`

Role: `restaurantOwner`

### Query Parameter

```text
status=Placed
```

Example:

```text
GET /orders/restaurant?status=Placed
```

### Response

```json
{
    "data": []
}
```

## Get Restaurant Statistics

**GET** `/orders/restaurant/stats`

Role: `restaurantOwner`

### Response

```json
{
    "data": {
        "totalOrders": 0,
        "newOrders": 0,
        "activeOrders": 0,
        "deliveredOrders": 0,
        "cancelledOrders": 0,
        "totalRevenue": 0,
        "rating": 0,
        "reviewCount": 0
    }
}
```

## Get Available Deliveries

**GET** `/orders/delivery/available`

Role: `deliveryPartner`

### Response

```json
{
    "data": []
}
```

## Get My Deliveries

**GET** `/orders/delivery/my`

Role: `deliveryPartner`

### Query Parameter

```text
status=Delivered
```

## Accept Delivery

**PUT** `/orders/:id/accept-delivery`

Role: `deliveryPartner`

### Response

```json
{
    "message": "Delivery accepted",
    "data": {}
}
```

## Get Order By ID

**GET** `/orders/:id`

Authentication: Required

Access is checked for the customer, restaurant owner, assigned delivery partner and admin.

### Response

```json
{
    "data": {}
}
```

## Update Order Status

**PUT** `/orders/:id/status`

Authentication: Required

### Request Body

```json
{
    "status": "Accepted"
}
```

For cancellation:

```json
{
    "status": "Cancelled",
    "cancelReason": "Rejected by restaurant"
}
```

### Order Status Flow

Restaurant owner:


Placed -> Accepted -> Preparing -> ReadyForPickup


Delivery partner:


ReadyForPickup -> OutForDelivery -> Delivered


Customer can cancel from `Placed` or `Accepted`.

### Response

```json
{
    "message": "Order marked as Accepted",
    "data": {}
}
```

---

# 6. Payment APIs

## Process Payment

**POST** `/payments/process`

Authentication: Required

### Request Body

```json
{
    "orderId": "ORDER_ID",
    "paymentMethod": "Online"
}
```

### Response

```json
{
    "message": "Payment processed successfully",
    "data": {}
}
```

## Get Payment By Order

**GET** `/payments/order/:orderId`

Authentication: Required

### Response

```json
{
    "data": {}
}
```

---

# 7. Review APIs

## Create Review

**POST** `/reviews`

Authentication: Required

Role: `customer`

### Request Body

```json
{
    "restaurant": "RESTAURANT_ID",
    "order": "ORDER_ID",
    "rating": 5,
    "comment": "Food was very good."
}
```

### Response

```json
{
    "message": "Review added successfully",
    "data": {}
}
```

## Get My Reviews

**GET** `/reviews/my-reviews`

Authentication: Required

Role: `customer`

### Response

```json
{
    "data": []
}
```

## Get Restaurant Reviews

**GET** `/restaurants/:id/reviews`

Authentication: Not required

### Response

```json
{
    "data": []
}
```

---

# 8. Admin APIs

All admin APIs require authentication and the `admin` role.

## Get Admin Statistics

**GET** `/admin/stats`

### Response

```json
{
    "data": {}
}
```

## Get Users

**GET** `/admin/users`

### Response

```json
{
    "data": []
}
```

## Get Restaurants

**GET** `/admin/restaurants`

### Response

```json
{
    "data": []
}
```

## Get Orders

**GET** `/admin/orders`

### Response

```json
{
    "data": []
}
```

## Update Restaurant Status

**PUT** `/admin/restaurants/:id/status`

### Request Body

```json
{
    "isActive": false
}
```

## Update User Status

**PUT** `/admin/users/:id/status`

### Request Body

```json
{
    "isActive": false
}
```

---

# Common HTTP Status Codes

| Status | Meaning |
|---|---|
| 200 | Request successful |
| 201 | Resource created |
| 400 | Invalid request/data |
| 401 | Authentication required or invalid token |
| 403 | Access denied |
| 404 | Resource not found |
| 500 | Server error |

---

# API Route Summary

| Module | Method | Endpoint |
|---|---|---|
| Auth | POST | `/auth/register` |
| Auth | POST | `/auth/login` |
| Auth | GET | `/auth/me` |
| Auth | PUT | `/auth/me` |
| Restaurants | GET | `/restaurants` |
| Restaurants | GET | `/restaurants/cuisines` |
| Restaurants | GET | `/restaurants/:id` |
| Restaurants | GET | `/restaurants/:id/reviews` |
| Restaurants | GET | `/restaurants/my-restaurant` |
| Restaurants | POST | `/restaurants` |
| Restaurants | PUT | `/restaurants/:id` |
| Restaurants | DELETE | `/restaurants/:id` |
| Categories | GET | `/categories` |
| Categories | POST | `/categories` |
| Categories | PUT | `/categories/:id` |
| Categories | DELETE | `/categories/:id` |
| Foods | GET | `/foods` |
| Foods | GET | `/foods/:id` |
| Foods | POST | `/foods` |
| Foods | PUT | `/foods/:id` |
| Foods | DELETE | `/foods/:id` |
| Orders | POST | `/orders` |
| Orders | GET | `/orders/my-orders` |
| Orders | GET | `/orders/restaurant` |
| Orders | GET | `/orders/restaurant/stats` |
| Orders | GET | `/orders/delivery/available` |
| Orders | GET | `/orders/delivery/my` |
| Orders | PUT | `/orders/:id/accept-delivery` |
| Orders | GET | `/orders/:id` |
| Orders | PUT | `/orders/:id/status` |
| Payments | POST | `/payments/process` |
| Payments | GET | `/payments/order/:orderId` |
| Reviews | POST | `/reviews` |
| Reviews | GET | `/reviews/my-reviews` |
| Reviews | GET | `/restaurants/:id/reviews` |
| Admin | GET | `/admin/stats` |
| Admin | GET | `/admin/users` |
| Admin | GET | `/admin/restaurants` |
| Admin | GET | `/admin/orders` |
| Admin | PUT | `/admin/restaurants/:id/status` |
| Admin | PUT | `/admin/users/:id/status` |
