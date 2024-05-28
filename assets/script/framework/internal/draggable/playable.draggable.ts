import { _decorator, CCBoolean, Component, EventTouch, JsonAsset, Node, Vec2, Vec3 } from 'cc';
import { PlayableManagerScene } from '../../runtime/playable.manager.scene';
import { PlayableManagerConfig } from '../../runtime/playable.manager.config';
import { TouchData } from '../../data/playable.data.const';
const { ccclass, property } = _decorator;

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

    private _lastTouchData: TouchData = null;
    public get LastTouchData(): TouchData
    {
        return this._lastTouchData;
    }

    private _draggable: boolean = true;

    protected onLoad(): void  
    {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        this._lastTouchData = new TouchData();
    }

    protected start()
    {

    }

    protected update(deltaTime: number)
    {

    }

    private onTouchStart(event: EventTouch)
    {
        this._lastTouchData.parsing(event);
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

            this._lastTouchData.parsing(event);
            if (!this._isDragging)
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

