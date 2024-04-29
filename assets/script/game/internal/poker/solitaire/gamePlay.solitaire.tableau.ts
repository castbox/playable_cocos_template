import { _decorator } from 'cc';
import { GamePlayPoker } from '../gamePlay.poker';
import { GamePlayPokerTableau } from '../gamePlay.poker.tableau';
const { ccclass, property } = _decorator;

@ccclass('GamePlaySolitaireTableau')
export class GamePlaySolitaireTableau extends GamePlayPokerTableau
{
    public get OpenList(): GamePlayPoker[]
    {
        let result: GamePlayPoker[] = []
        this.pokerStack.forEach((poker) =>
        {
            if (poker.FaceOn)
            {
                result.push(poker);
            }
        })
        return result;
    }

    public override get Head(): GamePlayPoker
    {
        if (this.OpenList.length == 0)
        {
            return null;
        }
        return this.OpenList[0]
    }

    public override setIntractable(value: boolean): void
    {
        this.OpenList.forEach((poker) =>
        {
            poker.Intractable = value
        })
    }

    public override checkAdd(poker: GamePlayPoker): boolean
    {
        if (this.Last == null) 
        {
            return true;
        }

        return this.Last.Rank == poker.Rank + 1 && this.Last.isAlternateColor(poker.Suit);
    }

    public override checkIsComplete(): boolean
    {
        return false
    }

    public override remove(poker: GamePlayPoker): void
    {
        super.remove(poker);

        this.refresh();
    }

    public async refresh()
    {
        if (this.OpenList.length > 0)
        {
            return;
        }

        if (this.Last == null)
        {
            return;
        }

        this.Last.Intractable = true;
        if (!this.Last.FaceOn)
        {
            await this.Last.Flip(false);
        }
    }
}   