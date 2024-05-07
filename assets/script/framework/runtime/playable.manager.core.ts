import { _decorator, Canvas, CCString, Component, director, Enum, find, Node, ResolutionPolicy, Vec2, view } from 'cc';
import SingletonComponent from '../utils/singletonOf.component';
import { PlayableGamePlayCore } from '../internal/gamePlay/playable.gamePlay.core';
import { PlayableManagerEvent } from './playable.manager.message';
import { PlayableManagerConfig } from './playable.manager.config';
import { PlayableManagerScene } from './playable.manager.scene';
const { ccclass, property } = _decorator;

export enum EScreenOrientation
{
  Unknown = 0,
  Portrait = 1,
  Landscape = 2
}

export enum EResolutionPolicy
{
  FIXED_WIDTH = ResolutionPolicy.FIXED_WIDTH,
  FIXED_HEIGHT = ResolutionPolicy.FIXED_HEIGHT,
}

@ccclass('PlayableManagerCore')
export class PlayableManagerCore extends SingletonComponent<PlayableManagerCore>
{
  @property({type: Enum(EResolutionPolicy)})
  public WidthResolutionPolicy: EResolutionPolicy = EResolutionPolicy.FIXED_WIDTH;

  @property({type: Enum(EResolutionPolicy)})
  public HeightResolutionPolicy: EResolutionPolicy = EResolutionPolicy.FIXED_HEIGHT;

  /**
   * 当前旋转方向
   */
  private _sceneOrientation: EScreenOrientation = EScreenOrientation.Unknown;
  public get SceneOrientation(): EScreenOrientation
  {
    return this._sceneOrientation;
  }

  private _screenSize: Vec2 = new Vec2(0, 0);
  public get ScreenSize(): Vec2
  {
    return this._screenSize;
  }

  protected async onLoad()
  {
    // 初始化配置
    await PlayableManagerConfig.getInstance().init();
    // 加载场景
    PlayableManagerScene.getInstance().startup();
    // 初始化进行一次屏幕适配
    this.onCanvasResize(true);
  }

  public start()
  {
    view.on('canvas-resize', this.onCanvasResize, this);
  }


  public onDestroy()
  {
    view.off('canvas-resize', this.onCanvasResize, this);
  }

  private onCanvasResize(immediately: boolean = false)
  {
    PlayableManagerEvent.getInstance().emit("onCanvasResize")

    const doOrientation = () =>
    {
      let screenRect = view.getViewportRect();
      this._screenSize.set(screenRect.width, screenRect.height)
      console.log("屏幕尺寸", screenRect.width, screenRect.height)
      if (screenRect.width > screenRect.height) 
      {
        // 横屏模式
        this.switchToLandscape();
      }
      else 
      {
        // 竖屏模式
        this.switchToPortrait();
      }
    }

    if (immediately)
    {
      doOrientation();
      return;
    }

    this.scheduleOnce(() =>
    {
      doOrientation();
    }, 0.05)
  }

  /**
   * 实现转换到竖屏的逻辑
   */
  switchToPortrait(immediately: boolean = false)
  {
    if (this._sceneOrientation == EScreenOrientation.Portrait)
    {
      return;
    }

    console.log("转换到竖屏")

    view.setDesignResolutionSize(720, 1280, this.HeightResolutionPolicy)
    this._sceneOrientation = EScreenOrientation.Portrait;
    PlayableManagerEvent.getInstance().emit("onOrientationChanged", EScreenOrientation.Portrait);
  }

  /**
   * 实现转换到横屏的逻辑
   */
  switchToLandscape()
  {
    if (this._sceneOrientation == EScreenOrientation.Landscape)
    {
      return;
    }

    console.log("转换到横屏")

    view.setDesignResolutionSize(1280, 720, this.WidthResolutionPolicy)
    this._sceneOrientation = EScreenOrientation.Landscape;
    PlayableManagerEvent.getInstance().emit("onOrientationChanged", EScreenOrientation.Landscape);
  }
}