import {clipboard, BrowserWindow} from "electron"
import plist from "plist"
import get_date from "../utils/date";
import str_util from "../utils/str_util";
import db from './MainDB'

// 判断是否是文件相关
let hasClipboardFiles = () => clipboard.has('NSFilenamesPboardType');

// 指定间隔 检查一下系统剪切板进行判断保存
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

        // 过滤从系统托盘点击的
        let last_path = paths[length - 1];
        if (last_path === "/_f") return;

        if (length > 1) {
            // 组合文件和文件夹
            type = "files_paths";
            title = t.toString() + ` .. 等 ${length} 个项目`
        } else {
            // 单文件或单文件夹
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

        // 过滤从系统托盘点击的
        if (clipboard.readBookmark()["title"] === "_f") return;

        if (clipboard.readImage().isEmpty()) {
            // 文本
            type = "text";
            data = clipboard.readText()
            length = data.length
            // 全空白字符特殊处理
            if (data.replace(/ /g, "").replace(/\n/g, "").length === 0) {
                title = `${length} 个空白字符`
            } else {
                title = str_util(data);
            }
        } else {
            // 匿名图片
            type = "nimg"
            title = t.toString()
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
},100)


// 校验完毕保存
let save_obj = (obj) => {
    let type = obj["type"];

    db.findOne({type})
        .sort({"t": -1})
        .exec((_, docs) => {
            // 判断是否是清除数据库后记录的
            // if (docs && docs["last_title"] && docs["last_title"] == obj["title"]) {
            //     return;
            // }
            // console.log( docs && docs["last_title"], obj["title"])
            // console.log(docs)


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



