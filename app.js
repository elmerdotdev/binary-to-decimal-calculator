const inputsDiv = document.getElementById("inputs");
const resultBox = document.getElementById("result");
const addButton = document.getElementById("addBit");
const removeButton = document.getElementById("removeBit");
const copyButton = document.getElementById("copy");
const resetButton = document.getElementById("reset");

let highestPower = 2; // default

function createInput(power, prepend = true) {
  const field = document.createElement("div");
  field.className = "d-flex flex-column align-items-center mx-1 mb-2 bit-container";

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

  input.addEventListener("keydown", (e) => {
    const inputs = Array.from(inputsDiv.querySelectorAll("input"));
    const currentIndex = inputs.indexOf(e.target);

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (currentIndex > 0) {
        inputs[currentIndex - 1].focus();
      }
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      if (currentIndex < inputs.length - 1) {
        inputs[currentIndex + 1].focus();
      }
    }
  });

  input.addEventListener("input", () => {
    if (input.value !== "0" && input.value !== "1") {
      input.value = "";
    }
    calculate();
  });
}

function calculate() {
  let total = 0;
  let binaryString = "";
  const inputs = inputsDiv.querySelectorAll("input");
  inputs.forEach(input => {
    const val = input.value.trim() || "0";
    binaryString += val;
    const power = parseInt(input.dataset.power, 10);
    if (input.value.trim() === "1") {
        total += Math.pow(2, power);
    }
  });
  resultBox.textContent = `Decimal Value: ${total}`;
  localStorage.setItem("binaryValue", binaryString);
}

function updateSpacers() {
  inputsDiv.querySelectorAll(".spacer").forEach(spacer => spacer.remove());

  const bitContainers = inputsDiv.querySelectorAll(".bit-container");
  bitContainers.forEach(container => {
    const input = container.querySelector("input");
    const power = parseInt(input.dataset.power, 10);
    if (power > 0 && (power + 1) % 4 === 0) {
      const spacer = document.createElement("div");
      spacer.className = "spacer";
      spacer.style.width = "0rem";
      inputsDiv.insertBefore(spacer, container);
    }
  });
}

function loadFromLocalStorage() {
  const savedBinary = localStorage.getItem("binaryValue");
  inputsDiv.innerHTML = "";
  if (savedBinary && savedBinary.length > 0) {
    highestPower = savedBinary.length - 1;
    for (let i = highestPower; i >= 0; i--) {
      createInput(i, false);
    }
    const inputs = inputsDiv.querySelectorAll("input");
    for (let i = 0; i < savedBinary.length; i++) {
      inputs[i].value = savedBinary[i];
    }
    calculate();
  } else {
    highestPower = 2;
    for (let i = highestPower; i >= 0; i--) {
      createInput(i, false);
    }
  }
  updateSpacers();
}


addButton.addEventListener("click", () => {
  highestPower++;
  createInput(highestPower, true);
  calculate();
  updateSpacers();
});

removeButton.addEventListener("click", () => {
  if (highestPower > 0) {
    const firstInput = inputsDiv.querySelector(".bit-container");
    if (firstInput) {
      inputsDiv.removeChild(firstInput);
      highestPower--;
      calculate();
      updateSpacers();
    }
  }
});

copyButton.addEventListener('click', function() {
  const inputs = document.querySelectorAll("input");
  let currentBits = "";
  inputs.forEach(input => {
    const value = input.value || "0";
    currentBits += value;
  })

  let trimmedBits = currentBits;
  const firstOne = trimmedBits.indexOf('1');
  if (firstOne > -1) {
    trimmedBits = trimmedBits.substring(firstOne);
  } else {
    trimmedBits = "0";
  }

  navigator.clipboard.writeText(trimmedBits).then(() => {
    const originalText = copyButton.textContent;
    copyButton.textContent = "Copied!";
    copyButton.classList.add("btn-success")
    setTimeout(() => {
      copyButton.textContent = originalText;
      copyButton.classList.remove("btn-success")
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy bits: ', err);
  });
})

resetButton.addEventListener('click', function() {
  const inputs = document.querySelectorAll("input");
  inputs.forEach(input => {
    input.value = ""
  });
  localStorage.removeItem("binaryValue");
  calculate();
})

loadFromLocalStorage();