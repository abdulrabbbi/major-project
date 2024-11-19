
  // JavaScript to hide the alert after 3 seconds
  setTimeout(() => {
    const alertElement = document.getElementById("success-alert");
    if (alertElement) {
      alertElement.style.opacity = "0"; // Start fading out

      // After the transition duration (1s), hide the element
      setTimeout(() => {
        alertElement.style.display = "none";
      }, 1000); // Match this time with the transition duration
    }
  }, 3000); // 3000ms = 3 seconds

  // JavaScript to hide the error alert after 5 seconds
  setTimeout(() => {
    const alertElement = document.getElementById("error-alert");
    if (alertElement) {
      alertElement.style.opacity = "0"; // Start fading out

      // After the transition duration (1s), hide the element
      setTimeout(() => {
        alertElement.style.display = "none";
      }, 1000); // Match this time with the transition duration
    }
  }, 5000); // 5000ms = 5 seconds
