/**
 * seedData.js
 * Inserts a generous amount of dummy data for testing purposes.
 * Includes: 5 member accounts, 25 books, and 20 borrow records.
 *
 * Usage: node seedData.js
 *
 * NOTE: Run seed.js first to ensure Admin and Librarian accounts exist.
 *       This script will create additional members, books, and borrow records.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Book = require('./models/Book');
const Borrow = require('./models/Borrow');

// Load environment variables
dotenv.config();

// =====================
// DUMMY MEMBER ACCOUNTS
// =====================
const dummyMembers = [
  { name: 'Ali Hassan', email: 'ali.hassan@email.com', password: 'Member@123', role: 'member' },
  { name: 'Sara Ahmed', email: 'sara.ahmed@email.com', password: 'Member@123', role: 'member' },
  { name: 'Usman Khan', email: 'usman.khan@email.com', password: 'Member@123', role: 'member' },
  { name: 'Fatima Zahra', email: 'fatima.zahra@email.com', password: 'Member@123', role: 'member' },
  { name: 'Bilal Tariq', email: 'bilal.tariq@email.com', password: 'Member@123', role: 'member' },
];

// =====================
// DUMMY BOOKS (25 books)
// =====================
const dummyBooks = [
  // Fiction
  { title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0-06-112008-4', genre: 'Fiction', publishedYear: 1960, totalCopies: 5, description: 'A classic novel of a child\'s awakening to racism in the American South.' },
  { title: '1984', author: 'George Orwell', isbn: '978-0-45-152493-5', genre: 'Fiction', publishedYear: 1949, totalCopies: 4, description: 'A dystopian novel about totalitarianism and surveillance.' },
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0-74-327356-5', genre: 'Fiction', publishedYear: 1925, totalCopies: 3, description: 'A story of the mysteriously wealthy Jay Gatsby and his love for Daisy Buchanan.' },
  { title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '978-0-14-143951-8', genre: 'Fiction', publishedYear: 1813, totalCopies: 4, description: 'A witty romantic novel about Elizabeth Bennet and Mr. Darcy.' },
  { title: 'The Catcher in the Rye', author: 'J.D. Salinger', isbn: '978-0-31-676948-0', genre: 'Fiction', publishedYear: 1951, totalCopies: 3, description: 'A story about teenage rebellion and angst narrated by Holden Caulfield.' },

  // Science Fiction
  { title: 'Dune', author: 'Frank Herbert', isbn: '978-0-44-117271-9', genre: 'Science Fiction', publishedYear: 1965, totalCopies: 3, description: 'An epic science fiction novel set on the desert planet Arrakis.' },
  { title: 'Brave New World', author: 'Aldous Huxley', isbn: '978-0-06-085052-4', genre: 'Science Fiction', publishedYear: 1932, totalCopies: 2, description: 'A dystopian novel set in a genetically engineered society.' },
  { title: 'The Hitchhiker\'s Guide to the Galaxy', author: 'Douglas Adams', isbn: '978-0-34-539180-3', genre: 'Science Fiction', publishedYear: 1979, totalCopies: 4, description: 'A comedic science fiction adventure through space.' },
  { title: 'Ender\'s Game', author: 'Orson Scott Card', isbn: '978-0-81-255453-3', genre: 'Science Fiction', publishedYear: 1985, totalCopies: 3, description: 'A young genius is recruited to lead humanity\'s war against an alien threat.' },
  { title: 'Foundation', author: 'Isaac Asimov', isbn: '978-0-55-338257-3', genre: 'Science Fiction', publishedYear: 1951, totalCopies: 2, description: 'The first novel of Asimov\'s epic Foundation series about psychohistory.' },

  // Technology
  { title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0-13-235088-4', genre: 'Technology', publishedYear: 2008, totalCopies: 5, description: 'A handbook of agile software craftsmanship and best practices.' },
  { title: 'JavaScript: The Good Parts', author: 'Douglas Crockford', isbn: '978-0-59-651774-8', genre: 'Technology', publishedYear: 2008, totalCopies: 3, description: 'A deep dive into the elegant parts of the JavaScript language.' },
  { title: 'Design Patterns', author: 'Gang of Four', isbn: '978-0-20-163361-0', genre: 'Technology', publishedYear: 1994, totalCopies: 2, description: 'Elements of reusable object-oriented software design patterns.' },
  { title: 'The Pragmatic Programmer', author: 'David Thomas', isbn: '978-0-13-595705-9', genre: 'Technology', publishedYear: 2019, totalCopies: 4, description: 'Your journey to mastery in software development.' },
  { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '978-0-26-204630-5', genre: 'Technology', publishedYear: 2009, totalCopies: 3, description: 'A comprehensive textbook on algorithms used in computer science.' },

  // History
  { title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', isbn: '978-0-06-231609-7', genre: 'History', publishedYear: 2011, totalCopies: 5, description: 'A sweeping narrative of human history from the Stone Age to the present.' },
  { title: 'Guns, Germs, and Steel', author: 'Jared Diamond', isbn: '978-0-39-331755-8', genre: 'History', publishedYear: 1997, totalCopies: 3, description: 'An exploration of why certain civilizations rose to dominate others.' },
  { title: 'The Art of War', author: 'Sun Tzu', isbn: '978-1-59-030227-8', genre: 'History', totalCopies: 4, description: 'An ancient Chinese military treatise on strategy and tactics.' },

  // Self-Help
  { title: 'Atomic Habits', author: 'James Clear', isbn: '978-0-73-521129-2', genre: 'Self-Help', publishedYear: 2018, totalCopies: 6, description: 'An easy and proven way to build good habits and break bad ones.' },
  { title: 'The 7 Habits of Highly Effective People', author: 'Stephen Covey', isbn: '978-1-98-213707-3', genre: 'Self-Help', publishedYear: 1989, totalCopies: 4, description: 'Powerful lessons in personal change and effectiveness.' },
  { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', isbn: '978-0-37-453355-7', genre: 'Self-Help', publishedYear: 2011, totalCopies: 3, description: 'An exploration of the two systems that drive the way we think.' },

  // Mystery
  { title: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson', isbn: '978-0-30-747347-5', genre: 'Mystery', publishedYear: 2005, totalCopies: 3, description: 'A journalist and a hacker investigate a decades-old disappearance.' },
  { title: 'Gone Girl', author: 'Gillian Flynn', isbn: '978-0-30-758836-4', genre: 'Mystery', publishedYear: 2012, totalCopies: 4, description: 'A psychological thriller about a wife\'s mysterious disappearance.' },

  // Fantasy
  { title: 'The Hobbit', author: 'J.R.R. Tolkien', isbn: '978-0-54-792822-7', genre: 'Fantasy', publishedYear: 1937, totalCopies: 5, description: 'A hobbit is whisked away on an unexpected journey with dwarves and a wizard.' },
  { title: 'Harry Potter and the Sorcerer\'s Stone', author: 'J.K. Rowling', isbn: '978-0-59-035342-7', genre: 'Fantasy', publishedYear: 1997, totalCopies: 6, description: 'A young boy discovers he is a wizard and begins his magical education.' },
];

/**
 * Generates borrow records with mixed statuses: borrowed, returned, and overdue.
 */
const generateBorrows = (memberIds, bookIds) => {
  const now = new Date();
  const borrows = [];

  // Active borrows (status: borrowed) — books currently checked out
  borrows.push({
    user: memberIds[0],
    book: bookIds[0],
    borrowDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    dueDate: new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000), // 9 days from now
    status: 'borrowed',
    renewCount: 0,
  });
  borrows.push({
    user: memberIds[1],
    book: bookIds[5],
    borrowDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    dueDate: new Date(now.getTime() + 11 * 24 * 60 * 60 * 1000), // 11 days from now
    status: 'borrowed',
    renewCount: 0,
  });
  borrows.push({
    user: memberIds[2],
    book: bookIds[10],
    borrowDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    status: 'borrowed',
    renewCount: 0,
  });
  borrows.push({
    user: memberIds[3],
    book: bookIds[18],
    borrowDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    dueDate: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
    status: 'borrowed',
    renewCount: 0,
  });
  borrows.push({
    user: memberIds[4],
    book: bookIds[23],
    borrowDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    dueDate: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    status: 'borrowed',
    renewCount: 0,
  });

  // Returned borrows (status: returned) — completed borrowings
  borrows.push({
    user: memberIds[0],
    book: bookIds[11],
    borrowDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    dueDate: new Date(now.getTime() - 16 * 24 * 60 * 60 * 1000), // due 16 days ago
    returnDate: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000), // returned 18 days ago (on time)
    status: 'returned',
    renewCount: 0,
  });
  borrows.push({
    user: memberIds[1],
    book: bookIds[15],
    borrowDate: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
    dueDate: new Date(now.getTime() - 31 * 24 * 60 * 60 * 1000),
    returnDate: new Date(now.getTime() - 33 * 24 * 60 * 60 * 1000),
    status: 'returned',
    renewCount: 1,
  });
  borrows.push({
    user: memberIds[2],
    book: bookIds[3],
    borrowDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
    dueDate: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
    returnDate: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
    status: 'returned',
    renewCount: 0,
  });
  borrows.push({
    user: memberIds[3],
    book: bookIds[7],
    borrowDate: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
    dueDate: new Date(now.getTime() - 46 * 24 * 60 * 60 * 1000),
    returnDate: new Date(now.getTime() - 48 * 24 * 60 * 60 * 1000),
    status: 'returned',
    renewCount: 0,
  });
  borrows.push({
    user: memberIds[4],
    book: bookIds[20],
    borrowDate: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
    dueDate: new Date(now.getTime() - 11 * 24 * 60 * 60 * 1000),
    returnDate: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000),
    status: 'returned',
    renewCount: 0,
  });
  borrows.push({
    user: memberIds[0],
    book: bookIds[24],
    borrowDate: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000),
    dueDate: new Date(now.getTime() - 26 * 24 * 60 * 60 * 1000),
    returnDate: new Date(now.getTime() - 27 * 24 * 60 * 60 * 1000),
    status: 'returned',
    renewCount: 2,
  });
  borrows.push({
    user: memberIds[1],
    book: bookIds[2],
    borrowDate: new Date(now.getTime() - 50 * 24 * 60 * 60 * 1000),
    dueDate: new Date(now.getTime() - 36 * 24 * 60 * 60 * 1000),
    returnDate: new Date(now.getTime() - 37 * 24 * 60 * 60 * 1000),
    status: 'returned',
    renewCount: 0,
  });

  // Overdue borrows (status: overdue) — past due, not returned
  borrows.push({
    user: memberIds[0],
    book: bookIds[6],
    borrowDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
    dueDate: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000), // Due 6 days ago
    status: 'overdue',
    renewCount: 0,
  });
  borrows.push({
    user: memberIds[2],
    book: bookIds[16],
    borrowDate: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
    dueDate: new Date(now.getTime() - 11 * 24 * 60 * 60 * 1000), // Due 11 days ago
    status: 'overdue',
    renewCount: 1,
  });
  borrows.push({
    user: memberIds[4],
    book: bookIds[1],
    borrowDate: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000), // 18 days ago
    dueDate: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), // Due 4 days ago
    status: 'overdue',
    renewCount: 0,
  });
  borrows.push({
    user: memberIds[3],
    book: bookIds[12],
    borrowDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    dueDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // Due 2 days ago
    status: 'overdue',
    renewCount: 2,
  });
  borrows.push({
    user: memberIds[1],
    book: bookIds[21],
    borrowDate: new Date(now.getTime() - 22 * 24 * 60 * 60 * 1000),
    dueDate: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
    status: 'overdue',
    renewCount: 0,
  });
  borrows.push({
    user: memberIds[0],
    book: bookIds[14],
    borrowDate: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000),
    dueDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    status: 'overdue',
    renewCount: 1,
  });

  // Renewed borrows (currently active with renewals)
  borrows.push({
    user: memberIds[2],
    book: bookIds[19],
    borrowDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
    dueDate: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000), // renewed, due in 8 days
    status: 'borrowed',
    renewCount: 1,
  });
  borrows.push({
    user: memberIds[4],
    book: bookIds[8],
    borrowDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    dueDate: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000), // renewed twice, due in 12 days
    status: 'borrowed',
    renewCount: 2,
  });

  return borrows;
};

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // ---- Step 1: Create Members ----
    console.log('📦 Creating member accounts...');
    const createdMembers = [];
    for (const member of dummyMembers) {
      const existing = await User.findOne({ email: member.email });
      if (existing) {
        console.log(`   ⚠️  Member already exists: ${member.email} — using existing`);
        createdMembers.push(existing);
      } else {
        const newMember = await User.create(member);
        console.log(`   ✅ Created member: ${member.name} (${member.email})`);
        createdMembers.push(newMember);
      }
    }

    // ---- Step 2: Get librarian for addedBy reference ----
    let librarian = await User.findOne({ role: 'librarian' });
    if (!librarian) {
      librarian = await User.findOne({ role: 'admin' });
    }
    if (!librarian) {
      console.error('❌ No librarian or admin found. Run seed.js first!');
      process.exit(1);
    }

    // ---- Step 3: Create Books ----
    console.log('\n📚 Creating books...');
    const createdBooks = [];
    for (const bookData of dummyBooks) {
      const existing = await Book.findOne({ isbn: bookData.isbn });
      if (existing) {
        console.log(`   ⚠️  Book already exists: "${bookData.title}" — using existing`);
        createdBooks.push(existing);
      } else {
        const book = await Book.create({
          ...bookData,
          availableCopies: bookData.totalCopies,
          addedBy: librarian._id,
        });
        console.log(`   ✅ Added: "${bookData.title}" by ${bookData.author}`);
        createdBooks.push(book);
      }
    }

    // ---- Step 4: Create Borrow Records ----
    console.log('\n📋 Creating borrow records...');
    const memberIds = createdMembers.map((m) => m._id);
    const bookIds = createdBooks.map((b) => b._id);
    const borrowRecords = generateBorrows(memberIds, bookIds);

    // Clear existing borrow records to avoid duplicates on re-run
    await Borrow.deleteMany({});
    console.log('   🗑️  Cleared existing borrow records');

    for (const borrowData of borrowRecords) {
      await Borrow.create(borrowData);
    }
    console.log(`   ✅ Created ${borrowRecords.length} borrow records`);

    // ---- Step 5: Update available copies for active borrows ----
    console.log('\n🔄 Updating available copies for active borrows...');
    const activeBorrows = borrowRecords.filter(
      (b) => b.status === 'borrowed' || b.status === 'overdue'
    );
    for (const borrow of activeBorrows) {
      await Book.findByIdAndUpdate(borrow.book, {
        $inc: { availableCopies: -1 },
      });
    }
    console.log(`   ✅ Updated available copies for ${activeBorrows.length} active borrows`);

    // ---- Summary ----
    console.log('\n' + '='.repeat(60));
    console.log('🌱 SEED DATA COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log(`\n  👤 Members created:  ${createdMembers.length}`);
    console.log(`  📚 Books created:    ${createdBooks.length}`);
    console.log(`  📋 Borrow records:   ${borrowRecords.length}`);
    console.log(`     - Active:         ${borrowRecords.filter((b) => b.status === 'borrowed').length}`);
    console.log(`     - Returned:       ${borrowRecords.filter((b) => b.status === 'returned').length}`);
    console.log(`     - Overdue:        ${borrowRecords.filter((b) => b.status === 'overdue').length}`);

    console.log('\n  Test member credentials:');
    console.log('  ┌─────────────────────┬───────────────────────────┬──────────────┐');
    console.log('  │ Name                │ Email                     │ Password     │');
    console.log('  ├─────────────────────┼───────────────────────────┼──────────────┤');
    for (const m of dummyMembers) {
      const name = m.name.padEnd(19);
      const email = m.email.padEnd(25);
      console.log(`  │ ${name} │ ${email} │ Member@123   │`);
    }
    console.log('  └─────────────────────┴───────────────────────────┴──────────────┘');
  } catch (error) {
    console.error('❌ Seed data failed:', error.message);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed.');
    process.exit(0);
  }
};

seedData();
