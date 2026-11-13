const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve the application for client-side routes
app.get(["/", "/register", "/success"], (req, res) => {
    res.render("index");
});

// Registration API
app.post("/api/register", (req, res) => {
    const { name, email, password, confirmPassword, terms } = req.body;

    const cleanName = typeof name === "string" ? name.trim() : "";
    const cleanEmail = typeof email === "string" ? email.trim() : "";
    const validPassword = typeof password === "string" ? password : "";
    const validConfirm = typeof confirmPassword === "string" ? confirmPassword : "";

    if (!cleanName || !cleanEmail || !validPassword || !validConfirm) {
        return res.status(400).json({
            success: false,
            message: "All fields are required."
        });
    }

    if (cleanName.length < 3 || cleanName.length > 80) {
        return res.status(400).json({
            success: false,
            message: "Name must contain 3 to 80 characters."
        });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (cleanEmail.length > 254 || !emailPattern.test(cleanEmail)) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid email address."
        });
    }

    const strongPassword =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])\S{8,64}$/;

    if (!strongPassword.test(validPassword)) {
        return res.status(400).json({
            success: false,
            message: "Password must be 8–64 characters and include uppercase, lowercase, number and special character."
        });
    }

    if (validPassword !== validConfirm) {
        return res.status(400).json({
            success: false,
            message: "Passwords do not match."
        });
    }

    if (terms !== true) {
        return res.status(400).json({
            success: false,
            message: "Please accept the Terms and Conditions."
        });
    }

    // Demo only: no account is permanently stored.
    // Never return or log the password.
    return res.json({
        success: true,
        message: "Registration completed successfully!",
        user: {
            name: cleanName,
            email: cleanEmail
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Aurora running at http://localhost:${PORT}`);
});
