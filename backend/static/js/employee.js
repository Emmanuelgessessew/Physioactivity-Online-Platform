document.addEventListener("DOMContentLoaded", () => {

    // Logout functionality
    const logoutLink = document.getElementById("logoutLink");

    if (logoutLink) {
        logoutLink.addEventListener("click", (e) => {
            e.preventDefault(); // Prevent default navigation
            alert("You have been logged out successfully.");
            window.location.href = "/"; // Redirect to homepage (ensure it's correct for your app)
        });
    }

    // Notifications dropdown functionality
    const notificationButton = document.getElementById("notificationButton");
    const notificationDropdown = document.getElementById("notificationDropdown");

    if (notificationButton) {
        notificationButton.addEventListener("click", () => {
            notificationDropdown.classList.toggle("show");
        });
    }

    // Form submission handler for physiotherapy request
    const physioForm = document.getElementById("physioForm");

    if (physioForm) {
        physioForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("name").value;
            const workId = document.getElementById("workId").value;
            const date = document.getElementById("date").value;
            const time = document.getElementById("time").value;

            // Create a request object (could also be sent to the backend via fetch)
            const physioRequest = {
                name,
                workId,
                date,
                time
            };

            // For now, store it in localStorage (in a real app, this should be sent to a server)
            localStorage.setItem(`physioRequest-${workId}`, JSON.stringify(physioRequest));

            alert(
                `Physiotherapy request submitted:\nName: ${name}\nWork ID: ${workId}\nPreferred Date: ${date}\nPreferred Time: ${time}`
            );

            physioForm.reset(); // Clear form fields
        });
    }

    // Form submission handler for pain description
    const painForm = document.getElementById("painForm");

    if (painForm) {
        painForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const painDescription = document.getElementById("painDescription").value;

            // Create a pain description object (could also be sent to the backend via fetch)
            const painDetails = {
                description: painDescription,
                date: new Date().toLocaleString() // Optionally add timestamp
            };

            // Store the pain description in localStorage for this user
            localStorage.setItem(`painDescription-${localStorage.getItem("loggedInUser")}`, JSON.stringify(painDetails));

            alert(`Pain description sent:\n${painDescription}`);

            painForm.reset(); // Clear form fields
        });
    }

});
