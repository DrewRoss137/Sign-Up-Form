const firstNameInput = document.getElementById("first-name-input");

const LastNameInput = document.getElementById("first-name-input");

const userNameInput = document.getElementById("user-name-input");

const dateOfBirthInput = document.getElementById("date-of-birth-input");

const emailAddressInput = document.getElementById("email-address-input");

const phoneNumberInput = document.getElementById("phone-number-input");

const passwordInput = document.getElementById("password-input");

const confirmPasswordInput = document.getElementById("confirm-password-input");

const dateFormat = "DD/MM/YYYY";

const textInputs = document.querySelectorAll('input[type="text"]');

let isFirstClick = true;
let formattedInput;

const findLastEnteredInputPosition = (inputValue) => {
  let position = inputValue.length - 1;
  while (position >= 0 && "DMY".includes(inputValue[position])) {
    position--;
  }
  return position + 1;
};

const getFormattedInput = (inputValue) => {
  const inputDigits = inputValue.replace(/\D/g, "");
  formattedInput = "";
  for (let i = 0, j = 0; i < dateFormat.length; i++) {
    if ("DMY".includes(dateFormat[i])) {
      formattedInput +=
        j < inputDigits.length ? inputDigits[j++] : dateFormat[i];
    } else {
      formattedInput += dateFormat[i];
    }
  }
  return formattedInput;
};

dateOfBirthInput.addEventListener("blur", () => {
  if (dateOfBirthInput.value === dateFormat) {
    dateOfBirthInput.value = "";
    isFirstClick = true;
  }
});

dateOfBirthInput.addEventListener("click", () => {
  if (
    isFirstClick &&
    (dateOfBirthInput.value === "" || dateOfBirthInput.value === dateFormat)
  ) {
    dateOfBirthInput.value = dateFormat;
    dateOfBirthInput.setSelectionRange(0, 0);
    isFirstClick = false;
  } else {
    const cursorPosition = ["D", "M", "Y"].reduce(
      (pos, letter) =>
        pos !== -1 ? pos : dateOfBirthInput.value.indexOf(letter),
      -1
    );
    dateOfBirthInput.setSelectionRange(cursorPosition, cursorPosition);
  }
});

dateOfBirthInput.addEventListener("input", ({ target: { value } }) => {
  const formattedInput = getFormattedInput(value);
  dateOfBirthInput.value = formattedInput;
  const nextPosition = formattedInput.search(/D|M|Y/);
  dateOfBirthInput.setSelectionRange(nextPosition, nextPosition);
});

dateOfBirthInput.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key === "a") {
    event.preventDefault();
    dateOfBirthInput.setSelectionRange(0, dateOfBirthInput.value.length);
  } else if (event.key === "Backspace" || event.key === "Delete") {
    event.preventDefault();
    const currentValue = dateOfBirthInput.value;
    const selectionStart = dateOfBirthInput.selectionStart;
    const selectionEnd = dateOfBirthInput.selectionEnd;
    if (selectionStart === selectionEnd) {
      let position = selectionStart;
      if (event.key === "Backspace" && position > 0) {
        position -= 1;
      } else if (event.key === "Delete" && position < currentValue.length) {
        position += 1;
      }
      if (currentValue[position] === "/") {
        position += event.key === "Backspace" ? -1 : 1;
      }
      dateOfBirthInput.value = `${currentValue.slice(0, position)}${
        dateFormat[position]
      }${currentValue.slice(position + 1)}`;
      dateOfBirthInput.setSelectionRange(position, position);
    } else {
      const firstHalf = currentValue.slice(0, selectionStart);
      const secondHalf = currentValue.slice(selectionEnd);
      dateOfBirthInput.value = `${firstHalf}${dateFormat.substring(
        firstHalf.length,
        selectionEnd
      )}${secondHalf}`;
      dateOfBirthInput.setSelectionRange(selectionStart, selectionStart);
    }
  } else if (event.key.startsWith("Arrow")) {
    event.preventDefault();
  }
});

textInputs.forEach(input => {
  let firstFocus = true;
  input.addEventListener('focus', () => {
      if (input.style.borderColor !== 'green' && firstFocus) {
          input.style.borderColor = 'blue';
          firstFocus = false;
      }
  });
  input.addEventListener('blur', () => {
      if (input.value.trim() === '') {
          input.style.borderColor = 'red';
      }
  });
  input.addEventListener('input', () => {
      if (input.value.trim() !== '') {
          input.style.borderColor = 'green';
      } else {
          input.style.borderColor = 'red';
      }
  });
});


function createErrorContainer() {
  const errorContainer = document.createElement("div");
  errorContainer.id = "error-container";
  errorContainer.style.position = "absolute";
  errorContainer.style.padding = "8px";
  errorContainer.style.borderRadius = "3px";
  errorContainer.style.backgroundColor = "rgba(255, 0, 0, 0.8)";
  errorContainer.style.color = "white";
  const inputRect = firstNameInput.getBoundingClientRect();
  const inputCenterX = inputRect.left + inputRect.width / 2;
  const inputCenterY = inputRect.top + inputRect.height / 2;
  errorContainer.style.left = `${inputCenterX - errorContainer.offsetWidth - 500}px`;
  errorContainer.style.top = `${inputCenterY - errorContainer.offsetHeight / 2}px`;
  errorContainer.style.display = "flex";
  errorContainer.style.alignItems = "center";
  errorContainer.style.justifyContent = "center";
  firstNameInput.parentNode.insertBefore(errorContainer, firstNameInput);
  return errorContainer;
}

function fadeIn(element) {
  element.style.opacity = 0;
  element.style.display = "block";
  const duration = 1000;
  let start = null;
  function step(timestamp) {
    if (!start) {
      start = timestamp;
    }
    const elapsed = timestamp - start;
    const progress = elapsed / duration;
    element.style.opacity = progress;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  }
  window.requestAnimationFrame(step);
}

function fadeOut(element) {
  const duration = 1000;
  let start = null;

  function step(timestamp) {
    if (!start) {
      start = timestamp;
    }
    const elapsed = timestamp - start;
    const progress = elapsed / duration;
    element.style.opacity = 1 - progress;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.style.display = "none";
    }
  }
  window.requestAnimationFrame(step);
}

const errorContainer = createErrorContainer();
function validateFirstName() {
  errorContainer.textContent = "";
  const inputValue = firstNameInput.value.trim();
  const errors = [];
  if (inputValue === "") {
    errors.push("First Name cannot be empty");
  }
  if (/\d/.test(inputValue)) {
    errors.push("First Name cannot contain digits");
  }
  if (/[^a-zA-Z\s]/.test(inputValue)) {
    errors.push("First Name cannot contain special characters");
  }
  if (errors.length > 0) {
    errors.forEach((error) => {
      const errorMessage = document.createElement("p");
      errorMessage.classList.add("error-message");
      errorMessage.textContent = error;
      errorContainer.appendChild(errorMessage);
    });
    fadeIn(errorContainer);
    errorContainer.style.top = `${firstNameInput.offsetTop}px`;
    setTimeout(() => {
      fadeOut(errorContainer);
    }, 4000);
  } else {
    fadeOut(errorContainer);
  }
}
firstNameInput.addEventListener("focusout", validateFirstName);
