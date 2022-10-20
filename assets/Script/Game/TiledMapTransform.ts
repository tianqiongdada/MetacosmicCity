import SingletonClass from "../base/SingletonClass";

export enum tiledAngel{
    nomral = 0, //正常地图
    Degress_45, //45度地图
    Hexagonal   //六角地图
} 

export class TiledMapTransform extends SingletonClass {

    public static ins(): TiledMapTransform {
        return super.ins() as TiledMapTransform;
    }

    //tiled地图坐标系转换
    public tileToOpenGL(angele:tiledAngel, tiledMap:cc.TiledMap, point: cc.Vec2): cc.Vec2 {
        switch(angele){
            case tiledAngel.nomral:
                    return this.normalToOpenGL(tiledMap, point);
            case tiledAngel.Degress_45:
                    return this.Degress_45ToOpenGL(tiledMap, point);
            case tiledAngel.Hexagonal:
                    break;
            default:
                break;
        }

        return cc.v2();
   }

   public openGLToTile(angele:tiledAngel, tiledMap:cc.TiledMap, point: cc.Vec2): cc.Vec2 {
        switch(angele){
            case tiledAngel.nomral:
                    return this.openGLToDegress_45(tiledMap, point);
            case tiledAngel.Degress_45:
                    return this.openGLToNormal(tiledMap, point);
            case tiledAngel.Hexagonal:
                    break;
            default:
                break;
        }

        return cc.v2();
    }

    public openGLToScreen(tiledMap:cc.TiledMap, point: cc.Vec2) {
        let mapSize = tiledMap.getMapSize();
        let tileSize = tiledMap.getTileSize();
        let x = point.x - mapSize.width * tileSize.width / 2;
        let y = point.y - mapSize.height * tileSize.height / 2;
        
        return cc.v2(x, y);
   }
   
   public screenToOpenGL(tiledMap:cc.TiledMap, point: cc.Vec2) {
        let mapSize = tiledMap.getMapSize();
        let tileSize = tiledMap.getTileSize();
        let x = point.x + mapSize.width * tileSize.width / 2;
        let y = point.y + mapSize.height * tileSize.height / 2;
        
        return cc.v2(x, y);
   }

    //正常方块 tiled地图坐标系转换
   private normalToOpenGL(tiledMap:cc.TiledMap, point: cc.Vec2) {
        let mapSize = tiledMap.getMapSize();
        let tileSize = tiledMap.getTileSize();
        let x = point.x * tileSize.width + tileSize.width / 2;
        let y = (mapSize.height - point.y) * tileSize.height - tileSize.height / 2;
        
        return cc.v2(x, y);
    }
    
    private openGLToNormal(tiledMap:cc.TiledMap, point: cc.Vec2) {
        let mapSize = tiledMap.getMapSize();
        let tileSize = tiledMap.getTileSize();
        let x = Math.floor(point.x / tileSize.width);
        let y = Math.floor((mapSize.height * tileSize.height - point.y) / tileSize.height);
        
        return cc.v2(x, y);
    }
    
     //45度/45度交错 tiled地图坐标系转换
     private Degress_45ToOpenGL(tiledMap:cc.TiledMap, point: cc.Vec2) {
        let mapSize = tiledMap.getMapSize();
        let tileSize = tiledMap.getTileSize();
        let x = point.x * tileSize.width + Math.floor(point.y % 2) * tileSize.width / 2;
        let y = (mapSize.height - (point.y + 1)) * tileSize.height / 2 - tileSize.height / 2;
        
        return cc.v2(x, y);
   }
   
   private openGLToDegress_45(tiledMap:cc.TiledMap, point: cc.Vec2) {
        let mapSize = tiledMap.getMapSize();
        let tileSize = tiledMap.getTileSize();
        let y = Math.floor((mapSize.height - 2 - ((2 * Math.floor(point.y) / Math.floor(tileSize.height)))));
        let x = Math.floor(point.x / tileSize.width - (y % 2) / 2);
        
        return cc.v2(x, y);
   }
}
