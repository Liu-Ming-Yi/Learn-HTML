const menuData = [
    { id: '1', category: '單點/粥品', name: '招牌美味粥', price: 25, recommended: true },
    { id: '2', category: '單點/粥品', name: '加荷包蛋', price: 35, recommended: false },
    { id: '3', category: '單點/粥品', name: '加菜脯蛋', price: 40, recommended: false },
    { id: '4', category: '單點/粥品', name: '手工蘿蔔糕', price: 25, recommended: true },
    { id: '5', category: '單點/粥品', name: '蔥抓餅', price: 20, recommended: false },
    { id: '6', category: '單點/粥品', name: '蔥抓餅加蛋', price: 30, recommended: true },
    { id: '7', category: '單點/粥品', name: '小熱狗(6條)', price: 30, recommended: false },

    { id: '11', category: '蛋餅系列', name: '原味蛋餅', price: 18, recommended: false },
    { id: '12', category: '蛋餅系列', name: '玉米蛋餅', price: 25, recommended: false },
    { id: '13', category: '蛋餅系列', name: '起士蛋餅', price: 25, recommended: false },
    { id: '14', category: '蛋餅系列', name: '肉鬆蛋餅', price: 25, recommended: false },
    { id: '15', category: '蛋餅系列', name: '火腿蛋餅', price: 30, recommended: false },
    { id: '16', category: '蛋餅系列', name: '培根蛋餅', price: 30, recommended: false },
    { id: '17', category: '蛋餅系列', name: '特製豬排蛋餅', price: 30, recommended: true },

    { id: '21', category: '漢堡系列', name: '起士蛋堡', price: 35, recommended: false },
    { id: '22', category: '漢堡系列', name: '香雞蛋堡', price: 35, recommended: false },
    { id: '23', category: '漢堡系列', name: '培根蛋堡', price: 35, recommended: false },
    { id: '24', category: '漢堡系列', name: '火腿蛋堡', price: 35, recommended: false },
    { id: '25', category: '漢堡系列', name: '特製豬排蛋堡', price: 35, recommended: true },

    { id: '31', category: '吐司系列', name: '起士蛋吐司', price: 30, recommended: false },
    { id: '32', category: '吐司系列', name: '肉鬆蛋吐司', price: 30, recommended: false },
    { id: '33', category: '吐司系列', name: '香雞蛋吐司', price: 30, recommended: false },
    { id: '34', category: '吐司系列', name: '培根蛋吐司', price: 30, recommended: false },
    { id: '35', category: '吐司系列', name: '火腿蛋吐司', price: 30, recommended: false },
    { id: '36', category: '吐司系列', name: '特製豬排蛋吐司', price: 30, recommended: true },
    { id: '37', category: '吐司系列', name: '果醬吐司(單口味)', price: 15, recommended: false },
    { id: '38', category: '吐司系列', name: '果醬吐司(雙口味)', price: 20, recommended: false },

    { id: '41', category: '各式飲品', name: '豆漿', price: 10, recommended: false },
    { id: '42', category: '各式飲品', name: '紅茶', price: 15, recommended: false },
    { id: '43', category: '各式飲品', name: '奶茶', price: 15, recommended: false },
    { id: '44', category: '各式飲品', name: '薏仁漿', price: 20, recommended: true },
    { id: '45', category: '各式飲品', name: '杏仁漿', price: 20, recommended: true },
];

let cart = [];
let currentCategory = '全部';

const categories = ['全部', ...new Set(menuData.map(item => item.category))];

const categoryContainer = document.getElementById('category-container');
const menuGrid = document.getElementById('menu-grid');
const cartItemsContainer = document.getElementById('cart-items');
const totalPriceEl = document.getElementById('total-price');
const checkoutBtn = document.getElementById('checkout-btn');

function init() {
    renderCategories();
    renderMenu();
    setupCheckout();
}

function renderCategories() {
    categoryContainer.innerHTML = '';
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = `category-btn ${cat === currentCategory ? 'active' : ''}`;
        btn.textContent = cat;
        btn.onclick = () => {
            currentCategory = cat;
            renderCategories();
            renderMenu();
        };
        categoryContainer.appendChild(btn);
    });
}

function renderMenu() {
    menuGrid.innerHTML = '';
    const filteredMenu = currentCategory === '全部' 
        ? menuData 
        : menuData.filter(item => item.category === currentCategory);

    filteredMenu.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-card';
        card.onclick = () => addToCart(item);

        let recommendHtml = item.recommended ? `<span class="badge-recommend">推薦!</span>` : '';

        card.innerHTML = `
            ${recommendHtml}
            <div class="name">${item.name}</div>
            <div class="price">NT$ ${item.price}</div>
        `;
        menuGrid.appendChild(card);
    });
}

function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    updateCart();
}

// 由於 onclick 在 HTML 中是全域呼叫，需要將 updateQty 放到全域
window.updateQty = function(id, delta) {
    const item = cart.find(cartItem => cartItem.id === id);
    if (item) {
        item.qty += delta;
        if (item.qty <= 0) {
            cart = cart.filter(cartItem => cartItem.id !== id);
        }
    }
    updateCart();
};

function updateCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">尚未點餐</div>';
        checkoutBtn.disabled = true;
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.qty;
            total += itemTotal;

            const cartItemEl = document.createElement('div');
            cartItemEl.className = 'cart-item';
            cartItemEl.innerHTML = `
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-price">NT$ ${item.price} / 份</div>
                </div>
                <div class="item-actions">
                    <button class="qty-btn" onclick="updateQty('${item.id}', -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="updateQty('${item.id}', 1)">+</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItemEl);
        });
        checkoutBtn.disabled = false;
    }

    totalPriceEl.textContent = `NT$ ${total}`;
}

function setupCheckout() {
    checkoutBtn.onclick = () => {
        if (cart.length > 0) {
            alert('結帳成功！總金額為 ' + totalPriceEl.textContent + '。\n感謝您的訂購！');
            cart = [];
            updateCart();
        }
    };
}

init();
