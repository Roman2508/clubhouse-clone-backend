import express from 'express'
import { Code, User } from '../models'
import { createJwtToken } from '../utils/createJwtToken'

type UserData = {
  id: number
  fullName: string
  avatarUrl: string
  isActive: number
  userName: string
  phone: string
  token?: string | undefined
}

export const getMe = async (req: express.Request, res: express.Response) => {
  try {
    if (!req.user?.id) {
      return res.status(404).json({ message: 'Не вдалось знайти користувача' })
    }

    const user = await User.findOne({ where: { id: req.user.id } })

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Get me error' })
  }
}

export const getUserById = async (req: express.Request, res: express.Response) => {
  try {
    const user = await User.findOne({ where: { id: req.params.id } })

    const token = createJwtToken(user)

    res.json({ ...user, token })
  } catch (error) {
    res.status(500).json({ message: 'Помилка при отриманні користувача' })
  }
}

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const user = await User.findOne({ where: { userName: req.body.userName, phone: req.body.phone } })

    if (!user) {
      return res.status(404).json({ message: 'Логін або пароль не правильний' })
    }

    const token = createJwtToken(user)

    res.json({ ...user, token })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Не вдалось авторизуватись' })
  }
}

export const authCallback = async (req: express.Request, res: express.Response) => {
  res.send(`<script>window.opener.postMessage('${JSON.stringify(req.user)}', '*');window.close();</script>`)
}

export const activate = async (req: express.Request, res: express.Response) => {
  try {
    if (req.user) {
      // @ts-ignore
      const userId = req.user.id
      const smsCode = req.body.code
      const user = req.body.user

      if (!smsCode) {
        return res.status(400).json({ message: 'Введіть код активації' })
      }

      // Шукаю в базі код
      const findCode = await Code.findOne({ where: { code: smsCode, user_id: userId } })

      // Якщо код знайдений - видаляю його
      if (findCode) {
        await Code.destroy({
          where: { code: smsCode, user_id: userId },
        })

        // Оновлюю користувача
        await User.update({ ...user, isActive: 1 }, { where: { id: userId } })

        res.status(201).json({ message: 'Акаунт активовано' })
      } else {
        res.status(404).json({ message: 'Код не знайдено' })
      }
    }
  } catch (error) {
    res.status(500).json({ message: 'Помилка при активації акаунта' })
  }
}

export const sendSMS = async (req: express.Request, res: express.Response) => {
  const user = req.user as UserData

  const phone = req.query.phone
  const userId = user.id
  const smsCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000

  if (!phone) {
    return res.status(400).json({ message: 'Номер телефона не вказаний' })
  }

  try {
    // await Axios.get(`https://sms.ru/sms/send?api_id=${process.env.SMS_API_KEY}&to=79365296063&msg=${smsCode}`)

    const findedCode = await Code.findOne({ where: { user_id: userId } })

    if (findedCode) {
      res.status(400).json({ message: 'Код вже був відправлений' })
    }

    if (!findedCode) {
      await Code.create({
        code: smsCode,
        user_id: userId,
      })

      await User.update({ phone: phone }, { where: { id: userId } })

      res.status(201).json({ message: 'success' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Sending SMS error' })
  }
}
