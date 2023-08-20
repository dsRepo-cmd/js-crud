// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

const purchase = require('./purchase')
const user = require('./user')
const product = require('./product')
const spotify = require('./spotify')

router.use('/', purchase)
router.use('/', user)
router.use('/', product)
router.use('/', spotify)

router.get('/', function (req, res) {
  res.render('index', {
    style: 'index',
    list: [
      {
        name: 'User',
        href: './user',
      },
      {
        name: 'Purchase',
        href: './purchase',
      },
      {
        name: 'Product',
        href: './product-list',
      },
      {
        name: 'Spotify',
        href: './spotify',
      },
    ],
  })
})

module.exports = router
