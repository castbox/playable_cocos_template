import { _decorator, Collider2D, Component, Graphics, IPhysics2DContact, math, Sprite, tween, Tween, UITransform, Vec2, Vec3 } from "cc";
import { PlayableEntity2D } from "../../../framework/internal/entity/playable.entity.2d";
import { PlayableManagerEvent } from "../../../framework/runtime/playable.manager.message";
import { PlayableManagerConfig } from "../../../framework/runtime/playable.manager.config";
import { PlayableManagerVFX } from "../../../framework/runtime/playable.manager.vfx";
import { utility } from "../../../framework/utils/utility";
import { PlayableManagerAudio } from "../../../framework/runtime/playable.manager.audio";
const { ccclass, property } = _decorator;

export enum EParking2DCarStatus
{
    Idle = 0,
    Moving = 1,
}

@ccclass('GamePlayParking2DCar')
export class GamePlayParking2DCar extends PlayableEntity2D
{
    private _status: EParking2DCarStatus;
    private static _collisionCount: number = 0;

    public override async moveByPath(): Promise<void>
    {
        await super.moveByPath();

        if (this.MovePath)
        {
            this._status = EParking2DCarStatus.Moving;
            await this.MovePath.move(this.node, PlayableManagerConfig.getInstance().settings.json.parking2D.speed);
        }
    }

    public onClick(): void
    {
        PlayableManagerEvent.getInstance().emit("onCarClick", this);
        PlayableManagerEvent.getInstance().emit("onSceneClick", this.node);
    }

    protected override onLoad(): void
    {
        super.onLoad();

        this._status = EParking2DCarStatus.Idle;
    }

    protected override async onBeHit(entity: GamePlayParking2DCar): Promise<void>
    {
        console.log("onBeHit");

        await this.applyImpulse(entity.forward.multiplyScalar(50), PlayableManagerConfig.getInstance().settings.json.parking2D.collision_duration / 2);
        await this.recover();
    }

    protected override async onHit(entity: GamePlayParking2DCar): Promise<void>
    {
        console.log("onHit");

        PlayableManagerAudio.getInstance().playSFX("colliderCar");

        if (this.MovePath)
        {
            this.MovePath.stop();
        }
        await this.recover();
    }

    protected override async onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact): Promise<void>
    {
        await super.onBeginContact(selfCollider, otherCollider, contact);

        const otherCar = utility.GetComponentInParent(GamePlayParking2DCar, otherCollider.node);
        if (otherCar)
        {  
            GamePlayParking2DCar._collisionCount++;
            if (GamePlayParking2DCar._collisionCount > 2)
            {
                return;
            }
            
            switch (this._status)
            {
                case EParking2DCarStatus.Idle:
                    await this.onBeHit(otherCar);
                    PlayableManagerEvent.getInstance().emit("onCarBeHit", this);
                    break;

                case EParking2DCarStatus.Moving:
                    const collisionPoint = contact.getWorldManifold().points[0];
                    PlayableManagerVFX.getInstance().playEffectAtWsPosition("hit", new Vec3(collisionPoint.x, collisionPoint.y, 0));

                    await this.onHit(otherCar);
                    PlayableManagerEvent.getInstance().emit("onCarHit", this);
                    break;
            }
        }
    }

    private async recover(): Promise<void>
    {
        Tween.stopAllByTarget(this.node);

        return new Promise<void>((resolve) =>
        {
            tween(this.node).to(PlayableManagerConfig.getInstance().settings.json.parking2D.collision_duration,
                {
                    position: this.originPosition
                }).call(() =>
                {
                    this.node.eulerAngles = this.originEulerAngles;
                    this._status = EParking2DCarStatus.Idle;
                    GamePlayParking2DCar._collisionCount = 0;
                    resolve();
                }).start();
        })
    }
}