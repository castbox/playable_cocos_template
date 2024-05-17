import { _decorator, Component, Enum, UITransform, Vec2, Vec3, Widget } from "cc";
import { PlayableDraggable } from "./playable.draggable";
const { ccclass, property } = _decorator;

export enum EDragDirection
{
    Horizontal,
    Vertical,
}

@ccclass('PlayableDraggableScrolling')
export class PlayableDraggableScrolling extends PlayableDraggable
{
    @property({ type: Enum(EDragDirection) })
    public DragDirection: EDragDirection = EDragDirection.Horizontal;

    private _startPos: Vec3;
    private _cachedPos: Vec3;

    protected override onLoad(): void
    {
        super.onLoad();
    }

    protected override onDragStart(): boolean
    {
        this._startPos = this.node.position.clone();
        this._cachedPos = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(this.LastTouchData.CurrentWSPos);

        return true;
    }

    protected override onDragMove(): void
    {
        const currentPos = this.node.parent.getComponent(UITransform).convertToNodeSpaceAR(this.LastTouchData.CurrentWSPos);
        const deltaPos = currentPos.subtract(this._cachedPos);


        const contentSize = this.node.getComponent(UITransform).contentSize;
        const size = new Vec2(contentSize.x * this.node.scale.x, contentSize.y * this.node.scale.y);
        const anchorPoint = this.node.getComponent(UITransform).anchorPoint;
        const parentSize = this.node.parent.getComponent(UITransform).contentSize;

        if (this.DragDirection == EDragDirection.Horizontal)
        {
            const margin = (size.x / 2 - parentSize.width / 2);
            if (margin < 0)
            {
                return;
            }

            const maxX = size.x * (anchorPoint.x - 0.5) + Math.max(margin, 0);
            const minX = size.x * (anchorPoint.x - 0.5) - Math.max(margin, 0);

            const newPos = this._startPos.clone().add(new Vec3(deltaPos.x, 0, 0));
            this.node.position = new Vec3(Math.min(Math.max(newPos.x, minX), maxX), newPos.y, newPos.z);
        }
        else
        {
            const margin = (size.y / 2 - parentSize.height / 2);
            if (margin < 0)
            {
                return;
            }

            const maxY = size.y * (anchorPoint.y - 0.5) + Math.max(margin, 0);
            const minY = size.y * (anchorPoint.y - 0.5) - Math.max(margin, 0);

            const newPos = this._startPos.clone().add(new Vec3(0, deltaPos.y, 0));
            this.node.position = new Vec3(newPos.x, Math.min(Math.max(newPos.y, minY), maxY), newPos.z);
        }
    }
}