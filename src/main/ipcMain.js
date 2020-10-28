let {app,clipboard,ipcMain,BrowserWindow,desktopCapturer} = require('electron');
let {debounce} = require('../utils/debounce')
ipcMain.on("action",(_,msg)=>{
    let [main_window] = BrowserWindow.getAllWindows()

    console.log(msg)
    switch (msg) {
        case "mouseenter":
            main_window.setSize(100,248)
            break
        case "mouseout":
            setTimeout(()=>{
                main_window.setSize(30,248)
            },200)
            break
    }
})


// 设置一个定时器, 1000ms 监测一下粘贴板
setInterval(() => {
    // let type = clipboard.availableFormats()
    // let text = clipboard.readText()
    // let img = clipboard.readImage();

    // 图片
    // let img_ret = img.toDataURL().length > 22 &&
    //     type.some(value => {return value.split('/').some(value1 => ["png", "jpg", "jpeg"].includes(value1));}) &&
    //     !text.endsWith('pdf');
    // console.log(img_ret)  // TODO 发现一个bug, 在我机器上如果注释这一行, 代码走到这里会停止运行
    // if (img_ret) {
    //     console.log("发现图片")
    //     return
    // }

    // 文本
    // console.log(1)
    // let text_ret  = clipboard.read("public.file-url").replace("file://",'')
    // let ret = text_ret.length === 0
    console.log(2)
    if (true) {
        console.log("发现文本")
    }


    // let img_ret2 = img.toDataURL().length > 22 &&
    //     type.some(value => {return value.split('/').some(value1 => ["png", "jpg", "jpeg"].includes(value1));}) &&
    //     !text.endsWith('pdf')
    // console.log(img_ret2)

    // console.log(1,img.toDataURL().length > 22,
    //     type.some(value => {return value.split('/').some(value1 => ["png", "jpg", "jpeg"].includes(value1));}),
    //     !text.endsWith('pdf'))
    //
    // console.log(2,img.toDataURL().length > 22 &&
    //     type.some(value => {return value.split('/').some(value1 => ["png", "jpg", "jpeg"].includes(value1));}) &&
    //     !text.endsWith('pdf'))



    // console.log(img.toDataURL().length > 22
    //     && type.some(value => {
    //         return value.split('/').some(value1 => ["png", "jpg", "jpeg"].includes(value1));})
    //     && !text.endsWith('pdf'))

    // if (img.toDataURL().length > 22
    //     && type.some(value => {
    //         return value.split('/').some(value1 => ["png", "jpg", "jpeg"].includes(value1));})
    //     && !text.endsWith('pdf')) {
    //     console.log("发现图片1")
    // }
    // if (img.toDataURL().length > 22
    //     && type.some(value => {
    //         return value.split('/').some(value1 => ["png", "jpg", "jpeg"].includes(value1));})
    //     && !text.endsWith('pdf')) {
    //     console.log("发现图片2")
    // }

    // let ret = clipboard.read("public.file-url").replace("file://",'')
    // if(){
    //     console.log("发现图片")
    // }

    //
    // if (type.some(value => {
    //     return value.split('/').some(value1 => ["png", "jpg", "jpeg"].includes(value1))
    // })) {
    //
    //     console.log('发现图片');
    //
    // }
    // console.log(img.toBitmap().length)
    // console.log(img.toDataURL().length)

    // console.log(ret, text)
    // 判断文件
    // if (ret) {
    //     // 判断是否为图片
    //     if (){
    //         console.log("发现图片")
    //     }
    // }


    // 文本保存到库中

    // 图片保存到库中

    // 文件保存路径


    // try {
    //     if (type[1].startsWith('image') && ['png', 'jpg', 'jpeg'].includes(text.toLowerCase().split('.')[1])) {
    //         console.log(clipboard.readImage().toDataURL().length);
    //     } else {
    //         console.log(type)
    //     }
    // }catch (e) {
    //     pass
    // }
}, 1000);

