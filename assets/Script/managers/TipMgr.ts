
import SingletonClass from "../base/SingletonClass";
import { GameUtils } from "../untils/GameUtils";

export class TipMgr extends SingletonClass {

    private _maxLen: number = 10;//提示对象池里面最大的容量
    private _tipPool: cc.Node[] = [];//提示对象池
    public _tipPrefab: cc.Prefab = null;//tip Prefab
    public _tipPrefab1: cc.Prefab = null;//tip Prefab
    private _showQueue: string[] = [];//展示tip队列
    private _curNodeArr: cc.Node[] = [];//当前node数组
    private _curNode: cc.Node;
    private _curShowNum: number = 0;//当前展示提示的个数

    static ins(): TipMgr {
        return super.ins() as TipMgr;
    }

    public initUI(prefab: cc.Prefab, tip1: cc.Prefab): void {
        let self = this;
        self._tipPrefab = prefab;
        self._tipPrefab1 = tip1;
    }
    /**
     * 重置tip数据
     */
    public resetTip(): void {
        let self = this;
        self._curShowNum = 0;
        self._tipPool = [];
        self._showQueue = [];
        for (let i = 0; i < self._curNodeArr.length; i++) {
            let node: cc.Node = self._curNodeArr[i];
            node.stopAllActions();
        }
        this._curNodeArr = [];
    }
    /**
     * 展示标签
     * @param node
     */
    public showTip(isSucess: boolean): void {
        // GameUtils.showLog(content);
        let self = this;

        let curScene = cc.director.getScene().getChildByName("Canvas");
        // if (!self._curNode) {
        //     self._curNode = cc.instantiate(self._tipPrefab);
        // }

        // if (self._curNode.parent) {
        //     self.aniComplte(self._curNode);
        // }
        // if (isSucess) {
        //     self._curNode.getChildByName("tip1").active = true;
        //     self._curNode.getChildByName("tip2").active = false;
        // }else {
        //     self._curNode.getChildByName("tip1").active = false;
        //     self._curNode.getChildByName("tip2").active = true;
        // }

        // self._curNode.active = true;
        // curScene.addChild(self._curNode,999);
        // self.showAni(self._curNode);

        let node: cc.Node = cc.instantiate(self._tipPrefab);
        if (isSucess) {
            node.getChildByName("tip1").active = true;
            node.getChildByName("tip2").active = false;
        } else {
            node.getChildByName("tip1").active = false;
            node.getChildByName("tip2").active = true;
        }

        curScene.addChild(node, 999);
        self.showAni1(node);
    }


    /**
     * 文本提示
     * @param tip 
     */
    public showTextTip(tip: string): void {
        let self = this;
        if (!tip) return;
        if (self._showQueue.indexOf(tip) >= 0) {
            let node: cc.Node;
            for (let i = 0; i < self._curNodeArr.length; i++) {
                let itemNode: cc.Node = self._curNodeArr[i];
                if (itemNode.name == tip) {
                    node = itemNode;
                    break;
                }
            }
            if (node) {
                self.aniComplte(node);
            }
        }
        self._showQueue.push(tip);
        for (let i = 0; i < self._curNodeArr.length; i++) {
            let itemNode: cc.Node = self._curNodeArr[i];
            itemNode.y = (i + 1) * itemNode.height;
        }
        let callback: Function = function (node) {
            self._curNodeArr.push(node);
            node.scaleX = GameUtils.screenWidthScale;
            if (!node) return;
            node.active = true;
            node.name = tip;
            node.getChildByName("label").getComponent("cc.Label").string = tip;
            let curScene = cc.director.getScene().getChildByName("Canvas");
            curScene.addChild(node);
            node.setPosition(0, 15);
            self.showAni(node);
            self._curShowNum++;
        }.bind(self);
        self.getTipNode(callback);

    }

    /**
   * 获取prefab
   */
    private getTipNode(callback: Function): void {
        let self = this;
        if (self._tipPool.length) {
            var node: cc.Node = self._tipPool.shift();
            callback(node);
        } else {
            if (self._tipPrefab1) {
                var node: cc.Node = cc.instantiate(self._tipPrefab1);
                callback(node)
            } else {
                cc.error("tip预制体为空。。。。");
            }
        }
    }

    /**
     * 展示动画
     * @param node
     */
    private showAni(node: cc.Node): void {
        if (!node) return;
        var finished = cc.callFunc(this.aniComplte, this, node);
        let action: cc.Action = cc.sequence(
            [cc.delayTime(2.5),
            cc.fadeOut(0.5),
                finished]
        );
        node.runAction(action);
    }


    /**
     * 展示动画
     * @param node
     */
    private showAni1(node: cc.Node): void {
        if (!node) return;
        // var finished = cc.callFunc(this.aniComplte, this, node);
        let action: cc.Action = cc.sequence(
            [cc.delayTime(2.5),
            cc.fadeOut(0.5),]
        );
        node.runAction(action);
    }


    /**
     * 动画播放完毕
     * @param node
     */
    private aniComplte(node: cc.Node): void {
        if (!node) return;
        if (this._showQueue.indexOf(node.name) >= 0) {
            this._showQueue.splice(this._showQueue.indexOf(node.name));
            this._curNodeArr.splice(this._curNodeArr.indexOf(node));
        }
        node.stopAllActions();
        node.name = "";
        node.active = false;
        node.removeFromParent(true);

        this._curShowNum--;
        if (this._curShowNum < 0) {
            this._curShowNum = 0;
        }
        this.putTipNode(node);
    }

    /***
   * 将节点保存起来
   * @param node
   */
    private putTipNode(node: cc.Node): void {
        node.opacity = 255;
        if (this._tipPool.length < this._maxLen) {
            this._tipPool.push(node);
        } else {
            this._tipPool[this._maxLen - 1] = node;
        }
    }
}
window["TipMgr"] = TipMgr.ins();
