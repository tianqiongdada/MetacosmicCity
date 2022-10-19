// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import CptBase from "../MsgFrame/CptBase";
import { Msg, MsgCmd } from "../MsgFrame/Msg";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Main extends CptBase {

    SetSupportMainCmd():number[]{
        return [MsgCmd.Game];
    }

    protected onLoad(): void {
        super.onLoad();

    }

    protected onDestroy(): void {
        super.onDestroy();

    }

    RecvMsg(msg: Msg): void {
        
    }
}
