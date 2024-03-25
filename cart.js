
const getCartItems = () => {
  let cart = localStorage.getItem('cart')
  let data = localStorage.getItem('mockDB')
  data = JSON.parse(data)
  cart = JSON.parse(cart)
  const id = Object.keys(cart)
  const reduceData = data.reduce((prev, curr) => {
  const product = id.includes(`${curr.index}`) ? curr : null
    if(product) {
      let qty = cart[`${product.index}`]
      let total = (Number(qty) * Number(product.Price)).toFixed(2)

      prev[product.index] = { qty, total, ...product }
    }
    return prev
  }, {})
  return reduceData
}

document.addEventListener('DOMContentLoaded', loadCart);

function loadCart () {
  const cartItems = getCartItems() ?? {}
  renderCart(cartItems)
}

function renderCart(obj) {
  const ul = document.getElementById('basketMain')
  const span = document.getElementById('total')
  ul.innerHTML = ""
  span.innerHTML = "--"
  let subTotal = 0
  for (const item of Object.values(obj)) {
    const container = document.createElement('li')
    subTotal += Number(item.total)
    const template = `
      <section class="basket__card flex w-full" id="basketItem_${item.index}">
        <div class="basket__card-img">
          <img loading="lazy" src="${item.image}" alt="${item.Product_Name}">
        </div>
        <div class="basket__card-details w-full justify-between flex">
          <div class="w-60">
            <p>
              <a href="" class="basket__card-link">${item.Product_Name}</a>
              <br>
              <span class="text-sm">Product Id: ${item.index}</span>
            </p>

            <button class="wishlist">Add to wishlist</button>
          </div>

          <div class="basket__qty">
            <select onchange="addToCart(this.value, ${item.index})" id="${item.index}">
              <option value="1" ${item.qty == 1 ? 'selected disabled' : ''}>1</option>
              <option value="2" ${item.qty == 2 ? 'selected disabled' : ''}>2</option>
              <option value="3" ${item.qty == 3 ? 'selected disabled' : ''}>3</option>
              <option value="4" ${item.qty == 4 ? 'selected disabled' : ''}>4</option>
              <option value="5" ${item.qty == 5 ? 'selected disabled' : ''}>5</option>
            </select> 
            
            <button onclick="removeCartItem(${item.index})">Remove</button>
          </div>

          <div class="text-right">
            <p class="price-total">
              £${item.total}
            </p>
            <span class="price-unit text-sm">unit price £${item.Price}</span>
          </div>
        </div>
      </section>
    `
    container.innerHTML = template.trim()
    ul.appendChild(container)
  }

  span.innerHTML = `£${subTotal}`
}

function removeCartItem (id) {
  let cart = localStorage.getItem('cart')
  cart = JSON.parse(cart)
  if (!cart[id]) return
  
  delete cart[id]
  localStorage.setItem('cart', JSON.stringify(cart))
  loadCart()
}

function addToCart (amt, id) {
  let cart = localStorage.getItem('cart')
  if(!cart) return

  cart = JSON.parse(cart)
  cart[id] = Number(amt) 
  localStorage.setItem('cart', JSON.stringify(cart))
  loadCart()
}