import { _decorator, Camera, Component } from "cc";
const { ccclass, property } = _decorator;

@ccclass('PlayableCamera')
export class PlayableCamera extends Component
{
    protected camera: Camera;

    public get Camera(): Camera
    {
        return this.camera;
    
    }

    public async zoom(to : number, from : number = null,  duration : number = 0.5): Promise<void>
    {
        
    }

    protected override onLoad(): void
    {
        this.camera = this.getComponent(Camera);
    }
}