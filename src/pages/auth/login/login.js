import { auth } from "../../../js/firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Read the user data
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Login the user
        await signInWithEmailAndPassword(auth, email, password);


        // Took the user in the Home Page after the login
        window.location.href = '../../profile/profile.html';
    }
    catch (error) {
        console.error('Login error: ', error.code);
        alert('Credentials not valid or user not found!');
    }
});