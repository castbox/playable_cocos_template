import { _decorator, Component, Vec3, Node, Vec2, tween, Quat } from "cc";
import { PlayablePath } from "../path/playable.path";
const { ccclass, property } = _decorator;

export enum EEntityOrientation
{
    Up,
    Down,
    Left,
    Right,
}

@ccclass('PlayableEntity')
export class PlayableEntity extends Component
{
    @property(PlayablePath)
    public MovePath: PlayablePath;

    protected originPosition: Vec3;
    protected originEulerAngles: Vec3;

    protected velocity: Vec2;
    protected headDir: Vec2;
    protected movingDir: Vec2;
    protected model: Node;
    protected mass = 1;

    protected get forward(): Vec2 | Vec3
    {
        return null;
    }

    public get ColliderSize(): Vec3
    {
        return null
    }

    protected override onLoad(): void
    {
        this.model = this.node.children[0];

        this.originPosition = this.node.position.clone();
        this.originEulerAngles = this.node.eulerAngles.clone();
    }

    protected override update(dt: number): void
    {
        this.updateDirection(dt);
        this.updateMovement(dt);
    }

    protected move(delta: Vec2): void
    {

    }

    protected async onBeHit(entity: PlayableEntity): Promise<void>
    {

    }

    protected async onHit(entity: PlayableEntity): Promise<void>
    {

    }

    protected async applyImpulse(velocity: Vec3, duration: number): Promise<void>
    {

    }

    protected async moveByPath(): Promise<void>
    {

    }

    protected updateDirection(dt: number)
    {

    }

    protected updateMovement(dt: number)
    {

    }
}