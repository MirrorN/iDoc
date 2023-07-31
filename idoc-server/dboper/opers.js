/* 数据库操作 */

import { ObjectId } from 'mongodb'
import { idocModel } from './models.js'

/* 
  获取所有未被标记未删除的文件/文件夹
  @param parent{String}
  @returns {Promise[document]}
*/
export const getAll = (parent = "") => {
  return idocModel.find({ parent: parent, isDelete: false }, { files: 0 }).sort({ type: 1 })
}

/* 
  获取最近修改过的前5个md文档 (后期添加文档类型后需要修改)
  @returns {Promise[document]}
*/
export const getRecentFiles = () => {
  return idocModel.find({ type: 'md', isAncestorDelete: false }, { files: 0 }).sort({ alterTime: -1 }).limit(5)
}

/* 
  返回所有标记为删除的文件/文件夹
  @returns {Promise[document]}
*/
export const getDeletedFiles = () => {
  return idocModel.find({ isDelete: true }, { files: 0 }).sort({ type: 1 })
}

/* 
  判断同一parent下是否存在指定文件名的文件/文件夹，如有返回document列表反之则返回空
  @param name{String}
  @param parent{String/ObjectID}
  @returns {Promise[document]}
*/
export const getExist = (name, parent = "") => {
  return idocModel.find({ parent: parent, name: name, isDelete: false })
}

/* 
  返回文件名
  @param id {String/ObjectID}
  @returns {Promise[{_id, name}]}
*/
export const getName = (id) => {
  return idocModel.find({ _id: id }, { name: 1 })
}


/* 
  返回祖先数组
  @param parent{String/ObjectID}
  @returns {Promise[{_id, ancestors}]}
*/
export const getAncestors = (parent = "") => {
  return idocModel.find({ _id: parent }, { ancestors: 1 })
}

/* 
  添加文件夹
  @param name{String}
  @param parent{String/ObjectID}
  @param ancestors{list}
*/
export const addDir = (name, parent = "", ancestors = []) => {
  // let tmp = []
  // for (let i = 0; i < ancestors.length; i++) {
  //   tmp.push(ancestors[i])
  // }
  return idocModel.create({
    name: name,
    type: 'dir',
    alterTime: new Date(),
    parent: parent,
    ancestors: ancestors
  })
}


/* 
  添加文档(之后如果需要增加文档类型，需修改)
  @param name{String}
  @param type{String('md')}
  @param parent{String/ObjectID}
  @param ancestors{list}
  @returns {Promise(document)}
*/
export const addFile = (name, type, file, parent, ancestors) => {
  // let tmp = []
  // for (let i = 0; i < ancestors.length; i++) {
  //   tmp.push(ancestors[i])
  // }
  // tmp.push(parent)
  return idocModel.create({
    name: name,
    type: type,
    alterTime: new Date(),
    file: file,
    parent: parent,
    ancestors: ancestors
  })
}




/* 
  文件删除通过将文件的删除标志置为true实现，如果彻底删除则是删除文件
  将自身isDelete置为true，所有后代isAncestorDelete置为true
  如果删除文件夹 需要执行 delSelf 和 delChildren
  删除文件需要同时将两个标志置为true 使用delAll()方法
*/

/* 
  删除文件夹-isDelete标志为true(用于回收站显示)
  @param id{String/ObjectID}
  @returns {Promise{modifiedCount}}
*/
export const delSelf = (id) => {
  return idocModel.updateMany({ _id: id }, { isDelete: true })
}

/* 
  删除文件夹-isAnscetorDelete标志为true(用于最近文件显示)
  @param id{String/ObjectID}
  @returns {Promise{modifiedCount}}
*/
export const delChildren = (id) => {
  return idocModel.updateMany({ ancestors: { $elemMatch: { $eq: id } } }, { isAncestorDelete: true })
}

/* 
  删除文件-isDelete和isAncestorDelete都置为true
  @param id{String/ObjectID}
  @returns {Promise{modifiedCount}}
*/
export const delAll = (id) => {
  return idocModel.updateMany({ _id: id }, { isDelete: true, isAncestorDelete: true })
}

/* 
  彻底删除（从数据库中删除）
  @param id{String/ObjectID}
  @returns {Promise{deletedCount}}
*/
export const removeFile = (id) => {
  return idocModel.deleteMany({ $or: [{ _id: id }, { ancestors: { $elemMatch: { $eq: id } } }] })
}


/* 
  文件/文件夹还原 将文件/文件夹所有的后代的删除标志全置为false
  @param id{Stromg/ObjectID}
  @returns @returns {Promise{modifiedCount}}
*/
export const restoreFile = (id) => {
  return idocModel.updateMany({ $or: [{ _id: id }, { ancestors: { $elemMatch: { $eq: id } } }] }, { isDelete: false, isAncestorDelete: false })
}

/* 
  还原文件/文件夹 将文件/文件夹所有的祖先删除标志全部标志为false
  @param ids{list{String/ObjectID}}
  @returns {Promise{modifiedCount}}
*/
export const checkDelete = (ids) => {
  return idocModel.updateMany({ _id: ids }, { isDelete: false, isAncestorDelete: false })
}

/* 
  重命名 文件夹或文件都可以使用
  @param id{list{String/ObjectID}}
  @param newname{String}
  @returns {Promise{modifiedCount}}
*/
export const renameFile = (id, newname) => {
  return idocModel.updateMany({ _id: id }, { name: newname, alterTime: new Date() })
}


/* 
  获取文件内容
  @param id{String/ObjectID}
  @returns {Promise[document]}
*/
export const getFile = (id) => {
  return idocModel.find({ _id: id }, { file: 1 })
}

/* 
  保存文件内容
  @param id{String/ObjectID}
  @param content{String}
  @returns {Promise{modifiedCount}}
*/
export const saveFile = (id, content) => {
  return idocModel.updateMany({ _id: id }, { file: content, alterTime: new Date() })
}


/* 
  检查文件是否上锁
  @param id{String/ObjectID}
  @returns {Promise[document]}
*/
export const checkLock = (id) => {
  return idocModel.find({ _id: id }, { lock: 1 })
}

/* 
  文件上锁
  @param id{String/ObjectID}
  @param content{String}
  @returns {Promise{modifiedCount}}
*/
export const lockFile = (id) => {
  return idocModel.updateMany({ _id: id }, { lock: true })
}

/* 
  文件解锁
  @param id{String/ObjectID}
  @param content{String}
  @returns {Promise{modifiedCount}}
*/
export const unLockFile = (id) => {
  return idocModel.updateMany({ _id: id }, { lock: false })
}