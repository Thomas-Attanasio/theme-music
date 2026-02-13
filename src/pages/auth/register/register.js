import { auth, db } from '../../../js/firebase-config.js';
import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { doc, setDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

document.getElementById('signUpForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Read the user data
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const password = document.getElementById('password').value;

    try {
        // Create the user in the Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;


        // Save extra data in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            username: username,
            email: email,
            phoneNumber: phoneNumber,
            createdAt: new Date()
        });

        // Took the user in the Home Page after the registration
        window.location.href = '../../home/home.html';
    }
    catch (error) {
        console.error('Error during the registration: ', error.code);
        alert('Error: ' + error.message);
    }
});