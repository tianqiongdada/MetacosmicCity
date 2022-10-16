
import BasePanel from "../base/BasePanel";
import SingletonClass from "../base/SingletonClass";
import { LoadingPanelMgr } from "./LoadingPanelMgr";

export class PanelMgr extends SingletonClass {
    private _panelPrefab: cc.Prefab = null;
    private _isLoadComplte: boolean = true;
    public isShowing: boolean = false;
    private _curOpenPanelArr: string[] = [];//保存当前打开的界面路径名字
    private _cachePanelNodes: any = {};//保存界面的节点缓存
    public curOpenPanels: cc.Node[] = [];//当前打开的面板
    static ins() {
        return super.ins() as PanelMgr;
    }

    // /**
    //  *  通用提示框显示
    //  * @param content 显示文本内容
    //  * @param callBack 按钮回调函数
    //  * @param type panel类型  1 表示有两个按钮的。2表示只有一个按钮的
    //  */

    // public showCommonPanel(content: string, callBack: Function[], type: number = 1, btnRes: cc.SpriteFrame[] = [], isShowExitBtn: boolean = false): void {
    //     // if (this.isShowing) return;
    //     // this.isShowing = true;
    //     let panel: cc.Node;
    //     if (!this._isLoadComplte) return;

    //     if (this._panelPrefab) {
    //         panel = cc.instantiate(this._panelPrefab);
    //         this.initPanel(panel, content, callBack, type, btnRes, isShowExitBtn);
    //     } else {
    //         this._isLoadComplte = false;
    //         cc.resources.load("prefabs/CommonPanelView", function (err, prefab) {
    //             this._isLoadComplte = true;
    //             this._panelPrefab = prefab;
    //             panel = cc.instantiate(prefab);
    //             this.initPanel(panel, content, callBack, type, btnRes, isShowExitBtn);
    //         }.bind(this));
    //     }
    // }


    // /**
    //  * 预加载面板
    //  */
    // public preloadPanel(): void {
    //     let self = this;
    //     if (!self._panelPrefab) {
    //         cc.resources.load("prefabs/CommonPanelView", function (err, prefab) {
    //             self._panelPrefab = prefab;
    //         }.bind(self));
    //     }
    // }


    /**
     * 打开面板
     * @param path 面板的路径
     * @param isShowLoading 是否要显示loading
     * @param isShowLoading 是否要显示loading
     * @param loadingType 加载类型 0 普通加载 1 战斗 2 竞技
     */
    public openPanel(path: string, isShowLoading: boolean, param: any = null, isHideBack: boolean, loadingType: number): void {
        let self = this;
        if (self._curOpenPanelArr.indexOf(path) >= 0) {
            //重复打开
            self.removePanel(path, true);
        }

        self._curOpenPanelArr.push(path);
        let node: cc.Node = self._cachePanelNodes[path];
        if (node) {
            let callBack: Function = function () {
                let basePanel: BasePanel = node.getComponent(BasePanel);
                basePanel.path = path;
                if (param) {
                    basePanel.initData(param);
                }
                let curScene = cc.director.getScene().getChildByName("Canvas");
                curScene.addChild(node);
                node.active = true;
                basePanel.start();
                self.curOpenPanels.push(node);
                if (isHideBack) {
                    if (self.curOpenPanels.length) {
                        for (let i = 0; i < self.curOpenPanels.length; i++) {
                            if (i != self.curOpenPanels.indexOf(node)) {
                                self.curOpenPanels[i].active = false;
                            }
                        }
                    }
                }
                if (loadingType) {
                    LoadingPanelMgr.ins().removeSceneLoadingPanel();
                }
            }.bind(self);
        } else {
            let loadingNum: number = 0;
            let prefabNode: cc.Prefab;
            let callBack: Function = function (err, prefab) {
                if (loadingNum < 2) return;
                if (!prefab) return;
                node = cc.instantiate(prefab);
                let basePanel: BasePanel = node.getComponent(BasePanel);
                basePanel.path = path;
                if (param) {
                    basePanel.initData(param);
                }
                self._cachePanelNodes[path] = node;
                let curScene = cc.director.getScene().getChildByName("Canvas");
                curScene.addChild(node);
                node.active = true;
                self.curOpenPanels.push(node);
                if (isShowLoading){
                    if (loadingType) {
                        LoadingPanelMgr.ins().removeSceneLoadingPanel();
                    }else {
                        LoadingPanelMgr.ins().removeLoadingPanel();
                    }
                }
                   
                if (isHideBack) {
                    if (self.curOpenPanels.length) {
                        for (let i = 0; i < self.curOpenPanels.length; i++) {
                            if (i != self.curOpenPanels.indexOf(node)) {
                                self.curOpenPanels[i].active = false;
                            }

                        }
                    }
                }
            }.bind(self);
            let aniCompelte: Function = function () {
                loadingNum++;
                callBack(null, prefabNode);
            }.bind(self);
            cc.resources.load(path, function (err, prefab) {
                if (err) {
                    console.log(err);
                    return;
                }
                if (loadingType) {
                    loadingNum++;
                } else {
                    loadingNum = 2;
                }

                prefabNode = prefab;
                callBack(err, prefab);
            }.bind(this));
        }
    }


    /**
     * 关闭界面
     * @param path 
     * @param isClearCache 是否清除缓存
     */
    public removePanel(path: string, isClearCache: boolean): void {
        let self = this;
        if (!path) return;
        let index: number = self._curOpenPanelArr.indexOf(path)
        if (index >= 0) {
            self._curOpenPanelArr.splice(index, 1);
            self.curOpenPanels.splice(index, 1);
        }
        if (self.curOpenPanels.length) {
            self.curOpenPanels[0].active = true;
        }
        let node: cc.Node = self._cachePanelNodes[path];
        if (node) {
            node.active = false;
            node.parent = null;
            if (isClearCache) {
                node.destroy();
                delete self._cachePanelNodes[path];
            }
        }
    }

    /**
     * 根据路径获取面板
     * @param path 
     * @returns 
     */
    public getPanelByPath(path: string): cc.Node {
        let self = this;
        if (!path) return;
        if (self._cachePanelNodes[path]) {
            return self._cachePanelNodes[path];
        }
        return null;
    }
    // /**
    //  * 初始化panel视图和相应的绑定事件
    //  * @param content
    //  * @param callBack
    //  * @param type
    //  */
    // private initPanel(panel: cc.Node, content: string, callBack: Function[], type: number, btnRes: cc.SpriteFrame[], isShowExitBtn: boolean = false): void {
    //     if (!panel) return;
    //     let curScene = cc.director.getScene().getChildByName("Canvas");
    //     curScene.addChild(panel);
    //     let panelView: CommonPanelView = panel.getComponent("CommonPanelView");

    //     // if (panelView) {
    //     //     panelView.initUI(content, callBack, type, btnRes, isShowExitBtn);
    //     // }
    // }
}

window["PanelMgr"] = PanelMgr.ins();