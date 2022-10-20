// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import EventTargetMgr from "../managers/EventTargetMgr";
import CptBase from "../MsgFrame/CptBase";
import { Msg, MsgCmd } from "../MsgFrame/Msg";
import { MsgCenter } from "../MsgFrame/MsgCenter";
import { tiledAngel, TiledMapTransform } from "./TiledMapTransform";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BigMap extends CptBase {
     @property(cc.Camera)
     mapCamera:cc.Camera;

     bigMap:cc.TiledMap;

   //设置支持的
     SetSupportMainCmd():number[]{
        return [MsgCmd.Map];
     }

   //接收消息
     RecvMsg(msg: Msg): void {
        
     }

     //获取地图点击坐标
     TouchTile(event:cc.Event.EventTouch){
          let touchPoint = event.getStartLocation();
          console.log('locationPoint:' + touchPoint);
          let worldPoint:cc.Vec2;
          this.mapCamera.getScreenToWorldPoint(touchPoint, worldPoint);
          console.log('worldPoint:' + worldPoint);
          let mapPoint = TiledMapTransform.ins().openGLToTile( tiledAngel.Degress_45, this.bigMap, worldPoint);
          console.log('mapPoint:' + mapPoint);
          let floorLayer:cc.TiledLayer = this.bigMap.getLayer('floor');
          // let tile = floorLayer.getTiledTileAt(mapPoint.x, mapPoint.y, false);
          // console.log('tile:' +  tile);
     }


     //地图摄像机控制
     CameraCtrl (event:cc.Event.EventTouch) : void {
         let touches = event.getTouches();
 
         if (1 == touches.length) {
             let delta=event.getDelta(); 
            console.log('id:' + event.getID());
            this.mapCamera.node.x -= delta.x;
            this.mapCamera.node.y -= delta.y;   
            
         }
 
         else if(2 == touches.length){
             event.getStartLocation();

         }
     }

     registerTouchEvent() : void{
          //触摸
          this.node.on(cc.Node.EventType.TOUCH_START, (event:cc.Event.EventTouch)=>{
               this.TouchTile(event);
          }, this);

          //触摸移动
          this.node.on(cc.Node.EventType.TOUCH_MOVE, (event:cc.Event.EventTouch)=>{
               this.CameraCtrl(event);

          }, this);   

          //触摸结束
          this.node.on(cc.Node.EventType.TOUCH_END, (event:cc.Event.EventTouch)=>{

          }, this);
     }
 
     protected onLoad(): void {
          super.onLoad();
          this.registerTouchEvent(); //触摸事件注册

     }

     protected onDestroy(): void {
        super.onLoad();

     }

     protected start(): void {
         this.bigMap = this.getComponent(cc.TiledMap);
         let floorLayer = this.bigMap.getLayer('floor'); 
          floorLayer.enableCulling(true);
     }

     protected update(dt: number): void {
          
     }
}
