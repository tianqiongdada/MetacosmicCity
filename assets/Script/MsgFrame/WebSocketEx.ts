import SingletonClass from "../base/SingletonClass";
import { MsgCenter } from "./MsgCenter";

//websocket管理类，单例模式
export class WebSocketEx extends SingletonClass
{
    private  client:WebSocket = null;
    private  isConn:boolean = false;

    public static ins(): WebSocketEx {
        return super.ins() as WebSocketEx;
    }

    initNet() 
    {
        this.client = null;
        this.isConn = false;
    }

    connect(url:string, data:any) : boolean
    {
        if (!this.isConn) 
        {
            let ws = new WebSocket(url);
            ws.binaryType = "arraybuffer";
            //ws.binaryType = "blob";
            this.client = ws;

            ws.onopen = (event) => 
            {
                this.isConn = true;
                console.log("连上了服务端,地址:" + url);
                if (data)
                    this.send(data);
            }

            ws.onmessage = (event) => 
            {
               //解出头部信息
               const headLen = 3;
                let buff = new Uint32Array(event.data, 0, headLen);
                if (buff.length < headLen) 
                {
                    console.log('head len err!');
                    return;    
                }

                let mainCmd:number = buff[0], subCmd:number = buff[1],  dataLen = buff[2];
                let data = new Uint8Array(event.data, 12, dataLen);
                MsgCenter.SendCustomMsg(mainCmd, subCmd, data, dataLen, null);
            }

            ws.onclose = (event) => 
            {
                console.log("网络断开了!");
            }

            ws.onerror = (event) => 
            {
               console.log("网络错误!");
            }

            return true;
        } 
        else
            return false;
    }

    //连接状态
    isOpen() : boolean
    {
        return this.client ? this.client.readyState === WebSocket.OPEN : false;
    }

    disconnect() : void
    {
        if (this.isOpen()) 
            this.client.close();

        this.isConn = false;
    }

    send(data) : void
    {
        if (this.isConn) 
        { //如果已经连接
            // if (data instanceof Blob) {
            //     this.client.send(data);
            // } else {
            //     console.log("数据类型不对");
            // }
            
            this.client.send(data);
        } 
        else 
            console.log("连接已经断开!");
    }

    static sendCoustomData(mainCmd:number, subCmd:number, anyData:any, dataLen:number) : void
    {
        
    }
}

//全局对象
let g_GameServerIP:string = "";
