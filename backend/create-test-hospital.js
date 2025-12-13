import { auth, db } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Create test hospital
async function createTestHospital() {
  try {
    const hospitalData = {
      name: 'Test Hospital',
      email: 'test@hospital.com',
      password: 'hospital123',
      location: 'Test City, Test State',
      services: 'Emergency, Cardiology, Pediatrics'
    };

    // Create Firebase Auth user
    console.log('Creating Firebase Auth user...');
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      hospitalData.email, 
      hospitalData.password
    );
    console.log('Firebase Auth user created successfully:', userCredential.user.email);

    // Store hospital data in Firestore
    console.log('Adding hospital data to Firestore...');
    const docRef = await addDoc(collection(db, 'adminHospitals'), {
      name: hospitalData.name,
      email: hospitalData.email,
      tempPassword: hospitalData.password,
      location: hospitalData.location,
      services: hospitalData.services.split(',').map(service => service.trim()),
      status: 'pending',
      doctors: 0,
      appointments: 0,
      createdAt: serverTimestamp(),
    });
    
    console.log('Hospital added successfully with ID:', docRef.id);
    console.log('You can now log in with:');
    console.log('Email:', hospitalData.email);
    console.log('Password:', hospitalData.password);
  } catch (error) {
    console.error('Error creating test hospital:', error.code, error.message);
    
    // If user already exists, that's fine for testing
    if (error.code === 'auth/email-already-in-use') {
      console.log('Hospital user already exists - you can use these credentials to log in.');
      console.log('Email: test@hospital.com');
      console.log('Password: hospital123');
    }
  }
}

createTestHospital();