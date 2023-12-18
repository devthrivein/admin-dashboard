// Import Firebase modules using full import path
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js';
import { addDoc, collection, getFirestore, onSnapshot, orderBy, query, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js';

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
  const chatMessagesElement = document.getElementById("chatMessages");
  chatMessagesElement.innerHTML = "";

  messages.forEach((message) => {
    const listItem = document.createElement("li");
    listItem.classList.add("mb-4");

    const messageContainer = document.createElement("div");
    messageContainer.classList.add("flex", "items-start");

    const avatar = document.createElement("div");
    avatar.classList.add("flex-shrink-0", "h-8", "w-8", "rounded-full", "bg-gray-300");
    // You can replace the above background color with an actual user avatar

    const contentContainer = document.createElement("div");
    contentContainer.classList.add("ml-3");

    const messageBubble = document.createElement("div");
    messageBubble.classList.add("p-3", "rounded-lg");

    const messageText = document.createElement("p");
    messageText.classList.add("text-sm");

    if (message.userId === "admin") {
      // Align admin's messages to the right
      messageContainer.classList.add("justify-end");
      messageBubble.classList.add("bg-blue-600", "text-white");
    } else {
      // Align regular messages to the left
      messageBubble.classList.add("bg-yellow-500", "text-white");
    }

    messageText.textContent = message.message;

    messageBubble.appendChild(messageText);
    contentContainer.appendChild(messageBubble);
    messageContainer.appendChild(avatar);
    messageContainer.appendChild(contentContainer);
    listItem.appendChild(messageContainer);

    // Use insertBefore to add the message at the bottom
    chatMessagesElement.insertBefore(listItem, chatMessagesElement.firstChild);
  });
}


const sendMessage = async (userId, serviceId, message, fileUrl) => {
  const collectionRef = collection(database, "consultation_service", serviceId, `messages-from-${userId}`);

  try {
    await addDoc(collectionRef, {
      userId,
      message,
      admin: true,
      createdAt: serverTimestamp(),
      fileUrl: '',

    });
  } catch (error) {
    console.error("Error sending message: ", error);
  }
};


 document.addEventListener("DOMContentLoaded", async function () {
    try {
      const bearerToken = ''; 
      const serviceIdList = document.getElementById('serviceIdList');
      const serviceDetailsContent = document.getElementById('serviceDetailsContent');
      const uniqueServiceIds = new Set();

    serviceIdList.innerHTML = ''; 

    // Fetch data from the API with the Bearer token
    const response = await fetch('https://thrivein-api-v1-0-0-sxbz2gldiq-et.a.run.app/consultation-service', {
      headers: {
        'Authorization': `Bearer ${bearerToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();

        data.forEach(service => {
      const serviceId = service.service_id;

      if (!uniqueServiceIds.has(serviceId)) {
        const listItem = document.createElement('li');
        listItem.textContent = serviceId;
        listItem.classList.add('border-b', 'border-gray-300', 'p-4', 'hover:bg-gray-100', 'cursor-pointer');

listItem.addEventListener('click', async () => {
    try {
        const detailsResponse = await fetch(`https://thrivein-api-v1-0-0-sxbz2gldiq-et.a.run.app/consultation-service/${serviceId}`, {
            headers: {
                'Authorization': `Bearer ${bearerToken}`
            }
        });

        if (!detailsResponse.ok) {
            throw new Error(`Network response was not ok: ${detailsResponse.status} - ${detailsResponse.statusText}`);
        }

        const detailsData = await detailsResponse.json();
        serviceDetailsContent.innerHTML = ''; // Clear existing content

                detailsData.forEach(async item => {
            const detailsItem = document.createElement('li');
            const userId = item.collection_id.split('-').pop();
            detailsItem.textContent = `${userId}`;
            detailsItem.classList.add('border-b', 'border-gray-300', 'p-4', 'hover:bg-gray-100', 'cursor-pointer');

            // Use local variables for userId and serviceId to capture the correct values
            const clickedUserId = userId;
            const clickedServiceId = serviceId;

            detailsItem.addEventListener('click', async () => {
                // Fetch and display messages for the clicked userId and clickedServiceId
                await getMessages(clickedUserId, clickedServiceId);
            });

            serviceDetailsContent.appendChild(detailsItem);
        });
    } catch (error) {
        console.error('Error fetching details:', error);
    }
});

serviceIdList.appendChild(listItem);
uniqueServiceIds.add(serviceId);
}
});
} catch (error) {
console.error('Error fetching data:', error);
}
});




const chatInput = document.getElementById("chatInput");
chatInput.addEventListener("keydown", async (event) => {
  if (event.key === "Enter" && chatInput.value.trim() !== "") {
    const message = chatInput.value.trim();
    await sendMessage(userId, serviceId, message);
    chatInput.value = "";
  }
});