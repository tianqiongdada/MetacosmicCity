/**
 * created  2018/8/9,by work
 * 游戏控制单例类，主要是控制游戏里面的所有逻辑
 */
import SingletonClass from "../base/SingletonClass";
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
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "Test", "(Ljava/lang/String;)V", "this is a message from js");
        }
    }

    public receiveLoginAuthorization(data): void {
        console.log("收到java调js数据:" + data);
        if (this._callback) {
            this._callback(data);
        }
        this._callback = null;
    }
}

window["SdkManager"] = SdkManager.ins();

