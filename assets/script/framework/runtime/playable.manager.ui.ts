import { _decorator, Camera, Canvas, CCClass, Component } from "cc";
import { Singleton } from "../utils/singletonOf";
import { utility } from "../utils/utility";
import SingletonComponent from "../utils/singletonOf.component";
import { PlayableManagerEvent } from "./playable.manager.message";
import { EScreenOrientation } from "./playable.manager.core";
import { PlayableManagerResource } from "./playable.manager.resource";
import { PlayableUI } from "../internal/ui/playable.ui";

const { ccclass, property } = _decorator;

@ccclass("PlayableManagerUI")
export class PlayableManagerUI extends SingletonComponent<PlayableManagerUI>
{
    private _canvas: Canvas = null;
    private _camera: Camera = null;
    private _openList: Map<string, PlayableUI>;

    private _onOrientationChangedBindEvent = this.onOrientationChanged.bind(this)
    protected onLoad(): void
    {
        this._canvas = this.getComponentInChildren(Canvas);
        this._camera = this.getComponentInChildren(Camera);
        this._openList = new Map<string, PlayableUI>();

        PlayableManagerEvent.getInstance().on("onOrientationChanged", this._onOrientationChangedBindEvent);
    }

    protected start(): void
    {

    }

    public async openUI(prefabName: string): Promise<PlayableUI>
    {
        return new Promise<PlayableUI>(async (resolve, reject) =>
        {
            try 
            {
                if (this._openList.has(prefabName)) 
                {
                    const ui = this._openList.get(prefabName);
                    ui.node.active = true; 
                    resolve(ui)
                    return;
                }

                const ui = await PlayableManagerResource.loadPrefab<PlayableUI>(PlayableUI, `prefab/ui/${prefabName}`);
                ui.node.setParent(this._canvas.node)
                this._openList.set(prefabName, ui);
                await ui.init();
                await ui.open();
                resolve(ui);
            }
            catch (error)
            {
                console.error(`Failed to load ui ${prefabName}: ${error}`);
                reject(error);
            }
        });
    }

    public hideUI(prefabName: string)
    {
        if (!this._openList.has(prefabName)) 
        {
            console.warn("Failed to hide ui, it is not opened: " + prefabName);
            return;
        }

        const ui = this._openList.get(prefabName);
        ui.hide();
    }

    public closeUI(prefabName: string)
    {
        if (!this._openList.has(prefabName)) 
        {
            console.warn("Failed to close ui, it is not opened: " + prefabName);
            return;
        }

        const ui = this._openList.get(prefabName);
        ui.close();

        this._openList.delete(prefabName)
        ui.node.destroy();
    }

    public getUI<T extends PlayableUI>(prefabName: string)
    {
        if (!this._openList.has(prefabName)) 
        {
            console.warn("Failed to get ui, it is not opened: " + prefabName);
            return;
        }

        const ui = this._openList.get(prefabName);
        return ui as T;
    }

    protected onDestroy(): void
    {
        PlayableManagerEvent.getInstance().off("onOrientationChanged", this._onOrientationChangedBindEvent);
    }

    private onOrientationChanged(orientation: EScreenOrientation)
    {
        this._canvas.alignCanvasWithScreen = false
        this._canvas.alignCanvasWithScreen = true

        if (orientation == EScreenOrientation.Landscape)
        {

        }
        else
        {

        }
    }
}