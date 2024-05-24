import { Component, director, instantiate, Node, resources, Prefab, sys, Vec3, JsonAsset, AudioClip, Mat4, UITransform, Widget, Layers } from "cc";

export class utility
{
    public static findFirstNodeOfType<T extends Component>(type: new (...args: any[]) => T): T | null
    {
        const walk = (target: Node): T | null =>
        {
            const comp = target.getComponent(type);
            if (comp)
            {
                return comp;
            }

            if (target.children)
            {
                for (const child of target.children)
                {
                    const result = walk(child);
                    if (result)
                    {
                        return result;
                    }
                }
            }

            return null;
        }

        return walk(director.getScene());
    }

    public static formatNumberWithSign(num: number): string
    {
        const sign = Math.sign(num);
        if (sign === 1)
        {
            return `+${num}`;
        }
        else if (sign === -1)
        {
            return `${num}`;
        }
        else if (sign === 0 || sign === -0)
        {
            return `±0`;
        }
        else
        {
            return 'NaN';
        }
    }

    public static createNode<T extends Component>(type: new () => T, name: string, parent: Node = null): T
    {
        let node = new Node(name).addComponent(type);

        if (parent != null)
        {
            parent.addChild(node.node);
        }
        else
        {
            let sceneNode = director.getScene();
            sceneNode.addChild(node.node);
        }

        return node
    }

    public static Install()
    {
        window.install && window.install()
    }

    public static GameEnd()
    {
        window.gameEnd && window.gameEnd()
    }

    public static JumpToStore(googleStoreUrl, appleStoreUrl)
    {
        this.Install()

        console.log("googleStoreUrl: " + googleStoreUrl)
        console.log("appleStoreUrl: " + appleStoreUrl)

        if (window.mraid == null)
        {
            window.open(sys.os == sys.OS.IOS ? appleStoreUrl : googleStoreUrl);
        } else
        {
            window.mraid.open(sys.os == sys.OS.IOS ? appleStoreUrl : googleStoreUrl);
        }
    }

    public static setNodeWorldPositionToTarget(node: Node, target: Node | Vec3)
    {
        // 获取 targetNode 的世界坐标
        let targetWorldPosition: Vec3;
        if (target instanceof Node)
        {
            targetWorldPosition = target.worldPosition;
        }
        else
        {
            targetWorldPosition = target;
        }

        node.setWorldPosition(targetWorldPosition);
    }

    public static GetComponentInParent<T extends Component>(componentType: new () => T, node: Node): T
    {
        let parent = node.parent;
        while (parent)
        {
            let comp = parent.getComponent(componentType);
            if (comp)
            {
                return comp;
            }

            parent = parent.parent;
        }

        return null;
    }

    public static setParent(node: Node, parent: Node, worldPositionStay: boolean = false)
    {
        if (node.parent == parent)
        {
            return;
        }

        if (worldPositionStay)
        {
            const worldPosition = node.worldPosition;
            parent.addChild(node)
            const localPosition = parent.getComponent(UITransform).convertToNodeSpaceAR(worldPosition);
            node.setPosition(localPosition);
        }
        else
        {
            parent.addChild(node)
            node.position = Vec3.ZERO;
        }
    }

    public static sleep(seconds: number): Promise<void>
    {
        return new Promise(resolve =>
        {
            setTimeout(() =>
            {
                resolve();
            }, seconds * 1000);
        });
    }

    public static convertToWorldSpaceAR(node: Node, localPosition: Vec3): Vec3 
    {
        // 获取节点的 UITransform 组件
        const uiTransform = node.getComponent(UITransform);
        if (!uiTransform)
        {
            console.warn("节点没有 UITransform 组件");
            return new Vec3();
        }

        // 获取节点的锚点
        const anchorPoint = uiTransform.anchorPoint;

        // 计算锚点在节点本地坐标系中的位置
        const anchorX = uiTransform.width * anchorPoint.x;
        const anchorY = uiTransform.height * anchorPoint.y;

        // 将本地坐标调整为相对于锚点的坐标
        const localX = localPosition.x + anchorX;
        const localY = localPosition.y + anchorY;

        // 将调整后的本地坐标转换为世界坐标
        const worldPosition = uiTransform.convertToWorldSpaceAR(new Vec3(localX, localY, 0));

        return worldPosition;
    }

    public static updateWidgetAlignment(node: Node)
    {
        const widgets = node.getComponentsInChildren(Widget);
        for (const widget of widgets)
        {
            widget.updateAlignment();
        }
    }

    public static setLayer(node: Node, ...layer: string[])
    {
        node.layer = 0;
        for (const layerName of layer)
        {
            node.layer |=  1 << Layers.nameToLayer(layerName);
        }
    }
}