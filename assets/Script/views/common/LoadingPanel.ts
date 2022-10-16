// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadingPanel extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';
    private _frameLabel: string = "游戏加载中";//帧文字
    private _curFrameNum: number = 0;
    private _framesLabels: string[] = ["", ".", "..", "...", "...."];
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        let self = this;
    }


    public play(framLabel: string = ""): void {
        let self = this;
        self._frameLabel = framLabel;
        self.unschedule(self.onFrameLabelHandler);
        if (self._frameLabel) {
            self.label.string = self._frameLabel;
            self.schedule(self.onFrameLabelHandler, 0.4);
        }
    }


    private onFrameLabelHandler(): void {
        let self = this;
        self._curFrameNum++;
        if (self._curFrameNum > self._framesLabels.length - 1) {
            self._curFrameNum = 0;
        }
        
        self.label.string = self._frameLabel + self._framesLabels[self._curFrameNum];
    }



    // update (dt) {}
}
