import { _decorator, Button, Camera, Canvas, Component, EventMouse, EventTouch, input, Input, JsonAsset, Mask, Node, SpringJoint2D, Sprite, UITransform, Vec2, Vec3 } from 'cc';
import { PlayableGamePlayCore } from '../internal/gamePlay/playable.gamePlay.core';
import { EScreenOrientation, PlayableManagerCore } from './playable.manager.core';
import { PlayableManagerEvent } from './playable.manager.message';
import SingletonComponent from '../utils/singletonOf.component';
import { utility } from '../utils/utility';
import { PlayableManagerConfig } from './playable.manager.config';
import { PlayableManagerAudio } from './playable.manager.audio';
import { PlayableManagerGuide } from './playable.manager.guide';
import { PlayableCamera } from '../internal/camera/playable.camera';
const { ccclass, property } = _decorator;

@ccclass('PlayableManagerScene')
export class PlayableManagerScene extends SingletonComponent<PlayableManagerScene>
{
    @property(Button)
    public Btn_Install: Button

    private _gamePlayList: PlayableGamePlayCore[]
    public get GamePlay(): PlayableGamePlayCore[]
    {
        return this._gamePlayList;
    }

    private _camera: PlayableCamera = null;
    public get Camera(): PlayableCamera
    {
        return this._camera;
    }

    private _currentGamePlay: PlayableGamePlayCore
    public get CurrentGamePlay(): PlayableGamePlayCore
    {
        return this._currentGamePlay;
    }

    private _curGamePlayIndex: number = 0;
    public get CurGamePlayIndex(): number
    {
        return this._curGamePlayIndex;
    }

    private _onOrientationChangedBindEvent = this.onOrientationChanged.bind(this);
    private _onJumpToStoreBindEvent = this.onJumpToStore.bind(this);
    private _onGameEndBindEvent = this.nextGamePlay.bind(this);

    public onInstallClick()
    {
        PlayableManagerEvent.getInstance().emit("onJumpToStore");
    }

    public startup(): void
    {
        this.nextGamePlay();
        PlayableManagerAudio.getInstance().mute()
    }

    protected onLoad(): void
    {
        this._camera = this.node.getComponentInChildren(PlayableCamera);
        this._gamePlayList = this.node.getComponentsInChildren(PlayableGamePlayCore);

        // 注册事件
        PlayableManagerEvent.getInstance().on("onOrientationChanged", this._onOrientationChangedBindEvent);
        PlayableManagerEvent.getInstance().on("onGameEnd", this._onGameEndBindEvent);
        PlayableManagerEvent.getInstance().on("onJumpToStore", this._onJumpToStoreBindEvent);

        // 设置状态
        this._gamePlayList.forEach(element =>
        {
            element.node.active = false;
        });
    }

    protected update(deltaTime: number): void
    {
        if (this._currentGamePlay && this._currentGamePlay.IsGameStart)
        {
            this._currentGamePlay?.onGameUpdate(deltaTime);
        }
    }

    protected onDestroy(): void
    {
        this._currentGamePlay?.onDestroy();

        // 注销事件
        PlayableManagerEvent.getInstance().off("onOrientationChanged", this._onOrientationChangedBindEvent);
        PlayableManagerEvent.getInstance().off("onJumpToStore", this._onJumpToStoreBindEvent);
        PlayableManagerEvent.getInstance().off("onGameEnd", this._onGameEndBindEvent);
    }

    protected onOrientationChanged(orientation: EScreenOrientation)
    {
        if (orientation == EScreenOrientation.Landscape)
        {

        }
        else
        {

        }
    }

    private nextGamePlay()
    {
        // 退出上一局
        if (this._currentGamePlay != null)
        {
            this._currentGamePlay.onGameEnd()
            this._currentGamePlay.node.active = false;
        }

        // 清理
        PlayableManagerGuide.getInstance().clear();

        // 没有下一局了，就结束游戏
        if (this._gamePlayList.length == 0)
        {
            this.gameOver();
            return;
        }

        // 开启下一局
        this._currentGamePlay = this._gamePlayList.shift();
        this._currentGamePlay.node.active = true;
        this._currentGamePlay.onGameEnter()
        this._curGamePlayIndex++;
    }

    private gameOver()
    {
        this._currentGamePlay?.onGameOver();
        this.Btn_Install.node.active = false
        utility.GameEnd();
    }

    private async onJumpToStore()
    {
        const settings: JsonAsset = PlayableManagerConfig.getInstance().settings;
        utility.JumpToStore(settings.json.store.google, settings.json.store.ios)
    }
}

