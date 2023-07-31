<template>
  <div>
    <el-header>
      <el-breadcrumb separator=">">
        <el-breadcrumb-item v-for="item in ancestors" :to="{ path: '/', query: { location: item } }">{{
          store.pathsMap[item]
        }}</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 按钮 -->
      <div>
        <el-button type=primary plain @click="showCreateDialog('dir')">
          <el-icon>
            <Plus />
          </el-icon>
          新建文件夹
        </el-button>
        <el-button type=primary plain @click="showCreateDialog('md')">
          <el-icon>
            <Plus />
          </el-icon>
          新建文档
        </el-button>
        <!-- <el-button type=primary disabled plain @click="xlsDialogVisible = true">
          <el-icon>
            <Plus />
          </el-icon>
          新建表格
        </el-button> -->
      </div>

      <el-dialog v-model="dialogVisible" class="dias" :title="diaTitle" width="30%">
        <el-input v-model="input" :placeholder="diaText" />
        <template #footer>
          <span class="dialog-footer">
            <el-button class="btn" @click="dialogVisible = false">取消</el-button>
            <el-button class="btn" type="primary" @click="createFile()">
              添加
            </el-button>
          </span>
        </template>
      </el-dialog>

    </el-header>

    <el-container>
      <el-dialog v-model="renameDialogVisible" class="dias" title="文件/文件夹重命名" width="30%">
        <el-form-item label="原文件/文件夹名" style="margin-bottom:0.5rem">
          <!-- <span>原文件/文件夹名</span> -->
          <el-input v-model="originalName" disabled />
        </el-form-item>

        <el-form-item label="新文件/文件夹名">
          <!-- <span>新文件/文件夹名</span> -->
          <el-input v-model="newName" placeholder="不可使用空格,注意不要与原名相同" />
        </el-form-item>

        <template #footer>
          <span class="dialog-footer">
            <el-button class="btn" @click="dialogVisible = false">取消</el-button>
            <el-button class="btn" type="primary" @click="fileRename()">
              确认重命名
            </el-button>
          </span>
        </template>
      </el-dialog>
      <el-main>
        <div v-for="dir in dirs" class="folder" @dblclick="open(dir._id, dir.type, dir.name, dir.ancestors)"
          @click.right.native="popDropdownlist($event)">
          <el-dropdown :ref="dropdown" trigger="click">
            <span class="el-dropdown-link">
              <el-icon>
                <More />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="showRenameDialog(dir._id, dir.name)">重命名</el-dropdown-item>
                <el-dropdown-item @click="deleteFile(dir._id, dir.type)">删除</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-image :src="getIcon(dir.type)"></el-image>
          <!-- <div class="img"></div> -->
          <h3 class="filename">{{ dir.name }}</h3>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { Plus, More, Back } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import router from '../router'
import { useRoute, useRouter } from 'vue-router'
import { getAll, getAncestors, delFile, renameFile, delDir } from '../request/request'
import { useStore } from '../store/index'
import { addDir, addFile } from '../request/request'
import dirpic from '../assets/imgs/folder3.png'
import mdpic from '../assets/imgs/md3.png'

const route = useRoute()
const userouter = useRouter()
const dialogVisible = ref(false)
const input = ref('')
const dropdown = ref()
const store = useStore()
let ancestors = ref([])
let diaTitle = ref('')
let diaText = ref('')
let fileType = ref('dir')

// 重命名所需
const renameDialogVisible = ref(false)
let originalName = ref('')
let originalId = ref('')
let newName = ref('')


const dirs = ref([])
onMounted(() => {
  // 防止首次渲染的时候没有location参数
  if (!route.query.location) {
    route.query.location = '64bde8309960cdc874610281'
  }
  getAll(route.query.location).then((res) => {
    dirs.value = res.data.data
    // console.log(dirs.value)
    for (let i = 0; i < dirs.value.length; i++) {
      const tmpid = dirs.value[i]._id
      const tmpname = dirs.value[i].name
      // store.pathsMap[tmpid] = tmpname
      store.updatePathsMap(tmpid, tmpname)
    }

    getAncestors(route.query.location).then((res) => {
      ancestors.value = res.data.data[0].ancestors
      ancestors.value.push(route.query.location)
    })

    // if (route.query.location) {
    //   getAncestors(route.query.location).then((res) => {
    //     ancestors.value = res.data.data[0].ancestors
    //     ancestors.value.push(route.query.location)
    //   })
    // } else {
    //   ancestors.value.push('64bde8309960cdc874610281')
    // }

  })
})

const showCreateDialog = (type) => {
  dialogVisible.value = true
  if (type == 'dir') {
    diaTitle.value = '创建文件夹'
    diaText.value = '输入文件夹名,注意不要含有空格'
    fileType.value = 'dir'
  } else if (type == 'md') {
    diaTitle.value = '创建Markdown文件'
    diaText.value = '输入文件名,注意不要含有空格'
    fileType.value = 'md'
  }
  // 表格处理 ...
}

const createFile = () => {
  if (fileType.value == 'dir') {
    // 1. 非空
    if (input.value == '') {
      ElMessage.error('请输入非空文件夹名')
    } else {
      dialogVisible.value = false
      // 2. 正则验证
      const reg = /^\S*$/
      // const reg = /^((?!\\|\/|:|\*|\?|<|>|\||'|%|@|#|&|\$|\^|&|\*).){1,8}$/  -- 测试特殊字符
      if (!reg.test(input.value)) {
        ElMessage.error('文件夹名不能含有空格')
      } else {
        // 3. 提交表单
        addDir(input.value, route.query.location, ancestors.value).then((res) => {
          console.log(res)
          if (res.data.status != '200') {
            ElMessage.error("创建失败,请检查文件夹名是否重复")
          } else {
            ElMessage.success("创建成功")
            // 4. 刷新页面file列表
            getAll(route.query.location).then((getRes) => {
              dirs.value = getRes.data.data
              for (let i = 0; i < dirs.value.length; i++) {
                const tmpid = dirs.value[i]._id
                const tmpname = dirs.value[i].name
                // store.pathsMap[tmpid] = tmpname
                store.updatePathsMap(tmpid, tmpname)
              }
            })
          }
        })
        // 清空输入
        input.value = ''
      }
    }
  } else if (fileType.value == 'md') {
    // md 文件创建
    // 1. 文件名非空
    if (input.value == '') {
      ElMessage.error('请输入非空文件名')
    } else {
      // 2. 正则验证
      const reg = /^\S*$/
      if (!reg.test(input.value)) {
        ElMessage.error('文件名中不能含有空格')
      } else {
        dialogVisible.value = false
        // 3. 提交表单
        const file = '新文档！'
        addFile(input.value, fileType.value, file, route.query.location, ancestors.value).then((res) => {
          console.log(res)
          if (res.data.status != '200') {
            ElMessage.error("创建失败,请检查文件名是否重复")
          } else {
            ElMessage.success("创建成功")
            // 4. 刷新页面file列表
            getAll(route.query.location).then((getRes) => {
              dirs.value = getRes.data.data
            })
          }
        })
        // 清空输入
        input.value = ''
      }
    }
  }
}

const deleteFile = (id, type) => {
  if (type == 'dir') {
    delDir(id).then((delRes) => {
      if (delRes.data.status != '200') {
        ElMessage.error('删除失败,请重试')
      } else {
        getAll(route.query.location).then((getRes) => {
          dirs.value = getRes.data.data
        })
        getAll(route.query.location).then((getRes) => {
          dirs.value = getRes.data.data
        })
        ElMessage.success('删除成功')
      }
    })
  } else {
    delFile(id).then((delRes) => {
      if (delRes.data.status != '200') {
        ElMessage.error('删除失败,请重试')
      } else {
        getAll(route.query.location).then((getRes) => {
          dirs.value = getRes.data.data
        })
        ElMessage.success('删除成功')
      }
    })
  }
}

const showRenameDialog = (id, name) => {
  originalId.value = id
  originalName.value = name
  renameDialogVisible.value = true
}

const fileRename = () => {
  if (!newName.value) {
    ElMessage.error('文件/文件夹名不能为空')
  } else {
    // 2. 正则验证
    const reg = /^\S*$/
    if (!reg.test(newName.value)) {
      ElMessage.error('文件/文件夹名中不能含有空格')
    } else {
      renameDialogVisible.value = false
      const tmpNewname = newName.value
      // 3. 提交表单
      renameFile(originalId.value, route.query.location, newName.value).then((renameRes) => {
        // 返回结果
        if (renameRes.data.status != '200') {
          ElMessage.error('文件/文件名修改失败,请重试')
        } else {
          ElMessage.success('文件/文件名修改成功')
          // store.pathsMap[originalId.value] = tmpNewname
          store.updatePathsMap(originalId.value, tmpNewname)
          // 4. 刷新页面file列表
          getAll(route.query.location).then((getRes) => {
            dirs.value = getRes.data.data
          })
        }
      })
      // 清空输入
      newName.value = ''
    }
  }
}


const getIcon = (type) => {
  if (type == 'dir') {
    return dirpic
  } else {
    return mdpic
  }
}

/* 需要考虑如何使用右键方式弹出菜单 */
const popDropdownlist = (e) => {
  console.log('right click')
  e.preventDefault()
  // dropdown.visible = true
  // ... 如何处理右键弹出菜单的问题？ 使用 v-for 如何动态添加 ref 
  // dropdown.value.handleOpen()
}


const open = (id, type, name, ancestors) => {
  if (type == 'dir') {
    userouter.push({ path: '/', query: { location: id } })
  } else if (type == 'md') {
    userouter.push({ path: '/vditor', query: { id: id, name: name } })
  } else if (type == 'xls') {
    // 打开表格编辑
  }

}
</script>
<style scoped>
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* background-color: #eb8484; */
  height: 3.5rem;
  /* line-height: 3.5rem; */

  .title {
    font-size: 1.2rem;
  }

  .el-button {
    padding: 1rem;
    /* margin-right: 1rem; */
    font-size: 1rem;

    .el-icon {
      margin-right: 0.5rem;
    }
  }


  /* .el-input {
    margin-top: 0.5rem;
  } */

  .btn {
    margin-right: 0;
  }


}

/* .btn {
  background-color: #643737;
} */

.nav-btn {
  font-size: 0.9rem;
  border: 0;
  background-color: transparent;
  cursor: pointer;
}

.nav-btn:hover {
  color: rgb(170, 170, 253);
}

.sep {
  padding: 0 0.5rem;
  color: #ccc;
}

.el-container {
  .el-main {
    display: flex;
    flex-wrap: wrap;

    .folder {
      position: relative;
      margin: 1rem;
      height: 10rem;
      width: 7rem;

      .img {
        /* border: 1px solid black; */
        height: 7rem;
        border-radius: 0.5rem;
        background: url(../assets/imgs/folder3.png);
        background-size: cover;
      }

      .filename {
        font-weight: normal;
        font-size: 1rem;
        text-align: center;
        height: 1rem;
      }

      .el-dropdown {
        position: absolute;
        top: 0;
        right: 0.5rem;
        z-index: 10;
        font-size: 1.5rem;
        /* background-color: #b98585; */
      }
    }

    .folder:hover .el-image {
      background-color: #e4e2e2;
    }
  }

}
</style>