// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import EventTargetMgr from "../managers/EventTargetMgr";
import CptBase from "../MsgFrame/CptBase";
import { Msg, MsgCmd } from "../MsgFrame/Msg";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BigMap extends CptBase {
    bigMap:cc.TiledMap;

   //设置支持的
   protected SetSupportMainCmd():number[]{
        return [MsgCmd.Map];
   }

   //接收消息
    protected RecvMsg(msg: Msg): void {
        
    }

   protected onLoad(): void {
        super.onLoad();
 
   }

   protected onDestroy(): void {
        super.onLoad();


   }

   protected start(): void {
        this.bigMap = this.getComponent(cc.TiledMap);
        this.bigMap.getLayer('floor');       
   }

    protected update(dt: number): void {
        
    }
}
