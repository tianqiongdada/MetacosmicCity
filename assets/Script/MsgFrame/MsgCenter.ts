// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import CptBase from "./CptBase";
import { Msg, MsgCmd } from "./Msg";

export class MsgCenter {
    private static receiverList:CptBase[] = [];

    static RegisterMgr(reviver:CptBase){
        this.receiverList.push(reviver);
    }

    static DeleteRegister(reviver:CptBase){
        for (let index = 0; index < this.receiverList.length; index++) {
            const element = this.receiverList[index];
            if(element == reviver){
                this.receiverList.splice(index, 1);
                return;
            }
        }
    }

    static SendMsg(msg:Msg){
        for (const reviver of  this.receiverList) {
            if(reviver.IsSupportCmd(msg.mainCmd))
                reviver.RecvMsg(msg);
        }
    }

    static SendCustomMsg(mainCmd:number, subCmd:number, anyData:any, dataLen:number, anyCallBack:any){
        let msg = new Msg(mainCmd, subCmd,anyData, dataLen,anyCallBack);
        this.SendMsg(msg);
    }
}