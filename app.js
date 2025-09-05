const inputsDiv = document.getElementById("inputs");
const resultBox = document.getElementById("result");
const addButton = document.getElementById("addBit");
const resetButton = document.getElementById("reset");
const removeButton = document.getElementById("removeBit");

let highestPower = 2; // start with 8 bits

// Create initial 3 inputs
for (let i = highestPower; i >= 0; i--) {
  createInput(i, false); // append to rightmost
}

function createInput(power, prepend = true) {
  const field = document.createElement("div");
  field.className = "d-flex flex-column align-items-center mx-2 mb-1";

  const input = document.createElement("input");
  input.type = "text";
  input.style.width = "50px";
  input.placeholder = 0;
  input.dataset.power = power;
  input.className = "form-control text-center fs-5";

  const label = document.createElement("label");
  const decimalValue = Math.pow(2, power);
  label.innerHTML = `<strong>2<sup>${power}</sup></strong><br><em class="small text-muted">${decimalValue}</em>`;
  label.className = "mt-1";

  field.appendChild(input);
  field.appendChild(label);

  if (prepend) {
    inputsDiv.prepend(field);
  } else {
    inputsDiv.appendChild(field);
  }

  // Validate input to allow only 0 or 1
  input.addEventListener("input", () => {
    if (input.value !== "0" && input.value !== "1") {
      input.value = ""; // clear invalid input
    }
    calculate();
  });

  updateTabIndices();
}

addButton.addEventListener("click", () => {
  highestPower++;
  createInput(highestPower, true);
});

removeButton.addEventListener("click", () => {
  if (highestPower > 0) {
    const inputs = inputsDiv.querySelectorAll(".d-flex.flex-column.align-items-center.mx-2.mb-1");
    const firstInput = inputs[0];
    if (firstInput) {
      inputsDiv.removeChild(firstInput);
      highestPower--;
      calculate();
      updateTabIndices();
    }
  }
});

function calculate() {
  let total = 0;
  document.querySelectorAll("input").forEach(input => {
    const val = input.value.trim();
    const power = parseInt(input.dataset.power, 10);
    if (val === "1") total += Math.pow(2, power);
  });
  resultBox.textContent = `Decimal Value: ${total}`;
}

function updateTabIndices() {
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input, index) => {
    input.tabIndex = inputs.length - index; // rightmost = tab first
  });
}

resetButton.addEventListener('click', function() {
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => {
    input.value = ""
  });
  resultBox.textContent = "Decimal Value: 0"
})