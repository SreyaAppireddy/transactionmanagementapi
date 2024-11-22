const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// In-memory storage for transactions
let transactions = [];
let nextId = 1; // To keep track of the next transaction ID

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Transaction Management API');
});
// API Endpoints

// 1. Create a new transaction
app.post('/api/transactions', (req, res) => {
    const { amount, transaction_type, user } = req.body;

    if (!amount || !transaction_type || !user) {
        return res.status(400).json({ error: 'Amount, transaction_type, and user are required.' });
    }

    const transaction = {
        transaction_id: nextId++,
        amount: parseFloat(amount),
        transaction_type,
        user,
        status: 'PENDING',
        timestamp: new Date().toISOString()
    };

    transactions.push(transaction);
    res.status(201).json(transaction);
});

// 2. Retrieve all transactions for a specific user
app.get('/api/transactions', (req, res) => {
    const userId = parseInt(req.query.user_id);
    if (!userId) {
        return res.status(400).json({ error: 'user_id query parameter is required.' });
    }

    const userTransactions = transactions.filter(t => t.user === userId);
    res.json({ transactions: userTransactions });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});