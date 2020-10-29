let {app,clipboard,ipcMain,BrowserWindow,desktopCapturer,Tray,Menu,nativeImage} = require("electron");
let {debounce} = require("../utils/debounce")
// import db from "../utils/datastore"
import get_date from "../utils/date"



ipcMain.on("action",(_,msg)=>{
    let [main_window] = BrowserWindow.getAllWindows()

    switch (msg) {
        case "mouseenter":
            // main_window.setSize(100,248)
            break
        case "mouseout":
            setTimeout(()=>{
                // main_window.setSize(20,248)
            },100)
            break
    }
})


// 设置一个定时器, 1000ms 监测一下粘贴板
// setInterval(() => {
//     let [main_window] = BrowserWindow.getAllWindows()
//
//     let type = clipboard.availableFormats();
//     let text = clipboard.readText();
//     let img = clipboard.readImage();
//     let bookmark = clipboard.readBookmark();
//
//     // 从托盘点击的不再复制
//     if (bookmark["title"] === "_f") {
//         return;
//     }
//
//     let now = get_date();
//
//     // 图片
//     let i_url = img.toDataURL()
//     let img_ret = i_url.length > 22 &&
//         type.some(value => {return value.split('/').some(value1 => ["png", "jpg", "jpeg"].includes(value1));}) &&
//         !text.endsWith('pdf');
//
//     // console.log(img_ret)  // TODO 发现一个bug, 在我机器上如果注释这一行, 代码走到这里会停止运行(ps: 已找到问题原因(console.log 在主进程中的问题, 没有进行输出))
//     if (img_ret) {
//         console.log()
//         let img_length = img.toBitmap().length
//         // 查找最后一个保存的资源 校验一下
//         db.findOne({"t": {'$lte': now}, "type": "image"}).sort({"t": -1}).exec((e, docs) => {
//             if (!docs || (docs && docs["length"] !== img_length)) {
//                 let _ = clipboard.read("public.file-url")
//                 db.insert({
//                     "t": now,
//                     "type": "image",
//                     "data": i_url,
//                     "length": img_length,
//                     "label": _.length === 0 ? get_date().toString() : _.replace("file://",'')
//                 });
//                 main_window.webContents.send("play_mp3")
//             }
//         });
//         return
//     }
//
//     // 文本/文件
//     let text_ret  = clipboard.read("public.file-url").replace("file://",'')
//     if (text_ret.length === 0) {
//         let text_length = text.length;
//         db.findOne({"t": {'$lte': now}, "type": "text"}).sort({"t":-1}).exec((e, docs) => {
//             if (!docs || (docs["length"] !== text_length || (text_length <= 3000 && docs["data"] !== text))) {
//                 db.insert({
//                     "t": now,
//                     "type": "text",
//                     "data": text,
//                     "length": text_length
//                 });
//                 main_window.webContents.send("play_mp3")
//             }
//         });}
//     else {
//         db.findOne({"t": {'$lte': now}, "type": "file"}).sort({"t":-1}).exec((e, docs)=>{
//             if (!docs || (docs["data"] !== text_ret)) {
//                 db.insert({
//                     "t": now,
//                     "type": "file",
//                     "data": text_ret,
//                     "length": text_ret.length
//                 });
//                 main_window.webContents.send("play_mp3")
//             }
//         })
//     }
//
//
//
// }, 100);
//
// // 创建图标对象
// let clipboard_icon = nativeImage.createFromPath(`${__static}/clipboard.png`)
//
// // 创建菜单对象
// let iconTray = new Tray(clipboard_icon);
//
// let set_tray_icon = (type, data)=>{
//     switch (type) {
//         case "text":
//             return nativeImage.createFromPath(`${__static}/text.png`)
//         case "image":
//             return nativeImage.createFromPath(`${__static}/image.png`)
//         case "file":
//             if (data.endsWith("/")) {
//                 return nativeImage.createFromPath(`${__static}/folder.png`);
//             } else {
//                 return nativeImage.createFromPath(`${__static}/file.png`)
//             }
//     }
// }
//
// let click_tray_item = (...args)=>{
//     // 托盘点击的留下 _f 标记
//     let [menu, view, e, type,data] = args;
//
//     switch (type) {
//         case "text":
//             clipboard.write({
//                 text: data,
//                 bookmark: "_f"
//             });
//             break
//         case "file":
//             // TODO
//             break
//         case "image":
//             clipboard.write({
//                 image: nativeImage.createFromDataURL(data),
//                 bookmark: "_f"
//             })
//             break
//     }
// }
//
// let base_menu = [
//     {
//         type: "separator"
//     },
//     {
//         label: "退出",
//         click: () => {
//             app.quit();  // 退出
//         }
//     }
// ];
//
// let set_tray_menu = () => {
//     db.find({})
//         .sort({"t": -1})
//         .limit(10)
//         .exec((err, docs) => {
//             let menus = []
//             for (let i of docs) {
//                 let type = i["type"];
//                 if (["file", "text"].includes(type)) {
//                     menus.push({
//                         "icon": i["type"] === "file" ? set_tray_icon(i["type"], i["data"]) : set_tray_icon(i["type"]),
//                         "label": i["length"] > 25 ? `${i["data"].substr(0, 8)} ... ${i["data"].substr(-15)}` : i["data"],
//                         "click":(menu, view, e)=>{
//                             click_tray_item(menu, view, e, i["type"], i["data"]);}
//                     })
//                 } else {
//                     menus.push({
//                         "icon": set_tray_icon(i["type"]),
//                         "label": i["label"].length > 25 ? `${i["label"].substr(0, 8)} ... ${i["label"].substr(-15)}` : i["label"],
//                         "click": (menu, view, e) => {
//                             click_tray_item(menu, view, e, i["type"], i["data"]);
//                         }
//                     })
//                 }
//             }
//
//             let tray_Menu = Menu.buildFromTemplate(menus.concat(base_menu));
//             iconTray.popUpContextMenu(tray_Menu)
//         });
// };
//
// iconTray.on("mouse-enter", set_tray_menu)
// iconTray.on("click",set_tray_menu)







