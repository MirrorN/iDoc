/* 返回数据库连接 */

import mongoose from "mongoose"

const dburl = 'mongodb://192.168.10.15:27017/testdb'
const conn = mongoose.createConnection(dburl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

conn.on('open', () => {
  console.log('connection...')
})

conn.on('err', (err) => {
  console.log(err)
})

export default conn