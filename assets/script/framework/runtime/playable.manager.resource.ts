import { Component, instantiate, Node, resources, Prefab, JsonAsset, AudioClip, SpriteFrame } from "cc";
import { Singleton } from "../utils/singletonOf";

export class PlayableManagerResource extends Singleton<PlayableManagerResource>
{
    public static async loadPrefab<T extends Component>(componentType: new () => T, path: string): Promise<T>
    {
        return new Promise((resolve, reject) =>
        {
            resources.load(path, Prefab, (error, prefab) =>
            {
                if (error)
                {
                    reject(error);
                }
                else
                {
                    const newNode: Node = instantiate(prefab);
                    const component: T | null = newNode.getComponent(componentType);
                    if (component)
                    {
                        resolve(component);
                    }
                    else
                    {
                        reject(new Error(`Component of type ${componentType} not found on prefab`));
                    }
                }
            })
        });
    }

    public static async LoadSprite(spriteFrameName: string): Promise<SpriteFrame>
    {
        return new Promise((resolve, reject) =>
        {
            resources.load(`sprite/${spriteFrameName}/spriteFrame`, SpriteFrame, (error, spriteFrame) =>
            {
                if (error)
                {
                    reject(error);
                }
                else
                {
                    resolve(spriteFrame);
                }
            })
        });
    }

    public static async LoadJsonConfig(): Promise<JsonAsset>
    {
        return new Promise((resolve, reject) =>
        {
            resources.load("config/settings", JsonAsset, (error, json) =>
            {
                if (error)
                {
                    reject(error);
                }
                else
                {
                    resolve(json);
                }
            })
        });
    }

    public static async LoadAudioClip(path: string): Promise<AudioClip>
    {
        return new Promise((resolve, reject) =>
        {
            resources.load(path, AudioClip, (error, clip) =>
            {
                if (error)
                {
                    reject(error);
                }
                else
                {
                    resolve(clip);
                }
            })
        });
    }
}