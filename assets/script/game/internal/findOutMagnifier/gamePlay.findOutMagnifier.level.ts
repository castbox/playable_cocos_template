import { _decorator, RenderTexture, Node, game } from "cc";
import { GamePlayFindOutMagnifierMagnifier } from "./gamePlay.findOutMagnifier.magnifier";
import { PlayableGamePlayCore } from "../../../framework/internal/gamePlay/playable.gamePlay.core";
import { PlayableManagerEvent } from "../../../framework/runtime/playable.manager.message";
import { PlayableManagerVFX } from "../../../framework/runtime/playable.manager.vfx";
import { GamePlayFindOutMagnifierTarget } from "./gamePlay.findOutMagnifier.target";
const { ccclass, property } = _decorator;

@ccclass('GamePlayFindOutMagnifierLevel')
export class GamePlayFindOutMagnifierLevel extends PlayableGamePlayCore
{
    protected nodeList_target: GamePlayFindOutMagnifierTarget[] = [];

    protected magnifier: GamePlayFindOutMagnifierMagnifier;
    public get Magnifier(): GamePlayFindOutMagnifierMagnifier
    {
        return this.magnifier;
    }

    public override async onGameEnter(): Promise<void>
    {
        await super.onGameEnter();

        this.magnifier.patrol();
        PlayableManagerEvent.getInstance().once_any(() =>
        {
            this.onGameStart();
        }, "onSceneClick", "onSceneTouchMove");
    }

    public override async onGameStart(): Promise<void>
    {
        await super.onGameStart();

        this.magnifier.stopPatrol();
    }

    public override onGameUpdate(deltaTime: number): void
    {
        super.onGameUpdate(deltaTime);

        for (let i = 0; i < this.nodeList_target.length; i++)
        {
            const target = this.nodeList_target[i];
            if (this.magnifier.isInView(target))
            {
                this.nodeList_target = this.nodeList_target.filter((item) => item !== target);
                PlayableManagerEvent.getInstance().emit("onFindOut", target);

                this.processFindOut(target);
            }
        }
    }

    private async processFindOut(target: GamePlayFindOutMagnifierTarget): Promise<void>
    {
        await this.magnifier.findOut(target);

        PlayableManagerVFX.getInstance().playEffectAtWsPosition("effect", target.node.getWorldPosition());
        PlayableManagerVFX.getInstance().playEffectAtWsPosition("poof", target.node.getWorldPosition());

        target.node.active = false;
        target.Node_TargetDiff.active = false;
    }

    public override async onGameOver(): Promise<void>
    {
        await super.onGameOver();
    }

    protected override onLoad(): void
    {
        this.magnifier = this.node.getComponentInChildren(GamePlayFindOutMagnifierMagnifier);
        this.nodeList_target = this.node.getComponentsInChildren(GamePlayFindOutMagnifierTarget);
    }
}