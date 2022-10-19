export class Msg {
    mainCmd:number;         //主命令码
    subCmd:number;          //子命令码
    anyData:any;            //内容
    dataLen:number;         //数据长度
    anyCallBack:any;        //回调函数
    isNetWorkMsg:boolean;   //是否为网络消息

    constructor(msgType:number, subCmd:number, anyData:any,  dataLen:number, anyCallBack:any)
    {
        this.mainCmd = msgType;
        this.subCmd = subCmd;
        this.anyData = anyData;
        this.dataLen = dataLen;
        this.anyCallBack = anyCallBack;
    }
}


export class MsgCmd
{
    static Login = 1;
    static Game = 2;
    static Map = 3;
    static Camera = 4;
}