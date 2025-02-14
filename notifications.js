const NotificationSystem = {
  init() {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications")
      return
    }

    // Request permission on init
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission()
    }
  },

  show(title, message) {
    if (Notification.permission === "granted") {
      const notification = new Notification(title, {
        body: message,
        icon: "/favicon.ico", // Add your site favicon path
        badge: "/favicon.ico",
        timestamp: Date.now(),
        silent: false,
        requireInteraction: true,
      })

      // Auto close after 5 seconds
      setTimeout(() => notification.close(), 5000)

      // Handle notification click
      notification.onclick = () => {
        window.focus()
        notification.close()
      }
    }
  },
}

// Initialize notification system
document.addEventListener("DOMContentLoaded", () => {
  NotificationSystem.init()
})

// Function to show notifications (to be used in other scripts)
function showNotification(title, message) {
  NotificationSystem.show(title, message)
}

