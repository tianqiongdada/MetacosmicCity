// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import CptBase from "../MsgFrame/CptBase";
import { Msg, MsgCmd } from "../MsgFrame/Msg";

const {ccclass, property} = cc._decorator;

@ccclass('摄像机控制')
export default class MapCameraCtrl extends CptBase {

    SetSupportMainCmd():number[]{
        return [MsgCmd.Camera];
    }

    RecvMsg(msg: Msg): void {
        switch (msg.mainCmd)
        {
            case MsgCmd.Camera:
                {
                    
                }
                break
            default:
                break;
        }
    }

    OnTouchStart(event:cc.Event.EventTouch){

    }

    OnTouchMove(event:cc.Event.EventTouch){
        let touches = event.getTouches();

        if (1 == touches.length) {
            console.log('camera 1个触摸点');

            let delta=event.getDelta(); 
            console.log('id:' + event.getID());
            this.node.x-=delta.x;
            this.node.y-=delta.y;    
        }

        else if(2 == touches.length){
            console.log('camera 2个触摸点');
            event.getStartLocation();
        }
         
    }

    OnTouchEnd(event:cc.Event.EventTouch){

    }

    protected onLoad(): void {
        super.onLoad();
        this.node.on(cc.Node.EventType.TOUCH_START, this.OnTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.OnTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.OnTouchEnd, this);

        this.node.on(cc.Node.EventType.MOUSE_WHEEL, (event:cc.Event.EventMouse)=>{
            let scrollY = event.getScrollY();
        })
    }

    protected onDestroy(): void {
        super.onDestroy();

    }
}
