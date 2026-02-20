import { auth, db } from '../../../js/firebase-config.js';
import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { doc, setDoc, collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';


// Real time username check
const usernameInput = document.getElementById('username');
const errorUsername = document.getElementById('errorUsername');

// The error will appear if the user click away from the input
usernameInput.addEventListener('blur', async () => {
    const username = usernameInput.value.trim();
    if (username === '') {
        errorUsername.textContent = '';
        return;
    }

    try {
        const q = query(collection(db, 'users'), where('username', '==', username));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            errorUsername.textContent = `${username} already exists!`;
            usernameInput.classList.add('errorInput');
        }
        
        usernameInput.addEventListener('input', () => {
            errorUsername.textContent = '';
            usernameInput.classList.remove('errorInput');
        });
    }
    catch (e) {
        console.error('Error while checking the username: ', e);
    }
});


//Real time email check
const emailInput = document.getElementById('email');
const errorEmail = document.getElementById('errorEmail');

emailInput.addEventListener('blur', async () => {
    const email = emailInput.value.trim();
    if (email === '') {
        errorEmail.textContent = '';
        return;
    }

    try {
        const q = query(collection(db, 'users'), where('email', '==', email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            errorEmail.textContent = 'Email already in use!';
            emailInput.classList.add('errorInput');
        }
        
        emailInput.addEventListener('input', () => {
            errorEmail.textContent = '';
            emailInput.classList.remove('errorInput');
        });
    }
    catch (e) {
        console.error('Error while checking the email: ', e);
    }
});


// Real time password check
const passowordInput = document.getElementById('password');
const errorPassword = document.getElementById('errorPassword');

passowordInput.addEventListener('input', () => {
    const pass = passowordInput.value;

    if (pass.length > 0 && pass.length < 6) {
        errorPassword.textContent = 'Password too weak! (Min. 6 chars)';
        passowordInput.classList.add('errorInput');
    }
    else {
        errorPassword.textContent = '';
        passowordInput.classList.remove('errorInput');
    }
});


document.getElementById('signUpForm').addEventListener('submit', async (e) => {
    e.preventDefault();


    // Clean the previous errors
    document.querySelectorAll('.errorText').forEach(item => item.textContent = '');


    // Read the user data
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const password = document.getElementById('password').value;

    try {
        // Check if the username already exists
        const q = query(collection(db, 'users'), where('username', '==', username));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            document.getElementById('errorUsername').textContent = `${username} already exists!`;
            return;
        }


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
        window.location.href = '../../profile/profile.html';
    }
    catch (error) {
        console.error('Error: ', error.code);


        // Mapping the errors in the correct fields
        switch (error.code) {
            case 'auth/email-already-in-use':
                document.getElementById('errorEmail').textContent = 'Email already in use!';
                break;
            case 'auth/invalid-email':
                document.getElementById('errorEmail').textContent = 'Invalid email format!';
                break;
            case 'auth/weak-password':
                document.getElementById('errorPassword').textContent = 'Password too weak! (Min. 6 chars)';
                break;
            case 'permission-denied':
                document.getElementById('genericError').textContent = 'System error: Database permissions not configured!'
                break;
            default:
                document.getElementById('genericError').textContent = `Unexpected error: ${error.message}`;
        }
    }
});