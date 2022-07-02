<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>目录管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card" style="box-shadow: 0 0 2px rgba(0, 0, 0, 0.1)">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            clearable
            placeholder="请输入搜索内容"
            v-model="menuInfo.query"
            @clear="getMenuList()"
            @blur="getMenuList"
          >
            <template #append>
              <el-button :icon="Search" @click="getMenuList" />
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addMenu">添加目录</el-button>
        </el-col>
      </el-row>
      <el-table :data="menus.value" v-loading="loading" border>
        <el-table-column
          type="index"
          label="序号"
          width="60"
          center
        ></el-table-column>
        <el-table-column prop="title" label="目录标题" />
        <el-table-column prop="path" label="目录路径" />
        <el-table-column prop="icons" label="目录图标" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              type="primary"
              :icon="Edit"
              @click="editMenu(scope.row.id)"
              circle
            />
            <el-button
              type="danger"
              @click="removeMenuById(scope.row.id)"
              :icon="Delete"
              circle
            />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:currentPage="menuInfo.pagenum"
        v-model:page-size="menuInfo.pagesize"
        :page-sizes="[2, 5, 10, 15]"
        :small="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
  </div>
</template>

<script>
import { Search, Edit, Delete, Plus, Reading } from '@element-plus/icons-vue'
import { defineComponent, ref, onMounted, reactive } from 'vue'
import axios from 'axios'
import { typeDateTime } from '../../util/time-handle.js'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'Menu',
  setup() {
    const router = useRouter()
    const menus = reactive([])
    const total = ref(0)
    const loading = ref(false)
    const menuInfo = reactive({
      query: '',
      pagenum: 1,
      pagesize: 5,
    })

    onMounted(() => {
      getMenuList()
    })

    const getMenuList = async () => {
      loading.value = true
      let { data: res } = await axios.get('/menu/getAllMenu', {
        params: menuInfo,
      })
      menus.value = res.menu
      total.value = res.total
      loading.value = false
    }

    const handleSizeChange = (pagesize) => {
      menuInfo.pagesize = pagesize
      getMenuList()
    }

    const handleCurrentChange = (pagenum) => {
      menuInfo.pagenum = pagenum
      getMenuList()
    }

    const transMenu = (cate) => {
      if (cate == 1) return '国际新闻'
      if (cate == 2) return '国内新闻'
      return cate
    }

    const addMenu = () => {
      router.push({
        path: '/menu/addoredit',
      })
    }

    const removeMenuById = async (id) => {
      ElMessageBox.confirm('此操作将永久删除该内容, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await axios.delete('/menu/delMenu/' + id)
        if (res.data.flag) {
          getMenuList()
          ElMessage.success(`${res.data.msg}`)
        } else {
          ElMessage.error(`${res.data.msg}`)
        }
      })
    }

    const editMenu = (id) => {
      router.push({
        path: '/menu/addoredit',
        query: {
          editMenuId: id,
        },
      })
    }

    const detailMenu = (id) => {
      router.push({
        path: '/menu/detail',
        query: {
          id: id,
        },
      })
    }

    return {
      Search,
      Edit,
      Delete,
      Plus,
      Reading,
      menus,
      loading,
      addMenu,
      editMenu,
      menuInfo,
      total,
      handleSizeChange,
      handleCurrentChange,
      getMenuList,
      transMenu,
      typeDateTime,
      removeMenuById,
      detailMenu,
    }
  },
})
</script>

<style scoped></style>
