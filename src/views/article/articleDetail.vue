<template>
  <el-card>
    <div class="article" v-loading="loading">
      <div class="title">
        <div>{{ article.title }}</div>
      </div>
      <div style="font-size: 16px; margin:10px 0 20px; 0">
        <div>文章概述：{{ article.summary }}</div>
        <div>文章分类：{{ transCategory(article.cate_id) }}</div>
        <div>
          创建时间：<span>{{ mapDateTime(article.create_time) }}</span>
        </div>
      </div>
      <div class="content" v-html="article.content"></div>
    </div>
  </el-card>
</template>

<script>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import { typeDateTime } from "../../util/time-handle";

export default {
  name: "ArticleDetail",
  setup() {
    const article = ref({});
    const loading = ref(false);
    const route = useRoute(); // 获取route 的路由 query
    const id = route.query.id;
    onMounted(() => {
      getArticle();
    });

    const getArticle = async () => {
      loading.value = true;
      const { data: res } = await axios.get("/article/getArticleById/" + id);
      console.log("res-detail", res);
      article.value = res.data[0];
      loading.value = false;
    };

    const transCategory = (cate) => {
      if (cate == 1) return "国际新闻";
      if (cate == 2) return "国内新闻";
      return cate;
    };

    const mapDateTime = typeDateTime;

    return {
      loading,
      article,
      mapDateTime,
      transCategory,
    };
  },
};
</script>

<style scope>
.title {
  font-size: 30px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
