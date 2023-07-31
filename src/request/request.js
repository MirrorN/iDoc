import axios from 'axios'

const baseurl = 'http://192.168.10.15:8092'

export const getAll = (parent) => {
  return axios.post(
    baseurl + '/getall',
    {
      parent: parent,
    }
  )
}

export const getRecentFiles = () => {
  return axios.get(
    baseurl + '/getrecentfiles'
  )
}

export const getDeletedFiles = () => {
  return axios.get(
    baseurl + '/getdeletedfiles'
  )
}

export const getAncestors = (id) => {
  return axios.post(
    baseurl + '/getancestors',
    {
      id: id,
    }
  )
}

export const addDir = (name, parent, ancestors) => {
  return axios.post(
    baseurl + '/adddir',
    {
      name: name,
      parent: parent,
      ancestors: ancestors
    }
  )
}

export const addFile = (name, type, file, parent, ancestors) => {
  return axios.post(
    baseurl + '/addfile',
    {
      name: name,
      type: type,
      file: file,
      parent: parent,
      ancestors: ancestors
    }
  )
}

export const delDir = (id) => {
  return axios.post(
    baseurl + '/deldir',
    {
      id: id
    }
  )
}

export const delFile = (id) => {
  return axios.post(
    baseurl + '/delfile',
    {
      id: id
    }
  )
}

export const removeFile = (id) => {
  return axios.post(
    baseurl + '/removefile',
    {
      id: id
    }
  )
}

export const restoreFile = (id) => {
  return axios.post(
    baseurl + '/restorefile',
    {
      id: id
    }
  )
}

export const renameFile = (id, parent, newname) => {
  return axios.post(
    baseurl + '/rename',
    {
      id: id,
      parent: parent,
      newname: newname
    }
  )
}

export const getFile = (id) => {
  return axios.post(
    baseurl + '/getfile',
    {
      id: id
    }
  )
}

export const saveFile = (id, content) => {
  return axios.post(
    baseurl + '/savefile',
    {
      id: id,
      content: content
    }
  )
}

// 上传图片文件
export const uploadFile = (fd) => {
  return axios.post(
    baseurl + '/uploadimgs',
    fd
  )
}

// 获取图片列表
export const getImgurls = () => {
  return axios.get(
    baseurl + '/getimgurls'
  )
}

//删除图片
export const delImg = (filename) => {
  return axios.post(
    baseurl + '/delimg',
    {
      filename: filename
    }
  )
}

//检查文件锁定状态
export const getLockStatus = (id) => {
  return axios.post(
    baseurl + '/checklock',
    {
      id: id
    }
  )
}

// 锁定文件
export const lockFile = (id) => {
  return axios.post(
    baseurl + '/lockfile',
    {
      id: id
    }
  )
}
// 解锁文件
export const unlockFile = (id) => {
  return axios.post(
    baseurl + '/unlockfile',
    {
      id: id
    }
  )
}