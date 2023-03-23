const firstNameInput = document.getElementById("first-name-input");

const LastNameInput = document.getElementById("first-name-input");

const userNameInput = document.getElementById("user-name-input");

const emailAddressInput = document.getElementById("email-address-input");

const phoneNumberInput = document.getElementById("phone-number-input");

const passwordInput = document.getElementById("password-input");

const confirmPasswordInput = document.getElementById("confirm-password-input");

const dateOfBirthInput = document.getElementById('date-of-birth-input');
const dateFormat = 'DD/MM/YYYY';
let firstClick = true;

function findLastEnteredInputPosition(inputValue) {
  let position = inputValue.length - 1;
  while (position >= 0 && 'DMY'.includes(inputValue[position])) {
    position--;
  }
  return position + 1;
}

function getFormattedInput(inputValue) {
  const inputDigits = inputValue.replace(/\D/g, '');
  let formattedInput = '';
  for (let i = 0, j = 0; i < dateFormat.length; i++) {
    if ('DMY'.includes(dateFormat[i])) {
      formattedInput += j < inputDigits.length ? inputDigits[j++] : dateFormat[i];
    } else {
      formattedInput += dateFormat[i];
    }
  }
  return formattedInput;
}

dateOfBirthInput.addEventListener('click', () => {
  if (firstClick && (dateOfBirthInput.value === '' || dateOfBirthInput.value === dateFormat)) {
    dateOfBirthInput.value = dateFormat;
    dateOfBirthInput.setSelectionRange(0, 0);
    firstClick = false;
  } else {
    const cursorPosition = ['D', 'M', 'Y'].reduce((pos, letter) => {
      return pos !== -1 ? pos : dateOfBirthInput.value.indexOf(letter);
    }, -1);
    dateOfBirthInput.setSelectionRange(cursorPosition, cursorPosition);
  }
});

dateOfBirthInput.addEventListener('blur', () => {
  if (dateOfBirthInput.value === dateFormat) {
    dateOfBirthInput.value = '';
    firstClick = true;
  }
});

dateOfBirthInput.addEventListener('input', (event) => {
  const formattedInput = getFormattedInput(event.target.value);
  dateOfBirthInput.value = formattedInput;
  const nextPosition = formattedInput.search(/D|M|Y/);
  dateOfBirthInput.setSelectionRange(nextPosition, nextPosition);
});

dateOfBirthInput.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.key === 'a') {
    event.preventDefault();
    dateOfBirthInput.setSelectionRange(0, dateOfBirthInput.value.length);
  } else if (event.key === 'Backspace' || event.key === 'Delete') {
    event.preventDefault();
    const currentValue = dateOfBirthInput.value;
    const selectionStart = dateOfBirthInput.selectionStart;
    const selectionEnd = dateOfBirthInput.selectionEnd;
    if (selectionStart === selectionEnd) {
      let position = selectionStart;
      if (event.key === 'Backspace' && position > 0) {
        position -= 1;
      } else if (event.key === 'Delete' && position < currentValue.length) {
        position += 1;
      }
      if (currentValue[position] === '/') {
        position += event.key === 'Backspace' ? -1 : 1;
      }
      dateOfBirthInput.value = currentValue.slice(0, position) + dateFormat[position] + currentValue.slice(position + 1);
      dateOfBirthInput.setSelectionRange(position, position);
    } else {
      const firstHalf = currentValue.slice(0, selectionStart);
      const secondHalf = currentValue.slice(selectionEnd);
      dateOfBirthInput.value = firstHalf + dateFormat.substring(firstHalf.length, selectionEnd) + secondHalf;
      dateOfBirthInput.setSelectionRange(selectionStart, selectionStart);
    }
  }
});
