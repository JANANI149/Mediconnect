import { auth } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

// Function to create a Firebase Auth user for a hospital
async function createHospitalAuthUser(email, password) {
  try {
    console.log(`Creating Firebase Auth user for ${email}...`);
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log(`✓ Successfully created Firebase Auth user for ${email}`);
    console.log(`User ID: ${userCredential.user.uid}`);
    return true;
  } catch (authError) {
    if (authError.code === 'auth/email-already-in-use') {
      console.log(`✓ Firebase Auth user already exists for ${email}`);
      return true;
    } else {
      console.log(`✗ Error creating Firebase Auth user for ${email}:`, authError.code, authError.message);
      return false;
    }
  }
}

// Create auth user for the hospital we know exists
async function createMissingAuthUsers() {
  console.log('Creating Firebase Auth user for known hospital...');
  
  // We know from the Firebase Console that this hospital exists:
  const email = 'hosp@gmail.com';
  const password = 'medi@123'; // This is the tempPassword we saw in the console
  
  const success = await createHospitalAuthUser(email, password);
  
  if (success) {
    console.log('\nHospital authentication user created successfully!');
    console.log('You should now be able to log in with:');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
  } else {
    console.log('\nFailed to create hospital authentication user.');
    console.log('Please check the error message above.');
  }
}

createMissingAuthUsers();