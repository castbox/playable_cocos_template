import { Component, Tween, Vec3, _decorator, tween, Node } from "cc";
import { PlayableManagerEvent } from "../../runtime/playable.manager.message";
const { ccclass, property } = _decorator;

export enum FingerType
{
    Point,
    Drag
}

export class FingerTarget
{
    public FingerType: FingerType;
    public Targets: Node[] = [];
}

@ccclass("PlayableDynamicFinger")
export class PlayableDynamicFinger extends Component
{
    private fingers: FingerTarget[] = [];
    private _onResizeBindEvent = this.onResize.bind(this);

    public init()
    {
        this.node.active = false

        PlayableManagerEvent.getInstance().on("onCanvasResize", this._onResizeBindEvent);
    }

    public point(target: Node)
    {
        this.node.active = true;

        const fingerTgt = new FingerTarget();
        fingerTgt.FingerType = FingerType.Point;
        fingerTgt.Targets.push(target);
        this.fingers.push(fingerTgt);
        this.draw();

        return fingerTgt;
    }

    public drag(from: Node, to: Node)
    {
        this.node.active = true;

        const fingerTgt = new FingerTarget();
        fingerTgt.FingerType = FingerType.Drag;
        fingerTgt.Targets.push(from);
        fingerTgt.Targets.push(to);
        this.fingers.push(fingerTgt);
        this.draw();

        return fingerTgt;
    }

    public clear()
    {
        this.fingers = [];
        this.draw();
    }

    public hide()
    {
        this.clear();
        this.node.active = false;
    }

    public end()
    {
        this.clear();
        PlayableManagerEvent.getInstance().off("onCanvasResize", this._onResizeBindEvent);
    }

    private draw()
    {
        Tween.stopAllByTarget(this.node);
        this.fingers.forEach(finger =>
        {
            switch (finger.FingerType)
            {
                case FingerType.Point:
                    this.node.worldPosition = finger.Targets[0].getWorldPosition();
                    break;
                case FingerType.Drag:
                    this.node.worldPosition = finger.Targets[0].getWorldPosition();
                    tween(this.node)
                        .repeatForever(
                            tween()
                                .to(1.5, { worldPosition: finger.Targets[1].getWorldPosition() })
                                .to(0, { worldPosition: finger.Targets[0].getWorldPosition() })
                        )
                        .start();
                    break;
            }
        })
    }

    private onResize()
    {
        this.scheduleOnce(() =>
        {
            this.draw();
        }, 0.1);
    }
}