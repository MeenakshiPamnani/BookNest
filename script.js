// Constants for login functionality
const loginButton = document.querySelector(".right .log button");
let loginPage = document.querySelector(".login");
const closeButton = document.querySelector(".close button");
let quote = document.querySelector(".container .quote");
let dropdownButton = document.querySelector(".right .btn button");
let dropdownMenu = document.querySelector(".dropdown ul");

// Show the login form
loginButton.addEventListener("click", (evt) => {
    evt.preventDefault();
    loginPage.style.display = "block";
    quote.style.zIndex = "0";
    loginPage.style.zIndex = "1";
});

// Close the login form
closeButton.addEventListener("click", (evt) => {
    evt.preventDefault();
    loginPage.style.display = "none";
    quote.style.zIndex = "1";
});

// Show dropdown menu
dropdownButton.addEventListener("click", (evt) => {
    evt.preventDefault();
    dropdownMenu.style.display = "block";
});

// Handle login form submission
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(loginForm);
        const data = Object.fromEntries(formData.entries());

        console.log('Form Data:', data);

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message);
                // Close the login form on successful login
                loginPage.style.display = "none";
                quote.style.zIndex = "1";
            } else {
                const errorResult = await response.json();
                alert(errorResult.error);
            }
        } catch (error) {
            console.error('Network error:', error);
            alert('Network error. Please try again later.');
        }
    });
});
