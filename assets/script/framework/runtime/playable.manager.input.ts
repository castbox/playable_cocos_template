import { _decorator, Component, EventTouch, geometry, Input, input, JsonAsset, PhysicsSystem, Vec2, Vec3 } from 'cc';
import SingletonComponent from '../utils/singletonOf.component';
import { PlayableManagerScene } from './playable.manager.scene';
import { PlayableManagerEvent } from './playable.manager.message';
import { TouchData } from '../data/playable.data.const';
import { PlayableManagerConfig } from './playable.manager.config';
const { ccclass, property } = _decorator;

@ccclass('PlayableManagerInput')
export class PlayableManagerInput extends SingletonComponent<PlayableManagerInput>
{
    private _isDragging: boolean = false;
    private _ray = new geometry.Ray()

    private _lastTouchData: TouchData;
    public get LastTouchData(): TouchData
    {
        return this._lastTouchData;
    }

    public getLastTouchObj<T extends Component>(componentType: new () => T)
    {
        const results = PhysicsSystem.instance.raycastResults
        if (results.length === 0) {
            return null;
        }
        return results[0].collider.node.getComponent(componentType);
    }
    
    private _onTouchStartBindEvent = this.onTouchStart.bind(this);
    private _onTouchMoveBindEvent = this.onTouchMove.bind(this);
    private _onTouchEndBindEvent = this.onTouchEnd.bind(this);
    protected onLoad(): void
    {
        input.on(Input.EventType.TOUCH_START, this._onTouchStartBindEvent)
        input.on(Input.EventType.TOUCH_MOVE, this._onTouchMoveBindEvent)
        input.on(Input.EventType.TOUCH_END, this._onTouchEndBindEvent)

        this._lastTouchData = new TouchData();
    }

    protected start(): void
    {

    }

    protected update(deltaTime: number): void
    {

    }

    protected onDestroy(): void
    {
        input.off(Input.EventType.TOUCH_START, this._onTouchStartBindEvent)
        input.off(Input.EventType.TOUCH_MOVE, this._onTouchMoveBindEvent)
        input.off(Input.EventType.TOUCH_END, this._onTouchEndBindEvent)
    }

    private onTouchStart(event: EventTouch): void
    {

    }

    private onTouchMove(event: EventTouch): void
    {
        const touch = event.getTouches()[0];
        const startScreenPos = touch.getStartLocation();
        const screenPos = touch.getLocation();
        const deltaScreen = new Vec2(screenPos.x - startScreenPos.x, screenPos.y - startScreenPos.y);

        const settings: JsonAsset = PlayableManagerConfig.getInstance().settings;
        if (deltaScreen.lengthSqr() < Number.parseInt(settings.json['touch']['moving_distance']))
        {
            return;
        }

        this._lastTouchData.parsing(event);
        PlayableManagerScene.getInstance().Camera.screenPointToRay(screenPos.x, screenPos.y, this._ray)
        if (!PhysicsSystem.instance.raycast(this._ray)) 
        {
            return;
        }

        if (!this._isDragging)
        {
            this._isDragging = true;
            PlayableManagerEvent.getInstance().emit("onSceneTouchStart");
            return;
        }

        PlayableManagerEvent.getInstance().emit("onSceneTouchMove");
    }

    private onTouchEnd(event: EventTouch): void
    {
        if (!this._isDragging)
        {
            this._lastTouchData.parsing(event);
            PlayableManagerEvent.getInstance().emit("onSceneClick");

            console.log("onSceneClick");
            return;
        }

        this._isDragging = false;
    }

    private onTouchCancel(event: EventTouch): void
    {
        this._isDragging = false;
        PlayableManagerEvent.getInstance().emit("onSceneTouchCancel");
    }
}

