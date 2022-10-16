import SingletonClass from "../base/SingletonClass";
import { GameUtils } from "../untils/GameUtils";
export class SoundMgr extends SingletonClass {
    private _path: string = "sounds/";//资源路径
    private static _instance: SoundMgr;
    public isPlayMusic: boolean = true;//是否播放音乐
    public isPlaySound: boolean = true;//是否播放音效
    public curVolume: number = 1;//当前音量大小
    private _curMusicId: number = -1;//当前背景音乐id
    private _soundCache: Object = {};//音效缓存

    public static isHavedPreLoadSound: boolean = false;//是否已经预加载了音效

    public static ins(): SoundMgr {
        return super.ins() as SoundMgr;
    }

    /**
     * 播放背景音乐
     * @param soundName
     */
    public playMusic(soundName: string, isLoop: boolean = true): void {
        if (!this.isPlayMusic) return;
        let audioClip: cc.AudioClip = this._soundCache[soundName];
        if (!audioClip) {
            let url: string = this._path + soundName;
            cc.resources.load(url, cc.AudioClip, function (err, clip) {
                if (err) {
                    console.log(err);
                    return;
                }
                var audioID = cc.audioEngine.playMusic(clip, isLoop);
                this._curMusicId = audioID;
                cc.audioEngine.setMusicVolume(this.curVolume);
                this._soundCache[soundName] = clip;
            }.bind(this));
        } else {
            var audioID = cc.audioEngine.playMusic(audioClip, isLoop);
            this._curMusicId = audioID;
            cc.audioEngine.setMusicVolume(this.curVolume);
        }
    }

    /**
     * 清掉对应的音效缓存
     * @param soundName
     */
    public removeCache(soundName: string): void {
        if (this._soundCache[soundName]) {
            delete this._soundCache[soundName];
        }
    }

    /**
     * 清掉所有的音效缓存
     */
    public removeAllCache(): void {
        for (var key in this._soundCache) {
            if (this._soundCache[key]) {
                delete this._soundCache[key]
            }
        }
        this._soundCache = {};
    }


    /**
     * 是否背景音乐在播放
     */
    public isMusicPlaying(): boolean {
        return cc.audioEngine.isMusicPlaying();
    }

    /**
     * 设置背景音乐音量（0.0 ~ 1.0）。
     */
    public setMusicVolume(num): void {
        cc.audioEngine.setMusicVolume(num);
    }

    /**
     *  获取音量（0.0 ~ 1.0）。
     */
    public getMusicVolume(): number {
        var volume = cc.audioEngine.getMusicVolume();
        return volume;
    }

    /**
     * 恢复播放背景音乐。
     */
    public resumeMusic(): void {
        cc.audioEngine.resumeMusic();
    }

    /**
     * 暂停播放背景音乐。
     */
    public pauseMusic(): void {
        cc.audioEngine.pauseMusic();
    }

    /**
     * 停止播放背景音乐。
     */
    public stopMusic(): void {
        cc.audioEngine.stopMusic();
    }

    /**
     * 设置一个以 KB 为单位的尺寸，大于这个尺寸的音频在加载的时候会强制使用 dom 方式加载
     * @param size
     */
    // public setMaxWebAudioSize(size:number):void {
    //     cc.audioEngine.setMaxWebAudioSize(size);
    // }


    /**
     * 播放音效
     * @param soundName
     * @param isLoop
     * pathSuffix  
     */
    public playEffect(soundName: string, isLoop: boolean = false, pathSuffix: string = ""): void {
        //  /   GameUtils.showLog("playEffect:" + soundName)
        if (!this.isPlaySound) return;
        let audioClip: cc.AudioClip = this._soundCache[soundName];
        if (!audioClip) {
            let url: string = this._path + pathSuffix + soundName;
            let cashe: cc.AudioClip = cc.resources.get(url);
            if (cashe) {
                // console.log("头次播放:" + soundName);
                var audioID = cc.audioEngine.playEffect(cashe, isLoop);
                cc.audioEngine.setEffectsVolume(this.curVolume);
                this._soundCache[soundName] = cashe;
            } else {
                cc.resources.load(url, cc.AudioClip, function (err, clip) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    // var audioID = cc.audioEngine.playEffect(clip, isLoop);
                    // cc.audioEngine.setEffectsVolume(this.curVolume);
                    this._soundCache[soundName] = clip;
                }.bind(this));
            }
        } else {
            var audioID = cc.audioEngine.playEffect(audioClip, isLoop);
            this._curMusicId = audioID;
            cc.audioEngine.setEffectsVolume(this.curVolume);
        }

    }

    /**
     * 恢复播放所有之前暂停的音效。
     */
    public resumeAllEffects(): void {
        cc.audioEngine.resumeAllEffects();
    }

    /**
     * 暂停所有的音效
     */
    public pauseAllEffects(): void {
        cc.audioEngine.pauseAllEffects();
    }

    /**
     * 预加载资源
     * @param soundNameArr
     * @param callback
     */
    // public preload(soundNameArr:string[],callback:Function):void {
    //     let preloadItemCallback:Function = function() {
    //         let soundName: string = soundNameArr.pop();
    //         if (soundName) {
    //             let path:string = this._path + soundName;
    //             cc.audioEngine.preload(path,preloadItemCallback);
    //         }else {
    //             if (callback) {
    //                 callback();
    //             }
    //         }
    //     }.bind(this);
    //     let soundName: string = soundNameArr.pop();
    //     if (soundName) {
    //         let path:string = this._path + soundName;
    //         cc.audioEngine.preload(path,preloadItemCallback);
    //     }else {
    //         if (callback) {
    //             callback();
    //         }
    //     }
    // }
}

window["SoundMgr"] = SoundMgr.ins();