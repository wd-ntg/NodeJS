document.addEventListener("DOMContentLoaded", function() {
    
    //Tao phong hoc moi
    var createRoomTH = document.querySelector('.nav__link-createroom')
    var wrap__modal = document.querySelector('.wrap__modal')
    var modal__manager = document.querySelector('.modal__manager')

    createRoomTH.onclick = function () {
        wrap__modal.style.display = 'flex'
    }
    modal__manager.onclick = function (e) {
        e.stopPropagation()
    }
    wrap__modal.onclick = function (e) {
        wrap__modal.style.display = 'none'
    }

    // Mo ta phong hoc

    var modal__des = document.querySelectorAll('.main__content-item--des')
    var wrap__modal_des = document.querySelectorAll('.main__content-des--wrap')
    var main__modal_des = document.querySelectorAll('.main__content-des--main')


    for (let i=0; i< modal__des.length; i++) {
        modal__des[i].onclick = () => {
            wrap__modal_des[i].classList.add('active')
        }
        main__modal_des[i].onclick = function (e) {
            e.stopPropagation()
        }
        wrap__modal_des[i].onclick = () => {
            wrap__modal_des[i].classList.remove('active')
        }
    }
     
    // Chinh sua thong tin phong hoc
    var edit = document.querySelectorAll('.edit')
    var wrap__modal_edit = document.querySelector('.wrap__modal-edit')
    var modal__manager_edit = document.querySelector('.modal__manager-edit')
    for(let j=0; j<edit.length; j++) {
        edit[j].onclick = (e) => {
            // e.preventDefault()
            wrap__modal_edit.classList.add('active')
        }
        modal__manager_edit.onclick = (e) => {
            e.stopPropagation()
        }
        wrap__modal_edit.onclick = () => {
            console.log("Hello")
            wrap__modal_edit.classList.add('active')
        }
    }

    // Hien thi danh sach thiet bi
    var modal__TB = document.querySelectorAll('.modal__TB')
    var main__content_TB = document.querySelector('.main__content-modal--TB')
    for(let i = 0; i<modal__TB.length; i++) {
        modal__TB[i].onclick = (e) => {
            console.log("Hello")
           main__content_TB[i].classList.add('active__TB')
        }
    }
}, false)