document.addEventListener("DOMContentLoaded", () => {
    const authBtnContainer = document.getElementById("auth-btn-container");

    const token = localStorage.getItem("accessToken"); 

    if (token) {
        authBtnContainer.innerHTML = `
            <button class="nav-toggle-btn sign-out-btn" id="signOutBtn">Sign Out</button>
        `;

        document.getElementById("signOutBtn").addEventListener("click", () => {
      
            localStorage.removeItem("accessToken"); 
            localStorage.removeItem("refreshToken");
            
            alert("Logged out successfully!");
            window.location.href = "index.html"; 
        });
    } else {
        authBtnContainer.innerHTML = `
            <button class="nav-toggle-btn" onclick="window.location.href='register.html'">Sign Up</button>
        `;
    }
});