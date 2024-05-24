import { _decorator, Collider2D, Component, IPhysics2DContact } from "cc";
import { PlayableEntity2D } from "../../../framework/internal/entity/playable.entity.2d";
import { utility } from "../../../framework/utils/utility";
import { GamePlayParking2DCar } from "./gamePlay.parking2D.car";
import { PlayableManagerEvent } from "../../../framework/runtime/playable.manager.message";
const { ccclass, property } = _decorator;

@ccclass('PlayableParking2DAirWall')
export class PlayableParking2DAirWall extends PlayableEntity2D
{
    protected override async onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact): Promise<void>
    {
        await super.onBeginContact(selfCollider, otherCollider, contact);

        if (otherCollider == null)
        {
            return;
        }

        const car = utility.GetComponentInParent(GamePlayParking2DCar, otherCollider.node);
        PlayableManagerEvent.getInstance().emit("onAirWallHit", car);
    }
}