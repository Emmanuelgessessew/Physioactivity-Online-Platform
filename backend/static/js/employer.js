document.addEventListener("DOMContentLoaded", () => {
    // Logout functionality
    const logoutLink = document.getElementById("logoutLink");

    logoutLink.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent default navigation
        alert("You have been logged out successfully.");
        window.location.href = "index.html"; // Redirect to homepage
    });

    // JavaScript to handle Accept/Decline actions with confirmation and API call
    const acceptButtons = document.querySelectorAll(".accept-btn");
    const declineButtons = document.querySelectorAll(".decline-btn");

    acceptButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const row = e.target.closest("tr");

            // Confirm acceptance
            const confirmAccept = window.confirm("Are you sure you want to accept this request?");
            if (confirmAccept) {
                row.style.backgroundColor = "#d4edda"; // Green background for accepted
                row.style.opacity = "0.6"; // Dim the row
                row.querySelector(".status").textContent = "Accepted"; // Update the status cell

                // Make the API call to update the request status on the server
                fetch('/update-request-status', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        requestId: row.dataset.id, // Assume that each row has a unique ID, set via `data-id`
                        status: 'accepted' // The new status
                    })
                })
                .then(response => response.json())
                .then(data => {
                    // Handle server response, if necessary
                    console.log('Request accepted successfully:', data);
                })
                .catch(error => console.error('Error:', error));
            }
        });
    });

    declineButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const row = e.target.closest("tr");

            // Confirm decline
            const confirmDecline = window.confirm("Are you sure you want to decline this request?");
            if (confirmDecline) {
                row.style.backgroundColor = "#f8d7da"; // Red background for declined
                row.style.opacity = "0.6"; // Dim the row
                row.querySelector(".status").textContent = "Declined"; // Update the status cell

                // Make the API call to update the request status on the server
                fetch('/update-request-status', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        requestId: row.dataset.id, // Assume that each row has a unique ID, set via `data-id`
                        status: 'declined' // The new status
                    })
                })
                .then(response => response.json())
                .then(data => {
                    // Handle server response, if necessary
                    console.log('Request declined successfully:', data);
                })
                .catch(error => console.error('Error:', error));
            }
        });
    });
});
