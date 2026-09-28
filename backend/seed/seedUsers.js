const User = require('../models/User');

const demoUsers = [
  {
    name: 'Riya Shah',
    role: 'citizen',
    email: 'citizen@test.com',
    password: 'Test@123',
    title: 'Citizen',
  },
  {
    name: 'Arjun Mehta',
    role: 'contractor',
    email: 'contractor@test.com',
    password: 'Test@123',
    title: 'Contractor',
  },
  {
    name: 'Neha Verma',
    role: 'engineer',
    email: 'engineer@test.com',
    password: 'Test@123',
    title: 'Engineer',
  },
  {
    name: 'Vikram Singh',
    role: 'officer',
    email: 'officer@test.com',
    password: 'Test@123',
    title: 'Department Officer',
  },
  {
    name: 'Kavya Desai',
    role: 'finance',
    email: 'finance@test.com',
    password: 'Test@123',
    title: 'Finance Officer',
  },
  {
    name: 'Aditya Rao',
    role: 'admin',
    email: 'admin@test.com',
    password: 'Test@123',
    title: 'Super Admin',
  },
];

const seedUsers = async () => {
  try {
    console.log('[Seeder] Checking and initializing demo user accounts...');
    for (const demoUser of demoUsers) {
      const existingUser = await User.findOne({ email: demoUser.email });
      if (!existingUser) {
        await User.create({
          name: demoUser.name,
          email: demoUser.email,
          password: demoUser.password, // Automatically hashed by User pre-save hook
          role: demoUser.role,
        });
        console.log(`[Seeder] Created demo user: ${demoUser.name} (${demoUser.role})`);
      }
    }
    console.log('[Seeder] Demo accounts verified and ready.');
  } catch (error) {
    console.error(`[Seeder] Error seeding demo users: ${error.message}`);
  }
};

module.exports = {
  demoUsers,
  seedUsers,
};
