import { Component, TERRAIN_HEIGHT_BASE, _decorator } from "cc";
import { PlayableManagerEvent } from "../../runtime/playable.manager.message";
import { EScreenOrientation, PlayableManagerCore } from "../../runtime/playable.manager.core";
const { ccclass, property } = _decorator;

@ccclass("PlayableUI")
export class PlayableUI extends Component
{
    protected onOrientationChangedBindEvent = this.onOrientationChanged.bind(this);

    public async init(): Promise<void>
    {

    }

    public async open(): Promise<void> 
    {
        this.onOrientationChanged(PlayableManagerCore.getInstance().SceneOrientation)
        PlayableManagerEvent.getInstance().on("onOrientationChanged", this.onOrientationChangedBindEvent)
    }

    public hide()
    {
        this.node.active = false;
    }

    public close()
    {
        PlayableManagerEvent.getInstance().off("onOrientationChanged", this.onOrientationChangedBindEvent)
    }

    protected onOrientationChanged(orientation: EScreenOrientation)
    {   

    }
}