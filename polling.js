document.addEventListener("DOMContentLoaded", () => {
  const pollForm = document.getElementById("poll-form")
  const pollsList = document.getElementById("polls-list")
  const createPollBtn = document.getElementById("create-poll-btn")
  const formContainer = document.getElementById("poll-form-container")
  const cancelPollBtn = document.getElementById("cancel-poll")
  const addOptionBtn = document.getElementById("add-option-btn")
  const optionsContainer = document.getElementById("options-container")

  const savedPolls = JSON.parse(localStorage.getItem("polls")) || []

  function createPollCard(poll, index) {
    const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0)
    const pollCard = document.createElement("div")
    pollCard.className = "poll-card"

    const optionsHTML = poll.options
      .map((option, optionIndex) => {
        const percentage = totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(1) : 0
        return `
                <div class="poll-option">
                    <div class="option-header">
                        <label>
                            <input type="radio" name="poll-${index}" value="${optionIndex}" 
                                ${poll.voted ? "disabled" : ""}>
                            ${option.text}
                        </label>
                        <span class="vote-count">${option.votes} votes</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${percentage}%"></div>
                        <span class="percentage">${percentage}%</span>
                    </div>
                </div>
            `
      })
      .join("")

    pollCard.innerHTML = `
            <div class="poll-header">
                <h3>${poll.question}</h3>
                <span class="total-votes">${totalVotes} total votes</span>
            </div>
            <div class="poll-options">
                ${optionsHTML}
            </div>
            <div class="poll-footer">
                <span class="poll-date">Created: ${new Date(poll.createdAt).toLocaleDateString()}</span>
                <button onclick="deletePoll(${index})" class="action-btn">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `

    // Add vote handler
    const radioButtons = pollCard.querySelectorAll('input[type="radio"]')
    radioButtons.forEach((radio) => {
      radio.addEventListener("change", (e) => {
        const optionIndex = Number.parseInt(e.target.value)
        vote(index, optionIndex)
      })
    })

    return pollCard
  }

  function renderPolls() {
    pollsList.innerHTML = ""
    savedPolls.forEach((poll, index) => {
      pollsList.appendChild(createPollCard(poll, index))
    })
  }

  function vote(pollIndex, optionIndex) {
    savedPolls[pollIndex].options[optionIndex].votes++
    savedPolls[pollIndex].voted = true
    localStorage.setItem("polls", JSON.stringify(savedPolls))
    renderPolls()
    showNotification("Vote recorded!")
  }

  window.deletePoll = (index) => {
    if (confirm("Are you sure you want to delete this poll?")) {
      savedPolls.splice(index, 1)
      localStorage.setItem("polls", JSON.stringify(savedPolls))
      renderPolls()
      showNotification("Poll deleted")
    }
  }

  createPollBtn.addEventListener("click", () => {
    formContainer.classList.remove("hidden")
  })

  cancelPollBtn.addEventListener("click", () => {
    formContainer.classList.add("hidden")
    pollForm.reset()
    resetOptionsContainer()
  })

  addOptionBtn.addEventListener("click", () => {
    const newOption = document.createElement("input")
    newOption.type = "text"
    newOption.className = "poll-option"
    newOption.placeholder = `Option ${optionsContainer.children.length + 1}`
    newOption.required = true
    optionsContainer.appendChild(newOption)
  })

  function resetOptionsContainer() {
    optionsContainer.innerHTML = `
            <input type="text" class="poll-option" placeholder="Option 1" required>
            <input type="text" class="poll-option" placeholder="Option 2" required>
        `
  }

  pollForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const question = document.getElementById("poll-question").value.trim()
    const optionInputs = document.querySelectorAll(".poll-option")

    const options = Array.from(optionInputs)
      .map((input) => input.value.trim())
      .filter((value) => value !== "")
      .map((text) => ({ text, votes: 0 }))

    if (question && options.length >= 2) {
      const newPoll = {
        question,
        options,
        createdAt: new Date().toISOString(),
        voted: false,
      }
      savedPolls.push(newPoll)
      localStorage.setItem("polls", JSON.stringify(savedPolls))
      formContainer.classList.add("hidden")
      pollForm.reset()
      resetOptionsContainer()
      renderPolls()
      showNotification("New poll created")
    }
  })

  function showNotification(message) {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification("Polling System", { body: message })
        }
      })
    }
  }

  // Initialize
  renderPolls()
})

