const firstNameInput = document.getElementById("first-name-input");
const lastNameInput = document.getElementById("last-name-input");
const userNameInput = document.getElementById("user-name-input");
const dateOfBirthInput = document.getElementById("date-of-birth-input");
const emailAddressInput = document.getElementById("email-address-input");
const phoneNumberInput = document.getElementById("phone-number-input");
const passwordInput = document.getElementById("password-input");
const confirmPasswordInput = document.getElementById("confirm-password-input");
const textInputs = document.querySelectorAll("input[type='text']");

const dateOfBirthFormat = "DD/MM/YYYY";

let formattedDateOfBirthInput;
let isFirstClick = true;

/* If the user's input === "DD/MM/YYY", the isFirstClick flag is reset. */
dateOfBirthInput.addEventListener("blur", () => {
  if (dateOfBirthInput.value === dateOfBirthFormat) {
    dateOfBirthInput.value = "";
    isFirstClick = true;
  }
});

/* If isFirstClick, and the user's input === "DD/MM/YYY", cursor is placed at the beginning.
If !isFirstClick, positions the cursor after the last entered character, or before the first placeholder. */
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

/* Formats user's input using getFormattedInput function and sets the input value to the formatted value.
Positions the cursor after the last entered character, or before the first placeholder. */
dateOfBirthInput.addEventListener("input", ({ target: { value } }) => {
  const formattedDateOfBirthInput = getFormattedInput(value);
  dateOfBirthInput.value = formattedDateOfBirthInput;
  const nextPosition = formattedDateOfBirthInput.search(/D|M|Y/);
  dateOfBirthInput.setSelectionRange(nextPosition, nextPosition);
});

/* "Ctrl + A", "Backspace" and "Delete" modifies the input value accordingly while preserving the date format and positions the cursor correctly.
If the user presses any arrow key, it prevents the default behavior, avoiding unwanted cursor movement. */
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
  } else if (event.key.startsWith("Arrow")) {
    event.preventDefault();
  }
});

/* Finds the position of the last entered input value that is not "D", "M", or "Y". */
const findLastEnteredInputPosition = (inputValue) => {
  let position = inputValue.length - 1;
  while (position >= 0 && "DMY".includes(inputValue[position])) {
    position--;
  }
  return position + 1;
};

/* Extracts digits from the user's input, and formats them according to, and within, "DD/MM/YYYY". */
const getFormattedInput = (inputValue) => {
  const inputDigits = inputValue.replace(/\D/g, "");
  formattedDateOfBirthInput = "";
  for (let i = 0, j = 0; i < dateOfBirthFormat.length; i++) {
    if ("DMY".includes(dateOfBirthFormat[i])) {
      formattedDateOfBirthInput +=
        j < inputDigits.length ? inputDigits[j++] : dateOfBirthFormat[i];
    } else {
      formattedDateOfBirthInput += dateOfBirthFormat[i];
    }
  }
  return formattedDateOfBirthInput;
};
