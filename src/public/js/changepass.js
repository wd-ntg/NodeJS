document.addEventListener(
    'DOMContentLoaded',
    function () {
        let form__login = document.querySelector('.form-login');

        const form__password = document.querySelector('.form--password');
        const form__password_confirm = document.querySelector('.form--password-confirm');
        const warning = document.querySelector('.warning');
        form__login.addEventListener('submit', function (e) {
            if (form__password.value != form__password_confirm.value) {
                e.preventDefault();
                warning.innerHTML = 'Confirmation password is incorrect!';
            }
        });
        form__password_confirm.addEventListener('input', (e) => {
            warning.innerHTML = '';
        });
    },
    false,
);
