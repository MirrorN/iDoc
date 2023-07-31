import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import fs from 'fs'
import multer from 'multer'
import { getAll, getRecentFiles, getExist, getAncestors, addDir, addFile, renameFile, getName, saveFile, getFile, getDeletedFiles, delSelf, delChildren, delAll, removeFile, restoreFile, checkDelete, checkLock, lockFile, unLockFile } from './dboper/opers.js'

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

// 配置静态资源文件 如需迁移注意修改path
app.use('/imgs', express.static('./imgs'))
const staticPath = 'http://192.168.10.15:8092/'

// 获取所有文件/文件夹列表
app.post('/getall', (req, res) => {
  const parent = req.body.parent ? req.body.parent : "64bde8309960cdc874610281"
  if (parent.length != 24) {
    res.send({ status: '205', message: 'id错误' })
  } else {
    console.log('get all directories and files')
    try {
      getAll(parent).then((getRes) => {
        res.send({ status: '200', message: '返回文件/文件夹信息', data: getRes })
      })
    } catch (error) {
      console.log(error)
    }
  }
})

// 获取最近浏览文件
app.get('/getrecentfiles', (req, res) => {
  console.log('get recent files')
  try {
    getRecentFiles().then((getRes) => {
      res.send({ status: '200', message: '返回文件/文件夹信息', data: getRes })
    })
  } catch (error) {
    console.log(error)
  }
})

// 获取所有被标记为删除的文件
app.get('/getdeletedfiles', (req, res) => {
  console.log('get deleted files')
  try {
    getDeletedFiles().then((getRes) => {
      res.send({ status: '200', message: '返回文件/文件夹信息', data: getRes })
    })
  } catch (error) {
    console.log(error)
  }
})

// 获取某个文件/文件夹的祖先数组
app.post('/getancestors', (req, res) => {
  const id = req.body.id ? req.body.id : "64bde8309960cdc874610281"
  if (id.length != 24) {
    res.send({ status: '205', message: 'id错误' })
  } else {
    console.log('get ancestors')
    try {
      getAncestors(id).then((getRes) => {
        res.send({ status: '200', message: '返回祖先信息', data: getRes })
      })
    } catch (error) {
      console.log(error)
    }
  }
})

// 根据id获取文件/文件名
app.post('/getname', (req, res) => {
  const id = req.body.id
  if (id.length != 24) {
    res.send({ status: '205', message: 'id错误' })
  } else {
    console.log('get name')
    try {
      getName(id).then((getRes) => {
        res.send({ status: '200', message: '返回文件/文件夹信息', data: getRes })
      })
    } catch (error) {
      console.log(error)
    }
  }
})


// 添加文件夹
app.post('/adddir', (req, res) => {
  console.log('add directory')
  const name = req.body.name
  const parent = req.body.parent ? req.body.parent : "64bde8309960cdc874610281"
  const ancestors = req.body.parent ? eval(req.body.ancestors) : []
  if (parent.length != 24) {
    res.send({ status: '205', message: 'id错误' })
  } else {
    try {
      // 1. 判断当前文件夹下是否存在同名文件夹
      getExist(name, parent).then((existRes) => {
        if (existRes.length) {
          res.send({ status: '204', message: '文件名已经存在' })
          return
        } else {
          // 2. 如果不存在同名文件夹 则创建
          console.log(ancestors)
          addDir(name, parent, ancestors).then((addRes) => {
            // console.log(addRes)
            if (addRes) {
              res.send({ status: '200', message: '文件夹创建成功' })
            } else {
              res.send({ status: '205', message: '文件夹创建失败' })
            }
          })
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
})

// 添加文件
app.post('/addfile', (req, res) => {
  const name = req.body.name
  const type = req.body.type
  const file = req.body.file
  const parent = req.body.parent
  const ancestors = req.body.parent ? eval(req.body.ancestors) : []
  if (parent.length != 24) {
    res.send({ status: '205', message: 'id错误' })
  } else {
    try {
      // 1. 判断文件名是否已经存在
      getExist(name, parent).then((existRes) => {
        if (existRes.length) {
          res.send({ status: '204', message: '文件名已经存在' })
          return
        } else {
          // 2. 如果不存在同名文件夹 则创建
          addFile(name, type, file, parent, ancestors).then((addRes) => {
            // console.log(addRes)
            if (addRes) {
              res.send({ status: '200', message: '文件创建成功' })
            } else {
              res.send({ status: '205', message: '文件创建失败' })
            }
          })
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
})

// 删除文件夹
app.post('/deldir', (req, res) => {
  const id = req.body.id
  if (id.length != 24) {
    res.send({ status: '205', message: 'id错误' })
  } else {
    try {
      delSelf(id).then((delSelfRes) => {
        if (delSelfRes.modifiedCount != 1) {
          res.send({ status: '205', message: '删除失败' })
        } else {
          delChildren(id).then((delChildrenRes) => {
            res.send({ status: '200', message: '删除成功' })
          })
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

})

// 删除文件
app.post('/delfile', (req, res) => {
  const id = req.body.id
  if (id.length != 24) {
    res.send({ status: '205', message: 'id错误' })
  } else {
    try {
      delAll(id).then((delRes) => {
        if (delRes.modifiedCount != 1) {
          res.send({ status: '205', message: '删除失败' })
        } else {
          res.send({ status: '200', message: '删除成功' })

        }
      })
    } catch (error) {
      console.log(error)
    }
  }
})

// 彻底删除文件/文件夹（从数据库中删除）
app.post('/removefile', (req, res) => {
  const id = req.body.id
  if (id.length != 24) {
    res.send({ status: '205', message: 'id错误' })
  } else {
    try {
      removeFile(id).then((removeRes) => {
        console.log(removeRes)
        res.send({ status: '200', message: '移除成功' })
      })
    } catch (error) {
      console.log(error)
    }
  }
})

// 还原文件：1. 将文件夹及所有下属的文件isDelete和anscestorDelete都置为false
//          2. 获取该id的ancestor数组，并把其中所有的id isDelete和anscestorDelete都置为false
app.post('/restorefile', (req, res) => {
  const id = req.body.id
  if (id.length != 24) {
    res.send({ status: '205', message: 'id错误' })
  } else {
    try {
      restoreFile(id).then((restoreRes) => {
        console.log('restore file...')
        if (restoreRes.modifiedCount) {
          getAncestors(id).then((ansRes) => {
            // console.log(ansRes[0].ancestors)
            checkDelete(ansRes[0].ancestors).then((checkRes) => {
              res.send({ status: '200', message: '还原成功' })
            })
          })
        } else {
          res.send({ status: '205', message: '还原失败' })
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

})


// 修改文件 / 文件夹 名称
app.post('/rename', (req, res) => {
  const id = req.body.id
  const newname = req.body.newname
  const parent = req.body.parent
  if (id.length != 24 || parent.length != 24) {
    res.send({ status: '205', message: 'id错误' })
  } else {
    try {
      // 1. 判断 newname 是否已经存在
      getExist(newname, parent).then((existRes) => {
        if (existRes.length) {
          res.send({ status: "204", message: "文件名已经存在" })
        } else {
          // 2.修改
          renameFile(id, newname).then((renameRes) => {
            if (renameRes.modifiedCount == 1) {
              res.send({ status: "200", message: "文件名修改成功" })
            }
          })
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
})

// 获取文件内容
app.post('/getfile', (req, res) => {
  const { id } = req.body
  if (id.length != 24) {
    res.send({ status: '205', message: 'id错误' })
  } else {
    try {
      getFile(id).then((getRes) => {
        console.log('get file content')
        res.send({ status: '200', message: '返回文件内容', data: getRes })
      })
    } catch (error) {
      console.log(error)
    }
  }

})


// 保存文件内容
app.post('/savefile', (req, res) => {
  const { id, content } = req.body
  if (id.length != 24) {
    res.send({ status: '205', message: 'id错误' })
  } else {
    try {
      console.log('save file content')
      saveFile(id, content).then((saveRes) => {
        if (saveRes.modifiedCount != 1) {
          res.send({ status: "204", message: "文件不存在" })
        } else {
          res.send({ status: "200", message: "文件保存成功" })
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

})

// 上传图片 返回图片 url
const savepath = './imgs'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, savepath)
  },
  filename: (req, file, cb) => {
    // 防止中文乱码，需要先转为 utf-8 编码
    // const fullname = `${Date.now()}_${file.originalname}`
    const fullname = `${Date.now()}.${file.mimetype.split('/')[1]}`
    cb(null, fullname)
  }
})
function uploadimg(req, res, next) {
  const upload = multer({ storage: storage, limits: { fileSize: 50 * 1024 * 1024 } }).single('file')
  upload(req, res, (err) => {
    if (err) {
      console.log(err)
    } else {
      try {
        console.log('Img upload')
        req.body.uploadFile = req.file
        next()
      } catch (error) {
        console.log(error)
        res.send({ status: '204', message: '上传失败' })
      }
    }
  })
}
app.post('/uploadimgs', uploadimg, (req, res) => {
  const mapres = {}
  const { originalname, path } = req.body.uploadFile
  mapres[originalname] = staticPath + path

  res.send({
    message: '图片上传完成', status: '200', data: {
      errFiles: [],
      succMap: mapres
    }
  })
})

// 返回所有的图片链接
app.get('/getimgurls', (req, res) => {
  console.log('get image urls')
  fs.readdir('./imgs', (err, files) => {
    if (err) {
      res.send({ status: '205', message: '获取图片列表失败' })
    } else {
      const imgs = []
      try {
        files.forEach(file => {
          imgs.push({ filename: file, url: staticPath + 'imgs/' + file })
        })
        imgs.reverse()
        res.send({ status: '200', message: '获取图片列表成功', data: imgs })
      } catch (error) {
        console.log(error)
      }
    }
  })
})

//删除图片
app.post('/delimg', (req, res) => {
  console.log('delete img')
  const filename = req.body.filename
  fs.unlink('./imgs/' + filename, (err) => {
    if (err) {
      console.log(err)
      res.send({ status: '205', message: '删除图片失败' })
    } else {
      res.send({ status: '200', message: '图片删除成功' })
    }
  })
})

// 返回文件锁状态
app.post('/checklock', (req, res) => {
  const { id } = req.body
  if (id.length != 24) {
    res.send({ status: '205', message: 'id错误' })
  } else {
    try {
      console.log('check file lock')
      checkLock(id).then((checkRes) => {
        res.send({ status: '200', message: '获取文件锁状态成功', data: checkRes[0] })
      })
    } catch (error) {
      console.log(error)
    }
  }
})

// 文件上锁
app.post('/lockfile', (req, res) => {
  const { id } = req.body
  if (id.length != 24) {
    res.send({ status: '205', message: 'id错误' })
  } else {
    try {
      console.log('lock file')
      lockFile(id).then((lockRes) => {
        if (lockRes.modifiedCount == 1) {
          res.send({ status: '200', message: '文件锁定成功' })
        } else {
          res.send({ status: '205', message: '文件锁定失败' })
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
})

// 文件解锁
app.post('/unlockfile', (req, res) => {
  const { id } = req.body
  if (id.length != 24) {
    res.send({ status: '205', message: 'id错误' })
  } else {
    try {
      console.log('unlock file')
      unLockFile(id).then((unlockRes) => {
        if (unlockRes.modifiedCount == 1) {
          res.send({ status: '200', message: '文件解锁成功' })
        } else {
          res.send({ status: '205', message: '文件解锁失败' })
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
})

app.listen(8092, () => {
  console.log('server running ...')
})