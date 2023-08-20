// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()
// ================================================================

class Product {
  static #list = []

  static #count = 0

  constructor(img, title, description, category, price, amount = 0) {
    this.id = ++Product.#count
    this.img = img
    this.title = title
    this.description = description
    this.category = category
    this.price = price
    this.amount = amount
  }
  static add = (...data) => {
    const newProduct = new Product(...data)
    this.#list.push(newProduct)
  }
  static getList = () => {
    return this.#list
  }

  static getById = (id) => {
    return this.#list.find((product) => product.id === id)
  }

  static getRandomList = (id) => {
    const filterList = this.#list.filter((product) => product.id !== id)

    const shuffledList = filterList.sort(() => Math.random() - 0.5)

    return shuffledList.slice(0, 3)
  }
}

// ================================================================
Product.add(
  'https://picsum.photos/600/800',
  `Комп'ютер Artline Gaming (X43v31)`,
  `Комп'ютер Artline Gaming (X43v31) AMD Ryzen 5 3600 / Gigabyte B450M S2H / 16ГБ DDR4 / MSI GeForce RTX 3050 AERO 8G OC / SSD 480ГБ + HDD 1ТБ / 600W GPS-600A`,
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  5000,
  10,
)
Product.add(
  'https://picsum.photos/600/800',
  `Комп'ютер COBRA Advanced `,
  `Комп'ютер COBRA Advanced (A55.16.H1S4.36.16983) AMD Ryzen 5 5500/ DDR4 16ГБ / HDD 1ТБ + SSD 480ГБ / nVidia GeForce RTX 3060 12ГБ`,
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  6000,
  10,
)
Product.add(
  'https://picsum.photos/600/800',
  `Комп'ютер ARTLINE Gaming X77 v39 `,
  `Комп'ютер ARTLINE Gaming X77 v39 (X77v39) Intel Core i7-10700F / RAM 32ГБ / SSD 1ТБ / nVidia GeForce RTX 3070 8ГБ`,
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  7500,
  10,
)
Product.add(
  'https://picsum.photos/600/800',
  `Комп'ютер ARTLINE Gaming X37`,
  `Комп'ютер ARTLINE Gaming X37 v41 (X37v41) Intel Core i5-10400F / RAM 16ГБ / SSD 1ТБ / nVidia GeForce RTX 3050 8ГБ`,
  [
    { id: 1, text: 'Готовий до відправки' },
    { id: 2, text: 'Топ продажів' },
  ],
  4500,
  10,
)
// ================================================================

class Promocode {
  static #list = []
  constructor(name, factor) {
    this.name = name
    this.factor = factor
  }
  static add = (name, factor) => {
    const newPromocode = new Promocode(name, factor)
    Promocode.#list.push(newPromocode)
    return newPromocode
  }
  static getByName = (name) => {
    return this.#list.find((promo) => promo.name === name)
  }

  static calc = (promo, price) => price * promo.factor
}

// ================================================================
Promocode.add('SUMMER2023', 0.9)
Promocode.add('DISCOUNT50', 0.5)
Promocode.add('SALE25', 0.75)

// ================================================================

class Purcase {
  static DELIVERY_PRICE = 150
  static #BONUS_FACTOR = 0.1

  static #list = []

  static #count = 0

  static #bonusAccount = new Map()

  static getBonusBalance = (email) => {
    return Purcase.#bonusAccount.get(email) || 0
  }

  static calcBonusAmount = (val) => {
    return val * Purcase.#BONUS_FACTOR
  }

  static updateBonusBalance = (email, price, bonusUse) => {
    const amount = this.calcBonusAmount(price)
    const currentBalance = Purcase.getBonusBalance(email)
    const updateBalance = currentBalance + amount - bonusUse

    Purcase.#bonusAccount.set(email, updateBalance)

    // console.log(email, updateBalance)

    return amount
  }

  constructor(data, product) {
    this.id = ++Purcase.#count

    this.firstname = data.firstname
    this.lastname = data.lastname

    this.phone = data.phone
    this.email = data.email

    this.comment = data.comment || null
    this.bonus = data.bonus || 0
    this.promocode = data.promocode || null

    this.totalPrice = data.totalPrice
    this.productPrice = data.productPrice
    this.deliveryPrice = data.deliveryPrice
    this.amount = data.amount

    this.product = product
  }

  static add = (...arg) => {
    const newPurchase = new Purcase(...arg)
    this.#list.push(newPurchase)
    return newPurchase
  }

  static getList = () => {
    return Purcase.#list.reverse().map(({ id, product, totalPrice, bonus }) => {
      return {
        id,
        product,
        totalPrice,
        bonus,
      }
    })
  }

  static getById = (id) => {
    return Purcase.#list.find((item) => item.id === id)
  }

  static updateByID = (id, data) => {
    const purchase = Purcase.getById(id)
    if (purchase) {
      if (data.firstname) purchase.firstname = data.firstname
      if (data.lastname) purchase.lastname = data.lastname
      if (data.email) purchase.email = data.email
      if (data.phone) purchase.phone = data.phone
      return true
    } else {
      return false
    }
  }
}

// ================================================================
Purcase.add(
  {
    id: 1,
    firstname: 'Іван',
    lastname: 'Іванов',
    phone: '123456789',
    email: 'ivan@gmail.com',
    comment: 'Загорнути бантиком',
    bonus: 100,
    promocode: { name: 'SALE25', factor: 0.75 },
    totalPrice: 3862.5,
    productPrice: 5000,
    deliveryPrice: 150,
    amount: 1,
  },
  Product.getById(1),
)
// ================================================================

router.get('/purchase', function (req, res) {
  // console.log(Product.getList())
  res.render('purchase-index', {
    style: 'purchase-index',
    data: {
      list: Product.getList(),
    },
  })
})

// ================================================================

router.get('/purchase-product', function (req, res) {
  const id = Number(req.query.id)
  // console.log(Product.getById(id))
  // console.log(Product.getRandomList(id))

  res.render('purchase-product', {
    style: 'purchase-product',
    data: {
      list: Product.getRandomList(id),
      product: Product.getById(id),
    },
  })
})

// ================================================================

router.post('/purshase-create', function (req, res) {
  const id = Number(req.query.id)
  const amount = Number(req.body.amount)

  if (amount < 1) {
    return res.render('alert', {
      style: 'alert',
      title: 'Помилка вводу',
      info: 'Некоректна кількість товару',
      href: `/purchase-product?id=${id}`,
    })
  }

  const product = Product.getById(id)

  if (product.amount < amount) {
    return res.render('alert', {
      style: 'alert',
      title: 'Помилка вводу',
      info: 'Такої кількості товару немає в наявності',
      href: `/purchase-product?id=${id}`,
    })
  }

  // console.log(product, amount, '!!!!!!!!!!')
  const productPrice = product.price * amount
  const totalPrice = productPrice + Purcase.DELIVERY_PRICE
  const bonus = Purcase.calcBonusAmount(totalPrice)

  res.render('purchase-create', {
    style: 'purchase-create',
    data: {
      id: product.id,
      cart: [
        { text: `${product.title} (${amount} шт)`, price: productPrice },
        { text: `Доставка`, price: Purcase.DELIVERY_PRICE },
      ],
      totalPrice,
      productPrice,
      deliveryPrice: Purcase.DELIVERY_PRICE,
      amount,
      bonus,
    },
  })
})

// ================================================================

router.post('/purshase-submit', function (req, res) {
  const id = Number(req.query.id)
  let = {
    firstname,
    lastname,
    phone,
    email,
    comment,

    promocode,
    bonus,

    totalPrice,
    productPrice,
    deliveryPrice,
    amount,
  } = req.body

  const product = Product.getById(id)

  if (!product) {
    return res.render('alert', {
      style: 'alert',
      title: 'Помилка',
      info: 'Товар не знайдено',
      href: `/purchase-list`,
    })
  }

  if (product.amount < amount) {
    return res.render('alert', {
      style: 'alert',
      title: 'Помилка',
      info: 'Товару немає в потрібній кількості',
      href: `/purchase-list`,
    })
  }

  totalPrice = Number(totalPrice)
  productPrice = Number(productPrice)
  deliveryPrice = Number(deliveryPrice)
  amount = Number(amount)
  bonus = Number(bonus)

  if (
    isNaN(totalPrice) ||
    isNaN(productPrice) ||
    isNaN(deliveryPrice) ||
    isNaN(amount) ||
    isNaN(bonus)
  ) {
    return res.render('alert', {
      style: 'alert',
      title: 'Помилка',
      info: 'Некоректні дані',
      href: `/purchase-list`,
    })
  }

  if (!firstname || !lastname || !phone || !email) {
    return res.render('alert', {
      style: 'alert',
      title: "Заповніть обов'язкові поля",
      info: 'Некоректні дані',
      href: `/purchase-list`,
    })
  }

  if (bonus || bonus > 0) {
    const bonusAmount = Purcase.getBonusBalance(email)

    console.log(bonusAmount)

    if (bonus > bonusAmount) {
      bonus = bonusAmount
    }

    Purcase.updateBonusBalance(email, totalPrice, bonus)

    totalPrice -= bonus
  } else {
    Purcase.updateBonusBalance(email, totalPrice, 0)
  }

  if (promocode) {
    promocode = Promocode.getByName(promocode)
    if (promocode) {
      totalPrice = Promocode.calc(promocode, totalPrice)
    }
  }

  if (totalPrice < 0) totalPrice = 0

  const purchase = Purcase.add(
    {
      totalPrice,
      productPrice,
      deliveryPrice,
      amount,
      bonus,

      firstname,
      lastname,
      phone,
      email,
      promocode,
      comment,
    },
    product,
  )
  console.log(purchase)
  res.render('alert', {
    style: 'alert',
    title: 'Успішно',
    info: 'Замовлення створено',
    href: `/purchase-list`,
  })
})

// ================================================================

router.get('/purchase-list', function (req, res) {
  const list = Purcase.getList()

  // console.log('=========>', list)

  res.render('purchase-list', {
    style: 'purchase-list',
    data: {
      list: list,
    },
  })
})

// ================================================================

router.post('/purchase-list', function (req, res) {
  const id = Number(req.query.id)
  const list = Purcase.getById(id)

  // console.log('=========>', list, id)

  res.render('purchase-info', {
    style: 'purchase-info',
    data: {
      list: list,
    },
  })
})

// ================================================================

router.post('/purshase-edit', function (req, res) {
  const id = Number(req.query.id)
  const list = Purcase.getById(id)

  // console.log('=========>', list, id)

  res.render('purchase-edit', {
    style: 'purchase-edit',
    data: {
      list: list,
    },
  })
})

// ================================================================

router.post('/purshase-success', function (req, res) {
  const id = Number(req.query.id)
  const list = req.body

  const data = Purcase.updateByID(id, list)

  // const updatedList = Purcase.getById(id)
  // console.log('=========>', data, id, updatedList)

  if (
    list.firstname.length < 1 ||
    list.lastname.length < 1 ||
    list.email.length < 1 ||
    list.phone.length < 1
  ) {
    return res.render('alert', {
      style: 'alert',
      title: 'Помилка',
      info: 'Поля не повинні бути пустими',
      href: `/purchase-list`,
    })
  }

  if (!data) {
    return res.render('alert', {
      style: 'alert',
      title: 'Помилка',
      info: 'Не вдалося відредагувати данні',
      href: `/purchase-list`,
    })
  }

  res.render('alert', {
    style: 'alert',
    title: 'Успішне виконання дії',
    info: 'Данні відредаговано',
    href: `/purchase-list`,
  })
})

// ================================================================

module.exports = router
