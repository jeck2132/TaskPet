// Access elements
const petContainer = document.getElementById('petContainer');
const petImage = document.getElementById('petImage');
const backgroundUpload = document.getElementById('backgroundUpload');
const petUpload = document.getElementById('petUpload');
const imageOptionsBtn = document.getElementById('imageOptionsBtn');
const uploadWindow = document.getElementById('uploadWindow');
const healthBar = document.createElement('div'); // Add the health bar element

// Flags to track if both images are uploaded
let backgroundUploaded = false;
let petUploaded = false;

// Create the "Clear Images" button
const clearImagesBtn = document.createElement('button');
clearImagesBtn.textContent = 'Clear Images';
clearImagesBtn.style.backgroundColor = '#f44336'; // Red color for emphasis
clearImagesBtn.style.color = 'white';
clearImagesBtn.style.padding = '10px';
clearImagesBtn.style.border = 'none';
clearImagesBtn.style.cursor = 'pointer';
clearImagesBtn.style.marginTop = '10px';
uploadWindow.appendChild(clearImagesBtn);

// Health logic
let health = parseInt(localStorage.getItem('petHealth')) || 100; // Default health is 100

// Update health bar
healthBar.style.width = '100%';
healthBar.style.height = '20px';
healthBar.style.backgroundColor = health > 50 ? 'green' : health > 20 ? 'orange' : 'red';
healthBar.style.color = 'white';
healthBar.style.textAlign = 'center';
healthBar.style.lineHeight = '20px';
healthBar.textContent = `Health: ${health}`;
petContainer.appendChild(healthBar);

function updateHealthBar() {
    healthBar.style.width = `${health}%`;
    healthBar.style.backgroundColor = health > 50 ? 'green' : health > 20 ? 'orange' : 'red';
    healthBar.textContent = `Health: ${health}`;
    localStorage.setItem('petHealth', health);
}

// Decrease health every hour
setInterval(() => {
    health = Math.max(health - 5, 0);
    updateHealthBar();
}, 3600000); // 1 hour in milliseconds

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
            localStorage.setItem('petImage', e.target.result);
            petImage.src = e.target.result;
            petImage.style.display = 'block';
            petUploaded = true;
        };
        reader.readAsDataURL(file);
    }
});

// Clear images and reset localStorage
clearImagesBtn.addEventListener('click', () => {
    petContainer.style.backgroundImage = '';
    petImage.src = '';
    petImage.style.display = 'none';
    backgroundUploaded = false;
    petUploaded = false;
    localStorage.removeItem('backgroundImage');
    localStorage.removeItem('petImage');
});

// Load images from localStorage when the page is loaded
window.onload = function () {
    openPetWindow();

    const storedBackgroundImage = localStorage.getItem('backgroundImage');
    const storedPetImage = localStorage.getItem('petImage');

    if (storedBackgroundImage) {
        petContainer.style.backgroundImage = `url(${storedBackgroundImage})`;
        petContainer.style.backgroundSize = 'cover';
        backgroundUploaded = true;
    }

    if (storedPetImage) {
        petImage.src = storedPetImage;
        petImage.style.display = 'block';
        petUploaded = true;
    }

    updateHealthBar(); // Ensure health bar is displayed on load
};
