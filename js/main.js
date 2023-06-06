const cartButton = document.getElementById("cart");
const navItem = document.getElementsByClassName("nav__item");

fetch("./json/navbar.json")
    .then(response => response.json())
    .then(data => {
        navbarMenu = data;
        for (const key in navbarMenu.Navbar) {
            navbar.innerHTML += `<div class="nav__item">${navbarMenu.Navbar[key].name}</div>`;
        }
    })
    .catch(error => console.log(error));

setTimeout(() => {
    for (var i = 0; i < navItem.length; i++) {
        navItem[i].addEventListener("click", handleClick)
    }
}, 1000)

