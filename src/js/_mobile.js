var mobileToggle = document.querySelectorAll('.mobile-toggle')
var mobileMenu = document.querySelector('.main-header')
var overlay = document.querySelector('.overlay')
var body = document.querySelector('body')
var main_navbar = document.querySelectorAll('.main-navbar ul li a')
var winWidth = window.innerWidth;


for (let i = 0; i < main_navbar.length; i++) {
    main_navbar[i].addEventListener('click', function () {
        mobileMenu.classList.toggle('active')
        overlay.classList.toggle('active')
        body.classList.toggle('m-overflow-hidden')
    })
}
for (let j = 0; j < mobileToggle.length; j++) {
    mobileToggle[j].addEventListener('click', function () {
        mobileMenu.classList.toggle('active')
        overlay.classList.toggle('active')
        body.classList.toggle('m-overflow-hidden')
    })
}
overlay.addEventListener('click', function () {
    mobileMenu.classList.toggle('active')
    overlay.classList.toggle('active')
    body.classList.toggle('m-overflow-hidden')
})