import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

import cors from 'cors'
import session from 'express-session'
import { uploader } from './core/uploader'
import { passport } from './core/passport'
import * as authController from './controllers/authControllse'
import * as uploadController from './controllers/uploadController'
import * as roomsControllse from './controllers/roomController'

const app = express()

app.use(cors())
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: 'bla bla bla',
  })
)
app.use(express.json())
app.use(passport.initialize())
// app.use(passport.session())

app.get('/', (req, res) => res.send('<h1>Hello</h1>'))

app.get('/auth/github', passport.authenticate('github'))
app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  authController.authCallback
)

app.get('/auth/me', passport.authenticate('jwt', { session: false }), authController.getMe)

app.get('/auth/sms', passport.authenticate('jwt', { session: false }), authController.sendSMS)
app.get('/auth/sms/activate', passport.authenticate('jwt', { session: false }), authController.activate)

app.get('/user/:id', authController.getUserById)
app.post('/user/login', authController.login)

app.post('/upload', uploader.single('photo'), uploadController.upload)

app.get('/rooms', passport.authenticate('jwt', { session: false }), roomsControllse.getAllRooms)
app.post('/rooms', passport.authenticate('jwt', { session: false }), roomsControllse.createRoom)
app.get('/rooms/:id', passport.authenticate('jwt', { session: false }), roomsControllse.getRoomById)
app.delete('/rooms/:id', passport.authenticate('jwt', { session: false }), roomsControllse.removeRoom)

app.listen(3001, () => {
  console.log('SERVER RUNNED!')
})
