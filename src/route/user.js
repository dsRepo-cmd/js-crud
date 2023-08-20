// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()
// ================================================================
class User {
  static #list = []

  constructor(email, login, password, age = 0, role) {
    this.email = email
    this.login = login
    this.password = password
    this.age = age
    this.role = role
    this.id = new Date().getTime()
  }

  veryfyPassword = (password) => this.password === password

  static add = (user) => {
    if (user) {
      this.#list.push(user)
      return true
    }
    return false
  }
  static getList = () => this.#list

  static getById = (id) => this.#list.find((user) => user.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex((user) => user.id === id)
    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }
  static updateById = (id, data) => {
    const user = this.getById(id)

    if (user) {
      this.update(user, data)
      return true
    } else {
      return false
    }
  }
  static update = (user, { email, age, role }) => {
    if (email) {
      user.email = email
      user.age = age
      user.role = role
    }
  }
}

User.add(new User('Ivan@mail.com', 'Ivan', '', 20, 'admin'))
// ================================================================

router.get('/user', function (req, res) {
  // res.render генерує нам HTML сторінку

  const list = User.getList()
  // ↙️ cюди вводимо назву файлу з сontainer
  const { id } = req.query
  const editList = User.getById(Number(id))
  res.render('user-index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'user-index',
    editList,
    data: {
      users: {
        list,
        isEmpty: list.length === 0,
      },
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================

router.post('/user-create', function (req, res) {
  const { email, login, password, age, role } = req.body

  const user = new User(email, login, password, age, role)

  User.add(user)

  res.render('alert', {
    style: 'alert',
    title: 'Успіх',
    href: '/user',
    info: 'Користувач створений',
  })
})

// ================================================================

router.get('/user-delete', function (req, res) {
  const { id } = req.query

  User.deleteById(Number(id))

  res.render('alert', {
    style: 'alert',
    title: 'Успіх',
    href: '/user',
    info: 'Користувач видалений',
  })
})

// ================================================================

router.post('/user-update', function (req, res) {
  const { email, password, id, age, role } = req.body

  let result = false

  const user = User.getById(Number(id))

  if (user.veryfyPassword(password)) {
    User.update(user, { email, age, role })
    result = true
  }

  res.render('alert', {
    style: 'alert',
    title: 'Успіх',
    href: '/user',
    info: result ? 'Email updated' : 'Error updated',
  })
})

// ================================================================

module.exports = router
