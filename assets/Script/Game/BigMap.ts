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
     SetSupportMainCmd():number[]{
        return [MsgCmd.Map];
     }

   //接收消息
     RecvMsg(msg: Msg): void {
        
     }

     OnTouchStart(event:cc.Event.EventTouch){
          
     }
 
     OnTouchMove(event:cc.Event.EventTouch){
         let touches = event.getTouches();
 
         if (1 == touches.length) {
             console.log('map 1个触摸点');
         }
 
         else if(2 == touches.length){
             console.log('map 2个触摸点');
             event.getStartLocation();
         }
          
     }
 
     OnTouchEnd(event:cc.Event.EventTouch){
 
     }

     protected onLoad(): void {
        super.onLoad();
 
        super.onLoad();
        this.node.on(cc.Node.EventType.TOUCH_START, this.OnTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.OnTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.OnTouchEnd, this);
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
