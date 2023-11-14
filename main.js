const productContainer = document.getElementById("productContainer")
const categoriesFilter = document.getElementById("categoriesFilter")
const sortSelect = document.getElementById("sort")
const cartsWrapper = document.getElementById("cartsWrapper")
const cartContent = document.getElementById("cart")
const closeCartsBtn = document.getElementById("closeCarts")
const productsCount = document.getElementById("productsCount")
const quantity = document.getElementById("quantity")

let products = {}
let carts = {}
const categories = new Set()
const selectedProduct = ""

async function getProducts() {
    const response = await fetch("https://fakestoreapi.com/products");
    products = await response.json();

    renderProducts()
    renderFilters()
}

function renderProducts() {
    productContainer.innerHTML = ""
    for (el in products) {
        // console.log(products[el])
        const productsHTML = `<div class="product-card" id="product-${products[el].id}" aria-category="${products[el].category}">
        <div class="product-img-container"><img class="product-img" src="${products[el].image}" alt="Product 1" /></div>
        <h2 class="product-title">${products[el].title}</h2>
        <!-- <p class="product-description">${products[el].description}</p> -->
        <div class="product-add-to-cart-container">
            $${products[el].price}
            <button class="add-to-cart-btn" onclick="addToCart(${products[el].id})"><i class="fa-solid fa-cart-plus"></i></button>
        </div>
        <div class="favourite"><i class="fa-regular fa-heart"></i></div>
    </div>`
        productContainer.innerHTML += productsHTML
        productsCount.innerHTML = `${products.length} results`
    }
}

function renderFilters() {
    categoriesFilter.innerHTML = ""

    for (el in products) {
        categories.add(products[el].category)
    }

    for (cate of categories) {
        const category = `<div class="single-category" onclick="filterByCategory(this)" aria-value="${cate}">${cate}</div>`
        categoriesFilter.innerHTML += category
    }

}

async function sortProducts() {
    const val = sortSelect.value
    const response = await fetch(`https://fakestoreapi.com/products?sort=${val}`);
    products = await response.json();

    renderProducts()
}

async function filterByCategory(category) {
    const val = category.getAttribute('aria-value')
    const response = await fetch(`https://fakestoreapi.com/products/category/${val}`);
    products = await response.json();

    renderProducts()
}

async function addToCart(id) {
    if (!carts.hasOwnProperty(id)) {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`)
        const product = await response.json();
        carts[id] = {
            id,
            quantity: 1,
            image: product.image,
            title: product.title,
            price: product.price
        }
        const cartItem = `<div class="cart-item">
            <img class="image-container" src="${product.image}" alt="">
            <div class="cart-item-info-container">
            <span>${product.title}</span>
            <span onclick="removeItemFromCart(${id})" class="remove-item">Remove</span>
            </div>
            <button onclick="decreaseQuantity(${id})">-</button>
            <span id="quantity">${carts[id].quantity}</span>
            <button onclick="increaceQuantity(${id})">+</button>
            <span>${product.price}$</span>   
            </div>`
        cartContent.innerHTML += cartItem
    } else {
        carts[id].quantity += 1
        renderCart()
    }
}

function closeCarts() {
    cartsWrapper.style.visibility = "hidden"
}

function openCarts() {
    cartsWrapper.style.visibility = "visible"
}

function removeItemFromCart(id){
    delete carts[id]
    renderCart()
}

function decreaseQuantity(id) {
    if (carts[id].quantity > 0) {
        carts[id].quantity -= 1
    }

    if(carts[id].quantity === 0){
        removeItemFromCart(id)
    }

    renderCart()
}

function increaceQuantity(id) {
    carts[id].quantity += 1
    renderCart()
}

async function renderCart() {
    cartContent.innerHTML = ""
    for (item in carts) {
        const cartItem = `<div class="cart-item">
            <img class="image-container" src="${carts[item].image}" alt="">
            <div class="cart-item-info-container">
            <span>${carts[item].title}</span>
            <span onclick="removeItemFromCart(${carts[item].id})" class="remove-item">Remove</span>
            </div>
            <button onclick="decreaseQuantity(${carts[item].id})">-</button>
            <span id="quantity">${carts[item].quantity}</span>
            <button onclick="increaceQuantity(${carts[item].id})">+</button>
            <span>${carts[item].price}$</span>   
            </div>`
        cartContent.innerHTML += cartItem
    }
}

getProducts()
renderCart()

sortSelect.addEventListener("change", sortProducts)