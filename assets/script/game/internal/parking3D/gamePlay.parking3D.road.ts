import { _decorator, Enum, math, Vec3 } from "cc";
import { GamePlayParking3DEntity } from "./gamePlay.parking3D.entity";
import { EEntityOrientation } from "../../../framework/internal/entity/playable.entity";
const { ccclass, property } = _decorator;

@ccclass('GamePlayParking3DRoad')
export class GamePlayParking3DRoad extends GamePlayParking3DEntity
{
    @property({ type: Enum(EEntityOrientation) })
    public Dir: EEntityOrientation = EEntityOrientation.Up;

    public getSidePoint(carPos: Vec3): Vec3
    {
        const scale = this.node.scale;
        const pos = this.node.getPosition().clone();
        switch (this.Dir)
        {
            case EEntityOrientation.Up:
                return new Vec3(carPos.x, carPos.y, pos.z + scale.x);
            case EEntityOrientation.Right:
                return new Vec3(pos.x - scale.x, carPos.y, carPos.z);
            case EEntityOrientation.Down:
                return new Vec3(carPos.x, carPos.y, pos.z - scale.x);
            case EEntityOrientation.Left:
                return new Vec3(pos.x + scale.x, carPos.y, carPos.z);
            default:
                return Vec3.ZERO;
        }
    }

    public getEndPoint(): Vec3
    {
        const scale = this.node.scale;
        const pos = this.node.getPosition().clone();
        switch (this.Dir)
        {
            case EEntityOrientation.Up:
                return new Vec3(pos.x + scale.z, 0, pos.z + scale.x / 2);
            case EEntityOrientation.Right:
                return new Vec3(pos.x - scale.x / 2, 0, pos.z + scale.z);
            case EEntityOrientation.Down:
                return new Vec3(pos.x - scale.z, 0, pos.z - scale.x / 2);
            case EEntityOrientation.Left:
                return new Vec3(pos.x + scale.x / 2, 0, pos.z - scale.z);
            default:
                return Vec3.ZERO;
        }
    }

    public getCornerRadius(): number
    {
        const scale = this.node.scale
        return scale.x / 2
    }

    public getCornerLength(): number
    {
        return math.HALF_PI * this.getCornerRadius()
    }

    public getLength(): number
    {
        const scale = this.node.scale
        return scale.z
    }
}