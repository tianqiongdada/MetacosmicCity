// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { findNode } from "../Common/GlobalFuncs";
import CptBase from "../MsgFrame/CptBase";
import { Msg, MsgCmd} from "../MsgFrame/Msg";
import { MsgCenter } from "../MsgFrame/MsgCenter";
import { WebSocketEx } from "../MsgFrame/WebSocketEx";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Login extends CptBase {

    SetSupportMainCmd():number[]{
        return [MsgCmd.Login];
    }

    protected onLoad(): void {
        super.onLoad();
    }

    protected onDestroy(): void {
        super.onDestroy();

    }

    start () {
        let btnNameNode = findNode('title', this.node);
        btnNameNode.getComponent(cc.Label).string = '登录';
    }

    RecvMsg(msg: Msg): void {
        switch (msg.mainCmd)
        {
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

    Login(){
        // WebSocketEx.GetInstance().connect("", null);
        MsgCenter.SendCustomMsg(MsgCmd.Login, 1, null, 0, null);
    }

    // update (dt) {}
}
