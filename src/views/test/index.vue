<template>
  <div class="app-container">
    <el-upload
      v-model:file-list="fileList"
      class="upload-demo"
      :action="uploadUrl"
      :before-upload="beforeUploadEvent"
      :on-success="uploadFileSuccess"
      :data="upload_file_data"
      :limit="1"
    >
      <el-button type="primary">点击上传</el-button>
    </el-upload>
    <el-table :data="filterTableData" style="width: 100%">
      <el-table-column label="日期" prop="date"/>
      <el-table-column label="文件名" prop="name"/>
      <el-table-column align="center">
        <template #header>
          <el-input v-model="search" size="small" placeholder="请输入"/>
        </template>
        <template #default="scope">
          <el-button size="small"
                     @click="handleDownload(scope.$index, scope.row)"
          >下载
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >删除
          </el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>


<script setup>
import {ref} from "vue";
import {useStore} from "vuex";
const store = useStore()



const fileList = ref([])//上传文件列表
const uploadUrl = ref("http://localhost:8296/file/upload")




//上传之前事件
const beforeUploadEvent = (rawFile)=>{
  console.log(rawFile)

}

//上传成功事件
const uploadFileSuccess = (response,uploadFile,uploadFiles)=>{
  console.log(response)

}
</script>


<style  scoped>


</style>
