//RegisterAdmin
 async function registerAdmin() {
      const adminName = document.getElementById('admin_name').value;
      const password = document.getElementById('password').value;

      const apiUrl = 'https://thrivein-api-v1-0-0-sxbz2gldiq-et.a.run.app/registerAdmin';

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            admin_name: adminName,
            password: password,
          }),
        });

        const data = await response.json();

        if (response.status === 401) {
          alert(data.error); // Admin already registered
        } else {
          // Handle successful registration
          alert('Admin registered successfully!');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during registration. Please try again later.');
      }
    }

//login
async function loginAdmin() {
  const adminName = document.getElementById('admin_name').value;
  const password = document.getElementById('password').value;

  const apiUrl = 'https://thrivein-api-v1-0-0-sxbz2gldiq-et.a.run.app/loginAdmin';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        admin_name: adminName,
        password: password,
      }),
    });

    const data = await response.json();

    if (response.status === 201) {
      // Redirect to index.html on successful login
      console.log('success')
       window.location.href = 'index.html';

        const adminNameDisplay = document.getElementById('adminNameDisplay');
        adminNameDisplay.textContent = `Welcome, ${adminName}!`;
    } else {
      console.error('Login failed:', data);
      alert('Login failed. Please check your credentials.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred during login. Please try again later.');
  }
}

//logout
function logoutAdmin() {
  window.location.href = 'login.html';
}