import { _decorator, BoxCollider, math, tween, Tween, Vec3 } from "cc";
import { PlayableEntity3D } from "../../../framework/internal/entity/playable.entity.3d";
import { EEntityOrientation } from "../../../framework/internal/entity/playable.entity";
import { PlayableManagerConfig } from "../../../framework/runtime/playable.manager.config";
const { ccclass, property } = _decorator;

@ccclass("GamePlayParking3DEntity")
export class GamePlayParking3DEntity extends PlayableEntity3D
{
    public override get ColliderSize(): Vec3
    {
        const collider = this.collider as BoxCollider;
        const width = collider.size.x / 2;
        const height = collider.size.z / 2;
        if (this.headOrientation === EEntityOrientation.Up || this.headOrientation === EEntityOrientation.Down)
        {
            return new Vec3(height, 0, width)
        } else
        {
            return new Vec3(width, 0, height)
        }
    }

    protected override async onBeHit(entity: GamePlayParking3DEntity): Promise<void>
    {
        super.onBeHit(entity);

        const isSameDir = (): boolean =>
        {
            switch (entity.movingOrientation)
            {
                case EEntityOrientation.Up:
                case EEntityOrientation.Down:
                    return this.headOrientation === EEntityOrientation.Up || this.headOrientation === EEntityOrientation.Down
                case EEntityOrientation.Left:
                case EEntityOrientation.Right:
                    return this.headOrientation === EEntityOrientation.Left || this.headOrientation === EEntityOrientation.Right
            }
        }

        Tween.stopAllByTarget(this.model)
        this.model.eulerAngles = Vec3.ZERO;
        const duration = PlayableManagerConfig.getInstance().settings.json.parking3D.hit_roll_duration;
        tween(this.model)
            .to(duration,
                {
                    eulerAngles: new Vec3(isSameDir() ? 0 : math.randomRange(10, 15), 0, isSameDir() ? math.randomRange(5, 10) : 0)
                })
            .to(duration,
                {
                    eulerAngles: Vec3.ZERO
                })
            .to(duration,
                {
                    eulerAngles: new Vec3(isSameDir() ? 0 : -math.randomRange(6, 10), 0, isSameDir() ? -math.randomRange(3, 8) : 0)
                })
            .to(duration,
                {
                    eulerAngles: Vec3.ZERO
                }).start()
    }
}