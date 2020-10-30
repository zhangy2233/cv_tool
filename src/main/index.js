import { app, BrowserWindow ,screen} from 'electron'

// 隐藏dock
app.dock.hide()

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */

  mainWindow = new BrowserWindow({
    x: 0,
    y: 500,
    useContentSize: false,
    width:20,
    height:248,
    frame: false,  // 无边框
    transparent: true,  // 透明窗口
    alwaysOnTop: true,  // 一直在顶层
    focusable:false, // 禁止聚焦
    resizable:false,  // 禁止通过鼠标拖动放大缩小
    webPreferences: {
      // devTools: false,  // 调试模式
      enableRemoteModule:true  // 允许渲染进程使用 remote
    },
  });

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // 引入ipcMain
  require("./ipcMain")
  // 引入系统托盘号
  require("./tray")
  // 引入剪切板监视器
  require("./WatchClipboard")
}


app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
