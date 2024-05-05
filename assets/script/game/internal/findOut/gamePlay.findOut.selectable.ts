import { _decorator, CCBoolean, Component, sp, } from 'cc';
import { PlayableManagerEvent } from '../../../framework/runtime/playable.manager.message';
const { ccclass, property } = _decorator;

@ccclass("GamePlayFindOutSelectable")
export class GamePlayFindOutSelectable extends Component
{
    @property(
        {
            displayName: "是否可以被选中",
            tooltip: "如果设置可以被选中, 那么当点击时会触发onSelect事件"
        })
    public CanSelected: boolean = false;
    @property(
        {
            displayName: "游戏开始时是否用于Mask定位",
            tooltip: "游戏开始时第一个WillMask为true的Selectable节点会被用于Mask定位"
        }
    )
    public WillMask: boolean = false;

    private _spine: sp.Skeleton = null;
    public get Spine(): sp.Skeleton
    {
        if (this._spine == null)
        {
            this._spine = this.node.getComponent(sp.Skeleton);
        }
        return this._spine;
    }

    public onSelect()
    {
        PlayableManagerEvent.getInstance().emit("onSceneClick", this.node);

        if (this.CanSelected)
        {
            PlayableManagerEvent.getInstance().emit("onSelect", this.node);
        }

        // 点击过后不可再点击
        this.CanSelected = false;
    }
}
