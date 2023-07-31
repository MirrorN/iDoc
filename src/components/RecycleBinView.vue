<template>
  <div>
    <el-header>
      <span>回收站</span>
    </el-header>

    <el-container>
      <el-main>
        <div v-for="dir in dirs" class="folder" @click.right.native="popDropdownlist($event)">
          <el-dropdown :ref="dropdown" trigger="click">
            <span class="el-dropdown-link">
              <el-icon>
                <More />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="restore(dir._id)">还原</el-dropdown-item>
                <el-dropdown-item @click="removeAll(dir._id)">彻底删除</el-dropdown-item>
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
import { getAll, getDeletedFiles, removeFile, restoreFile, getAncestors, delFile, renameFile } from '../request/request'
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


const dirs = ref([])
onMounted(() => {
  getDeletedFiles().then((getRes) => {
    dirs.value = getRes.data.data
    // for(let i=0; i<dirs.value.length; i++){
    //   checkDelete(dirs.value[i]._id)
    // }
  })
})

const restore = (id) => {
  restoreFile(id).then((restoreRes) => {
    if (restoreRes.data.status == '200') {
      getDeletedFiles().then((getRes) => {
        dirs.value = getRes.data.data
      })
      ElMessage.success('已还原')
    } else {
      ElMessage.error('还原失败')
    }
  })
}

const removeAll = (id) => {
  removeFile(id).then((removeRes) => {
    if (removeRes.data.status == '200') {
      getDeletedFiles().then((getRes) => {
        dirs.value = getRes.data.data
      })
      ElMessage.success('已彻底删除')
    } else {
      ElMessage.error('删除失败')
    }

  })
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