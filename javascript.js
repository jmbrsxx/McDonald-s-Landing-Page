const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("total-price");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-button");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address-input");
const addressWarn = document.getElementById("address-warn");

let cart = [];

// Open cart modal
cartBtn.addEventListener("click", function () {
  cartModal.style.display = "flex";
});

// Close modal by clicking outside the cart
cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

// Close modal by clicking the "Fechar" button
closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});


// Add to cart when clicking on cart buttons
menu.addEventListener("click", function (event) {
  let parentButton = event.target.closest(".purchase-cart");

  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));
    addToCart(name, price);
  }
});

// Add item to cart
function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  updateCartModal();
}

// Remove item from cart
// Remove one unit from an item in the cart
function removeFromCart(name) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity -= 1;

    if (existingItem.quantity <= 0) {
      // Remove item completely if quantity is 0
      cart = cart.filter((item) => item.name !== name);
    }
  }

  updateCartModal();
}


// Update cart modal
function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    total += item.price * item.quantity;

    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("cart-item");

    cartItemElement.innerHTML = `
      <div class="cart-item-info">
        <p>${item.name}</p>
        <p>Qtd: ${item.quantity}</p>
        <p>$ ${(item.price * item.quantity).toFixed(2)}</p>
      </div>
      <div>
        <button class="remove-btn" data-name="${item.name}">Remover</button>
      </div>
    `;


    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = `Total: $ ${total.toFixed(2)}`;

  // Update cart counter
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCounter.textContent = `(${totalItems})`;
}

// Handle remove button clicks
cartItemsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-btn")) {
    const name = event.target.getAttribute("data-name");
    removeFromCart(name);
  }
});

// Handle checkout button
// Handle checkout button
checkoutBtn.addEventListener("click", function () {
  const address = addressInput.value.trim();

  // Check if the cart is empty
  if (cart.length === 0) {
    alert("Seu carrinho está vazio! Adicione itens antes de finalizar o pedido.");
    return;
  }

  // Check if address is empty or invalid
  if (address === "") {
    addressWarn.style.display = "block";
    return;
  }

  // (Optional) Add a basic address validation rule
  // For example: must have at least 5 characters and a space (like "Rua X, 123")
  if (address.length < 5 || !address.includes(" ")) {
    addressWarn.textContent = "Por favor, insira um endereço válido.";
    addressWarn.style.display = "block";
    return;
  }

  // If everything is okay:
  addressWarn.style.display = "none";
  alert("Pedido confirmado! Obrigado pela compra :)");

  // Clear cart and reset UI
  cart = [];
  updateCartModal();
  addressInput.value = "";
  cartModal.style.display = "none";
});
