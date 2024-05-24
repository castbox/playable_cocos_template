import { _decorator, Collider2D, Contact2DType, director, IPhysics2DContact, Mat4, RigidBody2D, tween, Vec2, Vec3 } from "cc";
import { PlayableEntity } from "./playable.entity";
const { ccclass, property } = _decorator;

@ccclass('PlayableEntity2D')
export class PlayableEntity2D extends PlayableEntity
{
    protected collider: Collider2D;
    protected rigidBody: RigidBody2D;
    private _onBeginContactBindEvent = this.onBeginContact.bind(this);

    protected override get forward(): Vec3
    {
        return this.node.right;
    }

    protected override onLoad(): void
    {
        super.onLoad();
        this.collider = this.getComponentInChildren(Collider2D);
        this.rigidBody = this.getComponentInChildren(RigidBody2D);

        if (this.collider)
        {
            this.collider.on(Contact2DType.BEGIN_CONTACT, this._onBeginContactBindEvent);
        }
    }

    protected override onDestroy(): void
    {
        super.onDestroy();

        if (this.collider)
        {
            this.collider.off(Contact2DType.BEGIN_CONTACT, this._onBeginContactBindEvent);
        }
    }

    protected async onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact): Promise<void>
    {

    }

    protected override async applyImpulse(velocity: Vec3, duration: number): Promise<void>
    {
        return new Promise<void>((resolve) =>
        {
            const impulse = new Vec2(velocity.x * this.mass, velocity.y * this.mass);
            const targetPosition = this.node.position.clone().add(new Vec3(impulse.x, impulse.y));
            tween(this.node).to(duration, { position: targetPosition }).call(() =>
            {
                resolve();
            }).start();
        })
    }
}