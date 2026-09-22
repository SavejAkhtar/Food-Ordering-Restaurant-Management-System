# FoodHub Client

React frontend for the Online Food Ordering & Restaurant Management System.
The complete project documentation (features, API list, demo credentials, order lifecycle) is in
`../Backend/README.md`.

## Setup

```bash
npm install
```

Create a `.env` file (copy `.env.example`) and point it at your running API:

```
VITE_API_URL=http://localhost:5000/api
```

## Run

```bash
npm run dev
```

The app starts on http://localhost:5173. The backend must be running on port 5000 first.

```bash
npm run build
```

## Pages

| Route | Access |
|---|---|
| `/` | Public home page with search |
| `/login`, `/register` | Public |
| `/restaurants` | Public – restaurant and dish search with filters |
| `/restaurants/:id` | Public – menu by category and reviews |
| `/cart`, `/checkout` | Customer |
| `/orders`, `/orders/:id` | Customer (order detail is also visible to the restaurant owner, assigned delivery partner and admin) |
| `/profile` | Any logged in user |
| `/restaurant/dashboard`, `/restaurant/menu`, `/restaurant/orders`, `/restaurant/profile` | Restaurant Owner |
| `/delivery/dashboard`, `/delivery/orders`, `/delivery/history` | Delivery Partner |
| `/admin/dashboard`, `/admin/users`, `/admin/restaurants`, `/admin/orders` | Admin |

## How it is wired

- `src/services/api.js` – one Axios instance, reads the base URL from `VITE_API_URL` and attaches the
  JWT from `localStorage` to every request.
- `src/context/AuthContext.jsx` – keeps the logged in user, restores the session with `GET /auth/me`.
- `src/context/CartContext.jsx` – cart state saved in `localStorage`, allows items from only one
  restaurant at a time.
- `src/components/ProtectedRoute.jsx` – blocks routes by login state and by role.
