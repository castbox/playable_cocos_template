import { _decorator, Component, Graphics, Mask, Material, Node, Size, Sprite, UITransform, Vec3 } from 'cc';
import { PlayableManagerEvent } from '../../runtime/playable.manager.message';
const { ccclass, property } = _decorator;

enum MaskType
{
    Circle,
    Rectangle
}

export class MaskTarget
{
    maskType: MaskType;
    Target: Node;
    size: Size

    constructor(maskType: MaskType, target: Node, size: Size)
    {
        this.maskType = maskType;
        this.Target = target;
        this.size = size;
    }
}

@ccclass('PlayableDynamicMask')
export class PlayableDynamicMask extends Component
{
    private _mask: Mask;
    private _maskGraphics: Graphics;
    private _masks: MaskTarget[] = [];
    private _onResizeBindEvent = this.onResize.bind(this);

    public init()
    {
        this._mask = this.node.getComponent(Mask)
        this._mask.type = Mask.Type.GRAPHICS_STENCIL;
        this._maskGraphics = this.node.getComponent(Graphics);

        PlayableManagerEvent.getInstance().on("onCanvasResize", this._onResizeBindEvent);

        this.hide();
    }

    public circle(target: Node, radius: number): MaskTarget
    {
        this.node.active = true;

        const tgt = new MaskTarget(MaskType.Circle, target, new Size(radius));
        this._masks.push(tgt);
        this.draw();

        return tgt;
    }

    public rectangle(target: Node, width: number, height: number): MaskTarget
    {
        this.node.active = true;

        const tgt = new MaskTarget(MaskType.Rectangle, target, new Size(width, height));
        this._masks.push(tgt);
        this.draw();

        return tgt;
    }

    public end()
    {
        this.clear();
        PlayableManagerEvent.getInstance().off("onCanvasResize", this._onResizeBindEvent);
    }

    public clear()
    {
        this._masks = [];
        this.draw();
    }

    public hide()
    {
        this.clear();
        this.node.active = false;
    }

    public draw()
    {
        this._maskGraphics.clear();


        this._masks.forEach(mask => 
        {
            const targetPos = this.node.getComponent(UITransform).convertToNodeSpaceAR(mask.Target.getWorldPosition());
            switch (mask.maskType)
            {
                case MaskType.Circle:
                    this._maskGraphics.circle(targetPos.x, targetPos.y, mask.size.width)
                    break;
                case MaskType.Rectangle:
                    this._maskGraphics.rect(targetPos.x - mask.size.width / 2, targetPos.y - mask.size.height / 2, mask.size.width, mask.size.height)
                    break;
            }
        })
        this._maskGraphics.fill();
    }

    private onResize()
    {
        this.scheduleOnce(() =>
        {
            this.draw();
        }, 0.1)
    }
}

