import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './Routes/user.js';
import './db.js'; // Import your database connection file

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Configure CORS (consider restricting to specific domains in production)
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS || '*',  // Can specify allowed origins here for better security
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,  // Allow credentials if required
};

app.use(cors(corsOptions));

// User routes for authentication and registration
app.use('/api/user', userRoutes);

// Basic error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
