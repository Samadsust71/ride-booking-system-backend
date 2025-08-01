# 🚗 Ride Booking System Backend

A secure, scalable, and modular **backend API** for a ride booking system inspired by platforms like Uber and Pathao. Built with **Node.js**, **Express.js**, **MongoDB**, and **TypeScript**.

🌐 **Live API**: [https://ride-booking-system-backend-blond.vercel.app](https://ride-booking-system-backend-blond.vercel.app)

---

## 📂 Project Structure

```
src/
├── app/
│   ├── config/
│   ├── errorHelpers/
│   ├── middlewares/
│   ├── modules/
│   │   ├── auth/
│   │   ├── user/
│   │   ├── driver/
│   │   ├── ride/
│   │   ├── admin/
│   ├── utils/
│   └── routes/
├── app.ts
└── server.ts

```

---

## 🚀 Features

- 🔐 JWT-based authentication (access & refresh tokens)
- 🎭 Role-based authorization (`RIDER`, `DRIVER`, `ADMIN`, `SUPER_ADMIN`)
- 🛣️ Ride lifecycle: request → accept/reject → transit → complete
- 🌍 Geo-based driver search (with LocationIQ)
- 💰 Earnings tracking for drivers
- ⭐ Feedback and rating system
- 📈 Admin analytics with top drivers
- ✅ Modular, testable and scalable architecture

---

## ⚙️ .env.example

```env
PORT = 5000
DB_URL = your mongo db cluster uri
NODE_ENV = development

# JWT secrets and expiration
JWT_ACCESS_SECRET = your jwt access secret
JWT_REFRESH_SECRET = your jwt refresh secret
ACCESS_EXPIRES_IN = 1D(as example)
REFRESH_EXPIRES_IN = 7D(as example)
SALT_VALUE = 5(as example)

# Google Auth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://ride-booking-system-backend-blond.vercel.app/api/v1/auth/google/callback 

# Express session
EXPRESS_SESSION_SECRET=your_express_session_secret

# Frontend URL
FRONTEND_URL=http://localhost:5173

# LocationIQ API
LOCATIONIQ_API_KEY=your_locationiq_api_key
```

---

## 🔌 API Base URL

```
https://ride-booking-system-backend-blond.vercel.app/api/v1
```

---

## 📭 API Testing with Postman

You can test all the backend API routes using the provided Postman collection.

**🗂 File:** [`Ride Booking System.postman_collection.json`](./Ride%20Booking%20System.postman_collection.json)

### 🔧 How to Use

1. Open [Postman](https://www.postman.com/).
2. Click on `Import` in the top-left corner.
3. Select the `Ride Booking System.postman_collection.json` file.
4. Set your environment variables such as:
   - `base_url` → `https://ride-booking-system-backend-blond.vercel.app` *(or your local URL)*
   - `accessToken` → Your JWT access token after login
5. Start testing each route directly!

This collection includes:
- Authentication flows
- Rider, Driver, and Admin route testing
- Real examples for ride requests, feedback, and admin reports

---

## 🔑 Auth Routes

| Method | Endpoint           | Description         |
|--------|--------------------|---------------------|
| POST   | `/auth/login`      | Login with credentials |
| POST   | `/auth/refresh-token` | Refresh access token |
| POST   | `/auth/logout`     | Logout user         |

---

## 👤 User Routes

| Method | Endpoint             | Access          | Description         |
|--------|----------------------|------------------|---------------------|
| POST   | `/users/register`    | Public           | Register user       |
| GET    | `/users/all-users`   | ADMIN            | Get all users       |
| PATCH  | `/users/:id`         | Authenticated    | Update user         |

---

## 🚘 Ride Routes

| Method | Endpoint                 | Role     | Description                  |
|--------|--------------------------|----------|------------------------------|
| POST   | `/rides/request`         | RIDER    | Request a new ride           |
| GET    | `/rides/me`              | RIDER    | View rider’s ride history    |
| POST   | `/rides/nearby-drivers`  | RIDER    | Find nearby drivers (3 km)   |
| GET    | `/rides/:id`             | RIDER    | Get single ride details      |
| PATCH  | `/rides/:id/cancel`      | RIDER    | Cancel requested ride        |
| PATCH  | `/rides/:id/feedback`    | RIDER    | Submit feedback and rating   |

---

## 🧍‍♂️ Driver Routes

| Method | Endpoint                  | Role     | Description                |
|--------|---------------------------|----------|----------------------------|
| POST   | `/drivers/apply-driver`   | RIDER    | Apply to become a driver   |
| GET    | `/drivers/available-rides` | DRIVER  | Get ride requests          |
| GET    | `/drivers/earing-history` | DRIVER   | View driver earnings       |
| PATCH  | `/drivers/:id/accept`     | DRIVER   | Accept a ride              |
| PATCH  | `/drivers/:id/reject`     | DRIVER   | Reject a ride              |
| PATCH  | `/drivers/:id/status`     | DRIVER   | Update ride status         |

---

## 🛡️ Admin Routes

| Method | Endpoint                      | Role         | Description                 |
|--------|-------------------------------|--------------|-----------------------------|
| GET    | `/admin/users`                | ADMIN        | View all users              |
| GET    | `/admin/drivers`              | ADMIN        | View all drivers            |
| GET    | `/admin/rides`                | ADMIN        | View all rides              |
| GET    | `/admin/report`               | ADMIN        | View system report          |
| PATCH  | `/admin/driver/approve/:id`   | ADMIN        | Approve driver              |
| PATCH  | `/admin/driver/suspend/:id`   | ADMIN        | Suspend driver              |
| PATCH  | `/admin/user/block/:id`       | ADMIN        | Block user                  |
| PATCH  | `/admin/user/unblock/:id`     | ADMIN        | Unblock user                |

---

## 🗺️ Geo-based Driver Search

> Uses LocationIQ API to convert address → coordinates → search nearby drivers.

**Endpoint:** `POST /api/v1/rides/nearby-drivers`

```json
{
  "address": "Uttara, Dhaka"
}
```

**Returns:** List of nearby online & approved drivers within 3 km.

---

## ⭐ Feedback & Ratings

After ride is `COMPLETED`, a rider can rate and give feedback:

**Endpoint:** `PATCH /api/v1/rides/:id/feedback`

```json
{
  "rating": 4,
  "feedback": "Very professional and friendly."
}
```

---

## 📊 Admin Report Sample Response

```json
{
  "totalUsers": 20,
  "totalDrivers": 5,
  "totalRides": 35,
  "totalCompletedRides": 30,
  "totalOngoingRides": 2,
  "totalEarnings": 5320,
  "topFiveDrivers": [
    {
      "driverId": "abc123",
      "name": "John Doe",
      "email": "john@example.com",
      "avgRating": 4.7,
      "totalRides": 12
    }
  ]
}
```

---


## ✨ Author

**Samad Reza**  
[GitHub Profile](https://github.com/Samadsust71)

Feel free to ⭐️ this repo and contribute!