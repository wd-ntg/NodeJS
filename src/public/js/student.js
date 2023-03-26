document.addEventListener("DOMContentLoaded", function() {
    var click_bm_number = document.querySelectorAll('.bm-number')
    var wrap__img = document.querySelectorAll('.wrap__img')
    var content__img = document.querySelectorAll('.content__item--img')
    for(var i = 0; i<click_bm_number.length; i++) {
        click_bm_number[i].onclick = function() {
            for(var j=0; j<click_bm_number.length; j++) {
                click_bm_number[j].classList.remove('number-active')
            }
            this.classList.add('number-active')
            var but_active = this
            var pos_active = 0
            for(pos_active = 0; but_active = but_active.previousElementSibling; pos_active++) {}
            for(var i = 0; i<wrap__img.length; i++) {
                wrap__img[i].classList.remove('active')
                content__img[i].classList.remove('active')

            }
            wrap__img[pos_active].classList.add('active')
            content__img[pos_active].classList.add('active')
        }

    }
}, false)