const form = document.getElementById("form");
const textInputs = document.querySelectorAll(
  "input[type='text'], input[type='password']"
);
const firstNameInput = document.getElementById("first-name-input");
const lastNameInput = document.getElementById("last-name-input");
const userNameInput = document.getElementById("user-name-input");
const dateOfBirthInput = document.getElementById("date-of-birth-input");
const emailAddressInput = document.getElementById("email-address-input");
const phoneNumberInput = document.getElementById("phone-number-input");
const radioInputs = document.querySelectorAll("input[type='radio']");
const passwordInput = document.getElementById("password-input");
const togglePasswordButton = document.getElementById("toggle-password");
const passwordStrengthIndicator = document.getElementById(
  "password-strength-indicator"
);
const confirmPasswordInput = document.getElementById("confirm-password-input");
const toggleConfirmPasswordButton = document.getElementById(
  "toggle-confirm-password"
);

const dateOfBirthFormat = "DD/MM/YYYY";

const validationRules = {
  "first-name-input": /^[a-zA-Z][a-zA-Z-]*$/,
  "last-name-input": /^[a-zA-Z][a-zA-Z-]*$/,
  "user-name-input": /^[a-zA-Z]{3}[a-zA-Z0-9_-]*$/,
  "date-of-birth-input": isValidDate,
  "email-address-input": /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  "phone-number-input": /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})(?:[- ]?\d)?$/,
  "password-input": function (value) {
    const strength = calculatePasswordStrength(value);
    return strength === 4;
  },
  "confirm-password-input": function (value) {
    return value === passwordInput.value;
  },
};

let formattedDateOfBirthInput;
let isFirstClick = true;

document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    return false;
  }
});

form.addEventListener("submit", (event) => {
  const hasEmptyInput = [...textInputs].some((input) => input.value === "");
  const hasInvalidInput = [...textInputs].some((input) =>
    input.classList.contains("invalid")
  );
  const hasUncheckedRadio = areRadiosUnchecked(radioInputs);
  if (hasInvalidInput || hasEmptyInput || hasUncheckedRadio) {
    event.preventDefault();
    if (hasEmptyInput) {
      textInputs.forEach((input) => {
        if (input.value === "") {
          input.classList.add("invalid");
          displayError(input);
          displayErrorMessage(input, "required");
        }
      });
    }
    if (hasUncheckedRadio) {
      const displayedErrors = new Set();
      radioInputs.forEach((input) => {
        if (!input.checked && !displayedErrors.has(input.name)) {
          input.classList.add("invalid");
          displayError(input);
          displayErrorMessage(input, "required");
          displayedErrors.add(input.name);
        }
      });
    }
  }
});

textInputs.forEach((input) => {
  const eventHandler = (event) => handleEvent(event, input);
  input.addEventListener("blur", eventHandler);
  input.addEventListener("input", eventHandler);
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

passwordInput.addEventListener("focusin", () => {
  if (passwordStrengthIndicator) {
    passwordStrengthIndicator.classList.add("active");
  }
});

passwordInput.addEventListener("focusout", () => {
  if (passwordStrengthIndicator) {
    passwordStrengthIndicator.classList.remove("active");
  }
});

passwordInput.addEventListener("input", () => {
  if (passwordStrengthIndicator) {
    const strength = calculatePasswordStrength(passwordInput.value);
    const passwordStrengthIndicatorBars =
      passwordStrengthIndicator.querySelectorAll(
        ".password-strength-indicator-bar"
      );
    passwordStrengthIndicatorBars.forEach((bar, index) => {
      bar.className = "password-strength-indicator-bar";
      if (index < strength) {
        bar.classList.add(`strength-${index}`);
      }
    });
  }
});

togglePasswordButton.addEventListener("click", () => {
  togglePasswordVisibility(passwordInput);
});

toggleConfirmPasswordButton.addEventListener("click", () => {
  togglePasswordVisibility(confirmPasswordInput);
});

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

function handleEvent(event, input) {
  if (event.type === "input" && input === dateOfBirthInput) return;
  const isValid = validateInput(input);
  if (!isValid && input.classList.contains("invalid")) {
    displayError(input);
  }
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
  if (!isValid) {
    displayError(input);
  }
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

function calculatePasswordStrength(password) {
  let passwordStrength = 0;
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[\W_]/.test(password);
  const hasValidLength = password.length >= 12;
  if (hasLowerCase || hasUpperCase) {
    passwordStrength++;
  }
  if (hasLowerCase && hasUpperCase) {
    passwordStrength++;
  }
  if (hasNumber && hasSpecialChar) {
    passwordStrength++;
  }
  if (hasValidLength) {
    passwordStrength++;
  }
  return passwordStrength;
}

function togglePasswordVisibility(inputElement) {
  if (inputElement.type === "password") {
    inputElement.type = "text";
  } else {
    inputElement.type = "password";
  }
}

function areRadiosUnchecked(radioInputs) {
  const radioButtonGroups = {};
  radioInputs.forEach((input) => {
    const groupName = input.name;
    if (!radioButtonGroups[groupName]) {
      radioButtonGroups[groupName] = [];
    }
    radioButtonGroups[groupName].push(input);
  });
  for (const groupName in radioButtonGroups) {
    const isChecked = radioButtonGroups[groupName].some(
      (input) => input.checked
    );
    if (!isChecked) {
      return true;
    }
  }
  return false;
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
      if (input.type === "radio") {
        errorMessage.textContent = "Verification Method is required";
      } else {
        errorMessage.textContent = `${input.placeholder} is required`;
      }
      break;
    case "invalid":
      if (input.id === "password-input") {
        errorMessage.textContent = "Password is too weak";
      } else if (input.id === "confirm-password-input") {
        errorMessage.textContent = "Passwords do not match";
      } else {
        errorMessage.textContent = `${input.placeholder} is invalid`;
      }
      break;
  }
  const inputRect = input.getBoundingClientRect();
  errorMessage.style.top = `${inputRect.top + window.scrollY}px`;
  if (input.id === "first-name-input") {
    errorMessage.style.left = `${inputRect.left - 190}px`;
  } else if (input.id === "password-input") {
    errorMessage.style.top = `${inputRect.bottom - 595}px`;
    errorMessage.style.left = `${inputRect.left + -910}px`;
  } else if (input.id === "confirm-password-input") {
    errorMessage.style.top = `${inputRect.bottom - 658}px`;
    errorMessage.style.left = `${inputRect.left + -910}px`;
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
