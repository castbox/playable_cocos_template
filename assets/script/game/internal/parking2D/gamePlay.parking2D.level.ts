import { _decorator, Vec3 } from "cc";
import { PlayableGamePlayCore } from "../../../framework/internal/gamePlay/playable.gamePlay.core";
import { GamePlayParking2DCar } from "./gamePlay.parking2D.car";
import { EScreenOrientation } from "../../../framework/runtime/playable.manager.core";
import { PlayableManagerScene2D } from "../../../framework/runtime/playable.manager.scene.2d";
import { PlayableManagerEvent } from "../../../framework/runtime/playable.manager.message";
import { PlayableManagerConfig } from "../../../framework/runtime/playable.manager.config";
const { ccclass, property } = _decorator;

@ccclass('GamePlayParking2DLevel')
export class GamePlayParking2DLevel extends PlayableGamePlayCore
{
    protected _cars: GamePlayParking2DCar[] = [];
    public get Cars(): GamePlayParking2DCar[]
    {
        return this._cars;
    }

    private _onCarClickBindEvent = this.onCarClick.bind(this);
    private _onAirWallHitBindEvent = this.onAirWallHit.bind(this);
    private _onCarHitBindEvent = this.onCarHit.bind(this);
    private _isMoving: boolean = false;
    private _stepCount: number = 0;

    protected override onLoad(): void
    {

    }

    public async onGameEnter(): Promise<void>
    {
        await super.onGameEnter();

        this._isMoving = false;
        PlayableManagerEvent.getInstance().once("onSceneClick", () =>
        {
            this.onGameStart();
        });

        this._cars = this.node.getComponentsInChildren(GamePlayParking2DCar);
        PlayableManagerEvent.getInstance().on("onCarClick", this._onCarClickBindEvent);
        PlayableManagerEvent.getInstance().on("onAirWallHit", this._onAirWallHitBindEvent);
        PlayableManagerEvent.getInstance().on("onCarHit", this._onCarHitBindEvent);
    }

    public async onGameStart(): Promise<void>
    {
        await super.onGameStart();
    }

    public async onGameFinish(): Promise<void>
    {
        await super.onGameFinish();

        PlayableManagerEvent.getInstance().off("onCarClick", this._onCarClickBindEvent);
        PlayableManagerEvent.getInstance().off("onAirWallHit", this._onAirWallHitBindEvent);
        PlayableManagerEvent.getInstance().off("onCarHit", this._onCarHitBindEvent);

        PlayableManagerEvent.getInstance().emit("onGameEnd");
    }

    public async onGameEnd(): Promise<void>
    {
        await super.onGameEnd();
    }

    public async onGameOver(): Promise<void>
    {
        await super.onGameOver();
    }

    protected onCarClick(car: GamePlayParking2DCar): void
    {
        if (this._isMoving)
        {
            return;
        }

        this._isMoving = true;
        car.moveByPath();
    }

    protected onAirWallHit(car: GamePlayParking2DCar): void
    {
        this._isMoving = false;
        if (car)
        {
            this._stepCount++;
            if (this._stepCount == PlayableManagerConfig.getInstance().settings.json.parking2D.move_step)
            {
                this.onGameFinish();
            }
        }
    }

    protected onCarHit(car: GamePlayParking2DCar): void
    {
        this.scheduleOnce(() =>
        {
            this._isMoving = false;
        }, 0.5);
    }

    protected onCarBeHit(car: GamePlayParking2DCar): void
    {

    }
}