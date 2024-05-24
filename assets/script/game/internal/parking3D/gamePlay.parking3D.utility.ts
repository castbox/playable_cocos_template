import { EEntityOrientation } from "../../../framework/internal/entity/playable.entity";
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

        const getDistance = (dir: EEntityOrientation): number => 
        {
            let distance = 0
            if (dir === EEntityOrientation.Up || dir === EEntityOrientation.Down)
            {
                distance = sizeA.z + sizeB.z - Math.abs(posA.z - posB.z)
            } else
            {
                distance = sizeA.x + sizeB.x - Math.abs(posA.x - posB.x)
            }
            return distance
        }
        const distanceA: number = getDistance(carA.MovingOrientation)
        const distanceB: number = getDistance(carB.MovingOrientation)

        const resetCarPos = (car: GamePlayParking3DCar, distance: number) =>
        {
            const pos = car.node.getPosition()
            const rest_gap = PlayableManagerConfig.getInstance().settings.json.parking3D.rest_gap;
            switch (car.MovingOrientation)
            {
                case EEntityOrientation.Up:
                    pos.z = pos.z + distance + rest_gap;
                    break
                case EEntityOrientation.Down:
                    pos.z = pos.z - distance - rest_gap;
                    break
                case EEntityOrientation.Left:
                    pos.x = pos.x + distance + rest_gap;
                    break
                case EEntityOrientation.Right:
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