import { Component, Tween, Vec3, _decorator, tween } from "cc";
const { ccclass, property } = _decorator;

@ccclass("PlayableDynamicFinger")
export class PlayableDynamicFinger extends Component
{
    public init()
    {
        this.node.active = false
    }

    public point(wsPos: Vec3)
    {
        this.node.active = true
        this.node.worldPosition = wsPos
    }

    public drag(fromWsPos: Vec3, toWsPos: Vec3)
    {
        Tween.stopAllByTarget(this.node)
        this.node.active = true

        this.node.worldPosition = fromWsPos

        tween(this.node)
            .repeatForever(
                tween()
                    .to(1.5, { worldPosition: toWsPos })
                    .to(0, { worldPosition: fromWsPos })
            )
            .start();
    }

    public hide()
    {
        this.node.active = false
        Tween.stopAllByTarget(this.node)
    }

    public clear()
    {
        Tween.stopAllByTarget(this.node)
    }
}