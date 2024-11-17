// JavaScript for Employee Portal

document.addEventListener("DOMContentLoaded", () => {
  // Logout functionality
  const logoutLink = document.getElementById("logoutLink");

  logoutLink.addEventListener("click", (e) => {
      e.preventDefault(); // Prevent default navigation
      alert("You have been logged out successfully.");
      window.location.href = "index.html"; // Redirect to homepage
  });

  // Notifications dropdown functionality
  const notificationButton = document.getElementById("notificationButton");
  const notificationDropdown = document.getElementById("notificationDropdown");

  notificationButton.addEventListener("click", () => {
      notificationDropdown.classList.toggle("show");
  });

  // Form submission handlers
  const physioForm = document.getElementById("physioForm");
  const painForm = document.getElementById("painForm");

  physioForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const workId = document.getElementById("workId").value;
      const date = document.getElementById("date").value;
      const time = document.getElementById("time").value;

      alert(
          `Physiotherapy request submitted:\nName: ${name}\nWork ID: ${workId}\nPreferred Date: ${date}\nPreferred Time: ${time}`
      );

      physioForm.reset(); // Clear form fields
  });

  painForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const painDescription = document.getElementById("painDescription").value;

      alert(`Pain description sent:\n${painDescription}`);

      painForm.reset(); // Clear form fields
  });
});
