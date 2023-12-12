// Import Firebase modules using full import path
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js';
import { collection, getFirestore, onSnapshot, orderBy, query } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js';

const firebaseConfig = {

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

// Function to get chat messages

function getMessages(userId, serviceId) {
  // Reference to the subcollection "messages-from-$userId" within the document "serviceId"
  const collectionReference = collection(database, "consultation_service", serviceId, `messages-from-${userId}`);

  // Create a query to order the documents by "createdAt" in descending order
  const q = query(collectionReference, orderBy("createdAt", "desc"));

  console.log("Collection Reference:", collectionReference);
  console.log("Query:", q);

  // Set up a snapshot listener to react to changes in the data
  onSnapshot(q, (snapshot) => {
    console.log("Snapshot received:", snapshot.docs.length);

    if (!snapshot.empty) {
      const messagesList = snapshot.docs.map((doc) => doc.data());
      console.log("Messages list:", messagesList);

      // Display the messages in the UI
      displayMessages(messagesList);
    } else {
      console.log("No messages found.");
      // Handle the case when there are no messages
      displayNoMessages();
    }
  }, (error) => {
    console.error("Error fetching messages:", error);

    // Log the full error object
    console.error("Full error object:", error);

    // Handle the error case
    displayError();
  });
}

function displayMessages(messages) {
  console.log("Displaying messages:", messages);

  const chatMessagesElement = document.getElementById("chatMessages");
  chatMessagesElement.innerHTML = "";

  messages.forEach((message) => {
    const listItem = document.createElement("li");

    // Customize the message display based on your needs
    const messageText = message.transactionChat
      ? `Transaction Chat: ${message.message}`
      : `Regular Chat: ${message.message}`;

    listItem.textContent = `${message.userId} (${message.createdAt.toDate()}): ${messageText}`;
    chatMessagesElement.appendChild(listItem);
  });
}

function displayNoMessages() {
  // Handle the case when there are no messages
  console.log("No messages to display.");
}

function displayError() {
  // Handle the error case
  console.log("An error occurred while fetching messages. Please check the console for details.");
}

// Example usage
const userId = "1b8d0459-5479-4dd7-8ff0-5043bf0d47c5";
const serviceId = "OFF001";
getMessages(userId, serviceId);
