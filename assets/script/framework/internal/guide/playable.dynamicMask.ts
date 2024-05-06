import { _decorator, Component, Graphics, Mask, Material, Node, Size, Sprite, UITransform, Vec3} from 'cc';
const { ccclass, property } = _decorator;

enum MaskType
{
    Circle,
    Rectangle
}

export class MaskTarget
{
    maskType: MaskType;
    position: Vec3;
    size : Size

    constructor(maskType: MaskType, position: Vec3, size: Size)
    {
        this.maskType = maskType;
        this.position = position;
        this.size = size;
    }
}

@ccclass('PlayableDynamicMask')
export class PlayableDynamicMask extends Component
{
    private _mask: Mask;
    private _maskGraphics: Graphics;
    private _masks: MaskTarget[] = [];

    public init()
    {
        this._mask = this.node.getComponent(Mask)
        this._mask.type = Mask.Type.GRAPHICS_STENCIL;
        this._maskGraphics = this.node.getComponent(Graphics);

        this.hide();
    }

    public hide()
    {
        this.clear();
        this.node.active = false;
    }

    public addCircleTarget(wsPos : Vec3, radius : number) : MaskTarget
    {
        this.node.active = true;

        const tgt = new MaskTarget(MaskType.Circle, this.node.getComponent(UITransform).convertToNodeSpaceAR(wsPos), new Size(radius));
        this._masks.push(tgt);
        this.draw();

        return tgt;
    }

    public addRectangleTarget(wsPos : Vec3, width : number, height : number) : MaskTarget
    {
        this.node.active = true;

        const tgt = new MaskTarget(MaskType.Rectangle, this.node.getComponent(UITransform).convertToNodeSpaceAR(wsPos), new Size(width, height));
        this._masks.push(tgt);
        this.draw();

        return tgt;
    }

    public removeTarget(target : MaskTarget)
    {
        const index = this._masks.indexOf(target);
        if (index > -1)
        {
            this._masks.splice(index, 1);
            this.draw();
        }
    }

    public clear()
    {
        this._masks = [];
        this.draw();
    }

    public draw()
    {
        this._maskGraphics.clear();
        this._masks.forEach(mask => 
            {
                switch(mask.maskType)
                {
                    case MaskType.Circle:
                        this._maskGraphics.circle(mask.position.x, mask.position.y, mask.size.width)
                        break;
                    case MaskType.Rectangle:
                        this._maskGraphics.rect(mask.position.x - mask.size.width / 2, mask.position.y - mask.size.height / 2, mask.size.width, mask.size.height)
                        break;
                }
            })
        this._maskGraphics.fill();
    }
}

