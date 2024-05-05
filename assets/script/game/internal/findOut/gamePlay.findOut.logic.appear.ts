import { Material, Node, resources, sp, Sprite } from 'cc';
import { GamePlayFindOutLogic } from "./gamePlay.findOut.logic"
import { GamePlayFindOutSelectable } from './gamePlay.findOut.selectable';

export class GamePlayFindOutLogicAppear extends GamePlayFindOutLogic
{
    onEnter(root: Node)
    {
        resources.load("material/spine-gray", Material, (err, mat) =>
        {
            const spGrp = root.getComponentsInChildren(sp.Skeleton);

            for (let i = 0; i < spGrp.length; i++)
            {
                const sp = spGrp[i];
                sp.customMaterial = mat;
            }
        });

        resources.load("material/spine-gray-bg", Material, (err, mat) =>
        {
            root.getComponent(Sprite).customMaterial = mat;
        })
    }

    public onSelect(selectable: GamePlayFindOutSelectable)
    {
        selectable.Spine.customMaterial = resources.get("material/spine-normal", Material);

        console.log(selectable.name + "被选中")
    }
}