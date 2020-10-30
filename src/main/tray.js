import {nativeImage,clipboard, Tray, Menu, app, BrowserWindow,screen} from "electron";
import plist from "plist"

import db from "./MainDB"
import get_date from "../utils/date";

// 创建图标对象
let clipboard_icon = nativeImage.createFromPath(`${__static}/clipboard.png`)

// 创建菜单对象
let iconTray = new Tray(clipboard_icon);

// 基础菜单
let base_menu = [
    {
        type: "separator"
    },
    {
        label: "清除所有记录",
        click:() => {
            // 清除之后, 数据库中空了, 防止 watchclipboard 检测再次把剪切板存在的数据写入数据库中
            db.find({})
            .sort({"t": -1})
            .limit(1).exec((_,docs)=>{
                let [{t,type,data,paths,length}] = docs
                db.remove({}, { multi: true }, function (err, numRemoved) {})
                db.insert({data, type, paths, length})
            })
        }
    },
    {
        label: "退出",
        click: () => app.quit()  // 退出
    }
];


// 点击菜单item 的回调
let click_tray_item = ({type, data, paths})=>{
    // 托盘点击的 留下标记
    let obj = {"bookmark": "_f"}  // 文本或匿名图片
    if (paths) {  // 文件相关
        paths.push("/_f")
    }

    switch (type) {
        case "text":
            obj["text"] = data;
            break;
        case "nimg":
            obj["image"] = NativeImage.createFromDataURL(data);
            break;
        case "img":
            clipboard.writeBuffer('NSFilenamesPboardType', Buffer.from(plist.build(paths)));
            break;
        case "file":
            clipboard.writeBuffer('NSFilenamesPboardType', Buffer.from(plist.build(paths)));
            break;
        case "files":
            clipboard.writeBuffer('NSFilenamesPboardType', Buffer.from(plist.build(paths)));
            break;
        case "files_paths":
            clipboard.writeBuffer('NSFilenamesPboardType', Buffer.from(plist.build(paths)));
            break;
    }

    show_mini_window()

    clipboard.write(obj)
}

let show_mini_window = ()=>{
    let [main_window] = BrowserWindow.getAllWindows();
    let displays = screen.getAllDisplays();
    let externalDisplay = displays.find((display) => {
        return display.bounds.x !== 0 || display.bounds.y !== 0  || display.workArea.x !== 0 || display.workArea.y !== 0
    });


    let child = new BrowserWindow({
        parent: main_window,
        x: parseInt(externalDisplay.bounds.width / 1.4),
        y: parseInt(externalDisplay.bounds.height / 15),
        width:150,
        height:90,
        alwaysOnTop: true,
        transparent: true,
        resizable: false,
        frame: false,
        useContentSize: false,
        webPreferences:{
            devTools: false,  // 调试模式
        }
    });
    try {
        child.loadFile(`${__static}/miniwindow.html`);
        child.once("ready-to-show", () => {
            child.show();
        });

        setTimeout(() => {
            if (BrowserWindow.getAllWindows().length > 1) {
                child.close()
            }
        }, 1200);
    }catch (e) {
        child.close()
        child = null
    }


}


// 设置菜单 的回调
let set_tray_menu = () => {
    db.find({"t":{'$exists': 1},"title":{'$exists': 1},"length":{'$exists': 1}})
        .sort({"t": -1})
        .limit(30)
        .exec((err, docs) => {
            let menus = []
            for (let i of docs) {
                try {
                    menus.push({
                        label: i["title"],
                        icon: `${__static}/${i["type"]}.png`,
                        click: () => click_tray_item(i), // 闭包捕获
                    })
                }catch (e) {
                    continue
                }
            }
            let tray_Menu = Menu.buildFromTemplate(menus.concat(base_menu));
            iconTray.popUpContextMenu(tray_Menu)
        });
};

iconTray.on("mouse-enter", set_tray_menu)
iconTray.on("click",set_tray_menu)


