<template>
  <div class="demo1-page">
    <ul class="index-ul">
      <li v-for="(item, index) in list" :key="index" @click="toPage(item)">{{ item.title }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data () {
    return {
      list: [
        {
          title: '使用原生input组件实现上传文件',
          path: '/home'
        },
        {
          title: '预览docx文件',
          path: '/about'
        },
        {
          title: '预览docx文件并另存为Pdf',
          path: '/aboutPdf'
        },
        {
          title: '预览docx文件并另存为Pdf-综合测试',
          path: '/testView'
        },
        {
          title: 'excel预览',
          path: '/excelTest'
        },
        {
          title: 'ofd预览',
          path: '/ofdPreview'
        }
      ]
    }
  },
  methods: {
    toPage (item) {
      this.$router.push(item.path)
    }
  }
}
</script>
