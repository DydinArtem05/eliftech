const navbar = document.querySelector(".nav__menu");
const productBlock = document.querySelector(".product__block");
let navbarMenu = {};
let productCart = [];
let productArr = [];
let products = "";

function handleClick(event) {
  const clickedElement = event.target;
  const clickedElementInnerHTML = clickedElement.innerHTML;
  disableOtherButtons(clickedElement);
  GetProducts(clickedElementInnerHTML);
}

function disableOtherButtons(clickedButton) {
  const navbarButtons = document.querySelectorAll(".nav__menu .nav__item");

  navbarButtons.forEach(button => {
    if (button !== clickedButton) {
      button.classList.add("disabled");
    }
  });
}

function AddProductToCart(productObj) {
  productCart.push(productObj);
  console.log(productCart);
  localStorage.setItem('productList', JSON.stringify(productCart));
  console.log(localStorage);
}

function AddProduct(imageSrc, productName, productPrice) {
  console.log(imageSrc);
  console.log(productName);
  let productObj = {
    name: productName,
    image: imageSrc,
    price: productPrice
  }
  AddProductToCart(productObj)
}

function GetProducts(item) {
  productBlock.innerHTML = '';
  fetch("../json/product.json")
    .then(response => response.json())
    .then(data => {
      productArr = data;
      for (const key in productArr) {
        if (key === item) {
          for (var i = 0; i < productArr[key].length; i++) {
            productBlock.innerHTML += `<div class="product__item"><img src=${productArr[key][i].src} class="product__image" /><div class="product__name">${productArr[key][i].name}</div><div class="product__price">${productArr[key][i].price} $</div><button class="product__button">Add to Cart</button></div>`;
          }
        }
      }
    })
    .catch(error => console.log(error));
  setTimeout(() => {
    products = document.querySelectorAll(".product__item");
    console.log(products);
    productBlock.addEventListener('click', function (event) {
      if (event.target.classList.contains('product__button')) {
        var productItem = event.target.closest('.product__item');
        var img = productItem.querySelector('.product__image');
        var nameDiv = productItem.querySelector('.product__name');
        var priceDiv = productItem.querySelector(".product__price");
        var imageSrc = img.src;
        var productName = nameDiv.innerHTML;
        var productPrice = priceDiv.innerHTML;
        AddProduct(imageSrc, productName, productPrice);
      }
    });
  }, 1000)
}
