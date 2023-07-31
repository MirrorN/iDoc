import connection from './dboper/connection.js'
import mongoose, { Schema } from 'mongoose'

const ObjectId = Schema.ObjectId


let idocSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  alterTime: { type: Date, required: true },
  isDelete: { type: Boolean, default: false },
  docType: { type: String },
  file: { type: String },
  parent: { type: String, default: '' },
  ancestors: { type: Array, default: [] },
}, { versionKey: false })
let idocModel = connection.model('idoc', idocSchema, 'idoc')

idocModel.create({
  name: '测试文档A',
  type: 'file',
  alterTime: new Date(),
  docType: 'md',
  file: 'some content.',
  parent: '64b8933e5fa6236f1edfb512',
  ancestors: ['64b8933e5fa6236f1edfb512']
}).then((res) => {
  console.log(res)
})


// 插入一个文档
/* tabaModel.create({
  dirname: '测试文件夹san',
  createTime: new Date(),
  isDelete: false,
  files: [
    {
      filename: 'FileA',
      createTime: new Date(),
      lastAlter: new Date(),
      type: 'md',
      content: 'something',
      isDelete: false,
    }
  ]
}).then((res) => {
  console.log(res)
}) */

// const fileObj = {
//   filename: 'FileC',
//   createTime: new Date(),
//   lastAlter: new Date(),
//   type: 'md',
//   content: 'something CCCCCCCC',
//   isDelete: false,
// }

// tabaModel.updateMany({ dirname: '测试文件夹san' }, { $addToSet: { files: fileObj } }).then((res) => {
//   console.log(res)
// })
