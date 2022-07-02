<template>
  <div>
    <el-upload
      :file-list="fileList"
      class="upload-demo"
      action="http://127.0.0.1:3000/up/uploadFile"
      :headers="headerObj"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      list-type="picture"
    >
      <el-button type="primary">Click to upload</el-button>
      <template #tip>
        <div class="el-upload__tip">
          jpg/png files with a size less than 500kb
        </div>
      </template>
    </el-upload>
  </div>
</template>
<script>
export default {
  data() {
    return {
      headerObj: { Authorization: window.sessionStorage.getItem('token') },
      fileList: [],
    }
  },
  methods: {
    uploadSuccess(e) {
      console.log(e)
    },
  },
}
</script>
