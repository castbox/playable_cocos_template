import { _decorator } from "cc";
import { GamePlayPoker } from "../gamePlay.poker";
import { GamePlayPokerFoundation } from "../gamePlay.poker.foundation";
const { ccclass } = _decorator;

@ccclass("GamePlaySolitaireFoundation")
export class GamePlaySolitaireFoundation extends GamePlayPokerFoundation
{
    protected override checkIsComplete(): boolean
    {
        if (this.pokerStack.length == 13)
        {
            return true;
        }
        return false;
    }

    public override checkAdd(poker: GamePlayPoker): boolean
    {
        if (this.Last == null)
        {
            if (poker.Rank == 1)
            {
                return true;
            }
        }
        else
        {
            return this.Last.Rank == poker.Rank - 1 && this.Last.Suit == poker.Suit;
        }
    }
}