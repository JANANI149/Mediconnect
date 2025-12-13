import { db } from './backend/firebase';
import { collection, getDocs } from 'firebase/firestore';

async function testFirestore() {
  try {
    console.log('Testing Firestore connection...');
    const hospitalsRef = collection(db, 'adminHospitals');
    const hospitalSnapshot = await getDocs(hospitalsRef);
    
    console.log(`Successfully connected to Firestore. Found ${hospitalSnapshot.size} hospitals.`);
    
    hospitalSnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`Hospital: ${data.name} (${data.email})`);
    });
  } catch (error) {
    console.error('Error connecting to Firestore:', error);
  }
}

testFirestore();