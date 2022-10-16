/**
 * created  2018/8/9,by work
 * 游戏控制单例类，主要是控制游戏里面的所有逻辑
 */
import SingletonClass from "../base/SingletonClass";


export class GameMgr extends SingletonClass {
    public static ins(): GameMgr {
        return super.ins() as GameMgr;
    }
    public init(): void {
        let self = this;
    }
}
window["GameMgr"] = GameMgr.ins();