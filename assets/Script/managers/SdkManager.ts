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
     * 
     * 收到授权java 回调
     * @param type 1授权成功 2 授权失败 0 授权取消
     * @param data 
     */
    public receiveLoginAuthorization(type: number, data): void {
        console.log("[javaToTs]收到java调js数据:type" + type + "data:" + data);
        GameData.ins().authorizationData =JSON.parse(data);
        // console.log("[javaToTs]收到java调js转换之后的数据"+GameData.ins().authorizationData);
        GameData.ins().accountAddress = GameData.ins().authorizationData.account;
        if (this._callback) {
            this._callback(type,data);
        }
        this._callback = null;
    }
}

window["SdkManager"] = SdkManager.ins();

