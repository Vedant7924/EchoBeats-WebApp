async function testLogin() {
    try {
        const response = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'admin@example.com',
                password: 'password123'
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Login failed: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log('Login successful:', data);
    } catch (error) {
        console.error('Login error:', error);
    }
}

testLogin();
