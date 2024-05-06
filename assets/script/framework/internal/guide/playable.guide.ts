import { Label, Tween, tween, Widget } from "cc";
import { PlayableManagerGuide } from "../../runtime/playable.manager.guide";
import { PlayableDynamicFinger } from "./playable.dynamicFinger";
import { PlayableDynamicMask } from "./playable.dynamicMask";
import { PlayableManagerEvent } from "../../runtime/playable.manager.message";
import { EScreenOrientation, PlayableManagerCore } from "../../runtime/playable.manager.core";
import { PlayableGamePlayCore } from "../gamePlay/playable.gamePlay.core";
import { PlayableManagerScene } from "../../runtime/playable.manager.scene";

export class PayableGuide 
{
    protected mask: PlayableDynamicMask
    protected finger: PlayableDynamicFinger;
    protected label_content: Label;
    protected isEnd : boolean = false;
    protected level : PlayableGamePlayCore

    private onCanvasResizeBindEvent = this.onCanvasResize.bind(this);
    private onOrientationChangedBindEvent = this.onOrientationChanged.bind(this);

    public async active(): Promise<void>
    {
        this.mask = PlayableManagerGuide.getInstance().Mask;
        this.finger = PlayableManagerGuide.getInstance().Finger;
        this.label_content = PlayableManagerGuide.getInstance().Label_Content;
        this.level = PlayableManagerScene.getInstance().CurrentGamePlay;

        PlayableManagerEvent.getInstance().on("onCanvasResize", this.onCanvasResizeBindEvent);
        PlayableManagerEvent.getInstance().on("onOrientationChanged", this.onOrientationChangedBindEvent);
    }

    public async show(): Promise<void>
    {
        this.mask.clear();
        this.finger.clear();
        PlayableManagerGuide.getInstance().unscheduleAllCallbacks();
        Tween.stopAllByTarget(PlayableManagerGuide.getInstance().node); 
    }

    public async hide(): Promise<void>
    {
        this.mask.hide();
        this.finger.hide();
        this.label_content.node.active = false;
    }

    public check(): boolean
    {
        return this.isEnd;
    }

    public async end(): Promise<void>
    {
        PlayableManagerEvent.getInstance().off("onCanvasResize", this.onCanvasResizeBindEvent);
        PlayableManagerEvent.getInstance().off("onOrientationChanged", this.onOrientationChangedBindEvent);
    }

    protected async onCanvasResize()
    {
        
    }

    protected async onOrientationChanged(orientation: EScreenOrientation)
    {
        
    }
}