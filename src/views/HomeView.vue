<template>
  <div class="demo1-page">
    <h1>使用原生input组件实现上传文件</h1>
    <input type="file" ref="upload" @change="changefile" v-show="false" />
    <button @click="uploadFiles">上传</button>
    <div>上传文件列表</div>
    <div class="file-list" v-for="(item, index) in attachmentList" :key="index">
      <!-- <i class="el-icon-document"></i> -->
      <span class="file-name">{{ item.name }}</span>
      <!-- <i class="el-icon-circle-check"></i> -->
      <!-- <i class="el-icon-close" @click.stop="deleteAttachment(index)"></i> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data () {
    return {
      fileType: '.jpg, .png, .txt, .doc, .docx, .pdf, .xls, .xlsx',
      attachmentList: [],
      src: '',
      vHtml: '',
      wordURL: ''
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
      var reader = new FileReader()
      reader.readAsDataURL(file)
      var that = this
      reader.onload = function (e) {
        console.log('eeee-', e)
        that.wordURL = e.target.result // 文件的本地路径
      }
    }
  }
}
</script>
