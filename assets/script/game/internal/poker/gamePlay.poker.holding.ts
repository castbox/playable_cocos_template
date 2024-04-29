import { _decorator, Component, Layout, Vec3 } from 'cc';
import { GamePlayPoker } from './gamePlay.poker';
import { GamePlaySpiderTableau } from './spider/gamePay.spider.tableau';
import { utility } from '../../../framework/utils/utility';
import { IGamePlayPokerContainer } from './gamePlay.poker.container';
const { ccclass, property } = _decorator;

@ccclass('GamePlayPokerHoling')
export class GamePlayPokerHoling extends Component
{
    private _layout: Layout
    private _holdingList: GamePlayPoker[] = [];

    public get Head(): GamePlayPoker
    {
        if (0 == this._holdingList.length)
        {
            return null;
        }

        return this._holdingList[0];
    }

    protected onLoad(): void
    {
        this._layout = this.node.getComponent(Layout);
    }

    public pickUp(holdingList: GamePlayPoker[], worldPos: Vec3)
    {
        this.node.setWorldPosition(worldPos);

        this._holdingList = holdingList;
        this._holdingList.forEach((poker) => 
        {
            utility.setParent(poker.node, this.node);
        });
        this._layout.updateLayout();
    }

    public hold(worldPos: Vec3)
    {
        utility.setNodeWorldPositionToTarget(this.node, worldPos);
    }

    public drop(container: IGamePlayPokerContainer = null)
    {
        if (this._holdingList.length > 0)
        {
            this._holdingList.forEach((poker) =>
            {
                container.moveIn(poker)
            });
            this._holdingList = [];
        }
    }

    public back()
    {
        if (this._holdingList.length > 0)
        {
            this._holdingList.forEach((poker) =>
            {
                poker.BelongTo.moveBack(poker);
            })
            this.Head.shake()
            this._holdingList = [];
        }
    }
}