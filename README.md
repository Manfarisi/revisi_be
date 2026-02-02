# 🧩 Mini ERP Backend (Inventory & Finance)

Backend service for a **Mini ERP System** designed to manage **inventory, products, raw materials, and financial transactions** for small to medium businesses.

Built using **Node.js, Express.js, and MongoDB**, this backend provides secure and scalable RESTful APIs for the frontend application.

---

## 📌 Overview
This backend handles:
- Business logic
- Authentication & authorization
- Inventory and finance data management
- API services for ERP frontend

---

## 🚀 Features
- User authentication using JWT
- Role-based access (admin / staff)
- CRUD Products
- CRUD Raw Materials (Bahan Baku)
- Stock In & Stock Out management
- Income & Expense tracking
- Financial reports
- API validation and error handling

---

## 🛠️ Tech Stack
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs
- dotenv

---

## 🔐 Authentication
This project uses **JWT (JSON Web Token)** for secure authentication.
Passwords are hashed using **bcrypt** before being stored in the database.

---

## ▶️ Run Locally
```bash
npm install
npm run dev
```
---

📁 Environment Variables

Create a .env file:

- PORT=5000
- MONGO_URI=your_mongodb_uri
- JWT_SECRET=your_secret_key

---

▶️ Run Locally
npm install npm run dev

🔗 Backend Repository

This backend consumes data from the frontend : 
- https://github.com/Manfarisi/mini-erp-inventory-finance-fe

👨‍💻 Author

- Salman Alfarisi 
- GitHub: https://github.com/Manfarisi
