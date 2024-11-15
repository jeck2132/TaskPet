// Access elements
const petContainer = document.getElementById('petContainer');
const petImage = document.getElementById('petImage');
const backgroundUpload = document.getElementById('backgroundUpload');
const petUpload = document.getElementById('petUpload');
const imageOptionsBtn = document.getElementById('imageOptionsBtn');
const uploadWindow = document.getElementById('uploadWindow');

// Flags to track if both images are uploaded
let backgroundUploaded = false;
let petUploaded = false;

// Open the Pet Display Window (Modal)
function openPetWindow() {
    petContainer.style.display = 'block';
}

// Toggle the upload window inside the modal
imageOptionsBtn.addEventListener('click', () => {
    if (uploadWindow.style.display === 'none') {
        uploadWindow.style.display = 'block';
    } else {
        uploadWindow.style.display = 'none';
    }
});

// Handle background image upload and resize
backgroundUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            // Save the background image URL to localStorage
            localStorage.setItem('backgroundImage', e.target.result);
            petContainer.style.backgroundImage = `url(${e.target.result})`;
            petContainer.style.backgroundSize = 'cover'; // Ensure background covers the entire area
            backgroundUploaded = true;
        };
        reader.readAsDataURL(file);
    }
});

// Handle pet image upload and resize
petUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            // Save the pet image URL to localStorage
            localStorage.setItem('petImage', e.target.result);
            petImage.src = e.target.result;
            petImage.style.display = 'block';
            petUploaded = true;
        };
        reader.readAsDataURL(file);
    }
});

// Load images from localStorage when the page is loaded
window.onload = function () {
    openPetWindow(); // This ensures the window opens on page load

    // Check if the images are stored in localStorage
    const storedBackgroundImage = localStorage.getItem('backgroundImage');
    const storedPetImage = localStorage.getItem('petImage');

    // If background image is stored, apply it
    if (storedBackgroundImage) {
        petContainer.style.backgroundImage = `url(${storedBackgroundImage})`;
        petContainer.style.backgroundSize = 'cover';
        backgroundUploaded = true;
    }

    // If pet image is stored, apply it
    if (storedPetImage) {
        petImage.src = storedPetImage;
        petImage.style.display = 'block';
        petUploaded = true;
    }
};