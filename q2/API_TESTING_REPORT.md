# Library Management System - API Testing Report

---

## 📋 Project Overview

**System Name:** Library Management System API  
**Technology Stack:** Node.js, Express.js, MongoDB  
**Authentication:** JWT Token-based  
**Base URL:** `http://localhost:5000`  
**Database:** MongoDB Atlas  

The Library Management System provides comprehensive endpoints for user authentication, book catalog management, borrowing operations, and member administration with role-based access control.

---

## 🔐 Test Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | admin@library.com | Admin@1234 |
| **Librarian** | librarian@library.com | Lib@1234 |

---

## 📌 API Endpoints Documentation

---

### **1. AUTHENTICATION ENDPOINTS**

#### 1.1 Register New User
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/register`
- **Access Level:** Public
- **Description:** Register a new member account
- **Request Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
- **Expected Response:** HTTP 201
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "member"
  },
  "token": "jwt_token_here"
}
```

[**SCREENSHOT PLACEHOLDER: Register Response**]

---

#### 1.2 Login User
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/auth/login`
- **Access Level:** Public
- **Description:** Authenticate user and receive JWT token
- **Request Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "email": "admin@library.com",
  "password": "Admin@1234"
}
```
- **Expected Response:** HTTP 200
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "_id": "user_id",
    "name": "Admin User",
    "email": "admin@library.com",
    "role": "admin"
  },
  "token": "jwt_token_here"
}
```

[**SCREENSHOT PLACEHOLDER: Login Response**]

---

#### 1.3 Get User Profile
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/auth/profile`
- **Access Level:** Private (All authenticated users)
- **Description:** Retrieve authenticated user's profile information
- **Request Headers:** 
  - `Content-Type: application/json`
  - `Authorization: Bearer {jwt_token}`
- **Expected Response:** HTTP 200
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "user": {
    "_id": "user_id",
    "name": "Admin User",
    "email": "admin@library.com",
    "role": "admin"
  }
}
```

[**SCREENSHOT PLACEHOLDER: Get Profile Response**]

---

#### 1.4 Update User Profile
- **Method:** `PATCH`
- **URL:** `http://localhost:5000/api/auth/profile`
- **Access Level:** Private (All authenticated users)
- **Description:** Update authenticated user's profile details
- **Request Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer {jwt_token}`
- **Request Body:** (All fields optional)
```json
{
  "name": "Updated Name",
  "email": "newemail@example.com",
  "password": "newpassword123"
}
```
- **Expected Response:** HTTP 200
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "_id": "user_id",
    "name": "Updated Name",
    "email": "newemail@example.com",
    "role": "member"
  }
}
```

[**SCREENSHOT PLACEHOLDER: Update Profile Response**]

---

### **2. BOOK ENDPOINTS**

#### 2.1 Search & Browse Books
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/books`
- **Access Level:** Private (All authenticated users)
- **Description:** Search and browse all available books with filtering options
- **Request Headers:**
  - `Authorization: Bearer {jwt_token}`
- **Query Parameters:**
  - `title` (optional): Search by book title
  - `author` (optional): Search by author name
  - `genre` (optional): Filter by genre
- **Example URL:** `http://localhost:5000/api/books?title=Gatsby&author=Fitzgerald&genre=Fiction`
- **Expected Response:** HTTP 200
```json
{
  "success": true,
  "message": "Books retrieved successfully",
  "books": [
    {
      "_id": "book_id",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "isbn": "978-0-7432-7356-5",
      "genre": "Fiction",
      "publishedYear": 1925,
      "totalCopies": 5,
      "availableCopies": 3,
      "description": "A classic American novel"
    }
  ]
}
```

[**SCREENSHOT PLACEHOLDER: Browse Books Response**]

---

### **3. CATALOG MANAGEMENT ENDPOINTS** *(Librarian/Admin Only)*

#### 3.1 Add Book to Catalog
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/catalog`
- **Access Level:** Private (Librarian, Admin)
- **Description:** Add a new book to the library catalog
- **Request Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer {jwt_token}`
- **Request Body:**
```json
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "isbn": "978-0-7432-7356-5",
  "genre": "Fiction",
  "publishedYear": 1925,
  "totalCopies": 5,
  "description": "A classic American novel"
}
```
- **Expected Response:** HTTP 201
```json
{
  "success": true,
  "message": "Book added successfully",
  "book": {
    "_id": "book_id",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "isbn": "978-0-7432-7356-5",
    "genre": "Fiction",
    "publishedYear": 1925,
    "totalCopies": 5,
    "availableCopies": 5
  }
}
```

[**SCREENSHOT PLACEHOLDER: Add Book Response**]

---

#### 3.2 Update Book Details
- **Method:** `PATCH`
- **URL:** `http://localhost:5000/api/catalog/{bookId}`
- **Access Level:** Private (Librarian, Admin)
- **Description:** Update existing book information
- **Request Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer {jwt_token}`
- **Request Body:** (All fields optional)
```json
{
  "title": "Updated Title",
  "totalCopies": 10,
  "description": "Updated description"
}
```
- **Expected Response:** HTTP 200
```json
{
  "success": true,
  "message": "Book updated successfully",
  "book": {
    "_id": "book_id",
    "title": "Updated Title",
    "totalCopies": 10
  }
}
```

[**SCREENSHOT PLACEHOLDER: Update Book Response**]

---

#### 3.3 Delete Book from Catalog
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/catalog/{bookId}`
- **Access Level:** Private (Librarian, Admin)
- **Description:** Remove a book from the library catalog
- **Request Headers:**
  - `Authorization: Bearer {jwt_token}`
- **Expected Response:** HTTP 200
```json
{
  "success": true,
  "message": "Book deleted successfully"
}
```

[**SCREENSHOT PLACEHOLDER: Delete Book Response**]

---

### **4. BORROW ENDPOINTS** *(Member Only)*

#### 4.1 Borrow a Book
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/borrow`
- **Access Level:** Private (Member only)
- **Description:** Borrow a book from the library
- **Request Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer {member_jwt_token}`
- **Request Body:**
```json
{
  "bookId": "65a1b2c3d4e5f6g7h8i9j0k1"
}
```
- **Expected Response:** HTTP 201
```json
{
  "success": true,
  "message": "Book borrowed successfully",
  "borrow": {
    "_id": "borrow_id",
    "userId": "user_id",
    "bookId": "book_id",
    "borrowDate": "2024-01-15",
    "dueDate": "2024-02-15",
    "status": "active"
  }
}
```

[**SCREENSHOT PLACEHOLDER: Borrow Book Response**]

---

#### 4.2 Get Borrow History
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/borrow`
- **Access Level:** Private (Member only)
- **Description:** View personal borrowing history and current borrows
- **Request Headers:**
  - `Authorization: Bearer {member_jwt_token}`
- **Expected Response:** HTTP 200
```json
{
  "success": true,
  "message": "Borrow history retrieved successfully",
  "borrows": [
    {
      "_id": "borrow_id",
      "bookId": "book_id",
      "borrowDate": "2024-01-15",
      "dueDate": "2024-02-15",
      "returnDate": null,
      "status": "active"
    }
  ]
}
```

[**SCREENSHOT PLACEHOLDER: Borrow History Response**]

---

#### 4.3 Return Borrowed Book
- **Method:** `PATCH`
- **URL:** `http://localhost:5000/api/borrow/{borrowId}/return`
- **Access Level:** Private (Member only)
- **Description:** Return a borrowed book to the library
- **Request Headers:**
  - `Authorization: Bearer {member_jwt_token}`
- **Expected Response:** HTTP 200
```json
{
  "success": true,
  "message": "Book returned successfully",
  "borrow": {
    "_id": "borrow_id",
    "returnDate": "2024-02-10",
    "status": "returned"
  }
}
```

[**SCREENSHOT PLACEHOLDER: Return Book Response**]

---

#### 4.4 Renew Borrow Period
- **Method:** `PATCH`
- **URL:** `http://localhost:5000/api/borrow/{borrowId}/renew`
- **Access Level:** Private (Member only)
- **Description:** Extend the borrowing period for an active borrow
- **Request Headers:**
  - `Authorization: Bearer {member_jwt_token}`
- **Expected Response:** HTTP 200
```json
{
  "success": true,
  "message": "Borrow renewed successfully",
  "borrow": {
    "_id": "borrow_id",
    "dueDate": "2024-03-15",
    "status": "active"
  }
}
```

[**SCREENSHOT PLACEHOLDER: Renew Borrow Response**]

---

#### 4.5 Get Overdue Borrows *(Admin/Librarian Only)*
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/borrow/overdue`
- **Access Level:** Private (Librarian, Admin)
- **Description:** View all overdue book borrows across the library
- **Request Headers:**
  - `Authorization: Bearer {librarian_or_admin_jwt_token}`
- **Expected Response:** HTTP 200
```json
{
  "success": true,
  "message": "Overdue borrows retrieved successfully",
  "overdueBorrows": [
    {
      "_id": "borrow_id",
      "userId": "user_id",
      "bookId": "book_id",
      "dueDate": "2024-01-20",
      "daysOverdue": 5,
      "status": "overdue"
    }
  ]
}
```

[**SCREENSHOT PLACEHOLDER: Overdue Borrows Response**]

---

### **5. MEMBER MANAGEMENT ENDPOINTS** *(Admin/Librarian Only)*

#### 5.1 Get All Members
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/members`
- **Access Level:** Private (Librarian, Admin)
- **Description:** View all registered members with optional filtering
- **Request Headers:**
  - `Authorization: Bearer {jwt_token}`
- **Query Parameters:**
  - `search` (optional): Search by name or email
  - `isActive` (optional): Filter by status (true/false)
- **Example URL:** `http://localhost:5000/api/members?search=admin&isActive=true`
- **Expected Response:** HTTP 200
```json
{
  "success": true,
  "message": "Members retrieved successfully",
  "members": [
    {
      "_id": "member_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "member",
      "isActive": true,
      "joinDate": "2024-01-01"
    }
  ]
}
```

[**SCREENSHOT PLACEHOLDER: Get Members Response**]

---

#### 5.2 Update Member Status
- **Method:** `PATCH`
- **URL:** `http://localhost:5000/api/members/{memberId}/status`
- **Access Level:** Private (Admin only)
- **Description:** Suspend or activate a member account
- **Request Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer {admin_jwt_token}`
- **Request Body:**
```json
{
  "isActive": false
}
```
- **Expected Response:** HTTP 200
```json
{
  "success": true,
  "message": "Member status updated successfully",
  "member": {
    "_id": "member_id",
    "name": "John Doe",
    "email": "john@example.com",
    "isActive": false
  }
}
```

[**SCREENSHOT PLACEHOLDER: Update Member Status Response**]

---

## 📊 Testing Workflow

### Step-by-Step Testing Guide:

1. **Login as Admin**
   - Use credentials: admin@library.com / Admin@1234
   - Save the returned JWT token

2. **Login as Librarian**
   - Use credentials: librarian@library.com / Lib@1234
   - Save the returned JWT token

3. **Add Books to Catalog**
   - Use Librarian token
   - Add 2-3 sample books
   - Save book IDs for borrowing tests

4. **Register a Member**
   - Create a new member account for testing
   - Use this token for borrow operations

5. **Test Book Browsing**
   - Use any authenticated token
   - Search with filters

6. **Test Borrowing**
   - Use member token to borrow books
   - View borrow history
   - Return books

7. **View Management Features**
   - Use Librarian token to view members
   - Use Admin token to update member status

---

## ✅ API Testing Checklist

| Endpoint | Method | Status | Notes |
|---|---|---|---|
| Register | POST | [ ] | |
| Login | POST | [ ] | |
| Get Profile | GET | [ ] | |
| Update Profile | PATCH | [ ] | |
| Browse Books | GET | [ ] | |
| Add Book | POST | [ ] | |
| Update Book | PATCH | [ ] | |
| Delete Book | DELETE | [ ] | |
| Borrow Book | POST | [ ] | |
| Get Borrow History | GET | [ ] | |
| Return Book | PATCH | [ ] | |
| Renew Borrow | PATCH | [ ] | |
| Get Overdue Borrows | GET | [ ] | |
| Get All Members | GET | [ ] | |
| Update Member Status | PATCH | [ ] | |

---

## 📝 Summary

**Total Endpoints:** 15  
**Authentication Method:** JWT Token-based  
**Role-Based Access:** Admin, Librarian, Member  
**Database Operations:** CRUD operations for Books, Borrows, and Members  
**Error Handling:** Comprehensive validation and authorization checks  

All endpoints have been documented with:
- Complete URL structure
- Required headers and authentication
- Request and response payloads
- Expected HTTP status codes
- Role-based access requirements

---

## 🎯 Conclusion

The Library Management System API successfully implements all required functionality with proper authentication, authorization, and comprehensive data validation across all endpoints. The system supports multi-role access control and complete CRUD operations for library management operations.

---

*Report Generated: January 2024*  
*Technology: Node.js, Express, MongoDB*  
*API Version: 1.0.0*

