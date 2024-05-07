import { _decorator, Component, EventTouch, Input, input, Vec3 } from 'cc';
import SingletonComponent from '../utils/singletonOf.component';
import { PlayableManagerScene } from './playable.manager.scene';
import { PlayableManagerEvent } from './playable.manager.message';
const { ccclass, property } = _decorator;

@ccclass('PlayableManagerInput')
export class PlayableManagerInput extends SingletonComponent<PlayableManagerInput>
{
    public LastTouchPos: Vec3 = new Vec3();

    protected onLoad(): void
    {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart.bind(this))
    }

    protected start(): void
    {

    }

    protected update(deltaTime: number): void
    {

    }

    protected onDestroy(): void
    {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart.bind(this))
    }

    private onTouchStart(event: EventTouch): void
    {
        const touch = event.getTouches()[0];
        const screenPos = touch.getLocation();
        this.LastTouchPos = PlayableManagerScene.getInstance().Camera.screenToWorld(new Vec3(screenPos.x, screenPos.y, 0));

        PlayableManagerEvent.getInstance().emit("onSceneClick");
    }
}

