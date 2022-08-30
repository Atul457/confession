// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
    apiKey: "AIzaSyCiYN-kSdQw6Rtxe7g15YMffE1iZtg94wE",
    authDomain: "the-talk-place-project.firebaseapp.com",
    projectId: "the-talk-place-project",
    storageBucket: "the-talk-place-project.appspot.com",
    messagingSenderId: "564992561843",
    appId: "1:564992561843:web:4873cd7344d53fadccd6c6",
    measurementId: "G-EYWYJJWFVL"
};

firebase.initializeApp(firebaseConfig);
// Initialize the Firebase app in the service worker by passing the generated config


// Retrieve firebase messaging in background

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});