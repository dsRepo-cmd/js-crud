// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Product {
  static #list = []

  constructor(name, price, description) {
    this.id = Math.floor(Math.random() * 90000) + 10000
    this.createDate = new Date().toISOString()
    this.name = name
    this.price = price
    this.description = description
  }

  static getList() {
    return this.#list
  }

  static add(product) {
    if (product) {
      this.#list.push(product)
      return true
    }
    return false
  }

  static getById(id) {
    return this.#list.find((product) => product.id === id)
  }

  static updateById(id, data) {
    const product = this.getById(id)
    if (product) {
      if (data.name) {
        product.name = data.name
      }
      if (data.price) {
        product.price = data.price
      }
      if (data.description) {
        product.description = data.description
      }

      return true
    }
    return false
  }

  static deleteById(id) {
    const index = this.#list.findIndex((product) => product.id === id)
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    }
    return false
  }
}

// ================================================================

router.get('/product-create', function (req, res) {
  res.render('product-create', {
    style: 'product-create',
    info: '',
  })
})

// ================================================================

router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body

  const product = new Product(name, price, description)

  result = false

  result = Product.add(product)

  res.render('alert', {
    style: 'alert',
    title: 'Створення товару',
    href: '/product-list',
    info: result ? 'Товар створено успішно' : 'Не вдалося створити товар',
  })
})

// ================================================================

router.get('/product-list', function (req, res) {
  const list = Product.getList()

  res.render('product-list', {
    style: 'product-list',
    info: 'User deleted',
    list,
  })
})

// ================================================================

router.get('/product-edit', function (req, res) {
  const { id } = req.query

  const product = Product.getById(Number(id))

  res.render('product-edit', {
    style: 'product-edit',
    product: product,
    id: product.id,
  })
})

// ================================================================

router.post('/product-edit', function (req, res) {
  const { name, price, id, description } = req.body

  Product.getById(Number(id))

  const data = {
    name: name,
    price: price,
    description: description,
  }

  let result = false

  result = Product.updateById(Number(id), data)

  res.render('alert', {
    style: 'alert',
    href: '/product-list',
    title: 'Редагування товару',
    info: result
      ? 'Дані товару оновлено успішно'
      : 'Не вдалося оновити дані товару',
  })
})

// ================================================================

router.get('/product-delete', function (req, res) {
  const { id } = req.query

  let result = false

  result = Product.deleteById(Number(id))

  res.render('alert', {
    style: 'alert',
    title: 'Видалення товару',
    href: '/product-list',
    info: result ? 'Товар успішно видалено' : 'Не вдалося видалити товар',
  })
})
// ================================================================

module.exports = router
