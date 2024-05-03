import { Vec3, tween } from "cc";
import { PlayableGamePlayCore } from "../../../framework/internal/gamePlay/playable.gamePlay.core";
import { PlayableManagerEvent } from "../../../framework/runtime/playable.manager.message";
import { GamePlayBallSortBall } from "./gamePlay.ballSort.ball";
import { GamePlayBallSortBottle } from "./gamePlay.ballSort.bottle";
import { PlayableManagerConfig } from "../../../framework/runtime/playable.manager.config";

export class GamePlayBallSortLevel extends PlayableGamePlayCore
{
    private _onBottleClickBindEvent = this.onBottleClick.bind(this);

    private _bottles: GamePlayBallSortBottle[] = [];
    private _activeBall: GamePlayBallSortBall;
    private _isMoving: boolean;

    public get ActiveBall(): GamePlayBallSortBall
    {
        return this._activeBall;
    }

    public get Bottles(): GamePlayBallSortBottle[]
    {
        return this._bottles;
    }

    public get EmptyBottle(): GamePlayBallSortBottle
    {
        for (let index = 0; index < this._bottles.length; index++)
        {
            const bottle = this._bottles[index];
            if (bottle.IsEmpty)
            {
                return bottle;
            }
        }
    }

    protected override onLoad(): void
    {
        this._bottles = this.node.getChildByName("bottles").getComponentsInChildren(GamePlayBallSortBottle);
    }

    public override async onEnter()
    {
        super.onEnter();

        PlayableManagerEvent.getInstance().on("onBottleClick", this._onBottleClickBindEvent);
    }

    public override onGameStart(): void
    {
        super.onGameStart();

        this._isMoving = false;
    }

    public override onUpdate(deltaTime: number)
    {
        super.onUpdate(deltaTime);
    }

    public override onGameEnd()
    {
        super.onGameEnd();

        PlayableManagerEvent.getInstance().off("onBottleClick", this._onBottleClickBindEvent);
    }

    public override onGameOver()
    {
        super.onGameOver();
    }

    protected async onBottleClick(bottle: GamePlayBallSortBottle)
    {
        if (this._isMoving)
        {
            return;
        }

        this._isMoving = true;

        if (this._activeBall != null)
        {
            if (bottle.checkAdd(this._activeBall))
            {
                const preBottle = this._activeBall.BelongsTo;

                await this.moveToBottle(this._activeBall, bottle)
                await bottle.moveIn(this._activeBall);
                preBottle.spawnBall();
            }
            else
            {
                await this._activeBall.BelongsTo.moveBack(this._activeBall);
            }

            this._activeBall = null;
        }
        else
        {
            if (!bottle.IsEmpty)
            {
                this._activeBall = await bottle.moveOut();
            }
        }

        this._isMoving = false;
    }

    private async moveToBottle(ball: GamePlayBallSortBall, bottle: GamePlayBallSortBottle)
    {
        return new Promise<GamePlayBallSortBall>((resolve, reject) =>
        {
            const time = Vec3.distance(ball.node.worldPosition, bottle.TopPos_world) / PlayableManagerConfig.getInstance().settings.json.ballSort.move_speed;
            tween(ball.node).to(time, { worldPosition: bottle.TopPos_world }).call(() =>
            {
                resolve(ball);
            }).start();
        });
    }
}