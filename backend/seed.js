import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { FirestoreService } from './config/firestoreService.js';

dotenv.config();

const seed = async () => {
  console.log('🌱 Starting Pawar Enterprises Backend Seed for Firestore...');
  
  const email = 'kunalvirurkar31@gmail.com';
  const password = 'kunal123';
  const name = 'Kunal Virurkar';

  try {
    const existingAdmin = await FirestoreService.findOne('admins', 'email', email);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (existingAdmin) {
      console.log(`ℹ️ Admin already exists with email: ${email}. Updating password & role...`);
      await FirestoreService.update('admins', existingAdmin.id, {
        password: hashedPassword,
        name,
        role: 'superadmin'
      });
    } else {
      console.log(`➕ Creating initial superadmin: ${email}...`);
      await FirestoreService.create('admins', {
        name,
        email,
        password: hashedPassword,
        role: 'superadmin'
      }, 'primary_admin');
    }

    console.log('✅ Admin credentials seeded successfully:');
    console.log('   Email:', email);
    console.log('   Password:', password);
    console.log('🎉 Seed complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
};

seed();
