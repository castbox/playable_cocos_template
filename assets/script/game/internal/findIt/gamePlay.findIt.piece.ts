import { _decorator, Component } from "cc";
import { PlayableManagerEvent } from "../../../framework/runtime/playable.manager.message";
const { ccclass, property } = _decorator;

@ccclass("GamePlayFindItPiece")
export class GamePlayFindItPiece extends Component 
{
    protected index: number = 0;
    public get Index(): number
    {
        return this.index;
    }
    public set Index(value: number)
    {
        this.index = value;
    }

    public onClick()
    {
        PlayableManagerEvent.getInstance().emit("onFindPiece", this);
        PlayableManagerEvent.getInstance().emit("onSceneClick", this.node)
    }
}