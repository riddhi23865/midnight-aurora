
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// EJS configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Registration page
app.get("/", (req, res) => {
    res.render("index", {
        error: null,
        name: "",
        email: ""
    });
});

// Registration form submission
app.post("/register", (req, res) => {
    const name = (req.body.name || "").trim();
    const email = (req.body.email || "").trim();
    const terms = req.body.terms;

    // Check empty fields
    if (!name || !email || !terms) {
        return res.status(400).render("index", {
            error: "Please complete all fields and accept the terms.",
            name,
            email
        });
    }

    // Validate name
    if (name.length > 80 || email.length > 254) {
        return res.status(400).render("index", {
            error: "Name or email is too long.",
            name: name.slice(0, 80),
            email: email.slice(0, 254)
        });
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        return res.status(400).render("index", {
            error: "Please enter a valid email address.",
            name,
            email
        });
    }

    // Show success page
    res.render("result", {
        name,
        email
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Website running at http://localhost:${PORT}`);
});
