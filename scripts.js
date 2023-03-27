const form = document.getElementById("form");
const textInputs = document.querySelectorAll("input[type='text']");
const firstNameInput = document.getElementById("first-name-input");
const lastNameInput = document.getElementById("last-name-input");
const userNameInput = document.getElementById("user-name-input");
const dateOfBirthInput = document.getElementById("date-of-birth-input");
const emailAddressInput = document.getElementById("email-address-input");
const phoneNumberInput = document.getElementById("phone-number-input");
const password = document.getElementById("password");
const passwordInput = document.getElementById("password-input");
const togglePasswordButton = document.getElementById("toggle-password");
const confirmPasswordInput = document.getElementById("confirm-password-input");
const toggleConfirmPasswordButton = document.getElementById(
  "toggle-confirm-password"
);
const passwordStrengthIndicator = document.getElementById(
  "password-strength-indicator"
);

const dateOfBirthFormat = "DD/MM/YYYY";

const validationRules = {
  "first-name-input": /^[a-zA-Z][a-zA-Z-]*$/,
  "last-name-input": /^[a-zA-Z][a-zA-Z-]*$/,
  "user-name-input": /^[a-zA-Z]{3}[a-zA-Z0-9_-]*$/,
  "date-of-birth-input": isValidDate,
  "email-address-input": /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  "phone-number-input": /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})(?:[- ]?\d)?$/,
};
let formattedDateOfBirthInput;
let isFirstClick = true;

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    return false;
  }
});

textInputs.forEach((input) => {
  const eventHandler = (event) => handleEvent(event, input);
  input.addEventListener("blur", eventHandler);
  input.addEventListener("input", eventHandler);
});

passwordInput.addEventListener("focusin", () => {
  const indicator = document.getElementById("password-strength-indicator");
  if (!indicator) {
    createPasswordStrengthIndicator(passwordInput);
  }
});

passwordInput.addEventListener("focusout", () => {
  const indicator = document.getElementById("password-strength-indicator");
  if (indicator) {
    indicator.remove();
  }
});

// If the user's input is empty, the isFirstClick flag is reset.
dateOfBirthInput.addEventListener("blur", () => {
  if (dateOfBirthInput.value === dateOfBirthFormat) {
    dateOfBirthInput.value = "";
    isFirstClick = true;
  }
});

// If isFirstClick, cursor is placed at the beginning.
// If !isFirstClick, positions the cursor after the last entered character, or before the first placeholder.
dateOfBirthInput.addEventListener("click", () => {
  if (
    isFirstClick &&
    (dateOfBirthInput.value === "" ||
      dateOfBirthInput.value === dateOfBirthFormat)
  ) {
    dateOfBirthInput.value = dateOfBirthFormat;
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

// Formats user's input using getFormattedInput function and sets the input value to the formatted value.
// Positions the cursor after the last entered character, or before the first placeholder.
dateOfBirthInput.addEventListener("input", ({ target: { value } }) => {
  const formattedDateOfBirthInput = getFormattedInput(value);
  dateOfBirthInput.value = formattedDateOfBirthInput;
  const nextPosition = formattedDateOfBirthInput.search(/D|M|Y/);
  dateOfBirthInput.setSelectionRange(nextPosition, nextPosition);
});

dateOfBirthInput.addEventListener("input", () =>
  validateInput(dateOfBirthInput)
);

// "Ctrl + A", "Backspace" and "Delete" modifies the input value accordingly while preserving the date format and positions the cursor correctly.
// If the user presses any arrow key, it prevents the default behavior, avoiding unwanted cursor movement.
dateOfBirthInput.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key === "a") {
    event.preventDefault();
    dateOfBirthInput.setSelectionRange(0, dateOfBirthInput.value.length);
  } else if (event.key === "Backspace" || event.key === "Delete") {
    const isValidDateBefore = isValidDate(dateOfBirthInput.value);
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
        dateOfBirthFormat[position]
      }${currentValue.slice(position + 1)}`;
      dateOfBirthInput.setSelectionRange(position, position);
    } else {
      const firstHalf = currentValue.slice(0, selectionStart);
      const secondHalf = currentValue.slice(selectionEnd);
      dateOfBirthInput.value = `${firstHalf}${dateOfBirthFormat.substring(
        firstHalf.length,
        selectionEnd
      )}${secondHalf}`;
      dateOfBirthInput.setSelectionRange(selectionStart, selectionStart);
    }
    if (isValidDateBefore !== isValidDate(dateOfBirthInput.value)) {
      validateInput(dateOfBirthInput);
    }
  } else if (event.key.startsWith("Arrow")) {
    event.preventDefault();
  }
});

togglePasswordButton.addEventListener("click", () => {
  togglePasswordVisibility(passwordInput);
});

toggleConfirmPasswordButton.addEventListener("click", () => {
  togglePasswordVisibility(confirmPasswordInput);
});

function handleEvent(event, input) {
  if (event.type === "input" && input === dateOfBirthInput) return;
  const isValid = validateInput(input);
  if (!isValid && input.classList.contains("invalid")) {
    displayError(input);
  }
}

function displayErrorMessage(input, errorType) {
  const existingError = input.nextElementSibling;
  if (existingError && existingError.classList.contains("error-message")) {
    existingError.remove();
  }
  const errorMessage = document.createElement("div");
  errorMessage.classList.add("error-message");
  errorMessage.id = "error-message";
  switch (errorType) {
    case "required":
      errorMessage.textContent = `${input.placeholder} is required`;
      break;
    case "invalid":
      errorMessage.textContent = `${input.placeholder} is invalid`;
      break;
  }
  const inputRect = input.getBoundingClientRect();
  errorMessage.style.top = `${inputRect.top + window.scrollY}px`;
  if (input.id === "first-name-input") {
    errorMessage.style.left = `${inputRect.left - 195}px`;
  } else {
    errorMessage.style.left = `${inputRect.right + 20}px`;
  }
  input.parentNode.insertBefore(errorMessage, input.nextSibling);
  setTimeout(() => {
    errorMessage.style.opacity = "1";
  }, 0);
  setTimeout(() => {
    errorMessage.style.opacity = "0";
    setTimeout(() => {
      errorMessage.remove();
    }, 1000);
  }, 3000);
}

function displayError(input) {
  if (!input.hasErrorEventAttached) {
    input.addEventListener("focusout", () => {
      if (input.classList.contains("invalid")) {
        const errorType = input.value === "" ? "required" : "invalid";
        displayErrorMessage(input, errorType);
      }
    });
    input.hasErrorEventAttached = true;
  }
}

// Finds the position of the last entered input value that is not "D", "M", or "Y".
function findLastEnteredInputPosition(inputValue) {
  let position = inputValue.length - 1;
  while (position >= 0 && "DMY".includes(inputValue[position])) {
    position--;
  }
  return position + 1;
}

// Extracts only digits from the user's raw input, and formats them according to, and within, "DD/MM/YYYY".
function getFormattedInput(inputValue) {
  const inputDigits = inputValue.replace(/\D/g, "");
  let formattedDateOfBirthInput = "";
  for (let i = 0, j = 0; i < dateOfBirthFormat.length; i++) {
    if ("DMY".includes(dateOfBirthFormat[i])) {
      formattedDateOfBirthInput +=
        j < inputDigits.length ? inputDigits[j++] : dateOfBirthFormat[i];
    } else {
      formattedDateOfBirthInput += dateOfBirthFormat[i];
    }
  }
  return formattedDateOfBirthInput;
}

function validateInput(input) {
  const rule = validationRules[input.id];
  if (!rule) return;
  let isValid;
  if (typeof rule === "function") {
    isValid = rule(input.value);
  } else {
    isValid = rule.test(input.value);
  }
  input.classList.remove("valid", "invalid");
  input.classList.add(isValid ? "valid" : "invalid");
}

function isValidDate(dateString) {
  if (!/^\d\d\/\d\d\/\d\d\d\d$/.test(dateString)) {
    return false;
  }
  const dateElements = dateString.split("/").map((part) => parseInt(part, 10));
  dateElements[1] -= 1;
  const dateObj = new Date(dateElements[2], dateElements[0], dateElements[1]);
  const isFullyEntered =
    !dateString.includes("D") &&
    !dateString.includes("M") &&
    !dateString.includes("Y");
  return (
    isFullyEntered &&
    dateObj.getDate() === dateElements[1] &&
    dateObj.getMonth() === dateElements[0] &&
    dateObj.getFullYear() === dateElements[2] &&
    dateObj.getFullYear() >= 1905
  );
}

function togglePasswordVisibility(inputElement) {
  if (inputElement.type === "password") {
    inputElement.type = "text";
  } else {
    inputElement.type = "password";
  }
}

function createPasswordStrengthIndicator(passwordInput) {
  const indicator = document.createElement("div");
  indicator.classList.add("password-strength-indicator");
  indicator.id = "password-strength-indicator";
  for (let i = 0; i < 3; i++) {
    const indicatorBar = document.createElement("div");
    indicatorBar.classList.add("password-strength-indicator-bar");
    indicator.appendChild(indicatorBar);
  }
  form.insertBefore(indicator, password.nextSibling);
}
