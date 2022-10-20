import SingletonClass from "../base/SingletonClass";

export class GlobalFuncs extends SingletonClass{
    public static ins(): GlobalFuncs {
        return super.ins() as GlobalFuncs;
    }

    //查找节点
    findNode(target: string, node: cc.Node) : cc.Node {
        //不存在子节点
        if (!node.children) {
            console.log("该节点中没有子节点");
        }
        let _result = null;
        //当父节点为空说明节点不存在直接返回
        if (node === null) {
            return null;
        }
        let select = function (target, node) {
            //说明存在子节点
            if (node.children.length != 0) {
                let nodeLen = node.children;
                for (let index = 0; index < nodeLen.length; index++) {
                    const element = nodeLen[index];
                    if (element.name === target) {
                        _result = element;
                        break;
                    } else {
                        var selectNode = element;
                        select(target, selectNode);
                    }
    
                }
            }
        }
        select(target, node);
        return _result;
    }
    
}

