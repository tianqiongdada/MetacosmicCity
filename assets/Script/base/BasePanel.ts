import { PanelMgr } from "../managers/PanelMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BasePanel extends cc.Component {
    protected _params:any;
    public path:string;
    public initData(data:any):void {
        let self = this;
        if (data) {
            self._params = data;
        }
    }

    start() {
        
    }

    onDestroy() {
        let self = this;
        self._params = null;
    }

    
    protected onExitHandler(isClearCache:boolean):void {
        let self = this;
        PanelMgr.ins().removePanel(self.path,isClearCache);
    }
}
