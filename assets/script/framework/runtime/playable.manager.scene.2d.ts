import { _decorator, Canvas, UITransform, Vec2 } from "cc";
import { PlayableManagerScene } from "./playable.manager.scene";
import { EScreenOrientation } from "./playable.manager.core";
const { ccclass, property } = _decorator;

@ccclass('PlayableManagerScene2D')
export class PlayableManagerScene2D extends PlayableManagerScene
{
    private _canvas: Canvas = null;

    public get CanvasSize(): Vec2
    {
        return new Vec2(this._canvas.node.getComponent(UITransform).contentSize.width, this._canvas.node.getComponent(UITransform).contentSize.height)
    }

    protected override onLoad(): void
    {
        super.onLoad();
        this._canvas = this.node.getComponentInChildren(Canvas);
    }

    protected override onOrientationChanged(orientation: EScreenOrientation): void
    {
        super.onOrientationChanged(orientation);

        this._canvas.alignCanvasWithScreen = false
        this._canvas.alignCanvasWithScreen = true
    }
}