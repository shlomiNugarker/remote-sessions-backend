import dbService from '../../services/dbService'
const ObjectId = require('mongodb').ObjectId

export default {
  getById,
  query,
}

async function query() {
  try {
    const collection = await dbService.getCollection('code_block')
    var codeBlocks = await collection.find({}).toArray()
    return codeBlocks
  } catch (err) {
    console.log('cannot find code blocks', err)
    throw err
  }
}

async function getById(codeId: string) {
  try {
    const collection = await dbService.getCollection('code_block')
    const codeBlock = await collection.findOne({ _id: ObjectId(codeId) })
    return codeBlock
  } catch (err) {
    console.log(`Error while finding code id: ${codeId} `, err)
    throw err
  }
}
