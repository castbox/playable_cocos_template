import { _decorator, Camera, tween, Tween } from "cc";
import { PlayableCamera } from "./playable.camera";
const { ccclass, property } = _decorator;

@ccclass('PlayableCameraOrtho')
export class PlayableCameraOrtho extends PlayableCamera
{
    public override async zoom(to: number, from: number = null, duration: number = 0.5): Promise<void>
    {
        Tween.stopAllByTarget(this.node);

        return new Promise<void>((resolve) =>
        {
            if (from)
            {
                this.camera.orthoHeight = from;
            }
            tween(this.camera).to(duration, { orthoHeight: to }).call(() =>
            {
                resolve();
            }).start();
        })
    }
}  