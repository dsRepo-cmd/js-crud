// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()
// ================================================================
class Track {
  static #list = []

  constructor(name, author, image) {
    this.id = Math.floor(1000 + Math.random() * 900)
    this.name = name
    this.author = author
    this.image = image
  }

  static create(name, author, image) {
    const newTrack = new Track(name, author, image)
    this.#list.push(newTrack)
    return newTrack
  }

  static getList() {
    return this.#list.reverse()
  }

  static getById(id) {
    return Track.#list.find((track) => track.id === id) || null
  }
}

Track.create(
  'Senorita',
  'Shawn Mendes & Camila Cabello',
  'https://picsum.photos/100/100',
)
Track.create(
  'Clandestina',
  'FILV & Edmofo feat. Emma Peters',
  'https://picsum.photos/100/100',
)
Track.create(
  'Rockabye',
  'Clean Bandit feat. Sean Paul & Anne-Marie',
  'https://picsum.photos/100/100',
)
Track.create('Mr. Saxobeat', 'Alexandra Stan', 'https://picsum.photos/100/100')
Track.create('Chemical', ' Post Malone', 'https://picsum.photos/100/100')
Track.create(
  'Clandestina',
  `Mike Williams & The Him feat. Travie's Nightmare`,
  'https://picsum.photos/100/100',
)
Track.create(
  'Down The River',
  'Ben Nicky feat. Example',
  'https://picsum.photos/100/100',
)

class Playlist {
  static #list = []
  constructor(name) {
    this.id = Math.floor(1000 + Math.random() * 900)
    this.name = name
    this.tracks = []
    this.image = 'https://picsum.photos/350/350'
  }

  static create(name) {
    const newPlaylist = new Playlist(name)
    this.#list.push(newPlaylist)
    return newPlaylist
  }

  static getList() {
    return this.#list.reverse()
  }

  static makeMix(playlist) {
    const allTracks = Track.getList()

    let randomTracks = allTracks.sort(() => 0.5 * Math.random()).slice(0, 3)

    playlist.tracks.push(...randomTracks)
  }

  static getById(id) {
    return Playlist.#list.find((playlist) => playlist.id === id) || null
  }

  deleteTrackById(trackId) {
    this.tracks = this.tracks.filter((track) => track.id !== trackId)
  }

  addTrack(trackId) {
    const trackToAdd = Track.getList().find((track) => track.id === trackId)
    this.tracks.push(trackToAdd)
  }

  static findListByValue(value) {
    return this.#list.filter((playlist) =>
      playlist.name.toLowerCase().includes(value.toLowerCase()),
    )
  }
}

Playlist.makeMix(Playlist.create('Pop'))
Playlist.makeMix(Playlist.create('Electric'))
Playlist.makeMix(Playlist.create('Jazz'))

// ========================================================================

function getDeclension(number, form1, form2, form3) {
  let remainder = number % 100
  remainder = remainder >= 11 && remainder <= 19 ? 0 : number % 10

  let form =
    remainder === 1 ? form1 : remainder >= 2 && remainder <= 4 ? form2 : form3

  return `${number} ${form}`
}

let singularForm = 'пісня'
let dualForm = 'пісні'
let pluralForm = 'пісень'

// ================================================================

router.get('/spotify', function (req, res) {
  const list = Playlist.getList()
  value = ''
  // console.log(list)
  res.render('spotify-index', {
    style: 'spotify-index',
    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: getDeclension(
          tracks.length,
          singularForm,
          dualForm,
          pluralForm,
        ),
      })),
      value,
    },
  })
})

// ================================================================

router.get('/spotify-choose', function (req, res) {
  res.render('spotify-choose', {
    style: 'spotify-choose',
    data: {},
  })
})

// ================================================================

router.get('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix
  // console.log(isMix)
  res.render('spotify-create', {
    style: 'spotify-create',
    data: {
      isMix,
    },
  })
})

// ================================================================

router.post('/spotify-create', function (req, res) {
  const isMix = !!req.query.isMix

  const name = req.body.name

  if (!name) {
    return res.render('alert', {
      style: 'alert',
      title: 'Помилка',
      info: 'Порожня назва плейлиста',
      href: isMix ? `/spotify-create?isMix=true` : `/spotify-create`,
    })
  }

  const playlist = Playlist.create(name)

  if (isMix) {
    Playlist.makeMix(playlist)
  }

  // console.log(playlist)
  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

// ================================================================

router.get('/spotify-playlist', function (req, res) {
  const id = Number(req.query.id)

  const playlist = Playlist.getById(id)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      title: 'Помилка',
      info: 'Такого плейліста не знайдено',
      href: `/`,
    })
  }
  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

// ================================================================

router.get('/spotify-track-delete', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)

  const playlist = Playlist.getById(playlistId)

  // console.log(playlistId, trackId)
  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      title: 'Помилка',
      info: 'Такого плейліста не знайдено',
      href: `/spotify-playlist?id=${playlistId}`,
    })
  }
  playlist.deleteTrackById(trackId)

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

// ================================================================

router.get('/spotify-playlist-add', function (req, res) {
  const playlistId = Number(req.query.id)

  const playlist = Playlist.getById(playlistId)

  // console.log(playlistId)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      title: 'Помилка',
      info: 'Такого плейліста не знайдено',
      href: `/spotify-playlist?id=${playlistId}`,
    })
  }

  res.render('spotify-playlist-add', {
    style: 'spotify-playlist-add',
    data: {
      playlistId: playlist.id,
      tracks: Track.getList(),
      name: playlist.name,
    },
  })
})

// ================================================================

router.get('/spotify-track-add', function (req, res) {
  const playlistId = Number(req.query.playlistId)
  const trackId = Number(req.query.trackId)

  const playlist = Playlist.getById(playlistId)

  playlist.addTrack(trackId)

  // console.log('========>', playlistId, trackId, playlist)

  if (!playlist) {
    return res.render('alert', {
      style: 'alert',
      title: 'Помилка',
      info: 'Такого плейліста не знайдено',
      href: `/spotify-playlist?id=${playlistId}`,
    })
  }

  res.render('spotify-playlist', {
    style: 'spotify-playlist',
    data: {
      playlistId: playlist.id,
      tracks: playlist.tracks,
      name: playlist.name,
    },
  })
})

// ================================================================

router.get('/spotify-search', function (req, res) {
  const value = ''

  const list = Playlist.findListByValue(value)

  // console.log(value,list)
  res.render('spotify-search', {
    style: 'spotify-search',
    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: getDeclension(
          tracks.length,
          singularForm,
          dualForm,
          pluralForm,
        ),
      })),
      value,
    },
  })
})

// ================================================================

router.post('/spotify-search', function (req, res) {
  const value = req.body.value || ''

  const list = Playlist.findListByValue(value)

  console.log('==================>', value, list)
  res.render('spotify-search', {
    style: 'spotify-search',
    data: {
      list: list.map(({ tracks, ...rest }) => ({
        ...rest,
        amount: getDeclension(
          tracks.length,
          singularForm,
          dualForm,
          pluralForm,
        ),
      })),
      value,
    },
  })
})

// ================================================================

module.exports = router
