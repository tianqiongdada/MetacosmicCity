// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { GlobalFuncs } from "../Common/GlobalFuncs";
import { LoadingPanelMgr } from "../managers/LoadingPanelMgr";
import { SdkManager } from "../managers/SdkManager";
import { TipMgr } from "../managers/TipMgr";
import CptBase from "../MsgFrame/CptBase";
import { Msg, MsgCmd } from "../MsgFrame/Msg";
import { MsgCenter } from "../MsgFrame/MsgCenter";
import { WebSocketEx } from "../MsgFrame/WebSocketEx";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Login extends CptBase {
    @property(cc.Prefab)
    gameTip: cc.Prefab = null;

    @property(cc.Prefab)
    loadingPanel: cc.Prefab = null;

    SetSupportMainCmd(): number[] {
        return [MsgCmd.Login];
    }

    protected onLoad(): void {
        super.onLoad();

    }

    protected onDestroy(): void {
        super.onDestroy();

    }

    start() {
        let btnNameNode = GlobalFuncs.ins().findNode('title', this.node);
        // btnNameNode.getComponent(cc.Label).string = '登录';
        TipMgr.ins().initUI(this.gameTip, this.gameTip);
        LoadingPanelMgr.ins().init(this.loadingPanel);
    }

    RecvMsg(msg: Msg): void {
        switch (msg.mainCmd) {
            case MsgCmd.Login:
                {
                    if (0x01 == msg.subCmd) { //个人消息
                        cc.director.loadScene('Game');
                    }
                }
                break
            default:
                break;
        }
    }

    Login() {
        // MsgCenter.SendCustomMsg(MsgCmd.Login, 1, null, 0, null);
    }

    private onLoginBtnHandler(): void {
        let self = this;
        SdkManager.ins().loginAuthorization(self.loginCallbackHandler.bind(self));
    }

    private loginCallbackHandler(data): void {
        let self = this;
        LoadingPanelMgr.ins().removeLoadingPanel();
        if (data) {
            cc.director.loadScene("Game");
        } else {
            cc.director.loadScene("Game");
        }
    }

    // update (dt) {}
}
