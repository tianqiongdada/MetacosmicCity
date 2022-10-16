/**
 * created  2018/9/25,by work
 * loadingPanel 面板控制器
 */

import SingletonClass from "../base/SingletonClass";
import LoadingPanel from "../views/common/LoadingPanel";

export class LoadingPanelMgr extends SingletonClass {
    public static loadingLabelArrs: string[] = ["游戏加载中", "正在为您加载数据", "数据请求中", "重连中，请您耐心等待"];
    private static _instance: LoadingPanelMgr;
    private _loadingPrefab: cc.Prefab = null;
    private _loadingScenePrefab: cc.Prefab = null;
    private _sceneLoadingPanel: cc.Node;
    private _curNode: cc.Node = null;
    private _isShow: boolean = false;
    private _loadingCompeleteCB: Function;//动画播放完毕回调

    public static ins() {
        return super.ins() as LoadingPanelMgr
    }

    /**
     * 展示loading
     */
    public showLoadingPanel(frameLabel: string): void {
        // this.removeLoadingPanel();
        let self = this;
        if (self._isShow) return;
        if (self._loadingPrefab) {
            var node: cc.Node = cc.instantiate(self._loadingPrefab);
            self._curNode = node;
            let loadingPanel: LoadingPanel = node.getComponent(LoadingPanel);
            loadingPanel.play(frameLabel);
            let curScene = cc.director.getScene().getChildByName("Canvas");
            curScene.addChild(node);
            self._isShow = true;
        }
    }

    //移除场景加载动画
    public removeSceneLoadingPanel(): void {
        let self = this;
        if (self._sceneLoadingPanel.parent) {
            self._sceneLoadingPanel.removeFromParent();
            self._sceneLoadingPanel.active = false;
        }
    }

    /**
     * 初始化loading视图
     */
    public init(prefab: cc.Prefab): void {
        let self = this;
        self._loadingPrefab = prefab;
    }

    /**
     * 移掉loading页面
     */
    public removeLoadingPanel(): void {
        this._isShow = false;
        if (this._curNode) {
            this._curNode.removeFromParent(true);
            this._curNode = null;
        }
    }
}
window["LoadingPanelMgr"] = LoadingPanelMgr.ins();