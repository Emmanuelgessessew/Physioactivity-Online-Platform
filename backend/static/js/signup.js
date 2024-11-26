document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signupForm");

    signupForm.addEventListener("submit", (e) => {
        const role = document.getElementById("role").value;

        // If the user is an employee, require terms acceptance
        if (role === "employee") {
            const termsModal = document.getElementById("termsModal");

            if (termsModal) {
                e.preventDefault(); // Prevent default form submission
                termsModal.style.display = "block";

                const acceptTermsBtn = document.getElementById("acceptTerms");
                const declineTermsBtn = document.getElementById("declineTerms");

                acceptTermsBtn.addEventListener("click", () => {
                    termsModal.style.display = "none";
                    signupForm.submit(); // Submit the form after accepting terms
                });

                declineTermsBtn.addEventListener("click", () => {
                    termsModal.style.display = "none";
                    alert("You must accept the terms and conditions to proceed.");
                });
            }
        }
    });
});
