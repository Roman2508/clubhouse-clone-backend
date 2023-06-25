import express from 'express'
import { Room } from '../models'

export const getAllRooms = async (req: express.Request, res: express.Response) => {
  try {
    const rooms = await Room.findAll()
    res.status(200).json(rooms)
  } catch (error) {
    res.status(500).json({ message: 'Не вдалось отримати комнати' })
    console.log(error)
  }
}

export const getRoomById = async (req: express.Request, res: express.Response) => {
  try {
    const roomId = req.params.id

    if (isNaN(Number(roomId))) {
      return res.status(400).json({ message: 'Не вірний ІД комнати' })
    }

    const room = await Room.findByPk(req.params.id)

    if (!room) {
      return res.status(404).json({ message: 'Комната не знайдена' })
    }

    res.json(room)
  } catch (error) {
    res.status(500).json({ message: 'Не вдалось отримати комнату' })
    console.log(error)
  }
}

export const createRoom = async (req: express.Request, res: express.Response) => {
  try {
    if (!req.body.title || !req.body.type) {
      return res.status(400).json({ message: 'Вкажіть назву та тип комнати' })
    }

    const newRoom = await Room.create({ title: req.body.title, type: req.body.type })

    res.json(newRoom)
  } catch (error) {
    res.status(500).json({ message: 'Не вдалось створити комнату' })
    console.log(error)
  }
}

export const removeRoom = async (req: express.Request, res: express.Response) => {
  try {
    const roomId = req.params.id

    if (isNaN(Number(roomId))) {
      return res.status(400).json({ message: 'Не вірний ІД комнати' })
    }

    await Room.destroy({ where: { id: roomId } })

    res.json(roomId)
  } catch (error) {
    res.status(500).json({ message: 'Не вдалось видалити комнату' })
    console.log(error)
  }
}

// npx sequelize-cli model:generate --name Room --attributes title:string,speakers:json,listenersCount:integer
