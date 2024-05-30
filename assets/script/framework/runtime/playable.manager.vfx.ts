import { _decorator, Vec3, ParticleSystem2D, Animation, Node, Camera } from 'cc';
import SingletonComponent from '../utils/singletonOf.component';
import { utility } from '../utils/utility';
import { PlayableManagerResource } from './playable.manager.resource';
import { EScreenOrientation } from './playable.manager.core';
import { PlayableManagerScene } from './playable.manager.scene';
import { PlayableManagerEvent } from './playable.manager.message';
const { ccclass, property } = _decorator;

@ccclass('PlayableManagerVFX')
export class PlayableManagerVFX extends SingletonComponent<PlayableManagerVFX>
{
    private _camera: Camera;

    private _onCanvasResizeBindEvent = this.onCanvasResize.bind(this);
    private _onOrientationChangeBindEvent = this.onOrientationChange.bind(this);

    public async playEffectAtWsPosition(vfxName: string, wsPos: Vec3)
    {
        try
        {
            const vfx = await PlayableManagerResource.loadPrefab(Animation, `vfx/${vfxName}`);
            this.node.addChild(vfx.node);
            utility.setNodeWorldPositionToTarget(vfx.node, wsPos);
            vfx.play();
            vfx.once(Animation.EventType.FINISHED, () =>
            {
                vfx.node.destroy();
            });
        }
        catch (error)
        {
            console.error("Failed to play effect: ", error);
        }
    }

    public async playParticleByTarget(vfxName: string, target: Node)
    {
        try
        {
            const vfx = await PlayableManagerResource.loadPrefab(Animation, `vfx/${vfxName}`);
            target.addChild(vfx.node);
            vfx.node.position = new Vec3(0, 0, 0);
            vfx.play();
            vfx.once(Animation.EventType.FINISHED, () =>
            {
                vfx.node.destroy();
            });
        }
        catch (error)
        {
            console.error("Failed to play effect: ", error);
        }
    }

    protected override onLoad(): void
    {
        console.log("PlayableManagerVFX onLoad");

        this._camera = this.node.getComponentInChildren(Camera);
        PlayableManagerEvent.getInstance().on("onCanvasResize", this._onCanvasResizeBindEvent);
        PlayableManagerEvent.getInstance().on("onOrientationChanged", this._onOrientationChangeBindEvent);
    }

    private onCanvasResize()
    {
        if (this._camera == null)
            return;

        this._camera.orthoHeight = PlayableManagerScene.getInstance().Camera.Camera.orthoHeight;
    }

    private onOrientationChange(orientation: EScreenOrientation)
    {
        if (this._camera == null)
            return;

        this._camera.orthoHeight = PlayableManagerScene.getInstance().Camera.Camera.orthoHeight;
    }
}
