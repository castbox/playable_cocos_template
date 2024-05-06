import { _decorator, CCString, Component, Enum, Node, SpriteFrame, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

import { PlayableGamePlayCore } from '../../../framework/internal/gamePlay/playable.gamePlay.core';
import { PlayableManagerEvent } from '../../../framework/runtime/playable.manager.message';
import { PlayableManagerScene } from '../../../framework/runtime/playable.manager.scene';
import { PlayableManagerAudio } from '../../../framework/runtime/playable.manager.audio';
import { PlayableManagerVFX } from '../../../framework/runtime/playable.manager.vfx';
import { GamePlayFindOutSelectable } from './gamePlay.findOut.selectable';
import { GamePlayFindOutLogicAppear } from './gamePlay.findOut.logic.appear';
import { GamePlayFindOutLogicDisappear } from './gamePlay.findOut.logic.disappear';
import { GamePlayFindOutLogic } from './gamePlay.findOut.logic';
import { PlayableManagerGuide } from '../../../framework/runtime/playable.manager.guide';

(window as any).GamePlayFindOutLogicAppear = GamePlayFindOutLogicAppear;
(window as any).GamePlayFindOutLogicDisappear = GamePlayFindOutLogicDisappear;

export enum EFindOutLogicType
{
    Appear,
    Disappear
}

@ccclass('GamePlayFindOutLevel')
export class GamePlayFindOutLevel extends PlayableGamePlayCore
{
    @property({
        type: Enum(EFindOutLogicType),
        displayName: "选择逻辑类型",
        tooltip:
            `Appear: 选中时出现
             Disappear: 选中时消失`
    })
    public LogicClassType: EFindOutLogicType = EFindOutLogicType.Appear;

    private _logic : GamePlayFindOutLogic
    private onSelectBindEvent = this.onSelected.bind(this);
    private onSceneClickBindEvent = this.onSceneClick.bind(this);

    protected _selectCount: number;
    protected _currentSelectCnt: number;
    protected _selectableList: Array<GamePlayFindOutSelectable>;

    public get selectableList()
    {
        return this._selectableList;
    }

    public override async onGameEnter(): Promise<void>
    {
        this.node.active = false;

        this._currentSelectCnt = 0;
        this._selectableList = this.node.getComponentsInChildren(GamePlayFindOutSelectable).filter((selectable)=>selectable.CanSelected)
        this._selectCount = this._selectableList.length;

        this._logic = eval(`new ${'GamePlayFindOutLogic' + EFindOutLogicType[this.LogicClassType]}()`);
        this._logic.onEnter(this.node);

        PlayableManagerEvent.getInstance().on("onSelect", this.onSelectBindEvent);
        PlayableManagerEvent.getInstance().on("onSceneClick", this.onSceneClickBindEvent);

        const maskSelectable = this.selectableList.find((selectable) => selectable.WillMask);
        PlayableManagerGuide.getInstance().Mask.addCircleTarget(maskSelectable.node.getWorldPosition(), 80);
        PlayableManagerGuide.getInstance().Finger.point(maskSelectable.node.getWorldPosition());
        PlayableManagerEvent.getInstance().once("onSceneClick", () =>
        {
            PlayableManagerGuide.getInstance().Mask.hide();
            PlayableManagerGuide.getInstance().Finger.hide()
            this.onGameStart();
        })
        this.node.active = true;
    }

    public override async onGameStart(): Promise<void>
    {
        super.onGameStart()

        this.nextSelect();
    }

    public override onGameUpdate(deltaTime: number)
    {
        super.onGameUpdate(deltaTime);
    }

    public override async onGameEnd()
    {
        this._logic.onEnd();

        PlayableManagerEvent.getInstance().off("onSelect", this.onSelectBindEvent);
        PlayableManagerEvent.getInstance().off("onSceneClick", this.onSceneClickBindEvent);
    }

    public async onGameOver(): Promise<void>
    {
        super.onGameOver();
    }

    protected onSceneClick(clickNode)
    {
        if (clickNode == PlayableManagerScene.getInstance().node)
        {
            PlayableManagerAudio.getInstance().playSFX("click_error");
        }
    }

    protected onSelected(obj: Node)
    {
        this._selectableList = this._selectableList.filter((value) =>
        {
            return value.node != obj;
        })

        this._currentSelectCnt++;
        this._logic.onSelect(obj.getComponent(GamePlayFindOutSelectable))
        this.nextSelect();

        PlayableManagerVFX.getInstance().playParticleByTarget("effect", obj.getChildByName("btn"));
        PlayableManagerAudio.getInstance().playSFX("click");
    }

    protected nextSelect()
    {
        if (this._selectableList.length == 0)
        {
            this.gameEnd()
            return;
        }
    }

    protected async gameEnd()
    {
        PlayableManagerEvent.getInstance().emit("onGameEnd");
    }
}

