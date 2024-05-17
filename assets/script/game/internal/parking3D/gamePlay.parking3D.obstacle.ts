import { _decorator, ITriggerEvent, TiledUserNodeData} from "cc";
import { GamePlayParking3DEntity } from "./gamePlay.parking3D.entity";
const { ccclass, property } = _decorator;

@ccclass('GamePlayParking3DObstacle')
export class GamePlayParking3DObstacle extends GamePlayParking3DEntity
{
       protected override onTriggerEnter(event: ITriggerEvent): void
       {
           this.onHit(event.otherCollider.node.getComponent(GamePlayParking3DEntity));
       }
}