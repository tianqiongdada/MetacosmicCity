// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import { Msg } from "./Msg";
import { MsgCenter } from "./MsgCenter";


//网络消息基类，继承此基类重写该函数完成注册
@ccclass
export default abstract  class CptBase extends cc.Component {

    protected supportMainCmd:number[] = [];

    //设置支持的
    abstract  SetSupportMainCmd():number[];

    //接收消息
    abstract RecvMsg(msg:Msg) : void;

    IsSupportCmd(mainCmd:number):boolean{
        return this.supportMainCmd.indexOf(mainCmd) > -1;
    }

    protected onLoad(): void {
        MsgCenter.RegisterMgr(this);
        this.supportMainCmd = this.SetSupportMainCmd();
    }

    protected onDestroy(): void {
        MsgCenter.DeleteRegister(this);
    }
}
