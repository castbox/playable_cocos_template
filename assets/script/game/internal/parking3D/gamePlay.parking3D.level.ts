import { _decorator } from "cc";
import { PlayableGamePlayCore } from "../../../framework/internal/gamePlay/playable.gamePlay.core";
import { GamePlayParking3DCar } from "./gamePlay.parking3D.car";
import { PlayableManagerInput } from "../../../framework/runtime/playable.manager.input";
import { PlayableManagerEvent } from "../../../framework/runtime/playable.manager.message";
import { GamePlayParking3DRoad } from "./gamePlay.parking3D.road";
const { ccclass, property } = _decorator;

@ccclass('GamePlayParking3DLevel')
export class GamePlayParking3DLevel extends PlayableGamePlayCore
{
    @property({ type: [GamePlayParking3DRoad] })
    public SequenceRoads: GamePlayParking3DRoad[] = [];
        
    private _onSceneTouchMoveBindEvent = this.onSceneTouchMove.bind(this);
    private _onSceneTouchStartBindEvent = this.onSceneTouchStart.bind(this);
    private _onTouchEndBindEvent = this.onTouchEnd.bind(this);

    protected cars : GamePlayParking3DCar[] = [];
    protected car : GamePlayParking3DCar;

    public override async onGameEnter(): Promise<void>
    {
        super.onGameEnter();

        this.cars = this.node.getComponentsInChildren(GamePlayParking3DCar);

        PlayableManagerEvent.getInstance().on("onSceneTouchStart", this._onSceneTouchStartBindEvent);
        PlayableManagerEvent.getInstance().on("onSceneTouchMove", this._onSceneTouchMoveBindEvent);
        PlayableManagerEvent.getInstance().on("onSceneTouchEnd", this._onTouchEndBindEvent);
        PlayableManagerEvent.getInstance().on("onSceneTouchCancel", this._onTouchEndBindEvent);
        PlayableManagerEvent.getInstance().once("OnSceneClick", this.onGameStart.bind(this));
    }

    public override async onGameStart(): Promise<void>
    {
        super.onGameStart();
    }

    public override onGameUpdate(deltaTime: number)
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

        PlayableManagerEvent.getInstance().off("onSceneTouchStart", this._onSceneTouchStartBindEvent);
        PlayableManagerEvent.getInstance().off("onSceneTouchMove", this._onSceneTouchMoveBindEvent);
        PlayableManagerEvent.getInstance().off("onSceneTouchEnd", this._onTouchEndBindEvent);
        PlayableManagerEvent.getInstance().off("onSceneTouchCancel", this._onTouchEndBindEvent);
    }

    public override async onGameOver(): Promise<void>
    {
        super.onGameOver();
    }

    protected onSceneTouchStart(): void
    {
        this.car = PlayableManagerInput.getInstance().getLastTouchObj(GamePlayParking3DCar);
    }
    
    protected onSceneTouchMove(): void
    {
        if (this.car)
        {
            this.car.move(PlayableManagerInput.getInstance().LastTouchData.OffSetScreen);
            this.car = null;
        }
    }

    protected onTouchEnd(): void
    {
        this.car = null;
    }

    protected onCarLeaving(car: GamePlayParking3DCar)
    {
        this.cars.splice(this.cars.indexOf(car), 1);

        if (this.cars.length === 0)
        {
            this.onGameFinish();
        }
    }
}