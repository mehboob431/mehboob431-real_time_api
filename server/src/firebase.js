
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyALxwa5mbIjUgQbMDK-3_TXZy71Syvf8Ys",
    authDomain: "tablebook-34016.firebaseapp.com",
    projectId: "tablebook-34016",
    storageBucket: "tablebook-34016.appspot.com",
    messagingSenderId: "15200692769",
    appId: "1:15200692769:web:2ce97fdd7d4197dbd75160",
    measurementId: "G-NEPB4ETDHR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Request permission and get FCM token
export const requestNotificationPermission = async () => {
    try {
        const token = await getToken(messaging, { vapidKey: "YOUR_VAPID_KEY" });
        if (token) {
            console.log("FCM Token:", token);
            return token;
        }
    } catch (error) {
        console.error("Permission denied or error:", error);
    }
};

// Listen for foreground messages
onMessage(messaging, (payload) => {
    console.log("Notification received:", payload);
    // Show the notification on the UI if desired
});
