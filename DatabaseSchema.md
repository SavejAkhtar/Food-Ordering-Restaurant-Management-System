# FoodHub Database Schema

Database: MongoDB

## 1. User

- _id: ObjectId
- name: String
- email: String
- password: String
- phone: String
- role: String
- address: String
- isActive: Boolean
- createdAt: Date
- updatedAt: Date


## 2. Restaurant

- _id: ObjectId
- name: String
- description: String
- address: String
- owner: ObjectId → User
- image: String
- cuisine: String
- rating: Number
- reviewCount: Number
- isActive: Boolean
- createdAt: Date
- updatedAt: Date


## 3. Category

- _id: ObjectId
- name: String
- restaurant: ObjectId → Restaurant
- createdAt: Date
- updatedAt: Date


## 4. FoodItem

- _id: ObjectId
- restaurant: ObjectId → Restaurant
- category: ObjectId → Category
- name: String
- description: String
- price: Number
- image: String
- isAvailable: Boolean
- createdAt: Date
- updatedAt: Date


## 5. Order

- _id: ObjectId
- customer: ObjectId → User
- restaurant: ObjectId → Restaurant
- items: Array
- subtotal: Number
- deliveryFee: Number
- totalAmount: Number
- deliveryAddress: String
- contactNumber: String
- paymentMethod: String
- paymentStatus: String
- orderStatus: String
- deliveryPartner: ObjectId → User
- cancelReason: String
- isReviewed: Boolean
- createdAt: Date
- updatedAt: Date

### Order Item

- foodItem: ObjectId
- name: String
- price: Number
- quantity: Number


## 6. Payment

- _id: ObjectId
- order: ObjectId → Order
- customer: ObjectId → User
- amount: Number
- paymentMethod: String
- transactionId: String
- status: String
- createdAt: Date
- updatedAt: Date


## 7. Review

- _id: ObjectId
- customer: ObjectId → User
- restaurant: ObjectId → Restaurant
- order: ObjectId → Order
- rating: Number
- comment: String
- createdAt: Date
- updatedAt: Date