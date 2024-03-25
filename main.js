document.addEventListener('DOMContentLoaded', fetchData);

async function fetchData () {
  const data = localStorage.getItem('mockDB')
  const page = window.location.pathname

  // if(!data) {
    try {
      var res = await fetch('./data.json')
      res = await res.json()
      localStorage.setItem('mockDB', JSON.stringify(res))
    } catch (error) {
      console.log(error)
    }
  // }
  if( page === '/products.html') return loadProductData()
  loadTotalItems()
  loadTotalItems('wishlistBadge', 'wishlist')
  loadPopularProduct()
}

function getUrlQueryParams() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const params = {};
  for (const [key, value] of urlParams.entries()) {
      params[key] = value;
  }
  return params['category'];
}

function loadProductData () {
  const params = getUrlQueryParams()
  let data = localStorage.getItem('mockDB')
  if(!data) return
  data = JSON.parse(data)
  const filterData = params ? data.filter((val) => val.category === params) : null

  const res = filterData ?? data
  renderFilter(data, params)
  renderProducts(res, 'productContainer')
}

function loadPopularProduct () {
  const data = localStorage.getItem('mockDB')
  if(!data) return
  const filterData = JSON.parse(data).sort((a, b) => b['no_of_views'] - a['no_of_views'])
  const res = filterData.slice(0,3)
  renderProducts(res, 'productContainer')
}

function renderProducts (arr, container) {
  const productContainer = document.getElementById(container)
  productContainer.innerHTML = ""
  const wishlist = getWishlist()
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    const container = document.createElement('div')
    container.classList = "popular__section-card flex-col-3 flex-column"
    const template = `
          <figure >
            <div class="product__section-image" role="image">
              <img loading="lazy" src="${item.image}" alt="${item.Product_Name}">
            </div>
            <figcaption>
              <p>${item.Product_Name}</p>

              <span class="fa fa-star checked"></span>
              <span class="fa fa-star checked"></span>
              <span class="fa fa-star checked"></span>
              <span class="fa fa-star checked"></span>
              <span class="fa fa-star"></span>

              <p class="price">£${item.Price}</p>
            </figcaption>
          </figure>

          <div class="btn-group flex ">
            <button onclick="addToCart(${item.index})" class="cart__btn flex-center">
              <img loading="lazy" src="./cart-white.svg" alt="add to cart">
              <p>Add to trolley</p>
            </button>

            <button onclick="toggleWishlist(${item.index})" class="icon__btn flex-center">
              <img id="wishlist_${item.index}" height="19px" loading="lazy" src="${wishlist.includes(item.index) ? './heart-fill.svg' : './heart-red.svg'}" alt="add to wishlist">
            </button>
          </div>
    `
    console.log()
    container.innerHTML = template.trim()
    productContainer.appendChild(container)
  }
}

function renderFilter(arr, str) {
  if(!Array.isArray(arr)) return

  const container = document.getElementById('filter')
  const filter = arr.reduce((prev, curr) => {
    prev[curr.category] = !prev[curr.category] ? 1 : prev[curr.category] + 1
    return prev
  }, {})
  for (const [key, value] of Object.entries(filter)) {
    const tempElement = document.createElement('div')
    tempElement.classList = 'flex justify-between item-center'

    const template = `
      <div class="flex item-center">
        <input type="radio" name="filterS" onclick="filterProducts('${key}')" id="${key}">
        <label for="food">${key}</label>
      </div>

      <div>(${value})</div>
    `
    tempElement.innerHTML = template.trim()
    container.appendChild(tempElement)
  }

  const checkbox = document.getElementById(str)
  if (!checkbox) return
  checkbox.checked = true
}

function filterProducts(str) {
  const urlParams = new URLSearchParams(window.location.search);
  window.location.search = `category=${str}`
}

function addToCart (id, amt = 1) {
  let cart = localStorage.getItem('cart')
  if(!cart) {
    const obj = {}
    obj[id] = amt
    localStorage.setItem('cart', JSON.stringify(obj))
    return openDialog(id)
  }
  cart = JSON.parse(cart)
  cart[id] = !cart[id] ? amt : cart[id] + amt
  localStorage.setItem('cart', JSON.stringify(cart))
  openDialog(id)
  loadTotalItems()
}

function toggleWishlist (id) {
  let wishlist = getWishlist()
  const img = document.getElementById(`wishlist_${id}`)

  const position = wishlist.findIndex((val) => Number(val) === Number(id))
  if(position !== -1) {
    wishlist.splice(position, 1)
    img.src = './heart-red.svg'
  } else {
    wishlist.push(id)
    img.src = './heart-fill.svg'
  } 
  localStorage.setItem('wishlist', JSON.stringify(wishlist))
  loadTotalItems('wishlistBadge', 'wishlist')
}

function getWishlist () {
  let wishlist = localStorage.getItem('wishlist')
  if(!wishlist)
    return []

  wishlist = JSON.parse(wishlist)
  return wishlist

}

function closeDialog () {
  const dialog = document.getElementById('cartDialog')
  console.log(dialog.style.display)
  dialog.style.display = 'none'
}

function openDialog (id) {
  const dialog = document.getElementById('cartDialog')
  const {Product_Name, image } = getProductDetail(id)
  dialog.style.display = 'block'
  const img = document.getElementById('cartImage')
  const link = document.getElementById('cartItem')
  img.src = image
  link.innerHTML = Product_Name
}

function getProductDetail (id) {
  let data = localStorage.getItem('mockDB')
  if(!data) return
  data = JSON.parse(data)
  const search = data.filter((val) => val.index === id)[0]
  return search
}

function loadTotalItems(selector = 'basketBadge', item = 'cart') {
  let cart = localStorage.getItem(item)
  if(!cart || !Object.values(cart).length) return
  const badge = document.getElementById(selector)
  cart = JSON.parse(cart)
  const total = item === 'cart' ?
   Object.values(cart)?.reduce((prev, a) => prev + a, 0) : cart.length
  badge.innerHTML = total
  badge.style.display = 'block'
}