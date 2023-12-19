// INI UNTUK CHAT-SECTION



import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js';
import { addDoc, collection, getFirestore, onSnapshot, orderBy, query, serverTimestamp } from 'https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js';


//Configurasi ke firebase menggunakan web app
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// Initialisasi Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);

// variable global 
let userId;
let serviceId;


// Fungsi dapet message berdasarkan userId dan serviceId
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

// Menampilkkan messagess ke html
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


// send messages error (undefine userId dan serviceId)
// Mengirim pesan (data yg dikirim ketika kirim pesan dari admin dashboard)
const sendMessage = async (userId, serviceId, message, fileUrl) => {
  const collectionRef = collection(database, "consultation_service", serviceId, `messages-from-${userId}`);

  try {
    await addDoc(collectionRef, {
      userId,
      message,
      admin: true,
      createdAt: serverTimestamp(),
      fileUrl: fileUrl || '', // Use fileUrl if provided, otherwise an empty string
    });
  } catch (error) {
    console.error("Error sending message: ", error);
  }
};
// dari button
document.getElementById('sendMessageBtn').addEventListener('click', async () => {
  const chatInput = document.getElementById("chatInput");
  const message = chatInput.value.trim();

  if (message !== "" && userId && serviceId) {
    await sendMessage(userId, serviceId, message);
    chatInput.value = "";
  } else {
    console.error("Invalid userId, serviceId, or empty message.");
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

// ini fetch api untuk get list serviceId dan UserId 

 document.addEventListener("DOMContentLoaded", async function () {
    try {
      const bearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0NzEyZTNhZC0yMGJmLTRmZWEtYmMxNS05MzJiN2JiYTRlMzgiLCJuYW1lIjoiYWRtaW4iLCJleHAiOjE3MDI5OTgzNTl9.k1WZAQUGItFFNw1K5MUOAgbIygWvNIJMvcc1yl3cnfg'; 
      const serviceIdList = document.getElementById('serviceIdList');
      const serviceDetailsContent = document.getElementById('serviceDetailsContent');
      const uniqueServiceIds = new Set();

    serviceIdList.innerHTML = ''; 
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
        serviceDetailsContent.innerHTML = ''; 

    //split userId agar mendapatkan idnya saja
    detailsData.forEach(async item => {
    const detailsItem = document.createElement('li');
    const userIdPrefix = "messages-from-";
    const userId = item.collection_id.substring(userIdPrefix.length);
    detailsItem.textContent = `${userId}`;
    detailsItem.classList.add('border-b', 'border-gray-300', 'p-4', 'hover:bg-gray-100', 'cursor-pointer');


  detailsItem.addEventListener('click', async () => {
 
    //setelah mendapatkan userId dan serviceId dibawa ke fungsi getMessages di atas 
  await getMessages(userId, serviceId);    });

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