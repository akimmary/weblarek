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

const events = new EventEmitter();

// Создание экземпляров моделей
const catalog = new CatalogModel(events);
const cart = new CartModel(events);
const buyer = new BuyerModel(events);

let gallery: Gallery | null = null;
let modal: Modal | null = null;
let header: Header | null = null;
let basket: Basket | null = null;
let orderForm: OrderForm | null = null;
let contactsForm: ContactsForm | null = null;
let currentPreviewCard: any = null;
let currentPreviewCardId: string | null = null;

async function updateBasketContent() {
  if (!basket) return;

  const items = cart.getItems();

  if (items.length === 0) {
    basket.items = [];
    basket.total = 0;
    basket.disabled = true;
    return;
  }

  const { CardBasket } = await import('./components/views/card/CardBasket');
  const cardTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;

  const cardElements: HTMLElement[] = [];

  items.forEach((item, index) => {
    const cardElement = cardTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
    if (cardElement) {
      const card = new CardBasket(cardElement, events);
      card.data = {
        ...item,
        index: index + 1
      };
      cardElements.push(cardElement);
    }
  });

  basket.items = cardElements;
  basket.total = cart.getTotalPrice();
  basket.disabled = false;
}

// Слушатель события изменения каталога
events.on('catalog:changed', () => {
  const products = catalog.getProducts();

  import('./components/views/card/CardCatalog').then(({ CardCatalog }) => {
    const cardTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
    const cardElements: HTMLElement[] = [];

    products.forEach(product => {
      const cardElement = cardTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;
      if (cardElement) {
        const card = new CardCatalog(cardElement, events);
        card.data = product;
        cardElements.push(cardElement);
      }
    });

    if (gallery) {
      gallery.catalog = cardElements;
    }
  });
});

// Обработка клика по карточке каталога
events.on('card:select', (data: { id: string }) => {
  const product = catalog.getProductById(data.id);
  if (!product) {
    console.error('Товар не найден:', data.id);
    return;
  }

  currentPreviewCardId = data.id;

  import('./components/views/card/CardPreview').then(({ CardPreview }) => {
    const previewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
    const previewElement = previewTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;

    if (previewElement && modal) {
      const cardPreview = new CardPreview(previewElement, events);
      currentPreviewCard = cardPreview;
      cardPreview.data = {
        ...product,
        inCart: cart.containsProduct(product.id)
      };

      modal.content = previewElement;
      modal.open();
    }
  });
});

// Закрытие модального окна
events.on('modal:close', () => {
  if (modal) {
    modal.close();
    currentPreviewCard = null;
    currentPreviewCardId = null;
  }
});

// Добавление товара в корзину
events.on('card:add', (data: { id: string }) => {
  const product = catalog.getProductById(data.id);
  if (!product) {
    return;
  }
  if (product.price === null) {
    return;
  }

  cart.addProduct(product);
});

// Удаление товара из корзины (из карточки превью)
events.on('card:remove', (data: { id: string }) => {
  const product = cart.getItems().find(item => item.id === data.id);
  if (product) {
    cart.removeProduct(product);
  }

  if (modal) {
    modal.close();
  }
});


// Обновление корзины (счётчик и содержимое)
events.on('cart:changed', async () => {
  if (header) {
    header.counter = cart.getTotalCount();
  }
  if (basket) {
    await updateBasketContent();
  }

  // Обновляем открытую карточку превью
  if (currentPreviewCardId && currentPreviewCard) {
    const product = catalog.getProductById(currentPreviewCardId);
    if (product) {
      currentPreviewCard.data = {
        ...product,
        inCart: cart.containsProduct(currentPreviewCardId)
      };
    }
  }
});

// Открытие корзины
events.on('basket:open', async () => {
  if (!basket) {
    const { Basket } = await import('./components/views/Basket');
    const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
    const basketElement = basketTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;

    if (basketElement) {
      basket = new Basket(basketElement, events);
    }
  }

  if (basket && modal) {
    await updateBasketContent();
    modal.content = basket.render();
    modal.open();
  }
});

// Удаление товара из корзины (из корзины)
events.on('card:delete', (data: { id: string }) => {
  const product = cart.getItems().find(item => item.id === data.id);
  if (product) {
    cart.removeProduct(product);
  }

});

// Открытие формы заказа (из корзины)
events.on('order:submit', async () => {
  if (orderForm) {
    const buyerData = buyer.getAllData();
    if (!buyerData.payment || !buyerData.address) {
      console.warn('Форма заказа не валидна');
      return;
    }

    const { ContactsForm } = await import('./components/views/form/ContactsForm');
    const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
    const contactsElement = contactsTemplate.content.firstElementChild?.cloneNode(true) as HTMLFormElement;

    if (contactsElement && modal) {
      contactsForm = new ContactsForm(contactsElement, events);

      if (buyerData.email) {
        contactsForm.email = buyerData.email;
      }
      if (buyerData.phone) {
        contactsForm.phone = buyerData.phone;
      }

      modal.content = contactsElement;
      modal.open();
    }
  } else {
    if (modal) {
      modal.close();
    }

    const { OrderForm } = await import('./components/views/form/OrderForm');
    const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
    const orderElement = orderTemplate.content.firstElementChild?.cloneNode(true) as HTMLFormElement;

    if (orderElement && modal) {
      orderForm = new OrderForm(orderElement, events);

      modal.content = orderElement;
      modal.open();
    }
  }
});

// Изменение полей формы заказа
events.on('order:input', (data: { payment?: 'card' | 'cash'; address?: string }) => {
  if (data.payment) {
    buyer.setPayment(data.payment);
  }
  if (data.address !== undefined) {
    buyer.setAddress(data.address);
  }

  const buyerData = buyer.getAllData();
  let errorMessage = '';

  if (!buyerData.payment && !buyerData.address) {
    errorMessage = 'Выберите способ оплаты и введите адрес';
  } else if (!buyerData.payment) {
    errorMessage = 'Выберите способ оплаты';
  } else if (!buyerData.address) {
    errorMessage = 'Введите адрес доставки';
  }

  const isValid = !errorMessage;

  if (orderForm) {
    orderForm.errors = errorMessage;
    orderForm.valid = isValid;
  }
});

// Изменение полей формы контактов
events.on('contacts:input', (data: { email?: string; phone?: string }) => {
  if (data.email !== undefined) {
    buyer.setEmail(data.email);
  }
  if (data.phone !== undefined) {
    buyer.setPhone(data.phone);
  }

  const buyerData = buyer.getAllData();
  let errorMessage = '';

  if (!buyerData.email && !buyerData.phone) {
    errorMessage = 'Введите email и телефон';
  } else if (!buyerData.email) {
    errorMessage = 'Введите email';
  } else if (!buyerData.phone) {
    errorMessage = 'Введите телефон';
  }

  const isValid = !errorMessage;

  if (contactsForm) {
    contactsForm.errors = errorMessage;
    contactsForm.valid = isValid;
  }
});

// Отправка заказа
events.on('contacts:submit', async () => {
  const buyerData = buyer.getAllData();

  if (!buyerData.email || !buyerData.phone) {
    console.error('Форма контактов не валидна');
    return;
  }

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

    const { OrderSuccess } = await import('./components/views/OrderSuccess');
    const successTemplate = document.querySelector('#success') as HTMLTemplateElement;
    const successElement = successTemplate.content.firstElementChild?.cloneNode(true) as HTMLElement;

    if (successElement && modal) {
      const success = new OrderSuccess(successElement, events);
      success.total = result.total;

      modal.content = successElement;
      modal.open();
    }
  } catch (error) {
    console.error('Ошибка при отправке заказа:', error);
  }
});

// Закрытие окна успеха и очистка корзины
events.on('success:close', () => {
  cart.clear();
  buyer.clear();
  orderForm = null;
  contactsForm = null;
  if (modal) {
    modal.close();
  }
});

// Работа с сервером
const baseApi = new Api(API_URL);
const appApi = new AppApi(baseApi);

appApi.getProducts()
  .then(products => {
    catalog.setProducts(products);
  })
  .catch(error => {
    console.error('Ошибка получения товаров:', error);
  });

// Создание представлений после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  const headerContainer = document.querySelector('.header') as HTMLElement;
  header = new Header(headerContainer, events);

  const galleryContainer = document.querySelector('.gallery') as HTMLElement;
  gallery = new Gallery(galleryContainer);

  const modalContainer = document.getElementById('modal-container') as HTMLElement;
  modal = new Modal(modalContainer, events);
});