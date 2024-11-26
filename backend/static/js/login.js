document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent the default form submission

        const email = document.getElementById("username").value;  // Make sure the field ID matches
        const password = document.getElementById("password").value;
        const selectedRole = document.getElementById("role").value;

        // Validate fields
        if (!email || !password || !selectedRole) {
            alert("Please fill in all fields.");
            return;
        }

        // Retrieve user data from localStorage
        const storedUser = localStorage.getItem(email);

        if (storedUser) {
            const user = JSON.parse(storedUser);

            // Validate password
            if (user.password !== password) {
                alert("Incorrect password.");
                return;
            }

            // Validate if the user selected the correct role
            if (user.role !== selectedRole) {
                alert("Role does not match the stored account information.");
                return;
            }

            // Store user information in sessionStorage for the current session
            sessionStorage.setItem("loggedInName", user.name);
            sessionStorage.setItem("loggedInRole", user.role);

            // Redirect based on role
            if (user.role === "employee") {
                alert(`Welcome, ${user.name}! Redirecting to Employee Portal...`);
                window.location.href = "employee.html";  // Redirect to employee portal
            } else if (user.role === "hr" || user.role === "therapist") {
                alert(`Welcome, ${user.name}! Redirecting to Employer Portal...`);
                window.location.href = "employer.html";  // Redirect to employer portal
            } else {
                alert("Invalid role selected.");
            }
        } else {
            alert("No account found with this email. Please sign up first.");
        }
    });
});
