import { Node } from 'cc';
import { PlayableManagerEvent } from '../../../framework/runtime/playable.manager.message';
import { GamePlayFindOutSelectable } from './gamePlay.findOut.selectable';

export class GamePlayFindOutLogic
{
    protected onSelectBindEvent = this.onSelect.bind(this);

    public onEnter(root: Node)
    {
        
    }

    public onSelect(selectable: GamePlayFindOutSelectable) { }

    public onEnd()
    {
    
    }
}