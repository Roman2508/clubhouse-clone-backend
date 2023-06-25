import passport from 'passport'
import { Strategy as GithubStrategy } from 'passport-github2'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
// @ts-ignore
import { User } from '../models'
import { createJwtToken } from '../utils/createJwtToken'
import { UserData } from '../../frontend/src/pages'

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY,
}

passport.use(
  'jwt',
  new JwtStrategy(opts, (jwt_payload, done) => {
    done(null, jwt_payload.data)
  })
)

passport.use(
  'github',
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      callbackURL: 'http://localhost:3001/auth/github/callback',
    },
    async (accessToken: unknown, refreshToken: unknown, profile, done) => {
      try {
        let userData: UserData = {} as UserData

        const data = {
          fullName: profile.displayName,
          userName: profile.username,
          avatarUrl: profile.photos[0].value,
          isActive: 0,
          phone: '',
          token: accessToken,
        }

        // Шукаю в базі користувача
        const findedUser = await User.findOne({
          where: {
            userName: profile.username,
          },
        })

        // Якщо користувача в базі немає - створюю нового
        if (!findedUser) {
          const newUser = await User.create(data)
          userData = newUser.toJSON()
        } else {
          // Якщо користувач в базі є - конвертую в JSON
          userData = findedUser.toJSON()
        }

        done(null, {
          ...userData,
          token: createJwtToken(userData),
        })
      } catch (error) {
        done(error)
      }
    }
  )
)

passport.serializeUser((user, done) => {
  // @ts-ignore
  done(null, user.id)
})

passport.deserializeUser(async function (id, done) {
  // findByPk === findById
  User.findOne({ where: { id: id } }, function (err, user) {
    err ? done(err) : done(null, user)
  })
})

export { passport }
