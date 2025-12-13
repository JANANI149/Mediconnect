import { auth } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

// Create hospital user
async function createHospitalUser() {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      'numm@gmail.com', 
      'numm@123'
    );
    console.log('Hospital user created successfully:', userCredential.user.email);
    console.log('User ID:', userCredential.user.uid);
  } catch (error) {
    console.error('Error creating user:', error.code, error.message);
    
    // If user already exists, that's actually what we want
    if (error.code === 'auth/email-already-in-use') {
      console.log('User already exists - this is good! The Firebase Auth user is ready.');
    }
  }
}

createHospitalUser();