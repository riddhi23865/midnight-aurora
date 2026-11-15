
const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "index.html";
}

async function loadDashboard() {
    try {
        const response = await fetch("/api/dashboard", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const data = await response.json();

        if (!response.ok) {
            localStorage.removeItem("token");
            window.location.href = "index.html";
            return;
        }

        const user = data.user;

        document.getElementById("userDetails").innerHTML = `
            <strong>Name:</strong> ${escapeHTML(user.name)} <br><br>
            <strong>Email:</strong> ${escapeHTML(user.email)} <br><br>
            <strong>Status:</strong> Logged In Successfully
        `;

    } catch (error) {
        document.getElementById("userDetails").textContent =
            "Unable to load dashboard";
    }
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

loadDashboard();

document.getElementById("logoutButton").addEventListener("click", function() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
});
