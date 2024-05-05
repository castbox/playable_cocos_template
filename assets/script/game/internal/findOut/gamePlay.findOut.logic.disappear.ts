import { Node} from 'cc';
import { GamePlayFindOutLogic } from "./gamePlay.findOut.logic"
import { GamePlayFindOutSelectable } from './gamePlay.findOut.selectable';

export class GamePlayFindOutLogicDisappear extends GamePlayFindOutLogic
{
    onEnter()
    {
        
    }

    public onSelect(selectable: GamePlayFindOutSelectable)
    {
        selectable.node.active = false;
    }
}