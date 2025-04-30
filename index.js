const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require("cors");

// Load environment variables
dotenv.config();
const PORT = process.env.PORT || 3000;

// Routes
const authroutes = require('./Routes/Authroutes');
const userRoutes = require('./Routes/userroutes');
const productroutes = require('./Routes/Product');
const profileRoutes = require('./Routes/profileroutes');

// DB Connection
const DbConnect = require('./Config/db');
DbConnect();

// JSON parsing
app.use(express.json());

// 🔐 CORS setup
const allowedOrigins = [
  'https://productsdash.netlify.app',
  'http://localhost:5173'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

// 🪵 Debug incoming requests (optional)
app.use((req, res, next) => {
  console.log('Incoming request from origin:', req.headers.origin);
  next();
});

// 🔁 Routes
app.get('/', (req, res) => {
  res.send('Hello World, API is running 🎉');
});

app.use('/api/auth', authroutes);
app.use('/api/user', userRoutes);
app.use('/api/product', productroutes);
app.use('/api/profile', profileRoutes);

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
