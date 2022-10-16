
//自定义事件管理器

import SingletonClass from "../base/SingletonClass";

export default class EventTargetMgr extends SingletonClass {
    public static ins(): EventTargetMgr {
        return super.ins() as EventTargetMgr;
    }

    private _eventTarget: cc.EventTarget = new cc.EventTarget();

    public addEvent(eventName: string, func: Function, target: any): void {
        let self = this;
        self._eventTarget.on(eventName, func, target);
    }

    public removeEvent(eventName: string, func: Function, target: any): void {
        let self = this;
        self._eventTarget.off(eventName, func, target);
    }

    public emitEvent(eventName: string, ...arg): void {
        let self = this;
        if (self._eventTarget.hasEventListener(eventName)) {
            self._eventTarget.emit(eventName, arg);
        }

    }
}



