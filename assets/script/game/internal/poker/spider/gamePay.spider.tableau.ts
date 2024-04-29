import { _decorator} from 'cc';
import { GamePlayPoker } from '../gamePlay.poker';
import { GamePlayPokerTableau } from '../gamePlay.poker.tableau';
const { ccclass, property } = _decorator;

@ccclass('GamePlaySpiderTableau')
export class GamePlaySpiderTableau extends GamePlayPokerTableau
{
    public override checkAdd(poker: GamePlayPoker): boolean
    {
        if (this.Last == null) 
        {
            return true;
        }

        return this.Last.Rank == poker.Rank + 1;
    }

    public override checkIsComplete(): boolean
    {
        return this.pokerStack.length == 13
    }
}

