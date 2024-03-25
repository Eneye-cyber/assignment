document.addEventListener('DOMContentLoaded', loadCart);

function loadCart () {
  const cartItems = getCartItems() ?? {}
  if(!cartItems || !Object.keys(cartItems).length) return
  const span = document.getElementById('total')
  span.innerHTML = "--"
  let subTotal = 0
  for (const item of Object.values(cartItems)) {
    subTotal += Number(item.total)
  }

  span.innerHTML = `£${subTotal}`
}

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