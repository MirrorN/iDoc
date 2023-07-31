/* collection结构比较简单 将schema和model都放在这里 */

import connection from './connection.js'
import mongoose from 'mongoose'


let idocSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  alterTime: { type: Date, required: true },
  isDelete: { type: Boolean, default: false },
  isAncestorDelete: { type: Boolean, default: false },
  lock: { type: Boolean, default: false },
  file: { type: String },
  parent: { type: String, default: '' },
  ancestors: { type: Array, default: [] },
}, { versionKey: false })
export let idocModel = connection.model('idoc', idocSchema, 'idoc')