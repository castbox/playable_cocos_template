import { _decorator, Component, Vec3, Node, Vec2 } from "cc";
const { ccclass, property } = _decorator;

export enum EEntityDirection
{
    Up,
    Down,
    Left,
    Right,
}

@ccclass('PlayableEntity')
export class PlayableEntity extends Component
{
    protected headDir: EEntityDirection;
    protected movingDir: EEntityDirection;
    protected model: Node;

    public get HeadDir(): EEntityDirection
    {
        return this.headDir;
    }

    public get MovingDir(): EEntityDirection
    {
        return this.headDir;
    }

    public get ColliderSize(): Vec3
    {
        return null
    }

    protected override onLoad(): void
    {
        this.model = this.node.children[0];
    }

    protected override update(dt: number): void
    {
        this.updateDirection(dt);
        this.updateMovement(dt);
    }

    protected onHit(entity: PlayableEntity): void
    {

    }

    protected hit(entity: PlayableEntity): void
    {

    }

    protected move(delta: Vec2): void
    {

    }

    protected updateDirection(dt : number)
    {
        
    }

    protected updateMovement(dt : number)
    {

    }
}