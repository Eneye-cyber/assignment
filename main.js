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
  const data = localStorage.getItem('mockDB')
  if(!data) return
  const filterData = params ? JSON.parse(data).filter((val) => val.category === params) : null

  const res = filterData ?? JSON.parse(data)
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
            <button class="cart__btn flex-center">
              <img loading="lazy" src="./cart-white.svg" alt="add to cart">
              <p>Add to trolley</p>
            </button>

            <button class="icon__btn flex-center">
              <img loading="lazy" src="./heart-red.svg" alt="add to cart">
            </button>
          </div>
    `
    container.innerHTML = template
    productContainer.appendChild(container)
  }
}
