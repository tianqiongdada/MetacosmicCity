
/**
 * created  2018/8/8,by work
 */
export class GameUtils {
    public static screenWidthScale: number = 1;//屏幕缩放的width比例
    private static _isShowLog: boolean = true;
    public static showLog(msg): void {
        if (this._isShowLog) {
            console.log(msg);
        }
    }
    public static getPlatformStr() {
        // OS:android,ios
        var platromStr = "";
        if (cc.sys.isNative) {
            if (cc.sys.os == cc.sys.OS_IOS) {
                platromStr = "ios";
            } else if (cc.sys.os == cc.sys.OS_ANDROID) {
                platromStr = "android";
            }
        }
        return platromStr;
    }

    /**
     * 获取换行字符串
     * @param str
     *
     */
    public static formatSthByLen(str: string, len: number, suffix: string = "***"): string {
        if (!str) return;

        let totalLen: number = 0;
        //length属性读出来的汉字长度为1
        if (str.length * 2 <= len) {

            return str;

        }
        var strlen = 0;

        var s = "";

        for (var i = 0; i < str.length; i++) {

            s = s + str.charAt(i);

            if (str.charCodeAt(i) > 128) {

                strlen = strlen + 2;
                totalLen += 2;
                if (strlen >= len) {

                    return s.substring(0, s.length - 1) + suffix;

                }

            } else {

                strlen = strlen + 1;
                totalLen += 1;
                if (strlen >= len) {

                    return s.substring(0, s.length - 2) + suffix;

                }

            }
        }
        return s;
    }



    public static formatSthByLen1(str: string, len: number, suffix: string = "***"): string {
        if (!str) return;
        let totalLen: number = 0;
        //length属性读出来的汉字长度为1
        if (str.length * 2 <= len) {
            return str;
        }
        var strlen = 0;
        var s = str.slice(0, len / 2) + suffix + str.slice(str.length - 1 - len / 2, str.length);
        return s;
    }


    /**
     * 通过日期获取时间戳
     * @param data 
     */
    public static getTimeByDate(data: string): number {
        let d = new Date(data);
        let times: number = d.getTime();
        return times;
    }


    public static getDataByTimes(times: number): string {
        let self = this;
        let time: any = new Date(times * 1000);
        let y = time.getFullYear();
        let m = time.getMonth() + 1;
        let d = time.getDate();
        let h = time.getHours();
        let mm = time.getMinutes();
        let ss = time.getSeconds();
        let result: string = y + "-" + m + "-" + d + "  " + h + ":" + mm + ":" + ss;
        return result;
    }



    /**
     * 根据特定的长度获取换行后的字符串
     * @param str
     *
     */
    public static getTextLineFeedByLen(str: string, len: number): string {
        if (!str) return;
        //length属性读出来的汉字长度为1
        if (str.length * 2 <= len) {

            return str;

        }
        var strlen = 0;

        var s = "";

        for (var i = 0; i < str.length; i++) {

            s = s + str.charAt(i);

            if (str.charCodeAt(i) > 128) {

                strlen = strlen + 2;

                if (strlen >= len) {

                    s = s + "\n";
                    strlen = 0;
                }
            } else {
                strlen = strlen + 1;
                if (strlen >= len) {

                    s = s + "\n";
                    strlen = 0;

                }

            }
        }
        return s;
    }



    /**
     * 格式化金币
     * @param num 
     * @returns 
     */
    public static getFormatCoinNum(num: number, toFixed: number): string {
        let result: string = (num / (10 ** 18)).toFixed(toFixed);
        return result;
    }



    /**
     * 返回占用字节个数
     * @param str 
     * @returns 
     */
    public static getCharNumByStr(str: string): number {
        let self = this;
        let len: number = 0;
        if (!str || str && str == "") {
            return 0;
        }
        for (var i = 0; i < str.length; i++) {


            if (str.charCodeAt(i) > 128) {
                //中文符号
                len += 2;

            } else {
                len += 1;

            }
        }
        return len;
    }

    /**
     * 获取数组总共的总数
     * @param arr 
     */
    public static getArrTotalNum(arr: number[]): number {
        let self = this;
        let totalNum: number = 0;
        for (let i = 0; i < arr.length; i++) {
            totalNum += arr[i];
        }
        return totalNum;
    }


    /**
     * 格式化时间
     * @param times 毫秒单位
     * @param type 1 格式化成天，时，分 2 格式化为 时分秒
     */
    public static getFormatTime(times: number, type: number): string {
        if (type == 1) {
            //times 毫秒
            let d: string = Math.floor(times / (1000 * 60 * 60 * 24)).toString();
            let h: string = Math.floor(times % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)).toString();
            if (Number(h) < 10) {
                h = "0" + h;
            }
            let m: string = Math.floor(times % (1000 * 60 * 60) / (1000 * 60)).toString();
            if (Number(m) < 10) {
                m = "0" + m;
            }
            // let s: string = Math.floor(times % (1000 * 60) / 1000).toString();
            // if (Number(s) < 10) {
            //     s = "0" + s;
            // }
            let str: string = d + ":" + h + ":" + m;
            return str;
        } else if (type == 2) {
            //times 为秒
            let h: string = Math.floor(times / (60 * 60)).toString();
            if (Number(h) < 10) {
                h = "0" + h;
            }
            let m: string = Math.floor(times % (60 * 60) / 60).toString();
            if (Number(m) < 10) {
                m = "0" + m;
            }

            let s: string = Math.floor(times % 60).toString();
            if (Number(s) < 10) {
                s = "0" + s;
            }
            let str: string = h + ":" + m + ":" + s;
            return str;
        }

    }



    /**
 * 格式化时间
 * @param times 毫秒单位
 * @param type 1 格式化成天，时，分 2 格式化为 时分秒
 */
    public static getFormatTime1(times: number): string {
        //times 为秒
        let d: string = Math.floor(times / (60 * 60 * 24)).toString();
        if (Number(d) < 10) {
            d = "0" + d;
        }
        let h: string = Math.floor(times % ((60 * 60 * 24)) / (60 * 60)).toString();
        if (Number(h) < 10) {
            h = "0" + h;
        }
        let m: string = Math.floor(times % (60 * 60) / 60).toString();
        if (Number(m) < 10) {
            m = "0" + m;
        }

        let s: string = Math.floor(times % 60).toString();
        if (Number(s) < 10) {
            s = "0" + s;
        }
        let str: string = d + ":" + h + ":" + m + ":" + s;
        return str;
    }



    /**
     * 判断是否是数字
     * @param val 
     */
    public static isRealNum(val): boolean {
        let self = this;
        // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除，

        if (val === "" || val == null) {
            return false;
        }
        if (!isNaN(val)) {
            //对于空数组和只有一个数值成员的数组或全是数字组成的字符串，isNaN返回false，例如：'123'、[]、[2]、['123'],isNaN返回false,
            //所以如果不需要val包含这些特殊情况，则这个判断改写为if(!isNaN(val) && typeof val === 'number' )
            return true;
        }

        else {
            return false;
        }
    }


    /**
     * 格式化数据
     * @param num 
     * @returns 
     */
    public static formateNum(num: number): string {
        return num.toString();
    }

    /**
     * 获取制定长度的随机字符串
     * @param len
     */
    public static getRandomStrByLen(len: number): string {
        var num = Math.floor(Math.random() * Math.pow(10, len));
        var str;
        str = num.toString();
        if (num.toString().length < len) {
            var diffLen = len - num.toString().length;
            for (var i = 0; i < diffLen; i++) {
                str = "0" + str;
            }
        }
        return str;
    }

    public static getFormateNum(num: number): string {
        if (num < 10000) {
            return num + "";
        }

        let wan: number = Math.floor(num / 10000);
        let dian: string = (num % 10000 / 10000).toFixed(2);
        if (dian == "0.00") {
            dian = "";
        }
        return wan + dian + "万";
    }


    //在区间固定区间获取随机数
    public static getRandomNum(minNum, maxNum): number {
        return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
    }


    /**
     * 判断一个数据是否完全包含另外一个数组
     * @param arr 
     * @param containArr 被包含的数据
     */
    public static isContainArr(arr: any[], containArr: any[]): boolean {
        let isHave: boolean = true;
        if (!arr.length) return false;

        for (let i = 0; i < containArr.length; i++) {
            if (arr.indexOf(containArr[i]) < 0) {
                isHave = false;
                break;
            }
        }
        return isHave;
    }


    /**
     * 设置按钮是否可以点击
     */
    public static buttonIsCanClick(isCanClick: boolean, btnNode: cc.Node): void {
        let self = this;
        if (!btnNode) return;
        let button: cc.Button = btnNode.getComponent(cc.Button);
        if (button) {
            if (isCanClick) {
                button.transition = cc.Button.Transition.SCALE;
                button.interactable = true;
            } else {
                button.transition = cc.Button.Transition.SPRITE;
                button.interactable = false;
            }
        }
    }


    /**
     * 获取两点之间的距离
     * @param p1 
     * @param p2 
     */
    public static getTwoPointsDis(p1: cc.Vec2, p2: cc.Vec2): number {
        let self = this;
        if (!p1 || !p2) return 0;
        let a = p2.x - p1.x;
        let b = p2.y - p1.y;
        return Math.sqrt(a * a + b * b);
    }


    /**
     * 获取当前场景视图
     */
    public static getCurScene(): cc.Node {
        let self = this;
        let curScene = cc.director.getScene().getChildByName("Canvas");
        return curScene;
    }


    /**
     * 获取当前的时间戳
     */
    public static getCurTimes(): number {
        let timestamp = new Date().getTime();
        return timestamp;
    }

    public static setGray(node: cc.Node | cc.Label | cc.Sprite, gray: boolean = true, children?: boolean): void {
        let target: any = node
        var material = cc.Material.createWithBuiltin(gray ? cc.Material.BUILTIN_NAME.GRAY_SPRITE : <any>cc.Material.BUILTIN_NAME.SPRITE, 0);
        // material.define("USE_TEXTURE", true, 0);
        if (node instanceof cc.Node) {
            target = node.getComponent(cc.Sprite);
            target && target.setMaterial(0, material);
            target = node.getComponent(cc.Label);
            target && target.setMaterial(0, material);
            children && node.children.forEach(subNode => {
                target = subNode.getComponent(cc.Sprite);
                target && target.setMaterial(0, material);
                target = subNode.getComponent(cc.Label);
                target && target.setMaterial(0, material);
            }, this)
        } else {
            target && target.setMaterial(0, material);
        }
    }

    public static copyToClipBoard(str) {
        if (cc.sys.isNative) {
            //原生自己实现
        } else if (cc.sys.isBrowser) {
            let textArea: any = document.getElementById("clipBoard");
            if (textArea === null) {
                textArea = document.createElement("textarea");
                textArea.id = "clipBoard";
                textArea.textContent = str;
                document.body.appendChild(textArea);
            }
            textArea.select();
            try {
                const msg = document.execCommand('copy') ? 'successful' : 'unsuccessful';
                cc.log("已经复制到剪贴板");
                document.body.removeChild(textArea);
            } catch (err) {
                cc.log("复制到剪贴板失败");
            }
        }
    }

    public static isPhoneNum(phone: string) {
        if (phone.length != 11) return false;
        let firstNum: number = Number(phone[0]);
        if (firstNum != 1) return false;
        return true;
        // var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/; 
        // if(!myreg.test(phone)) 
        // { 
        //     return false; 
        // } 
        // return true;
    }


    /**
     * 获取时间戳
     * @param data 
     * @returns 
     */
    public static getTimestamp(data: string): number {
        let d = new Date(data);
        return d.getTime();
    }




    /**
     * 打乱数组
     * @param arr 
     */
    public static randomSort(arr: any[]): any {
        arr.sort(function (a, b) {
            return Math.random() > .5 ? -1 : 1;
        })
        return arr;
    }


    public static hex2int(hex) {
        var len = hex.length, a = new Array(len), code;
        for (var i = 0; i < len; i++) {
            code = hex.charCodeAt(i);
            if (48 <= code && code < 58) {
                code -= 48;
            } else {
                code = (code & 0xdf) - 65 + 10;
            }
            a[i] = code;
        }

        return a.reduce(function (acc, c) {
            acc = 16 * acc + c;
            return acc;
        }, 0);
    }


    public static getFNum(num: number): string {
        //这边看下你那边有没有指定格式，可能没有+，所以后面改成('E')就好了
        let numStr = new Number(num).valueOf().toString();
        let temp: string[] = numStr.toUpperCase().split('E+')
        if (!temp[1]) {
            return numStr;
        }
        //这边我之前有试过乘法，但是返回之后，它又给转回科学计数法了
        let pointNum: number;
        if (temp[0].split(".")[1]) {
            pointNum = temp[0].split(".")[1].length;
        } else {
            pointNum = 0;
        }
        temp[1] = (Number(temp[1]) - pointNum).toString();
        temp[0] = temp[0].replace(".", "");
        let tempNumStr: string = temp[0];
        for (let i = 0; i < parseInt(temp[1]); i++) {
            tempNumStr += "0";

        }
        return tempNumStr;
    }


    /**
 * 保存到本地
 * @param key 
 * @param val 
 */
    public static saveToLocal(key: string, val: string): void {
        let self = this;
        cc.sys.localStorage.setItem(key, val);
    }

    /**
     * 获取本地的数据
     * @param key 
     * @returns 
     */
    public static getFromLocalByKey(key: string): any {
        if (cc.sys.localStorage.getItem(key)) {
            return cc.sys.localStorage.getItem(key);
        }
        return null;
    }
}
window["GameUtils"] = GameUtils;