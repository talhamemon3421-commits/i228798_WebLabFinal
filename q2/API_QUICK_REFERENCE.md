# Library Management System - API Quick Reference

## Test Credentials
| Role | Email | Password |
|---|---|---|
| Admin | admin@library.com | Admin@1234 |
| Librarian | librarian@library.com | Lib@1234 |

---

## AUTHENTICATION

### 1. Register User
**URL:** `http://localhost:5000/api/auth/register`
**Payload:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
[SCREENSHOT]

---

### 2. Login
**URL:** `http://localhost:5000/api/auth/login`
**Payload:**
```json
{
  "email": "admin@library.com",
  "password": "Admin@1234"
}
```
[SCREENSHOT]

---

### 3. Get Profile
**URL:** `http://localhost:5000/api/auth/profile`
**Headers:** `Authorization: Bearer {token}`
[SCREENSHOT]

---

### 4. Update Profile
**URL:** `http://localhost:5000/api/auth/profile`
**Payload:**
```json
{
  "name": "Updated Name",
  "email": "newemail@example.com",
  "password": "newpassword123"
}
```
[SCREENSHOT]

---

## BOOKS

### 5. Browse Books
**URL:** `http://localhost:5000/api/books`
**Headers:** `Authorization: Bearer {token}`
**Query:** `?title=Gatsby&author=Fitzgerald&genre=Fiction`
[SCREENSHOT]

---

## CATALOG (Librarian/Admin)

### 6. Add Book
**URL:** `http://localhost:5000/api/catalog`
**Payload:**
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
[SCREENSHOT]

---

### 7. Update Book
**URL:** `http://localhost:5000/api/catalog/{bookId}`
**Payload:**
```json
{
  "title": "Updated Title",
  "totalCopies": 10
}
```
[SCREENSHOT]

---

### 8. Delete Book
**URL:** `http://localhost:5000/api/catalog/{bookId}`
[SCREENSHOT]

---

## BORROW (Member)

### 9. Borrow Book
**URL:** `http://localhost:5000/api/borrow`
**Payload:**
```json
{
  "bookId": "book_id_here"
}
```
[SCREENSHOT]

---

### 10. Get Borrow History
**URL:** `http://localhost:5000/api/borrow`
**Headers:** `Authorization: Bearer {token}`
[SCREENSHOT]

---

### 11. Return Book
**URL:** `http://localhost:5000/api/borrow/{borrowId}/return`
**Headers:** `Authorization: Bearer {token}`
[SCREENSHOT]

---

### 12. Renew Borrow
**URL:** `http://localhost:5000/api/borrow/{borrowId}/renew`
**Headers:** `Authorization: Bearer {token}`
[SCREENSHOT]

---

### 13. Get Overdue Borrows (Librarian/Admin)
**URL:** `http://localhost:5000/api/borrow/overdue`
**Headers:** `Authorization: Bearer {token}`
[SCREENSHOT]

---

## MEMBERS (Librarian/Admin)

### 14. Get All Members
**URL:** `http://localhost:5000/api/members`
**Headers:** `Authorization: Bearer {token}`
**Query:** `?search=admin&isActive=true`
[SCREENSHOT]

---

### 15. Update Member Status
**URL:** `http://localhost:5000/api/members/{memberId}/status`
**Payload:**
```json
{
  "isActive": false
}
```
[SCREENSHOT]

---
