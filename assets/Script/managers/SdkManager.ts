/**
 * created  2018/8/9,by work
 * 游戏控制单例类，主要是控制游戏里面的所有逻辑
 */
import SingletonClass from "../base/SingletonClass";
import GameData from "../data/GameData";
import { LoadingPanelMgr } from "./LoadingPanelMgr";
export class SdkManager extends SingletonClass {
    private _callback: Function = null;
    public static ins(): SdkManager {
        return super.ins() as SdkManager;
    }
    public init(): void {
        let self = this;
    }

    //登录授权
    public loginAuthorization(callback: Function): void {
        let self = this;
        LoadingPanelMgr.ins().showLoadingPanel("登录授权中");
        self._callback = callback;
        if (!cc.sys.isNative) {
            callback();
            return;
        }
        LoadingPanelMgr.ins().showLoadingPanel("登录授权中");
        if (cc.sys.os == cc.sys.OS_IOS) {
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "loginAuthorization", "(Ljava/lang/String;)V", "d");
        }
    }

    /**
     * 合约推送统一接口
     * @param from 
     * @param to 
     * @param gas 
     * @param chainId 
     * @param data 
     * @param callback 
     * let data = ethers.utils.hexDataSlice(ethers.utils.id('fee()'), 0, 4);
     */
    public pushTransaction(from: string, to: string, gas: number, chainId: number, data: string, gasPrice: number, callback: Function): void {
        let self = this;
        let obj: any = {
            from: from,
            to: to,
            gas: gas,
            chainId: chainId,
            data: data,
            gasPrice: gasPrice
        }
        let testStr:string = "{\n" +
        "\t\"from\": \"0xc8a0b15abECeB31f02dD3FA5f914EF04030700C7\",\n" +
        "\t\"gas\": \"0x8cec\",\n" +
        "\t\"chainId\": 97,\n" +
        "\t\"data\": " +
        "\"0xddca3f43\",\n" +
        "\t\"to\": \"0xECa41281c24451168a37211F0bc2b8645AF45092\",\n" +
        "\t\"gasPrice\": \"0x13f2ed0c0\"\n" +
        "}";
        let str: string =JSON.stringify(JSON.stringify(obj));
        console.log("[tsLog]合约打包之后的字符串:" + str);
        self._callback = callback;
        if (!cc.sys.isNative) {
            callback();
            return;
        }
        LoadingPanelMgr.ins().showLoadingPanel("登录授权中");
        if (cc.sys.os == cc.sys.OS_IOS) {
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "pushTransactionHandler", "(Ljava/lang/String;)V", testStr);
        }
    }


    public testPushTransaction(): void {
        let self = this;
        let from: string = "0xc8a0b15abECeB31f02dD3FA5f914EF04030700C7";
        let to: string = "0xECa41281c24451168a37211F0bc2b8645AF45092";
        let chainId = 56;
        let gasPrice = 0x13f2ed0c0;
        let gas = 0x8cec;
        let datethersa = window[""].utils.hexDataSlice(window["ethers"].utils.id('fee()'), 0, 4);;
        self.pushTransaction(from, to, gas, chainId, data, gasPrice, null);
    }

    //收到合约回调
    public receivePushTransaction(type: number, data): void {
        let self = this;
        console.log("[tsLog]收到java调js数据:type" + type + "data:" + data);
        self._callback = null;
    }


    /**
     * 
     * 收到授权java 回调
     * @param type 1授权成功 2 授权失败 0 授权取消
     * @param data 
     */
    public receiveLoginAuthorization(type: number, data): void {
        console.log("[tsLog]收到java调js数据:type" + type + "data:" + data);
        GameData.ins().authorizationData = JSON.parse(data);
        // console.log("[javaToTs]收到java调js转换之后的数据"+GameData.ins().authorizationData);
        GameData.ins().accountAddress = GameData.ins().authorizationData.account;
        if (this._callback) {
            this._callback(type, data);
        }
        this._callback = null;
    }



}

window["SdkManager"] = SdkManager.ins();

