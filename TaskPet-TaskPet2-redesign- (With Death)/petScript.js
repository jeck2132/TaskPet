// Access elements
const petContainer = document.getElementById('petContainer');
const petImage = document.getElementById('petImage');
const backgroundUpload = document.getElementById('backgroundUpload');
const petUpload = document.getElementById('petUpload');
const imageOptionsBtn = document.getElementById('imageOptionsBtn');
const uploadWindow = document.getElementById('uploadWindow');
const healthBar = document.createElement('div'); // Add the health bar element
const deadMessage = document.createElement('div'); // Add the dead message element
const restoreButton = document.createElement('button'); // Add the restore button

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

// Create the "Restore Pet" button
restoreButton.textContent = 'Restart';
restoreButton.style.backgroundColor = '#4CAF50'; // Green color for restore button
restoreButton.style.color = 'white';
restoreButton.style.padding = '10px';
restoreButton.style.border = 'none';
restoreButton.style.cursor = 'pointer';
restoreButton.style.marginTop = '10px';
uploadWindow.appendChild(restoreButton);

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

// Add "Your pet is dead!" message but keep it hidden initially
deadMessage.style.fontSize = '24px';
deadMessage.style.color = 'red';
deadMessage.style.fontWeight = 'bold';
deadMessage.style.textAlign = 'center';
deadMessage.style.paddingTop = '70px';
deadMessage.textContent = "Your pet is dead! IT IS DEAD AND GONE FOREVER!\n Go to options and press restart to try again!";
deadMessage.style.display = 'none'; // Hide it initially
petContainer.appendChild(deadMessage);

function updateHealthBar() {
    if (health <= 0) {
        // Clear images and display "Your pet is dead!" message when health reaches 0
        petContainer.style.backgroundImage = '';
        petImage.src = '';
        petImage.style.display = 'none';
        petContainer.style.backgroundColor = 'black'; // Optional: Set background to black
        healthBar.style.display = 'none'; // Hide the health bar when dead
        deadMessage.style.display = 'block'; // Show the dead message
        localStorage.removeItem('backgroundImage');
        localStorage.removeItem('petImage');
        return; // Stop further execution if pet is dead
    }

    // Ensure health bar is visible when the health is above 0
    healthBar.style.display = 'block'; // Make sure health bar is visible
    healthBar.style.width = `${health}%`;
    healthBar.style.backgroundColor = health > 50 ? 'green' : health > 20 ? 'orange' : 'red';
    healthBar.textContent = `Health: ${health}`;
    localStorage.setItem('petHealth', health);
}

// Decrease health every hour
setInterval(() => {
    if (health > 0) {
        health = Math.max(health - 5, 0);
        updateHealthBar();
    }
}, 250); // 1 hour in milliseconds

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

// Restore pet to its original state
restoreButton.addEventListener('click', () => {
    health = 100; // Reset health to 100
    updateHealthBar(); // Update health bar display
    
    // Reset the images and hide the "Your pet is dead!" message
    petContainer.style.backgroundImage = '';
    petImage.src = '';
    petImage.style.display = 'none';
    petContainer.style.backgroundColor = ''; // Restore background color to default
    deadMessage.style.display = 'none'; // Hide the dead message
    
    // Reset any uploaded images from localStorage
    localStorage.removeItem('backgroundImage');
    localStorage.removeItem('petImage');
    
    backgroundUploaded = false;
    petUploaded = false;
    
    healthBar.style.display = 'block'; // Ensure health bar is visible after restore
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
