import { _decorator, Canvas, CCString, Component } from 'cc';
import { PlayableManagerEvent } from '../../runtime/playable.manager.message';
import { EScreenOrientation, PlayableManagerCore } from '../../runtime/playable.manager.core';
import { PlayableManagerAudio } from '../../runtime/playable.manager.audio';
import { utility } from '../../utils/utility';
const { ccclass, property } = _decorator;

@ccclass('PlayableGamePlayCore')
export class PlayableGamePlayCore extends Component
{
    protected onOrientationChangedBindEvent = this.onOrientationChanged.bind(this);
    protected onCanvasResizeBindEvent = this.onCanvasResize.bind(this);

    public async onGameEnter(): Promise<void>
    {
        this.onOrientationChanged(PlayableManagerCore.getInstance().SceneOrientation);
        this.onCanvasResize();
        PlayableManagerEvent.getInstance().on("onOrientationChanged", this.onOrientationChangedBindEvent);
        PlayableManagerEvent.getInstance().on("onCanvasResize", this.onCanvasResizeBindEvent);
    }

    public onGameUpdate(deltaTime: number)
    {
        
    }

    public async onGameStart(): Promise<void>
    {
        PlayableManagerAudio.getInstance().unmute()
        PlayableManagerEvent.getInstance().emit("onGameStart");
    }

    public async onGameEnd(): Promise<void>
    {
        PlayableManagerEvent.getInstance().off("onOrientationChanged", this.onOrientationChangedBindEvent)
        PlayableManagerEvent.getInstance().off("onCanvasResize", this.onCanvasResizeBindEvent)
    }

    public async onGameOver(): Promise<void>
    {
        utility.GameEnd();
    }

    public onDestroy()
    {

    }

    protected onOrientationChanged(orientation: EScreenOrientation)
    {   

    }

    protected onCanvasResize()
    {
        
    }
}