import { _decorator, Vec3, ParticleSystem2D, Animation, Node } from 'cc';
import SingletonComponent from '../utils/singletonOf.component';
import { utility } from '../utils/utility';
import { PlayableManagerResource } from './playable.manager.resource';
const { ccclass, property } = _decorator;

@ccclass('PlayableManagerVFX')
export class PlayableManagerVFX extends SingletonComponent<PlayableManagerVFX>
{
    public async playEffectAtWsPosition(vfxName: string, wsPos: Vec3)
    {
        try
        {
            const vfx = await PlayableManagerResource.loadPrefab(Animation, `vfx/${vfxName}`);
            this.node.addChild(vfx.node);
            utility.setNodeWorldPositionToTarget(vfx.node, wsPos);
            vfx.play();
            vfx.on(Animation.EventType.FINISHED, () =>
            {
                vfx.node.destroy();
            });
        }
        catch (error)
        {
            console.error("Failed to play effect: ", error);
        }
    }

    public async playParticleByTarget(vfxName: string, target: Node)
    {
        try
        {
            const vfx = await PlayableManagerResource.loadPrefab(Animation, `vfx/${vfxName}`);
            target.addChild(vfx.node);
            vfx.node.position = new Vec3(0, 0, 0);
            vfx.play();
            vfx.on(Animation.EventType.FINISHED, () =>
            {
                vfx.node.destroy();
            });
        }
        catch (error)
        {
            console.error("Failed to play effect: ", error);
        }
    }
}
