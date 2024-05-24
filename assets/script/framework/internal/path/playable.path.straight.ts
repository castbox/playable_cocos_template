import { _decorator, Component, Enum, Node, Tween, tween, Vec3 } from "cc";
import { PlayablePath } from "./playable.path";
import { EEntityOrientation } from "../entity/playable.entity";
const { ccclass, executeInEditMode, property } = _decorator;

@ccclass('PlayablePathStraight')
export class PlayablePathStraight extends PlayablePath
{
    @property({type: Enum(EEntityOrientation)})
    public Orientation: EEntityOrientation = EEntityOrientation.Up;

    private _tween: Tween<Node>;

    public override async move(target: Node, speed : number): Promise<void>
    {
        const startPos = target.worldPosition.clone();
        let endPos;
        const offset = 2000;
        const duration = offset / speed;
        switch (this.Orientation)
        {
            case EEntityOrientation.Up:
                endPos = new Vec3(startPos.x, startPos.y + offset, startPos.z);
                break;
            case EEntityOrientation.Down:
                endPos = new Vec3(startPos.x, startPos.y - offset, startPos.z);
                break;
            case EEntityOrientation.Left:
                endPos = new Vec3(startPos.x - offset, startPos.y, startPos.z);
                break;
            case EEntityOrientation.Right:
                endPos = new Vec3(startPos.x + offset, startPos.y, startPos.z);
                break;
        }
        return new Promise<void>((resolve) =>
        {
            this._tween = tween(target).to(duration, { worldPosition: endPos }).call(() =>{
                resolve();
            })
            this._tween.start();
        });
    }

    public override pause(): void
    {

    }

    public override stop(): void
    {
        if (this._tween)
        {
            this._tween.stop();
        }
    }
}