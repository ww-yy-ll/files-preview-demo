<template>
  <div class="demo1-page">
    <h1>excel预览</h1>
    <input type="file" ref="upload" @change="changefile" v-show="false" />
    <button @click="uploadFiles">上传</button>

    <div class="file-list" v-for="(item, index) in attachmentList" :key="index">
      <span class="file-name">{{ item.name }}</span>
      <button @click="deleteAttachment(index)">删除</button>
      <button @click="previewAttachment(item)">预览</button>
    </div>

    <div>
      <button v-show="isPreview" @click="close">关闭预览</button>
      <button v-show="isPreview" @click="saveAsPdf">转存PDF</button>
      <div v-show="isPreview" id="pdfDom" ref="preview2" class="preview-block">
        <table border="0">
          <thead>
            <tr>
              <th v-for="(hItem, hIndex) in tableHeader" :key="hIndex">{{hItem}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(tItem, tIndex) in tableData" :key="tIndex">
              <td v-for="(hItem2, hIndex2) in tableHeader" :key="hIndex2">{{ tItem[hItem2] }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import getPdf from '@/utils/htmlToPdf.js'
import * as XLSX from 'xlsx'
window.JSZip = require('jszip')
// const docx = require('docx-preview') // npm i docx-preview@0.1.4
export default {
  name: 'HomeView',
  data () {
    return {
      fileType: '.jpg, .png, .txt, .doc, .docx, .pdf, .xls, .xlsx',
      attachmentList: [],
      isPreview: false,
      fileInfo: null,
      tableData: [],
      tableHeader: []
    }
  },
  methods: {
    /** 上传文件 */
    uploadFiles () {
      this.$refs.upload.click()
    },
    /* 上传操作 */
    changefile (event) {
      console.log('event--', event)
      if (!event.currentTarget.files.length) {
        return
      }
      /* 获取到你选择的文件 */
      let file = ''
      file = event.target.files[0]
      /* 限制文件上传类型 */
      let suffixName = ''
      suffixName = file.name.substring(file.name.lastIndexOf('.') + 1) // 得到文件后缀名
      if (this.fileType.indexOf(suffixName) === -1) {
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
      this.attachmentList.push(file)

      var reader = new FileReader()
      var that = this
      reader.onload = function (e) {
        console.log('eeee-', e)
        var data = e.target.result
        // 接下来就是xlsx
        var wb = XLSX.read(data, {
          type: 'buffer'
        })
        var outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
        // 导出格式为json，{表数据：[]}
        console.log('outdata--', outdata)
        that.tableData = outdata
        // 获取数据的key
        var importDataThead = Array.from(Object.keys(outdata[0])).map(
          (item) => {
            return item
          }
        )
        that.tableHeader = importDataThead
        console.log('表头--', importDataThead)
      }
      reader.readAsArrayBuffer(file)
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
      }
    },
    close () {
      this.isPreview = false
      this.tableData = []
      this.tableHeader = []
    },
    saveAsPdf () {
      getPdf(this.fileInfo.name)
    }
  }
}
</script>
