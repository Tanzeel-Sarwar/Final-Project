document.addEventListener("DOMContentLoaded", () => {
  const notesGrid = document.getElementById("notes-grid")
  const notesForm = document.getElementById("notes-form")
  const formContainer = document.getElementById("note-form-container")
  const addNoteBtn = document.getElementById("add-note-btn")
  const cancelNoteBtn = document.getElementById("cancel-note")
  const savedNotes = JSON.parse(localStorage.getItem("notes")) || []

  const colors = [
    "#FFE4B5", // Moccasin
    "#FFB6C1", // Light Pink
    "#98FB98", // Pale Green
    "#DDA0DD", // Plum
    "#87CEEB", // Sky Blue
  ]

  function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)]
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  function renderNotes() {
    notesGrid.innerHTML = ""
    savedNotes.forEach((note, index) => {
      const noteCard = document.createElement("div")
      noteCard.className = "note-card"
      noteCard.style.backgroundColor = note.color || getRandomColor()
      noteCard.innerHTML = `
        <div class="note-content">
          <h3>${note.title}</h3>
          <p>${note.content}</p>
        </div>
        <div class="note-footer">
          <span class="note-date">${formatDate(note.timestamp)}</span>
          <div class="note-actions">
            <button onclick="editNote(${index})" class="action-btn">
              <i class="fas fa-edit"></i>
            </button>
            <button onclick="deleteNote(${index})" class="action-btn">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `
      notesGrid.appendChild(noteCard)
    })
  }

  function toggleForm(show = true) {
    formContainer.classList.toggle("hidden", !show)
    if (!show) {
      notesForm.reset()
    }
  }

  addNoteBtn.addEventListener("click", () => toggleForm(true))
  cancelNoteBtn.addEventListener("click", () => toggleForm(false))

  notesForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const titleInput = document.getElementById("note-title")
    const contentInput = document.getElementById("note-content")
    const userInput = document.getElementById("note-user")

    const title = titleInput.value.trim()
    const content = contentInput.value.trim()
    const user = userInput.value.trim()

    if (title && content && user) {
      const newNote = {
        title,
        content,
        user,
        timestamp: new Date().toISOString(),
        color: getRandomColor(),
      }
      savedNotes.push(newNote)
      localStorage.setItem("notes", JSON.stringify(savedNotes))
      toggleForm(false)
      renderNotes()
      showNotification("Notes", "New note added")
    }
  })

  window.editNote = (index) => {
    const note = savedNotes[index]
    document.getElementById("note-title").value = note.title
    document.getElementById("note-content").value = note.content
    document.getElementById("note-user").value = note.user
    savedNotes.splice(index, 1)
    localStorage.setItem("notes", JSON.stringify(savedNotes))
    toggleForm(true)
    renderNotes()
    showNotification("Notes", "Note ready for editing")
  }

  window.deleteNote = (index) => {
    savedNotes.splice(index, 1)
    localStorage.setItem("notes", JSON.stringify(savedNotes))
    renderNotes()
    showNotification("Notes", "Note deleted")
  }

  // Placeholder for showNotification function.  Replace with actual implementation if needed.
  function showNotification(title, message) {
    alert(`${title}: ${message}`) // Simple alert for demonstration.  Replace with a proper notification system.
  }

  // Initialize
  renderNotes()
})

