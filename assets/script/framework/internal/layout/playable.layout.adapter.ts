import { _decorator, Canvas, CCString, Component, find, Node, ResolutionPolicy, view } from 'cc';
import SingletonComponent from '../../utils/singletonOf.component';
import { ELayoutType, PlayableLayoutNode } from './playable.layout.node';
import { utility } from '../../utils/utility';
const { ccclass, property } = _decorator;

@ccclass('PlayableLayoutAdapter')
export class PlayableLayoutAdapter extends SingletonComponent<PlayableLayoutAdapter>
{
    private _nodes : PlayableLayoutNode[] = []

    public createLayout(type: ELayoutType, spacing : number, parent: PlayableLayoutNode = null): PlayableLayoutNode
    {
        let layout = utility.createNode(PlayableLayoutNode, "Layout", parent ? parent.node : this.node);
        layout.init(type, spacing);

        this._nodes.push(layout)
        return layout
    }

    public clear()
    {
        this._nodes.forEach(node => node.release())
        this._nodes.forEach(node => node.node.destroy())
        this._nodes = []
    }
}