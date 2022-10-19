// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { findNode } from "../Common/GlobalFuncs";
import GameData from "../data/GameData";
import { LoadingPanelMgr } from "../managers/LoadingPanelMgr";
import { PanelMgr } from "../managers/PanelMgr";
import { SdkManager } from "../managers/SdkManager";
import { TipMgr } from "../managers/TipMgr";
import CptBase from "../MsgFrame/CptBase";
import { Msg, MsgCmd } from "../MsgFrame/Msg";
import { MsgCenter } from "../MsgFrame/MsgCenter";
import { WebSocketEx } from "../MsgFrame/WebSocketEx";
import { GameUtils } from "../untils/GameUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Login extends CptBase {
    @property(cc.Prefab)
    gameTip: cc.Prefab = null;

    @property(cc.Prefab)
    loadingPanel: cc.Prefab = null;
    @property(cc.Prefab)
    CommonPanel: cc.Prefab = null;

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
        let self = this;
        let btnNameNode = findNode('title', self.node);
        // btnNameNode.getComponent(cc.Label).string = '登录';
        TipMgr.ins().initUI(self.gameTip, self.gameTip);
        LoadingPanelMgr.ins().init(self.loadingPanel);
        PanelMgr.ins().init(self.CommonPanel);
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
        // WebSocketEx.GetInstance().connect("", null);
        // MsgCenter.SendCustomMsg(MsgCmd.Login, 1, null, 0, null);
    }

    private onLoginBtnHandler(): void {
        let self = this;
        SdkManager.ins().loginAuthorization(self.loginCallbackHandler.bind(self));
        // PanelMgr.ins().showCommonPanel("测试通用弹框", null);
    }

    private loginCallbackHandler(type, data): void {
        let self = this;
        LoadingPanelMgr.ins().removeLoadingPanel();
        if (!cc.sys.isNative) {
            cc.director.loadScene("Game");
            return;
        }
        if (type == 1) {
            // PanelMgr.ins().showCommonPanel(data, null);
            self.node.getChildByName("topNode").getChildByName("adressLabel").getComponent(cc.Label).string = "地址:" + GameUtils.formatSthByLen1(GameData.ins().accountAddress, 16);
        } else if (type == 2) {
            PanelMgr.ins().showCommonPanel("授权失败", null);
        } else {
            PanelMgr.ins().showCommonPanel("授权失败", null);
        }
        // if (data) {
        //     cc.director.loadScene("Game");
        // } else {
        //     cc.director.loadScene("Game");
        // }
    }

    // update (dt) {}
}
