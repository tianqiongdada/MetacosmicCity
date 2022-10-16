
import SingletonClass from "../base/SingletonClass";

export default class GameData extends SingletonClass {
    public static winSizeW: number = 0;
    public static winSizeH: number = 0;
    lan: any;
    public static ins(): GameData {
        return super.ins() as GameData;
    }
}

window["GameData"] = GameData.ins();
