document.addEventListener("DOMContentLoaded", () => {
    // Logout functionality
    const logoutLink = document.getElementById("logoutLink");
    if (logoutLink) {
        logoutLink.addEventListener("click", (e) => {
            e.preventDefault();
            alert("You have been logged out successfully.");
            window.location.href = "index.html";
        });
    }

    // Function to handle status updates
    const updateRequestStatus = (row, status) => {
        const confirmAction = window.confirm(`Are you sure you want to ${status} this request?`);
        if (!confirmAction) return;

        // Visual feedback
        row.style.backgroundColor = status === "accepted" ? "#d4edda" : "#f8d7da";
        row.style.opacity = "0.6";
        row.querySelector(".status").textContent = status.charAt(0).toUpperCase() + status.slice(1);

        // API call
        fetch('/update-request-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ requestId: row.dataset.id, status })
        })
        .then(response => {
            if (!response.ok) throw new Error("Failed to update status");
            return response.json();
        })
        .then(data => {
            console.log(`${status.charAt(0).toUpperCase() + status.slice(1)} successful`, data);
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`Failed to ${status} the request. Please try again.`);
        });
    };

    // Attach event listeners to accept and decline buttons
    const acceptButtons = document.querySelectorAll(".accept-btn");
    const declineButtons = document.querySelectorAll(".decline-btn");

    acceptButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const row = e.target.closest("tr");
            updateRequestStatus(row, "accepted");
        });
    });

    declineButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const row = e.target.closest("tr");
            updateRequestStatus(row, "declined");
        });
    });
});
