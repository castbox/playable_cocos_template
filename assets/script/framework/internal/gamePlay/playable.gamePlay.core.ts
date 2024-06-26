import { _decorator, Canvas, CCString, Component, Node } from 'cc';
import { PlayableManagerEvent } from '../../runtime/playable.manager.message';
import { EScreenOrientation, PlayableManagerCore } from '../../runtime/playable.manager.core';
import { PlayableManagerAudio } from '../../runtime/playable.manager.audio';
import { utility } from '../../utils/utility';
const { ccclass, property } = _decorator;

@ccclass('PlayableGamePlayCore')
export class PlayableGamePlayCore extends Component
{
    protected isActive: boolean = false;

    protected onOrientationChangedBindEvent = this.onOrientationChanged.bind(this);
    protected onCanvasResizeBindEvent = this.onCanvasResize.bind(this);
    protected onSceneClickBindEvent = this.onSceneClick.bind(this);

    protected isGameStart: boolean = false;
    public get IsGameStart(): boolean
    {
        return this.isGameStart;
    }

    public get IsActive(): boolean
    {
        return this.isActive;
    }

    public async onGameEnter(): Promise<void>
    {
        this.isActive = true;

        this.onOrientationChanged(PlayableManagerCore.getInstance().SceneOrientation);
        this.onCanvasResize();
        PlayableManagerEvent.getInstance().on("onOrientationChanged", this.onOrientationChangedBindEvent);
        PlayableManagerEvent.getInstance().on("onCanvasResize", this.onCanvasResizeBindEvent);
        PlayableManagerEvent.getInstance().on("onSceneClick", this.onSceneClickBindEvent);
    }

    public onGameUpdate(deltaTime: number)
    {

    }

    public async onGameStart(): Promise<void>
    {
        PlayableManagerAudio.getInstance().unmute()
        PlayableManagerEvent.getInstance().emit("onGameStart");
        this.isGameStart = true;
    }

    public async onGameFinish(): Promise<void>
    {
        PlayableManagerEvent.getInstance().emit("onGameFinish");
    }

    public async onGameEnd(): Promise<void>
    {
        PlayableManagerEvent.getInstance().off("onOrientationChanged", this.onOrientationChangedBindEvent)
        PlayableManagerEvent.getInstance().off("onCanvasResize", this.onCanvasResizeBindEvent)
        PlayableManagerEvent.getInstance().off("onSceneClick", this.onSceneClickBindEvent)

        this.isActive = false;
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

    protected onSceneClick(node: Node)
    {

    }
}