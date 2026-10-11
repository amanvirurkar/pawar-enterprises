import dotenv from 'dotenv';

dotenv.config();

const seed = async () => {
  // MongoDB has been removed.
  // TODO: Add Firebase seed logic here if needed.
  
  const email = 'kunalvirurkar31@gmail.com';
  const password = 'kunal123';
  const name = 'Kunal Virurkar';

  console.log('Firebase Seed script placeholder.');
  console.log('   Email:', email);
  console.log('   Password:', password);
  process.exit();
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
