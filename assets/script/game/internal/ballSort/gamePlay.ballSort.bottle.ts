import { _decorator, Component, Layout, math, Node, Sprite, Tween, tween, UITransform, Vec3 } from 'cc';
import { GamePlayBallSortBall } from './gamePlay.ballSort.ball';
import { PlayableManagerEvent } from '../../../framework/runtime/playable.manager.message';
import { PlayableManagerConfig } from '../../../framework/runtime/playable.manager.config';
import { utility } from '../../../framework/utils/utility';
const { ccclass, property } = _decorator;

@ccclass('GamePlayBallSortBottle')
export class GamePlayBallSortBottle extends Component
{
    protected ballStack: GamePlayBallSortBall[] = []

    private _node_root: Node = null;
    private _offsetY: number = 0;
    private _node_top: Node = null;

    public get LastPos_world(): Vec3
    {
        return this._node_root.getComponent(UITransform).convertToWorldSpaceAR(new Vec3(0, this.ballStack.length * this._offsetY));
    }

    public get TopPos_world(): Vec3
    {
        return this._node_top.worldPosition;
    }

    public get Last(): GamePlayBallSortBall
    {
        return this.ballStack[this.ballStack.length - 1];
    }

    public get IsFull(): boolean
    {
        return this.ballStack.length >= PlayableManagerConfig.getInstance().settings.json.ballSort.max_stack;
    }

    public get IsEmpty(): boolean
    {
        return this.ballStack.length == 0;
    }

    protected onLoad(): void
    {
        this.ballStack = this.node.getComponentsInChildren(GamePlayBallSortBall);
        this.ballStack.forEach(ball => { ball.BelongsTo = this; })

        this._node_top = this.node.getChildByName("top");

        this._node_root = this.node.getChildByName("root");
        this._offsetY = this.node.getChildByName("bg").getComponent(UITransform).contentSize.x;
    }

    protected override start()
    {

    }

    protected override update(deltaTime: number)
    {

    }

    public checkAdd(ball: GamePlayBallSortBall): boolean
    {
        return !this.IsFull && (this.Last == null || (this.Last.Known && this.Last.Color == ball.Color));
    }

    public async moveIn(ball: GamePlayBallSortBall) 
    {
        return new Promise<void>((resolve, reject) =>
        {
            Tween.stopAllByTarget(this.node)

            const moveTime = Vec3.distance(this.TopPos_world, this.LastPos_world) / PlayableManagerConfig.getInstance().settings.json.ballSort.move_speed;
            tween(ball.node).
                to(moveTime, { worldPosition: this.LastPos_world }, { easing: 'bounceOut' }).
                call(() =>
                {
                    this.ballStack.push(ball);
                    ball.BelongsTo = this;
                    utility.setParent(ball.node, this._node_root, true);

                    PlayableManagerEvent.getInstance().emit("onBallMoveIn", ball);

                    resolve()
                }).start()
        });
    }

    public async moveBack(ball: GamePlayBallSortBall): Promise<void>
    {
        return new Promise<void>((resolve, reject) =>
        {
            Tween.stopAllByTarget(this.node)

            const moveTime = Vec3.distance(this.TopPos_world, this.LastPos_world) / PlayableManagerConfig.getInstance().settings.json.ballSort.move_speed;
            tween(ball.node).
                to(moveTime, { worldPosition: this.LastPos_world }, { easing: 'bounceOut' }).
                call(() =>
                {
                    this.ballStack.push(ball)

                    PlayableManagerEvent.getInstance().emit("onBallMoveBack", ball);

                    resolve()
                }).start()
        });
    }

    public spawnBall()
    {
        if (this.Last != null)
        {
            this.Last.setKnown(true);
        }
    }

    public async moveOut(): Promise<GamePlayBallSortBall>
    {
        return new Promise<GamePlayBallSortBall>((resolve, reject) =>
        {
            Tween.stopAllByTarget(this.node)

            const ball = this.ballStack.pop();
            const moveTime = Vec3.distance(ball.node.worldPosition, this.TopPos_world) / PlayableManagerConfig.getInstance().settings.json.ballSort.move_speed;

            const offset1 = this.TopPos_world.clone().add(new Vec3(0, 10, 0))
            const offset2 = this.TopPos_world.clone().subtract(new Vec3(0, 10, 0))

            tween(ball.node).
                to(moveTime, { worldPosition: this.TopPos_world }, { easing: 'bounceOut' }).
                to(0.05, { worldPosition: offset1 }, { easing: 'bounceOut' }).
                to(0.05, { worldPosition: this.TopPos_world }, { easing: 'bounceOut' }).
                to(0.05, { worldPosition: offset2 }, { easing: 'bounceOut' }).
                to(0.05, { worldPosition: this.TopPos_world }, { easing: 'bounceOut' }).
                call(() =>
                {
                    console.log("ball move out")

                    PlayableManagerEvent.getInstance().emit("onBallMoveOut", ball);

                    resolve(ball)
                }).start()
        });
    }

    protected onClick()
    {
        PlayableManagerEvent.getInstance().emit("onBottleClick", this)

        PlayableManagerEvent.getInstance().emit("onSceneClick", this.node)
    }
}

