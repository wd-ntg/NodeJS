document.addEventListener(
    'DOMContentLoaded',
    function () {
        var click_login = document.querySelector('.form--submit-login');
        var click_signup = document.querySelector('.form--submit-singup');
        let form__signup = document.querySelector('.form-singup');
        let form__login = document.querySelector('.form-login');
        click_login.onclick = function (e) {
            e.preventDefault();
            form__signup.classList.add('hidden');
            form__login.classList.remove('hidden');
        };
        click_signup.onclick = function (e) {
            e.preventDefault();
            form__signup.classList.remove('hidden');
            form__login.classList.add('hidden');
        };

        const okayToEmailSignup = document.getElementById('okayToEmail-signup');
        const okayToEmailLogin = document.getElementById('okayToEmail-login');
        const notify = document.querySelector('.notify');
        const form__password = document.querySelector('.form--password');
        const form__password_confirm = document.querySelector('.form--password-confirm');
        const warning = document.querySelector('.warning');
        form__signup.addEventListener('submit', function (e) {
            if (form__password.value != form__password_confirm.value) {
                e.preventDefault();
                warning.innerHTML = 'Confirmation password is incorrect!';
            }
            if (!okayToEmailSignup.checked) {
                e.preventDefault();
                notify.innerHTML = 'You do not agree to the terms!';
            }
        });
        okayToEmailSignup.onclick = function () {
            notify.innerHTML = '';
        };
        form__password_confirm.addEventListener('input', (e) => {
            warning.innerHTML = '';
        });
    },
    false,
);
