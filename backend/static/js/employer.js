document.addEventListener("DOMContentLoaded", () => {
    // Logout functionality
    const logoutLink = document.getElementById("logoutLink");

    logoutLink.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent default navigation
        alert("You have been logged out successfully.");
        window.location.href = "index.html"; // Redirect to homepage
    });

    // JavaScript to handle Accept/Decline actions
    const acceptButtons = document.querySelectorAll(".accept-btn");
    const declineButtons = document.querySelectorAll(".decline-btn");

    acceptButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const row = e.target.closest("tr");
            row.style.backgroundColor = "#d4edda"; // Green background for accepted
            row.style.opacity = "0.6"; // Dim the row
        });
    });

    declineButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const row = e.target.closest("tr");
            row.style.backgroundColor = "#f8d7da"; // Red background for declined
            row.style.opacity = "0.6"; // Dim the row
        });
    });
});
