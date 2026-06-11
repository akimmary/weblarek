import './scss/styles.scss';
import { Api } from './components/base/Api';
import { CatalogModel } from './components/models/catalog-model';
import { CartModel } from './components/models/cart-model';
import { BuyerModel } from './components/models/buyer-model';
import { AppApi } from './components/models/app-api';
import { API_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { Header } from './components/views/Header';
import { Gallery } from './components/views/Gallery';
import { Modal } from './components/views/Modal';
import { Basket } from './components/views/Basket';
import { OrderForm } from './components/views/form/OrderForm';
import { ContactsForm } from './components/views/form/ContactsForm';
import { cloneTemplate } from './utils/utils';
import { CardCatalog } from './components/views/card/CardCatalog';
import { CardPreview } from './components/views/card/CardPreview';
import { CardBasket } from './components/views/card/CardBasket';
import { OrderSuccess } from './components/views/OrderSuccess';
import { ensureElement } from './utils/utils';


const events = new EventEmitter();

// Создание экземпляров моделей
const catalog = new CatalogModel(events);
const cart = new CartModel(events);
const buyer = new BuyerModel(events);

// Создание экземпляров представлений
const headerContainer = ensureElement<HTMLElement>('.header', document.body);
const header = new Header(headerContainer, events);
const galleryContainer = ensureElement<HTMLElement>('.gallery', document.body);
const gallery = new Gallery(galleryContainer);
const modalContainer = ensureElement<HTMLElement>('#modal-container', document.body);
const modal = new Modal(modalContainer, events);

const basketElement = cloneTemplate('#basket');
const basket = new Basket(basketElement, events);
const orderElement = cloneTemplate('#order') as HTMLFormElement;
const orderForm = new OrderForm(orderElement, events);
const contactsElement = cloneTemplate('#contacts') as HTMLFormElement;
const contactsForm =  new ContactsForm(contactsElement, events);


//Функция обновления корзины
function updateBasketContent() {
  if (!basket) return;

  const items = cart.getItems();

  if (items.length === 0) {
    basket.items = [];
    basket.total = 0;
    basket.disabled = true;
    return;
  }

  const cardElements: HTMLElement[] = [];

  items.forEach((item, index) => {
    const cardElement = cloneTemplate('#card-basket');
    const card = new CardBasket(cardElement, events, () => {
      cart.removeProduct(item);
    });
      card.data = {
        ...item,
        index: index + 1
      };
      cardElements.push(cardElement);
  });

  basket.items = cardElements;
  basket.total = cart.getTotalPrice();
  basket.disabled = false;
}

// Слушатель события изменения каталога
events.on('catalog:changed', () => {
  const products = catalog.getProducts();
  const cardElements: HTMLElement[] = [];

  products.forEach(product => {
    const cardElement = cloneTemplate('#card-catalog');
    const card = new CardCatalog(cardElement, events, () => {
      events.emit('card:select', { id: product.id });
    });        
    card.data = product;
      cardElements.push(cardElement);
  });

  if (gallery) {
    gallery.catalog = cardElements;
  }
});


// Обработка клика по карточке каталога
events.on('card:select', (data: { id: string }) => {
  const product = catalog.getProductById(data.id);
  if (product) {
    catalog.setSelectedProduct(product);
  }
});

events.on('catalog:selected', () => {
  const product = catalog.getSelectedProduct();

  if (!product) {
    return;
  }

  const previewElement = cloneTemplate('#card-preview');

  if (previewElement && modal) {
    const cardPreview = new CardPreview(previewElement, events, () => {
      const selectedProduct = catalog.getSelectedProduct();
      if (selectedProduct && selectedProduct.price !== null) {
        if (cart.containsProduct(selectedProduct.id)) {
          cart.removeProduct(selectedProduct);
        } else {
          cart.addProduct(selectedProduct);
        }
        modal.close();
      }
    });

    cardPreview.render({
      id: product.id,
      title: product.title,
      price: product.price,
      category: product.category,
      image: product.image,
      description: product.description,
      buttonText: product.price === null 
        ? 'Недоступно' 
        : (cart.containsProduct(product.id) ? 'Удалить из корзины' : 'В корзину'),
      buttonDisabled: product.price === null
    });

    modal.content = previewElement;
    modal.open();
  }
});

// Обновление корзины (счётчик и содержимое)
events.on('cart:changed', () => {
  if (header) {
    header.counter = cart.getTotalCount();
  }
  if (basket) {
    updateBasketContent();
  }

});

// Открытие корзины
events.on('basket:open',  () => {
  if (basket && modal) {
    modal.content = basket.render();
    modal.open();
  }
});

// Открытие формы заказа из корзины
events.on('basket:checkout', () => {
  orderForm.render({ payment: '', address: '' });
  contactsForm.render({ email: '', phone: '' });
  modal.content = orderElement;
  modal.open();
});

// Переход к форме контактов (после валидной формы заказа)
events.on('order:submit', () => {
  modal.content = contactsElement;
  modal.open();
});

// Изменение полей формы заказа
events.on('order:input', (data: { payment?: 'card' | 'cash'; address?: string }) => {
  if (data.payment) {
    buyer.setPayment(data.payment);
  }
  if (data.address !== undefined) {
    buyer.setAddress(data.address);
  }
})

// Изменение полей формы контактов
events.on('contacts:input', (data: { email?: string; phone?: string }) => {
  if (data.email !== undefined) {
    buyer.setEmail(data.email);
  }
  if (data.phone !== undefined) {
    buyer.setPhone(data.phone);
  }
});

events.on('buyer:changed', () => {
  // Валидация формы заказа (payment и address)
  const orderErrors = buyer.validate();
  const orderErrorMessages = [orderErrors.payment, orderErrors.address].filter(Boolean).join(', ');
  const isOrderValid = !orderErrors.payment && !orderErrors.address;
  
  if (orderForm) {
    orderForm.errors = orderErrorMessages;
    orderForm.valid = isOrderValid;
  }
  
  // Валидация формы контактов (email и phone)
  const contactErrors = buyer.validate();
  const contactErrorMessages = [contactErrors.email, contactErrors.phone].filter(Boolean).join(', ');
  const isContactValid = !contactErrors.email && !contactErrors.phone;
  
  if (contactsForm) {
    contactsForm.errors = contactErrorMessages;
    contactsForm.valid = isContactValid;
  }
});

// Отправка заказа
events.on('contacts:submit', async () => {
  const buyerData = buyer.getAllData(); 

  const orderData = {
    payment: buyerData.payment,
    email: buyerData.email,
    phone: buyerData.phone,
    address: buyerData.address,
    total: cart.getTotalPrice(),
    items: cart.getItems().map(item => item.id)
  };

  try {
    const result = await appApi.postOrder(orderData);
    cart.clear();
    buyer.clear();

    const successElement = cloneTemplate('#success');
    const success = new OrderSuccess(successElement, events);
    success.total = result.total;

    modal.content = successElement;
    modal.open();
  } catch (error) {
    console.error('Ошибка при отправке заказа:', error);
  }
});

// Закрытие окна успеха и очистка корзины
events.on('success:close', () => {
  modal.close(); 
});

// Работа с сервером
const baseApi = new Api(API_URL);
const appApi = new AppApi(baseApi);

appApi.getProducts()
  .then(response => {
    catalog.setProducts(response.items);
  })
  .catch(error => {
    console.error('Ошибка получения товаров:', error);
  });
