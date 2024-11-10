document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", (e) => {
      e.preventDefault(); // Prevent the default form submission

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const selectedRole = document.getElementById("role").value;

      if (!selectedRole) {
          alert("Please select a role before logging in.");
          return;
      }

      // Retrieve user data from localStorage (optional validation)
      const storedUser = localStorage.getItem(email);

      if (storedUser) {
          const user = JSON.parse(storedUser);

          // Update session storage with the logged-in user's name and role
          sessionStorage.setItem("loggedInName", name);
          sessionStorage.setItem("loggedInRole", selectedRole);

          // Redirect based on role
          if (selectedRole === "employee") {
              alert(`Welcome, ${name}! Redirecting to Employee Portal...`);
              window.location.href = "employee.html";
          } else if (selectedRole === "hr" || selectedRole === "therapist") {
              alert(`Welcome, ${name}! Redirecting to Employer Portal...`);
              window.location.href = "employer.html";
          } else {
              alert("Invalid role selected.");
          }
      } else {
          alert("No account found with this email. Please sign up first.");
      }
  });
});
