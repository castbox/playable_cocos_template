import { _decorator, Camera, Component, Node, RenderTexture, Sprite, SpriteFrame, Animation, Vec3, Vec2, UITransform, tween } from 'cc';
import { PlayableManagerEvent } from '../../../framework/runtime/playable.manager.message';
import { PlayableManagerInput } from '../../../framework/runtime/playable.manager.input';
import { EScreenOrientation, PlayableManagerCore } from '../../../framework/runtime/playable.manager.core';
import { PlayableManagerScene2D } from '../../../framework/runtime/playable.manager.scene.2d';
import { GamePlayFindOutMagnifierLevel } from './gamePlay.findOutMagnifier.level';
import { GamePlayFindOutMagnifierTarget } from './gamePlay.findOutMagnifier.target';
const { ccclass, property } = _decorator;

@ccclass('GamePlayFindOutMagnifierMagnifier')
export class GamePlayFindOutMagnifierMagnifier extends Component
{
    private _node_view: Node;
    private _camera_view: Camera;
    private _sprite_view: Sprite;
    private _render_texture: RenderTexture;
    private _anim: Animation;
    private _fov: number;
    private _inProcess: boolean = false;

    private _onDragMoveBindEvent = this.onSceneTouchMove.bind(this);
    private _onSceneClickBindEvent = this.onSceneClick.bind(this);
    private _onOrientationChangedBindEvent = this.playPatrol.bind(this);

    public patrol()
    {
        this.playPatrol(PlayableManagerCore.getInstance().SceneOrientation);
    }

    public stopPatrol()
    {
        this._anim.stop();
    }

    public isInView(target: GamePlayFindOutMagnifierTarget)
    {
        const dist = Vec2.distance(this._node_view.getWorldPosition(), target.node.getWorldPosition());
        return dist < this._fov / 2;
    }

    public async findOut(node: GamePlayFindOutMagnifierTarget): Promise<void>
    {
        this._inProcess = true;

        await this.focus(node);
        this._anim.play("findOut");
        this._anim.once(Animation.EventType.FINISHED, () =>
        {
            this._inProcess = false;
        });
    }

    public async focus(target: GamePlayFindOutMagnifierTarget): Promise<void>
    {
        return new Promise<void>((resolve, reject) =>
        {
            tween(this.node).to(1, { worldPosition: target.node.getWorldPosition().clone().add(new Vec3(15, -71)) }).call(() =>
            {
                resolve();
            }).start();
        });
    }

    protected override onLoad()
    {
        this._node_view = this.node.getChildByName("view");
        this._camera_view = this._node_view.getChildByName("camera").getComponent(Camera);
        this._sprite_view = this._node_view.getChildByName("sprite").getComponent(Sprite);

        this._render_texture = new RenderTexture();
        this._render_texture.initialize({ width: 256, height: 256 });
        this._camera_view.targetTexture = this._render_texture;

        let spriteFrame = new SpriteFrame();
        spriteFrame.texture = this._render_texture;
        this._sprite_view.spriteFrame = spriteFrame;
        this._anim = this.node.getComponent(Animation);
        this._fov = this._node_view.getComponent(UITransform).contentSize.width / 2;

        PlayableManagerEvent.getInstance().on("onSceneTouchMove", this._onDragMoveBindEvent);
        PlayableManagerEvent.getInstance().on("onOrientationChanged", this._onOrientationChangedBindEvent);
        PlayableManagerEvent.getInstance().on("onSceneClick", this._onSceneClickBindEvent);
    }

    protected override update(deltaTime: number)
    {

    }

    protected override onDestroy()
    {
        PlayableManagerEvent.getInstance().off("onSceneTouchMove", this._onDragMoveBindEvent);
        PlayableManagerEvent.getInstance().off("onOrientationChanged", this._onOrientationChangedBindEvent);
        PlayableManagerEvent.getInstance().off("onSceneClick", this._onSceneClickBindEvent);
    }

    private onSceneTouchMove(): void
    {
        if (this._inProcess)
        {
            return;
        }

        this.node.worldPosition = PlayableManagerInput.getInstance().LastTouchData.CurrentWSPos;
    }

    private onSceneClick(): void
    {
        if (this._inProcess)
        {
            return;
        }

        this.node.worldPosition = PlayableManagerInput.getInstance().LastTouchData.CurrentWSPos;
    }

    private playPatrol(orientation: EScreenOrientation): void
    {
        if (PlayableManagerScene2D.getInstance().CurrentGamePlay.IsGameStart)
        {
            return;
        }

        if (orientation === EScreenOrientation.Landscape)
        {
            this._anim.play("patrol_landscape");
        }
        else if (orientation === EScreenOrientation.Portrait)
        {
            this._anim.play("patrol_portrait");
        }
    }
}

