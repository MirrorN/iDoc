<!-- 文件上传组件 -->
<template>
  <el-upload class="upload-demo" drag action="#" accept="image/*" :http-request="uploadAction">
    <el-icon class="el-icon--upload">
      <UploadFilled />
    </el-icon>
    <div class="el-upload__text">
      拖拽文件到这里 或 <em>点击上传</em>
    </div>
    <template #tip>
      <div class="el-upload__tip">
        Image size &lt; 10MB
      </div>
    </template>
  </el-upload>

  <el-form-item label="图片 URL">
    <el-input v-model="imgurl" readonly ref="inputRef"></el-input>
  </el-form-item>

  <el-image-viewer v-if="showViewer" :url-list="previewList" @close="closeImgViewer" hide-on-click-modal
    close-on-press-escape></el-image-viewer>

  <el-table :data="currentData" stripe>
    <el-table-column type="index" label="序号" :index="(currentPage - 1) * pageSize + 1" width="180" />
    <!-- <el-table-column prop="date" label="Date" width="180" /> -->
    <el-table-column label="图片" align="center" width="180">
      <template #default="rowdata">
        <el-image :src="rowdata.row.url"></el-image>
      </template>
    </el-table-column>
    <el-table-column prop="url" label="URL" align="center" />
    <el-table-column label="操作" align="center">
      <template #default="rowdata">
        <el-button type="primary" plain @click="previewImg(rowdata.row.url)">预览</el-button>
        <el-button type="danger" plain @click="deleteImg(rowdata.row.filename)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-pagination background layout="prev, pager, next" v-model:current-page="currentPage" :total="tableData.length"
    v-model:page-size="pageSize" />
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { UploadFilled } from "@element-plus/icons-vue"
import { ElMessage } from 'element-plus'
import { uploadFile, getImgurls, delImg } from '../request/request.js'

const imgurl = ref('')
const inputRef = ref()
const currentPage = ref(1)
const pageSize = ref(7)
const tableData = ref([])
const showViewer = ref(false)
const previewList = ref([])

onMounted(() => {
  getImgurls().then((getRes) => {
    tableData.value = getRes.data.data
  })
})

const currentData = computed(() => {
  if (!tableData.value.length) {
    return null
  }
  return tableData.value.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
})

const uploadAction = (fileobj) => {
  let fd = new FormData()
  if (fileobj.file.size > 10 * 1024 * 1024) {
    ElMessage.error('文件大于10MB!')
  } else {
    fd.append("file", fileobj.file)
    console.log(fileobj.file)
    uploadFile(fd).then((res) => {
      imgurl.value = res.data.data.succMap[fileobj.file.name]
      ElMessage.success('上传成功！')
      getImgurls().then((getRes) => {
        tableData.value = getRes.data.data
      })
    })
  }
}

const previewImg = (url) => {
  showViewer.value = true
  previewList.value = [url]
}

const closeImgViewer = () => {
  showViewer.value = false
}

const deleteImg = (filename) => {
  delImg(filename).then((delRes) => {
    if (delRes.status == '200') {
      ElMessage.success('删除图片完成')
      getImgurls().then((getRes) => {
        tableData.value = getRes.data.data
      })
    } else {
      ElMessage.error('删除图片失败')
    }
  })
}

</script>
<style scoped>
.upload-demo {
  margin: 2rem 2rem 0 2rem;
}

.el-form-item {
  margin: 0 2rem
}

.el-table {
  width: 96%;
  margin: 2rem;
}

.el-image {
  height: 2rem;
}

.el-pagination {
  justify-content: center;
  margin: 1rem auto;
}
</style>