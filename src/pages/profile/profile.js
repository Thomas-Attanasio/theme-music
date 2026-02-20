// Import the Fiebase tools
import { auth, db, storage } from '../../js/firebase-config.js';
import { ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { doc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';


// Here we get the references to HTML elements using thei IDs
const usernameInput = document.getElementById('username');
const bioInput = document.getElementById('bio');
const ytLinkInput = document.getElementById('ytLink');
const pfForm = document.getElementById('pfForm');
const fileInput = document.getElementById('fileInput');
const userImg = document.getElementById('userImg');
const avatarPreview = document.getElementById('avatarPreview');
const plusIcon = document.getElementById('plusIcon');
const songCoverInput = document.getElementById('songCoverInput');
const songCoverImg = document.getElementById('songCover');
const songCoverContainer = document.querySelector('.songCover');


// This function check if there's the user logged in
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // If the user exist, let's look for they're data in Firestore
        try {
            // Enter in the 'users' directory and in the file with the user ID
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                // If the file exist, take the username and write it in the input
                usernameInput.value = userDoc.data().username;
            }
        }
        catch (error) {
            console.error('Error while loading the data: ', error);
        }
    }
    else {
        // If there is no user logged in just redirect them in the login page
        window.location.href = '../auth/login/login.html';
    }
});


// If the user click on the circle, it's like clicking on the 'Select the file' button
avatarPreview.onclick = () => fileInput.click();

fileInput.onchange = (e) => {
    // Take the chosen file
    const file = e.target.files[0];

    if (file) {
        // Create a temporary URL to see the foto in the circle
        userImg.src = URL.createObjectURL(file);
        userImg.style.display = 'block'; // Load the image
        plusIcon.style.display = 'none'; // Hide the '+' symbol
    }
};


// If the user click on the square, it's like clicking on the 'Select the file' button
songCoverContainer.onclick = () => songCoverInput.click();

songCoverInput.onchange = (e) => {
    const file = e.target.files[0];

    if (file) {
        songCoverImg.src = URL.createObjectURL(file);
        songCoverImg.style.display = 'block';
    }
}


// This function is used to transform a very long link in to a very short ID
// We are using to take an ID from a YouTube link
function getYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}


// Add an event when the 'Let's Go!' button is clicked
pfForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const user = auth.currentUser; // Take the current user
    const ytID = getYouTubeId(ytLinkInput.value); // Take the ID from the yt link
    const pfpFile = fileInput.files[0]; // Take the selected file
    const songCoverFile = songCoverInput.files[0];


    // Check if the link is not correct
    if (ytLinkInput.value !== '' && !ytID) {
        alert('The YouTube link seems to be not valid! Check it.');
        return;
    }


    // Disabled the button to prevent multiple click during the upload
    const saveButton = document.getElementById('saveButton');
    saveButton.disabled = true;
    saveButton.innerText = 'Uploading vibes...';


    try {
        // Aim in the database 'users' document
        const userRef = doc(db, 'users', user.uid);
        let profilePicUrl = '';
        let songCoverUrl = '';


        // Managing the photo upload
        if (pfpFile) {
            // Create a reference in the storage: users/USER_ID/profilePic
            const pfpRef = ref(storage, `profilePictures/${user.uid}`);


            // Load the file
            await uploadBytes(pfpRef, pfpFile);


            // Obtain the public URL
            profilePicUrl = await getDownloadURL(pfpRef);
        }

        if (songCoverFile) {
            const songCoverRef = ref(storage, `songCovers/${user.uid}`);
            await uploadBytes(songCoverRef, songCoverFile);
            songCoverUrl = await getDownloadURL(songCoverRef);
        }


        // Updating Firestore
        const updateData = {
            bio: bioInput.value,
            firstSongId: getYouTubeId(ytLinkInput.value) || '',
            setupComplete: true
        }


        // Adding the photo URL if it has been loaded
        if (profilePicUrl) updateData.profilePicUrl = profilePicUrl;
        if (songCoverUrl) updateData.songCoverUrl = songCoverUrl;

        await updateDoc(userRef, updateData);


        // If everything went good let's take the user in the home page
        window.location.href = '../home/home.html';
    }
    catch (error) {
        console.error('Error while saving: ', error);

        alert('There was an error while saving the data.');
        saveButton.disabled = false;
        saveButton.innerText = `Let's Go!`;
    }
});