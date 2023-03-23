const firstNameInput = document.getElementById("first-name-input");

const LastNameInput = document.getElementById("first-name-input");

const userNameInput = document.getElementById("user-name-input");

const dateOfBirthInput = document.getElementById("date-of-birth-input");

const emailAddressInput = document.getElementById("email-address-input");

const phoneNumberInput = document.getElementById("phone-number-input");

const passwordInput = document.getElementById("password-input");

const confirmPasswordInput = document.getElementById("confirm-password-input");

const dateFormat = 'DD/MM/YYYY';
let firstClick = true;

function findLastEnteredInputPosition(inputValue) {
  let position = inputValue.length - 1;
  while (position >= 0 && 'DMY'.includes(inputValue[position])) {
    position--;
  }
  return position + 1;
}

dateOfBirthInput.addEventListener('focus', () => {
  if (firstClick && (dateOfBirthInput.value === '' || dateOfBirthInput.value === dateFormat)) {
    dateOfBirthInput.value = dateFormat;
    dateOfBirthInput.setSelectionRange(0, 0);
    firstClick = false;
  } else {
    setTimeout(() => {
      let cursorPosition = dateOfBirthInput.value.indexOf('D');
      if (cursorPosition === -1) {
        cursorPosition = dateOfBirthInput.value.indexOf('M');
      }
      if (cursorPosition === -1) {
        cursorPosition = dateOfBirthInput.value.indexOf('Y');
      }
      if (cursorPosition === -1) {
        cursorPosition = dateOfBirthInput.value.length;
      }
      dateOfBirthInput.setSelectionRange(cursorPosition, cursorPosition);
    }, 0);
  }
});

dateOfBirthInput.addEventListener('blur', () => {
  if (dateOfBirthInput.value === dateFormat) {
    dateOfBirthInput.value = '';
    firstClick = true;
  }
});

dateOfBirthInput.addEventListener('input', () => {
  const inputDigits = dateOfBirthInput.value.replace(/\D/g, '');
  let formattedInput = '';

  for (let i = 0, j = 0; i < dateFormat.length; i++) {
    if ('DMY'.includes(dateFormat[i])) {
      formattedInput += j < inputDigits.length ? inputDigits[j++] : dateFormat[i];
    } else {
      formattedInput += dateFormat[i];
    }
  }

  dateOfBirthInput.value = formattedInput;
  const nextPosition = dateOfBirthInput.value.search(/D|M|Y/);
  dateOfBirthInput.setSelectionRange(nextPosition, nextPosition);
});

dateOfBirthInput.addEventListener('keydown', (event) => {
  if (event.key === 'Backspace' || event.key === 'Delete') {
    event.preventDefault();

    const currentValue = dateOfBirthInput.value;
    let position = dateOfBirthInput.selectionStart;

    if (position > 0) {
      if (currentValue[position - 1] === '/') {
        position--;
      }
      dateOfBirthInput.value = currentValue.slice(0, position - 1) + dateFormat[position - 1] + currentValue.slice(position);
      dateOfBirthInput.setSelectionRange(position - 1, position - 1);
    }
  }
});
