import { _decorator, Component, Node } from "cc";
const { ccclass, executeInEditMode, property } = _decorator;

@ccclass('PlayableBezier2D')
export class PlayablePath extends Component
{
    public async move(target: Node, speed: number): Promise<void>
    {
        
    }

    public pause(): void
    {
        
    }

    public stop(): void
    {

    }
}