import { Component, UITransform, Vec2, _decorator } from "cc";
import { GamePlayPoker } from "./gamePlay.poker";
import { IGamePlayPokerContainer } from "./gamePlay.poker.container";
import { PlayableManagerEvent } from "../../../framework/runtime/playable.manager.message";
import { utility } from "../../../framework/utils/utility";
import { GamePlayPokerHoling } from "./gamePlay.poker.holding";
const { ccclass } = _decorator;

@ccclass("GamePlayPokerFoundation")
export class GamePlayPokerFoundation extends Component implements IGamePlayPokerContainer
{
    protected pokerStack: GamePlayPoker[] = []

    public get Last(): GamePlayPoker
    {
        if (this.pokerStack.length == 0)
        {
            return null
        }

        return this.pokerStack[this.pokerStack.length - 1];
    }

    public setIntractable(value: boolean): void
    {
        if (this.Last)
        {
            this.Last.Intractable = value;
        }
    }

    public get Count(): number
    {
        return this.pokerStack.length;
    }

    public moveOut(poker: GamePlayPoker): GamePlayPoker[]
    {
        let result = []
        for (let i = this.pokerStack.length - 1; i >= 0; i--)
        {
            const p = this.pokerStack.pop()
            result.push(p);

            if (p == poker)
            {
                break;
            }
        }

        return result.reverse();
    }

    public moveIn(poker: GamePlayPoker): void
    {
        if (poker.BelongsTo)
        {
            poker.BelongsTo.remove(poker)
        }

        poker.BelongsTo = this;
        utility.setParent(poker.node, this.node);
        this.pokerStack.push(poker);

        console.log("onPokerAddFoundation")
        PlayableManagerEvent.getInstance().emit("onPokerAddFoundation")

        if (this.checkIsComplete())
        {
            PlayableManagerEvent.getInstance().emit("onFoundationComplete", this);
        }
    }

    public check(holding: GamePlayPokerHoling): boolean
    {
        if (holding.Head == null)
        {
            return false;
        }

        return this.checkWithin(holding) && this.checkAdd(holding.Head);
    }

    public remove(poker: GamePlayPoker): void
    {
        PlayableManagerEvent.getInstance().emit("onPokerRemoveFoundation", this, poker);
    }

    public moveBack(poker: GamePlayPoker): void
    {
        utility.setParent(poker.node, this.node);
        this.pokerStack.push(poker);
        PlayableManagerEvent.getInstance().emit("onPokerAddFoundation")
    }

    public checkWithin(holding: GamePlayPokerHoling): boolean
    {
        const rect = this.node.getComponent(UITransform).getBoundingBoxToWorld();
        return rect.contains(new Vec2(holding.node.worldPosition.x, holding.node.worldPosition.y));
    }

    public checkAdd(poker: GamePlayPoker): boolean
    {
        return true;
    }

    protected checkIsComplete(): boolean
    {
        return true;
    }
}