
let str_util = (str) => str["length"] > 25 ? `${str.substr(0, 8)} ... ${str.substr(-15)}` : str

export default str_util