
document.getElementById("contactForm").addEventListener("submit", function(event) {

    event.preventDefault();

    document.getElementById("message").innerHTML =
        "Your message has been submitted successfully!";

    document.getElementById("contactForm").reset();

});
