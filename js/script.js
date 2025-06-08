// Little Rogue Coffee Shop JavaScript

// DOM Content Loaded Event
document.addEventListener("DOMContentLoaded", function () {
    console.log("Little Rogue website loaded successfully");
  
    // Initialize cart
    initializeCart();
  
    // Set active navigation link
    setActiveNavLink();
  
    // Add smooth scrolling for anchor links
    addSmoothScrolling();
  
    // Add product card hover effects
    addProductCardEffects();
  
    // Add logo animation on hover
    addLogoAnimation();
  
  });
  
  // Cart functionality
  let cart = {
    items: [],
    total: 0,
  };
  
  function initializeCart() {
    // Load cart from localStorage if available
    const savedCart = localStorage.getItem("littleRogueCart");
    if (savedCart) {
      cart = JSON.parse(savedCart);
    }
    updateCartDisplay();
  }
  
  function toggleCart() {
    // Check if we're on the cart page
    if (window.location.pathname.includes("cart.html")) {
      // If on cart page, just refresh the display
      displayCartPage();
      return;
  }
  
    // Navigate to cart page
    window.location.href = "cart.html";
  }
  
  function createCartModal() {
    const cartHTML = `
          <div id="cartModal" class="cart-modal" style="display: none;">
              <div class="cart-modal-content">
                  <div class="cart-header">
                      <h2>Shopping Cart</h2>
                      <button class="cart-close" onclick="hideCart()">&times;</button>
                  </div>
                  <div class="cart-body">
                      <div id="cartItems"></div>
                      <div class="cart-total">
                          <strong>Total: $<span id="cartTotal">0.00</span></strong>
                      </div>
                  </div>
                  <div class="cart-footer">
                      <button class="btn-primary" onclick="checkout()">Checkout</button>
                      <button class="btn-secondary" onclick="clearCart()">Clear Cart</button>
                  </div>
              </div>
          </div>
      `;
  
    document.body.insertAdjacentHTML("beforeend", cartHTML);
  
    // Add cart modal styles
    const cartStyles = `
          <style>
          .cart-modal {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.5);
              z-index: 1000;
              display: flex;
              align-items: center;
              justify-content: center;
          }
  
          .cart-modal-content {
              background: white;
              border-radius: 8px;
              padding: 2rem;
              max-width: 500px;
              width: 90%;
              max-height: 80vh;
              overflow-y: auto;
          }
  
          .cart-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 1rem;
              border-bottom: 1px solid #eee;
              padding-bottom: 1rem;
          }
  
          .cart-close {
              background: none;
              border: none;
              font-size: 2rem;
              cursor: pointer;
              color: #666;
          }
  
          .cart-body {
              margin-bottom: 2rem;
          }
  
          .cart-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 1rem 0;
              border-bottom: 1px solid #eee;
          }
  
          .cart-total {
              text-align: right;
              font-size: 1.25rem;
              margin-top: 1rem;
          }
  
          .cart-footer {
              display: flex;
              gap: 1rem;
              justify-content: flex-end;
          }
  
          .btn-primary, .btn-secondary {
              padding: 0.75rem 1.5rem;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-family: 'Open Sans', sans-serif;
              font-weight: 600;
              transition: background-color 0.3s ease;
          }
  
          .btn-primary {
              background-color: #333;
              color: white;
          }
  
          .btn-primary:hover {
              background-color: #555;
          }
  
          .btn-secondary {
              background-color: #f5f5f5;
              color: #333;
          }
  
          .btn-secondary:hover {
              background-color: #e5e5e5;
          }
          </style>
      `;
  
    document.head.insertAdjacentHTML("beforeend", cartStyles);
  }
  
  function showCart() {
    const cartModal = document.getElementById("cartModal");
    cartModal.style.display = "flex";
    updateCartDisplay();
  
    // Add click outside to close
    cartModal.addEventListener("click", function (e) {
      if (e.target === cartModal) {
        hideCart();
      }
    });
  }
  
  function hideCart() {
    const cartModal = document.getElementById("cartModal");
    if (cartModal) {
      cartModal.style.display = "none";
    }
  }
  
  function updateCartDisplay() {
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
  
    if (!cartItems || !cartTotal) return;
  
    if (cart.items.length === 0) {
      cartItems.innerHTML = "<p>Your cart is empty</p>";
      cartTotal.textContent = "0.00";
      return;
    }
  
    cartItems.innerHTML = "";
    let total = 0;
  
    cart.items.forEach((item, index) => {
      const itemElement = document.createElement("div");
      itemElement.className = "cart-item";
      itemElement.innerHTML = `
              <div>
                  <strong>${item.name}</strong><br>
                  <small>$${item.price} �� ${item.quantity}</small>
              </div>
              <div>
                  <button onclick="removeFromCart(${index})" style="background: none; border: none; color: #ff6b6b; cursor: pointer;">Remove</button>
              </div>
          `;
      cartItems.appendChild(itemElement);
      total +=
        parseFloat(item.price.replace("$", "").replace(" AUD", "")) *
        item.quantity;
    });
  
    cartTotal.textContent = total.toFixed(2);
  }
  
  function addToCart(productData) {
    console.log("Adding to cart:", productData);
    const existingItem = cart.items.find(
      (item) => item.name === productData.name,
    );
  
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({
        name: productData.name,
        price: productData.price,
        quantity: 1,
      });
    }
  
    saveCart();
    updateCartDisplay();
  
    // Show success message
    showNotification(`${productData.name} added to cart!`);
  }
  
  function removeFromCart(index) {
    cart.items.splice(index, 1);
    saveCart();
    updateCartDisplay();
  }
  
  function clearCart() {
    cart.items = [];
    saveCart();
    updateCartDisplay();
    showNotification("Cart cleared!");
  }
  
  function checkout() {
    if (cart.items.length === 0) {
      showNotification("Your cart is empty!");
      return;
    }
  
    // Simulate checkout process
    showNotification("Thank you for your order! We'll be in touch soon.");
    clearCart();
    hideCart();
  }
  
  function saveCart() {
    localStorage.setItem("littleRogueCart", JSON.stringify(cart));
  }
  
  // Product functionality
  const products = [
    { id: 1, name: "Bookkisa Washed - Filter", price: "$24 AUD" },
    { id: 2, name: "Bududa - Filter", price: "$24 AUD" },
    { id: 3, name: "Kiamugumo AA - Filter", price: "$26 AUD" },
    { id: 4, name: "Rogue Blend - Espresso", price: "$18 AUD" },
    { id: 5, name: "Little Rogue Matcha Latte", price: "$21 AUD" },
    { id: 6, name: "Bakemono Hojicha Latte", price: "$25 AUD" },
  ];
  
  function viewProduct(productId) {
    const product = products.find((p) => p.id === productId);
    if (product) {
      // Show product details modal or add to cart
      if (confirm(`Add ${product.name} (${product.price}) to cart?`)) {
        addToCart(product);
      }
    }
  }
  
  // Navigate to product detail page
  function goToProduct(productUrl) {
    window.location.href = productUrl;
  }
  
  // Add to cart from product detail page
  function addToCartFromDetail() {
    const productData = {
      name: "Bookkisa Washed - Filter",
      price: "$24 AUD",
    };
  
    addToCart(productData);
  }

  
// Generic function to add any product to cart from detail pages
function addProductToCart(productName, productPrice) {
    const productData = {
      name: productName,
      price: productPrice,
    };
  
    addToCart(productData);
  }  

  
// Display cart page with current items
function displayCartPage() {
  const emptyCartState = document.getElementById("emptyCartState");
  const cartWithItems = document.getElementById("cartWithItems");

  if (!emptyCartState || !cartWithItems) {
    return; // Not on cart page
  }

  if (cart.items.length === 0) {
    emptyCartState.style.display = "flex";
    cartWithItems.style.display = "none";
  } else {
    emptyCartState.style.display = "none";
    cartWithItems.style.display = "block";
    populateCartItems();
    updateCartTotal();
  }
}

// Populate cart items in the cart page
function populateCartItems() {
  const cartItemsList = document.getElementById("cartItemsList");
  if (!cartItemsList) return;

  cartItemsList.innerHTML = "";

  cart.items.forEach((item, index) => {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";

    // Get product image based on product name
    const productImage = getProductImage(item.name);

    cartItem.innerHTML = `
            <div class="cart-item-product">
                <img src="${productImage}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                </div>
            </div>
            <div class="cart-item-price">${item.price}</div>
            <div class="cart-item-quantity">
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
            </div>
            <div class="cart-item-total">${calculateItemTotal(item)}</div>
        `;

    cartItemsList.appendChild(cartItem);
  });
}

// Get product image based on product name
function getProductImage(productName) {
  const imageMap = {
    "Bookkisa Washed - Filter":
      "../img/bookkisa.jpg",
    "Bududa - Filter":
      "../img/bududa.jpg",
    "Kiamugumo AA - Filter":
      "../img/kiamugumo.jpg",
    "Rogue Blend - Espresso":
      "../img/rogueblend.jpg",
    "Little Rogue Matcha Latte":
      "../img/matcha.jpg",
    "Bakemono Hojicha Latte":
      "../img/hojicha.jpg",
  };

  return (
    imageMap[productName] ||
    "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=120&h=160&fit=crop&crop=center"
  );
}

// Calculate total for individual item
function calculateItemTotal(item) {
  const price = parseFloat(item.price.replace(/[^0-9.]/g, ""));
  const total = price * item.quantity;
  return `$${total.toFixed(2)}`;
}

// Update quantity of cart item
function updateQuantity(index, change) {
  if (cart.items[index]) {
    cart.items[index].quantity += change;

    if (cart.items[index].quantity <= 0) {
      cart.items.splice(index, 1);
    }

    saveCart();
    displayCartPage();
  }
}

// Update cart total on cart page
function updateCartTotal() {
  const cartTotalAmount = document.getElementById("cartTotalAmount");
  if (!cartTotalAmount) return;

  let total = 0;
  cart.items.forEach((item) => {
    const price = parseFloat(item.price.replace(/[^0-9.]/g, ""));
    total += price * item.quantity;
  });

  cartTotalAmount.textContent = `$${total.toFixed(2)}`;
}

// Proceed to checkout
function proceedToCheckout() {
  if (cart.items.length === 0) {
    showNotification("Your cart is empty!");
    return;
  }

  // Navigate to checkout page
  window.location.href = "checkout.html";
}


// Display checkout page with current items
function displayCheckoutPage() {
  const checkoutItems = document.getElementById("checkoutItems");
  if (!checkoutItems) {
    return; // Not on checkout page
  }

  if (cart.items.length === 0) {
    showNotification("Your cart is empty! Redirecting to products...");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
    return;
  }

  populateCheckoutItems();
  calculateCheckoutTotals();
}

// Populate checkout items
function populateCheckoutItems() {
  const checkoutItems = document.getElementById("checkoutItems");
  if (!checkoutItems) return;

  checkoutItems.innerHTML = "";

  cart.items.forEach((item, index) => {
    const checkoutItem = document.createElement("div");
    checkoutItem.className = "checkout-item";

    // Get product image based on product name
    const productImage = getProductImage(item.name);

    checkoutItem.innerHTML = `
            <div class="quantity-indicator">${item.quantity}</div>
            <img src="${productImage}" alt="${item.name}" class="checkout-item-image">
            <div class="checkout-item-details">
                <h3 class="checkout-item-name">${item.name}</h3>
                <p class="checkout-item-price">${item.price}</p>
            </div>
        `;

    checkoutItems.appendChild(checkoutItem);
  });
}

// Calculate checkout totals
function calculateCheckoutTotals() {
  const subtotalElement = document.getElementById("checkoutSubtotal");
  const shippingElement = document.getElementById("checkoutShipping");
  const totalElement = document.getElementById("checkoutTotal");

  if (!subtotalElement || !totalElement) return;

  let subtotal = 0;
  cart.items.forEach((item) => {
    const price = parseFloat(item.price.replace(/[^0-9.]/g, ""));
    subtotal += price * item.quantity;
  });

  const shipping = 11.0; // Fixed shipping cost
  const total = subtotal + shipping;

  subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
  shippingElement.textContent = `$${shipping.toFixed(2)}`;
  totalElement.textContent = `$${total.toFixed(2)}`;
}

// Process payment
function processPayment() {
  const form = document.getElementById("checkoutForm");
  const paymentInputs = document.querySelectorAll(".payment-form input");

  // Basic form validation
  let isValid = true;
  const requiredFields = document.querySelectorAll(".form-input[required]");

  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      field.style.borderColor = "#ff6b6b";
      isValid = false;
    } else {
      field.style.borderColor = "rgba(0, 0, 0, 0.5)";
    }
  });

  if (!isValid) {
    showNotification("Please fill in all required fields.");
    return;
  }

  // Simulate payment processing
  showNotification("Processing payment...");

  // Simulate a delay for payment processing
  setTimeout(() => {
    // Clear cart and redirect after successful payment
    clearCart();
    window.location.href = "order-confirmation.html";
  }, 2000);
}
  
  // Navigation functionality
  function setActiveNavLink() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(".nav-link");
  
    navLinks.forEach((link) => {
      link.classList.remove("active");
      const href = link.getAttribute("href");
      if (href === currentPage || (currentPage === "" && href === "index.html")) {
        link.classList.add("active");
      }
    });
  }
  
  // Smooth scrolling for anchor links
  function addSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });
  }
  
  // Product card effects
  function addProductCardEffects() {
    const productCards = document.querySelectorAll(".product-card");
  
    productCards.forEach((card) => {
      // Add loading effect for images
      const img = card.querySelector(".product-image");
      if (img) {
        img.addEventListener("load", function () {
          this.style.opacity = "1";
        });
  
        // Set initial opacity to 0 for fade-in effect
        img.style.opacity = "0";
        img.style.transition = "opacity 0.3s ease";
      }
  
      // Add click feedback
      card.addEventListener("click", function () {
        this.style.transform = "scale(0.98)";
        setTimeout(() => {
          this.style.transform = "";
        }, 150);
      });
    });
  }
  
  // Logo animation
  function addLogoAnimation() {
    const logoIcons = document.querySelectorAll(".logo-icon, .footer-logo-icon");
  
    logoIcons.forEach((logo) => {
      logo.addEventListener("mouseenter", function () {
        this.style.animationDuration = "0.5s";
      });
  
      logo.addEventListener("mouseleave", function () {
        this.style.animationDuration = "3s";
      });
    });
  }
  
  // Notification system
  function showNotification(message) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll(".notification");
    existingNotifications.forEach((notification) => notification.remove());
  
    // Create notification
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;
  
    // Add notification styles
    notification.style.cssText = `
          position: fixed;
          top: 2rem;
          right: 2rem;
          background-color: #333;
          color: white;
          padding: 1rem 2rem;
          border-radius: 4px;
          font-family: 'Open Sans', sans-serif;
          font-weight: 600;
          z-index: 1001;
          transform: translateX(100%);
          transition: transform 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      `;
  
    document.body.appendChild(notification);
  
    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);
  
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }
  
  // Utility functions
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // Window resize handler with debounce
  window.addEventListener(
    "resize",
    debounce(function () {
      // Handle any resize-specific functionality here
      console.log("Window resized");
    }, 250),
  );
  
  // Error handling for images
  document.addEventListener(
    "error",
    function (e) {
      if (e.target.tagName === "IMG") {
        console.log("Image failed to load:", e.target.src);
        // You could add a placeholder image here
        e.target.style.backgroundColor = "#f5f5f5";
        e.target.style.display = "flex";
        e.target.style.alignItems = "center";
        e.target.style.justifyContent = "center";
        e.target.innerHTML =
          '<span style="color: #999;">Image not available</span>';
      }
    },
    true,
  );
  
  // Accessibility improvements
  document.addEventListener("keydown", function (e) {
    // Close cart modal with Escape key
    if (e.key === "Escape") {
      const cartModal = document.getElementById("cartModal");
      if (cartModal && cartModal.style.display === "flex") {
        hideCart();
      }
    }
  });
  
  // Performance optimization - lazy loading for images
  function addLazyLoading() {
    const images = document.querySelectorAll("img[data-src]");
  
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove("lazy");
            imageObserver.unobserve(img);
          }
        });
      });
  
      images.forEach((img) => imageObserver.observe(img));
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      images.forEach((img) => {
        img.src = img.dataset.src;
      });
    }
  }
  
  // Initialize lazy loading if any lazy images exist
  if (document.querySelectorAll("img[data-src]").length > 0) {
    addLazyLoading();
  }
  
  