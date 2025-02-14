document.addEventListener("DOMContentLoaded", () => {
  // Get the current page name from the URL
  const currentPage = window.location.pathname.split("/").pop().split(".")[0]

  // Set the page title based on the current page
  const pageTitles = {
    index: "Home",
    calculator: "Calculator",
    todo: "To-Do List",
    notes: "Notes",
    polling: "Polling System",
  }

  const pageTitle = pageTitles[currentPage] || "Smart Tools Hub"
  document.title = `${pageTitle} - Smart Tools Hub`
})

