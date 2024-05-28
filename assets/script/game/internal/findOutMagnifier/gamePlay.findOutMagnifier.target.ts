import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass('GamePlayFindOutMagnifierTarget')
export class GamePlayFindOutMagnifierTarget extends Component
{
    @property(Node)
    public Node_TargetDiff: Node = null;
}