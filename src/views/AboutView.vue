<template>
  <div class="about">
    <h1>预览docx文件</h1>
    <div class="my-component" ref="preview">
      <input type="file" @change="preview" ref="file">
    </div>
    <button v-show="isPreview" @click="close">关闭预览</button>
    <button v-show="isPreview" @click="saveAsPdf">转存PDF</button>
    <div v-show="isPreview" id="preview2id" ref="preview2"></div>
  </div>
</template>
<script>
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
      document.getElementById('preview2id').innerHTML = ''
      this.isPreview = false
    },
    saveAsPdf () {
      document.getElementById('preview2id').innerHTML = ''
      this.isPreview = false
    }
  }
}
</script>
<style scoped>
.my-component{
  margin: 20px auto;
}
</style>
