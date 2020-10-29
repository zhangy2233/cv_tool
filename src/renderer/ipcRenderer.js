import {remote,clipboard} from "electron"
import plist from "plist"
import get_date from "../utils/date";
import str_util from "../utils/str_util";
import db from "../utils/datastore"
let BrowserWindow = remote.BrowserWindow
let Tray = remote.Tray

let hasClipboardFiles = () => clipboard.has('NSFilenamesPboardType');

setInterval(()=>{
    let type = null;  // 类型: 文件(file), 文件夹(files), 文本(text), 匿名图片(nimg), 图片(img), 组合文件和文件夹(files_paths)
    let title = null;  // 名称: 文件,文件夹,图片,文本 超过30位截取, 组合文件夹以及匿名图片使用时间
    let data = null;  // 文件,文件夹,图片,组合文件和文件夹 为null, 匿名图片使用base64, 文本直接保存
    let paths = null;  // 文件,文件夹,图片,组合文件和文件夹 为array, 匿名图片以及文本 为null
    let length = null;  // data 或 paths 长度

    let t = get_date();
    if (hasClipboardFiles()) {
        // 判断文件或路径
        paths = plist.parse(clipboard.read('NSFilenamesPboardType'))
        length = paths.length
        if (length > 1) {
            // 组合文件和文件夹
            type = "files_paths";
            title = t
        } else {
            // 单文件
            let [path] = paths;
            if (clipboard.read('public.file-url').endsWith("/")) {
                // 文件夹(目前只要以 / 结尾的都判定为文件夹)
                type = "files";
                title = str_util(path)
            } else {
                if (["png", "jpeg", "ico", "png"].some(value => path.endsWith(value))) {
                    // 图片类型
                    type = "img";
                    title = str_util(path)
                } else {
                    // 其他类型
                    type = "file";
                    title = str_util(path)
                }
            }
        }
    } else {
        // 匿名图片或文本
        if (clipboard.readImage().isEmpty()) {
            // 文本
            type = "text";
            data = clipboard.readText()
            title = str_util(data);
            length = data.length
        } else {
            // 匿名图片
            type = "nimg"
            title = t
            data = clipboard.readImage().toDataURL()
            length = data.length
        }
    }

    save_obj({
        t,
        title,
        type,
        data,
        length,
        paths
    })
},1000)

db.remove({}, { multi: true }, function (err, numRemoved) {
});

let save_obj = (obj) => {
    let type = obj["type"];

    db.find({}).exec((_,docs)=>{
        // console.log(docs)
    })

    db.findOne({type})
        .sort({"t": -1})
        .exec((_, docs) => {
            // 如果找到了历史, 且长度相同(初筛), 继续进行判断
            if (docs && docs["length"] === obj["length"]) {
                switch (type) {
                    case "text":
                        // 直接使用 === 操作, 实测 === 和 == 操作 对 16w 个字符花费0.3ms, 但是 === 比 == 稍快
                        if (docs["data"] === obj["data"]) return;
                        break
                    case "nimg":
                        if (docs["data"] === obj["data"]) return;
                        break;
                    case "img":
                        if (docs["paths"].every((value)=>obj["paths"].includes(value))) return;
                        break;
                    case "file":
                        if (docs["paths"].every((value)=>obj["paths"].includes(value))) return;
                        break;
                    case "files":
                        if (docs["paths"].every((value)=>obj["paths"].includes(value))) return;
                        break;
                    case "files_paths":
                        if (docs["paths"].every((value)=>obj["paths"].includes(value))) return;
                        break;
                }
            }

            // 保存成功
            db.insert(obj)
            let [main_window] = BrowserWindow.getAllWindows();
            main_window.webContents.send("play_mp3")
        });
}


// 系统托盘
console.log(Tray)

