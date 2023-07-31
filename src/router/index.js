import { createRouter, createWebHistory } from 'vue-router'

import FileViewCom from '../components/FileView.vue'
import VditorViewCom from '../components/VditorView.vue'
import TestTableCom from '../components/TestTable.vue'
import ImageUploadViewCom from '../components/ImageUploadView.vue'
import RecentFileViewCom from '../components/RecentFileView.vue'
import RecycleBinViewCom from '../components/RecycleBinView.vue'

const routes = [
  {
    path: '/',
    name: 'container',
    component: FileViewCom,
  },
  {
    path: '/recent',
    name: 'recent',
    label: 'recent',
    component: RecentFileViewCom
  },
  {
    path: '/recycle',
    name: 'recycle',
    label: 'recycle',
    component: RecycleBinViewCom
  },
  {
    path: '/vditor',
    name: 'vditor',
    label: 'vditor',
    component: VditorViewCom
  },
  {
    path: '/table',
    name: 'table',
    label: 'table',
    component: TestTableCom
  },
  {
    path: '/imgupload',
    name: 'imgupload',
    label: 'imgupload',
    component: ImageUploadViewCom
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})


export default router