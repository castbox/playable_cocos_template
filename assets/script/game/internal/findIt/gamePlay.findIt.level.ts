import { _decorator, CCString, Component, Enum, Node, SpriteFrame, Tween, Vec3 } from 'cc';
import { PlayableGamePlayCore } from "../../../framework/internal/gamePlay/playable.gamePlay.core";
import { PlayableManagerResource } from '../../../framework/runtime/playable.manager.resource';
import { GamePlayFindItPieces } from './gamePlay.findIt.pieces';
import { GamePlayFindItPackage } from './gamePlay.findIt.package';
import { PlayableManagerConfig } from '../../../framework/runtime/playable.manager.config';
import { PlayableManagerEvent } from '../../../framework/runtime/playable.manager.message';
import { GamePlayFindItPiece } from './gamePlay.findIt.piece';
import { PlayableManagerAudio } from '../../../framework/runtime/playable.manager.audio';
import { PlayableManagerInput } from '../../../framework/runtime/playable.manager.input';
const { ccclass, property } = _decorator;

@ccclass('GamePlayFindItLevel')
export class GamePlayFindItLevel extends PlayableGamePlayCore
{
    protected pieces: GamePlayFindItPieces
    protected package: GamePlayFindItPackage;
    protected failure: Node;

    private _onFindPieceBindEvent = this.onFindPiece.bind(this);
    protected override onLoad(): void
    {
        this.pieces = this.node.getComponentInChildren(GamePlayFindItPieces);
        this.package = this.node.getComponentInChildren(GamePlayFindItPackage);
        this.failure = this.node.getChildByName("failure");

        this.failure.active = false;
    }

    public override async onGameEnter(): Promise<void>
    {
        super.onGameEnter();

        const piecesSequence: number[] = PlayableManagerConfig.getInstance().settings.json.findIt.activePieces.map(Number);

        await this.pieces.init(piecesSequence);
        await this.package.init(this.pieces.PiecesJsonData.json.levelId, piecesSequence);

        PlayableManagerEvent.getInstance().on("onFindPiece", this._onFindPieceBindEvent);

        PlayableManagerEvent.getInstance().once("onSceneClick", () =>
        {
            this.onGameStart();
        })
    }

    protected override onSceneClick(node): void
    {
        super.onSceneClick(node);

        if (node && node.name == "pieces")
        {
            this.unscheduleAllCallbacks();
            this.failure.active = true;
            this.failure.worldPosition = this.pieces.lastDragInfo.CurrentWSPos;
            this.scheduleOnce(async () =>
            {
                this.failure.active = false;
    
            }, 1)
        }
    }

    public override async onGameStart(): Promise<void>
    {
        super.onGameStart();
    }

    public override onGameUpdate(deltaTime: number): void
    {
        super.onGameUpdate(deltaTime);
    }

    public override async onGameFinish(): Promise<void>
    {
        super.onGameFinish();
    }

    public override async onGameEnd(): Promise<void>
    {
        super.onGameEnd();

        PlayableManagerEvent.getInstance().off("onFindPiece", this._onFindPieceBindEvent);
    }

    public override async onGameOver(): Promise<void>
    {
        super.onGameOver();
    }

    protected async onFindPiece(piece: GamePlayFindItPiece): Promise<void>
    {
        await this.package.findPiece(piece);
        piece.node.active = false;
    }
}