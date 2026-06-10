const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Import route files
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const borrowRoutes = require('./routes/borrowRoutes');
const catalogRoutes = require('./routes/catalogRoutes');
const memberRoutes = require('./routes/memberRoutes');

// Initialize Express app
const app = express();

// ---------------------
// Middleware
// ---------------------

// Enable CORS for all origins
app.use(cors());

// HTTP request logger (dev format)
app.use(morgan('dev'));

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// ---------------------
// Routes
// ---------------------

// Health check / welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Library Management System API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      books: '/api/books',
      borrow: '/api/borrow',
      catalog: '/api/catalog',
      members: '/api/members',
    },
  });
});

// Mount route modules
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrow', borrowRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/members', memberRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

// Global error handler (must be last middleware)
app.use(errorHandler);

// ---------------------
// Start Server
// ---------------------
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📚 Library Management System API`);
    console.log(`🌐 http://localhost:${PORT}\n`);
  });
};

startServer();

module.exports = app;
