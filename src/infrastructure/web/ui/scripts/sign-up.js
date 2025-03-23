import '../styles/main.scss';
import '../styles/sign-up.scss';

addEventListener('load', () => {
  const passwordElem = document.getElementById('password');
  const repeatPasswordElem = document.getElementById('repeatPassword');

  repeatPasswordElem.addEventListener('input', () => {
    const password = passwordElem.value;
    const confirmPassword = repeatPasswordElem.value;

    if (password !== confirmPassword) {
      repeatPasswordElem.setCustomValidity('Passwords do not match');
    } else {
      repeatPasswordElem.setCustomValidity('');
    }
  });
});
