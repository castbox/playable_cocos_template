import { EventTouch, JsonAsset, Vec2, Vec3 } from "cc";
import { PlayableManagerScene } from "../runtime/playable.manager.scene";
import { PlayableManagerConfig } from "../runtime/playable.manager.config";

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
        const startScreenPos = touch.getStartLocation();
        const screenPos = touch.getLocation();
        const deltaScreen =  new Vec2(screenPos.x - startScreenPos.x, screenPos.y - startScreenPos.y);

        const startWorldPos = PlayableManagerScene.getInstance().Camera.Camera.screenToWorld(new Vec3(startScreenPos.x, startScreenPos.y, 0));
        startWorldPos.z = 0;
        const worldPos = PlayableManagerScene.getInstance().Camera.Camera.screenToWorld(new Vec3(screenPos.x, screenPos.y, 0));
        worldPos.z = 0;
        const deltaWorldPos = new Vec3(worldPos.x - startWorldPos.x, worldPos.y - startWorldPos.y, 0);
        
        this.StartScreenPos = startScreenPos;
        this.CurrentScreenPos = screenPos;
        this.OffSetScreen = deltaScreen;
        this.StartWSPos = startWorldPos;
        this.CurrentWSPos = worldPos;
        this.DeltaWs = deltaWorldPos;
    }
}