import dbService from '../../services/dbService'
const ObjectId = require('mongodb').ObjectId

export default {
  query,
  getById,
  getByUsername,
  remove,
  update,
  add,
}

async function query(filterBy = {}) {
  try {
    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection('user')
    let users = await collection.find(criteria).toArray()

    users = users.map((user: any) => {
      delete user.password
      return user
    })
    return users
  } catch (err) {
    console.log('cannot find users', err)
    throw err
  }
}

async function getById(userId: string) {
  try {
    const collection = await dbService.getCollection('user')
    const user = await collection.findOne({ _id: ObjectId(userId) })
    user && delete user.password
    return user
  } catch (err) {
    console.log(`while finding user ${userId}`, err)
    throw err
  }
}
async function getByUsername(userName: string) {
  try {
    const collection = await dbService.getCollection('user')
    const user = await collection.findOne({ userName })
    return user
  } catch (err) {
    console.log(`while finding user ${userName}`, err)
    throw err
  }
}

async function remove(userId: string) {
  try {
    const collection = await dbService.getCollection('user')
    await collection.deleteOne({ _id: ObjectId(userId) })
  } catch (err) {
    console.log(`cannot remove user ${userId}`, err)
    throw err
  }
}

async function update(user: any) {
  try {
    const userToSave = {
      ...user,
      _id: ObjectId(user._id),
    }
    const collection = await dbService.getCollection('user')
    await collection.updateOne({ _id: userToSave._id }, { $set: userToSave })
    return userToSave
  } catch (err) {
    console.log(`cannot update user ${user._id}`, err)
    throw err
  }
}

async function add(user: any) {
  try {
    const collection = await dbService.getCollection('user')
    await collection.insertOne(user)
    return user
  } catch (err) {
    console.log('cannot insert user', err)
    throw err
  }
}

function _buildCriteria(filterBy: any) {
  const criteria = {}
  return criteria
}
