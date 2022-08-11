<template>
  <div class="demo1-page">
    <h1>ofdPreview实现上传文件</h1>
    <input type="file" ref="file" accept=".ofd" @change="fileChanged" v-show="false"/>
    <button @click="uploadFiles">上传OFD文件</button>

    <div>文件列表</div>
    <div class="file-list" v-for="(item, index) in attachmentList" :key="index">
      <span class="file-name">{{ item.name }}</span>
      <button @click="preview(item)">预览</button>
      <button @click="close">关闭</button>
    </div>

    <div v-show="ofdObj">
      <button @click="plus">放大</button>
      <button @click="minus">缩小</button>
      <div id="content" ref="contentDiv" @mousewheel="scrool"></div>
    </div>
    
  </div>
</template>

<script>
import {parseOfdDocument, renderOfd, renderOfdByScale, digestCheck, getPageScale, setPageScale} from "../utils/ofd/ofd.js";

export default {
  name: 'OfdPreview',
  data () {
    return {
      attachmentList: [],
      file: null,
      ofdBase64: null,//个人感觉没用，但是官网拿下来的也没试，你可以留下
      scale: 0,
      ofdObj: null,
    }
  },
  methods: {
    /** 上传文件 */
    uploadFiles () {
      this.$refs.file.click()
    },
    fileChanged() {
      this.file = this.$refs.file.files[0]
      this.attachmentList.push(this.$refs.file.files[0])
      console.log(this.file)
      let ext = this.file.name.replace(/.+\./, '')
      if (['ofd'].indexOf(ext) === -1) {
        this.$alert('error', '仅支持ofd类型', {
          confirmButtonText: '确定',
          callback: (action) => {
            this.$message({
              type: 'info',
              message: `action: ${action}`,
            })
          },
        })
        return
      }
      if (this.file.size > 100 * 1024 * 1024) {
        this.$alert('error', '文件大小需 < 100M', {
          confirmButtonText: '确定',
          callback: (action) => {
            this.$message({
              type: 'info',
              message: `action: ${action}`,
            })
          },
        })
        return
      }
      /* let that = this
      //转换器
      let reader = new FileReader()
      reader.readAsDataURL(this.file)
      reader.onload = function (e) {
        that.ofdBase64 = e.target.result.split(',')[1]
      }
      this.handleChange(this.file)
      this.$refs.file.value = null */
    },
    handleChange(file) {
      let that = this;
      parseOfdDocument({
        ofd: file,
        success(res) {
          //输出ofd每页的div
          let screenWidth = 1000
          const divs = renderOfd(screenWidth, res[0])
          that.ofdObj = res[0]
          that.displayOfdDiv(divs);
        },
        fail(error) {
          console.log(error)
        },
      })
    },
    displayOfdDiv(divs) {
      this.scale = getPageScale();
      let contentDiv = document.getElementById('content');
      contentDiv.innerHTML = '';
      for (const div of divs) {
        contentDiv.appendChild(div)
      }
      /* for(let ele of document.getElementsByName('seal_img_div')) {
        this.addEventOnSealDiv(ele, JSON.parse(ele.dataset.sesSignature), JSON.parse(ele.dataset.signedInfo));
      } */
    },
    preview(item) {
      let that = this
      //转换器
      let reader = new FileReader()
      reader.readAsDataURL(item)
      reader.onload = function (e) {
        that.ofdBase64 = e.target.result.split(',')[1]
      }
      this.handleChange(item)
      this.$refs.file.value = null
    },
    close() {
      this.ofdBase64 = null
      this.scale = 0
      this.ofdObj = null
      let contentDiv = document.getElementById('content')
      contentDiv.innerHTML = ''
    },
    scrool() {
      let scrolled = this.$refs.contentDiv.firstElementChild?.getBoundingClientRect()?.top - 60;
      let top = 0
      let index = 0;
      for (let i=0;i<this.$refs.contentDiv.childElementCount; i ++) {
        top += (Math.abs(this.$refs.contentDiv.children.item(i)?.style.height.replace('px','')) + Math.abs(this.$refs.contentDiv.children.item(i)?.style.marginBottom.replace('px','')));
        if (Math.abs(scrolled) < top) {
          index = i;
          break;
        }
      }
      this.pageIndex = index+1;
    },
    plus() {
      console.log('放大');
      setPageScale(++this.scale);
      const divs = renderOfdByScale(this.ofdObj);
      this.displayOfdDiv(divs);
    },

    minus() {
      console.log('缩小');
      setPageScale(--this.scale);
      const divs = renderOfdByScale(this.ofdObj);
      this.displayOfdDiv(divs);
    },

    addEventOnSealDiv(div, SES_Signature, signedInfo) {
      try {
        global.HashRet=null;
        global.VerifyRet=signedInfo.VerifyRet;
        div.addEventListener("click",function(){
          document.getElementById('sealInfoDiv').hidden = false;
          document.getElementById('sealInfoDiv').setAttribute('style', 'display:flex;align-items: center;justify-content: center;');
          if(SES_Signature.realVersion<4){
            document.getElementById('spSigner').innerText = SES_Signature.toSign.cert['commonName'];
            document.getElementById('spProvider').innerText = signedInfo.Provider['@_ProviderName'];
            document.getElementById('spHashedValue').innerText = SES_Signature.toSign.dataHash.replace(/\n/g,'');
            document.getElementById('spSignedValue').innerText = SES_Signature.signature.replace(/\n/g,'');
            document.getElementById('spSignMethod').innerText = SES_Signature.toSign.signatureAlgorithm.replace(/\n/g,'');
            document.getElementById('spSealID').innerText = SES_Signature.toSign.eseal.esealInfo.esID;
            document.getElementById('spSealName').innerText = SES_Signature.toSign.eseal.esealInfo.property.name;
            document.getElementById('spSealType').innerText = SES_Signature.toSign.eseal.esealInfo.property.type;
            document.getElementById('spSealAuthTime').innerText = "从 "+SES_Signature.toSign.eseal.esealInfo.property.validStart+" 到 "+SES_Signature.toSign.eseal.esealInfo.property.validEnd;
            document.getElementById('spSealMakeTime').innerText = SES_Signature.toSign.eseal.esealInfo.property.createDate;
            document.getElementById('spSealVersion').innerText = SES_Signature.toSign.eseal.esealInfo.header.version;
          }else{
            document.getElementById('spSigner').innerText = SES_Signature.cert['commonName'];
            document.getElementById('spProvider').innerText = signedInfo.Provider['@_ProviderName'];
            document.getElementById('spHashedValue').innerText = SES_Signature.toSign.dataHash.replace(/\n/g,'');
            document.getElementById('spSignedValue').innerText = SES_Signature.signature.replace(/\n/g,'');
            document.getElementById('spSignMethod').innerText = SES_Signature.signatureAlgID.replace(/\n/g,'');
            document.getElementById('spSealID').innerText = SES_Signature.toSign.eseal.esealInfo.esID;
            document.getElementById('spSealName').innerText = SES_Signature.toSign.eseal.esealInfo.property.name;
            document.getElementById('spSealType').innerText = SES_Signature.toSign.eseal.esealInfo.property.type;
            document.getElementById('spSealAuthTime').innerText = "从 "+SES_Signature.toSign.eseal.esealInfo.property.validStart+" 到 "+SES_Signature.toSign.eseal.esealInfo.property.validEnd;
            document.getElementById('spSealMakeTime').innerText = SES_Signature.toSign.eseal.esealInfo.property.createDate;
            document.getElementById('spSealVersion').innerText = SES_Signature.toSign.eseal.esealInfo.header.version;
          }
          document.getElementById('spVersion').innerText = SES_Signature.toSign.version;
          document.getElementById('VerifyRet').innerText = "文件摘要值后台验证中，请稍等... "+(global.VerifyRet?"签名值验证成功":"签名值验证失败");
          if(global.HashRet==null||global.HashRet==undefined||Object.keys(global.HashRet).length <= 0){
            setTimeout(function(){
              const signRetStr = global.VerifyRet?"签名值验证成功":"签名值验证失败";
              global.HashRet = digestCheck(global.toBeChecked.get(signedInfo.signatureID));
              const hashRetStr = global.HashRet?"文件摘要值验证成功":"文件摘要值验证失败";
              document.getElementById('VerifyRet').innerText = hashRetStr+" "+signRetStr;
            },1000);
          }
        });
      } catch (e) {
        console.log(e);
      }
      if (!global.VerifyRet) {
        div.setAttribute('class', 'gray');
      }
    }
  }
}
</script>
