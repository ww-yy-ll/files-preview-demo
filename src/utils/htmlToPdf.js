// htmlToPdf.js
// 导出页面为PDF格式
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
const getPdf = (htmlTitle) => {
  html2Canvas(document.querySelector('#pdfDom'), {
    allowTaint: true,
    taintTest: false,
    useCORS: true,
    y: 72, // 对Y轴进行裁切
    // width:1200,
    // height:5000,
    dpi: window.devicePixelRatio * 4, // 导出pdf清晰度,将分辨率提高到特定的DPI 提高四倍
    scale: 4 // 按比例增加分辨率
  }).then(function (canvas) {
    var contentWidth = canvas.width
    var contentHeight = canvas.height
    // 一页pdf显示html页面生成的canvas高度
    var pageHeight = contentWidth / 592.28 * 841.89
    // 为生成pdf的html页面高度
    var leftHeight = contentHeight
    // pdf页面偏移
    var position = 0
    // html页面生成的canvas在pdf中图片的宽高（a4纸的尺寸[595.28,841.89]）
    var imgWidth = 595.28
    var imgHeight = 592.28 / contentWidth * contentHeight
    var pageData = canvas.toDataURL('image/jpeg', 1.0)
    var PDF = new JsPDF('', 'pt', 'a4')
    // 有两个高度需要区分，一个是html页面的实际高度，和生成pdff的页面高度（841.89）
    // 当内容未超过pdf一页显示的范围，无需分页
    if (leftHeight < pageHeight) {
      PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
    } else {
      while (leftHeight > 0) {
        PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
        leftHeight -= pageHeight
        position -= 841.89
        // 避免添加空白页
        if (leftHeight > 0) {
          PDF.addPage()
        }
      }
    }
    PDF.save(htmlTitle + '.pdf')
  })
}
export default getPdf
