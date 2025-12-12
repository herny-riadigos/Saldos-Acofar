// =======================================================
// 🔥 CONFIGURACIÓN DE FIREBASE – Saldos Acofar Riadigos
// =======================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔧 Configuración del proyecto (reemplazá con tus datos reales)
const firebaseConfig = {
    apiKey: "AIzaSyA8ZmoitEfWCjlV21QXx7zun-UsqlpRr_8",
    authDomain: "saldos-acofar.firebaseapp.com",
    projectId: "saldos-acofar",
    storageBucket: "saldos-acofar.firebasestorage.app",
    messagingSenderId: "595263695528",
    appId: "1:595263695528:web:e6a40292aa7cbf27d4709d"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export { collection, addDoc, getDocs };
