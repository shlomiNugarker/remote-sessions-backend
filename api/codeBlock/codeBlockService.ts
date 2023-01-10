import dbService from '../../services/dbService'
const ObjectId = require('mongodb').ObjectId

export default {
  getById,
  queryIds,
  update,
  add,
}

async function queryIds() {
  try {
    const collection = await dbService.getCollection('code_block')
    const projection = { _id: 1, title: 1 }
    const codeBlocks = await collection.find({}).project(projection).toArray()
    return codeBlocks
  } catch (err) {
    // console.log('cannot find code blocks', err)
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

async function update(codeBlock: any) {
  try {
    const id = new ObjectId(codeBlock._id)
    delete codeBlock._id
    const collection = await dbService.getCollection('code_block')
    await collection.updateOne({ _id: id }, { $set: { ...codeBlock } })
    const savedCodeBlock = { ...codeBlock, _id: id }
    return savedCodeBlock
  } catch (err) {
    // console.log(`Error while update codeBlock: ${codeBlock} `, err)
    throw err
  }
}

async function add(codeBlock: any) {
  try {
    const codeBlockToAdd = { ...codeBlock }
    const collection = await dbService.getCollection('code_block')
    await collection.insertOne(codeBlockToAdd)
    return codeBlockToAdd
  } catch (err) {
    // console.log(`Error while add codeBlock: ${codeBlock} `, err)
    throw err
  }
}
