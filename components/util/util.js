// .-----------------------------------------------------------------------------------
// | Filename: util.js
// | Description: 妤ｅ潡妾遍幋顔垮姺閼村矁鍔规す纾嬪
// | Date: 2015-07-4
// | Site: http://www.to8to.com
// |-----------------------------------------------------------------------------------
// | Author: Danny <danny.kon@corp.to8to.com>
// | Copyright (c) 2012-2014, http://www.to8to.com. All Rights Reserved.
// |-----------------------------------------------------------------------------------
//


(function (root, factory) {
    if (typeof exports === 'object') {
        //CommonJS
        module.exports = factory();
    } else if (typeof define === 'function') {
        //CMD or AMD
        define(factory);
    } else {
        //Normal
        root.Common = factory();

    }
})(window, function (require, exports, module) {
    
    var util = {
    	version: 0.1
    };
   
    util.noop = function() {};

    /**
	 * util-array.js - The Array support
	 */

	util.indexOfArray = function(arr , item){
	    if(Array.prototype.indexOf){
	        return arr.indexOf(item);
	    }else{
	        for(var i = 0; i < arr.length; i++){
	            if(item === arr[i]){
	                return i;
	            }
	        }
	        return -1;
	    }  
	}

	util.removeArray = function(arr,items) {
	    var result = arr.slice(0) , index;
	    util.isArray(items) || ( items = [items] );
	    for(var i = 0,len = items.length; i < len; i++){
	        if( ( index = util.indexOfArray( result , items[i] ) ) >= 0){
	            result.splice( index , 1 );
	        }
	    }
	/*  var result = [], flag;
	    for(var i = 0,arrlen = arr.length; i <arrlen ;i++){
	        flag = true
	        for(var j = 0,itemslen = items.length; j < itemslen; j++){
	            if (items[j] === arr[i]){
	                flag = false;
	            }
	        }
	        if(flag){
	            result[result.length] = arr[i];
	        }
	    }*/

	   /* var result = arr.slice(0);
	    for(var i = 0,len = items.length; i < len; i++){
	        //閼村啿鐎懘顏囧绾板矂绠嶉懘銊ㄧ煀閼粹剝鍩夋ご浣哥崯閼搭參妾甸懘锝堝姤
	        for(var j = resule.length; j>=0; j--){
	            if(items[i] === result[j]){
	                result.splice(j, 1);
	            }
	        }
	    }
	    */
	    return result;
	}


    util.each = function(obj, iterator, context) {
        var i, key;
        if (this.type(obj) === "number") {
            for (i = 0; i < obj; i++) {
                iterator(i, i);
            }
        } else if (obj.length === +obj.length) {
            for (i = 0; i < obj.length; i++) {
                if (iterator.call(context, obj[i], i, obj) === false) break;
            }
        } else {
            for (key in obj) {
                if (iterator.call(context, obj[key], key, obj) === false) break;
            }
        }
	};


	/**
	 * util-string.js - The String support
	 */
	//閼囱勭梾妞翠礁鐛熼懘瀹犲姍鐠侯垱鐥呮ス鎾崇爱閼村疇閿ら崡銈堝姺绾板矁鍓炬す纾嬪姉鐠у倸闄
	util.leftTrim = function(value) {
	    return value.replace(/^\s*/, ""); //^鐠侯垱鐥呭鐐跺妧閸椼倝鎼懘銏″焿妤规捁鍔旀す鎾閼淬儴鐭捐ぐ鏇㈢氨閼村疇閿ら崡銈堝姺闂勫棝鍙鹃懘銊ㄥ姀閼存繃銈奸懘婊呮锤
	}

	//閼囱勭梾妞翠礁鐛熼懘瀹犲姍鐠侯垱鐥呮ス鎾崇爱閼搭偉鍔掗崡銈堝姺绾板矁鍓炬す纾嬪姉鐠у倸闄
	util.rightTrim = function(value) {
	    return value.replace(/\s*$/, "");
	}

	//閼囱勭梾妞翠礁鐛熼懘瀹犲姍鐠侯垱鐥呮ス鎾崇爱閼存洟妾伴崡銈堝姺绾板矁鍓炬す纾嬪姉鐠у倸闄
	util.trim = function(value) {
	    return value.replace(/(^\s*)|(\s*$)/g, "");
	}



    /**
     * util-lang.js - The minimal language enhancement
    */
    util.isType = function type(obj) {
        return Object.prototype.toString.call(obj).match(/\[object (\w+)\]/)[1].toLowerCase();
    };

    util.each("String Object Array RegExp Function Boolean".split(" "), function(value) {
        util["is" + value] = function(obj) {
            return util.isType(obj) === value.toLowerCase();
        };
    });

    util.isObjectOrArray = function(value) {
        return util.isObject(value) || util.isArray(value);
    };
    util.isNumeric = function(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    };
    util.isNullObject = function(value){
	    for(var i in value){
	        if(value.hasOwnProperty(i)){
	            return false;
	        }
	    }
	    return true;
	}




	/**
	 * util-transform.js - The transform support
	 */    

	//闂勫棜濮﹂懘瀹犲姍鐠侯垱鐥呮ス鎾崇爱閼存娊妾电粋鍕洨閼达箓妾閼淬垹鐛熼懘瀹犲姍
	util.stringToFloat = function(str) {
	    var strValue, decRtn;
	    //闂囪尪鍔栭梾鍡樺箠妤规捁濮﹂懘鐘崇樅閾忓繗鍔嶉懘銏犵崯闂呭棗宕甸懘鎷屽姀绾板矁鍓鹃梾鍡樺箠鐠侯垵鍔呴懘銏犵崯閼村疇鍔欓懘銊ㄥ妼閼淬倛鍔ラ懘銏ｅ閼村疇鍔欑捄顖涚梾闂呭棗宕甸梽鍡涘従閼淬劏鍔忔ス鎾斥枌閼村矂鎼
	    strValue = str.replace(/,/g, "");
	    decRtn = (isNaN(parseFloat(strValue)) ? 0 : parseFloat(strValue));
	    return decRtn;
	}

	//闂勫棜濮﹂梾鍡樺箠閼村疇鍔欑捄顖涚梾妤规挸绨梾鍡楀吹閼存娊妾电粋鍕洨閼达箓妾甸梾鍡樺箠閼搭喗鐥呴懘銏犵崯閼村疇鍔欓梾鍡楀吹
	util.stringToInt = function(strPara) {
	    var strValue,intRtn;
	    //闂囪尪鍔栭梾鍡樺箠妤规捁濮﹂懘鐘崇樅閾忓繗鍔嶉懘銏犵崯闂呭棗宕甸懘鎷屽姀绾板矁鍓鹃梾鍡樺箠鐠侯垵鍔呴懘銏犵崯閼村疇鍔欓懘銊ㄥ妼閼淬倛鍔ラ懘銏ｅ閼村疇鍔欑捄顖涚梾闂呭棗宕甸梽鍡涘従閼淬劏鍔忔ス鎾斥枌閼村矂鎼
	    strValue = strPara.replace(/,/g, "");
	    intRtn = (isNaN(parseInt(strValue)) ? 0 : parseInt(strValue));
	    return intRtn;
	}

	/**
	 * 鐠у倸闄勯懘銏ゆ缁傚嫮鍊濋懘銏犵崯閼村疇鍔欓懘褑鍔栭懘銏″焿鐠侯垶妾伴懘銏ゆ
	 * 閼搭偉鍓荤捄顖滅槵
	 * formatNumber(12345.999,'#,##0.00');
	 * formatNumber(12345.999,'#,##0.##');
	 * formatNumber(123,'000000');
	 * @param num
	 * @param pattern
	 */
	function formatNumber(num, pattern) {
	    var strarr = num ? num.toString().split('.') : ['0'];
	    var fmtarr = pattern ? pattern.split('.') : [''];
	    var retstr = '';
	    // 閼搭喗鐥呴懘銏犵崯閾忓繘鈹愮捄顖濆姍   
	    var str = strarr[0];
	    var fmt = fmtarr[0];
	    var i = str.length - 1;
	    var comma = false;
	    for (var f = fmt.length - 1; f >= 0; f--) {
	        switch (fmt.substr(f, 1)) {
	            case '#':
	                if (i >= 0) retstr = str.substr(i--, 1) + retstr;
	                break;
	            case '0':
	                if (i >= 0) retstr = str.substr(i--, 1) + retstr;
	                else retstr = '0' + retstr;
	                break;
	            case ',':
	                comma = true;
	                retstr = ',' + retstr;
	                break;
	        }
	    }
	    if (i >= 0) {
	        if (comma) {
	            var l = str.length;
	            for (; i >= 0; i--) {
	                retstr = str.substr(i, 1) + retstr;
	                if (i > 0 && ((l - i) % 3) == 0) retstr = ',' + retstr;
	            }
	        } else retstr = str.substr(0, i + 1) + retstr;
	    }

	    retstr = retstr + '.';
	    // 妤规挸鈻岄懘宀勬惎閼淬劑娈曢懘銏犵崯閾忓繘鈹愮捄顖濆姍   
	    str = strarr.length > 1 ? strarr[1] : '';
	    fmt = fmtarr.length > 1 ? fmtarr[1] : '';
	    i = 0;
	    for (var f = 0; f < fmt.length; f++) {
	        switch (fmt.substr(f, 1)) {
	            case '#':
	                if (i < str.length) retstr += str.substr(i++, 1);
	                break;
	            case '0':
	                if (i < str.length) retstr += str.substr(i++, 1);
	                else retstr += '0';
	                break;
	        }
	    }
	    return retstr.replace(/^,+/, '').replace(/\.$/, '');
	}


	//妤ｅ灝鈻岄懘娑滃姶閹枫垺缍栭懘銏犲吹瑜版洜娲哥挧鍌氶檮閼淬垽妾扮喊宀冨壘閼存娊妾电粋鍕洨
	//绾板本顣懘顐ュ壔鐠侯垶妾扮捄顖滅槵閹枫垺缍util.dateToString(new Date(),"yyyy-MM-dd HH:mm:ss")        
	util.dateToString = function(date,format) {
	    var M = date.getMonth() + 1,
	        H = date.getHours(),
	        m = date.getMinutes(),
	        d = date.getDate(),
	        s = date.getSeconds();
	    var n = {
	        'yyyy': date.getFullYear(),
	        'MM': fillNum(M),
	        'M': M,
	        'dd': fillNum(d),
	        'd': d,
	        'HH': fillNum(H),
	        'H': H,
	        'mm': fillNum(m),
	        'm': m,
	        'ss': fillNum(s),
	        's': s
	    };
	    return format.replace(/([a-zA-Z]+)/g, function(s, $1) {
	        return n[$1];
	    });
	}

	//妤ｅ灝鈻岄懘娑滃姶閹枫垺缍栭懘銏犲吹瑜版洜娲哥挧鍌氶檮閼淬垽妾扮喊宀冨壘閼存娊妾电粋鍕洨
	//绾板本顣懘顐ュ壔鐠侯垶妾扮捄顖滅槵閹枫垺缍util.stringToDate('2015-01-27 22:22:22','yyyy-MM-dd HH-mm-ss') 
	// util.stringToDate = function (strDate,format){
	//     format = format || 'yyyy-MM-dd HH:mm:ss';
	//     try{
	//         var arrDate = strDate.match(/\d+/g),
	//             arrFormat = format.match(/([a-zA-Z]+)/g),
	//             year = parseInt(arrDate[util.indexOf(arrFormat,'yyyy')]),
	//             month = parseInt(arrDate[util.indexOf(arrFormat,'MM')]) -1,
	//             date = parseInt(arrDate[util.indexOf(arrFormat,'dd')]),
	//             hour = parseInt(arrDate[util.indexOf(arrFormat,'HH')]),
	//             minute = parseInt(arrDate[util.indexOf(arrFormat,'mm')]),
	//             second = parseInt(arrDate[util.indexOf(arrFormat,'ss')]);
	//         return new Date(year,month,date,hour,minute,second);
	//     }catch(e){
	//         return null;
	//     }
	// };
	util.stringToDate = function (strDate,format){
	    format = format || 'yyyy-MM-dd HH:mm:ss';
	    try{
	        var year = getPartDate(strDate, format, 'yyyy'),
	            month = getPartDate(strDate, format, 'MM'),
	            date = getPartDate(strDate, format, 'dd'),
	            hour = getPartDate(strDate, format, 'HH'),
	            minute = getPartDate(strDate, format, 'mm'),
	            second = getPartDate(strDate, format, 'ss');
	        if(year===''&&month===''&&date===''&&hour===''&&minute===''&&second===''){
	            return null;
	        }else{
	            month = month - 1 < 0 ? '':month - 1;
	            return new Date(year,month,date,hour,minute,second);
	        }
	    }catch(e){
	        return null;
	    }

	    function getPartDate(strDate, format, formatPart){
	        var idx = format.indexOf(formatPart),
	            part;
	        if(idx < 0){
	            part =  '';
	        }else{
	            part = parseInt(strDate.substr(idx , formatPart.length));
	            part = isNaN(part) ? '' : part;
	        }
	        return part;
	    }
	};

	//閼村疇鍔欑捄顖涚梾妤规挸绨懘鎶芥閼寸姾鍔楅懘婵婂姰閹枫垹宕瞫trDate閼搭亪妾甸懘鎶芥閼达箓妾甸懘鐘哄姉閼存繆鍔挧鍌氶檮閼淬垽妾扮喊宀冨壘閼村疇鍔欑捄顖涚梾妤规挸绨閼寸姾骞楅幏銏＄稏"2012-05-09"
	// function stringToDate(strDate) {
	//     var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/,
	//         function(a) {
	//             return parseInt(a, 10) - 1;
	//         }).match(/\d+/g) + ')');
	//     return date;
	// }



    /*
     * 指定数字获取日期
     */
    util.changeDate=function(val) {
        var currdate = "";
        var date = new Date();
        if (val == 0) {
            var month=date.getMonth() + 1;
            month=month<10 ? ("0"+month):month;
            var day=date.getDate();
            day=day<10 ? ("0"+day):day;
            currdate = date.getFullYear() + "-" + month + "-" + day;
        } else {
            if (util._chkdate(currdate)) {
                var dates = currdate.split("-");
                dates[1] = dates[1].replace(/^0/g, '');
                dates[2] = dates[2].replace(/^0/g, '');
                var currdate = util._dayAddDiff(parseInt(dates[0]), parseInt(dates[1]), parseInt(dates[2]), val);
            } else {
                var currdate = util._dayAddDiff(parseInt(date.getFullYear()), parseInt(date.getMonth() + 1), parseInt(date.getDate()), val);
            }

        }
        return currdate;
    };

    util._dayAddDiff=function(year, month, day, diff) {
        var numDays = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
        var isLeap = false;
        var newyear = year;
        var newmonth = month - 1;
        var n = numDays[newmonth];
        var newday = day;
        var newdiff = diff;
        var ln;
        if (newmonth == 0) ln = 31;
        else if (newmonth == 11) ln = 31;
        else ln = numDays[newmonth + 1];
        if (diff != 0) {
            // 判断是否润年
            if (year % 4 == 0) {
                if (year % 100 != 0) isLeap = true;
                else {
                    if (year % 400 == 0) isLeap = true;
                }
            }
            if (newmonth == 1 && isLeap)++n;

            if (newmonth == 0 && isLeap)++ln;
            // 加值
            var newday = day + newdiff;
            if (newday > 0) {
                if (newday > n) {
                    newday = newday - n;
                    if (newmonth == 11) {
                        newmonth = 0;
                        newyear += 1;
                        newdiff = newday - 1;
                        return util._dayAddDiff(newyear, newmonth + 1, 1, newdiff);
                    } else {
                        newmonth += 1;
                        newdiff = newday - 1;
                        return util._dayAddDiff(newyear, newmonth + 1, 1, newdiff);
                    }
                }
            } else if (newday == 0) {
                if (newmonth == 0) {
                    newmonth = 11;
                    newyear += -1;
                    newday = 31;
                } else {
                    newmonth += -1;
                    newday = numDays[newmonth];
                }
            } else {
                if (newmonth == 0) {
                    newmonth = 11;
                    newyear += -1;
                    newdiff = newday;
                    newday = 31;
                    return util._dayAddDiff(newyear, newmonth + 1, newday, newdiff);
                } else {
                    newmonth += -1;
                    newdiff = newday;
                    newday = ln;
                    return util._dayAddDiff(newyear, newmonth + 1, newday, newdiff);
                }
            }
        }
        // 输出字符串
        var daystring = "";
        daystring += year;
        newmonth += 1;
        if (newmonth < 10) daystring += "-0" + newmonth;
        else daystring += "-" + newmonth;
        if (newday < 10) daystring += "-0" + newday;
        else daystring += "-" + newday;
        return daystring;
    }

    util._chkdate=function(datestr) {
        var lthdatestr
        if (datestr != "") lthdatestr = datestr.length;
        else lthdatestr = 0;

        var tmpy = "";
        var tmpm = "";
        var tmpd = "";
        var datestr;
        var status;
        status = 0;
        if (lthdatestr == 0){
            return false;   
        }
        
        for (i = 0; i < lthdatestr; i++) {
            if (datestr.charAt(i) == '-') {
                status++;
            }
            if (status > 2) {
                return false;
            }
            if ((status == 0) && (datestr.charAt(i) != '-')) {
                tmpy = tmpy + datestr.charAt(i)
            }
            if ((status == 1) && (datestr.charAt(i) != '-')) {
                tmpm = tmpm + datestr.charAt(i)
            }
            if ((status == 2) && (datestr.charAt(i) != '-')) {
                tmpd = tmpd + datestr.charAt(i)
            }

        }
        year = new String(tmpy);
        month = new String(tmpm);
        day = new String(tmpd);
        tempdate = new String(year + month + day);
        if ((tmpy.length != 4) || (tmpm.length > 2) || (tmpd.length > 2)) {
            return false;
        }
        if (! ((1 <= month) && (12 >= month) && (31 >= day) && (1 <= day))) {
            return false;
        }
        if (! ((year % 4) == 0) && (month == 2) && (day == 29)) {
            return false;
        }
        if ((month <= 7) && ((month % 2) == 0) && (day >= 31)) {
            return false;

        }
        if ((month >= 8) && ((month % 2) == 1) && (day >= 31)) {
            return false;
        }
        if ((month == 2) && (day == 30)) {
            return false;
        }
        return true;
    }


	/**
	 * util-uuid.js - The uuid support
	 */

	util.UUID = function(){
		//  Javascript閼达紕鍙呮ご浣藉妵UUID  On creation of a UUID object, set it's initial value
		//  绾板本顣懘顐ュ壔鐠侯垶妾扮捄顖滅槵閹枫垺缍朥UID.prototype.createUUID()
		function UUID() {
		    this.id = this.createUUID();
		}

		// When asked what this Object is, lie and return it's value
		UUID.prototype.valueOf = function() {
		    return this.id;
		};
		UUID.prototype.toString = function() {
		    return this.id;
		};

		//
		// INSTANCE SPECIFIC METHODS
		//
		UUID.prototype.createUUID = function() {
		    //
		    // Loose interpretation of the specification DCE 1.1: Remote Procedure Call
		    // since JavaScript doesn't allow access to internal systems, the last 48 bits
		    // of the node section is made up using a series of random numbers (6 octets long).
		    // 
		    var dg = new Date(1582, 10, 15, 0, 0, 0, 0);
		    var dc = new Date();
		    var t = dc.getTime() - dg.getTime();
		    var tl = UUID.getIntegerBits(t, 0, 31);
		    var tm = UUID.getIntegerBits(t, 32, 47);
		    var thv = UUID.getIntegerBits(t, 48, 59) + '1'; // version 1, security version is 2
		    var csar = UUID.getIntegerBits(UUID.rand(4095), 0, 7);
		    var csl = UUID.getIntegerBits(UUID.rand(4095), 0, 7);

		    // since detection of anything about the machine/browser is far to buggy,
		    // include some more random numbers here
		    // if NIC or an IP can be obtained reliably, that should be put in
		    // here instead.
		    var n = UUID.getIntegerBits(UUID.rand(8191), 0, 7) +
		        UUID.getIntegerBits(UUID.rand(8191), 8, 15) +
		        UUID.getIntegerBits(UUID.rand(8191), 0, 7) +
		        UUID.getIntegerBits(UUID.rand(8191), 8, 15) +
		        UUID.getIntegerBits(UUID.rand(8191), 0, 15); // this last number is two octets long
		    return tl + tm + thv + csar + csl + n;
		};

		//Pull out only certain bits from a very large integer, used to get the time
		//code information for the first part of a UUID. Will return zero's if there
		//aren't enough bits to shift where it needs to.
		UUID.getIntegerBits = function(val, start, end) {
		    var base16 = UUID.returnBase(val, 16);
		    var quadArray = new Array();
		    var quadString = '';
		    var i = 0;
		    for (i = 0; i < base16.length; i++) {
		        quadArray.push(base16.substring(i, i + 1));
		    }
		    for (i = Math.floor(start / 4); i <= Math.floor(end / 4); i++) {
		        if (!quadArray[i] || quadArray[i] == '') quadString += '0';
		        else quadString += quadArray[i];
		    }
		    return quadString;
		};

		//Replaced from the original function to leverage the built in methods in
		//JavaScript. Thanks to Robert Kieffer for pointing this one out
		UUID.returnBase = function(number, base) {
		    return (number).toString(base).toUpperCase();
		};

		//pick a random number within a range of numbers
		//int b rand(int a); where 0 <= b <= a
		UUID.rand = function(max) {
		    return Math.floor(Math.random() * (max + 1));
		};
	};


	 /**
	 * util-calc.js - The calc support
	 */
	util.calc = {
        plus: function(arg1, arg2) {
            var s1 = arg1.toString(),
                s2 = arg2.toString(),
                r1, r2, m;
            r1 = s1.split('.')[1] ? s1.split('.')[1].length : 0;
            r2 = s2.split('.')[1] ? s2.split('.')[1].length : 0;
            m = Math.pow(10, Math.max(r1, r2));
            return (this.mul(arg1, m) + this.mul(arg2, m)) / m;
        },
        minus: function(arg1, arg2) {
            return this.plus(arg1, -arg2);
        },
        mul: function(arg1, arg2) {
            var m = 0,
                s1 = arg1.toString(),
                s2 = arg2.toString();
            s1.split(".")[1] && (m += s1.split(".")[1].length);
            s2.split(".")[1] && (m += s2.split(".")[1].length);
            return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
        },
        div: function(arg1, arg2) {
            var s1 = arg1.toString(),
                s2 = arg2.toString(),
                r1, r2, m;
            r1 = s1.split('.')[1] ? s1.split('.')[1].length : 0;
            r2 = s2.split('.')[1] ? s2.split('.')[1].length : 0;
            m = Math.pow(10, r2 - r1);
            return (Number(s1.replace(".", "")) / Number(s2.replace(".", ""))) * m;
        }
    }


    /**
	 * util-events.js - The dom events support
	 */
	util.eventHandlerMap = {};

	/**
	 * @description                      閼淬垼鍓硅ぐ鏇㈡櫅閼淬倝鎼ぐ鏇″姅鐠侯垶妾扮捄顖滅槵(閼搭亣鍔戦懘铏亣瑜版洖绻栭懘鐘哄姷妤规挸鈻岄懘宀勬惎)閹枫垹宕叉す纾嬪妵閼搭亣鍔栬ぐ鏇″姽閼淬倕鐛熼懘銏ｉ敜閸椼倝鏁嬫ィ鎸庣亣閼存鍔欓懘銏ｅ壒瑜版洟鏅沵ousewheel
	 * @param  {object}   elem           Dom闂囪尪鍔栭懘褑閿
	 * @param  {string}   type           閼淬垼鍓硅ぐ鏇㈡櫅閼村矁鍔归懘銊ㄥ妼
	 * @param  {function} elem           閼淬垼鍓硅ぐ鏇㈡櫅妤规挸鈻岄懘宀勬惎濞肩偟鍊濋懘銏犵崯
	 * @param  {boolean}  capture  妞圭鍔囬懘鈺呮畷  閼淬垼鍓硅ぐ鏇㈡櫅妤规挻銈肩捄顖氱閼达綁鐬鹃懘銊ㄧ煀閹枫垹宕瞮serCapture閼寸姳绠為懘锕傛true,閼搭叀鐭婇惄鑼閼村矁鍓懘婵囶暘閾忓繗鍔囬懘顐ュ壔Capture,閼寸姳绠為懘锕傛false閼搭叀鐭婇搹蹇氬妵閼搭偉鍓籦ubbing鐠侯垶妾伴懘銏ゆ
	 * @return {null}        
	 */
	util.addEvent = (function() {        
        var fixEvent = function(event) {
            var type = event.type;
            if (type == 'DOMMouseScroll' || type == 'mousewheel') {
                /* Event.delta 閼搭厽鐏囬懘鏇⑩攼 */
                event.delta = (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3;
            }
            if (event.srcElement && !event.target) {
                event.target = event.srcElement;    
            }
            if (!event.preventDefault && event.returnValue !== undefined) {
                event.preventDefault = function() {
                    this.returnValue = false;
                };
            }
            if(!event.stopPropagation && event.cancelBubble !== undefined){
                event.stopPropagation = function(){
                    this.cancelBubble = true;
                }
            }
            /* ......閼存繄娲搁懘锝嗙梾閼搭亞顩╅懘銊︾础瑜版洖绻栭懘鐘哄姷閼淬劏鍔栨ス鎾斥枌閼村矂鎼*/
            return event;
        };
        if (window.addEventListener) {
            return function(elem, type, fn, capture) {
                if (type === "mousewheel" && document.mozHidden !== undefined) {
                    type = "DOMMouseScroll";
                }
                var handler = function(event) {
                    fn.call(elem, fixEvent(event));
                }
                eventHandlerMap[fn] = handler;
                elem.addEventListener(type, handler, capture || false);
            }
        } else if (window.attachEvent) {
            return function(elem, type, fn, capture) {
                var handler = function(event) {
                    event = event || window.event;
                    fn.call(elem, fixEvent(event));    
                }
                eventHandlerMap[fn] = handler;
                elem.attachEvent("on" + type, handler);
            }
        }
        return function() {};    
    })(); 

	/**
	 * @description                      閼淬垼鍓硅ぐ鏇㈡櫅閼搭亣鍔冩ご浣哥崯鐠侯垶妾扮捄顖滅槵(閼搭亣鍔戦懘铏亣瑜版洖绻栭懘鐘哄姷妤规挸鈻岄懘宀勬惎)閹枫垹宕叉す纾嬪妵閼搭亣鍔栭懘顏囧妰妞翠礁鐛熼懘銏ｉ敜閸椼倝鏁嬫ィ鎸庣亣閼存鍔欓懘銏ｅ壒瑜版洟鏅
	 * @param  {object}   elem           Dom闂囪尪鍔栭懘褑閿
	 * @param  {string}   type           閼淬垼鍓硅ぐ鏇㈡櫅閼村矁鍔归懘銊ㄥ妼
	 * @param  {function} elem           閼淬垼鍓硅ぐ鏇㈡櫅妤规挸鈻岄懘宀勬惎濞肩偟鍊濋懘銏犵崯
	 * @param  {boolean}  capture  妞圭鍔囬懘鈺呮畷  閼淬垼鍓硅ぐ鏇㈡櫅妤规挻銈肩捄顖氱閼达綁鐬鹃懘銊ㄧ煀閹枫垹宕瞮serCapture閼寸姳绠為懘锕傛true,閼搭叀鐭婇惄鑼閼村矁鍓懘婵囶暘閾忓繗鍔囬懘顐ュ壔Capture,閼寸姳绠為懘锕傛false閼搭叀鐭婇搹蹇氬妵閼搭偉鍓籦ubbing鐠侯垶妾伴懘銏ゆ
	 * @return {null}        
	 */
	util.removeEvent = (function() {        
	        if (window.removeEventListener) {
	            return function(elem, type, fn, capture) {
	                if (type === "mousewheel" && document.mozHidden !== undefined) {
	                    type = "DOMMouseScroll";
	                }
	                var handler = eventHandlerMap[fn];
	                delete eventHandlerMap[fn];
	                elem.removeEventListener(type, handler, capture || false);
	            }
	        } else if (window.detachEvent) {
	            return function(elem, type, fn, capture) {
	                var handler = eventHandlerMap[fn];
	                delete eventHandlerMap[fn];
	                elem.detachEvent("on" + type, handler);
	            }
	        }
	        return function() {};    
	})();  


	/**
	 * util-selector.js - The dom selector support
	 */

	//閼淬儳鐦ィ鍨崯class閼村矂绨遍搹蹇氬瘶閼搭喛鍔掗懘顓㈡閼达綀鍔
	//oParent閼达箓妾甸搹蹇氬妽妞规潙缍嶉梽鍡氬姰绾板矁灏楅幏銏犲床瑜版洟绨遍懘顓″姰oParent闂勫棜鍔喊宀冨皸閼存媽鍔忛搹蹇氬瘶閼搭喛鍔掗懘顓㈡閼达綀鍔ラ幏銏犲床sClass閼达箓妾甸懘顏堟閾忓繗瀵橀懘顔垮姃绾板矁鍓鹃懘顓㈡閼达綀鍔lass绾板矁鍓鹃懘鎵暠
	//鐠侯垳顣辩粋鍕姤绾板矁鍓鹃懘銏ｅ妳html閼达箒鍓剧喊宀暠閼存媽鍔忛懘锝夋箒閼搭偉鍔忛懘顐ｇ樅閼存澘绨懘婵囥偧閼存粎娲哥喊宀冨壘閼搭參妾甸懘锝堝姤閼存洝鍔忛崡銈夋惎
	util.getElemByClass = function(oParent, sClass) {
	    if (oParent.getElementsByClassName) {
	        return oParent.getElementsByClassName(sClass);
	    } else {
	        var res = [];
	        var re = new RegExp(' ' + sClass + ' ', 'i')
	        var aEle = oParent.getElementsByTagName('*');
	        for (var i = 0; i < aEle.length; i++) {
	            if (re.test(' ' + aEle[i].className + ' ')) {
	                res.push(aEle[i]);
	            }
	        }
	        return res;
	    }
	}


	 /**
	 * util-xml.js - The xml support
	 */
	util.loadXMLFile = function(xmlFile) {
	    var xmlDoc = null;
	    //閼存粏鍔忛棁鑼跺妿閻╄尙鍊濋懘宀冨壃閼存繃顣喊宀冨壘閼村矁鍔归懘銊ㄥ妼
	    //閼寸増鎮呮ご浣藉姍IE閻╄尙鍊濋懘宀冨壃閼存繃顣
	    if (!window.DOMParser && window.ActiveXObject) {
	        var xmlDomVersions = ['MSXML.2.DOMDocument.6.0', 'MSXML.2.DOMDocument.3.0', 'Microsoft.XMLDOM'];
	        for (var i = 0; i < xmlDomVersions.length; i++) {
	            try {
	                xmlDoc = new ActiveXObject(xmlDomVersions[i]);
	                break;
	            } catch (e) {}
	        }
	    }
	    //閼寸増鎮呮ご浣藉姍Firefox, Mozilla, Opera绾板矁鍔嗛惄鑼閼村矁鍓懘婵囶暘
	    else if (document.implementation && document.implementation.createDocument) {
	        try {
	            /* document.implementation.createDocument('','',null); 鐠侯垶妾扮捄顖滅槵绾板矁鍓鹃懘鐘茬崯鐠у倹鐏囬搹蹇氬妽閼淬垹鐛熼懘锝囶暠閼存瑦顣
	             * 绾板矁鍔懘顏嗩洨鐠у倹鐏囬搹蹇氬妽閼淬垹鐛熼懘銏ｅ妳閹哄磭婀佸鐐插床閼达箒鍓剧喊宀暠閼达綁婀侀懘銏ょ畭閼搭偉鍓荤喊宀冨壘閼存瑧婀侀懘娆愮梾妞圭鍔楄ぐ鏇犳锤URI绾板矁鍓鹃懘瀹犲姍鐠侯垱鐥呮ス鎾崇爱閹枫垻顩
	             * 绾板矁鍔棁鏌ユ櫅鐠у倹鐏囬搹蹇氬妽閼淬垹鐛熼懘銏ｅ妳閹哄磭婀佸鐐插床閼达箒鍓剧喊宀暠鐠у倿婀侀懘顓㈡閼达綀鍔ラ懘娆愮梾妞翠浇鍔冪喊宀冨壘閼村疇鍔欑捄顖涚梾妤规挸绨幏銏㈩洨
	             * 绾板矁鍔懘鐘茬崯鐠у倹鐏囬搹蹇氬妽閼淬垹鐛熼懘銏ｅ妳閼搭亪妾垫ス鎾荤氨闂勫棛鐦喊宀冨壘閼达箒鍓剧喊宀暠閼村矁鍔归懘銊ㄥ妼閹枫垻鐦懘顏囨妞翠浇鍔冮懘锕傛doctype閹枫垺绱
	             */
	            xmlDoc = document.implementation.createDocument('', '', null);
	        } catch (e) {}
	    } else {
	        return null;
	    }

	    if (xmlDoc != null) {
	        xmlDoc.async = false;
	        xmlDoc.load(xmlFile);
	    }
	    return xmlDoc;
	}

	util.loadXMLStr = function(xmlStr) {
	    var xmlDoc = null;
	    //閼存粏鍔忛棁鑼跺妿閻╄尙鍊濋懘宀冨壃閼存繃顣喊宀冨壘閼村矁鍔归懘銊ㄥ妼
	    //閼寸増鎮呮ご浣藉姍IE閻╄尙鍊濋懘宀冨壃閼存繃顣
	    if (window.ActiveXObject) {
	        var xmlDomVersions = ['MSXML.2.DOMDocument.6.0', 'MSXML.2.DOMDocument.3.0', 'Microsoft.XMLDOM'];
	        for (var i = 0; i < xmlDomVersions.length; i++) {
	            try {
	                xmlDoc = new ActiveXObject(xmlDomVersions[i]); //妤规捇绨遍梽鍡欑槵妞圭鍔楃喊宀冨壘閼达箑鐎懘鐘绘惎 XML 閼达箒鍓剧喊宀暠闂囪尪鍔栭懘褑閿
	                xmlDoc.async = false; //妤ｈ儻鍔ラ崡銈堝姉閼搭亞鐓曢搹蹇涙瑜版洝鍔旈懘顓″姤閹枫垹宕查懘顔垮閼粹晠婀佹す纾嬪妵閼寸姾鐭鹃崡銈嗗珴閼搭叀鍔懘锕佸壘绾板瞼顣遍懘銉╂晪閼搭喗鐥呰ぐ鏇″姅閼搭叀鍔ラ懘鏉跨爱閼寸喐骞婇幏銏犲床闂勫棜濮冮懘锔界亣閼存繃顣搹蹇曨洨缁傚嫯鐧岃ぐ鏇″妺閼淬劑鍙鹃懘浼寸氨閼淬劏鍔忛梽鍡氬妧閸椼倖鍩
	                xmlDoc.loadXML(xmlStr); //閼达絿婀侀懘鐗堟倕妞翠浇鍔欓懘銏ょ畭閼搭偉鍓Document.loadXML() 绾板矁鍓XML 闂勫棜濮冮懘锔界亣
	                break;
	            } catch (e) {}
	        }
	    }
	    //閼寸増鎮呮ご浣藉姍Firefox, Mozilla, Opera绾板矁鍔嗛惄鑼閼村矁鍓懘婵囶暘
	    else if (window.DOMParser) {
	        try {
	            /* 鐠侯垶妾扮捄顖滅槵閼达絿顣遍懘娆愵暘 DOMParser 闂囪尪鍔栭懘褑閿ら梽鍡氬閼达附鐏XML 閼达箒鍓鹃崡銈嗗焿閾忓繐鐎捄顖滎暠缁傚嫯鍔ラ懘顏嗩洨鐠у倹鐏XML Document 闂囪尪鍔栭懘褑閿
	             * 绾板矁鍔懘顏嗩洨鐠у倹鐏囬搹蹇氬妽閼淬垹鐛熼懘銏ｅ妳閼搭亪妾甸梽鍡氬閼达附鐏囩喊宀冨壘 XML 閼村疇鍔欑捄顖涚梾妤规挸绨幏銏㈩洨
	             * 绾板矁鍔棁鏌ユ櫅鐠у倹鐏囬搹蹇氬妽閼淬垹鐛熼懘銏ｅ妳閼达箒鍓鹃崡銈嗗焿绾板矁鍓鹃懘娑滃姰閼寸姾鍔甸懘宀冨姽閼淬劏鍔岄幏銏犲床妞圭鍔囬懘娑滃姶閼淬垼鍔"text/xml" 闂呭棗鐎application/xml" 缁傚嫯鐭"application/xhtml+xml" 閼存媽鍔忕喊宀冨壘閼搭亞顩╃挧鍌涚亣閹枫垻顩
	             */
	            xmlDoc = (new DOMParser()).parseFromString(xml, "text/xml"); //IE閼淬垽绠嶉懘顐ュ壔 loadXML() 鐠侯垶妾扮捄顖滅槵閼村矂绨遍梽鍡氬閼达附鐏XML 閼村疇鍔欑捄顖涚梾妤规挸绨幏銏犲床闂囨煡鍙鹃懘婵堟锤閼达絾鐥呴惄鑼閼村矁鍓懘婵囶暘閼淬垽绠嶉懘顐ュ壔 DOMParser 闂囪尪鍔栭懘褑閿ら梾鍡樺珴

	        } catch (e) {}
	    } else {
	        return null;
	    }
	    return xmlDoc;
	}


	/**
	 * util-html.js - The html support
	 */
	util.htmlEncode = function(str) {
	    var s = "";
	    if (str.length == 0) return "";
	    s = str.replace(/&/g, "&amp;");
	    s = s.replace(/</g, "&lt;");
	    s = s.replace(/>/g, "&gt;");
	    s = s.replace(/\'/g, "&#39;");
	    s = s.replace(/\"/g, "&quot;");
	    return s;
	}

	//HTML闂勫棜濮冮懘妤佺樅濞肩偟鍊濋懘銏犵崯
	util.htmlDecode = function(str) {
	    var s = "";
	    if (str.length == 0) return "";
	    s = str.replace(/&amp;/g, "&");
	    s = s.replace(/&lt;/g, "<");
	    s = s.replace(/&gt;/g, ">");
	    s = s.replace(/&#39;/g, "\'");
	    s = s.replace(/&quot;/g, "\"");
	    return s;
	}

	/**
	 * util-url.js - The url support
	 */
	//缁傚嫬闄勯懘鐘绘畷閼搭亪鐬鹃懘娆忕箹url妤规捁濮︽ィ鍨崯閼村矂绨辩喊宀冨壘閾忓繗鍔嶉懘銏犵崯
	util.getQueryString = function(name) {
	    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	    var r = window.location.search.substr(1).match(reg);
	    if (r != null) return unescape(r[2]);
	    return null;
	}


	//閼搭厽鐏囪ぐ鏇″姅url閾忓繗鍔嶉懘銏犵崯閹枫垹宕瞮rl閾忓繗鍔嶉懘銏犵崯妤规挸绻栭懘顓″姰閼搭叀鐭婇懘銈呯箹缁傚嫮顩╅幏銏犲床閾忓繒顩╂ス鎾崇箹閼搭叀鍔懘顓熺亣瑜版洝鍔
	util.addUrlParam = function(sHref, sParamName, sNewValue) {
	    var reg = new RegExp(sParamName + '=[^&]*');
	    if (reg.test(sHref)) {
	        sHref = sHref.replace(reg, sParamName + '=' + escape(sNewValue));
	    } else {
	        sHref += '&' + sParamName + '=' + escape(sNewValue);
	    }
	    return sHref;

	}


	/**
	 * util-cookie.js - The cookie support
	 */
	//閼淬倝鎼ぐ鏇″姅cookie
	util.setCookie = function(name, value, iDay) { //閾忓繗鍔嶉懘銏犵崯鐠侯垵鍔欓崡銈呭晪闂囪尪鍔栭懘顐⑩枌閼达紕灏楅懘鎷屽壔绾板矁鍓綾ookie閼存瑦鐥呴梾鍡楃闂囪尪鍔栭懘顐⑩枌cookie閼存壆顣遍梾鍡楃妤ｅ灝鐛熼懘婵婂姰閼淬垹宕佃ぐ鏇犳锤閹枫垻鐦喊灞俱偧閼达妇顩╅幏銏＄稏閼淬倗鐓曢幏銏＄础
	    var oDate = new Date();
	    oDate.setDate(oDate.getDate() + iDay);
	    document.cookie = name + '=' + value + '; expires=' + oDate;
	}

	//闂囪尪鍓烽懘鐘绘畷cookie
	util.getCookie = function(name) { //cookie鐠у倸闄勯懘銏ゆ閹枫垺缍杣ser=aaa; pass=123456; age=18
	    var arr1 = document.cookie.split('; '); //arr1鐠у倸闄勯懘銏ゆ閹枫垺缍朳'user=aaa', 'pass=123456']
	    for (var i = 0; i < arr1.length; i++) {
	        var arr2 = arr1[i].split('='); //arr2鐠у倸闄勯懘銏ゆ閹枫垺缍朳'user', 'aaa']
	        if (arr2[0] == name) {
	            return arr2[1];
	        }
	    }
	    return ''; //閼达箓绨遍棁鑼跺壏閼寸娀娈曠喊宀勬閹枫垹宕茬捄顖滎暠缁傚嫯鍔ユす纾嬪姉
	}

	//閼粹剝鍩夋ご浣哥崯cookie
	util.removeCookie = function(name) {
	    setCookie(name, '1', -1); //閼达紕灏楅懘鎷屽壔妤ｅ灝鐛熼懘婵婂姰閼淬垹宕佃ぐ鏇犳锤閼达箓妾1閹枫垹宕查懘褑鍔圭喊灞藉吹閼搭偉鍔懘鈩冨焿妞翠礁鐛
	}


	util.browser = function() {
	  var u = window.navigator.userAgent.toLocaleLowerCase(),
	    msie = /(msie) ([\d.]+)/,
	    chrome = /(chrome)\/([\d.]+)/,
	    firefox = /(firefox)\/([\d.]+)/,
	    safari = /(safari)\/([\d.]+)/,
	    opera = /(opera)\/([\d.]+)/,
	    ie11 = /(trident)\/([\d.]+)/,
	    b = u.match(msie) || u.match(chrome) || u.match(firefox) || u.match(safari) || u.match(opera) || u.match(ie11);
	  return {
	    name: b[1],
	    version: parseInt(b[2])
	  };
	}


	/**
	 * 合并几个对象并返回 baseObj,
	 * 如果 extendObj 有数组属性, 则直接拷贝引用
	 * @param {Object} baseObj 基础对象
	 * @param {Object} extendObj ... 
	 * 
	 * @return {Object} baseObj
	 * 
	 **/
	util.merge = function(baseObj, extendObj1, extendObj2/*, extnedObj3...*/){
	    var argu = arguments;
	    var extendObj;
	    for(var i = 1; i < argu.length; i++){
	        extendObj = argu[i];
	        for(var j in extendObj){
	            if(isArray(extendObj[j])){
	                baseObj[j] = extendObj[j].concat();
	            }else if(isObject(extendObj[j])){
	                if(baseObj[j] && isArray(baseObj[j])){
	                //避免给数组做 merge
	                    baseObj[j] = merge({}, extendObj[j]);
	                }else{
	                    baseObj[j] = merge({}, baseObj[j], extendObj[j]);
	                }
	            }else{
	                baseObj[j] = extendObj[j];
	            }
	        }
	    }
	    return baseObj;
	}

    return util;
});






//requestAnimationFrame闂囪尪鍔栭懘褑閿
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    if(!window.requestAnimationFrame){
        for (var x = 0; x < vendors.length; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || 
                                        window[vendors[x] + 'CancelRequestAnimationFrame'];
        } 
    }
    if(!window.requestAnimationFrame){
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if(!window.cancelAnimationFrame){
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}());


/*
 * Logging/debug routines
 */
util._log_level = 'warn'
util.initLogging = function (level) {
    typeof level === 'undefied' ?
        (level = util._log_level) : (util._log_level = level);
    if (typeof window.console === "undefined") {
        if (typeof window.opera !== "undefined") {
            window.console = {
                'log'  : window.opera.postError,
                'warn' : window.opera.postError,
                'error': window.opera.postError };
        } else {
            window.console = {
                'log'  : function(m) {},
                'warn' : function(m) {},
                'error': function(m) {}};
        }
    }

    util.Debug = util.Info = util.Warn = util.Error = function (msg) {};
    switch (level) {
        case 'debug': util.Debug = function (msg) { console.log(msg); };
        case 'info':  util.Info  = function (msg) { console.log(msg); };
        case 'warn':  util.Warn  = function (msg) { console.warn(msg); };
        case 'error': util.Error = function (msg) { console.error(msg); };
        case 'none':
            break;
        default:
            throw("invalid logging type '" + level + "'");
    }
};
util.getLogging = function () {
    return util._log_level;
};
// Initialize logging level
util.initLogging();



//閼寸娀娈曢懘瀹犲姍鐠侯垱鐥呮ス鎾崇爱閼村疇鍔欓梽鍡氬姰妞翠線妾遍棁鑼跺妴
util.getStrLen = function(str) {
    var i, len = 0;
    for (i = 0; i < str.length; i++) {
        len++;
        //charCodeAt() 鐠侯垶妾扮捄顖滅槵妞圭鍔囩捄顖滎暠缁傚嫯鍔ラ懘鎷岀ォ闂囪尙鐦懘锔绢洨閼存媽鍓荤喊宀冨壘閼村疇鍔欑捄顖涚梾绾板矁鍓Unicode 閸椼倛鍔归懘妤佺樅闂呭棙瀚濋懘顔垮鐠у倹鐏囩捄顖滎暠缁傚嫯鍔ラ懘鎵暠閼淬垼鍔0 - 65535 閼存澘绨ぐ鏇犳锤绾板矁鍓鹃懘顔界梾閼淬垹鐛熼梾鍡樺珴
        if (str.charCodeAt(i) > 255) {
            len++;
        }
    }
    return len;
}




//閼淬倛鍔ラ懘銏ｅ閼村疇鍔欑捄顖涚梾閼淬劍鎮呴懘鈺勫瘶
//閾忓繗鍔嶉懘銏犵崯閹枫垺缍杝trCheckValue閹枫垹宕查懘銊у皸閼搭亪妾佃ぐ鏇犵厱閾忓繗濮冪喊宀冨壘閼村疇鍔欑捄顖涚梾妤规挸绨懘鎵暠
//allowLetter,閼搭叀鍔夐懘銊╂惎閼淬垻娲搁懘鐘崇樅绾板矁鍓鹃懘銈堝姤閼淬垼濮冮懘瀹犲姍鐠侯垱鐥呴幏銏犲床閼寸姾骞楅幏銏㈢槵闂呭棙骞.\闂呭棗宕电喊宀冨妴閹枫垺绱
function checkLetter(checkString, allowLetter) {
    var arrLetters;
    var result = {
        res:true,
        msg:''
    };
    //闂囪尙鐦懘顏呯毘閼囱咁暠閼淬儵鐬鹃懘鎷屽姀绾板矁鍓鹃懘銈堝姤閼淬垼濮冮懘瀹犲姍鐠侯垱鐥呴幏銏犲床妞圭鍔囬懘顏囧姈閼村本绱℃ご浣烘锤
    //閼淬垹鐛熼懘瀹犲瘶閼存媽鍔忕喊宀冨壘闂呭棙骞|",  ",",  "/",  "\",  "&",  "?"闂呭棗宕甸懘銏ｅ妳閼搭叀鍔懘鐘哄妽濞肩偠鍔嶉懘鐔诲瘶妞瑰瓨鐏囬懘褑鍓归棁鎻掔秿閾忓繒顩╅懘顓″妷閼淬劑鎼懘銏㈡锤閼寸姵鐦虹喊宀冨壘閼淬倛鍔ラ懘銏ｅ閼村疇鍔欑捄顖涚梾
    //閼淬垹鐛熼懘瀹犲瘶閼存媽鍔忕喊宀冨壘闂呭棙骞-", "=", "+"闂呭棗宕甸懘銏ｅ妳閼淬儳鐦ご浣瑰珴閼寸喕瀵樻す瀛樼亣閼囱嗗壒妞圭鍔囬懘顏囧姈閼淬垻娲搁懘鐘崇樅閹枫垹宕茬喊宀冨Е閼淬倛鍔ラ懘銏ｅ閼寸喕瀵樻す瀛樼亣閼囱嗗壒閾忓繒顩╂す纾嬪妵閼存稖鍔撮懘銏㈡锤閼寸姵鐦虹喊宀冨壘绾板矁鍓鹃懘銈堝姤閼淬垼濮冮懘瀹犲姍鐠侯垱鐥
    var strTmp = "|閹枫垹宕閹枫垹宕瞈\閹枫垹宕閹枫垹宕閹枫垹宕閹枫垹宕閹枫垹宕閹枫垹宕閹枫垹宕瞊閹枫垹宕閹枫垹宕閹枫垹宕閹枫垹宕瞈"閹枫垹宕閹枫垹宕閹枫垹宕閹枫垹宕閹枫垹宕閹枫垹宕瞺閹枫垹宕閹枫垹宕查梾鍡氬壏閹枫垹宕查梾鍡氬壒閹枫垹宕查幏銏ｅЕ閹枫垹宕查梾鍡欑厱閹枫垹宕查梾鍡涙箒閹枫垹宕查梾鍡氬壃";
    arrLetters = new Array();
    arrLetters = strTmp.split("閹枫垹宕);

    if (!checkString) {
        checkString = "";
    }

    if (!allowLetter) {
        allowLetter = "";
    }

    for (var i = 0; i < arrLetters.length; i++) {
        if (allowLetter.indexOf(arrLetters[i]) >= 0) {
           continue();
        } 
        if (checkString.indexOf(arrLetters[i]) >= 0) {
            result.res = false;
            result.msg = "閾忓繒顩╅懘顓″妷閼淬劑鎼幒宕囨箒濞肩偛宕查懘銈堝姤閼淬垼濮冮懘瀹犲姍鐠侯垱鐥呴梾鍡樺箠" + arrLetters[i] + "闂呭棗宕甸幏銏ゆ畷";
            break;
        }
    }

    return result;
}



//妤ｅ灝鈻岄懘娑滃姶      閹枫垺缍栭梽鍡涘従閼淬劏鍔廲reateXMLHttpRequest闂囪尪鍔栭懘褑閿ょ喊宀冨壘妤规捇绨遍梽鍡欑槵閹枫垹宕查懘顐ュ妵閼搭偉鍔搹蹇曨洨閼淬儱宕茬喊宀冨壘閻╄尙鍊濋懘宀冨壃閼存繃顣ご浣规倕閼绰ゅ妺闂囪尪鍔栭懘顐ュ姰XMLHttpRequest绾板矁鍓鹃懘鐗堟倕妞翠浇鍔欓搹蹇曨洨閼搭亞顩╅懘鈺呮箒閹枫垹宕查懘顏囩煀妤规捁鍔婃ス鎾荤氨闂勫棛鐦喊宀冨壘閼淬垹宕靛鐐剁煀閼淬劎灏楅懘顏堟鐠у倿婀侀幋顔垮姷閾忓繒顩╅懘銉ュ床绾板矁鍓鹃惄鑼閼村矁鍓懘婵囶暘闂勫棝鍙鹃懘銊ㄥ姀妤规捇绨遍梽鍡欑槵
//绾板本顣懘顐ュ壔閾忓繗鍔嶉懘銏犵崯閹枫垺缍栭懘锕佸姸
//鐠侯垳顣辩粋鍕姤    閹枫垺缍朮MLHttpRequest闂囪尪鍔栭懘褑閿
util.createXMLHttpRequest = function() {
    //闂囪尪鍔栭懘顐ュ姰Firefox,Opera绾板矁鍔嗛懘鍐查檮閼淬垼鍔OM 2妤ｅ灝绻栫捄顖炴苟绾板矁鍓鹃惄鑼閼村矁鍓懘婵囶暘
    if (window.XMLHttpRequest) {
        objXMLHttp = new XMLHttpRequest();
    }
    //闂囪尪鍔栭懘顐ュ姰IE閻╄尙鍊濋懘宀冨壃閼存繃顣
    else {
        //闂勫棜濮E閻╄尙鍊濋懘宀冨壃閼存繃顣搹蹇曨洨閼淬儱宕茬喊宀冨壘XMLHttp閼淬垻顣遍懘褑鍔欓懘锟犳箒閼存瑦顣懘锕傛閼淬垹鐛熼懘瀹犲瘶
        var MSXML = ['MSXML2.XMLHTTP.5.0', 'MSXML2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];
        //閼搭亣鍓ス鎾瑰妽闂囪尪鍔栭懘娆撯攼鐠у倹鐏嘪MLHttp妤规捇绨遍梽鍡欑槵XMLHttpRequest闂囪尪鍔栭懘褑閿
        for (var i = 0; n < MSXML.length; i++) {
            try {
                //閼达箑鐎懘鐘绘惎鐠侯垰鐎搹蹇撶秿绾板矁鍓鹃懘銏ｅ妳ActiveX妞圭鍔ヨぐ鏇㈡櫅
                objXMLHttp = new ActiveXObject(MSXML[i]);
                //閼寸姾骞楁ィ鎸庣梾閼搭喖鐛熸ご浣瑰珴妤规捇绨遍梽鍡欑槵XMLHttpRequest闂囪尪鍔栭懘褑閿ら幋顔垮妼閼淬垽绠嶉懘顐ュ壔break閼淬倝鍙炬ご浣圭亣閼粹晠顣粋鍕熅
                break;
            } catch (e) {
                alert("妤规捇绨遍梽鍡欑槵XMLHttpRequest闂囪尪鍔栭懘褑閿ら懘銏℃倕閹哄疇鍔");
            }
        }
    }
}


//XMLHTTP閼淬儳鐦喊宀冨壃妤ｈ儻濮﹂懘顐ュ壔濞肩偟鍊濋懘銏犵崯 (閼寸喐鐦洪懘銉╃灳閼搭亞顩╅懘銏ょ畭閼搭偉鍓绘ス鎾瑰妸妤ｈ儻濮﹂懘顐ュ壔濞肩偟鍊濋懘銏犵崯)
//閾忓繗鍔嶉懘銏犵崯閹枫垺缍url 閼淬儳鐦喊宀冨壃閼搭亪鐬鹃懘娆忕箹绾板矁鍓鹃懘妤勭熅閹搭噣婀惰ぐ鏇熷箠閾忓繗鍔嶉懘銏犵崯
// postData POST绾板矂妾板鐐堕敜闂囪尪鍔婄喊宀冨壘閼淬垹鐛熼幋顔垮姷闂呭棙瀚濋懘顐ュ壔閼搭偉鍔ス鎾瑰Е绾板矁鍔垫ス鎾归敜閼存洟鈹愰懘銏犵崯閹搭喛鍔
// asycCall 閼搭亞鐓曢搹蹇涙缁傚嫯鍔ョ喊灞绢暘濞肩偟鍊濋懘銏犵崯闂呭棙瀚濋懘顓″姰onreadystatechange閼淬垹宕甸崡銈囶洨绾板本顣懘顐ュ壔闂呭棙瀚
/*閼淬垽绠嶉懘顐ュ壔閼寸姾骞楅懘褑鍓归幏銏＄稏
var oHTTP = myXMLHTTPRequest(sUrl, strPostStream, null);
var bSuccess = handleXMLErr(oHTTP.responseXML);
if (bSuccess) {
    if (oHTTP.responseText == "xxx")
    {
        闂呭棝顣梾鍡涱暘
    }
}
else {
    alert("閾忓繗鍔﹂懘铏暘閼淬垺鎮呴幒瀹犲姶閹枫垹宕查懘鐔哥樅妤ｈ儻鍔ラ崡銈堝姉閼存媽鍔ラ懘銏ｅ姈閹枫垽娈);
    return "xxx";
}*/
util.myXMLHTTPRequest = function (url, postData, asycCall) {
    if (url == undefined || url == null || url == "") {
        throw new Error("閼寸喐鐦洪懘鐔婚敜閼淬垺鎮呴幒瀹犲姶閹枫垺缍栭懘鐔哥樅閼寸喕閿ら懘妤勭熅閹搭噣婀堕懘锕傛妞圭鍔楅幏銏ゆ畷");
    }
    var isAsyc = typeof(asycCall) == "function" ? true : false;
    var rdNum = Math.random();
    var oHTTP = createXMLHttpRequest();
    if (url.toLowerCase().indexOf("rdnum") < 0) url = url + (url.indexOf("?") < 0 ? "?" : "&") + "rdnum=" + rdNum;
    //閹哄疇閿ら棁鑼槵閼搭亞鐓曢搹蹇涙缁傚嫯鍔ョ喊灞绢暘濞肩偟鍊濋懘銏犵崯
    if (isAsyc) {
        oHTTP.onreadystatechange = function() {
            // 绾板苯宕甸懘鐔哥樅閼寸喕閿ら懘顏囧姂閹搭噣顣ぐ鏇″姅閼搭叀鍔
            if (oHTTP.readyState == 4 && oHTTP.status == 200) {
                clearTimeout(timeout);
                asycCall(oHTTP);
            }
        }
    }

    var timeout = setTimeout( function () {  
        oHTTP.abort(); // call error callback  
    }, 60*1000 /* timeout after a minute */ ); 
    
    //鐠侯垰鐎懘锝堝妼閼寸喐鐦洪懘鐔婚敜
    if (postData == undefined || postData == null || postData == "") {
        oHTTP.open("GET", escapeUrl(url), isAsyc);
        setXMLHttpRequestHeader(oHTTP); //閼达紕灏楅懘鎷屽壔閼寸喐鐦洪懘鐔婚敜閼淬儴鐭鹃幏銏犲床閼搭亣鍔栭崡銈堝皸妤规挸鈻岄懘宀勬惎閼搭亞鐓曟ご浣瑰珴閼淬垹宕靛鐐跺妼閼存繆鍔楅懘銉х槵閼寸喐鐦洪懘鐔婚敜閼寸喖鍙剧捄顖濆姍妤规挸鈻岄懘宀勬惎
        oHTTP.send();
    } else {
        oHTTP.open("POST", escapeUrl(url), isAsyc);
        setXMLHttpRequestHeader(oHTTP)
        oHTTP.send(postData);
    }
    //妤规挸鈻岄懘宀勬惎閼淬儱宕查搹蹇涙閼寸喐鐦洪懘鐔婚敜闂勫棜鐧屾ィ鎸庣梾
    if (!isAsyc) {
        return oHTTP;
    }
}



//妤ｅ灝鈻岄懘娑滃姶閹枫垺缍栭懘顏囧姈Open鐠侯垶妾伴懘銏ゆ妤规捁鐭婃す鎾妤规挻骞婃す纾嬪姰
//閾忓繗鍔嶉懘銏犵崯閹枫垺缍杝File  -   閼搭亪鐬鹃懘娆忕箹閼达箒鍓捐ぐ鏇㈡櫅閼存鐭鹃幋顕苟
//      sWidth  -   妤规挻骞婃す纾嬪姰妞规挳鎼棁鑼跺妴
//      sHeight -   妤规挻骞婃す纾嬪姰鐠у倽鍔烽棁鑼跺妴
//      sType   -   妤规捁鐭婃す鎾鐠侯垶妾伴懘銏ゆ
//                  0 - 閼搭亣鍔栭懘锛勫皸闂囪尙鐦ス鎾归敜閼淬劑娈曟ス鎾圭煀妞规挳妾
//                  1 - 閼搭亣鍔栭懘瀹犲姈閼淬垼鍔夐懘顐⑩枌妤规挻骞婃す纾嬪姰妤规捁閿ら懘銊╂畷妤规捁鐭婃す鎾
util.openWin = function(sFile, sWidth, sHeight, sType) {
    if (!sType) sType = 0;
    if (sType == 0) {
        var iX = screen.width - 10;
        var iY = screen.height - 55;
        var iTop, iLeft;
        iTop = (iY - sHeight) / 2;
        iLeft = (iX - sWidth) / 2;
        window.open(sFile, "_blank", "top=" + iTop + ",left=" + iLeft + ",width=" + sWidth + ",height=" + sHeight + ",status=1,resizable=1");
    } else {
        var iX = screen.width - 10;
        var iY = screen.height - 55;
        window.open(sFile, "_blank", "top=0,left=0,width=" + iX + ",height=" + iY + ",status=1,resizable=1");
    }
}




//闂勫棙鐥呴懘顐ュ壔閼存洟绨遍梽鍡氬姅
function disabledLink(linkId){    
    var elements = document.getElementById(linkId),
        returnFunc = function(){ return false;}
    if(elements){
        elements = [elements];
    }else{
        elements = document.getElementsByTagName("a");
    }
    for(var i = 0 ,len = elements.length; i < len ; i++){        
        elements[i].onclick = returnFunc;                    
    }
}



//閼淬儱缍嶉懘婵嗗床閼搭參妾辫ぐ鏇″姅閼搭叀鍔
function loadImage(url, callback) {
    var img = new Image(); //妤规捇绨遍梽鍡欑槵閼搭亞顩╃挧鍌涚亣Image闂囪尪鍔栭懘褑閿ら幏銏犲床閼淬垻顣遍懘褑鍔欓懘銉ョ秿閼存繂宕茬喊宀冨壘閼搭參妾遍懘褑鍓归懘顓″姤
    img.src = url;
    if (img.complete) { // 閼寸姾骞楁ィ鎸庣梾閼淬儱缍嶉懘婵嗗床閼搭亣鍔戦幋顕暘妤规挸绻栭懘顓″姰閼搭偉鍔惄鑼閼村矁鍓懘婵囶暘缁傚嫭缍栨ス鎾崇箹閹枫垹宕查懘鏉垮吹闂勫棜鍔旂喊灞绢暘閼搭偉鍓荤粋鍕姤绾板本顣鐐靛閼淬垹鐛
        callback.call(img);
        return; // 閼存澘宕甸梽鍡氬姅鐠侯垳顣辩粋鍕姤閹枫垹宕查搹蹇曨洨閼搭偉鍓婚懘顓″姦妤规挸鈻岄懘宀勬惎onload閼淬垼鍓硅ぐ鏇㈡櫅
    }
    img.onload = function() { //閼淬儱缍嶉懘婵嗗床閼囱嗗壒閼搭叀鍔ラ懘銉╂晪閸椼倛鍔庨懘銏犲吹閼搭亞鐓曢搹蹇涙绾板本顣懘顐ュ壔callback濞肩偟鍊濋懘銏犵崯闂呭棙瀚
        callback.call(img); //闂勫棜濮︾粋鍕姤绾板本顣鐐靛閼淬垹鐛熺喊宀冨壘this閼淬倕绻栫粋鍕洨閼达箓妾礗mage闂囪尪鍔栭懘褑閿
    };
};
//绾板本顣懘顔界梾閼淬儱缍嶉懘婵嗗床妤规捁閿ら懘銊╂畷閹枫垻鐦喊宀冨妴閸椼倛鍔嗛懘锝囧缚鐠侯垵鍔幏銏犲床閾忓繒顩╂ご浣稿床妤ｅ灝鐛熼懘婵婂壏閼存稓顩╂ス鎾归敜閼淬劑娈曢幏銏＄础
//imgWidth 閼淬儱缍嶉懘婵嗗床妞规挳鎼棁鑼跺妴 imgHeight 閼淬儱缍嶉懘婵嗗床鐠у倽鍔烽棁鑼跺妴  gap閼搭叀鍔夐懘銊╂惎瑜版洜娲搁懘褔婀
function adjustImgSize(imgWidth, imgHeight, gap){
    var ratio = imgWidth / imgHeight, 
        clientWidth = (document.documentElement.clientWidth || document.body.clientWidth)- gap,
        clientHeight = (document.documentElement.clientHeight || document.body.clientHeight)- gap,
        xRatio = clientWidth / imgWidth,
        yRatio = clientHeight / imgHeight;
    if(imgWidth > clientWidth && imgHeight > clientHeight) {
        imgWidth = parseInt(imgWidth * Math.min(xRatio, yRatio));
        imgHeight = parseInt(imgHeight * Math.min(xRatio, yRatio));   
    } else if(imgHeight > clientHeight && imgWidth <= clientWidth) {
        imgWidth = parseInt(imgWidth * yRatio);
        imgHeight = parseInt(imgHeight * yRatio);  
    } else if(imgHeight <= clientHeight && imgWidth > clientWidth) {
        imgWidth = parseInt(imgWidth * xRatio);
        imgHeight = parseInt(imgHeight * xRatio);   
    }
    return {
        width : imgWidth,
        height : imgHeight
    };
}


/*! 
 * img ready v0.3
 * http://www.planeart.cn/?p=1121
 * TangBin - MIT Licensed
 * 閼淬垽绠嶉懘顐ュ壔onload绾板矁鍓剧捄顖炴閼淬垽妾伴崡銈堝姤閼淬劍鐦虹喊宀冨妴妤规挸鐛熼懘銉ョ秿閼存繂宕茶ぐ鏇″姅閼搭叀鍔ラ懘銉╂晪閸椼倛鍔庨幏銏犲床閼存繄娲搁懘锝堝姦闂囪尪鍔嗛搹蹇曨洨鐠у倽鍔掓ィ鎸庢倕閼达箑宕 閼淬垽绠嶉懘顐ュ壔javascript闂囪尙鐦懘銏犲吹閼搭喚鐓曢搹蹇氬閼淬儱缍嶉懘婵嗗床绾板矁鍓炬ご浣藉姺妤规捁骞楅懘鎶界氨閼淬倕宕查崡銈堝皸妞圭鍔囩喊宀冨壔閼翠即妾甸懘銉ョ秿閼存繂宕叉ご浣藉姺妤规捁骞楅幋顔垮妼閼淬劍顣喊宀冨壘閼存娊绨遍懘銈呭床,绾板矁鍓鹃懘锝堝姦闂囪尪鍔嗛懘銉╂箒閼淬儵婀侀懘銏ｅ妳onload鐠侯垶妾伴懘銏ゆ绾板矁鍓捐ぐ鏇＄ォ閼淬垹绨棁鑼跺姽閸椼倝婀堕幏銏犲床
 * 闂囨煡鍙鹃棁鑼跺姈閼搭偉鍔畐eb閼存繆鍔楅懘銉х槵(800闂呭棜鍓閼存稖鍔閻╄尙鍊濋懘宀冨壃瑜版洟婀堕崡銈呭晪绾板矁鍓鹃懘銉ョ秿閼存繂宕查懘娑滃姶妤规捁瀵曠喊宀勬閼存瑦鐦洪懘鈥冲吹閼淬劍鎮呮ィ鎸庣梾闂呭棙瀚
 */
// 閼淬儱缍嶉懘婵嗗床閼淬儴鐭鹃懘銏犵崯閹搭喛鍔佃ぐ鏇″姅閼搭叀鍔ラ幋顔垮妼閼淬劍顣懘銏ｅ壒瑜版洟鏅
// @param {String} 閼淬儱缍嶉懘婵嗗床閼存鐭鹃幋顕苟 
// @param {Function} 缁傚嫬闄勯懘鐘绘畷妞翠浇鍔锋ス鎾瑰箺绾板矁鍓剧粋鍕姤绾板本顣鐐靛閼淬垹鐛(閾忓繗鍔嶉懘銏犵崯1闂勫棜鍔旈懘銏ｅ姉width閹枫垻顩╅搹蹇氬妽閼淬垹鐛勫棜鍔旈懘銏ｅ姉height) 
// @param {Function} 瑜版洝鍔旈懘顓″姤妤规捇鎼懘锕侀敜绾板矁鍓剧粋鍕姤绾板本顣鐐靛閼淬垹鐛(妞圭鍔囬懘鈺呮畷) 
(function() {
  var list = [],
    intervalId = null,
    tick = function() {
      var i = 0;
      for (; i < list.length; i++) {
        list[i].end ? list.splice(i--, 1) : list[i]();
      };
      !list.length && stop();
    },
    stop = function() {
      clearInterval(intervalId);
      intervalId = null;
    };
  this.imgReady = function(url, callback, error) {
    var check, end, width, height, offsetWidth, offsetHeight, div,
      accuracy = 1024,
      doc = document,
      container = doc.body || doc.getElementsByTagName('head')[0],
      img = new Image();
    img.src = url;
    if (!callback) return img;
    // 閼寸姾骞楁ィ鎸庣梾閼淬儱缍嶉懘婵嗗床閸椼倗顩╃粋鍕稏妤规挸绻栭幏銏犲床閼搭叀鐭婇懘鏉垮吹闂勫棜鍔旂捄顖滎暠缁傚嫯鍔ョ粋鍕稏妤规挸绻栭懘銏犵崯閹搭喛鍔
    if (img.complete) return callback(img.width, img.height);
    // 閼囱嗙煀閼搭亪鐬鹃懘娆忕箹閾忓繑鐨抽懘鐘崇樅閼搭亪鏅涢懘娆掑姤閼淬儱缍嶉懘褍闄勯幏銏犲床閼搭偉鍓婚懘宀勭氨瑜版洝鍔归懘銈呯崯閼淬儱缍嶉懘婵嗗床閼淬垼鍔呯捄顖氶檮閼搭喖缍嶉懘锔绢洨 
    div = doc.createElement('div');
    div.style.cssText = 'visibility:hidden;position:absolute;left:0;top:0;width:1px;height:1px;overflow:hidden';
    div.appendChild(img)
    container.appendChild(div);
    width = img.offsetWidth;
    height = img.offsetHeight;
    // 閼淬儵鏁嬮懘鐘哄Е瑜版洝鍔旈懘顓″姤閼淬儵鏁嬮崡銈堝妿绾板矁鍓鹃懘銏ｅ壒瑜版洟鏅
    img.onload = function() {
      end();
      callback(img.width, img.height);
    };
    // 瑜版洝鍔旈懘顓″姤妤规捇鎼懘锕侀敜濞肩偠閿ょ喊宀冨壘閼淬垼鍓硅ぐ鏇㈡櫅 
    img.onerror = function() {
      end();
      error && error();
    };
    // 瑜版洜鐓曢搹蹇氬閼淬儱缍嶉懘婵嗗床閼淬垼鍔呯捄顖氶檮閼搭亣鍔戦幋顕暘閼搭喖缍嶉懘锔绢洨 
    check = function() {
      offsetWidth = img.offsetWidth;
      offsetHeight = img.offsetHeight;
      if (offsetWidth !== width || offsetHeight !== height || offsetWidth * offsetHeight > accuracy) {
        end();
        callback(offsetWidth, offsetHeight);
      };
    };
    check.url = url;
    // 閾忓繗鍔﹂懘铏暘闂勫棜鐧岄懘銏ゅ従濞肩偠閿ら梽鍡涘従閼淬劏鍔忛懘鐔哥毘閼村矂鎼
    // 閼粹剝鍩夋ご浣哥崯閼搭參妾甸懘锝堝姤閼搭偅鐦洪懘銏ｅ壒瑜版洟鏅涢幏銏犲床閸椼倛鍔撮懘娆掑IE閼存稖鍔ス鎾崇箹閼淬劑绠嶉懘妤佺础 
    end = function() {
      check.end = true;
      img.onload = img.onerror = null;
      div.innerHTML = '';
      div.parentNode.removeChild(div);
    };
    // 闂勫棜濮﹁ぐ鏇犵厱閾忓繗濮冮懘銉ョ秿閼存繂宕查懘銏ｅ妳鐠侯垰闄勯懘顔肩秿閼达妇顩╃喊宀冨壘濞肩偟鍊濋懘銏犵崯瑜版洝鍔旈懘鐘崇樅闂囪尙鐦懘銏犲吹閼存繃顣懘鏇″姀闂囪尪鍔旈棁鑼槵閼存繆鍔懘浼寸氨閼淬劏鍔
    // 閼淬儱宕查懘顏嗩洨閼淬儱缍嶉懘婵嗗床閼存壆顩╄ぐ鏇″姅閼寸姵鐦洪懘顏嗩洨鐠у倹鐏囪ぐ鏇犵厱閾忓繗濮冮懘婵囶暘 
    // 閼达箒鍔堕懘妤勫姲濞肩偠鍔嶉懘銏犲吹閼存壆顩╅懘顓″妷閼淬劑鎼ご浣圭亣閼囱嗗姍閼搭亞顩╃挧鍌涚亣闂囪尙鐦懘銏犲吹閼存繃顣幏銏犲床瑜版洜甯块懘陇鍔﹂惄鑼閼村矁鍓懘婵囶暘閼淬劏鍔栭懘娑滃姶閼达絽鍟嬪鐐跺壘 
    !check.end && check();
    for (var i = 0; i < list.length; i++) {
      if (list[i].url === url) return;
    };
    if (!check.end) {
      list.push(check);
      if (!intervalId) intervalId = setInterval(tick, 150);
    };
  };
})();


util.iframe = {
	create: function((name, src, display, callback){
		var iframe = document.createElement("iframe");
	    var init = true;
	    iframe.id = iframe.name =  name;
	    if(!src){
	        iframe.src = "about:blank";
	    }else if(util.isBoolean(src)){
	    	iframe.src = "about:blank";
	    	iframe.style.display = src ? 'block': 'none'; 
	    }else if(util.isFunction(src)){
	        iframe.src = "about:blank";
	        callback = src;
	    }else if(util.isString(src)){
	        iframe.src = src;
	    }
	     
	    util.addEvent(iframe , 'load',  function(){
	        if(!init){
	            var iframeDoc = this.getDoc(iframe.id);
	            callback && callback(iframeDoc);
	        }
	        init = false;
	    });  
	    document.body.appendChild(iframe);
	    return iframe;
	},
	getDoc: function(){
		var ifm = document.getElementById(iframeid);
		//ifm.contentWindow ? ifm.contentWindow.document : ( ifm.contentDocument || document.frames[iframeid].document)
		return ifm.contentWindow ? ifm.contentWindow.document : document.frames[iframeid].document ;
	},
	isReady: function(){
		if (!document.getElementById(iframeID)) return false;
	    if (window.frames(iframeID).document.readyState == "complete") {
	        return true;
	    } else {
	        return false;
	    }
	},
	adjust: function(iframeid){
		var ifm= document.getElementById(iframeid);
	    var subDoc = this.getDoc(iframeid);
	    if(ifm != null && subDoc != null) {
	        ifm.height = Math.max(subDoc.documentElement.scrollHeight, subDoc.body.scrollHeight);
	        ifm.width = Math.max(subDoc.body.scrollWidth, subDoc.documentElement.scrollWidth);
	    }
	},
	autoFit: function(iframeid){
		setInterval(function(){iframeAdjust(iframeid);},200);
	    /*    
	        閼搭亣鍔栭懘褑鍓归懘銏ｅ壒瑜版洟鏅涢幒瀹犻敜闂囪尙鐦梽鍡氬妿閼达箓妾甸幋顔垮姍閼囱嗗姸閹枫垹宕查懘鎵洨閼存稖鍔撮懘銏ｅ妷濞肩偠鍔庨懘銈堝姤闂囪尙鐦粋鍕熅閹搭噣鐬 
	        $(window).bind("resize",function() {
	            iframeAdjust("iframepage"); 
	        });
	        $("#iframepage").bind("load",function(){
	            iframeAdjust("iframepage"); 
	        });
	    */
	}
};
   
util.jsFormSender = function(path, params, method) {
    method = method || "post"; 
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);
    form.setAttribute("target", "_self");
    form.style.display="none";

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
           if (Object.prototype.toString.apply(params[key]) !== '[object Array]'){
                var hiddenField = document.createElement("input");
                hiddenField.setAttribute("type", "hidden");
                hiddenField.setAttribute("name", key);
                hiddenField.setAttribute("value", params[key]);
                form.appendChild(hiddenField);
            } else {
                for (var index in params[key]){
                     var hiddenField = document.createElement("input");
                    hiddenField.setAttribute("type", "hidden");
                    hiddenField.setAttribute("name", key);
                    hiddenField.setAttribute("value", params[key][index]);
                    form.appendChild(hiddenField);
                }
            }
        }
    }

    document.body.appendChild(form);
    form.submit();
    setTimeout(function(){
        document.body.removeChild(form);
    },2000);
};

/**
 *  url
 *闂呭棝娈昺ethod閹枫垺缍栫捄顖炴鐠侯垳鐦幏銏犲床閸椼倖鍩夊鐐靛閼淬垹鐛熼懘鐗堟倕妞翠浇鍔橮OST濞肩偠鍔孏ET鐠侯垶妾扮捄顖滅槵閹枫垹宕查懘褑鍔圭喊灞藉吹閼搭偉鍔崡銈夋惎绾板本銈肩喊宀冨壘method绾板矁鍓鹃懘鎵暠闂呭棙瀚
 *闂呭棝娈昫ata閹枫垺缍朣tring閼村矁鍔归懘銊ㄥ妼閼淬垹宕甸幏銏犲床閼淬垼鍔呴崡銈夋惎绾板本銈肩喊宀冨壘name绾板矁鍓鹃懘鎵暠閹枫垹宕瞣bject閼村矁鍔归懘銊ㄥ妼閼淬垹宕甸幏銏犲床閼搭叀鐭婇懘銏ｅ妳json閼淬垹鐛熼幋顔垮姷
 *闂呭棝娈昪allback閹枫垺缍栫粋鍕姤绾板本顣鐐靛閼淬垹鐛熼幏銏犲床閼寸喐鐦洪懘鐔婚敜閼淬儵鏁嬫ご浣藉妵濞肩偠閿ら幏銏犲床缁傚嫯鍔ョ喊灞绢暘閼搭偉鍓荤粋鍕倕绾板矁鍓鹃懘顏嗩洨鐠у倹鐏囧鐐靛閼淬垹鐛熼幏銏犲床閼搭偉鍓荤粋鍕倕妞圭鍔囬懘顏囧姈閼搭叀鍔挧鍌濆壔濞肩偟鍊濋懘銏犵崯閼存稖鍔棁鑼跺姈鐠侯垳顣辩粋鍕姤閼存壆顣遍梽鍡涘従閼淬劏鍔忔ス鎾斥枌閼村矂鎼梾鍡樺珴
 */
function ajaxCrossDomainRequest(url, method, data, callback){
    if(method.toUpperCase() === 'GET'){
        ajaxCrossDomainGET(url, data, callback)
    }else{
        ajaxCrossDomainPOST(url, data, callback)
    }  
}

//閼淬垽绠嶉懘顐ュ壔JSONP閼村矂绨辨す纾嬪箺閼搭偉鐭奊ET閼寸喐鐦洪懘鐔婚敜
function ajaxCrossDomainGET(url, data, callback){
    if(typeof(arguments[0]) != 'string'){ return; }
    var callback = typeof(arguments[1]) == 'function' ? callback : function(){};
    var head = document.getElementsByTagName('HEAD')[0];
    var script = document.createElement('SCRIPT');
    script.id = "jsonpscript"
    script.type = 'text/javascript';
    if(typeof data === "string"){
        url += data;
    }else if(typeof data === "object"){
        for(item in data){
            url += util.addUrlParam(url, item, data[item]);
        }
    }
    url += util.addUrlParam(url, 'callback', 'jsonpCallback');
    url += util.addUrlParam(url, 'rand', +new Date());
    script.src = url;
    head.appendChild(script);
    // if(!/*@cc_on!@*/0) {
    //     script.onload = function(){ 
    //         callback(); 
    //         this.parentNode.removeChild(this); 
    //     }
    // }else{
    //     script.onreadystatechange = function () {
    //         if (this.readyState == 'loaded' || this.readyState == 'complete') {
    //             callback();
    //             this.parentNode.removeChild(this);
    //         }
    //     }
    // }
    
    window[jsonpCallback] = function(json){
        var script = document.getElementById('jsonpscript');
        callback(json);
        head.removeChild(script);
    }
}

//閼淬垽绠嶉懘顐ュ壔Iframe閼村矂绨辨す纾嬪箺閼搭偉鐭奝OST閼寸喐鐦洪懘鐔婚敜
function ajaxCrossDomainPOST(url, data, callback){
    var iframe, form;
    iframe = createEmptyIframe('crossdomaintempiframe', "about:blank", CallBack);
    if(Object.prototype.toString.call(Data) === '[object String]'){
        form = document.getElementsByName(Data)[0];
        if(!form){return;}
        form.action = URL;
        form.method = "POST";
    }else{
        form = createEmptyIframe('crossdomaintempform', URL, 'POST', target);
        for(temp in Data){
            attachHiddenInput(form, temp, temp, Data[temp]);
        }
    }
    form.submit();
}


function getAbs(obj) {
    var left = obj.offsetLeft,
        top = obj.offsetTop;
    while (obj.offsetParent != null) {
        obj = obj.offsetParent;
        left += obj.offsetLeft;
        top += obj.offsetTop;
    }
    return {
        left : left,
        top : top
    };
}

function relativeLocate(refer,target,direction,space){
    var width = target.outerWidth(),
        height = target.outerHeight(),
        referoffset = offsetPosition(refer),
        bodyoffset,
        top,left;
    direction = direction || 'top';
    space = space || 0;
    if( direction === 'top' || direction === 'bottom' ){
        left = referoffset.left  + referoffset.width / 2  - width / 2;
        if( direction === 'top' ){
            top = referoffset.top - height - space;
        }else{
            top = referoffset.top + referoffset.height + space;
        }
    }else if( direction === 'left' || direction === 'right' ){
        top = referoffset.top + referoffset.height / 2  - height / 2;      
        if( direction === 'left' ){
            left = referoffset.left - width - space;
        }else{
            left = referoffset.left + referoffset.width + space;  
        }
    }
    if($(document.body).css("position")!=="static"){
        bodyoffset = offsetPosition(document.body);
        left = left - bodyoffset.left;
        top = top - bodyoffset.left;
    }
    return {
        top: top,
        left: left
    };
}


function fixedPositionCompatibility(height) {
    var browser =  checkBrowser();
    if (browser.name === "msie" && browser.version === 6 ) { 
        var navigators = $("[tag='floatNavigator']");
        if (!navigators.length) return;
        height || height = 
        $.each(navigators, function() {
            this.top = $(this).css("top");
            this.bottom = $(this).css("bottom");
            this.isTop = this.top == "auto" ? false : true;
            if(!this.isTop){
               this.bottom = 0;
            }
            $(this).css("position", "absolute");
            if($(this).attr('floatFullHeight')!==undefined){
                $(this).css("height", $(window).height());
            }
        });
        $(window).bind("scroll", function() {
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            $.each(navigators, function() {
              var value = this.isTop ? scrollTop + parseInt(this.top) + "px" : 
              scrollTop + $(window).height() - $(this).outerHeight() - parseInt(this.bottom) + "px";
              $(this).css("top", value);
            });
        });
    }
}

function keyPressIsAllowed( which ){
    if( which >= 96 && which <= 105     // 閼淬劑娈曡ぐ鏇犳箒閼存粏鍔
        || which >= 48 && which <= 57     // 妤规捁閿よぐ鏇犳箒閼存粏鍔
        || which === 37 || which === 39   // 鐠侯垶妾伴懘褑鐭婅ぐ鏇犳箒
        || which === 8 || which === 46    // 閼淬儴鍔婄挧鍌氶檮閼搭偅鐦篸elete瑜版洜婀
        || which === 9 || which === 13    // tab閼搭偅鐦篹nter瑜版洜婀
        )return true;
}


var maxSafeInt = Number.MAX_SAFE_INTEGER || 9007199254740991;
function intInc (number) {
    return (number === maxSafeInt) ? 0 : number + 1
}


// Get DOM element position on page
//  This solution is based based on http://www.greywyvern.com/?post=331
//  Thanks to Brian Huisman AKA GreyWyvern!
util.getPosition = (function() {
    function getStyle(obj, styleProp) {
        if (obj.currentStyle) {
            var y = obj.currentStyle[styleProp];
        } else if (window.getComputedStyle)
            var y = window.getComputedStyle(obj, null)[styleProp];
        return y;
    };

    function scrollDist() {
        var myScrollTop = 0, myScrollLeft = 0;
        var html = document.getElementsByTagName('html')[0];

        // get the scrollTop part
        if (html.scrollTop && document.documentElement.scrollTop) {
            myScrollTop = html.scrollTop;
        } else if (html.scrollTop || document.documentElement.scrollTop) {
            myScrollTop = html.scrollTop + document.documentElement.scrollTop;
        } else if (document.body.scrollTop) {
            myScrollTop = document.body.scrollTop;
        } else {
            myScrollTop = 0;
        }

        // get the scrollLeft part
        if (html.scrollLeft && document.documentElement.scrollLeft) {
            myScrollLeft = html.scrollLeft;
        } else if (html.scrollLeft || document.documentElement.scrollLeft) {
            myScrollLeft = html.scrollLeft + document.documentElement.scrollLeft;
        } else if (document.body.scrollLeft) {
            myScrollLeft = document.body.scrollLeft;
        } else {
            myScrollLeft = 0;
        }

        return [myScrollLeft, myScrollTop];
    };

    return function (obj) {
        var curleft = 0, curtop = 0, scr = obj, fixed = false;
        while ((scr = scr.parentNode) && scr != document.body) {
            curleft -= scr.scrollLeft || 0;
            curtop -= scr.scrollTop || 0;
            if (getStyle(scr, "position") == "fixed") {
                fixed = true;
            }
        }
        if (fixed && !window.opera) {
            var scrDist = scrollDist();
            curleft += scrDist[0];
            curtop += scrDist[1];
        }

        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);

        return {'x': curleft, 'y': curtop};
    };
})();


// Get mouse event position in DOM element
util.getEventPosition = function (e, obj, scale) {
    var evt, docX, docY, pos;
    //if (!e) evt = window.event;
    evt = (e ? e : window.event);
    evt = (evt.changedTouches ? evt.changedTouches[0] : evt.touches ? evt.touches[0] : evt);
    if (evt.pageX || evt.pageY) {
        docX = evt.pageX;
        docY = evt.pageY;
    } else if (evt.clientX || evt.clientY) {
        docX = evt.clientX + document.body.scrollLeft +
            document.documentElement.scrollLeft;
        docY = evt.clientY + document.body.scrollTop +
            document.documentElement.scrollTop;
    }
    pos = util.getPosition(obj);
    if (typeof scale === "undefined") {
        scale = 1;
    }
    var realx = docX - pos.x;
    var realy = docY - pos.y;
    var x = Math.max(Math.min(realx, obj.width-1), 0);
    var y = Math.max(Math.min(realy, obj.height-1), 0);
    return {'x': x / scale, 'y': y / scale, 'realx': realx / scale, 'realy': realy / scale};
};



/*
任意位置浮动固定层
说明：可以让指定的层浮动到网页上的任何位置，当滚动条滚动时它会保持在当前位置不变，不会产生闪动
修改：当自定义right位置时无效，这里加上一个判断 
修改:支持关闭、确定回调函数，支持蒙层效果
有值时就不设置，无值时要加18px已修正层位置在ie6下的问题 
参数描述
   $("selector").floatdiv({
        location:"rightbottom/leftbottom/rightbottom/lefttop/righttop/middle"或者{left:"XXpx",top:"XXpx"},//浮动DIV位置
        isShowCover:true/false,//是否显示覆盖层，默认是false
        timeToLive:1000,//自动关闭时间，以毫秒为耽误。默认是0，不关闭floatDiv。
        confirm_callback:funcntion(){},//确定的回调函数
        close_callback:function(){}//取消或关闭的回调函数
    })

    使用说明：
    1 空{}调用：默认 
    $("#id").floatdiv({}); 
    2 内置固定位置浮动 
    右下角 
    $("#id").floatdiv({location:"rightbottom"}); 
    左下角 
    $("#id").floatdiv({location:"leftbottom"}); 
    右下角 
    $("#id").floatdiv({location:"rightbottom"}); 
    左上角 
    $("#id").floatdiv({location:"lefttop"}); 
    右上角 
    $("#id").floatdiv({location:"righttop"}); 
    居中 
    $("#id").floatdiv({location:"middle"}); 
    3 自定义位置浮动 
    $("#id").floatdiv({location:{left:"10px",top:"10px"}}); 
    以上参数，设置浮动层在left 10个像素,top 10个像素的位置 
*/ 

jQuery.fn.floatdiv=function(obj){
    obj.location=obj.location || "middle";
    obj.isShowCover=obj.isShowCover|| false;
    obj.confirm_callback=obj.confirm_callback || function (){};
    obj.close_callback=obj.close_callback || function (){};
    obj.timeToLive=obj.timeToLive||0;
    obj.isClickClose=obj.isClickClose||false;
    // ie6要隐藏纵向滚动条
    var isIE6=false; 
    var timeoutId;
    if($.browser.msie && $.browser.version=="6.0"){ 
        $("html").css("overflow-x","auto").css("overflow-y","hidden");
        isIE6=true; 
    }; 
    /*
     * $("body").css({margin:"0px",padding:"0 10px 0 10px", border:"0px",
     * height:"100%", overflow:"auto" });
     */
    var $xBtns=null,$okBtns=null,$closeBtns=null;

    // 取得瀏覽器視窗高度
    function getBrowserHeight() {
        if ($.browser.msie) {
            return document.compatMode == "CSS1Compat" ? document.documentElement.clientHeight :document.body.clientHeight;
        } else {
            return self.innerHeight;
        }
    }

    // 取得瀏覽器視窗寬度
    function getBrowserWidth() {
        if ($.browser.msie) {
            return document.compatMode == "CSS1Compat" ? document.documentElement.clientWidth :document.body.clientWidth;
        } else {
            return self.innerWidth;
        }
    } 

    return this.each(function(){ 
        var loc;// 层的绝对定位位置
        if(obj.location==undefined || obj.location.constructor == String){ 

            switch(obj.location){ 
                case("rightbottom"):// 右下角
                    loc={right:"0px",bottom:"0px"}; 
                    break; 
                case("leftbottom"):// 左下角
                    loc={left:"0px",bottom:"0px"}; 
                    break; 
                case("lefttop"):// 左上角
                    loc={left:"0px",top:"0px"}; 
                    break; 
                case("righttop"):// 右上角
                        loc={right:"0px",top:"0px"}; 
                        break; 
                case("middle"):// 居中
                    var l=0;// 居左
                    var t=0;// 居上
                    var windowWidth,windowHeight;// 窗口的高和宽
                    
                    windowWidth=getBrowserWidth();
                    windowHeight=getBrowserHeight();
                    l=Math.floor(windowWidth/2-$(this).width()/2+$(document).scrollLeft());
                    t=Math.floor(windowHeight/2-$(this).height()/2+$(document).scrollTop()); 
                    loc={left:l+"px",top:t+"px"}; 
                    break; 
                default:// 默认为右下角
                    loc={right:"0px",bottom:"0px"}; 
                    break; 
            } 
        }else{ 
            loc=obj.location; 
        }

        $(this).css("z-index","8999").css(loc).css("position","fixed"); 
        if(isIE6){ 
            if(loc.right!=undefined){ 
                // 2008-4-1修改：当自定义right位置时无效，这里加上一个判断
                // 有值时就不设置，无值时要加18px已修正层位置
                if($(this).css("right")==null || $(this).css("right")==""){ 
                    $(this).css("right","18px"); 
                } 
            } 
            $(this).css("position","absolute"); 
        }

        // 添加关闭事件
        var _this=this;
        $xBtns=$(this).find(".ico_x,.qz_dialog_btn_close").bind("click",function(){
            $(_this).fadeOut("fast");
            $(this).unbind("click");
            $closeBtns.unbind("click");
            $okBtns.unbind("click");
            $("#mask_div").length>0 && $("#mask_div").remove();
            (obj.close_callback)();
            return false;
        });
        
        $closeBtns=$(this).find(".btn_gray2,.bt_tip_normal.bt_tip").bind("click",function(){
            $(_this).fadeOut("fast");
            $(this).unbind("click");
            $xBtns.unbind("click");
            $okBtns.unbind("click");
            $("#mask_div").length>0 && $("#mask_div").remove();
            (obj.close_callback)();
            return false;
        })
        // 添加确定事件回调函数
        $okBtns=$(this).find(".btn_blue,.bt_tip_hit.bt_tip").unbind().bind("click",function(){
            (obj.confirm_callback)();
            if($(this).hasClass("not_close")){
                return false;
            }
            $(_this).fadeOut("slow");
            $("#mask_div").length>0 && $("#mask_div").remove();
            return false;
        })
        
        if(obj.isShowCover){
            $("#mask_div").length>0 && $("#mask_div").remove();
            $("body").append("<div id='mask_div' class='ui_mask'></div>");
            $("body").find("#mask_div").width($(window).width()) .height(($(window).height()>$(document).height()?$(window).height():$(document).height()))
                .css({opacity:"0.6",display:"block",top:"0px",left:"0px",position: "absolute",zIndex:999});
        }

        if(obj.isClickClose){
            $("#mask_div").bind("click",function(evt){
                var $msgbox=$("#mc_util_msgbox");
                $msgbox.length>0 && $msgbox.closeFloatDiv();
                timeoutId && clearTimeout(timeoutId);
                evt.stopPropagation();
            });
        }
        
        $(_this).find("div.hd").draggit($(_this));
        
        if(obj.timeToLive>0){
            timeoutId=setTimeout(function(){
                $(_this).fadeOut("slow");
                $("#mask_div").length>0 && $("#mask_div").remove();
            },obj.timeToLive);
        }

        var oldWith=$(_this).width(),oldHeight=$(_this).height();
        var  resizeFun=function(){
            var l=0,t=0,
                windowWidth=getBrowserWidth(),
                windowHeight=getBrowserHeight();
                l=Math.floor(windowWidth/2-oldWith/2+$(document).scrollLeft());
                t=Math.floor(windowHeight/2-oldHeight/2+$(document).scrollTop()); 
                loc={left:l+"px",top:t+"px"};
                $(_this).css(loc).width(oldWith).height(oldHeight);

                $("#mask_div").length>0 && $("#mask_div").width($(window).width()) .height(($(window).height()>$(document).height()?$(window).height():$(document).height()))
                .css({opacity:"0.6",display:"block",top:"0px",left:"0px",position: "absolute",zIndex:999});
        };
        var resizer1,resizer2;
        $(window).resize(function(){
            if(obj.location=="middle"){
                clearTimeout(resizer1);
                resizer1=setTimeout(resizeFun,10);
            }
        });

        $(window).scroll(function(){
            if(obj.location=="middle"){
                clearTimeout(resizer2);
                resizer2=setTimeout(resizeFun,10);
            }
        });


    }); 
};

jQuery.fn.closeFloatDiv=function(){
    
    $(this).each(function(index,el){
        $(el).fadeOut("slow");
        // $(el).css("display","none");
        $(el).find(".ico_x").unbind("click");
        $(el).find(".btn_normal").unbind("click");
        $(el).find(".btn_blue").unbind("click");
        $("#mask_div").length>0 && $("#mask_div").remove();
    });
    return this;
};


jQuery.fn.draggit = function (el) {
    var thisdiv = this;
    var thistarget = $(el?el:this);
    var relX;
    var relY;
    var targetw = thistarget.width();
    var targeth = thistarget.height();
    var docw;
    var doch;
    var ismousedown=false;

    thistarget.css('position','absolute');

    // 取得瀏覽器視窗高度
    function getBrowserHeight() {
        if ($.browser.msie) {
            return document.compatMode == "CSS1Compat" ? document.documentElement.clientHeight :document.body.clientHeight;
        } else {
            return self.innerHeight;
        }
    };

    thisdiv.bind('mousedown', function(e){
        
        var pos = $(el).offset();
        var srcX = pos.left;
        var srcY = pos.top;

        docw = $('body').width();
        doch = $('body').height()>=viewh ? $('body').height() : viewh;

        relX = e.pageX - srcX;
        relY = e.pageY - srcY;
        
        if(this.setCapture){
            this.setCapture();
        }else if (window.captureEvents){
            window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
        }
        
        ismousedown = true;
        e.preventDefault();
    });

    $(document).bind('mousemove',function(e){ 
        if(ismousedown)
        {
            targetw = thistarget.width();
            targeth = thistarget.height();

            var maxX = docw - targetw - 10;
            var maxY = doch - targeth - 10;

            var mouseX = e.pageX;
            var mouseY = e.pageY;

            var diffX = mouseX - relX;
            var diffY = mouseY - relY;

            // check if we are beyond document bounds ...
            if(diffX < 0)   diffX = 0;
            if(diffY < 0)   diffY = 0;
            if(diffX > maxX) diffX = maxX;
            if(diffY > maxY) diffY = maxY;

            $(el).css('top', (diffY)+'px');
            $(el).css('left', (diffX)+'px');
        }
    });

    thisdiv.bind('mouseup', function(e){
        if(this.releaseCapture){
            this.releaseCapture();
        }else if(window.captureEvents){
            window.captureEvents(Event.MOUSEMOVE|Event.MOUSEUP);
        }
        ismousedown = false;
    });

    return this;
}



// Dynamically load scripts without using document.write()
// Reference: http://unixpapa.com/js/dyna.html
//
// Handles the case where load_scripts is invoked from a script that
// itself is loaded via load_scripts. Once all scripts are loaded the
// window.onscriptsloaded handler is called (if set).

util._loading_scripts = [];
util._pending_scripts = [];
util.load_scripts = function(files, baseUri, version) {
    var head = document.getElementsByTagName('head')[0], script,
        ls = util._loading_scripts, ps = util._pending_scripts;
    for (var f=0; f<files.length; f++) {
        script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = baseUri + files[f] + (version ? '?'+ version : '');
        //console.log("loading script: " + script.src);
        script.onload = script.onreadystatechange = function (e) {
            while (ls.length > 0 && (ls[0].readyState === 'loaded' ||
                                     ls[0].readyState === 'complete')) {
                // For IE, append the script to trigger execution
                var s = ls.shift();
                //console.log("loaded script: " + s.src);
                head.appendChild(s);
            }
            if (!this.readyState ||
                (util.Engine.presto && this.readyState === 'loaded') ||
                this.readyState === 'complete') {
                if (ps.indexOf(this) >= 0) {
                    this.onload = this.onreadystatechange = null;
                    //console.log("completed script: " + this.src);
                    ps.splice(ps.indexOf(this), 1);

                    // Call window.onscriptsload after last script loads
                    if (ps.length === 0 && window.onscriptsload) {
                        window.onscriptsload();
                    }
                }
            }
        };
        // In-order script execution tricks
        if (util.Engine.trident) {
            // For IE wait until readyState is 'loaded' before
            // appending it which will trigger execution
            // http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
            ls.push(script);
        } else {
            // For webkit and firefox set async=false and append now
            // https://developer.mozilla.org/en-US/docs/HTML/Element/script
            script.async = false;
            head.appendChild(script);
        }
        ps.push(script);
    }
}

// Set browser engine versions. Based on mootools.
util.Features = {xpath: !!(document.evaluate), air: !!(window.runtime), query: !!(document.querySelector)};

util.Engine = {
    // Version detection break in Opera 11.60 (errors on arguments.callee.caller reference)
    //'presto': (function() {
    //         return (!window.opera) ? false : ((arguments.callee.caller) ? 960 : ((document.getElementsByClassName) ? 950 : 925)); }()),
    'presto': (function() { return (!window.opera) ? false : true; }()),

    'trident': (function() {
            return (!window.ActiveXObject) ? false : ((window.XMLHttpRequest) ? ((document.querySelectorAll) ? 6 : 5) : 4); }()),
    'webkit': (function() {
            try { return (navigator.taintEnabled) ? false : ((util.Features.xpath) ? ((util.Features.query) ? 525 : 420) : 419); } catch (e) { return false; } }()),
    //'webkit': (function() {
    //        return ((typeof navigator.taintEnabled !== "unknown") && navigator.taintEnabled) ? false : ((util.Features.xpath) ? ((util.Features.query) ? 525 : 420) : 419); }()),
    'gecko': (function() {
            return (!document.getBoxObjectFor && window.mozInnerScreenX == null) ? false : ((document.getElementsByClassName) ? 19 : 18); }())
};
if (util.Engine.webkit) {
    // Extract actual webkit version if available
    util.Engine.webkit = (function(v) {
            var re = new RegExp('WebKit/([0-9\.]*) ');
            v = (navigator.userAgent.match(re) || ['', v])[1];
            return parseFloat(v, 10);
        })(util.Engine.webkit);
}


//QZ 测速
//

window.QZFL = window.QZFL || {};
QZFL.pingSender = function(url, t, opts) {
    var _s = QZFL.pingSender,
        iid, img;
    if (!url) {
        return;
    }
    opts = opts || {};
    iid = "sndImg_" + _s._sndCount++;
    img = _s._sndPool[iid] = new Image();
    img.iid = iid;
    img.onload = img.onerror = img.ontimeout = (function(t) {
        return function(evt) {
            evt = evt || window.event || {
                type: 'timeout'
            };
            void(typeof(opts[evt.type]) == 'function' ? setTimeout((function(et, ti) {
                return function() {
                    opts[et]({
                        'type': et,
                        'duration': ((new Date()).getTime() - ti)
                    });
                };
            })(evt.type, t._s_), 0) : 0);
            QZFL.pingSender._clearFn(evt, t);
        };
    })(img);
    (typeof(opts.timeout) == 'function') && setTimeout(function() {
        img.ontimeout && img.ontimeout({
            type: 'timeout'
        });
    }, (typeof(opts.timeoutValue) == 'number' ? Math.max(100, opts.timeoutValue) : 5000));
    void((typeof(t) == 'number') ? setTimeout(function() {
        img._s_ = (new Date()).getTime();
        img.src = url;
    }, (t = Math.max(0, t))) : (img.src = url));
};
QZFL.pingSender._sndPool = {};
QZFL.pingSender._sndCount = 0;
QZFL.pingSender._clearFn = function(evt, ref) {
    var _s = QZFL.pingSender;
    if (ref) {
        _s._sndPool[ref.iid] = ref.onload = ref.onerror = ref.ontimeout = ref._s_ = null;
        delete _s._sndPool[ref.iid];
        _s._sndCount--;
        ref = null;
    }
};

if (typeof(window.TCISD) == "undefined") {
    window.TCISD = {};
}
TCISD.pv = function(sDomain, path, opts) {
    setTimeout(function() {
        TCISD.pv.send(sDomain, path, opts);
    }, 0);
};
(function() {
    var items = [],
        timer = null,
        unloadHandler, noDelay = false;
    var pvSender = {
        send: function(domain, url, rDomain, rUrl) {
            items.push({
                dm: domain,
                url: url,
                rdm: rDomain || "",
                rurl: rUrl || ""
            });
            if (!timer) {
                timer = setTimeout(pvSender.doSend, 5000);
            }
            if (!unloadHandler) {
                unloadHandler = pvSender.onUnload;
                if (window.attachEvent) {
                    window.attachEvent("onbeforeunload", unloadHandler);
                    window.attachEvent("onunload", unloadHandler);
                } else if (window.addEventListener) {
                    window.addEventListener("beforeunload", unloadHandler, false);
                    window.addEventListener("unload", unloadHandler, false);
                }
            }
        },
        onUnload: function() {
            noDelay = true;
            pvSender.doSend();
            setTimeout(function() {}, 1000);
        },
        doSend: function() {
            timer = null;
            if (items.length) {
                var url;
                for (var i = 0; i < items.length; i++) {
                    url = pvSender.getUrl(items.slice(0, items.length - i));
                    if (url.length < 2000) {
                        break;
                    }
                }
                items = items.slice(Math.max(items.length - i, 1));
                QZFL.pingSender(url);
                if (i > 0) {
                    noDelay ? pvSender.doSend() : (timer = setTimeout(pvSender.doSend, 5000));
                }
            }
        },
        getUrl: function(list) {
            var item = list[0];
            var data = {
                dm: escape(item.dm),
                url: escape(item.url),
                rdm: escape(item.rdm),
                rurl: escape(item.rurl),
                pgv_pvid: pvSender.getId(),
                sds: Math.random()
            };
            var ext = [];
            for (var i = 1; i < list.length; i++) {
                var p = list[i];
                ext.push([escape(p.dm), escape(p.url), escape(p.rdm), escape(p.rurl)].join(":"));
            }
            if (ext.length) {
                data.ex_dm = ext.join(";")
            }
            var param = [];
            for (var p in data) {
                param.push(p + "=" + data[p]);
            }
            var url = [TCISD.pv.config.webServerInterfaceURL, "?cc=-&ct=-&java=1&lang=-&pf=-&scl=-&scr=-&tt=-&tz=-8&vs=3.3&flash=&", param.join("&")].join("");
            return url;
        },
        getId: function() {
            var t, d, h, f;
            t = document.cookie.match(TCISD.pv._cookieP);
            if (t && t.length && t.length > 1) {
                d = t[1];
            } else {
                d = (Math.round(Math.random() * 2147483647) * (new Date().getUTCMilliseconds())) % 10000000000;
                document.cookie = "pgv_pvid=" + d + "; path=/; domain=qq.com; expires=Sun, 18 Jan 2038 00:00:00 GMT;";
            }
            h = document.cookie.match(TCISD.pv._cookieSSID);
            if (!h) {
                f = (Math.round(Math.random() * 2147483647) * (new Date().getUTCMilliseconds())) % 10000000000;
                document.cookie = "pgv_info=ssid=s" + f + "; path=/; domain=qq.com;";
            }
            return d;
        }
    };
    TCISD.pv.send = function(sDomain, path, opts) {
        sDomain = sDomain || location.hostname || "-";
        path = path || location.pathname;
        opts = opts || {};
        opts.referURL = opts.referURL || document.referrer;
        var t, d, r;
        t = opts.referURL.split(TCISD.pv._urlSpliter);
        t = t[0];
        t = t.split("/");
        d = t[2] || "-";
        r = "/" + t.slice(3).join("/");
        opts.referDomain = opts.referDomain || d;
        opts.referPath = opts.referPath || r;
        pvSender.send(sDomain, path, opts.referDomain, opts.referPath);
    };
})();
TCISD.pv._urlSpliter = /[\?\#]/;
TCISD.pv._cookieP = /(?:^|;+|\s+)pgv_pvid=([^;]*)/i;
TCISD.pv._cookieSSID = /(?:^|;+|\s+)pgv_info=([^;]*)/i;
TCISD.pv.config = {
    webServerInterfaceURL: "http://pingfore.qq.com/pingd"
};
window.TCISD = window.TCISD || {};
TCISD.createTimeStat = function(statName, flagArr, standardData) {
    var _s = TCISD.TimeStat,
        t, instance;
    flagArr = flagArr || _s.config.defaultFlagArray;
    t = flagArr.join("_");
    statName = statName || t;
    if (instance = _s._instances[statName]) {
        return instance;
    } else {
        return (new _s(statName, t, standardData));
    }
};
TCISD.markTime = function(timeStampSeq, statName, flagArr, timeObj) {
    var ins = TCISD.createTimeStat(statName, flagArr);
    ins.mark(timeStampSeq, timeObj);
    return ins;
};
TCISD.TimeStat = function(statName, flags, standardData) {
    var _s = TCISD.TimeStat;
    this.sName = statName;
    this.flagStr = flags;
    this.timeStamps = [null];
    this.zero = _s.config.zero;
    if (standardData) {
        this.standard = standardData;
    }
    _s._instances[statName] = this;
    _s._count++;
};
TCISD.TimeStat.prototype.getData = function(seq) {
    var r = {},
        t, d;
    if (seq && (t = this.timeStamps[seq])) {
        d = new Date();
        d.setTime(this.zero.getTime());
        r.zero = d;
        d = new Date();
        d.setTime(t.getTime());
        r.time = d;
        r.duration = t - this.zero;
        if (this.standard && (d = this.standard.timeStamps[seq])) {
            r.delayRate = (r.duration - d) / d;
        }
    } else {
        r.timeStamps = TCISD.TimeStat._cloneData(this.timeStamps);
    }
    return r;
};
TCISD.TimeStat._cloneData = function(obj) {
    if ((typeof obj) == 'object') {
        var res = obj.sort ? [] : {};
        for (var i in obj) {
            res[i] = TCISD.TimeStat._cloneData(obj[i]);
        }
        return res;
    } else if ((typeof obj) == 'function') {
        return Object;
    }
    return obj;
};
TCISD.TimeStat.prototype.mark = function(seq, timeObj) {
    seq = seq || this.timeStamps.length;
    this.timeStamps[Math.min(Math.abs(seq), 99)] = timeObj || (new Date());
    return this;
};
TCISD.TimeStat.prototype.merge = function(baseTimeStat) {
    var x, y;
    if (baseTimeStat && (typeof(baseTimeStat.timeStamps) == "object") && baseTimeStat.timeStamps.length) {
        this.timeStamps = baseTimeStat.timeStamps.concat(this.timeStamps.slice(1));
    } else {
        return this;
    }
    if (baseTimeStat.standard && (x = baseTimeStat.standard.timeStamps)) {
        if (!this.standard) {
            this.standard = {};
        }
        if (!(y = this.standard.timeStamps)) {
            y = this.standard.timeStamps = {};
        }
        for (var key in x) {
            if (!y[key]) {
                y[key] = x[key];
            }
        }
    }
    return this;
};
TCISD.TimeStat.prototype.setZero = function(od) {
    if (typeof(od) != "object" || typeof(od.getTime) != "function") {
        od = new Date();
    }
    this.zero = od;
    return this;
};
TCISD.TimeStat.prototype.report = function(baseURL) {
    var _s = TCISD.TimeStat,
        url = [],
        t, z;
    if ((t = this.timeStamps).length < 1) {
        return this;
    }
    url.push((baseURL && baseURL.split("?")[0]) || _s.config.webServerInterfaceURL);
    url.push("?");
    z = this.zero;
    for (var i = 1, len = t.length; i < len; ++i) {
        if (t[i]) {
            url.push(i, "=", t[i].getTime ? (t[i] - z) : t[i], "&");
        }
    }
    t = this.flagStr.split("_");
    for (var i = 0, len = _s.config.maxFlagArrayLength; i < len; ++i) {
        if (t[i]) {
            url.push("flag", i + 1, "=", t[i], "&");
        }
    }
    if (_s.pluginList && _s.pluginList.length) {
        for (var i = 0, len = _s.pluginList.length; i < len; ++i) {
            (typeof(_s.pluginList[i]) == 'function') && _s.pluginList[i](url);
        }
    }
    url.push("sds=", Math.random());
    QZFL.pingSender && QZFL.pingSender(url.join(""));
    return this;
};
TCISD.TimeStat._instances = {};
TCISD.TimeStat._count = 0;
TCISD.TimeStat.config = {
    webServerInterfaceURL: "http://isdspeed.qq.com/cgi-bin/r.cgi",
    defaultFlagArray: [175, 115, 1],
    maxFlagArrayLength: 6,
    zero: window._s_ || (new Date())
};
window.TCISD = window.TCISD || {};
TCISD.valueStat = function(statId, resultType, returnValue, opts) {
    setTimeout(function() {
        TCISD.valueStat.send(statId, resultType, returnValue, opts);
    }, 0);
};
TCISD.valueStat.send = function(statId, resultType, returnValue, opts) {
    var _s = TCISD.valueStat,
        _c = _s.config,
        t = _c.defaultParams,
        p, url = [];
    statId = statId || t.statId;
    resultType = resultType || t.resultType;
    returnValue = returnValue || t.returnValue;
    opts = opts || t;
    if (typeof(opts.reportRate) != "number") {
        opts.reportRate = 1;
    }
    opts.reportRate = Math.round(Math.max(opts.reportRate, 1));
    if (!opts.fixReportRateOnly && !TCISD.valueStat.config.reportAll && (opts.reportRate > 1 && (Math.random() * opts.reportRate) > 1)) {
        return;
    }
    url.push((opts.reportURL || _c.webServerInterfaceURL), "?");
    url.push("flag1=", statId, "&", "flag2=", resultType, "&", "flag3=", returnValue, "&", "1=", (TCISD.valueStat.config.reportAll ? 1 : opts.reportRate), "&", "2=", opts.duration, "&");
    if (typeof opts.extendField != 'undefined') {
        url.push("4=", opts.extendField, "&");
    }
    if (_s.pluginList && _s.pluginList.length) {
        for (var i = 0, len = _s.pluginList.length; i < len; ++i) {
            (typeof(_s.pluginList[i]) == 'function') && _s.pluginList[i](url);
        }
    }
    url.push("sds=", Math.random());
    QZFL.pingSender(url.join(""));
};
TCISD.valueStat.config = {
    webServerInterfaceURL: "http://isdspeed.qq.com/cgi-bin/v.cgi",
    defaultParams: {
        statId: 1,
        resultType: 1,
        returnValue: 11,
        reportRate: 1,
        duration: 1000
    },
    reportAll: false
};
if (typeof(window.TCISD) == "undefined") {
    window.TCISD = {};
};
TCISD.hotClick = TCISD.hotClick ||
function(tag, domain, url, opt) {
    TCISD.hotClick.send(tag, domain, url, opt);
};
TCISD.hotClick.send = function(tag, domain, url, opt) {
    opt = opt || {};
    var _s = TCISD.hotClick,
        x = opt.x || 9999,
        y = opt.y || 9999,
        doc = opt.doc || document,
        w = doc.parentWindow || doc.defaultView,
        p = w._hotClick_params || {};
    url = url || p.url || w.location.pathname || "-";
    domain = domain || p.domain || w.location.hostname || "-";
    if (!_s.isReport()) {
        return;
    }
    url = [_s.config.webServerInterfaceURL, "?dm=", domain + ".hot", "&url=", escape(url), "&tt=-", "&hottag=", tag, "&hotx=", x, "&hoty=", y, "&rand=", Math.random()];
    QZFL.pingSender(url.join(""));
};
TCISD.hotClick._arrSend = function(arr, doc) {
    for (var i = 0, len = arr.length; i < len; i++) {
        TCISD.hotClick.send(arr[i].tag, arr[i].domain, arr[i].url, {
            doc: doc
        });
    }
};
TCISD.hotClick.click = function(event, doc) {
    var _s = TCISD.hotClick,
        tags = _s.getTags(QZFL.event.getTarget(event), doc);
    _s._arrSend(tags, doc);
};
TCISD.hotClick.getTags = function(dom, doc) {
    var _s = TCISD.hotClick,
        tags = [],
        w = doc.parentWindow || doc.defaultView,
        rules = w._hotClick_params.rules,
        t;
    for (var i = 0, len = rules.length; i < len; i++) {
        if (t = rules[i](dom)) {
            tags.push(t);
        }
    }
    return tags;
};
TCISD.hotClick.defaultRule = function(dom) {
    var tag, domain, t;
    tag = dom.getAttribute("hottag");
    if (tag && tag.indexOf("|") > -1) {
        t = tag.split("|");
        tag = t[0];
        domain = t[1];
    }
    if (tag) {
        return {
            tag: tag,
            domain: domain
        };
    }
    return null;
};
TCISD.hotClick.config = TCISD.hotClick.config || {
    webServerInterfaceURL: "http://pinghot.qq.com/pingd",
    reportRate: 1,
    domain: null,
    url: null
};
TCISD.hotClick._reportRate = typeof TCISD.hotClick._reportRate == 'undefined' ? -1 : TCISD.hotClick._reportRate;
TCISD.hotClick.isReport = function() {
    var _s = TCISD.hotClick,
        rate;
    if (_s._reportRate != -1) {
        return _s._reportRate;
    }
    rate = Math.round(_s.config.reportRate);
    if (rate > 1 && (Math.random() * rate) > 1) {
        return (_s._reportRate = 0);
    }
    return (_s._reportRate = 1);
};
TCISD.hotClick.setConfig = function(opt) {
    opt = opt || {};
    var _sc = TCISD.hotClick.config,
        doc = opt.doc || document,
        w = doc.parentWindow || doc.defaultView;
    if (opt.domain) {
        w._hotClick_params.domain = opt.domain;
    }
    if (opt.url) {
        w._hotClick_params.url = opt.url;
    }
    if (opt.reportRate) {
        w._hotClick_params.reportRate = opt.reportRate;
    }
};
TCISD.hotAddRule = function(handler, opt) {
    opt = opt || {};
    var _s = TCISD.hotClick,
        doc = opt.doc || document,
        w = doc.parentWindow || doc.defaultView;
    if (!w._hotClick_params) {
        return;
    }
    w._hotClick_params.rules.push(handler);
    return w._hotClick_params.rules;
};
TCISD.hotClickWatch = function(opt) {
    opt = opt || {};
    var _s = TCISD.hotClick,
        w, l, doc;
    doc = opt.doc = opt.doc || document;
    w = doc.parentWindow || doc.defaultView;
    if (l = doc._hotClick_init) {
        return;
    }
    l = true;
    if (!w._hotClick_params) {
        w._hotClick_params = {};
        w._hotClick_params.rules = [_s.defaultRule];
    }
    _s.setConfig(opt);
    w.QZFL.event.addEvent(doc, "click", _s.click, [doc]);
};
if (typeof(window.TCISD) == 'undefined') {
    window.TCISD = {};
}
TCISD.stringStat = function(dataId, hashValue, opts) {
    setTimeout(function() {
        TCISD.stringStat.send(dataId, hashValue, opts);
    }, 0);
};
TCISD.stringStat.send = function(dataId, hashValue, opts) {
    var _s = TCISD.stringStat,
        _c = _s.config,
        t = _c.defaultParams,
        url = [],
        isPost = false,
        htmlParam, sd;
    dataId = dataId || t.dataId;
    opts = opts || t;
    isPost = (opts.method && opts.method == 'post') ? true : false;
    if (typeof(hashValue) != "object") {
        return;
    }
    for (var i in hashValue) {
        if (hashValue[i].length && hashValue[i].length > 1024) {
            hashValue[i] = hashValue[i].substring(0, 1024);
        }
    }
    if (typeof(opts.reportRate) != 'number') {
        opts.reportRate = 1;
    }
    opts.reportRate = Math.round(Math.max(opts.reportRate, 1));
    if (opts.reportRate > 1 && (Math.random() * opts.reportRate) > 1) {
        return;
    }
    if (isPost && QZFL.FormSender) {
        hashValue.dataId = dataId;
        hashValue.sds = Math.random();
        var sd = new QZFL.FormSender(_c.webServerInterfaceURL, 'post', hashValue, 'UTF-8');
        sd.send();
    } else {
        htmlParam = TCISD.stringStat.genHttpParamString(hashValue);
        url.push(_c.webServerInterfaceURL, '?');
        url.push('dataId=', dataId);
        url.push('&', htmlParam, '&');
        url.push('ted=', Math.random());
        QZFL.pingSender(url.join(''));
    }
};
TCISD.stringStat.config = {
    webServerInterfaceURL: 'http://s.isdspeed.qq.com/cgi-bin/s.fcg',
    defaultParams: {
        dataId: 1,
        reportRate: 1,
        method: 'get'
    }
};
TCISD.stringStat.genHttpParamString = function(o) {
    var res = [];
    for (var k in o) {
        res.push(k + '=' + window.encodeURIComponent(o[k]));
    }
    return res.join('&');
};

TCISD.performanceTimeStat = function (flags, delay) {
  setTimeout(function () {
    var performance = window.performance || window.webkitPerformance || window.msPerformance;
    if (!performance || !window.TCISD) {
      return;
    }
    var list = [performance.timing.navigationStart, performance.timing.unloadEventStart, performance.timing.unloadEventEnd, performance.timing.redirectStart, performance.timing.redirectEnd, performance.timing.fetchStart, performance.timing.domainLookupStart, performance.timing.domainLookupEnd, performance.timing.connectStart, performance.timing.connectEnd, performance.timing.requestStart, performance.timing.responseStart, performance.timing.responseEnd, performance.timing.domLoading, performance.timing.domInteractive, performance.timing.domContentLoadedEventStart, performance.timing.domContentLoadedEventEnd, performance.timing.domComplete, performance.timing.loadEventStart, performance.timing.loadEventEnd];
    
    var o = new TCISD.TimeStat(null, flags.join('_')),
        length = list.length;
    o.zero = new Date(list[0]);
    for (var i = 1; i < length; i++){
      o.mark(i, new Date(list[i] || list[0]));
    }
    o.report();
    
  }, delay || 0);
};


var qcloud_oz_stat_page_list={
    "/app_manage.php":{ie:[7721,125,1],chrome:[7721,125,18],firefox:[7721,125,19]},
    "/LoginServerInfo.php":{ie:[7721,125,2],chrome:[7721,125,20],firefox:[7721,125,21]},
    "/cvm/CVMList.php":{ie:[7721,125,3],chrome:[7721,125,22],firefox:[7721,125,23]},
    "/Domain/DomainList.php":{ie:[7721,125,4],chrome:[7721,125,24],firefox:[7721,125,25]},
    "/webservice/viewMonitorData.php":{ie:[7721,125,5],chrome:[7721,125,5],firefox:[7721,125,5]},
    "/Domain/DomainConfig.php":{ie:[7721,125,6],chrome:[7721,125,26],firefox:[7721,125,27]},
    "/cdn_upload.php":{ie:[7721,125,7],chrome:[7721,125,28],firefox:[7721,125,29]},
    "/app_monitor.php":{ie:[7721,125,8],chrome:[7721,125,30],firefox:[7721,125,31]},
    "/Domain/CVMDomainBind.php":{ie:[7721,125,9],chrome:[7721,125,32],firefox:[7721,125,33]},
    "/webservice/webserviceManage.php":{ie:[7721,125,10],chrome:[7721,125,34],firefox:[7721,125,35]},
    "/cdb_list.php":{ie:[7721,125,11],chrome:[7721,125,36],firefox:[7721,125,37]},
    "/Domain/IpDomainBind.php":{ie:[7721,125,12],chrome:[7721,125,38],firefox:[7721,125,39]},
    "/app_access.php":{ie:[7721,125,13],chrome:[7721,125,40],firefox:[7721,125,41]},
    "/ws_code_manage.php":{ie:[7721,125,14],chrome:[7721,125,42],firefox:[7721,125,43]},
    "/shoppingcart.php":{ie:[7721,125,15],chrome:[7721,125,44],firefox:[7721,125,45]},
    "/NameService/NameServiceIpList.php":{ie:[7721,125,16],chrome:[7721,125,46],firefox:[7721,125,47]},
    "/cvm/ReturnCVMConfirm.php":{ie:[7721,125,17],chrome:[7721,125,48],firefox:[7721,125,49]}
};

$(window).load(function() {
    var pathname=window.location.pathname,
        bType= !!($.browser.msie) ?"ie":(!!($.browser.webkit) && window.navigator.userAgent.toLowerCase().indexOf('chrome')>-1)?"chrome":!!($.browser.mozilla)?"firefox":"";
    if(pathname && !!bType && qcloud_oz_stat_page_list.hasOwnProperty(pathname)){
        setTimeout(function() {
            TCISD.performanceTimeStat(qcloud_oz_stat_page_list[pathname][bType]);
        }, 10);
    }
});

openCloudX._initStat=function(){
    var pvf=function(){
        try{
            //TCISD.pv('yun.qq.com');
        }catch(e){
            setTimeout(pvf,1);
        }
    };
    if(!!JS_ONLINE_FLAG){
        pvf();
    }
};


//业务
//


/**
 * [getACSRFToken description]
 * 
 * @return {[type]} [description]
 */
openCloudX.util.getACSRFToken=function(){
    var skey=$.cookie("skey");
    if(!skey){
        return ;
    }
    var hash = 5381;
    for(var i = 0, len = skey.length; i < len; ++i){
        hash += (hash << 5) + skey.charCodeAt(i);
    }
    return hash & 0x7fffffff;
};

/**
 * 公用查询流程接口 opt:{taskId:"",taskType:"",moduleId:""}
 */
openCloudX.util.queryFlowResult=function(opt){
    var taskId=opt.taskId,
        taskType=opt.taskType,
        moduleId=opt.moduleId,
        fnSuc=opt.fnSuc,
        cFnErr=opt.cFnErr,
        fnErr=opt.fnErr;
    if(!taskId || !taskType || !moduleId){
        return;
    }
    $.getJSON('/ajax/GetFlowStatusByTaskId.php', {taskId:taskId,taskType:taskType,moduleId:moduleId}, function(ret, textStatus) {
        if(ret.retcode==0){
            if(ret.data.continuousFaile==1){
                cFnErr && cFnErr();
                openCloudX.util.showMsgBox({
                    type : "info",
                    text : '连续失败超过3次，请联系企业<a href="'+OPEN_DOMAIN+'/support" target="_blank">QQ(800013811)</a>'
                });
            }else{
                if(ret.data.status==0){
                    fnSuc && fnSuc(ret.data);
                }else if(ret.data.status==2){
                    setTimeout(function(){
                        openCloudX.util.queryFlowResult(opt);
                    },2000);
                }else if(ret.data.status==1){
                    fnErr && fnErr(ret.data);
                }else{
                    openCloudX.util.showMsgBox({type:"error",text:"系统繁忙，请稍后重试（status:"+ret.data.status+")"});
                }
            }
        }else{
            openCloudX.util.showMsgBox({type:"error",text:"系统繁忙，请稍后重试（code:"+ret.retcode+")"});
        }
    });
};


/*
 * 判断页面是不是被嵌在iframe/frame中（白名单*.qq.com），对header footer进行处理
 */
openCloudX._changeHeaderFooter=function(){
    try{
        var isInFrame=( top!= window || ( self.frameElement!=undefined && self.frameElement.tagName=="IFRAME"));
        if(isInFrame){
            var dm=(document.referrer.match(/:\/\/([^:\/]+)/i)||['', ''])[1];
            var rg=/(^|\.)qcloud\.com$/i;
            if(rg.test(dm)){
                $("#header_div").css("display","none");
                $("#footer_div").css("display","none");
            }else{
                top.location.href=self.location.href;
            }
        }
    }catch(e){

    }
};