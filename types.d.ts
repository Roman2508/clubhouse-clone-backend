import { UserData } from './../frontend/src/pages/index'

declare global {
  namespace Express {
    interface User extends UserData {}
  }
}
