import Datastore from "nedb"
import path from "path"
// let {app} = require("electron")
import {remote} from "electron"

let app = remote.app

export default new Datastore({
    autoload: true,
    filename: path.join(app.getPath("userData"), "/data.db")
})


// let insert = () => {
//
// }
// let update = () => {
//
// }
// let find = () => {
//
// }
// let insert = () => {
//
// }
//
// export default {
//     insert:insert
// }
