<template>
  <el-header>
    <h2 class="title">{{ filename }}</h2>
    <div>
      <el-button type=primary plain :disabled="lock" @click="edit()">
        <el-icon>
          <EditPen />
        </el-icon>
        编辑
      </el-button>
      <el-button type=primary plain :disabled="!lock" @click="save()">
        <el-icon>
          <Finished />
        </el-icon>
        保存
      </el-button>

    </div>
  </el-header>
  <!-- <div class="outline" ref="outline"></div> -->
  <div v-show="!lock" id="previewDiv" ref="previewEditor" class="editor-preview"></div>

  <div v-show="lock" id="vditorDiv" ref="editor" style="margin: 0 auto"></div>
  <!-- <div id="excel"></div> -->
</template>
<script setup>
import { defineProps, ref, onMounted, onBeforeUnmount, computed } from "vue"
import { EditPen, Finished } from "@element-plus/icons-vue"
import Vditor from "vditor"
import "vditor/dist/index.css"
import { useRoute } from 'vue-router'
import { getFile, saveFile, getLockStatus, lockFile, unlockFile } from '../request/request'
import { ElMessage } from "element-plus"
// import spreadsheet from 'x-data-spreadsheet'

const editor = ref('')
const previewEditor = ref()
const outline = ref()
const contentEditor = ref("")
const lock = ref(false)
const route = useRoute()
const filename = computed(() => {
  return route.query.name
})
const content = ref('')
const isLock = ref(false)
const tmpid = route.query.id
const editTag = ref(false)


onMounted(() => {
  editTag.value = false
  window.onbeforeunload = function (event) {
    event.preventDefault()
    event.returnValue = ''
    // alert('请确保文件已经保存提交')
  }
  // route.query: {id: 'xxx', name: 'xxx'}
  console.log(route.query)

  getFile(route.query.id).then((res) => {

    // const initOutline = () => {
    //   const headingElements = []
    //   Array.from(previewEditor.value.children).forEach((item) => {
    //     if (item.tagName.length === 2 && item.tagName !== 'HR' && item.tagName.indexOf('H') === 0) {
    //       headingElements.push(item)
    //     }
    //   })

    //   let toc = []
    //   previewEditor.value.addEventListener('scroll', () => {
    //     console.log('scroll...')
    //     const scrollTop = window.scrollY
    //     toc = []
    //     headingElements.forEach((item) => {
    //       toc.push({
    //         id: item.id,
    //         offsetTop: item.offsetTop,
    //       })
    //     })

    //     const currentElement = document.querySelector('.vditor-outline__item--current')
    //     console.log(currentElement)
    //     for (let i = 0, iMax = toc.length; i < iMax; i++) {
    //       if (scrollTop < toc[i].offsetTop - 30) {
    //         if (currentElement) {
    //           currentElement.classList.remove('vditor-outline__item--current')
    //         }
    //         let index = i > 0 ? i - 1 : 0
    //         document.querySelector('span[data-target-id="' + toc[index].id + '"]').classList.add('vditor-outline__item--current')
    //         break
    //       }
    //     }

    //   })
    // }

    Vditor.preview(previewEditor.value, res.data.data[0].file, {
      anchor: 1,
      speech: {
        enable: true,
      },
      after: () => {
        // if (window.innerWidth <= 780) {
        //   return
        // }
        // Vditor.outlineRender(previewEditor.value, outline.value)
        // if (outline.value.innerText.trim() !== '') {
        //   outline.value.style.display = 'block'
        //   initOutline()
        // }
      }
    })
  })

  // getLockStatus(route.query.id).then((lockstatus) => {
  //   // 文件没有锁定 preview 模式打开
  //   lock.value = lockstatus.data.data.lock
  //   if (!lockstatus.data.data.lock) {
  //     getFile(route.query.id).then((res) => {
  //       Vditor.preview(previewEditor.value, res.data.data[0].file, {
  //         // after: () => {
  //         //   Vditor.outlineRender(previewEditor.value, outline.value)
  //         // }
  //       })
  //       // contentEditor.value.setValue(res.data.data[0].file)
  //       // contentEditor.value.disabled()
  //       // contentEditor.value.preview(res.data.data[0].file)
  //       // contentEditor.value.setPreviewMode('both')
  //     })
  //     // contentEditor.value.disabled()
  //     // isLock.value = true
  //   } else {
  //     // 文件锁定 将功能按钮 disabled
  //     // lock.value = true
  //     getFile(route.query.id).then((res) => {
  //       Vditor.preview(previewEditor.value, res.data.data[0].file, {
  //         // after: () => {
  //         //   Vditor.outlineRender(previewEditor.value, outline.value)
  //         // }
  //       })
  //     })
  //   }
  // })


  contentEditor.value = new Vditor("vditorDiv", {
    toolbar: [
      "outline",
      "emoji",
      "headings",
      "bold",
      "italic",
      "strike",
      "link",
      "|",
      "list",
      "ordered-list",
      "check",
      "outdent",
      "indent",
      "|",
      "quote",
      "line",
      "code",
      "inline-code",
      "insert-before",
      "insert-after",
      "|",
      "upload",
      // "record",
      "table",
      "|",
      "undo",
      "redo",
      "|",
      "fullscreen",
      "edit-mode",
      {
        name: "more",
        toolbar: [
          "both",
          "code-theme",
          "content-theme",
          "export",
          "preview",
          "devtools",
          // "info",
          // "help",
        ],
      },
    ],
    hint: {
      emoji: {
        "+1": "👍",
        "-1": "👎",
        "1st_place_medal": "🥇",
        "2nd_place_medal": "🥈",
        "3rd_place_medal": "🥉",
        "angry": "😠",
        "anguished": "😧",
        "astonished": "😲",
        "confounded": "😖",
        "confused": "😕",
        "cry": "😢",
        "disappointed": "😞",
        "disappointed_relieved": "😥",
        "drooling_face": "🤤",
        "eyes": "👀",
        "face_with_head_bandage": "🤕",
        "face_with_thermometer": "🤒",
        "fearful": "😨",
        "frog": "🐸",
        "frowning": "😦",
        "grimacing": "😬",
        "grin": "😁",
        "grinning": "😀",
        "stuck_out_tongue": "😛",
        "stuck_out_tongue_closed_eyes": "😝",
        "stuck_out_tongue_winking_eye": "😜", "smile": "😄",
        "smile_cat": "😸",
        "smiley": "😃",
        "smiley_cat": "😺",
        "smiling_imp": "😈",
        "smirk": "😏",
        "smirk_cat": "😼",
        "arrow_backward": "◀️",
        "arrow_forward": "▶️",
        "baby": "👶",
        "ballot_box_with_check": "☑️",
        "beer": "🍺",
        "beers": "🍻",
        "black_nib": "✒️",
        "blush": "😊",
        "carrot": "🥕",
        "cat": "🐱",
        "chart": "💹",
        "chart_with_downwards_trend": "📉",
        "chart_with_upwards_trend": "📈",
        "cloud": "☁️",
        "cloud_with_lightning": "🌩",
        "cloud_with_lightning_and_rain": "⛈",
        "cloud_with_rain": "🌧",
        "cloud_with_snow": "🌨",
        "clown_face": "🤡",
        "grey_exclamation": "❕",
        "grey_question": "❔",

        "ok": "🆗",
        "ok_hand": "👌",
        "small_blue_diamond": "🔹",
        "small_orange_diamond": "🔸",
        "small_red_triangle": "🔺",
        "small_red_triangle_down": "🔻",
        "bell": "🔔",

      }
    },
    // mode: 'sv',
    counter: {
      enable: true,
    },
    upload: {
      url: 'http://192.168.10.15:8092/uploadimgs',
      multiple: false,
      fieldName: "file",
      accept: "image/*"
    },
    width: '60vw',
    height: '80vh',
    toolbarConfig: {
      pin: true,
    },
    cache: {
      enable: false,
    },
    after: () => {
      getFile(route.query.id).then((res) => {
        contentEditor.value.setValue(res.data.data[0].file)
        // contentEditor.value.disabled()
        // contentEditor.value.preview(res.data.data[0].file)
        // contentEditor.value.setPreviewMode('both')
      })

    },
  })
})


const edit = () => {
  getLockStatus(route.query.id).then((lockStatus) => {
    if (lockStatus.data.data.lock) {
      ElMessage.info('该文件正在被编辑，请稍后再试')
    } else {
      lock.value = true
      editTag.value = true
      lockFile(route.query.id).then((lockRes) => {
        if (lockRes.data.status == '200') {
          ElMessage.info('文件已锁定')
          getFile(route.query.id).then((res) => {
            contentEditor.value.setValue(res.data.data[0].file)
          })
        }
      })
    }
  })
}

document.onkeydown = function (e) {
  if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
    e.preventDefault()
    save()
  }
}

const save = () => {
  saveFile(route.query.id, contentEditor.value.getValue()).then((res) => {
    if (res.data.status != '200') {
      ElMessage.error('保存失败')
    } else {
      ElMessage.success('保存成功')
      unlockFile(route.query.id).then((unLockRes) => {
        if (unLockRes.data.status == '200') {
          ElMessage.info('文件已解锁')
          lock.value = false
          getFile(route.query.id).then((res) => {
            Vditor.preview(previewEditor.value, res.data.data[0].file, {
              // after: () => {
              //   Vditor.outlineRender(previewEditor.value, outline.value)
              // }
            })
            contentEditor.value.setValue(res.data.data[0].file)
          })
        }
      })
    }
  })
}



onBeforeUnmount(() => {
  if (editTag.value) {
    saveFile(tmpid, contentEditor.value.getValue()).then((res) => {
      console.log('saving...')
      unlockFile(tmpid).then((unlockRes) => {
        if (unlockRes.data.status == '200') {
          console.log('文件已解锁')
        }
      })
    })
  }

})
// const s = new spreadsheet('#excel').loadData({}).change(data => { })
// s.validate()
</script>
<style scoped>
.editor-preview {
  margin: 0 auto;
  padding: 1.5rem;
  width: 65%;
  height: 90%;
  /* min-height: 70%; */
  /* max-height: 90%; */
  /* border: 1px solid rgb(190, 190, 190); */
  /* background-color: rgb(250, 250, 250); */
  background-color: #fff;
}

.fullscreen {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vh;
}

a {
  color: #42b983;
}

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
    padding: 1rem 2rem;
    /* margin-right: 5rem; */
    font-size: 1rem;

    .el-icon {
      margin-right: 0.5rem;
    }
  }
}

.outline {
  /* background-color: #eebdbd; */
  z-index: 100;
  position: absolute;
  top: 9rem;
  left: 12rem;
  width: 15rem;
  /* height: 600px; */
}
</style>

