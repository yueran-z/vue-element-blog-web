<template>
  <div class="container">
    <el-card shadow="always">
      <el-row>
        <el-col :span="22">
          <div v-if="!editArticleId">新建文章</div>
          <div v-else>修改文章</div>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="back">返回</el-button>
        </el-col>
      </el-row>
      <div style="margin: 10px 0"><hr /></div>
      <el-form
        :model="article"
        status-icon
        ref="form"
        label-width="100px"
        @submit.prevent
        :rules="rules"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="article.title" placeholder="请填写标题"></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="cate_id">
          <el-select v-model="article.cate_id" placeholder="请选择文章分类">
            <el-option
              v-for="item in articleCategory"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="描述" prop="summary">
          <el-input
            v-model="article.summary"
            placeholder="请填写文章描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="文章" prop="content">
          <div style="border: 1px solid #ccc">
            <Toolbar
              style="border-bottom: 1px solid #ccc"
              :editor="editorRef"
              :defaultConfig="toolbarConfig"
              :mode="mode"
            />
            <Editor
              style="height: 500px; overflow-y: hidden"
              v-model="article.content"
              :defaultConfig="editorConfig"
              :mode="mode"
              @onCreated="handleCreated"
            />
          </div>
        </el-form-item>

        <el-row>
          <el-col :span="18">&nbsp</el-col>
          <el-col :span="6">
            <el-form-item class="submit">
              <el-button type="primary" @click="submitForm">保 存</el-button>
              <el-button @click="resetForm">重 置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { onBeforeUnmount, ref, reactive, shallowRef, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

export default {
  name: 'addOrEditArticle',
  components: { Editor, Toolbar },
  setup(props, context) {
    const router = useRouter()
    const route = useRoute()
    const editArticleId = route.query.editArticleId //在路由对象下拿到ArticleId
    const form = ref(null)
    const loading = ref(false)
    const article = reactive({
      title: '',
      summary: '',
      cate_id: '',
      content: '',
    })
    const articleCategory = reactive([
      {
        label: '国际新闻',
        value: 1,
      },
      {
        label: '国内新闻',
        value: 2,
      },
    ])
    // 编辑器实例，必须用 shallowRef
    const editorRef = shallowRef()
    const toolbarConfig = {}
    const editorConfig = { placeholder: '请输入内容...' }
    // editorConfig.MENU_CONF["uploadImage"] = {
    //   server: "/api/upload",
    // };
    // 组件销毁时，也及时销毁编辑器
    onBeforeUnmount(() => {
      const editor = editorRef.value
      if (editor == null) return
      editor.destroy()
    })

    const handleCreated = (editor) => {
      editorRef.value = editor // 记录 editor 实例，重要！
    }

    //  表单规则验证
    const { rules } = getRules()

    onMounted(() => {
      if (editArticleId) {
        getArticle()
      }
    })

    const listAssign = (a, b) =>
      Object.keys(a).forEach((key) => {
        a[key] = b[key] || a[key]
      })

    const getArticle = async () => {
      loading.value = true
      const { data: res } = await axios.get(
        '/article/getArticleById/' + editArticleId
      )
      listAssign(article, res.data[0]) //把res.data[0]赋值给article

      loading.value = false
    }

    // 重置表单
    const resetForm = () => {
      form.value.resetFields()
    }

    const submitForm = async (formName) => {
      form.value.validate(async (valid) => {
        if (valid) {
          let res = {}
          if (editArticleId) {
            //根据ID编辑文章
            res = await axios.put(
              '/article/editArticle/' + editArticleId,
              article
            )
            console.log(res, 'res')
            if (res.data.flag) {
              ElMessage.success(`${res.data.msg}`)
              router.push({ path: '/article' })
            } else {
              ElMessage.error(`${res.data.msg}`)
            }
          } else {
            //添加文章
            res = await axios.post('/article/addArticle', article)
            resetForm(formName)
            if (res.data.flag) {
              ElMessage.success(`${res.data.msg}`)
              router.push({ path: '/article' })
            } else {
              ElMessage.error(`${res.data.msg}`)
            }
          }
        } else {
          console.error('error submit!!')
          ElMessage.error('请将信息填写完整')
        }
      })
    }

    const back = () => {
      //返回按钮
      router.push({
        path: '/article',
      })
    }

    return {
      back,
      article,
      form,
      rules,
      resetForm,
      submitForm,
      articleCategory,
      editorRef,
      loading,
      mode: 'default', // 或 'simple'
      toolbarConfig,
      editorConfig,
      handleCreated,
      editArticleId,
    }
  },
}

// 表单验证规则
function getRules() {
  // 验证回调函数
  const checkInfo = (rule, value, callback) => {
    if (!value) {
      callback(new Error('信息不能为空'))
    }
    callback()
  }
  const rules = {
    title: [{ validator: checkInfo, trigger: 'blur', required: true }],
    cate_id: [{ validator: checkInfo, trigger: 'blur', required: true }],
    summary: [{ validator: checkInfo, trigger: 'blur', required: true }],
    content: [{ validator: checkInfo, trigger: 'blur', required: true }],
  }
  return { rules }
}
</script>
