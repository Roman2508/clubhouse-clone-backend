import jwt from 'jsonwebtoken'
import { UserData } from './../../frontend/src/pages/index'

export const createJwtToken = (user: UserData): string => {
  const token = jwt.sign(
    {
      data: user,
    },
    process.env.JWT_SECRET_KEY || '',
    {
      expiresIn: process.env.JWT_MAX_AGE,
      algorithm: 'HS256',
    },
  )

  return token
}
