function showMessage(text, type) {
  const msgBox = document.getElementById("messageBox");
  if (!msgBox) return;

  msgBox.style.display = "block";
  msgBox.innerText = text;
  msgBox.className =
    "message-box " + (type === "success" ? "message-success" : "message-error");

  setTimeout(() => {
    msgBox.style.display = "none";
  }, 3000);
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPass").value;

    try {
      const response = await fetch(
        "https://beautyzone-server.vercel.app/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("accessToken", data.user.accessToken);
      localStorage.setItem("refreshToken", data.user.refreshToken);

      showMessage("Login Successful!", "success");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    } catch (error) {
      showMessage(error.message, "error");
    }
  });
}

// Register Form Logic
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("regName").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPass").value;
    const confirmPass = document.getElementById("confirmPass").value;

    if (password !== confirmPass) {
      showMessage("Passwords do not match!", "error");
      return;
    }

    try {
      const response = await fetch(
        "https://beautyzone-server.vercel.app/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      localStorage.setItem("accessToken", data.user.accessToken);
      localStorage.setItem("refreshToken", data.user.refreshToken);

      showMessage("Registration Successful!", "success");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    } catch (error) {
      showMessage(error.message, "error");
    }
  });
}
