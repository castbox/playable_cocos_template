import { _decorator, Component, Layout, Node, UITransform, Widget } from 'cc';
const { ccclass, property } = _decorator;

export enum ELayoutType
{
    HORIZONTAL,
    VERTICAL
}

export class PlayableLayoutNode extends Component
{
    private _layout: Layout;
    private _children: Node[] = [];
    private _type: ELayoutType;

    public init(type: ELayoutType, specing : number)
    {
        this._layout = this.node.addComponent(Layout);

        this._type = type;
        this._layout.type = type == ELayoutType.HORIZONTAL ? Layout.Type.HORIZONTAL : Layout.Type.VERTICAL;
        this._layout.alignHorizontal = type == ELayoutType.HORIZONTAL;
        this._layout.alignVertical = type == ELayoutType.VERTICAL;
        this._layout.resizeMode = Layout.ResizeMode.CONTAINER;
        this._layout.spacingX = type == ELayoutType.HORIZONTAL ? specing : 0
        this._layout.spacingY = type == ELayoutType.VERTICAL ? specing : 0

        let contentSize = this.node.parent.getComponent(UITransform).contentSize;
        this.node.getComponent(UITransform).setContentSize(contentSize);
    }

    public release()
    {
        this._children.forEach(child => 
        {
            if (child instanceof PlayableLayoutNode)
            {
                (child as PlayableLayoutNode).release();
            }
            else
            {
                child.setParent(this.node.parent)
            }
        })
    }

    public pushChild(child: Node, siblingIndex : number = null)
    {
        child.setParent(this.node)
        child.setSiblingIndex(siblingIndex ? siblingIndex : this._children.length);

        this._children.push(child);
        this.calculateSize();
    }

    public calculateSize()
    {
        let used = 0;
        let childeLayouts: PlayableLayoutNode[] = []
        this._children.forEach(child =>
        {
            if (child.getComponent(PlayableLayoutNode))
            {
                childeLayouts.push(child.getComponent(PlayableLayoutNode));
            }
            else 
            {
                used += child.getComponent(UITransform).contentSize.width;
            }
        })

        if (childeLayouts.length == 0)
        {
            return;
        }
    
        if (this._type == ELayoutType.HORIZONTAL)
        {
            let remaining = this.node.getComponent(UITransform).contentSize.width - used;
            childeLayouts.forEach(child =>
            {
                child.getComponent(UITransform).setContentSize(remaining / childeLayouts.length, this.node.getComponent(UITransform).contentSize.height);
            })
        }
        else if (this._type == ELayoutType.VERTICAL)
        {
            let remaining = this.node.getComponent(UITransform).contentSize.height - used;
            childeLayouts.forEach(child =>
            {
                child.getComponent(UITransform).setContentSize(this.node.getComponent(UITransform).contentSize.width, remaining / childeLayouts.length);
            })
        }
    }
}


