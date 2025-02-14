function showNotification(title, message) {
  if (Notification.permission === "granted") {
    new Notification(title, { body: message })
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification(title, { body: message })
      }
    })
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const todoForm = document.getElementById("todo-form")
  const tasksList = document.getElementById("tasks-list")
  const addTaskBtn = document.getElementById("add-task-btn")
  const formContainer = document.getElementById("task-form-container")
  const cancelTaskBtn = document.getElementById("cancel-task")
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || []

  function renderTasks() {
    tasksList.innerHTML = ""
    savedTasks.forEach((task, index) => {
      const taskCard = document.createElement("div")
      taskCard.className = `task-card ${task.completed ? "completed" : ""} priority-${task.priority}`
      taskCard.innerHTML = `
        <div class="task-header">
          <div class="task-status">
            <input type="checkbox" ${task.completed ? "checked" : ""} 
              onchange="toggleTask(${index})" id="task-${index}">
            <label for="task-${index}">${task.title}</label>
          </div>
          <div class="task-priority">${task.priority}</div>
        </div>
        <div class="task-details">
          <div class="task-meta">
            <span><i class="fas fa-user"></i> ${task.user}</span>
            <span><i class="fas fa-calendar"></i> Due: ${new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
          <div class="task-actions">
            <button onclick="editTask(${index})" class="action-btn">
              <i class="fas fa-edit"></i>
            </button>
            <button onclick="deleteTask(${index})" class="action-btn">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `
      tasksList.appendChild(taskCard)
    })
  }

  addTaskBtn.addEventListener("click", () => {
    formContainer.classList.remove("hidden")
  })

  cancelTaskBtn.addEventListener("click", () => {
    formContainer.classList.add("hidden")
    todoForm.reset()
  })

  todoForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const taskInput = document.getElementById("task-input")
    const userNameInput = document.getElementById("user-name")
    const dueDateInput = document.getElementById("due-date")
    const priorityInput = document.getElementById("priority")

    const task = taskInput.value.trim()
    const user = userNameInput.value.trim()
    const dueDate = dueDateInput.value
    const priority = priorityInput.value

    if (task && user && dueDate) {
      const newTask = {
        title: task,
        user: user,
        dueDate: dueDate,
        priority: priority,
        completed: false,
        createdAt: new Date().toISOString(),
      }
      savedTasks.push(newTask)
      localStorage.setItem("tasks", JSON.stringify(savedTasks))
      todoForm.reset()
      formContainer.classList.add("hidden")
      renderTasks()
      showNotification("To-Do List", "New task added")
    }
  })

  window.toggleTask = (index) => {
    savedTasks[index].completed = !savedTasks[index].completed
    localStorage.setItem("tasks", JSON.stringify(savedTasks))
    renderTasks()
    showNotification("To-Do List", `Task ${savedTasks[index].completed ? "completed" : "uncompleted"}`)
  }

  window.editTask = (index) => {
    const task = savedTasks[index]
    document.getElementById("task-input").value = task.title
    document.getElementById("user-name").value = task.user
    document.getElementById("due-date").value = task.dueDate
    document.getElementById("priority").value = task.priority
    savedTasks.splice(index, 1)
    localStorage.setItem("tasks", JSON.stringify(savedTasks))
    formContainer.classList.remove("hidden")
    renderTasks()
    showNotification("To-Do List", "Task ready for editing")
  }

  window.deleteTask = (index) => {
    savedTasks.splice(index, 1)
    localStorage.setItem("tasks", JSON.stringify(savedTasks))
    renderTasks()
    showNotification("To-Do List", "Task deleted")
  }

  // Initialize
  renderTasks()
})

