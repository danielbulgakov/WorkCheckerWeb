function checkLogin () {
    var login = document.getElementById("username")
    var error_label = document.getElementById("label-error")
    if (!login.value.includes('@')) {
        error_label.style.visibility = 'visible'
        error_label.innerText = "Логин не является адресом электронной почты"
        login.value = ""
    }
    else {
        error_label.style.visibility = 'hidden'
    }
}

function checkRepeatedPassword () {

    var pass1 = document.getElementById("password")
    var pass2 = document.getElementById("password-repeat")
    var error_label = document.getElementById("label-error")
    if (pass1.value != pass2.value) {
        error_label.style.visibility = 'visible'
        error_label.innerText = "Пароли не совпадают"
        pass2.value = ""
    }
    else {
        error_label.style.visibility = 'hidden'
    }
}
