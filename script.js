document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal")
  const modalTitle = document.getElementById("modal-title")
  const modalBody = document.getElementById("modal-body")
  const closeBtn = document.getElementsByClassName("close")[0]
  const aboutLink = document.getElementById("about-link")

  // Tool card click handlers
  document.getElementById("calculator-card").addEventListener("click", openCalculator)
  document.getElementById("todo-card").addEventListener("click", openTodoList)
  document.getElementById("notes-card").addEventListener("click", openNotes)

  // About link click handler
  aboutLink.addEventListener("click", openAbout)

  // Close modal when clicking the close button or outside the modal
  closeBtn.addEventListener("click", closeModal)
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal()
    }
  })

  function openModal(title, content) {
    modalTitle.textContent = title
    modalBody.innerHTML = content
    modal.style.display = "block"
  }

  function closeModal() {
    modal.style.display = "none"
  }

  function openCalculator() {
    const calculatorHTML = `
            <div id="calculator">
                <input type="text" id="display" readonly>
                <button onclick="appendToDisplay('7')">7</button>
                <button onclick="appendToDisplay('8')">8</button>
                <button onclick="appendToDisplay('9')">9</button>
                <button onclick="appendToDisplay('+')">+</button>
                <button onclick="appendToDisplay('4')">4</button>
                <button onclick="appendToDisplay('5')">5</button>
                <button onclick="appendToDisplay('6')">6</button>
                <button onclick="appendToDisplay('-')">-</button>
                <button onclick="appendToDisplay('1')">1</button>
                <button onclick="appendToDisplay('2')">2</button>
                <button onclick="appendToDisplay('3')">3</button>
                <button onclick="appendToDisplay('*')">*</button>
                <button onclick="appendToDisplay('0')">0</button>
                <button onclick="appendToDisplay('.')">.</button>
                <button onclick="calculate()">=</button>
                <button onclick="appendToDisplay('/')">/</button>
                <button onclick="clearDisplay()">C</button>
            </div>
        `
    openModal("Calculator", calculatorHTML)

    // Calculator functionality
    window.appendToDisplay = (value) => {
      document.getElementById("display").value += value
    }

    window.clearDisplay = () => {
      document.getElementById("display").value = ""
    }

    window.calculate = () => {
      const display = document.getElementById("display")
      try {
        display.value = eval(display.value)
      } catch (error) {
        display.value = "Error"
      }
    }
  }

  function openTodoList() {
    const todoListHTML = `
            <div id="todo-list">
                <form id="todo-form">
                    <input type="text" id="task-input" placeholder="Enter a new task" required>
                    <input type="text" id="user-name" placeholder="Your name" required>
                    <button type="submit">Add Task</button>
                </form>
                <ul id="tasks"></ul>
            </div>
        `
    openModal("To-Do List", todoListHTML)

    // Load saved tasks
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || []
    const tasksList = document.getElementById("tasks")
    const todoForm = document.getElementById("todo-form")

    function renderTasks() {
      tasksList.innerHTML = ""
      savedTasks.forEach((task, index) => {
        const li = document.createElement("li")
        li.className = "task-card"
        li.innerHTML = `
                    <div class="task-info">
                        <div class="task-title">${task.title}</div>
                        <div class="task-meta">
                            <span>By: ${task.user}</span>
                            <span>Date: ${task.date}</span>
                            <span>Time: ${task.time}</span>
                        </div>
                    </div>
                    <div class="task-actions">
                        <button onclick="deleteTask(${index})">Delete</button>
                    </div>
                `
        tasksList.appendChild(li)
      })
    }

    renderTasks()

    todoForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const taskInput = document.getElementById("task-input")
      const userNameInput = document.getElementById("user-name")
      const task = taskInput.value.trim()
      const user = userNameInput.value.trim()
      if (task && user) {
        const now = new Date()
        const newTask = {
          title: task,
          user: user,
          date: now.toLocaleDateString(),
          time: now.toLocaleTimeString(),
        }
        savedTasks.push(newTask)
        localStorage.setItem("tasks", JSON.stringify(savedTasks))
        taskInput.value = ""
        userNameInput.value = ""
        renderTasks()
      }
    })

    window.deleteTask = (index) => {
      savedTasks.splice(index, 1)
      localStorage.setItem("tasks", JSON.stringify(savedTasks))
      renderTasks()
    }
  }

  function openNotes() {
    const notesHTML = `
            <div id="notes">
                <form id="notes-form">
                    <input type="text" id="note-title" placeholder="Note title" required>
                    <textarea id="note-content" placeholder="Type your note here..." required></textarea>
                    <input type="text" id="note-user" placeholder="Your name" required>
                    <button type="submit">Save Note</button>
                </form>
                <ul id="notes-list"></ul>
            </div>
        `
    openModal("Notes", notesHTML)

    const notesList = document.getElementById("notes-list")
    const notesForm = document.getElementById("notes-form")
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || []

    function renderNotes() {
      notesList.innerHTML = ""
      savedNotes.forEach((note, index) => {
        const li = document.createElement("li")
        li.className = "note-card"
        li.innerHTML = `
                    <div class="note-title">${note.title}</div>
                    <div class="note-content">${note.content}</div>
                    <div class="note-meta">
                        <span>By: ${note.user}</span>
                        <span>Date: ${note.date}</span>
                        <span>Time: ${note.time}</span>
                    </div>
                    <div class="note-actions">
                        <button onclick="deleteNote(${index})">Delete</button>
                        <button onclick="editNote(${index})">Edit</button>
                    </div>
                `
        notesList.appendChild(li)
      })
    }

    renderNotes()

    notesForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const titleInput = document.getElementById("note-title")
      const contentInput = document.getElementById("note-content")
      const userInput = document.getElementById("note-user")
      const title = titleInput.value.trim()
      const content = contentInput.value.trim()
      const user = userInput.value.trim()
      if (title && content && user) {
        const now = new Date()
        const newNote = {
          title: title,
          content: content,
          user: user,
          date: now.toLocaleDateString(),
          time: now.toLocaleTimeString(),
        }
        savedNotes.push(newNote)
        localStorage.setItem("notes", JSON.stringify(savedNotes))
        titleInput.value = ""
        contentInput.value = ""
        userInput.value = ""
        renderNotes()
      }
    })

    window.deleteNote = (index) => {
      savedNotes.splice(index, 1)
      localStorage.setItem("notes", JSON.stringify(savedNotes))
      renderNotes()
    }

    window.editNote = (index) => {
      const note = savedNotes[index]
      document.getElementById("note-title").value = note.title
      document.getElementById("note-content").value = note.content
      document.getElementById("note-user").value = note.user
      savedNotes.splice(index, 1)
      localStorage.setItem("notes", JSON.stringify(savedNotes))
      renderNotes()
    }
  }

  function openAbout() {
    const aboutContent = `
            <p>Smart Tools Hub is your one-stop solution for everyday tasks. Our platform offers a variety of tools to help you stay organized and productive.</p>
            <p>Features:</p>
            <ul>
                <li>Calculator: Perform quick calculations</li>
                <li>To-Do List: Manage your tasks efficiently with user names, dates, and times</li>
                <li>Notes: Take and save quick notes with titles, content, user names, and timestamps</li>
            </ul>
            <p>We're constantly working on adding new features and improving existing ones. Stay tuned for updates!</p>
        `
    openModal("About Smart Tools Hub", aboutContent)
  }
})

