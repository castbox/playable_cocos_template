import { _decorator, Collider, ITriggerEvent, Vec3 } from "cc";
import { EEntityOrientation, PlayableEntity } from "./playable.entity";
const { ccclass, property } = _decorator;

@ccclass('PlayableEntity3D')
export class PlayableEntity3D extends PlayableEntity
{
    protected collider : Collider

    protected headOrientation: EEntityOrientation;
    protected movingOrientation: EEntityOrientation;
    public get HeadOrientation(): EEntityOrientation
    {
        return this.headOrientation;
    }
    public get MovingOrientation(): EEntityOrientation
    {
        return this.headOrientation;
    }

    private _onTriggerEnterBindEvent = this.onTriggerEnter.bind(this);

    protected override onLoad(): void
    {
        super.onLoad();
        this.collider = this.getComponent(Collider)

        if (this.collider)
        {
            this.collider.on('onTriggerEnter', this._onTriggerEnterBindEvent);
        }

        const angle = this.node.eulerAngles;
        const angleY = (angle.y + 360) % 360
        if (angleY == 0)
        {
            this.headOrientation = EEntityOrientation.Right;
        }
        else if (angleY == 90) 
        {
            this.headOrientation = EEntityOrientation.Up;
        }
        else if (angleY == 180)
        {
            this.headOrientation = EEntityOrientation.Left;
        } else if (angleY == 270)
        {
            this.headOrientation = EEntityOrientation.Down;
        }
    }

    protected override onDestroy(): void
    {
        super.onDestroy();

        if (this.collider)
        {
            this.collider.off('onTriggerEnter', this._onTriggerEnterBindEvent);
        }
    }

    protected onTriggerEnter(event: ITriggerEvent)
    {
        
    }
}