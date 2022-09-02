////////////////////////////////////
///////////   STATE   //////////////
let id = 0;
const idProvider = () => ++id;
const initialState = { by: '', sort: '', value: '', sortBy: '' };
let localState = {};
const setState = (newState) => localState = newState;
const API_URL = 'https://bsale-technical-challenge-api.herokuapp.com';

////////////////////////////////////
/////////   CONTAINERS   ///////////

const cardContainer = document.getElementById('bsale-itemContainer');
const categoryMenu = document.getElementById('bsale-categoryDropdown');
const searchBar = document.getElementById('bsale-searchBar');
const resetButton = document.getElementById('bsale-resetBtn');

////////////////////////////////////
/////////   LISTENERS   ////////////

window.onload = async () => {
  const items = await getProducts();
  await loadItems(items);

  const categories = await getCategories();
  await loadCategories(categories);
};

resetButton.onclick = async (e) => {
  const items = await getProducts();
  await loadItems(items);

  const categories = await getCategories();
  await loadCategories(categories);
};

searchBar.onkeydown = (e) => {
  if (e.key === 'Enter') {
    submitSearch();
  }
};

categoryMenu.onchange = async (e) => {
  const { value } = e.target;

  if (value === 'todas') {
    setState({ ...localState, by: '', value: '' });
  } else {
    setState({ ...localState, by: 'category', value });
  }

  const params = getQueryParams(localState);
  const items = await searchProducts(params);

  await loadItems(items);
};

////////////////////////////////////
//////////   LOADERS   /////////////

async function loadCategories(categories) {
  removeNodes(categoryMenu);

  for (const category of categories) {
    const node = mapToMenuEntry(category);
    categoryMenu.appendChild(node);
  }
}

async function loadItems(items) {
  removeNodes(cardContainer);

  for (const item of items) {
    const node = mapToCard(item);
    const id = idProvider();

    node.id = `itemcard-${id}`;

    cardContainer.appendChild(node);
  }
}

////////////////////////////////////
////////   CONTROLLERS   ///////////

async function submitSearch() {
  let { value } = searchBar;

  if (!value) {
    setState({ ...localState, by: '', value: '' });
  } else {
    setState({ ...localState, by: 'name', value });
  }

  const query = getQueryParams(localState);
  let items;

  if (query) {
    items = await searchProducts(query);
  } else {
    items = await getProducts();
  }

  await loadItems(items);
}

function mapToCard(item) {
  const card = document.createElement('div');
  card.className = 'item-card';

  const cardInfo = document.createElement('div');
  cardInfo.className = 'item-info';

  const title = document.createElement('h1');
  title.className = 'item-title';

  const thumbnail = document.createElement('img');
  thumbnail.className = 'item-thumbnail';

  const saleData = document.createElement('div');
  saleData.className = 'item-sale-data';

  const priceContainer = document.createElement('div');
  priceContainer.className = 'item-price_container';

  const price = document.createElement('p');
  price.className = 'item-price';

  let discountPrice = document.createElement('p');
  discountPrice.className = 'item-discount_price';

  let tag = document.createElement('span');
  tag.className = 'item-discount_tag';

  if (item.discount) {
    tag.textContent = `-${item.discount}%`;
    discountPrice.textContent = '$' + (item.price - item.price * (item.discount / 100));
  } else {
    tag = '';
    price.className = 'item-discount_price';
  }

  const addToCardBtn = document.createElement('button');
  addToCardBtn.className = 'hoverButton';

  addToCardBtn.addEventListener('click', (e) => {
    console.log(e.parentNode);
  });

  addToCardBtn.textContent = 'Agregar';

  priceContainer.append(price, discountPrice);
  thumbnail.setAttribute('src', item.url_image);
  price.textContent = '$' + item.price;
  title.textContent = item.name;

  saleData.append(priceContainer, addToCardBtn);
  cardInfo.append(title, saleData);
  card.append(tag, thumbnail, cardInfo);

  return card;
}

function mapToMenuEntry(item) {
  const entry = document.createElement('option');
  entry.id = `menuEntry-${item.id}`;
  entry.textContent = item.name;

  return entry;
}

////////////////////////////////////
//////////   HELPERS   /////////////

const getQueryParams = (obj) => Object.keys(obj).map(k => obj[k] && `${k}=${obj[k]}`).filter(e => e).join('&');

function removeNodes(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

////////////////////////////////////
///////   API FUNCTIONS   //////////

async function getCategories() {
  return await fetch(`${API_URL}/categories`)
    .then(res => res.json())
    .catch(err => console.warn(err));
}

async function getProducts() {
  return await fetch(`${API_URL}/products`)
    .then(res => res.json())
    .catch(err => console.warn(err));
}

async function searchProducts(query) {
  return await fetch(`${API_URL}/products/search?${query}`)
    .then(res => res.json())
    .catch(err => console.warn(err));
}



