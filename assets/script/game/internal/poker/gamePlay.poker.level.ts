import { _decorator, Component, Node, Vec3 } from 'cc';
import { PlayableGamePlayCore } from '../../../framework/internal/gamePlay/playable.gamePlay.core';
import { GamePlayPokerDeck } from './gamePlay.poker.deck';
import { GamePlayPokerHoling } from './gamePlay.poker.holding';
import { PlayableManagerEvent } from '../../../framework/runtime/playable.manager.message';
import { PlayableManagerUI } from '../../../framework/runtime/playable.manager.ui';
import { GamePlayPoker } from './gamePlay.poker';
import { GamePlayPokerTableau } from './gamePlay.poker.tableau';
import { PlayableManagerAudio } from '../../../framework/runtime/playable.manager.audio';
const { ccclass, property } = _decorator;

@ccclass('GamePlayPokerLevel')
export class GamePlayPokerLevel extends PlayableGamePlayCore
{
    protected tableauList: GamePlayPokerTableau[] = [];
    protected pokerDeck: GamePlayPokerDeck
    protected pokerHolding: GamePlayPokerHoling

    private _onPokerDragStartBindEvent = this.processPokerDragStart.bind(this);
    private _onPokerDragMoveBindEvent = this.processPokerDragMove.bind(this);
    private _onPokerDragEndBindEvent = this.processPokerDragEnd.bind(this);
    private _onPokerClickBindEvent = this.processPokerClick.bind(this);

    public get TableauList(): GamePlayPokerTableau[]
    {
        return this.tableauList;
    }

    protected onLoad(): void
    {
        this.tableauList = this.node.getComponentsInChildren(GamePlayPokerTableau);
        this.pokerDeck = this.node.getComponentInChildren(GamePlayPokerDeck);
        this.pokerHolding = this.node.getComponentInChildren(GamePlayPokerHoling);

        this.pokerDeck.init();

        PlayableManagerEvent.getInstance().on("onPokerDragStart", this._onPokerDragStartBindEvent);
        PlayableManagerEvent.getInstance().on("onPokerDragMove", this._onPokerDragMoveBindEvent);
        PlayableManagerEvent.getInstance().on("onPokerDragEnd", this._onPokerDragEndBindEvent);
        PlayableManagerEvent.getInstance().on("onPokerClick", this._onPokerClickBindEvent);
    }

    public override async onEnter()
    {
        super.onEnter();
    }

    public override onUpdate(deltaTime: number)
    {
        super.onUpdate(deltaTime);
    }

    public override onGameEnd()
    {
        super.onGameEnd();

        PlayableManagerEvent.getInstance().off("onPokerDragStart", this._onPokerDragStartBindEvent);
        PlayableManagerEvent.getInstance().off("onPokerDragMove", this._onPokerDragMoveBindEvent);
        PlayableManagerEvent.getInstance().off("onPokerDragEnd", this._onPokerDragEndBindEvent);
        PlayableManagerEvent.getInstance().off("onPokerClick", this._onPokerClickBindEvent);
    }

    public override onGameOver()
    {
        super.onGameOver();
    }

    public override onGameStart()
    {
        super.onGameStart();
    }

    protected processPokerDragStart(holdingLst: GamePlayPoker[], startWsPos: Vec3)
    {
        this.pokerHolding.pickUp(holdingLst, startWsPos)
    }

    protected processPokerDragMove(movingWsPos: Vec3)
    {
        this.pokerHolding.hold(movingWsPos)
    }

    protected processPokerDragEnd()
    {
    }

    protected processPokerClick(poker: GamePlayPoker)
    {
        
    }
}

