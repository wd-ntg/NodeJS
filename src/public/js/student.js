document.addEventListener(
    'DOMContentLoaded',
    function () {
        var click_bm_number = document.querySelectorAll('.bm-number');
        var content__img = document.querySelectorAll('.content__item-img');
        let wrap__container = document.getElementById('wrap__container');
        let wrap = document.getElementById('wrap');

        var item = document.querySelectorAll('.item');

        let video = document.querySelector('.video');

        for (var i = 0; i < click_bm_number.length; i++) {
            click_bm_number[i].onclick = function () {
                for (var j = 0; j < click_bm_number.length; j++) {
                    click_bm_number[j].classList.remove('number-active');
                }
                this.classList.add('number-active');
                var but_active = this;
                var pos_active = 0;
                for (pos_active = 0; (but_active = but_active.previousElementSibling); pos_active++) {}
                for (var i = 0; i < content__img.length; i++) {
                    content__img[i].classList.remove('active');
                }
                content__img[pos_active].classList.add('active');
            };
        }

        let move__background = function () {};
        // setTimeout(function () {
        //     wrap__container.style.display = 'none';
        //     wrap.style.display = 'block';
        //     video.style.display = 'block';
        // }, 10000);

        // function randomItems(n) {
        //     let index = Math.floor(Math.random() * item.length);
        //     for (let i = 0; i < n; i++) {
        //         var a = item[index].classList.add('random__zoom-item');
        //     }
        //     return a;
        // }

        // setTimeout(function () {
        //     randomItems(3);
        // }, 1000);
    },
    false,
);
