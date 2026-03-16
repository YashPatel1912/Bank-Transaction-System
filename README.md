# 🏦 Banking Transaction System

A **secure and scalable Banking Transaction System API** built using **Node.js, Express.js, and MongoDB**.  
This project simulates core banking operations such as **user authentication, account creation, transactions, ledger management, and balance tracking** while ensuring **security, idempotency, and token management**.

The system follows **modern backend architecture practices** including **JWT authentication, ledger-based accounting, and email notifications**.

---

# 🚀 Features

## 👤 User Authentication
- User Registration
- Secure Login using JWT
- Password encryption using **bcrypt**
- Logout functionality
- **Blacklisted JWT tokens** for secure logout

## 📧 Email Notification
- Email notifications using **Nodemailer**
- Sends email on:
  - Registration
  - Account creation
  - Transaction alerts

## 🏦 Bank Account Management
- Create bank account
- Unique account number generation
- Fetch account details
- Account status validation

## 💸 Transaction System
- Secure money transfer
- Sender balance validation
- Idempotency validation (prevents duplicate transactions)
- Transaction history

## 📒 Ledger System
- Ledger-based accounting system
- Stores **all debit and credit records**
- Accurate balance calculation using **aggregation pipeline**

## 💰 Balance Management
- Fetch current balance
- Balance derived from ledger entries

## 🔐 Security Features
- JWT Authentication
- Password Hashing (bcrypt)
- Blacklisted token storage
- Idempotent transaction protection
- Account status validation

---

# 🧱 System Architecture

```
User
 │
 ▼
Express API
 │
 ├── Authentication Service
 ├── Account Service
 ├── Transaction Service
 ├── Ledger Service
 └── Email Notification Service
 │
 ▼
MongoDB Database
```

---

# 🛠 Tech Stack

## Backend
- Node.js
- Express.js

## Database
- MongoDB
- Mongoose

## Authentication
- JWT (JSON Web Token)
- bcrypt

## Email Service
- Nodemailer

## Other Tools
- dotenv
- uuid
- crypto

---

# 📂 Project Structure

```
banking-transaction-system
│
├── node_modules
│
├── src
│   │
│   ├── config
│   │   └── db.js
│   │
│   ├── controllers
│   │   ├── account.controller.js
│   │   ├── auth.controllers.js
│   │   └── transection.controller.js
│   │
│   ├── middleware
│   │   └── auth.middleware.js
│   │
│   ├── model
│   │   ├── account.model.js
│   │   ├── blacklist.model.js
│   │   ├── ledger.model.js
│   │   ├── transection.model.js
│   │   └── user.model.js
│   │
│   ├── routes
│   │   ├── account.routes.js
│   │   ├── auth.route.js
│   │   └── transection.route.js
│   │
│   ├── services
│   │   └── mail.service.js
│   │
│   └── app.js
│
├── .env
├── .gitignore
├── dockerfile
├── package-lock.json
└── package.json
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/YashPatel1912/Bank-Transaction-System.git
```

## 2️⃣ Go to project folder

```bash
cd banking-transaction-system
```

## 3️⃣ Install dependencies

```bash
npm install
```

## 4️⃣ Create `.env` file

```
PORT=3000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
REFRESH_TOKEN=your_refersh_token
EMAIL_USER=your_email@gmail.com
```

## 5️⃣ Run server

```bash
npm run dev
```

Server will start on:

```
http://localhost:3000
```

---

# 📡 API Endpoints

## Authentication

### Register User
```
POST /api/auth/register
```

### Login
```
POST /api/auth/login
```

### Logout
```
POST /api/auth/logout
```

---

## Bank Account

### Create Account
```
POST /api/accounts/
```

### Fetch Account
```
GET /api/account/s
```

### Fetch Balance
```
GET /api/account/balance/:accountId
```

---

## Transactions

### Transfer Money
```
POST /api/transactions/
```

### create Transaction Account funds
```
POST /api/transactions/
```

### Transaction History
```
GET /api/transactions/history
```

---

## Balance


Balance is calculated using **ledger aggregation pipeline**.

---

# 🔁 Ledger Based Accounting

Each transaction creates **two ledger entries**:

| Type | Description |
|-----|-------------|
| Debit | Amount deducted from sender |
| Credit | Amount added to receiver |

Example:

| Account | Type | Amount |
|--------|------|--------|
| A | Debit | 500 |
| B | Credit | 500 |

Balance formula:

```
Total Credit - Total Debit
```

---

# 🧪 Transaction Idempotency

To prevent **duplicate transactions**, each request includes an **Idempotency Key**.

Example:

```
Idempotency-Key: 123456789
```

If the same key is used again, the system **rejects duplicate transactions**.

---

# 🔐 Security Implementation

| Feature | Description |
|--------|-------------|
| JWT Authentication | Secure API access |
| Password Hashing | bcrypt encryption |
| Blacklisted Tokens | Prevent reuse after logout |
| Idempotency Keys | Prevent duplicate transfers |
| Input Validation | Secure API requests |

---

# 📧 Email Notifications

Users receive email notifications for:

- Registration confirmation
- Account creation
- Successful transaction
- Security alerts

Powered by **Nodemailer**.

---

# 📊 Example Transaction Flow

```
User Login
     │
     ▼
Create Account
     │
     ▼
Transfer Money
     │
     ▼
Validate Balance
     │
     ▼
Create Transaction Record
     │
     ▼
Create Ledger Entries
     │
     ▼
Update Balance
     │
     ▼
Send Email Notification
```

---

# 🌟 Future Improvements

- OTP verification
- Two-factor authentication
- Rate limiting
- Admin dashboard
- Fraud detection system
- Transaction analytics
- Microservices architecture

---

# 👨‍💻 Author

**Yash Patel**

Full Stack Developer | DevOps Engineer

---

# 📜 License

This project is licensed under the **MIT License**.
