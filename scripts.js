const firstNameInput = document.getElementById("first-name-input");

const LastNameInput = document.getElementById("first-name-input");

const userNameInput = document.getElementById("user-name-input");

// const dateOfBirthInput = document.getElementById("date-of-birth-input");

const emailAddressInput = document.getElementById("email-address-input");

const phoneNumberInput = document.getElementById("phone-number-input");

const passwordInput = document.getElementById("password-input");

const confirmPasswordInput = document.getElementById("confirm-password-input");


const dobInput = document.getElementById('date-of-birth-input');

let firstClick = true;
const dateFormat = 'DD/MM/YYYY';

dobInput.addEventListener('focus', () => {
  if (firstClick && (dobInput.value === '' || dobInput.value === dateFormat)) {
    dobInput.value = dateFormat;
    dobInput.setSelectionRange(0, 0);
    firstClick = false;
  } else {
    const cursorPosition = dobInput.selectionStart;
    dobInput.setSelectionRange(cursorPosition, cursorPosition);
  }
});

dobInput.addEventListener('blur', () => {
  if (dobInput.value === dateFormat) {
    dobInput.value = '';
    firstClick = true;
  }
});

dobInput.addEventListener('input', () => {
  const inputDigits = dobInput.value.replace(/\D/g, '');
  let formattedInput = '';

  for (let i = 0, j = 0; i < dateFormat.length; i++) {
    if ('DMY'.includes(dateFormat[i])) {
      formattedInput += j < inputDigits.length ? inputDigits[j++] : dateFormat[i];
    } else {
      formattedInput += dateFormat[i];
    }
  }

  dobInput.value = formattedInput;
  const nextPosition = dobInput.value.search(/D|M|Y/);
  dobInput.setSelectionRange(nextPosition, nextPosition);
});

dobInput.addEventListener('keydown', (event) => {
  if (event.key === 'Backspace' || event.key === 'Delete') {
    event.preventDefault();

    const currentValue = dobInput.value;
    let position = dobInput.selectionStart;

    if (position > 0) {
      if (currentValue[position - 1] === '/') {
        position--;
      }
      dobInput.value = currentValue.slice(0, position - 1) + dateFormat[position - 1] + currentValue.slice(position);
      dobInput.setSelectionRange(position - 1, position - 1);
    }
  }
});
