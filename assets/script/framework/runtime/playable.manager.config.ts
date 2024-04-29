import { JsonAsset } from "cc";
import { Singleton } from "../utils/singletonOf";
import { PlayableManagerResource } from "./playable.manager.resource";

export class PlayableManagerConfig extends Singleton<PlayableManagerConfig>
{
    private _settings : JsonAsset
    public get settings() : JsonAsset
    {
        return this._settings
    }

    public async init()
    {
        this._settings = await PlayableManagerResource.LoadJsonConfig()
    }
}