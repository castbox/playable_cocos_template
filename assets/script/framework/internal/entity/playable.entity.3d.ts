import { _decorator, Collider, ITriggerEvent, Vec3 } from "cc";
import { EEntityDirection, PlayableEntity } from "./playable.entity";
const { ccclass, property } = _decorator;

@ccclass('PlayableEntity3D')
export class PlayableEntity3D extends PlayableEntity
{
    protected collider : Collider

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
            this.headDir = EEntityDirection.Right;
        }
        else if (angleY == 90) 
        {
            this.headDir = EEntityDirection.Up;
        }
        else if (angleY == 180)
        {
            this.headDir = EEntityDirection.Left;
        } else if (angleY == 270)
        {
            this.headDir = EEntityDirection.Down;
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