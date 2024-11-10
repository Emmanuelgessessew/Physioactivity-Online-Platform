document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signupForm");

    signupForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Prevent the default form submission

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const role = document.getElementById("role").value;

        const user = { name, email, password, role };

        // Check role and handle terms and conditions for employees only
        if (role === "employee") {
            const termsModal = document.getElementById("termsModal");
            termsModal.style.display = "block";

            const acceptTermsBtn = document.getElementById("acceptTerms");
            const declineTermsBtn = document.getElementById("declineTerms");

            acceptTermsBtn.addEventListener("click", () => {
                localStorage.setItem(email, JSON.stringify(user));
                alert("Account created successfully! Redirecting to login...");
                termsModal.style.display = "none";
                window.location.href = "login.html";
            });

            declineTermsBtn.addEventListener("click", () => {
                alert("You must accept the terms and conditions to sign up.");
                termsModal.style.display = "none";
            });
        } else {
            // Direct signup for employer roles
            localStorage.setItem(email, JSON.stringify(user));
            alert("Account created successfully! Redirecting to login...");
            window.location.href = "login.html";
        }
    });
});
