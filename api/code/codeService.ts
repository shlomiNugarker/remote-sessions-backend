import dbService from '../../services/dbService'
const ObjectId = require('mongodb').ObjectId

export default {
  getById,
}

async function getById(codeId: string) {
  try {
    const collection = await dbService.getCollection('code')
    const user = await collection.findOne({ _id: ObjectId(codeId) })
    delete user.password
    return user
  } catch (err) {
    console.log(`Error while finding code id: ${codeId} `, err)
    throw err
  }
}
