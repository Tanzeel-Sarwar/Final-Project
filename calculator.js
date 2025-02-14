function showNotification(title, message) {
  // Simple notification function (replace with your preferred notification method)
  alert(`${title}: ${message}`)
}

const display = document.getElementById("display")
const calculation = document.getElementById("calculation")

function appendToDisplay(value) {
  display.value += value
  calculation.textContent = display.value
}

function clearDisplay() {
  display.value = ""
  calculation.textContent = ""
  showNotification("Calculator", "Calculator cleared")
}

function calculate() {
  try {
    const result = eval(display.value)
    calculation.textContent = display.value + " ="
    display.value = result
    showNotification("Calculator", "Calculation completed")
  } catch (error) {
    display.value = "Error"
    calculation.textContent = "Error"
    showNotification("Calculator", "Error in calculation")
  }
}

function backspace() {
  display.value = display.value.slice(0, -1)
  calculation.textContent = display.value
}

// Add keyboard support
document.addEventListener("keydown", (event) => {
  const key = event.key
  if (
    (key >= "0" && key <= "9") ||
    key === "." ||
    key === "+" ||
    key === "-" ||
    key === "*" ||
    key === "/" ||
    key === "(" ||
    key === ")"
  ) {
    appendToDisplay(key)
  } else if (key === "Enter") {
    calculate()
  } else if (key === "Backspace") {
    backspace()
  } else if (key === "Escape") {
    clearDisplay()
  }
})

