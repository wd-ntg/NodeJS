document.addEventListener(
    'DOMContentLoaded',
    function () {
        let item__link = document.querySelectorAll('.item__link');
        let item = document.querySelectorAll('.item');
        let wrap__right_item = document.querySelectorAll('.wrap__right-item');
        let wrap__right_item_des = document.querySelector('.wrap__right-item--des');

        for (let i = 0; i < item.length; i++) {
            item[i].addEventListener('mouseenter', function () {
                {
                    wrap__right_item_des.style.display = 'none';
                    var but_active = this;
                    var pos_active = 0;
                    for (pos_active = 0; (but_active = but_active.previousElementSibling); pos_active++) {}
                    wrap__right_item[pos_active].classList.add('active');
                }
            });
        }
        for (let k = 0; k < item__link.length; k++) {
            item[k].addEventListener('mouseleave', function () {
                wrap__right_item_des.style.display = 'flex';
                wrap__right_item[k].classList.remove('active');
            });
        }
    },
    false,
);
