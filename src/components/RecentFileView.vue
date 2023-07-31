<template>
  <div>
    <el-header>
      <span>最近修改的文件</span>
    </el-header>

    <el-container>

      <el-main>
        <div v-for="file in files" class="divfile" @dblclick="open(file._id, file.type, file.name, file.ancestors)"
          @click.right.native="popDropdownlist($event)">
          <el-image :src="getIcon(file.type)"></el-image>
          <!-- <div class="img"></div> -->
          <h3 class="filename">{{ file.name }}</h3>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import router from '../router'
import { useRoute, useRouter } from 'vue-router'
import { getRecentFiles } from '../request/request'

import mdpic from '../assets/imgs/md3.png'

const route = useRoute()
const userouter = useRouter()


const files = ref([])
onMounted(() => {
  getRecentFiles().then((getRes) => {
    files.value = getRes.data.data
    console.log(files.value)
  })
})



const getIcon = (type) => {
  if (type == 'md') {
    return mdpic
  } else {
    return mdpic
  }
}

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

}


.el-container {
  .el-main {
    display: flex;
    flex-wrap: wrap;

    .divfile {
      position: relative;
      margin: 1rem;
      height: 10rem;
      width: 7rem;

      .filename {
        font-weight: normal;
        font-size: 1rem;
        text-align: center;
        height: 1rem;
      }
    }

    .divfile:hover .el-image {
      background-color: #e4e2e2;
    }
  }

}
</style>