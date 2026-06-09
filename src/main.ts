import './scss/styles.scss';
import { Api } from './components/base/Api';
import { CatalogModel } from './components/models/catalog-model';
import { CartModel } from './components/models/cart-model';
import { BuyerModel } from './components/models/buyer-model';
import { AppApi } from './components/models/app-api';
import { apiProducts } from './utils/data';
import { API_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';

const events = new EventEmitter();
// ===== 1. ПРОВЕРКА КАТАЛОГА =====
console.log('========== ПРОВЕРКА КАТАЛОГА ==========');
const catalog = new CatalogModel(events);
//Проверка общего каталога
catalog.setProducts(apiProducts.items);
console.log('Товары сохранены в каталог');

console.log('Массив товаров из каталога:', catalog.getProducts());

//Проверка поиска по id
console.log('Товар с id:', catalog.getProductById('c101ab44-ed99-4a54-990d-47aa2bb4e7d9'));
console.log('Товар с id "1" (несуществующий):', catalog.getProductById('1'));

// Выбор товара для подробного просмотра
const firstProduct = catalog.getProducts()[0];
catalog.setSelectedProduct(firstProduct);
console.log('Выбранный товар:', catalog.getSelectedProduct());

// Сброс выбранного товара
catalog.setSelectedProduct(null);
console.log('Выбранный товар после сброса:', catalog.getSelectedProduct());

// ===== 2. ПРОВЕРКА КОРЗИНЫ =====
console.log('========== ПРОВЕРКА КОРЗИНЫ ==========');
const cart = new CartModel(events);

// Добавление товаров
const product1 = catalog.getProducts()[0];
const product2 = catalog.getProducts()[1];

cart.addProduct(product1);
cart.addProduct(product2);
console.log('Товары добавлены в корзину');

// Получение всех товаров корзины
console.log('Все товары в корзине:', cart.getItems());

// Получение количества товаров
console.log('Количество товаров в корзине:', cart.getTotalCount());

// Получение общей стоимости
console.log('Общая стоимость корзины:', cart.getTotalPrice());

// Проверка наличия товара
console.log('Товар с id "854cef69-976d-4c2a-a18c-2aa45046c390" есть в корзине?', cart.containsProduct('854cef69-976d-4c2a-a18c-2aa45046c390'));
console.log('Товар с id "999" есть в корзине?', cart.containsProduct('999'));

// Удаление одного экземпляра товара
cart.removeProduct(product1);
console.log('Корзина после удаления одного экземпляра товара id="854cef69-976d-4c2a-a18c-2aa45046c390":', cart.getItems());
console.log('Количество товаров после удаления:', cart.getTotalCount());

// Очистка корзины
cart.clear();
console.log('Корзина после очистки:', cart.getItems());



 // ===== 3. ПРОВЕРКА ПОКУПАТЕЛЯ =====
console.log('========== ПРОВЕРКА ПОКУПАТЕЛЯ ==========');
const buyer = new BuyerModel(events);

// Установка данных по отдельным методам
buyer.setPayment('card');
buyer.setEmail('test@example.com');
buyer.setPhone('+70001112233');
buyer.setAddress('ул. Пушкина, д. 1');
console.log('Данные покупателя сохранены');

// Получение всех данных
console.log('Все данные покупателя:', buyer.getAllData());

// Проверка валидации (все поля заполнены)
console.log('Валидация (все поля заполнены):', buyer.validate());

// Очистка  полей 
buyer.clear();
console.log('Данные после очистки:', buyer.getAllData());

// Проверка валидации (пустые поля)
console.log('Валидация (пустые поля):', buyer.validate());

// Частичное заполнение (по отдельным методам)
buyer.setEmail('partial@example.com');
buyer.setPhone('+79876543210');
console.log('Данные после частичного заполнения:', buyer.getAllData());
console.log('Валидация (частично заполнено):', buyer.validate());


// ===== 4. РАБОТА С СЕРВЕРОМ =====
console.log('========== РАБОТА С СЕРВЕРОМ ==========');

const baseApi = new Api(API_URL);
const appApi = new AppApi(baseApi);

appApi.getProducts()
  .then(products => {
    console.log('Товары получены с сервера:', products);
    
    // Сохраняем в модель каталога
    catalog.setProducts(products);
    console.log('Каталог сохранён:', catalog.getProducts());
  })
  .catch(error => {
    console.error('Ошибка получения товаров:', error);
  });