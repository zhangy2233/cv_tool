

function get_date() {

    let f = (t) => t > 9 ? t : "0" + t;

    let date = new Date();
    let year = date.getFullYear();//年；
    let month = date.getMonth()+1;  //月份，月份从0开始计算，所以要加1
    let day = date.getDate();  //日
    let hour = date.getHours();  //时
    let minute = date.getMinutes();  //分
    let second = date.getSeconds();  //秒

    return parseInt(`${year}${f(month)}${f(day)}${f(hour)}${f(minute)}${f(second)}`.toString())
}

export default get_date