<template>
  <div class="container">
    <el-card shadow="always">
      <el-row>
        <el-col :span="22">
          <div v-if="!editCategoryId">新建文章</div>
          <div v-else>修改文章</div>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="back">返回</el-button>
        </el-col>
      </el-row>
      <div style="margin: 10px 0"><hr /></div>
      <el-form
        :model="category"
        status-icon
        ref="form"
        label-width="100px"
        @submit.prevent
        :rules="rules"
      >
        <el-form-item label="分类标题" prop="category">
          <el-input
            v-model="category.category"
            placeholder="请填写分类标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="分类状态" prop="summary">
          <el-input
            v-model="category.status"
            placeholder="请填写文章分类状态"
          ></el-input>
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
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import axios from "axios";

export default {
  name: "addOrEditCategory",
  setup(props, context) {
    const router = useRouter();
    const route = useRoute();
    const editCategoryId = route.query.editCategoryId;
    const form = ref(null);
    const loading = ref(false);
    const category = reactive({
      category: "",
      status: "",
    });
    //  表单规则验证
    const { rules } = getRules();

    onMounted(() => {
      if (editCategoryId) {
        getCategory();
      }
    });

    const listAssign = (a, b) =>
      Object.keys(a).forEach((key) => {
        a[key] = b[key] || a[key];
      });

    const getCategory = async () => {
      loading.value = true;
      const { data: res } = await axios.get(
        "/category/getCategoryById/" + editCategoryId
      );
      console.log("res------", res);
      listAssign(category, res.data[0]);
      loading.value = false;
    };

    // 重置表单
    const resetForm = () => {
      form.value.resetFields();
    };

    const submitForm = async (formName) => {
      form.value.validate(async (valid) => {
        if (valid) {
          let res = {};
          if (editCategoryId) {
            res = await axios.put(
              "/category/editCategory/" + editCategoryId,
              category
            );
            console.log(res, "res");
            if (res.data.flag) {
              ElMessage.success(`${res.data.msg}`);
              router.push({ path: "/category" });
            } else {
              ElMessage.error(`${res.data.msg}`);
            }
          } else {
            res = await axios.post("/category/addCategory", category);
            resetForm(formName);
            if (res.data.flag) {
              ElMessage.success(`${res.data.msg}`);
              router.push({ path: "/category" });
            } else {
              ElMessage.error(`${res.data.msg}`);
            }
          }
        } else {
          console.error("error submit!!");
          ElMessage.error("请将信息填写完整");
        }
      });
    };

    const back = () => {
      router.push({
        path: "/category",
      });
    };

    return {
      back,
      category,
      form,
      rules,
      resetForm,
      submitForm,
      loading,
    };
  },
};

// 表单验证规则
function getRules() {
  // 验证回调函数
  const checkInfo = (rule, value, callback) => {
    if (!value) {
      callback(new Error("信息不能为空"));
    }
    callback();
  };
  const rules = {
    category: [{ validator: checkInfo, trigger: "blur", required: true }],
    status: [{ validator: checkInfo, trigger: "blur", required: true }],
  };
  return { rules };
}
</script>
