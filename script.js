const display = document.getElementById("display");
let expression = "";

function updateDisplay(value) {
  display.textContent = value;
}

function isOperator(char) {
  return ["+", "-", "*", "/", "%"].includes(char);
}

function appendValue(value) {
  if (value === ".") {
    const parts = expression.split(/[-+*/%]/);
    const current = parts[parts.length - 1];
    if (current.includes(".")) return;
  }

  if (expression === "" && value === ".") {
    expression = "0.";
  } else if (expression === "" && value === "0") {
    expression = "0";
  } else if (isOperator(value)) {
    if (expression === "" || isOperator(expression.slice(-1))) {
      expression = expression.slice(0, -1) + value;
    } else {
      expression += value;
    }
  } else {
    if (expression === "0" && value !== ".") {
      expression = value;
    } else {
      expression += value;
    }
  }

  updateDisplay(expression || "0");
}

function clearAll() {
  expression = "";
  updateDisplay("0");
}

function backspace() {
  if (expression.length > 0) {
    expression = expression.slice(0, -1);
  }
  updateDisplay(expression || "0");
}

function percent() {
  if (expression === "") return;
  try {
    const value = eval(expression);
    expression = (value / 100).toString();
    updateDisplay(expression);
  } catch (err) {
    updateDisplay("Error");
    expression = "";
  }
}

function calculate() {
  if (expression === "") return;
  try {
    const result = Function(`"use strict"; return (${expression});`)();
    expression = String(Number.isFinite(result) ? +result.toPrecision(12) : result);
    updateDisplay(expression);
  } catch (err) {
    updateDisplay("Error");
    expression = "";
  }
}

const buttons = document.querySelectorAll("button");
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const val = btn.dataset.value;
    const action = btn.dataset.action;

    switch (action) {
      case "clear":
        clearAll();
        break;
      case "back":
        backspace();
        break;
      case "percent":
        percent();
        break;
      case "equals":
        calculate();
        break;
      default:
        if (val != null) appendValue(val);
        break;
    }
  });
});

window.addEventListener("keydown", (ev) => {
  const key = ev.key;

  if (/^[0-9]$/.test(key) || key === ".") {
    appendValue(key);
    return;
  }

  if (key === "+" || key === "-" || key === "*" || key === "/") {
    appendValue(key);
    return;
  }

  if (key === "Enter" || key === "=") {
    ev.preventDefault();
    calculate();
    return;
  }

  if (key === "Backspace") {
    backspace();
    return;
  }

  if (key.toLowerCase() === "c") {
    clearAll();
  }
});
