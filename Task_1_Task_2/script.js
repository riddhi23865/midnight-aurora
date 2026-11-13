
document.addEventListener("DOMContentLoaded", () => {

    // GET HTML ELEMENTS

    const form = document.getElementById("registrationForm");

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const terms = document.getElementById("terms");

    const strengthBar = document.getElementById("strengthBar");
    const strengthText = document.getElementById("strengthText");

    const errorMessage = document.getElementById("errorMessage");
    const successMessage = document.getElementById("successMessage");

    const submitButton = document.getElementById("submitButton");
    const buttonText = document.getElementById("buttonText");

    // PASSWORD REQUIREMENTS

    const rules = {
        length: value => value.length >= 8 && value.length <= 64,
        upper: value => /[A-Z]/.test(value),
        lower: value => /[a-z]/.test(value),
        number: value => /\d/.test(value),
        special: value => /[^A-Za-z0-9\s]/.test(value) && !/\s/.test(value)
    };

    // CHECK PASSWORD STRENGTH

    function checkPasswordStrength(value) {

        const checks = [
            rules.length(value),
            rules.upper(value),
            rules.lower(value),
            rules.number(value),
            rules.special(value)
        ];

        const score = checks.filter(Boolean).length;

        const ruleIds = [
            "ruleLength",
            "ruleUpper",
            "ruleLower",
            "ruleNumber",
            "ruleSpecial"
        ];

        ruleIds.forEach((id, index) => {

            const element = document.getElementById(id);

            element.classList.toggle("valid", checks[index]);

        });

        const levels = [
            { text: "Password strength", width: "0%", level: "" },
            { text: "Very weak", width: "20%", level: "weak" },
            { text: "Weak", width: "40%", level: "weak" },
            { text: "Fair", width: "60%", level: "fair" },
            { text: "Good", width: "80%", level: "good" },
            { text: "Strong", width: "100%", level: "strong" }
        ];

        const current = levels[score];

        strengthBar.style.width = current.width;
        strengthBar.className = current.level;
        strengthText.textContent = current.text;

        return score === 5;
    }


    // VALIDATION MESSAGE

    function setError(field, message) {

        const input = document.getElementById(field);
        const error = document.getElementById(
            field === "confirmPassword" ? "confirmError" :
            field === "password" ? "passwordError" :
            field + "Error"
        );

        if (error) {
            error.textContent = message;
        }

        if (input) {
            input.classList.toggle("invalid", Boolean(message));
            input.classList.toggle("valid-input", !message && input.value.length > 0);
            input.setAttribute("aria-invalid", message ? "true" : "false");
        }
    }


    // VALIDATE NAME

    function validateName() {

        const value = name.value.trim();

        if (value.length < 3) {
            setError("name", "Name must contain at least 3 characters.");
            return false;
        }

        if (value.length > 80) {
            setError("name", "Name cannot exceed 80 characters.");
            return false;
        }

        if (!/^[\p{L}\p{M}]+(?:[ '\-][\p{L}\p{M}]+)*$/u.test(value)) {
            setError("name", "Please enter a valid name.");
            return false;
        }

        setError("name", "");
        return true;
    }


    // VALIDATE EMAIL

    function validateEmail() {

        const value = email.value.trim();

        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!pattern.test(value) || value.length > 254) {
            setError("email", "Please enter a valid email address.");
            return false;
        }

        setError("email", "");
        return true;
    }


    // VALIDATE PASSWORD

    function validatePassword() {

        const value = password.value;

        if (!checkPasswordStrength(value)) {
            setError("password", "Your password does not meet all requirements.");
            return false;
        }

        setError("password", "");

        if (confirmPassword.value) {
            validateConfirmPassword();
        }

        return true;
    }


    // VALIDATE CONFIRM PASSWORD

    function validateConfirmPassword() {

        if (confirmPassword.value !== password.value) {
            setError("confirmPassword", "Passwords do not match.");
            return false;
        }

        if (!confirmPassword.value) {
            setError("confirmPassword", "Please confirm your password.");
            return false;
        }

        setError("confirmPassword", "");
        return true;
    }


    // VALIDATE TERMS

    function validateTerms() {

        const error = document.getElementById("termsError");

        if (!terms.checked) {
            error.textContent = "You must accept the Terms and Conditions.";
            return false;
        }

        error.textContent = "";
        return true;
    }


    // LIVE VALIDATION

    name.addEventListener("input", validateName);

    email.addEventListener("input", validateEmail);

    password.addEventListener("input", validatePassword);

    confirmPassword.addEventListener("input", validateConfirmPassword);

    terms.addEventListener("change", validateTerms);


    // SHOW / HIDE PASSWORD

    document.querySelectorAll(".toggle-password").forEach(button => {

        button.addEventListener("click", () => {

            const input = document.getElementById(button.dataset.target);

            const isHidden = input.type === "password";

            input.type = isHidden ? "text" : "password";

            button.textContent = isHidden ? "Hide" : "Show";

            button.setAttribute("aria-label",
                isHidden ? "Hide password" : "Show password"
            );

            button.setAttribute("aria-pressed", String(isHidden));

        });

    });


    // FORM SUBMISSION

    form.addEventListener("submit", async event => {

        event.preventDefault();

        errorMessage.hidden = true;
        successMessage.hidden = true;

        // Run all validations
        const valid =
            validateName() &
            validateEmail() &
            validatePassword() &
            validateConfirmPassword() &
            validateTerms();

        if (!valid) {
            errorMessage.textContent = "Please correct the errors before continuing.";
            errorMessage.hidden = false;
            return;
        }

        // Loading state
        submitButton.disabled = true;
        buttonText.textContent = "Creating Account...";

        try {

            const response = await fetch("/api/register", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name.value.trim(),
                    email: email.value.trim(),
                    password: password.value,
                    confirmPassword: confirmPassword.value,
                    terms: terms.checked
                })

            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Registration failed.");
            }

            // DYNAMIC DOM UPDATE
            // Display submitted user information

            document.getElementById("displayName").textContent =
                data.user.name;

            document.getElementById("displayEmail").textContent =
                data.user.email;

            // Clear sensitive form values
            form.reset();

            strengthBar.style.width = "0%";
            strengthBar.className = "";
            strengthText.textContent = "Password strength";

            document.querySelectorAll(".password-rules li").forEach(item => {
                item.classList.remove("valid");
            });

            document.querySelectorAll(".input-group input").forEach(input => {
                input.classList.remove("valid-input", "invalid");
                input.setAttribute("aria-invalid", "false");
            });

            // Navigate without refreshing
            Router.navigate("/success");

        } catch (error) {

            errorMessage.textContent = error.message;
            errorMessage.hidden = false;

        } finally {

            submitButton.disabled = false;
            buttonText.textContent = "Create My Account";

        }

    });


    // REGISTER ANOTHER USER

    document.getElementById("registerAgain").addEventListener("click", () => {

        form.reset();

        document.querySelectorAll(".field-error").forEach(element => {
            element.textContent = "";
        });

        document.querySelectorAll(".input-group input").forEach(input => {
            input.classList.remove("valid-input", "invalid");
            input.setAttribute("aria-invalid", "false");
        });

        errorMessage.hidden = true;
        successMessage.hidden = true;

        strengthBar.style.width = "0%";
        strengthBar.className = "";
        strengthText.textContent = "Password strength";

        document.querySelectorAll(".password-rules li").forEach(item => {
            item.classList.remove("valid");
        });

        Router.navigate("/register");

    });


    // INITIAL ROUTE
    Router.renderRoute();

});
