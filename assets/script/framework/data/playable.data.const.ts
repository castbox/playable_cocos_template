import { EventTouch, Vec2, Vec3 } from "cc";
import { PlayableManagerScene } from "../runtime/playable.manager.scene";

export class TouchData
{
    public StartScreenPos: Vec2;
    public CurrentScreenPos: Vec2;
    public OffSetScreen: Vec2;
    public StartWSPos: Vec3;
    public CurrentWSPos: Vec3;
    public DeltaWs: Vec3;

    public set(startScreenPos: Vec2, currentScreenPos: Vec2, deltaScreen: Vec2, startWSPos: Vec3, currentWSPos: Vec3, deltaWs: Vec3)
    {
        this.StartScreenPos = startScreenPos;
        this.CurrentScreenPos = currentScreenPos;
        this.OffSetScreen = deltaScreen;
        this.StartWSPos = startWSPos;
        this.CurrentWSPos = currentWSPos;
        this.DeltaWs = deltaWs;
    }

    public parsing(event: EventTouch)
    {
        const touch = event.getTouches()[0];
        const startScreenPos = touch.getStartLocation().clone();
        const screenPos = touch.getLocation().clone();
        const deltaScreen = screenPos.subtract(startScreenPos);

        const startWorldPos = PlayableManagerScene.getInstance().Camera.Camera.screenToWorld(new Vec3(startScreenPos.x, startScreenPos.y, 0)).clone();
        startWorldPos.z = 0;
        const worldPos = PlayableManagerScene.getInstance().Camera.Camera.screenToWorld(new Vec3(screenPos.x, screenPos.y, 0)).clone();
        worldPos.z = 0;
        const deltaWorldPos = worldPos.subtract(startWorldPos);
        
        this.StartScreenPos = startScreenPos;
        this.CurrentScreenPos = screenPos;
        this.OffSetScreen = deltaScreen;
        this.StartWSPos = startWorldPos;
        this.CurrentWSPos = worldPos;
        this.DeltaWs = deltaWorldPos;
    }
}