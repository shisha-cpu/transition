const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const mongoose = require('mongoose');

// Connect to MongoDB database
mongoose
    .connect('mongodb+srv://admin:wwwwww@cluster0.weppimj.mongodb.net/finance_manager?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('DB connected'))
    .catch((err) => console.log('DB connection error', err));

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });

    ws.send('connected');
});

// Define models
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    wallet: { type: Number, default: 0 } // Adding wallet field to user schema
});

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now }, // Adding default date to current date
    type: { type: String, enum: ['income', 'expense'] },
    amount: Number,
    description: String
});

const User = mongoose.model('User', userSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.post('/register', async(req, res) => {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    try {
        await user.save();
        res.status(201).send(user);
    } catch (err) {
        res.status(500).send({ message: 'Registration error' });
    }
});

app.post('/login', async(req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password });
        if (!user) {
            res.status(401).send({ message: 'Invalid credentials' });
        } else {
            res.send(user);
        }
    } catch (err) {
        res.status(500).send({ message: 'Error logging in' });
    }
});

app.get('/transactions', async(req, res) => {
    const userId = req.query.userId;
    try {
        const transactions = await Transaction.find({ userId }).populate('userId');
        res.send(transactions);
    } catch (err) {
        res.status(500).send({ message: 'Error fetching transactions' });
    }
});

app.post('/transactions', async(req, res) => {
    const { userId, type, amount, description } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Update user's wallet based on transaction type
        if (type === 'income') {
            user.wallet += amount;
        } else if (type === 'expense') {
            if (amount > user.wallet) {
                return res.status(400).send({ message: 'Insufficient funds' });
            }
            user.wallet -= amount;
        }

        // Save updated user wallet
        await user.save();

        // Create transaction
        const transaction = new Transaction({ userId, type, amount, description });
        await transaction.save();

        res.status(201).send(transaction);
    } catch (err) {
        res.status(500).send({ message: 'Error creating transaction' });
    }
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});