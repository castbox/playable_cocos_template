import { _decorator, BoxCollider, math, tween, Tween, Vec3 } from "cc";
import { PlayableEntity3D } from "../../../framework/internal/entity/playable.entity.3d";
import { EEntityDirection } from "../../../framework/internal/entity/playable.entity";
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
        if (this.headDir === EEntityDirection.Up || this.headDir === EEntityDirection.Down)
        {
            return new Vec3(height, 0, width)
        } else
        {
            return new Vec3(width, 0, height)
        }
    }

    protected override onHit(entity: GamePlayParking3DEntity): void
    {
        super.onHit(entity);

        const isSameDir = (): boolean =>
        {
            switch (entity.movingDir)
            {
                case EEntityDirection.Up:
                case EEntityDirection.Down:
                    return this.headDir === EEntityDirection.Up || this.headDir === EEntityDirection.Down
                case EEntityDirection.Left:
                case EEntityDirection.Right:
                    return this.headDir === EEntityDirection.Left || this.headDir === EEntityDirection.Right
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