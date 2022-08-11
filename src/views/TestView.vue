<template>
  <div class="demo1-page">
    <h1>使用原生input组件实现上传文件，预览、删除文件docx文件，并另存为pdf</h1>
    <input type="file" ref="upload" @change="changefile" v-show="false" />
    <button @click="uploadFiles">上传</button>
    <div style="margin: 20px auto;">上传文件列表</div>
    <div class="file-list" v-for="(item, index) in attachmentList" :key="index">
      <span class="file-name">{{ item.name }}</span>
      <button @click="deleteAttachment(index)">删除</button>
      <button @click="previewAttachment(item)">预览</button>
    </div>
    <div>
      <button v-show="isPreview" @click="close">关闭预览</button>
      <button v-show="isPreview" @click="saveAsPdf">转存PDF</button>
      <div v-show="isPreview" id="pdfDom" ref="preview2" class="preview-block"></div>
    </div>
  </div>
</template>

<script>
import getPdf from '@/utils/htmlToPdf.js'
window.JSZip = require('jszip')
const docx = require('docx-preview') // npm i docx-preview@0.1.4
export default {
  name: 'HomeView',
  data () {
    return {
      fileType: '.jpg, .png, .txt, .doc, .docx, .pdf, .xls, .xlsx',
      attachmentList: [],
      // src: '',
      // vHtml: '',
      // wordURL: '',
      isPreview: false,
      fileInfo: null
    }
  },
  methods: {
    /** 上传文件 */
    uploadFiles () {
      this.$refs.upload.click()
    },
    /* 上传图片操作 */
    changefile (event) {
      console.log('event--', event)
      /* 获取到你选择的文件 */
      let file = ''
      file = event.target.files[0]
      /* 限制文件上传类型 */
      let suffixName = ''
      suffixName = file.name.substring(file.name.lastIndexOf('.') + 1) // 得到文件后缀名
      if (this.fileType.indexOf(suffixName) === -1) {
        // this.$message.warning("上传文件只能是 jpg、png 格式!")
        alert('上传文件只能是 jpg, png, txt, doc, docx, pdf, xls, xlsx 格式!')
        console.log('上传文件只能是 jpg, png, txt, doc, docx, pdf, xls, xlsx 格式!')
        return
      }
      /* 限制文件上传大小 */
      let isLtSize = 0
      isLtSize = file.size / 1024 / 1024 < 10
      if (!isLtSize) {
        alert('上传文件不能超过 10MB!')
        console.log('上传文件不能超过 10MB!')
        return
      }
      /* 上传文件必须要用 formData 构造条件去构造请求参数 */
      let formData = ''
      formData = new FormData()
      formData.append('file', file)
      console.log('file', file)
      this.attachmentList.push(file)
      /* var reader = new FileReader()
      reader.readAsDataURL(file)
      var that = this
      reader.onload = function (e) {
        console.log('eeee-', e)
        that.wordURL = e.target.result // 文件的本地路径
      } */
    },
    /** 删除附件 */
    deleteAttachment (index) {
      alert('删除成功')
      this.attachmentList.splice(index, 1)
      this.close()
    },
    previewAttachment (item) {
      if (item) {
        this.isPreview = true
        this.fileInfo = item
        docx.renderAsync(item, this.$refs.preview2) // 渲染到页面预览
      }
    },
    close () {
      document.getElementById('pdfDom').innerHTML = ''
      this.isPreview = false
    },
    saveAsPdf () {
      getPdf(this.fileInfo.name)
    }
  }
}
</script>
<style scoped>
.preview-block {
  /* width: fit-content;
  margin: 20px auto; */
}
</style>
