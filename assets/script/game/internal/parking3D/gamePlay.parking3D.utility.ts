import { EEntityDirection } from "../../../framework/internal/entity/playable.entity";
import { PlayableManagerConfig } from "../../../framework/runtime/playable.manager.config";
import { GamePlayParking3DCar } from "./gamePlay.parking3D.car";

export class GamePlayParking3DUtility
{
    /**
     * 两车相撞,找到空隙大的方向，然后在这个方向上重新设置车的位置
     */
    public static collided(carA: GamePlayParking3DCar, carB: GamePlayParking3DCar)
    {
        let posA = carA.node.position;
        let posB = carB.node.position;
        const sizeA = carA.ColliderSize;
        const sizeB = carB.ColliderSize;

        const getDistance = (dir: EEntityDirection): number => 
        {
            let distance = 0
            if (dir === EEntityDirection.Up || dir === EEntityDirection.Down)
            {
                distance = sizeA.z + sizeB.z - Math.abs(posA.z - posB.z)
            } else
            {
                distance = sizeA.x + sizeB.x - Math.abs(posA.x - posB.x)
            }
            return distance
        }
        const distanceA: number = getDistance(carA.MovingDir)
        const distanceB: number = getDistance(carB.MovingDir)

        const resetCarPos = (car: GamePlayParking3DCar, distance: number) =>
        {
            const pos = car.node.getPosition()
            const rest_gap = PlayableManagerConfig.getInstance().settings.json.parking3D.rest_gap;
            switch (car.MovingDir)
            {
                case EEntityDirection.Up:
                    pos.z = pos.z + distance + rest_gap;
                    break
                case EEntityDirection.Down:
                    pos.z = pos.z - distance - rest_gap;
                    break
                case EEntityDirection.Left:
                    pos.x = pos.x + distance + rest_gap;
                    break
                case EEntityDirection.Right:
                    pos.x = pos.x - distance - rest_gap;
                    break
            }
            car.node.setPosition(pos.x, pos.y, pos.z)
        }
        if (distanceA < distanceB)
        {
            resetCarPos(carA, distanceA)
        } else
        {
            resetCarPos(carB, distanceB)
        }
    }
}