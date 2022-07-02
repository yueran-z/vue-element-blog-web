<template>
  <div>
    <el-upload
        class="avatar-uploader"
        action="http://127.0.0.1:3000/up/"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :headers="headerObj"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
  </div>
</template>

<script>
import {Plus} from '@element-plus/icons-vue'

export default {
  name: "Avatar",
  data() {
    return {
      imageUrl:'',
      headerObj:{Authorization:window.sessionStorage.getItem('token')}
    }
  },
  components:{
    Plus
  },
  mounted(){
    this.getAvatar()
  },
  methods:{
    handleAvatarSuccess(response, uploadFile){
      this.imageUrl = URL.createObjectURL(uploadFile.raw)
    },
    beforeAvatarUpload(rawFile){
      if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
        this.$message.error('Avatar picture must be JPG format or png format!')
        return false
      } else if (rawFile.size / 1024 / 1024 > 2) {
        this.$message.error('Avatar picture size can not exceed 2MB!')
        return false
      }
      return true
    },
    async getAvatar(){
      const {data}=await this.$http.get('/users/avatar')
      console.log(data)
      this.imageUrl=data.url
    }
  }
}
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

  <style>
  .avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
