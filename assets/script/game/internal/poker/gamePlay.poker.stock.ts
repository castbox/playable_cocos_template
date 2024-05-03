import { Component, Layout, _decorator, Node, tween } from "cc";
import { GamePlayPoker } from "./gamePlay.poker";
import { PlayableManagerConfig } from "../../../framework/runtime/playable.manager.config";
import { utility } from "../../../framework/utils/utility";
import { IGamePlayPokerContainer } from "./gamePlay.poker.container";
import { PlayableManagerEvent } from "../../../framework/runtime/playable.manager.message";
const { ccclass, property } = _decorator;

@ccclass("GamePlayPokerStock")
export class GamePlayPokerStock extends Component implements IGamePlayPokerContainer
{
    @property(Node)
    public WasteNode: Node = null
    @property({ type: [Node] })
    public WasteNodePosList: Node[] = []
    @property(Node)
    public StockNode: Node = null

    private _active: boolean = false
    private _stock: GamePlayPoker[]
    private _waste: GamePlayPoker[]
    private _top: GamePlayPoker
    private _isRecycling: boolean = false

    public get Top(): GamePlayPoker
    {
        return this._top
    }

    protected onLoad(): void
    {
        this._stock = this.StockNode.getComponentsInChildren(GamePlayPoker)
        this._stock.forEach((poker) =>
        {
            poker.Intractable = false
        })
        this._waste = []
    }

    public moveIn(poker: GamePlayPoker): void
    {
        poker.BelongsTo = this;
        utility.setParent(poker.node, this.StockNode)
        this._stock.push(poker);
    }

    public moveBack(poker: GamePlayPoker): void
    {
        this._waste.push(poker)
        utility.setParent(poker.node, this.WasteNode)
        poker.node.setWorldPosition(this.WasteNodePosList[this.WasteNodePosList.length - 1].worldPosition)
    }

    public moveOut(): GamePlayPoker[]
    {
        const result: GamePlayPoker[] = []
        result.push(this._waste.pop())

        return result
    }

    public remove(poker: GamePlayPoker): void
    {
        PlayableManagerEvent.getInstance().emit("onPokerRemoveStock", poker)

        this.refresh()
    }

    public setIntractable(value: boolean)
    {
        this._active = value
    }

    public onClick()
    {
        if (!this._active)
        {
            return;
        }

        PlayableManagerEvent.getInstance().emit("onStockClick", this)

        if (this._isRecycling)
        {
            return;
        }

        if (this._stock.length > 0)
        {
            this.open()
        }
        else
        {
            this.recycle()
        }
    }

    private open()
    {
        const openPoker = this._stock.pop()
        this._waste.push(openPoker)

        utility.setParent(openPoker.node, this.WasteNode, true)
        openPoker.Flip(false)
        this.refresh()

        this.scheduleOnce(() =>
        {
            PlayableManagerEvent.getInstance().emit("onStockOpen", this._top)
        }, 0)

    }

    private refresh()
    {
        let posToken = this.WasteNodePosList.length;
        for (let i = this._waste.length - 1; i >= 0; i--)
        {
            const poker = this._waste[i]
            poker.Intractable = false;
            posToken--;
            if (posToken >= 0)
            {
                const tweenTm = PlayableManagerConfig.getInstance().settings.json.poker.flip_time;
                tween(poker.node).to(tweenTm, { worldPosition: this.WasteNodePosList[posToken].getWorldPosition() }).start()
            }
        }

        this._top = this._waste[this._waste.length - 1];
        if (this._top)
        {
            this._top.Intractable = true
        }
    }

    private async recycle()
    {
        this._isRecycling = true;

        const move = (closePoker: GamePlayPoker): Promise<void> =>
        {
            return new Promise((resolve, reject) =>
            {
                const tweenTm = PlayableManagerConfig.getInstance().settings.json.poker.flip_time;
                tween(closePoker.node).to(tweenTm, { worldPosition: this.StockNode.getWorldPosition() }).call(() =>
                {
                    resolve()
                }).start()
            })
        }

        let count = 0;
        while (this._waste.length > 0)
        {
            // close
            const poker = this._waste.pop()
            this._stock.push(poker)
            utility.setParent(poker.node, this.StockNode, true)
            poker.Intractable = false

            move(poker)
            poker.Flip(false)
            count++;

            await utility.sleep(0.05)
        }

        this._isRecycling = false;
    }
}