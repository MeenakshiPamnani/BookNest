document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(signupForm);
        const data = Object.fromEntries(formData.entries());

        console.log('Form Data:', data);

        try {
            const response = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message);
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
