<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <div class="title">
          <img src="../assets/imgs/idoc6.png" alt="">
          <!-- <h2>iDoc</h2> -->
        </div>
      </el-header>
      <el-container>
        <el-aside>
          <el-menu router default-active="/">
            <el-menu-item index="/">
              <el-icon>
                <Notebook />
              </el-icon>
              <span>主目录</span>
            </el-menu-item>

            <el-menu-item index="/recent">
              <el-icon>
                <Clock />
              </el-icon>
              <span>最近修改</span>
            </el-menu-item>

            <el-menu-item index="/recycle">
              <el-icon>
                <Delete />
              </el-icon>
              <span>回收站</span>
            </el-menu-item>

            <el-menu-item index="/imgupload">
              <el-icon>
                <Picture />
              </el-icon>
              <span>图床</span>
            </el-menu-item>

            <el-menu-item index="/vditor?id=64c21fddd9fa7567da663e26&name=说明文档">
              <el-icon>
                <Calendar />
              </el-icon>
              <span>说明文档</span>
            </el-menu-item>

          </el-menu>
        </el-aside>
        <el-main>
          <RouterView :key="route.fullPath"></RouterView>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { Notebook, Clock, Delete, Calendar, Picture } from "@element-plus/icons-vue"
import icon from '../assets/imgs/idoc5.png'
import { useRoute } from 'vue-router'


const route = useRoute()

</script>
<style scoped lang="scss">
.invis {
  visibility: hidden;
}

.common-layout {
  height: 100%;

  .el-container {
    height: 100%;
    // background-color: #b68484;

    .el-header {
      height: 4.5rem;
      line-height: 4.5rem;
      background-color: #ffffff;
      border-bottom: 1px;
      border-color: black;
      z-index: 10;
      box-shadow: 2px 2px 15px #dfdede;

      .title {
        display: flex;
        height: 4.5rem;

        img {
          margin-left: 1rem;
          margin-right: 1rem;
          height: 4.5rem;
        }

      }
    }

    .el-container {
      height: 90%;
      background-color: rgb(250, 250, 250);

      .el-aside {
        // background-color: #97e2c3;
        width: 12rem;

        .el-menu {
          margin-left: 1rem;
          padding: 0.4rem 0.4rem;
          border-right: 0;
          background-color: rgb(250, 250, 250);

          .el-menu-item {
            text-align: center;
            font-size: 1.15rem;
            color: rgb(140, 140, 140);
            // background-color: #fff;

            span {
              display: block;
              height: 2.5rem;
              line-height: 2.5rem;
            }
          }

          .el-menu-item.is-active {
            font-weight: 900;
            color: rgb(34, 85, 102)
          }

          .el-menu-item:hover {
            background-color: rgb(250, 250, 250);
          }

        }
      }

      .el-main {
        height: 100%;
        overflow: hidden;
        // max-height: 90%;
        padding: 0;
      }

    }
  }
}
</style>