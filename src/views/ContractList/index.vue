<template>
  <div class="app-container">
    <div class="search-container">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item >
            <el-input v-model="input" placeholder="合同编号、合同名称、合同类型、项目编号" />
          </el-form-item>
          <el-form-item >
            <el-date-picker
              v-model="date"
              type="daterange"
              range-separator="—"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              clearable
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onQuery">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onExport"
              v-btnPermission="{rights:['1']}"
            >导入</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="onAdd">新增</el-button>
          </el-form-item>
        </el-form>
    </div>


    <el-table :data="tableData"
              stripe style="width: 100%"
              row-key="id"
              ref="tableRef"
              >
      <el-table-column prop="contractNum" label="合同编号"  />
      <el-table-column prop="title" label="合同名称" />
      <el-table-column prop="project" label="所属项目" />
      <el-table-column prop="type" label="合同类型" />
      <el-table-column prop="stage" label="期数" />
      <el-table-column prop="lumpSum" label="金额" />
      <el-table-column prop="paymentMethod" label="付款方式" />
      <el-table-column prop="contractState" label="状态" />
      <el-table-column prop="currentHandler" label="当前处理人" />
      <el-table-column prop="firstPartyUnit" label="甲方单位" />

      <el-table-column fixed="right" label="操作" >
        <template v-slot="scope">
          <el-button link type="primary" size="small" @click="clickExpand(scope.row)"
          >详情</el-button>
          <el-button link type="primary" size="small"  @click="onEdit(scope.row)">编辑</el-button>
              <el-button link type="success" size="small"  @click="upLoad(scope.row)">上传</el-button>
          <el-button link type="warning" size="small"  @click="onDelete(scope.row)">删除</el-button>
        </template>

      </el-table-column>
      <el-table-column type="expand" width="1" class="detailShow">
        <template v-slot="expand" >
          <el-row>
            <el-col :span="3">甲方姓名:{{ expand.row.firstParty }}</el-col>
            <el-col :span="4">签约日期：{{ expand.row.contractDate }}</el-col>
            <el-col :span="3">负责人：{{ expand.row.principal }}</el-col>
            <el-col :span="3">所属部门：{{ expand.row.department }}</el-col>
            <el-col :span="4">进度：{{ expand.row.process }}</el-col>

          </el-row>

        </template>
      </el-table-column>
    </el-table>

    <div class="demo-pagination-block">
      <el-pagination
        v-model:currentPage="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[1, 2, 3, 4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]"
        :background="true"
        layout="total,sizes, prev, pager, next"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog
      v-model="dialogVisible"
      title="编辑合同列表"
      width="50%"
      :before-close="handleClose"
    >
      <el-form :model="form" label-width="120px">
        <el-form-item label="合同编号">
          <el-input v-model="form.contractNum" />
        </el-form-item>
        <el-form-item label="合同名称">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="所属项目">
          <el-input v-model="form.project" />
        </el-form-item>
        <el-form-item label="合同类型">
          <el-input v-model="form.type" />
        </el-form-item>
        <el-form-item label="期数">
          <el-input v-model="form.stage" />
        </el-form-item>
        <el-form-item label="金额">
          <el-input v-model="form.lumpSum" />
        </el-form-item>
        <el-form-item label="付款方式">
          <el-input v-model="form.paymentMethod" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.contractState" placeholder="请选择合同状态">
            <el-option label="未执行" value="未执行" />
            <el-option label="执行中" value="执行中" />
            <el-option label="已过期" value="已过期" />

          </el-select>
        </el-form-item>
        <el-form-item label="当前处理人">
          <el-input v-model="form.currentHandler" />
        </el-form-item>
        <el-form-item label="甲方单位">
          <el-input v-model="form.firstPartyUnit" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">更新</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      v-model="uploadVisible"
      title="上传合同封面"
      width="50%"
    >

      <el-upload
                  ref="uploadRef"
                  :action="uploadUrl"
                  list-type="picture-card"
                  :auto-upload="false"
                  headers="Content-Type:multipart/form-data"
                  :before-upload="beforeUploadEvent"
                  :on-success="uploadFileSuccess"
                  :data="fileObject"
      >
        <el-icon><Plus /></el-icon>

        <template #file="{ file }">
          <div>
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
            <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <el-icon><zoom-in /></el-icon>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleDownload(file)"
          >
            <el-icon><Download /></el-icon>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <el-icon><Delete /></el-icon>
          </span>
        </span>
          </div>
        </template>
      </el-upload>

      <el-dialog v-model="uploadVisible1" width="100%" >
        <img w-full :src="uploadImageUrl" alt="Preview Image" />
      </el-dialog>
      <el-button type="primary" @click="onUpload">上传</el-button>
      <el-button @click="dialogVisible = false">取消</el-button>
    </el-dialog>
  </div>
</template>

<script setup>
import {computed, onMounted, reactive, ref, watch} from 'vue'
import {deleteContract, queryContractList, updateContract, uploadContract} from "@/api/table";
import {ElMessageBox} from "element-plus";
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue'

const input=ref(null)     //输入框数据
const date=ref(null)      //时间数据
const tableRef =  ref() //注册表格
const currentPage = ref(1)  //当前页面
const pageSize = ref(10)  //页面容量
const total=ref()     //总数据量
const form = ref()
const uploadVisible=ref(false)
const uploadVisible1=ref(false)
const uploadImageUrl = ref('')
const disabled = ref(false)
const rowId=ref()
const uploadRef=ref()
const fileObject=ref()


const fileList = ref([])//上传文件列表
const uploadUrl = ref("http://localhost:8296/file/upload") //上传url




const tableData = ref( [ //表格数据
  ])



onMounted(()=>{
  getQueryData()
  // console.log(total.value)

})
const getQueryData=()=>{
  const queryData={
    input:input.value,
    date:date.value,
    currentPage:currentPage.value,
    pageSize:pageSize.value,
  }

  // console.log(queryData)
  queryContractList(queryData).then(response => {

    // console.log(typeof (response.data))
    console.log("获取合同列表为：",response)
    tableData.value=response.data
    // console.log(tableData.value)

    total.value=response.total
    // console.log(response.data.length)
  }).catch(error => {
    console.log(error)
  })
}


const onQuery = () => {
  getQueryData()
}

const onExport = () => {
  console.log('submit!')
}

//新增数据
const onAdd = () => {

}

const clickExpand = (row) => {  //行展开
  tableRef.value.toggleRowExpansion(row)
};

//更新数据
const onEdit=(row)=>{
      form.value = {
        id: row.id,
        contractNum: row.contractNum,
        title: row.title,
        project: row.project,
        type: row.type,
        stage: row.stage,
        lumpSum: row.lumpSum,
        paymentMethod: row.paymentMethod,
        contractState: row.contractState,
        currentHandler: row.currentHandler,
        firstPartyUnit: row.firstPartyUnit,
      }
  dialogVisible.value=true
}
const onSubmit = () => {
  if(form.value.contractState=='未执行'){
    form.value.state=1
  }else if(form.value.contractState=='执行中'){
    form.value.state=2
  }else if(form.value.contractState=='已过期'){
    form.value.state=3
  }
  // console.log(form.value)
  updateContract(form.value).then(response=>{
    if(response.code==20000){getQueryData()}
    dialogVisible.value=false
  }).catch(error => {
    console.log(error)
  })
}



const dialogVisible = ref(false)

const handleClose = (done) => {
  ElMessageBox.confirm('确定关闭此界面？')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}

const onDelete=(row)=>{
  deleteContract (row.id).then(response=>{
    if(response.code==20000){getQueryData()}
  }).catch(error => {
    console.log(error)
  })

}


//改变分页按钮
const handleSizeChange = (val) => {
  pageSize.value=val
  getQueryData()
}
const handleCurrentChange = (val) => {
  currentPage.value=val
  getQueryData()
}



const handleRemove = (file) => {
  console.log(file)
}

const handlePictureCardPreview = (file) => {
  uploadImageUrl.value = file.url
  uploadVisible1.value = true
}

const handleDownload = (file) => {
  console.log(file)
}

//点击弹出上传页面
const upLoad=(row)=>{
  rowId.value=row.id
  uploadVisible.value=true
}

//点击上传
const onUpload = ()=> {
  uploadRef.value.submit()
  console.log(fileObject.value)
}


//上传之前事件
const beforeUploadEvent = (rawFile)=>{
   fileObject.value={
    rawFile:rawFile,
    id:rowId.value,
  }


}


//上传成功事件
const uploadFileSuccess = (response,uploadFile,uploadFiles)=>{
  console.log(response)

}
</script>
<style>

/deep/.detailShow {
  display: none;
}

.demo-pagination-block + .demo-pagination-block {
  margin-top: 10px;
}
.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}

</style>
