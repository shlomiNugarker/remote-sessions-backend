import bcrypt from 'bcrypt'
import userService from '../user/userService'

export default {
  signup,
  login,
}

async function login(userName: string, password: string) {
  const user = await userService.getByUsername(userName)
  if (!user) return Promise.reject('Invalid userName or password')
  const match = await bcrypt.compare(password, user.password)
  if (!match) return Promise.reject('Invalid userName or password')
  delete user.password
  return user
}

async function signup(userName: string, password: string, fullName: string) {
  const saltRounds = 10
  if (!userName || !password || !fullName)
    return Promise.reject('fullName, userName and password are required!')

  const hash = await bcrypt.hash(password, saltRounds)
  return userService.add({ userName, password: hash, fullName })
}
