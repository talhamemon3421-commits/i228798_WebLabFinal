/**
 * seed.js
 * Seeds the database with default Admin and Librarian accounts.
 *
 * Usage: node seed.js
 *
 * Pre-seeded accounts:
 *   - Admin:     admin@library.com     / Admin@1234
 *   - Librarian: librarian@library.com / Lib@1234
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load environment variables
dotenv.config();

const seedUsers = [
  {
    name: 'System Admin',
    email: 'admin@library.com',
    password: 'Admin@1234',
    role: 'admin',
    isActive: true,
  },
  {
    name: 'Head Librarian',
    email: 'librarian@library.com',
    password: 'Lib@1234',
    role: 'librarian',
    isActive: true,
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    for (const userData of seedUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`⚠️  User already exists: ${userData.email} (${userData.role}) — skipping`);
      } else {
        await User.create(userData);
        console.log(`✅ Created ${userData.role}: ${userData.email}`);
      }
    }

    console.log('\n🌱 Seed completed successfully!');
    console.log('\nPre-seeded accounts:');
    console.log('┌──────────────┬──────────────────────────┬──────────────┐');
    console.log('│ Role         │ Email                    │ Password     │');
    console.log('├──────────────┼──────────────────────────┼──────────────┤');
    console.log('│ Admin        │ admin@library.com        │ Admin@1234   │');
    console.log('│ Librarian    │ librarian@library.com    │ Lib@1234     │');
    console.log('└──────────────┴──────────────────────────┴──────────────┘');
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
    process.exit(0);
  }
};

seedDatabase();
