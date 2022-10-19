import BasePanel from "../../base/BasePanel";


const { ccclass, property } = cc._decorator;

@ccclass
export default class CommonPanel extends BasePanel {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    private callback: Function = null;

    // onLoad () {}

    start() {
        let self = this;
    }

    public initUI(content: string, callBack: Function): void {
        let self = this;
        self.callback = callBack;
        self.node.getChildByName("content").getChildByName("contentLabel").getComponent(cc.Label).string = content;
    }

    private onCloseBtnHandler(): void {
        let self = this;
        if (self.callback) {
            self.callback();
        }
        // self.onExitHandler(false);
        self.node.removeFromParent();
    }

    // update (dt) {}
}
