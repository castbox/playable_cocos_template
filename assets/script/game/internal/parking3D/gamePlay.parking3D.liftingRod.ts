import { _decorator, ITriggerEvent, tween, Tween, Vec3, Node } from "cc";
import { GamePlayParking3DEntity } from "./gamePlay.parking3D.entity";
import { GamePlayParking3DCar } from "./gamePlay.parking3D.car";
const { ccclass, property } = _decorator;

@ccclass('GamePlayParking3DLiftingRod')
export class GamePlayParking3DLiftingRod extends GamePlayParking3DEntity
{
    @property (Node)
    public Rod : Node = null;

    protected override onTriggerEnter(event: ITriggerEvent): void
    {
        this.onHit(event.otherCollider.node.getComponent(GamePlayParking3DCar));
    }

    public override async onHit(entity: GamePlayParking3DCar): Promise<void>
    {
        super.onHit(entity);

        await this.lift();
        await this.down();
    }

    private async lift(): Promise<void>
    {
        return new Promise<void>((resolve) =>
        {
            Tween.stopAllByTarget(this.Rod);
            const euler = this.Rod.eulerAngles;
            tween(this.Rod).to(
                0.12,
                {
                    eulerAngles: new Vec3(euler.x, euler.y, -90)
                }).call(() =>
                {
                    resolve();
                }).start();
        })
    }

    private async down(): Promise<void>
    {
        return new Promise<void>((resolve) =>
        {
            Tween.stopAllByTarget(this.Rod);
            const euler = this.Rod.eulerAngles;
            tween(this.Rod).to(0.12,
                {
                    eulerAngles: new Vec3(euler.x, euler.y, 0)
                }).call(() =>
                {
                    resolve();
                }).start();
        })
    }
}