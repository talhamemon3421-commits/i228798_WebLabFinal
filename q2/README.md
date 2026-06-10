# 📚 Library Management System — Backend API

A role-based Library Management System RESTful API built with **Node.js**, **Express.js**, and **MongoDB (Mongoose)**. Features JWT-based authentication, role-based authorization, and a clean MVC architecture.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (running locally or a cloud instance like MongoDB Atlas)

### Installation

1. **Clone the repository** and navigate to the project directory:
   ```bash
   cd library-management-system
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update `.env` with your MongoDB URI and a JWT secret:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/library_management
     JWT_SECRET=your_secret_key_here
     JWT_EXPIRES_IN=24h
     ```

4. **Seed the database** with Admin & Librarian accounts:
   ```bash
   npm run seed
   ```

5. **(Optional) Seed dummy data** for testing:
   ```bash
   npm run seed:data
   ```

6. **Start the server**:
   ```bash
   npm start
   ```

   The server runs on **http://localhost:5000**.

---

## 👤 Pre-Seeded Accounts

After running `npm run seed`, the following accounts are available:

| Role       | Email                    | Password     |
|------------|--------------------------|--------------|
| Admin      | admin@library.com        | Admin@1234   |
| Librarian  | librarian@library.com    | Lib@1234     |

### Creating New Accounts

- **Members**: Register via `POST /api/auth/register` (public endpoint).
- **Librarians/Admins**: These roles can only be created directly in the database or via the seed script. Public registration always creates a `member` account.

### Dummy Test Members (after running `npm run seed:data`)

| Name          | Email                     | Password     |
|---------------|---------------------------|--------------|
| Ali Hassan    | ali.hassan@email.com      | Member@123   |
| Sara Ahmed    | sara.ahmed@email.com      | Member@123   |
| Usman Khan    | usman.khan@email.com      | Member@123   |
| Fatima Zahra  | fatima.zahra@email.com    | Member@123   |
| Bilal Tariq   | bilal.tariq@email.com     | Member@123   |

---

## 📋 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint             | Access         | Description             |
|--------|----------------------|----------------|-------------------------|
| POST   | `/api/auth/register` | Public         | Register a new member   |
| POST   | `/api/auth/login`    | Public         | Login (returns JWT)     |
| GET    | `/api/auth/profile`  | All Auth Users | Get own profile         |
| PATCH  | `/api/auth/profile`  | All Auth Users | Update own profile      |

### Books (`/api/books`)

| Method | Endpoint     | Access         | Description                                           |
|--------|--------------|----------------|-------------------------------------------------------|
| GET    | `/api/books` | All Auth Users | Browse/search books (query: `title`, `author`, `genre`) |

### Borrowing (`/api/borrow`)

| Method | Endpoint                 | Access           | Description              |
|--------|--------------------------|------------------|--------------------------|
| POST   | `/api/borrow`            | Member           | Borrow a book            |
| GET    | `/api/borrow`            | Member           | View own borrow history  |
| PATCH  | `/api/borrow/:id/return` | Member           | Return a borrowed book   |
| PATCH  | `/api/borrow/:id/renew`  | Member           | Renew borrowing (+14 days) |
| GET    | `/api/borrow/overdue`    | Librarian, Admin | View overdue borrowings  |

### Catalog Management (`/api/catalog`)

| Method | Endpoint          | Access           | Description         |
|--------|-------------------|------------------|---------------------|
| POST   | `/api/catalog`    | Librarian, Admin | Add a new book      |
| PATCH  | `/api/catalog/:id`| Librarian, Admin | Update book details |
| DELETE | `/api/catalog/:id`| Admin only       | Delete a book       |

### Member Management (`/api/members`)

| Method | Endpoint                   | Access           | Description                  |
|--------|----------------------------|------------------|------------------------------|
| GET    | `/api/members`             | Librarian, Admin | View all members             |
| PATCH  | `/api/members/:id/status`  | Admin only       | Suspend/activate a member    |

---

## 🔐 Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

### Login Example

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@library.com", "password": "Admin@1234"}'
```

Response:
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": {
      "id": "...",
      "name": "System Admin",
      "email": "admin@library.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

## 🏗️ Project Structure (MVC)

```
library-management-system/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── authController.js      # Auth logic (login, register, profile)
│   ├── bookController.js      # Book browsing/search
│   ├── borrowController.js    # Borrow, return, renew logic
│   ├── catalogController.js   # Catalog CRUD operations
│   └── memberController.js    # Member management
├── middleware/
│   ├── auth.js                # JWT verification
│   ├── authorize.js           # Role-based access control
│   ├── validate.js            # Input validation
│   └── errorHandler.js        # Global error handler
├── models/
│   ├── User.js                # User schema
│   ├── Book.js                # Book schema
│   └── Borrow.js              # Borrow record schema
├── routes/
│   ├── authRoutes.js          # /api/auth/*
│   ├── bookRoutes.js          # /api/books
│   ├── borrowRoutes.js        # /api/borrow/*
│   ├── catalogRoutes.js       # /api/catalog/*
│   └── memberRoutes.js        # /api/members/*
├── seed.js                    # Seeds admin & librarian
├── seedData.js                # Seeds test data
├── server.js                  # App entry point
├── .env.example               # Environment template
├── package.json
└── README.md
```

---

## ⚠️ Error Responses

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Description of what went wrong",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

| Status Code | Meaning                          |
|-------------|----------------------------------|
| 400         | Bad Request / Validation Error   |
| 401         | Unauthorized (missing/bad token) |
| 403         | Forbidden (insufficient role)    |
| 404         | Resource not found               |
| 500         | Internal Server Error            |

---

## 📦 Dependencies

| Package            | Purpose                          |
|--------------------|----------------------------------|
| express            | Web framework                    |
| mongoose           | MongoDB ODM                      |
| bcryptjs           | Password hashing                 |
| jsonwebtoken       | JWT token generation/verification|
| express-validator  | Input validation                 |
| dotenv             | Environment variable management  |
| cors               | Cross-origin resource sharing    |
| morgan             | HTTP request logger              |
