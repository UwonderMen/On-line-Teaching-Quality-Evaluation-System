//相关验证验证
$().ready(function () {
    //登录验证
//    UserLogin.loginValidation(function (data) {
//        if (data == "false") {
//            var sth = {
//                closeButton: false,
//                buttons: { "确定": "ok" },
//                submit: function (d) {
//                    if (d == "ok") self.parent.location = '/Login.aspx';
//                }
//            };
//            jBox.alert("登陆超时！", "提示", sth);
//        }
//    });
});

// 去除前后空格
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
// 文本框只允许输入数字
function AllowNumber(value, e) {
    var key = window.event ? e.keyCode : e.which;
    if ((key > 95 && key < 106) || (key > 47 && key < 60) || key == 9) {

    } else if (key != 8) {
        if (window.event) //IE  
        {
            e.returnValue = false;   //event.returnValue=false 效果相同.  
        }
        else //Firefox  
        {
            e.preventDefault();
        }
    }
}
// 文本框只允许输入数字带小数点
function AllowNumberPoint(value, e) {
    var key = window.event ? e.keyCode : e.which;
    if ((key > 95 && key < 106) || (key > 47 && key < 60) || key == 9 || key == 190 || key == 110) {

    } else if (key != 8) {
        if (window.event) //IE  
        {
            e.returnValue = false;   //event.returnValue=false 效果相同.  
        }
        else //Firefox  
        {
            e.preventDefault();
        }
    }
}
// 文本框只允许输入数字带小数点和负号
function AllowNumberPointNe(value, e) {
    var key = window.event ? e.keyCode : e.which;
    if ((key > 95 && key < 106) || (key > 47 && key < 60) || key == 9 || key == 190 || key == 110 || key == 109) {

    } else if (key != 8) {
        if (window.event) //IE  
        {
            e.returnValue = false;   //event.returnValue=false 效果相同.  
        }
        else //Firefox  
        {
            e.preventDefault();
        }
    }
}
//html文本加码
function EnCodeHtml(content) {
    for (var i = 0; i < content.length; i++) {
        if (content.indexOf('<') >= 0 || content.indexOf('>') >= 0 || content.indexOf("\n") >= 0 || content.indexOf("\"") >= 0) {
            content = content.replace('<', '[lt]');
            content = content.replace('>', '[rt]');
            content = content.replace('\n', '[br]');
            content = content.replace('\"', '[yh]');
        }
        else {
            break;
        }
    }
    return content;
}
//html文本解码
function DeCodeHtml(content) {
    for (var i = 0; i < content.length; i++) {
        if (content.indexOf('[lt]') >= 0 || content.indexOf('[rt]') >= 0 || content.indexOf("[br]") >= 0 || content.indexOf("[yh]") >= 0) {
            content = content.replace('[lt]', '<');
            content = content.replace('[rt]', '>');
            content = content.replace('[br]', '\n');
            content = content.replace('[yh]', '\"');
        }
        else {
            break;
        }
    }
    return content;
}
//图片自动缩放
function getContentImageFristLoad(obj, width, height) {
    var layoutwidth = width;
    var layoutheight = height;

    var thiswidth = 0, thisheight = 0;
    var imgobj = document.createElement("img");
    imgobj.setAttribute("id", "imagecontentimg");
    imgobj.setAttribute("src", obj.attr("src"));
    imgobj.setAttribute("style", "display:none");
    document.body.appendChild(imgobj);
    var image = new Image();
    image.src = $("#imagecontentimg").attr("src");
    thiswidth = image.width;
    thisheight = image.height;
    imgobj.parentNode.removeChild(imgobj);

    if (width != height) {
        layoutwidth = width;
        layoutheight = thisheight * (width / thiswidth);
        if (layoutheight > height) {
            layoutwidth = layoutwidth * (height / layoutheight);
            layoutheight = height;
        }
        obj.width(layoutwidth);
        obj.height(layoutheight);
    }
    else {
        if (thiswidth > thisheight) {
            obj.width(width);
            obj.height(thisheight * (width / thiswidth));
            obj.css("marginTop", (width - (thisheight * (width / thiswidth))) / 2 + "px");
        }
        else if (thiswidth < thisheight) {
            obj.width(thiswidth * (height / thisheight));
            obj.height(height);
        }
        else {
            obj.width(width);
            obj.height(height);
        }
    }
}
//农历
function ChineseCalendar(dateObj) {
    this.dateObj = (dateObj != undefined) ? dateObj : new Date();
    this.SY = this.dateObj.getFullYear();
    this.SM = this.dateObj.getMonth();
    this.SD = this.dateObj.getDate();
    this.lunarInfo = [
        0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, 0x04ae0,
        0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, 0x04970, 0x0a4b0,
        0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, 0x06566, 0x0d4a0, 0x0ea50,
        0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, 0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0,
        0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, 0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0,
        0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, 0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260,
        0x0f263, 0x0d950, 0x05b57, 0x056a0, 0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558,
        0x0b540, 0x0b6a0, 0x195a6, 0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46,
        0x0ab60, 0x09570, 0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5,
        0x092e0, 0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
        0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, 0x07954,
        0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, 0x05aa0, 0x076a3,
        0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, 0x0b5a0, 0x056d0, 0x055b2,
        0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, 0x14b63];

    //传回农历 y年闰哪个月 1-12 , 没闰传回 0
    this.leapMonth = function (y) { return this.lunarInfo[y - 1900] & 0xf; };
    //传回农历 y年m月的总天数
    this.monthDays = function (y, m) { return (this.lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29; };
    //传回农历 y年闰月的天数
    this.leapDays = function (y) {
        if (this.leapMonth(y)) { return (this.lunarInfo[y - 1900] & 0x10000) ? 30 : 29; }
        else { return 0; }
    };
    //传回农历 y年的总天数
    this.lYearDays = function (y) {
        var i, sum = 348;
        for (i = 0x8000; i > 0x8; i >>= 1) {
            sum += (this.lunarInfo[y - 1900] & i) ? 1 : 0;
        }
        return sum + this.leapDays(y);
    };
    //算出农历, 传入日期对象, 传回农历日期对象
    //该对象属性有 .year .month .day .isLeap .yearCyl .dayCyl .monCyl
    this.Lunar = function (dateObj) {
        var i, leap = 0, temp = 0, lunarObj = {};
        var baseDate = new Date(1900, 0, 31);
        var offset = (dateObj - baseDate) / 86400000;
        lunarObj.dayCyl = offset + 40;
        lunarObj.monCyl = 14;
        for (i = 1900; i < 2050 && offset > 0; i++) {
            temp = this.lYearDays(i);
            offset -= temp;
            lunarObj.monCyl += 12;
        }
        if (offset < 0) {
            offset += temp;
            i--;
            lunarObj.monCyl -= 12;
        }
        lunarObj.year = i;
        lunarObj.yearCyl = i - 1864;
        leap = this.leapMonth(i);
        lunarObj.isLeap = false;
        for (i = 1; i < 13 && offset > 0; i++) {
            if (leap > 0 && i == (leap + 1) && lunarObj.isLeap == false) {
                --i;
                lunarObj.isLeap = true;
                temp = this.leapDays(lunarObj.year);
            }
            else { temp = this.monthDays(lunarObj.year, i) }
            if (lunarObj.isLeap == true && i == (leap + 1)) { lunarObj.isLeap = false; }
            offset -= temp;
            if (lunarObj.isLeap == false) { lunarObj.monCyl++; }
        }
        if (offset == 0 && leap > 0 && i == leap + 1) {
            if (lunarObj.isLeap) { lunarObj.isLeap = false; }
            else { lunarObj.isLeap = true; --i; --lunarObj.monCyl; }

        }
        if (offset < 0) { offset += temp; --i; --lunarObj.monCyl }
        lunarObj.month = i;
        lunarObj.day = offset + 1;
        return lunarObj;
    };
    //中文日期
    this.cDay = function (m, d) {
        var nStr1 = ['日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
        var nStr2 = ['初', '十', '廿', '卅', '　'];
        var s;
        if (m > 10) { s = '十' + nStr1[m - 10]; }
        else { s = nStr1[m]; }
        s += '月';
        switch (d) {
            case 10: s += '初十'; break;
            case 20: s += '二十'; break;
            case 30: s += '三十'; break;
            default: s += nStr2[Math.floor(d / 10)]; s += nStr1[d % 10];
        }
        return s;
    };
    this.solarDay2 = function () {
        var sDObj = new Date(this.SY, this.SM, this.SD);
        var lDObj = this.Lunar(sDObj);
        var tt = '农历' + this.cDay(lDObj.month, lDObj.day);
        lDObj = null;
        return tt;
    };
    this.weekday = function () {
        var day = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
        return day[this.dateObj.getDay()];
    };
    this.YYMMDD = function () {
        var dateArr = [this.SY, '年', this.SM + 1, '月', this.SD, '日'];
        return dateArr.join('');
    }
}
//获取地址参数
var Request = {
    QueryString: function (item) {
        var svalue = location.search.match(new 
        RegExp('[\?\&]' + item + '=([^\&]*)(\&?)', 'i'));
        return svalue ? svalue[1] : svalue;
    }
}
//数据库时间转换
function getLocalTime(date) {
    var dates = date.toString();
    var dateCount = dates.substr(dates.indexOf("(") + 1, dates.length - dates.indexOf("(") - 1 - 2);
    var datese = new Date();
    datese.setTime(dateCount);
    return datese;
}

//cookie的管理对象
var CookieManager = {
    //获取cookie，用普通方式
    getCookie: function (cookieName) {
        var cookieArray = document.cookie.split("; "); //得到分割的cookie名值对    
        var cookie = new Object();
        for (var i = 0; i < cookieArray.length; i++) {
            var arr = cookieArray[i].split("=");       //将名和值分开    
            if (arr[0] == name) return unescape(arr[1]); //如果是指定的cookie，则返回它的值    
        }
        return "";
    },
    //获取cookie，用正则
    getCookieToRegExp: function (cookieName) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) return unescape(arr[2]); return null;
    },
    //添加新cookie
    addCookie: function (cookieName, cookieValue, cookieHours) {
        var str = objName + "=" + escape(objValue);
        //为时不设定过期时间，浏览器关闭时cookie自动消失
        if (objHours > 0) {
            var date = new Date();
            var ms = objHours * 3600 * 1000;
            date.setTime(date.getTime() + ms);
            str += "; expires=" + date.toGMTString();
        }
        document.cookie = str;
    },
    //更新cookie的值
    setCookie: function (cookieName, cookieValue) {
        var Days = 30; //此 cookie 将被保存 30 天
        var exp = new Date();    //new Date("December 31, 9998");
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    },
    //删除cookie
    deleteCookie: function (cookieName) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = getCookie(name);
        if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    }
};



/* Created by Louis 
Begin */

// Ajax或通信方法 
function ajaxPost(url, dataMap, callback) {
    var urlRndCode = urlAddRandomCode(url);
    $.post(
        urlRndCode,
        dataMap,
        callback
    );
}
function ajaxGet(url, dataMap, callback) {
    var urlRndCode = urlAddRandomCode(url);
    $.get(
        urlRndCode,
        dataMap,
        callback
    );
}
function urlAddRandomCode(url) {
    var rndCode = Math.random(new Date().getTime() / 1000);
    rndCode = rndCode.toString().substring(2, 7);
    if (url.indexOf('?') >= 0) {
        url += "&_rnd=" + rndCode;
    }
    else {
        url += "?_rnd=" + rndCode;
    }
    return url;
}

//模拟弹窗，防止浏览器阻止弹窗
function openNewPage(url) {
    var a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("target", "_blank");
    a.setAttribute("id", "openwin");
    document.body.appendChild(a);
    a.click();
}

//将数字转换成中文
var _changeNumChinese = {
    ary0: ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"],
    ary1: ["", "十", "百", "千"],
    ary2: ["", "万", "亿", "兆"],
    init: function (name) {
        this.name = name;
    },
    strrev: function () {
        var ary = []
        for (var i = this.name.length; i >= 0; i--) {
            ary.push(this.name[i])
        }
        return ary.join("");
    }, //倒转字符串。
    pri_ary: function () {
        var $this = this
        var ary = this.strrev();
        var zero = ""
        var newary = ""
        var i4 = -1
        for (var i = 0; i < ary.length; i++) {
            if (i % 4 == 0) { //首先判断万级单位，每隔四个字符就让万级单位数组索引号递增
                i4++;
                newary = this.ary2[i4] + newary; //将万级单位存入该字符的读法中去，它肯定是放在当前字符读法的末尾，所以首先将它叠加入$r中，
                zero = ""; //在万级单位位置的“0”肯定是不用的读的，所以设置零的读法为空

            }
            //关于0的处理与判断。
            if (ary[i] == '0') { //如果读出的字符是“0”，执行如下判断这个“0”是否读作“零”
                switch (i % 4) {
                    case 0:
                        break;
                    //如果位置索引能被4整除，表示它所处位置是万级单位位置，这个位置的0的读法在前面就已经设置好了，所以这里直接跳过  
                    case 1:
                    case 2:
                    case 3:
                        if (ary[i - 1] != '0') {
                            zero = "零"
                        }
                        ; //如果不被4整除，那么都执行这段判断代码：如果它的下一位数字（针对当前字符串来说是上一个字符，因为之前执行了反转）也是0，那么跳过，否则读作“零”
                        break;

                }

                newary = zero + newary;
                zero = '';
            }
            else { //如果不是“0”
                newary = this.ary0[parseInt(ary[i])] + this.ary1[i % 4] + newary; //就将该当字符转换成数值型,并作为数组ary0的索引号,以得到与之对应的中文读法，其后再跟上它的的一级单位（空、十、百还是千）最后再加上前面已存入的读法内容。
            }

        }
        if (newary.indexOf("零") == 0) {
            newary = newary.substr(1)
        } //处理前面的0
        return newary;
    }
}

//创建class类
function changeNumChinese() {
    this.init.apply(this, arguments);
}
changeNumChinese.prototype = _changeNumChinese

//替换第一个出现的匹配字符
function replaceFirst(str1, oldStr, newStr) {
    var pos = str1.indexOf(oldStr);
    return str1.substring(0, pos) + newStr + ((pos < str1.length) ? str1.substr(pos + oldStr.length) : "");
}
String.prototype.trim = function () {
    // 用正则表达式将前后空格  
    // 用空字符串替代。  
    return this.replace(/(^\s*)|(\s*$)/g, "");
}

/* End */