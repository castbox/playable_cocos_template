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

    protected selectCount: number;
    protected currentSelectCnt: number;
    protected selectableList: Array<GamePlayFindOutSelectable>;
    protected willMaskSelectable: GamePlayFindOutSelectable

    public get SelectableList()
    {
        return this.selectableList;
    }

    public get WillMaskSelectable()
    {
        return this.willMaskSelectable;
    }

    public override async onGameEnter(): Promise<void>
    {
        this.node.active = false;

        this.currentSelectCnt = 0;
        this.selectableList = this.node.getComponentsInChildren(GamePlayFindOutSelectable).filter((selectable)=>selectable.CanSelected)
        this.selectCount = this.selectableList.length;
        this.willMaskSelectable = this.node.getComponentsInChildren(GamePlayFindOutSelectable).find((selectable)=>selectable.WillMask)

        this._logic = eval(`new ${'GamePlayFindOutLogic' + EFindOutLogicType[this.LogicClassType]}()`);
        this._logic.onEnter(this.node);

        PlayableManagerEvent.getInstance().on("onSelect", this.onSelectBindEvent);

        const maskSelectable = this.SelectableList.find((selectable) => selectable.WillMask);
        PlayableManagerGuide.getInstance().Mask.circle(maskSelectable.node.getWorldPosition(), 80);
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
    }

    public async onGameOver(): Promise<void>
    {
        super.onGameOver();
    }

    protected override onSceneClick(clickNode)
    {
        super.onSceneClick(clickNode);

        if (clickNode == null)
        {
            PlayableManagerAudio.getInstance().playSFX("click_error");
        }
    }

    protected onSelected(obj: Node)
    {
        this.selectableList = this.selectableList.filter((value) =>
        {
            return value.node != obj;
        })

        this.currentSelectCnt++;
        this._logic.onSelect(obj.getComponent(GamePlayFindOutSelectable))
        this.nextSelect();

        PlayableManagerVFX.getInstance().playParticleByTarget("effect", obj.getChildByName("btn"));
        PlayableManagerAudio.getInstance().playSFX("click");
    }

    protected nextSelect()
    {
        if (this.selectableList.length == 0)
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

