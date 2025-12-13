import { auth, db } from './firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';

// Function to fix hospital authentication
async function fixHospitalAuth() {
  try {
    console.log('Fetching hospitals from Firestore...');
    
    // Get all hospitals from Firestore
    const hospitalsRef = collection(db, 'adminHospitals');
    const hospitalSnapshot = await getDocs(hospitalsRef);
    
    if (hospitalSnapshot.empty) {
      console.log('No hospitals found in Firestore');
      return;
    }
    
    console.log(`Found ${hospitalSnapshot.size} hospitals in Firestore`);
    
    let fixedCount = 0;
    
    for (const doc of hospitalSnapshot.docs) {
      const hospitalData = doc.data();
      const email = hospitalData.email;
      const tempPassword = hospitalData.tempPassword || 'Hospital@123'; // Default password if not set
      
      if (!email) {
        console.log(`Skipping hospital ${doc.id} - no email found`);
        continue;
      }
      
      try {
        // Try to create Firebase Auth user
        console.log(`Creating Firebase Auth user for ${email}...`);
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          tempPassword
        );
        console.log(`✓ Successfully created Firebase Auth user for ${email}`);
        fixedCount++;
      } catch (authError) {
        if (authError.code === 'auth/email-already-in-use') {
          console.log(`✓ Firebase Auth user already exists for ${email}`);
        } else {
          console.log(`✗ Error creating Firebase Auth user for ${email}:`, authError.code, authError.message);
        }
      }
    }
    
    console.log(`\nFix process completed. ${fixedCount} new Firebase Auth users created.`);
    console.log('You should now be able to log in with your hospital credentials.');
    
  } catch (error) {
    console.error('Error fixing hospital authentication:', error);
  }
}

// Function to check if a specific hospital exists
async function checkHospital(email) {
  try {
    console.log(`Checking if hospital with email ${email} exists in Firestore...`);
    
    const hospitalsRef = collection(db, 'adminHospitals');
    const q = query(hospitalsRef, where('email', '==', email));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log(`No hospital found with email ${email} in Firestore`);
      return false;
    }
    
    const hospitalData = snapshot.docs[0].data();
    console.log(`Hospital found:`, hospitalData);
    return true;
  } catch (error) {
    console.error('Error checking hospital:', error);
    return false;
  }
}

// Function to fix a specific hospital
async function fixSpecificHospital(email) {
  try {
    console.log(`Checking hospital with email ${email}...`);
    
    const hospitalsRef = collection(db, 'adminHospitals');
    const q = query(hospitalsRef, where('email', '==', email));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log(`No hospital found with email ${email} in Firestore`);
      return;
    }
    
    const hospitalDoc = snapshot.docs[0];
    const hospitalData = hospitalDoc.data();
    const tempPassword = hospitalData.tempPassword || 'Hospital@123';
    
    console.log(`Hospital found:`, hospitalData);
    
    try {
      // Try to create Firebase Auth user
      console.log(`Creating Firebase Auth user for ${email}...`);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        tempPassword
      );
      console.log(`✓ Successfully created Firebase Auth user for ${email}`);
    } catch (authError) {
      if (authError.code === 'auth/email-already-in-use') {
        console.log(`✓ Firebase Auth user already exists for ${email}`);
      } else {
        console.log(`✗ Error creating Firebase Auth user for ${email}:`, authError.code, authError.message);
      }
    }
  } catch (error) {
    console.error('Error fixing specific hospital:', error);
  }
}

// Check if email argument is provided
const args = process.argv.slice(2);
if (args.length > 0 && args[0] === '--email' && args[1]) {
  // Fix specific hospital
  fixSpecificHospital(args[1]);
} else if (args.length > 0 && args[0] === '--check' && args[1]) {
  // Check specific hospital
  checkHospital(args[1]);
} else {
  // Run the fix function for all hospitals
  fixHospitalAuth();
}