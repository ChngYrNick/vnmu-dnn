import '../styles/main.scss';
import '../styles/sign-up.scss';

document.addEventListener('load', () => {
  document.getElementById('repeatPassword').addEventListener('input', () => {
    const password = document.getElementById('password').value;
    const confirmPassword = this.value;

    if (password !== confirmPassword) {
      this.setCustomValidity('Passwords do not match');
    } else {
      this.setCustomValidity('');
    }
  });
});
