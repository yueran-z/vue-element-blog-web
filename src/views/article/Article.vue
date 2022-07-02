<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card" style="box-shadow: 0 0 2px rgba(0, 0, 0, 0.1)">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            clearable
            placeholder="请输入搜索内容"
            v-model="articleInfo.query"
            @clear="getArticleList()"
            @blur="getArticleList"
          >
            <template #append>
              <el-button :icon="Search" @click="getArticleList" />
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addArticle">添加文章</el-button>
        </el-col>
      </el-row>
      <el-table :data="articles.value" v-loading="loading" border>
        <el-table-column
          type="index"
          label="序号"
          width="60"
          center
        ></el-table-column>
        <el-table-column prop="title" label="文章标题" />
        <el-table-column prop="summary" label="文章描述" />
        <el-table-column prop="cate_id" label="文章分类">
          <template #default="scope">
            {{ transCategory(scope.row.cate_id) }}
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间">
          <template #default="scope">
            {{ typeDateTime(scope.row.create_time) }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              type="success"
              :icon="Reading"
              @click="detailArticle(scope.row.id)"
              circle
            />
            <el-button
              type="primary"
              :icon="Edit"
              @click="editArticle(scope.row.id)"
              circle
            />
            <el-button
              type="danger"
              @click="removeArticleById(scope.row.id)"
              :icon="Delete"
              circle
            />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:currentPage="articleInfo.pagenum"
        v-model:page-size="articleInfo.pagesize"
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
  name: 'Article',
  setup() {
    const router = useRouter()
    const articles = reactive([])
    const total = ref(0)
    const loading = ref(false)
    const articleInfo = reactive({
      query: '',
      pagenum: 1,
      pagesize: 5,
    })

    onMounted(() => {
      getArticleList()
    })

    const getArticleList = async () => {
      loading.value = true
      let { data: res } = await axios.get('/article/getAllArticle', {
        params: articleInfo,
      })
      articles.value = res.articles
      total.value = res.total
      loading.value = false
    }

    const handleSizeChange = (pagesize) => {
      articleInfo.pagesize = pagesize
      getArticleList()
    }

    const handleCurrentChange = (pagenum) => {
      articleInfo.pagenum = pagenum
      getArticleList()
    }

    const transCategory = (cate) => {
      if (cate == 1) return '国际新闻'
      if (cate == 2) return '国内新闻'
      return cate
    }

    const addArticle = () => {
      router.push({
        path: '/article/addoredit',
      })
    }

    const removeArticleById = async (id) => {
      ElMessageBox.confirm('此操作将永久删除该内容, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await axios.delete('/article/delArticle/' + id)
        console.log('res', res)
        if (res.data.flag) {
          getArticleList()
          ElMessage.success(`${res.data.msg}`)
        } else {
          ElMessage.error(`${res.data.msg}`)
        }
      })
    }

    const editArticle = (id) => {
      router.push({
        path: '/article/addoredit',
        query: {
          editArticleId: id,
        },
      })
    }

    const detailArticle = (id) => {
      router.push({
        path: '/article/detail',
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
      articles,
      loading,
      addArticle,
      editArticle,
      articleInfo,
      total,
      handleSizeChange,
      handleCurrentChange,
      getArticleList,
      transCategory,
      typeDateTime,
      removeArticleById,
      detailArticle,
    }
  },
})
</script>

<style scoped></style>
