<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章分类管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card" style="box-shadow: 0 0 2px rgba(0, 0, 0, 0.1)">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            clearable
            placeholder="请输入搜索内容"
            v-model="categoryInfo.query"
            @clear="getCategoryList()"
            @blur="getCategoryList"
          >
            <template #append>
              <el-button :icon="Search" @click="getCategoryList" />
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addCategory"
            >添加文章分类</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="categorys.value" v-loading="loading" border>
        <el-table-column
          type="index"
          label="序号"
          width="60"
          center
        ></el-table-column>
        <el-table-column prop="category" label="文章分类标题" />
        <el-table-column prop="status" label="文章分类状态" />
        <el-table-column prop="create_time" label="创建时间">
          <template #default="scope">
            {{ typeDateTime(scope.row.create_time) }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              type="primary"
              :icon="Edit"
              @click="editCategory(scope.row.id)"
              circle
            />
            <el-button
              type="danger"
              @click="removeCategoryById(scope.row.id)"
              :icon="Delete"
              circle
            />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:currentPage="categoryInfo.pagenum"
        v-model:page-size="categoryInfo.pagesize"
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
  name: 'Category',
  setup() {
    const router = useRouter()
    const categorys = reactive([])
    const total = ref(0)
    const loading = ref(false)
    const categoryInfo = reactive({
      query: '',
      pagenum: 1,
      pagesize: 5,
    })

    onMounted(() => {
      getCategoryList()
    })

    const getCategoryList = async () => {
      loading.value = true
      let { data: res } = await axios.get('/category/getAllCategory', {
        params: categoryInfo,
      })
      categorys.value = res.category
      total.value = res.total
      loading.value = false
    }

    const handleSizeChange = (pagesize) => {
      categoryInfo.pagesize = pagesize
      getCategoryList()
    }

    const handleCurrentChange = (pagenum) => {
      categoryInfo.pagenum = pagenum
      getCategoryList()
    }

    const transCategory = (cate) => {
      if (cate == 1) return '国际新闻'
      if (cate == 2) return '国内新闻'
      return cate
    }

    const addCategory = () => {
      router.push({
        path: '/category/addoredit',
      })
    }

    const removeCategoryById = async (id) => {
      ElMessageBox.confirm('此操作将永久删除该内容, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await axios.delete('/category/delCategory/' + id)
        console.log('res', res)
        if (res.data.flag) {
          getCategoryList()
          ElMessage.success(`${res.data.msg}`)
        } else {
          ElMessage.error(`${res.data.msg}`)
        }
      })
    }

    const editCategory = (id) => {
      router.push({
        path: '/category/addoredit',
        query: {
          editCategoryId: id,
        },
      })
    }

    const detailCategory = (id) => {
      router.push({
        path: '/category/detail',
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
      categorys,
      loading,
      addCategory,
      editCategory,
      categoryInfo,
      total,
      handleSizeChange,
      handleCurrentChange,
      getCategoryList,
      transCategory,
      typeDateTime,
      removeCategoryById,
      detailCategory,
    }
  },
})
</script>

<style scoped></style>
