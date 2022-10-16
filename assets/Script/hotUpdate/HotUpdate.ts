export class HotOptions {
    OnVersionInfo: Function;
    OnNeedToUpdate: Function;
    OnNoNeedToUpdate: Function;
    OnUpdateFailed: Function;
    OnUpdateSucceed: Function;
    OnUpdateProgress: Function;

    check() {
        for (let key in this) {
            if (key !== 'check') {
                if (!this[key]) {
                    console.log(`参数HotOptions.${key}未设置！`);
                    return false;
                }
            }
        }
        return true
    }
}

class Hot {
    _assetsMgr: jsb.AssetsManager = null;
    _options: HotOptions = null;
    _state = Hot.State.None;

    static State = {
        None: 0,
        Check: 1,
        Update: 2,
    }


    // 检查更新
    checkUpdate() {
        if (!this._assetsMgr) {
            console.log('请先初始化')
            return;
        }

        if (this._assetsMgr.getState() === jsb.AssetsManager.State.UNINITED) {
            console.error('未初始化')
            return;
        }
        if (!this._assetsMgr.getLocalManifest().isLoaded()) {
            console.log('加载本地 manifest 失败 ...');
            return;
        }
        this._assetsMgr.setEventCallback(this._hotUpdateCallBack.bind(this));
        this._state = Hot.State.Check;
        // 下载version.manifest，进行版本比对
        this._assetsMgr.checkUpdate();
    }

    hotUpdate() {
        if (!this._assetsMgr) {
            console.log('请先初始化')
            return
        }
        this._assetsMgr.setEventCallback(this._hotUpdateCallBack.bind(this));
        this._state = Hot.State.Update;
        this._assetsMgr.update();
    }

    _hotUpdateCallBack(event: jsb.EventAssetsManager) {
        let code = event.getEventCode();
        console.log(`hotUpdate Code: ${code}`);
        switch (code) {
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                console.log("已经和远程版本一致，无须更新");
                this._options.OnNoNeedToUpdate && this._options.OnNoNeedToUpdate(code)
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                console.log('发现新版本,请更新');
                this._options.OnNeedToUpdate && this._options.OnNeedToUpdate(code);
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                console.log('更新中...')
                if (this._state === Hot.State.Update) {
                    this._options.OnUpdateProgress && this._options.OnUpdateProgress(event);
                } else {
                    // 检查状态下，不回调更新进度
                }
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                console.log('更新成功');
                this._onUpdateFinished();
                break;
            case jsb.EventAssetsManager.ASSET_UPDATED:
                // 不予理会的消息事件
                break;
            default:
                this._onUpdateFailed(code);
                break;
        }
    }

    _onUpdateFailed(code) {
        this._assetsMgr.setEventCallback(null)
        this._options.OnUpdateFailed && this._options.OnUpdateFailed(code);
    }

    // 更新完成
    _onUpdateFinished() {
        this._assetsMgr.setEventCallback(null)
        let searchPaths = jsb.fileUtils.getSearchPaths();
        let newPaths = this._assetsMgr.getLocalManifest().getSearchPaths();
        console.log("[HotUpdate] 搜索路径: " + JSON.stringify(newPaths));
        Array.prototype.unshift(searchPaths, newPaths);
        cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));

        jsb.fileUtils.setSearchPaths(searchPaths);
        this._options.OnUpdateSucceed && this._options.OnUpdateSucceed();
    }

    showSearchPath() {
        console.log("========================搜索路径========================");
        let searchPaths = jsb.fileUtils.getSearchPaths();
        for (let i = 0; i < searchPaths.length; i++) {
            console.log("[" + i + "]: " + searchPaths[i]);
        }
        console.log("======================================================");
    }

    // ------------------------------初始化------------------------------
    init(manifest: cc.Asset, opt: HotOptions) {
        console.log("开始初始化init.......");
        // if (!cc.sys.isNative) {
        //     return;
        // }
        if (!opt.check()) {
            return;
        }
        this._options = opt;

        if (this._assetsMgr) {
            return;
        }

        // this.showSearchPath();
        let url = manifest.nativeUrl;
        if (cc.loader.md5Pipe) {
            url = cc.loader.md5Pipe.transformURL(url)
        }
        console.log("url:" + url);
       
        let storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'remote-asset');
        this._assetsMgr = new jsb.AssetsManager(url, storagePath, (versionA, versionB) => {
            // 比较版本
            console.log('[HotUpdate] 客户端版本: ' + versionA +  '当前最新版本: ' + versionB);
            this._options.OnVersionInfo({local: versionA, server: versionB});
            let vA = versionA.split('.');
            let vB = versionB.split('.');
            for (let i = 0; i < vA.length; ++i) {
                let a = parseInt(vA[i]);
                let b = parseInt(vB[i] || '0');
                if (a !== b) {
                    return a - b;
                }
            }
            if (vB.length > vA.length) {
                return -1;
            } else {
                return 0;
            }
        });
        this._assetsMgr.setVerifyCallback((assetsFullPath, asset) => {
            let {compressed, md5, path, size} = asset;
            if (compressed) {
                return true;
            } else {
                return true;
            }
        })
        if (cc.sys.os === cc.sys.OS_ANDROID) {
            // 安卓手机设置 最大并发任务数量限制为2
            // this._assetsMgr.setMaxConcurrentTask(10);
        }

        let localManifest = this._assetsMgr.getLocalManifest()
        console.log('[HotUpdate] 热更新资源存放路径: ' + storagePath);
        console.log('[HotUpdate] 本地manifest路径: ' + url);
        console.log('[HotUpdate] local packageUrl: ' + localManifest.getPackageUrl());
        console.log('[HotUpdate] project.manifest remote url: ' + localManifest.getManifestFileUrl());
        console.log('[HotUpdate] version.manifest remote url: ' + localManifest.getVersionFileUrl());
        console.log('[HotUpdate] version: ' + localManifest.getVersion());
    }
}

let hotInstance = new Hot();

export default hotInstance;
