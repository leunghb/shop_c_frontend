//验证邮箱
export function isEmail(str) {
    if (str.charAt(0) == "." || str.charAt(0) == "@" || str.indexOf('@', 0) == -1 ||
        str.indexOf('.', 0) == -1 || str.lastIndexOf("@") == str.length - 1 ||
        str.lastIndexOf(".") == str.length - 1 ||
        str.indexOf('@.') > -1)
        return false;
    else
        return true;
}
//验证平台
export function platformLimit() {
    let system = {};
    let p = navigator.platform;
    let u = navigator.userAgent;
    system.win = p.indexOf("Win") == 0;
    system.mac = p.indexOf("Mac") == 0;
    system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
    if (system.win || system.mac || system.xll) {//如果是PC转
        if (u.indexOf('Windows Phone') > -1) { //win手机端
            return false;
        } else {
            return true;
        }
    }
    return false;
}
//获取cookie
export function getCookie(c_name) {
    if (document.cookie.length > 0) {
        let c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            let c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}