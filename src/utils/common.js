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
//补零
export function append_zero(obj) {
    if (obj < 10) return '0' + '' + obj;
    else return obj;
}
//uuid
export function uuid() {
    let s = [];
    let hexDigits = '0123456789ABCDEF';
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = '4';  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-';
    return (s.join('')).toUpperCase();
}
//转化时间
export function conversion_time(time) {
    return time.getFullYear() + '-' + prefixInteger((time.getMonth() + 1), 2) + '-' +
        prefixInteger(time.getDate(), 2) +
        ' ' + prefixInteger(time.getHours(), 2) + ':' + prefixInteger(time.getMinutes(), 2);
}
//单条件排序
export function sortByKey(array, key, sortBy) {
    return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        if (sortBy == "Asc") {
            return x - y;
        } else if (sortBy == "Des") {
            return y - x;
        }
    })
}
//多条件排序
export function getSort(fn) {
    return function (a, b) {
        var ret = 0;

        if (fn.call(this, a, b)) {
            ret = -1;
        } else if (fn.call(this, b, a)) {
            ret = 1;
        }

        return ret;
    }
}
export function getMutipSort(arr) {
    return function (a, b) {
        var tmp, i = 0;

        do {
            tmp = arr[i++](a, b);
        } while (tmp == 0 && i < arr.length);

        return tmp;
    }
}

export function arrayIntersect(a, b) {
    // return a.filter(function (v) { return b.indexOf(v) > -1 })
    return a.filter(item => b.includes(item));
};

export function arrayRemoveItem(arr, item) {
    arr.forEach(v => {
        let index = arr.indexOf(null);
        if (index != -1) {
            arr.splice(index, 1);
        }
    })
    return arr;
}

//数组的值是不是全部相同
export function isAllEqual(array) {
    if (array.length > 0) {
        return !array.some(function (value, index) {
            return value !== array[0];
        });
    } else {
        return true;
    }
}
//两个数组是否相等
export function arrayEquals(value1 = [], value2 = []) {
    let hash = copy(value2);
    if (value1.length === value2.length) {
        for (let i = 0; i < value1.length; i++) {
            const index = hash.indexOf(value1[i]);
            if (index > -1) {
                hash.splice(index, 1);
            } else {
                return false;
            }
        }
        return true;
    }
    return false;
}
function copy(value) {
    return JSON.parse(JSON.stringify(value));
}