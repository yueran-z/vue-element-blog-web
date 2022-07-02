<template>
  <div class="container">
    <el-card shadow="always">
      <el-row>
        <el-col :span="22">
          <div v-if="!editMenuId">新建目录</div>
          <div v-else>修改目录</div>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="back">返回</el-button>
        </el-col>
      </el-row>
      <div style="margin: 10px 0"><hr /></div>
      <el-form
        :model="menu"
        status-icon
        ref="form"
        label-width="100px"
        @submit.prevent
        :rules="rules"
      >
        <el-form-item label="目录标题" prop="title">
          <el-input
            v-model="menu.title"
            placeholder="请填写目录标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="目录路径" prop="path">
          <el-input v-model="menu.path" placeholder="请填写目录路径"></el-input>
        </el-form-item>
        <el-form-item label="目录图标" prop="icons">
          <el-input v-model="menu.icons" placeholder="请填写目录路径"></el-input>
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
import {ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import axios from "axios";

export default {
  name: "addOrEditMenu",
  setup(props, context) {
    const router = useRouter();
    const route = useRoute();
    const editMenuId = route.query.editMenuId;
    const form = ref(null);
    const loading = ref(false);
    const menu = reactive({
      title: "",
      path: "",
      icons: "",
    });
    //  表单规则验证
    const { rules } = getRules();

    onMounted(() => {
      if (editMenuId) {
        getMenu();
      }
    });

    const listAssign = (a, b) =>
      Object.keys(a).forEach((key) => {
        a[key] = b[key] || a[key];
      });

    const getMenu = async () => {
      loading.value = true;
      const { data: res } = await axios.get("/menu/getMenuById/" + editMenuId);
      console.log("res------", res);
      listAssign(menu, res.data[0]);
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
          if (editMenuId) {
            res = await axios.put("/menu/editMenu/" + editMenuId, menu);
            console.log(res, "res");
            if (res.data.flag) {
              ElMessage.success(`${res.data.msg}`);
              router.push({ path: "/menu" });
            } else {
              ElMessage.error(`${res.data.msg}`);
            }
          } else {
            res = await axios.post("/menu/addMenu", menu);
            resetForm(formName);
            if (res.data.flag) {
              ElMessage.success(`${res.data.msg}`);
              router.push({ path: "/menu" });
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
        path: "/menu",
      });
    };

    return {
      back,
      menu,
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
    title: [{ validator: checkInfo, trigger: "blur", required: true }],
    path: [{ validator: checkInfo, trigger: "blur", required: true }],
    icons: [{ validator: checkInfo, trigger: "blur", required: true }],
  };
  return { rules };
}
</script>
