// Hamburger Menu Functionality

const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav__bar");
const mobileClose = document.querySelector(".mobile__close");
const links = document.querySelectorAll(".links");

hamburger.addEventListener("click", toggleOpen);
mobileClose.addEventListener("click", toggleClose);

function toggleOpen() {
  navLinks.classList.toggle("active");
  mobileClose.classList.toggle("active");
  hamburger.classList.toggle("active");
}

function toggleClose() {
  hamburger.classList.toggle("active");
  mobileClose.classList.toggle("active");
  navLinks.classList.toggle("active");
}

links.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
    mobileClose.classList.remove("active");
    hamburger.classList.remove("active");
  });
});

const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const cartClose = document.querySelector(".cart__close");

cartIcon.onclick = () => {
  cart.classList.add("active");
};

cartClose.onclick = () => {
  cart.classList.remove("active");
};

//Cart Working JS
if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    ready();
    loadCartItems();
    updateCartBadge(); // Load cart items on page load
  });
} else {
  ready();
  loadCartItems();
  updateCartBadge();
  // Load cart items if DOM is already ready
}
//Making Function
function ready() {
  //Remove item from Cart
  var removeCartButtons = document.getElementsByClassName("cart__remove");

  for (var i = 0; i < removeCartButtons.length; i++) {
    var button = removeCartButtons[i];
    button.addEventListener("click", removeCartItem);
  }
  updateCartBadge();
  // Change Quantity
  var quantityInput = document.getElementsByClassName("cart__quantity");
  for (var i = 0; i < quantityInput.length; i++) {
    var input = quantityInput[i];
    input.addEventListener("change", quantityChange);
  }
  updateCartBadge();
  // Add to Cart
  var addCart = document.getElementsByClassName("cart__icon");
  for (var i = 0; i < addCart.length; i++) {
    var button = addCart[i];
    button.addEventListener("click", addCartClicked); //changed chat gpt
  }
  updateCartBadge();
}

//Remove Cart Item
function removeCartItem(event) {
  var buttonClicked = event.target;
  buttonClicked.parentElement.remove();

  updateTotal();
  updateCartBadge();
}
//Quantity change
function quantityChange(event) {
  var input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  updateTotal();
  updateCartBadge();
}

// Add to Cart Function
function addCartClicked(event) {
  var button = event.target.closest(".btn.cart__icon"); // Ensure you get the closest button element
  var shopProducts;

  // Determine the page type and use the appropriate class names
  if (document.body.classList.contains("index-page")) {
    shopProducts = button.closest(".product__box");
  } else if (document.body.classList.contains("accessories-page")) {
    shopProducts = button.closest(".accessories__box");
  }

  var titleElement = shopProducts.querySelector(".product__text-title");
  var priceElement = shopProducts.querySelector(".price");
  var imgElement = shopProducts.querySelector(".product__img");

  if (titleElement && priceElement && imgElement) {
    var title = titleElement.innerText;
    var price = priceElement.innerText;
    var productImg = imgElement.src;

    if (productImg) {
      addProductToCart(title, price, productImg);
      updateTotal();
      updateLocalStorage();
      updateCartBadge();
    }
  }
}

// Update Cart Function
function addProductToCart(title, price, productImg) {
  var cartShopBox = document.createElement("div");
  cartShopBox.classList.add("cart__box");
  var cartItems = document.getElementsByClassName("cart__content")[0];
  var cartItemsNames = cartItems.getElementsByClassName("cart__product-title");

  for (var i = 0; i < cartItemsNames.length; i++) {
    if (cartItemsNames[i].innerText === title) {
      // alert("You have already added item to cart");
      return;
    }
  }

  var cartBoxContent = `
    <img src="${productImg}" alt="${title}" class="cart__img" width="100px" height="100px">
    <div class="detail__box">
      <div class="cart__product-title">${title}</div>
      <div class="cart__price">${price}</div>
      <input type="number" value="1" class="cart__quantity">
    </div>
    <i class="fa-solid fa-trash cart__remove"></i>`;

  cartShopBox.innerHTML = cartBoxContent;
  cartItems.append(cartShopBox);

  // Reattach event listeners
  cartShopBox
    .getElementsByClassName("cart__remove")[0]
    .addEventListener("click", removeCartItem);
  cartShopBox
    .getElementsByClassName("cart__quantity")[0]
    .addEventListener("change", quantityChange);

  updateCartBadge();
  updateLocalStorage();
}

// Update Total Function
function updateTotal() {
  // Get cart content and boxes
  const cartContent = document.getElementsByClassName("cart__content")[0];
  const cartBoxes = cartContent.getElementsByClassName("cart__box");
  let total = 0;

  // Iterate over cart boxes to calculate total
  for (let i = 0; i < cartBoxes.length; i++) {
    const cartBox = cartBoxes[i];
    const priceElement = cartBox.getElementsByClassName("cart__price")[0];
    const quantityElement = cartBox.getElementsByClassName("cart__quantity")[0];

    // Ensure priceElement and quantityElement exist
    if (!priceElement || !quantityElement) {
      console.error("Missing price or quantity element.");
      continue;
    }

    // Parse price and quantity
    const price = parseFloat(priceElement.innerText.replace("$", ""));
    const quantity = parseInt(quantityElement.value, 10);

    // Validate parsed values
    if (isNaN(price) || isNaN(quantity)) {
      console.error("Invalid price or quantity value.");
      continue;
    }

    // Update total
    total += price * quantity;
  }

  // Update total price display
  const totalPriceElement = document.getElementsByClassName("total__price")[0];
  if (totalPriceElement) {
    totalPriceElement.innerText = "$" + total.toFixed(2);
  }

  // Update local storage
  const updatedCartItems = Array.from(cartBoxes).map((cartBox) => {
    const title = cartBox.getElementsByClassName("cart__product-title")[0]
      .innerText;
    const quantity = parseInt(
      cartBox.getElementsByClassName("cart__quantity")[0].value,
      10
    );
    const price = parseFloat(
      cartBox
        .getElementsByClassName("cart__price")[0]
        .innerText.replace("$", "")
    );
    const imgSrc = cartBox.getElementsByClassName("cart__img")[0]?.src || ""; // Include imgSrc if needed

    return { title, quantity, price, imgSrc };
  });

  localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
}

// Function save items to cart

function saveCartItems() {
  const cartItems = [];
  const cartBoxes = document.getElementsByClassName("cart__box");

  for (let i = 0; i < cartBoxes.length; i++) {
    const cartBox = cartBoxes[i];
    const title = cartBox.getElementsByClassName("cart__product-title")[0]
      .innerText;
    const price = parseFloat(
      cartBox
        .getElementsByClassName("cart__price")[0]
        .innerText.replace("$", "")
    );
    const quantity = parseInt(
      cartBox.getElementsByClassName("cart__quantity")[0].value,
      10
    );
    const imgSrc = cartBox.getElementsByClassName("cart__img")[0]?.src || ""; // Ensure imgSrc is set

    cartItems.push({ title, price, quantity, imgSrc });
  }

  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

// Function load cart items

function loadCartItems() {
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  // Empty the current cart
  const cartItemsContainer =
    document.getElementsByClassName("cart__content")[0];
  cartItemsContainer.innerHTML = "";

  cartItems.forEach((item) => {
    const cartShopBox = document.createElement("div");
    cartShopBox.classList.add("cart__box");

    const cartBoxContent = `
      <img src="${
        item.imgSrc
      }" alt="" class="cart__img" width="100px" height="100px">
      <div class="detail__box">
        <div class="cart__product-title">${item.title}</div>
        <div class="cart__price">$${item.price.toFixed(2)}</div>
        <input type="number" value="${item.quantity}" class="cart__quantity">
      </div>
      <i class="fa-solid fa-trash cart__remove"></i>
    `;

    cartShopBox.innerHTML = cartBoxContent;
    cartItemsContainer.append(cartShopBox);

    // Reattach event listeners
    cartShopBox
      .getElementsByClassName("cart__remove")[0]
      .addEventListener("click", removeCartItem);
    cartShopBox
      .getElementsByClassName("cart__quantity")[0]
      .addEventListener("change", quantityChange);
  });

  updateTotal();
}

// Function Update Storage

function updateLocalStorage() {
  const cartItemsContainer =
    document.getElementsByClassName("cart__content")[0];
  const cartBoxes = cartItemsContainer.getElementsByClassName("cart__box");

  const cartItems = [];
  for (let i = 0; i < cartBoxes.length; i++) {
    const cartBox = cartBoxes[i];
    const title = cartBox.getElementsByClassName("cart__product-title")[0]
      .innerText;
    const price = parseFloat(
      cartBox
        .getElementsByClassName("cart__price")[0]
        .innerText.replace("$", "")
    );
    const quantity = parseInt(
      cartBox.getElementsByClassName("cart__quantity")[0].value
    );
    const imgSrc = cartBox.getElementsByClassName("cart__img")[0].src;

    cartItems.push({ title, price, quantity, imgSrc });
  }

  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

// Function Cart Badge

// Function to update the cart badge
function updateCartBadge() {
  // Get cart items from localStorage
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

  // Calculate the total quantity of items in the cart
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Update the cart badge
  const cartBadge = document.querySelector(".cart__badge");
  if (cartBadge) {
    cartBadge.textContent = totalQuantity;
  }
}

// Product Tabs

const tabs = document.querySelectorAll(".btn__tab");
const allContent = document.querySelectorAll("#product__tab");

// Set default state to display all products
allContent.forEach((content) => {
  content.classList.add("active");
});

// Add click event listeners to tabs
tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    // Remove active class from all tabs
    tabs.forEach((tab) => {
      tab.classList.remove("active");
    });
    // Add active class to the clicked tab
    tab.classList.add("active");

    // Remove active class from all content
    allContent.forEach((content) => {
      content.classList.remove("active");
    });

    // Add active class to all content if "All" tab is clicked
    if (index === 0) {
      // Assuming the first tab is "All"
      allContent.forEach((content) => {
        content.classList.add("active");
      });
    } else {
      // Show only the content for the clicked tab
      allContent.forEach((content) => {
        const productType = content.querySelector(
          ".product__text-title"
        ).textContent;
        if (productType === tabs[index].textContent) {
          content.classList.add("active");
        }
      });
    }
  });
});

document.getElementById("checkoutButton").addEventListener("click", () => {
  // Store the cart data and total in localStorage
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  localStorage.setItem("cartTotal", total.toFixed(2));
  localStorage.setItem("cartItems", JSON.stringify(cartItems));

  // Redirect to checkout.html
  window.location.href = "checkout.html";
});

document.addEventListener("DOMContentLoaded", () => {
  // Load cart items from localStorage
  loadCartItems();
});

// init products for accessories page

const products = [
  {
    name: "VIVE Full Face Tracker",
    url: "images/addon1.jpg",
    category: "trackers",
    price: 49.99,
  },
  {
    name: "VIVE USB-C Dock (5 Ports)",
    url: "images/addon2.jpg",
    category: "docks",
    price: 29.99,
  },
  {
    name: "VIVE Ultimate Tracker 3+1 Kit",
    url: "images/addon3.jpg",
    category: "trackers",
    price: 69.99,
  },
  {
    name: "VIVE Ultimate Tracker",
    url: "images/addon4.jpg",
    category: "trackers",
    price: 49.99,
  },
  {
    name: "VIVE Wireless Dongle",
    url: "images/addon5.jpg",
    category: "dongle",
    price: 19.99,
  },
  {
    name: "TrackStraps for VIVE Ultimate Tracker + Dance Dash Game Key",
    url: "images/addon6.jpg",
    category: "trackers",
    price: 65.99,
  },
  {
    name: "VIVE Wrist Tracker",
    url: "images/addon7.jpg",
    category: "trackers",
    price: 99.99,
  },
  {
    name: " VIVE Tracker",
    url: "images/addon8.jpg",
    category: "trackers",
    price: 119.99,
  },
];

const productsWrapper = document.querySelector(".accessories__container-page");
const checkBoxes = document.querySelectorAll(".check");
const filtersContainer = document.querySelector(".filters__container");

// Init product element array
const productsElements = [];

// Event list for filtering
filtersContainer.addEventListener("change", filterProducts);

// Loop over products
products.forEach((product) => {
  const productElement = document.createElement("div");
  productElement.className = "accessories__box";
  productElement.innerHTML = `
            <span class="accessories__head" >New</span>
            <img class="product__img" src="${product.url}" alt="" />
            <h3 class="product__text-title">${product.name}</h3>
            <p class="price" >${product.price}</p>
           <button class="btn cart__icon"><p class="button-text">Buy</p> </button>
  `;
  productsElements.push(productElement);
  productsWrapper.appendChild(productElement);

  const addToCartButton = productElement.querySelector(".cart__icon");
  console.log("Button found:", addToCartButton);
  addToCartButton.addEventListener("click", (event) => {
    console.log("Button clicked");
    addCartClicked(event);
  });
});

// Filter products checkboxes
function filterProducts() {
  const checkedCategories = Array.from(checkBoxes)
    .filter((check) => check.checked)
    .map((check) => check.id);

  // Loop over products
  productsElements.forEach((productElement, index) => {
    const product = products[index];

    // Check if product's category matches the selected checkboxes
    const isInCheckedCategory =
      checkedCategories.length === 0 || // If no checkboxes are checked, show all products
      checkedCategories.includes(product.category);

    // Show or hide product based on filter
    productElement.style.display = isInCheckedCategory ? "grid" : "none";
  });
}


