import { _decorator, CCBoolean, Component, EventTouch, JsonAsset, Node, Vec2, Vec3 } from 'cc';
import { PlayableManagerScene } from '../../runtime/playable.manager.scene';
import { PlayableManagerResource } from '../../runtime/playable.manager.resource';
import { PlayableManagerConfig } from '../../runtime/playable.manager.config';
const { ccclass, property } = _decorator;

export class DragInfo
{
    public StartScreenPos: Vec2;
    public CurrentScreenPos: Vec2;
    public OffSetScreen: Vec2;
    public StartWSPos: Vec3;
    public CurrentWSPos: Vec3;
    public DeltaWs: Vec3;

    set(startScreenPos: Vec2, currentScreenPos: Vec2, deltaScreen: Vec2, startWSPos: Vec3, currentWSPos: Vec3, deltaWs: Vec3)
    {
        this.StartScreenPos = startScreenPos;
        this.CurrentScreenPos = currentScreenPos;
        this.OffSetScreen = deltaScreen;
        this.StartWSPos = startWSPos;
        this.CurrentWSPos = currentWSPos;
        this.DeltaWs = deltaWs;
    }
}

@ccclass('PlayableDraggable')
export class PlayableDraggable extends Component
{
    @property(CCBoolean)
    public Intractable: boolean = true;

    private _isDragging: boolean = false;
    public get isDragging(): boolean
    {
        return this._isDragging;
    };

    private _lastDragInfo: DragInfo = null;
    public get lastDragInfo(): DragInfo
    {
        return this._lastDragInfo;
    }

    private _draggable: boolean = true;

    protected onLoad(): void  
    {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        this._lastDragInfo = new DragInfo();
    }

    protected start()
    {

    }

    protected update(deltaTime: number)
    {

    }

    private onTouchStart(event: EventTouch)
    {

    }

    private onTouchMove(event: EventTouch)
    {
        if (!this.Intractable || !this._draggable)
        {
            return;
        }

        try
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

            this.prepareData(event);
            if (!this.isDragging)
            {
                this._draggable = this.onDragStart();
                this._isDragging = true;
                return;
            }

            this.onDragMove()
        }
        catch (error)
        {
            console.error(error)
        }
    }

    private onTouchEnd(event: EventTouch)
    {
        if (!this.Intractable || !this._draggable)
        {
            return;
        }

        if (!this._isDragging)
        {
            this.prepareData(event);
            this.onClick();
            return;
        }

        try
        {
            this._draggable = true;
            this._isDragging = false;
            this.onDragEnd();
        }
        catch (error)
        {
            console.error(error)
        }
    }

    private onTouchCancel()
    {
        if (!this.Intractable || !this._draggable)
        {
            return;
        }

        if (!this._isDragging)
        {
            return;
        }

        this._draggable = true;
        this._isDragging = false;
        this.onDragCancel();
    }

    private prepareData(event: EventTouch)
    {
        const touch = event.getTouches()[0];
        const startScreenPos = touch.getStartLocation();
        const screenPos = touch.getLocation();
        const deltaScreen = new Vec2(screenPos.x - startScreenPos.x, screenPos.y - startScreenPos.y);

        const startWorldPos = PlayableManagerScene.getInstance().Camera.screenToWorld(new Vec3(startScreenPos.x, startScreenPos.y, 0));
        const worldPos = PlayableManagerScene.getInstance().Camera.screenToWorld(new Vec3(screenPos.x, screenPos.y, 0));
        worldPos.z = 0;
        const deltaWorldPos = new Vec3(worldPos.x - startWorldPos.x, worldPos.y - startWorldPos.y, 0);
        this._lastDragInfo.set
            (
                startScreenPos,
                screenPos,
                deltaScreen,
                startWorldPos,
                worldPos,
                deltaWorldPos
            )
    }

    protected onDragStart(): boolean
    {
        return true;
    }

    protected onDragMove()
    {

    }

    protected onDragEnd()
    {

    }

    protected onDragCancel()
    {

    }

    protected onClick()
    {

    }
}

