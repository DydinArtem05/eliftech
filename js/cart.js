let prodList = JSON.parse(localStorage.getItem('productList')) || [];
const cartProductBlock = document.querySelector(".cart-product__block");
let prodCounts = {};

function updatePrice() {
  const products = document.querySelectorAll('.cart__product');

  let totalPrice = 0;

  products.forEach((product) => {
    const priceElement = product.querySelector('.cart__product-price');
    const quantityInput = product.querySelector('input[type="text"]');
    const price = parseFloat(priceElement.textContent.replace('Price: ', ''));
    const quantity = parseInt(quantityInput.value);

    const productPrice = price * quantity;

    totalPrice += productPrice;
  });

  const totalPriceElement = document.querySelector('.total__price');
  totalPriceElement.innerHTML = 'Total Price: ' + totalPrice.toFixed(2);
}

function createProductElement(product, occurrences) {
  const productElement = document.createElement('div');
  productElement.classList.add('cart__product');
  productElement.innerHTML = `
    <div class="cart__product-image">
      <img src="${product.image}" />
    </div>
    <div>
      <div>
        <div>${product.name}</div>
        <div class="cart__product-price">Price: ${product.price}</div>
      </div>
      <div class="cart__product-quantity">
        <div class="cart__product-add-button"><button>+</button></div>
        <div class="cart__product-name"><input type="text" value="${occurrences + 1}" data-name="${product.name}"></div>
        <div class="cart__product-minus-button"><button>-</button></div>
      </div>
    </div>
  `;
  console.log('1')
  return productElement;
}

function updateCart() {
  for (let i = 0; i < prodList.length; i++) {
    const prodName = prodList[i].name;
    const occurrences = prodCounts[prodName] || 0;
    prodCounts[prodName] = occurrences + 1;

    if (occurrences === 0) {
      const productElement = createProductElement(prodList[i], occurrences);
      cartProductBlock.append(productElement);
    } else {
      const quantityInput = cartProductBlock.querySelector(`input[data-name="${prodName}"]`);
      quantityInput.value = occurrences + 1;
    }
  }

  const addQuantityButtons = document.querySelectorAll('.cart__product-add-button');
  addQuantityButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const quantityInput = button.nextElementSibling.querySelector('input');
      const prodName = quantityInput.getAttribute('data-name');
      prodCounts[prodName] += 1;
      quantityInput.value = prodCounts[prodName];
      updatePrice();
      updateLocalStorage(prodCounts);
    });
  });

  const subtractQuantityButtons = document.querySelectorAll('.cart__product-minus-button');
  subtractQuantityButtons.forEach((button) => {
    console.log('3')
    button.addEventListener('click', () => {
      const quantityInput = button.previousElementSibling.querySelector('input');
      const prodName = quantityInput.getAttribute('data-name');
      if (prodCounts[prodName] > 1) {
        prodCounts[prodName] -= 1;
        quantityInput.value = prodCounts[prodName];
        updatePrice();
        updateLocalStorage(prodCounts);
      }
    });
  });
  updatePrice();
}

const quantityInputs = document.querySelectorAll('.cart__product-quantity input[type="text"]');
quantityInputs.forEach((input) => {
  input.addEventListener('change', updatePrice);
});

function updateLocalStorage(counts) {
  const updatedProdList = prodList.map((product) => {
    if (counts.hasOwnProperty(product.name)) {
      product.count = counts[product.name];
    }
    return product;
  });
  localStorage.setItem('productList', JSON.stringify(updatedProdList));
  prodList = updatedProdList;
}

function getSelectedProducts() {
  const products = document.querySelectorAll('.cart__product');
  const selectedProducts = [];

  products.forEach((product) => {
    const name = product.querySelector('.cart__product-name').textContent;
    const price = parseFloat(product.querySelector('.cart__product-price').textContent.replace('Price: ', ''));
    const quantity = parseInt(product.querySelector('input[type="text"]').value);

    selectedProducts.push({ name, price, quantity });
  });

  return selectedProducts;
}


const submitButton = document.querySelector('.submit-button');
submitButton.addEventListener('click', () => {
  const nameInput = document.querySelector('input[name="name"]');
  const emailInput = document.querySelector('input[name="email"]');
  const phoneInput = document.querySelector('input[name="phone"]');
  const addressInput = document.querySelector('input[name="address"]');

  const data = {
    name: nameInput.value,
    email: emailInput.value,
    phone: phoneInput.value,
    address: addressInput.value,
    products: getSelectedProducts() // Получаем только выбранные товары
  };

  fetch('../json/saveData.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(result => {
      console.log('Data saved successfully:', result);
    })
    .catch(error => {
      console.error('Error saving data:', error);
    });
});
document.addEventListener('DOMContentLoaded', updateCart);
