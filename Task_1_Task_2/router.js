
const Router = (() => {

    function navigate(path) {
        // Change browser URL without reloading
        history.pushState({}, "", path);

        renderRoute();
    }

    function renderRoute() {
        const path = window.location.pathname;

        const registerView = document.getElementById("registerView");
        const successView = document.getElementById("successView");

        if (!registerView || !successView) return;

        if (path === "/success") {
            registerView.hidden = true;
            successView.hidden = false;
        } else {
            registerView.hidden = false;
            successView.hidden = true;
        }
    }

    // Handle browser back and forward buttons
    window.addEventListener("popstate", renderRoute);

    return {
        navigate,
        renderRoute
    };

})();
