<template>
  <div class="about">
    <h1>预览docx文件并另存为Pdf</h1>
    <div class="my-component" ref="preview">
      <input type="file" @change="preview" ref="file">
    </div>
    <button v-show="isPreview" @click="close">关闭预览</button>
    <button v-show="isPreview" @click="saveAsPdf">转存PDF</button>
    <div v-show="isPreview" id="pdfDom" ref="preview2"></div>
  </div>
</template>
<script>
import getPdf from '@/utils/htmlToPdf.js'
window.JSZip = require('jszip')
const docx = require('docx-preview') // npm i docx-preview@0.1.4
export default {
  data () {
    return {
      isPreview: false
    }
  },
  methods: {
    preview (e) {
      if (this.$refs.file.files[0]) {
        this.isPreview = true
        docx.renderAsync(this.$refs.file.files[0], this.$refs.preview2) // 渲染到页面预览
      }
    },
    close () {
      document.getElementById('pdfDom').innerHTML = ''
      this.isPreview = false
    },
    saveAsPdf () {
      getPdf('pdf文件名')
    }
  }
}
</script>
<style scoped>
.my-component{
  margin: 20px auto;
}
</style>
