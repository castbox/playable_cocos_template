import { _decorator, Label, Node } from 'cc';
import SingletonComponent from "../utils/singletonOf.component";
import { PlayableDynamicMask } from '../internal/guide/playable.dynamicMask';
import { PayableGuide } from '../internal/guide/playable.guide';
import { PlayableDynamicFinger } from '../internal/guide/playable.dynamicFinger';
import { PlayableManagerEvent } from './playable.manager.message';
const { ccclass, property } = _decorator;

@ccclass('PlayableManagerGuide')
export class PlayableManagerGuide extends SingletonComponent<PlayableManagerGuide>
{
    private _finger: PlayableDynamicFinger
    private _mask: PlayableDynamicMask
    private _guideQueue: PayableGuide[] = []
    private _label_Content: Label
    private _currentGuide: PayableGuide

    public get Finger()
    {
        return this._finger;
    }

    public get Mask()
    {
        return this._mask;
    }

    public get Label_Content()
    {
        return this._label_Content;
    }

    public add(guide: PayableGuide): void
    {
        if (this._guideQueue.indexOf(guide) == -1)
        {
            this._guideQueue.push(guide);
        }
    }

    public remove(guide: PayableGuide): void
    {
        let index = this._guideQueue.indexOf(guide);
        if (index != -1)
        {
            this._guideQueue.splice(index, 1);
        }
    }

    public clear(): void
    {
        this._guideQueue = [];
    }

    public play()
    {
        this.scheduleOnce(() =>
        {
            this.next();
        }, 0)
    }

    protected onLoad(): void
    {
        this._finger = this.node.getComponentInChildren(PlayableDynamicFinger)
        this._mask = this.node.getComponentInChildren(PlayableDynamicMask);
        this._label_Content = this.node.getComponentInChildren(Label);
        this._finger.init();
        this._mask.init();
        this._label_Content.node.active = false;
    }

    protected update(deltaTime: number): void
    {
        if (this._currentGuide)
        {
            if (this._currentGuide.check())
            {
                this.next();
            }
        }
    }

    private next(): void
    {
        if (this._currentGuide)
        {
            this._currentGuide.end();
        }
        this._currentGuide = this._guideQueue.shift();
        if (this._currentGuide != null)
        {
            this._currentGuide.active();
            this._currentGuide.show();
        }
        else
        {
            this.end();
            return;
        }
    }

    protected end()
    {
        console.log("end guide")
        PlayableManagerEvent.getInstance().emit("onGuideEnd")
    }
}