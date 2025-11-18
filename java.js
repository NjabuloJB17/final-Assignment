 
// Accordion Feature

const accordions = document.querySelectorAll('.accordion-header');
accordions.forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    const content = btn.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
      content.style.padding = "0 15px";
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
      content.style.padding = "15px";
    }
  });
});


//  Modal Feature

const modal = document.getElementById("newsletterModal");
const btn = document.getElementById("openModalBtn");
const close = document.querySelector(".close");

if (btn && modal && close) {
  btn.onclick = () => (modal.style.display = "block");
  close.onclick = () => (modal.style.display = "none");
  window.onclick = (event) => {
    if (event.target == modal) modal.style.display = "none";
  };
}


//  Gallery Lightbox

const galleryImgs = document.querySelectorAll('.gallery img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeLightbox = document.querySelector('.close-lightbox');

if (lightbox && lightboxImg && closeLightbox) {
  galleryImgs.forEach(img => {
    img.addEventListener('click', () => {
      lightbox.style.display = 'block';
      lightboxImg.src = img.src;
    });
  });

  closeLightbox.onclick = () => (lightbox.style.display = 'none');
  lightbox.onclick = (e) => {
    if (e.target === lightbox) lightbox.style.display = 'none';
  };
}




// Product Page

const products = [
  { id: 1, name: "Mountain Bike", price: 8500, category: "Off-Road", image: "images/MountainBike.jpg" },
  { id: 2, name: "BMX Bike", price: 12000, category: "Stunt", image: "images/bmx.jpg" },
  { id: 3, name: "Kids Bike", price: 3500, category: "Children", image: "images/images4.jpg" },
  { id: 4, name: "BigTire Bike", price: 9500, category: "Off-Road", image: "images/BigTire.jpg" },
  { id: 5, name: "Kids Bike", price: 1500, category: "Children", image: "images/adult.jpeg" },
  { id: 6, name: "Mountain Bike", price: 10000, category: "Off-Road", image: "images/adult2.jpeg" },
  { id: 7, name: "Family Bike", price: 8000, category: "Family", image: "images/fam.jpeg" },
  { id: 8, name: "Leisure Bike", price: 4500, category: "Electric", image: "images/fam2.jpeg" },
  { id: 9, name: "Adult Helmet", price: 1200, category: "Helmet", image: "images/helmet.jpeg" },
  { id: 10, name: "Kid Helmet", price: 300, category: "Helmet", image: "images/kids-helmet.jpeg" },
  { id: 11, name: "Adult Jacket", price: 800, category: "Clothing", image: "images/jacket.jpeg" },
  { id: 12, name: "Kid Jacket", price: 400, category: "Clothing", image: "images/kids-jacket.jpeg" },
  { id: 13, name: "Gears Set", price: 900, category: "Gear", image: "images/gears.jpeg" }
];

const productContainer = document.getElementById("productContainer");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

function displayProducts(items) {
  if (!productContainer) return;
  productContainer.innerHTML = "";
  items.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.category}</p>
      <p><strong>R${product.price.toLocaleString()}</strong></p>
      <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
    `;
    productContainer.appendChild(card);
  });
}

function updateDisplay() {
  if (!searchInput || !sortSelect) return;
  let filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchInput.value.toLowerCase()) ||
    p.category.toLowerCase().includes(searchInput.value.toLowerCase())
  );

  if (sortSelect.value === "priceLowHigh") filtered.sort((a, b) => a.price - b.price);
  if (sortSelect.value === "priceHighLow") filtered.sort((a, b) => b.price - a.price);

  displayProducts(filtered);
}

if (productContainer) {
  displayProducts(products);
  searchInput?.addEventListener("input", updateDisplay);
  sortSelect?.addEventListener("change", updateDisplay);
}


  // Cart functionality
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  productContainer.addEventListener("click", e => {
    if (e.target.classList.contains("add-to-cart")) {
      const id = parseInt(e.target.dataset.id);
      const item = products.find(p => p.id === id);
      const existingItem = cart.find(p => p.id === id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ ...item, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`${item.name} added to cart!`);
    }
  });



// Sign-Up Form Validation &AJAX

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  if (!form) return;

  const errorMessage = document.getElementById("errorMessage");
  const successMessage = document.getElementById("successMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    errorMessage.textContent = "";
    successMessage.textContent = "";

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value.trim();

    if (name.length < 3) {
      errorMessage.textContent = "Full name must be at least 3 characters.";
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errorMessage.textContent = "Please enter a valid email address.";
      return;
    }

    if (!/^0\d{9}$/.test(phone)) {
      errorMessage.textContent = "Please enter a valid 10-digit SA phone number.";
      return;
    }

    if (password.length < 8) {
      errorMessage.textContent = "Password must be at least 8 characters long.";
      return;
    }

    try {
      const response = await fetch("https://httpbin.org/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password })
      });

      if (response.ok) {
        successMessage.textContent = "Registration successful! Redirecting...";
        form.reset();
        setTimeout(() => window.location.href = "index.html", 2000);
      } else {
        errorMessage.textContent = "Server error. Please try again.";
      }
    } catch {
      errorMessage.textContent = "Network error. Please try again later.";
    }
  });
});

