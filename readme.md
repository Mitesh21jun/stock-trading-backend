# 📈 Stock Trading API - Fundtec

A simple Node.js Express API to manage stock trades with **FIFO** and **LIFO** lot management strategies.

Built for stock trading platforms to handle:
- Purchase (CREDIT) and Sale (DEBIT) of stocks.
- Maintain lots (inventory) with FIFO/LIFO matching for debits.
- Summarize trades and available stock lots easily.
- Live app - http://3.110.165.127:5000

---

## 🚀 Features
- Create a trade (BUY/SELL) with FIFO or LIFO method.
- Automatically manage available lots.
- Summarize net stock position and available lots.
- Error handling for insufficient stocks.
- Simple and clean modular code structure.
- MongoDB Transactions for data safety.

---

## 📂 Project Structure
```
/config        → MongoDB connection
/controllers   → API controllers
/models        → Mongoose schemas (Trade, Lot)
/routes        → API route handlers
/helpers       → Helper logic (like Lot allocation)
server.js      → Entry point
```

---

## ⚙️ Setup Instructions

1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   ```
3. Create a `.env` file in root
   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```
4. Start the server
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000/`

---

## 📬 API Endpoints

### Trade APIs
| Method | Endpoint | Description |
| :----- | :------- | :---------- |
| `POST` | `/api/trades` | Create a trade (BUY or SELL) |
| `GET` | `/api/trades` | Get all trades (with optional filters) |
| `GET` | `/api/trades/getStockSummary` | Get stock-wise summary (net quantity & available lots) |

### Lot APIs
| Method | Endpoint | Description |
| :----- | :------- | :---------- |
| `GET` | `/api/lots` | Get lot details (by stock or trade ID) |

### Health Check
| Method | Endpoint | Description |
| :----- | :------- | :---------- |
| `GET` | `/status` | Check server status |

---

## 💑 API Documentation (Postman Collection)

You can import the ready-to-use Postman Collection:  
**Postman Collection Name:** `Stock Trading API - Fundtec`

### Environment Variables in Postman:
- `aws_host` — Use for AWS hosted URL.
- `localhost` — Use for local development (`http://localhost:5000`).

---

## 🔥 How to Create a Trade

- **BUY (CREDIT) Example**

```json
POST /api/trades
Content-Type: application/json

{
  "stock_name": "Microsoft",
  "trade_type": "CREDIT",
  "quantity": 50,
  "broker_name": "Broker A",
  "price": 100
}
```

- **SELL (DEBIT) Example (using LIFO)**

```json
POST /api/trades
Content-Type: application/json

{
  "stock_name": "Microsoft",
  "trade_type": "DEBIT",
  "quantity": 20,
  "broker_name": "Broker A",
  "price": 120,
  "method": "lifo"
}
```
> ⚡ `method` defaults to `fifo` if not provided.

---

## 📊 Stock Summary Response

Sample output of `/api/trades/getStockSummary`:
```json
[
  {
    "stock_name": "Microsoft",
    "total_quantity_credit": 100,
    "total_quantity_debit": 50,
    "net_quantity": 50,
    "total_available_quantity": 50,
    "warning": null
  }
]
```

If there’s mismatch:
```json
"warning": "Mismatch: net_quantity (50) ≠ total_available_quantity (30)"
```

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- Postman for testing
- Docker (optional)

---

## 🚌 Author
Made with ❤️ by Fundtec team.

---

## ✨ Future Improvements
- Authentication & Authorization (JWT)
- Pagination and filtering on lot/trade listings
- WebSocket updates on trades
- Trade history audits

---

