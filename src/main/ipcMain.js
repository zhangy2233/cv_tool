
let {ipcMain,BrowserWindow} = require("electron");

ipcMain.on("action",(_,msg)=>{
    let [main_window] = BrowserWindow.getAllWindows()

    switch (msg) {
        case "mouseenter":
            main_window.setSize(100,248)
            break
        case "mouseout":
            setTimeout(()=>{
                main_window.setSize(20,248)
            },100)
            break
    }
})