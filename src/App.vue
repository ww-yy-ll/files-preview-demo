<template>
  <div id="app">
    <!-- <nav>
      <router-link to="/">使用原生input组件实现上传文件</router-link> |
      <router-link to="/about">预览docx文件</router-link> |
      <router-link to="/aboutPdf">预览docx文件并另存为Pdf</router-link> |
      <router-link to="/testView">测试</router-link>
      <router-link to="/"></router-link>
    </nav> -->
    <!-- <router-link to="/"></router-link> -->
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  background-color: #f6f7fb;
  padding-bottom: 20px;
  overflow: auto;

  ::-webkit-scrollbar,
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-thumb,
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: #dedee4;
  }

  ::-webkit-scrollbar-track,
  &::-webkit-scrollbar-track {
    background: inherit;
  }
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
