import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js';
import { collection, getDocs, getFirestore } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyCKcHOjMgXwi-Dc6AnuhkdAFvq8sUilHZI",
  authDomain: "thrivein-dev-v1.firebaseapp.com",
  projectId: "thrivein-dev-v1",
  storageBucket: "thrivein-dev-v1.appspot.com",
  messagingSenderId: "702104523475",
  appId: "1:702104523475:web:408fec5b1b1208b2253a26"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

// Reference to the "consultation_service" collection
const consultationServiceCollection = collection(database, 'consultation_service');

try {
  const querySnapshot = await getDocs(consultationServiceCollection);

  const allData =[];
  
  querySnapshot.forEach((serviceDoc) => {
    const serviceData = serviceDoc.data();
    allData.push(serviceData);
  });
  console.log("list : ", allData);
} catch(error){
  console.error('error', error);
} 

