import { auth, db } from "../../../js/firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";


// Email and password
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');


document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear all the error messages
    document.querySelectorAll('.errorText').forEach(item => item.textContent = '');

    // Clear all the red border
    document.querySelectorAll('input').forEach(input => input.classList.remove('errorInput'));


    // Read the user data
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Login the user
        await signInWithEmailAndPassword(auth, email, password);


        // Took the user in the Profile Configuration Page after the login
        window.location.href = '../../profile/profile.html';
    }
    catch (error) {
        console.error('Error: ', error.code);


        // Mapping the errors in the correct fields
        switch(error.code) {
            case 'auth/invalid-email':
                document.getElementById('errorEmail').textContent = 'Invalid email format!';
                break;

            case 'auth/invalid-credential':
                document.getElementById('genericError').textContent = 'Email or password incorrect!';

                emailInput.classList.add('errorInput');
                passwordInput.classList.add('errorInput');
                break;
                
            case 'auth/too-many-request':
                document.getElementById('genericError').textContent = 'The account has been temporarily locked because too many consecutive failed login attempts have been made!';
                break;

            case 'auth/user-disabled':
                document.getElementById('genericError').textContent = 'The account has been disabled by the administrator!';
                break;

            case 'permission-denied':
                document.getElementById('genericError').textContent = 'System error: Database permissions not configured!'
                break;
        }
    }
});