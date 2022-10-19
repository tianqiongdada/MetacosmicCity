import SingletonClass from "../base/SingletonClass";
export default class GameData extends SingletonClass {
    public static winSizeW: number = 0;
    public static winSizeH: number = 0;
    lan: any;
    public accountAddress: string = null;//钱包地址
    public authorizationData:any = { "protocol": "TokenPocket", "version": "v1.0", "timestamp": 1666171844, "sign": "{}", "uuID": "1666171840727", "actionId": "1666171840727", "account": "0xf6d3e4eD7301D8a27BcCf18508bC5199b5e712fc", "wallet": "0xf6d3e4eD7301D8a27BcCf18508bC5199b5e712fc", "ref": "TokenPocket", "publickey": "0xf6d3e4eD7301D8a27BcCf18508bC5199b5e712fc", "permissions": {}, "result": 1, "action": "login", "network": "ethereum", "chainId": "56" };//授权数据
    public static ins(): GameData {
        return super.ins() as GameData;
    }
}

window["GameData"] = GameData.ins();
