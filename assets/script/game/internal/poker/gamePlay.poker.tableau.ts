import { _decorator, Component, Layout, Node, Sprite, UITransform, Vec2, Vec3 } from 'cc';
import { ECardSuit, GamePlayPoker } from './gamePlay.poker';
import { GamePlayPokerHoling } from './gamePlay.poker.holding';
import { PlayableManagerEvent } from '../../../framework/runtime/playable.manager.message';
import { IGamePlayPokerContainer } from './gamePlay.poker.container';
import { utility } from '../../../framework/utils/utility';
import { PlayableManagerAudio } from '../../../framework/runtime/playable.manager.audio';
const { ccclass, property } = _decorator;

@ccclass('GamePlayPokerTableau')
export class GamePlayPokerTableau extends Component implements IGamePlayPokerContainer
{
    private _root: Node;
    private _layout: Layout;
    private _offsetY: number = 0;

    protected pokerStack: GamePlayPoker[];

    public get LastPos_world(): Vec3
    {
        return this.node.getComponent(UITransform).convertToWorldSpaceAR(new Vec3(0, -(this.pokerStack.length * this._offsetY), 0));
    }

    public get Head()
    {
        if (this.pokerStack.length == 0)
        {
            return null
        }

        return this.pokerStack[0];
    }

    public get Last(): GamePlayPoker
    {
        if (this.pokerStack.length == 0)
        {
            return null
        }

        return this.pokerStack[this.pokerStack.length - 1];
    }

    public get Count(): number
    {
        return this.pokerStack.length;
    }

    public setIntractable(value: boolean)
    {
        this.pokerStack.forEach((poker) =>
        {
            poker.Intractable = value;
        });
    }

    protected onLoad(): void
    {
        this._root = this.node.getChildByName("root");
        this.pokerStack = this.node.getComponentsInChildren(GamePlayPoker);
        this.pokerStack.forEach((poker) => { poker.BelongsTo = this; });
        this._layout = this._root.getComponent(Layout);
        this._offsetY = this.getComponent(Sprite).node.getComponent(UITransform).contentSize.y + this._layout.spacingY;
    }

    protected start()
    {

    }

    protected update(deltaTime: number)
    {

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

    public check(holding: GamePlayPokerHoling): boolean
    {
        if (holding.Head == null)
        {
            return false;
        }

        return this.checkWithin(holding) && this.checkAdd(holding.Head);
    }

    public moveIn(poker: GamePlayPoker)
    {
        if (poker.BelongsTo)
        {
            poker.BelongsTo.remove(poker)
        }

        poker.BelongsTo = this;
        utility.setParent(poker.node, this._root);
        this.pokerStack.push(poker);
        PlayableManagerEvent.getInstance().emit("onPokerAddTableau", this, poker);
        PlayableManagerAudio.getInstance().playSFX("flip")

        if (this.checkIsComplete())
        {
            PlayableManagerEvent.getInstance().emit("onTableauComplete", this);
        }
    }

    public moveBack(poker: GamePlayPoker)
    {
        utility.setParent(poker.node, this._root);
        this.pokerStack.push(poker);
        PlayableManagerEvent.getInstance().emit("onPokerBackTableau", this, poker);
    }

    public remove(poker: GamePlayPoker)
    {
        PlayableManagerEvent.getInstance().emit("onPokerRemoveTableau", this, poker);
    }

    public contains(poker: GamePlayPoker): boolean
    {
        return this.pokerStack.indexOf(poker) >= 0;
    }

    public checkWithin(holding: GamePlayPokerHoling): boolean
    {
        const rect = this.node.getComponent(UITransform).getBoundingBoxToWorld();
        rect.yMin = 0;
        let isWithin = rect.contains(new Vec2(holding.node.worldPosition.x, holding.node.worldPosition.y));
        return isWithin;
    }

    public checkAdd(poker: GamePlayPoker): boolean
    {
        console.log("check add " + this.node.name)

        return true;
    }

    protected checkIsComplete(): boolean
    {
        return true;
    }
}

