import { _decorator, Canvas, CCString, Component, director, find, Node, ResolutionPolicy, view } from 'cc';
import SingletonComponent from '../utils/singletonOf.component';
import { PlayableGamePlayCore } from '../internal/gamePlay/playable.gamePlay.core';
import { PlayableManagerEvent } from './playable.manager.message';
import { PlayableManagerConfig } from './playable.manager.config';
const { ccclass, property } = _decorator;

export enum EScreenOrientation
{
  Unknown = 0,
  Portrait = 1,
  Landscape = 2
}

@ccclass('PlayableManagerCore')
export class PlayableManagerCore extends SingletonComponent<PlayableManagerCore>
{
  /**
   * 当前旋转方向
   */
  private _sceneOrientation: EScreenOrientation = EScreenOrientation.Unknown;
  public get SceneOrientation(): EScreenOrientation
  {
    return this._sceneOrientation;
  }

  protected onLoad()
  {
    // 初始化配置
    PlayableManagerConfig.getInstance().init();
  }

  public start()
  {
    this.onCanvasResize()
    view.on('canvas-resize', this.onCanvasResize, this);
  }


  public onDestroy()
  {
    view.off('canvas-resize', this.onCanvasResize, this);
  }

  private onCanvasResize()
  {
    let screenSize = view.getViewportRect();
    console.log("屏幕尺寸", screenSize.width, screenSize.height)
    if (screenSize.width > screenSize.height) 
    {
      // 横屏模式
      this.switchToLandscape();
    }
    else 
    {
      // 竖屏模式
      this.switchToPortrait();
    }

    PlayableManagerEvent.getInstance().emit("onCanvasResize")
  }

  /**
   * 实现转换到竖屏的逻辑
   */
  switchToPortrait()
  {
    if (this._sceneOrientation == EScreenOrientation.Portrait)
    {
      return;
    }

    // 延迟设置，防止闪屏
    this.scheduleOnce(() =>
    {
      console.log("转换到竖屏")

      view.setDesignResolutionSize(720, 1280, ResolutionPolicy.FIXED_HEIGHT)
      this._sceneOrientation = EScreenOrientation.Portrait;
      PlayableManagerEvent.getInstance().emit("onOrientationChanged", EScreenOrientation.Portrait);
    }, 0.05)
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

    // 延迟设置，防止闪屏
    this.scheduleOnce(() =>
    {
      console.log("转换到横屏")

      view.setDesignResolutionSize(1280, 720, ResolutionPolicy.FIXED_WIDTH)
      this._sceneOrientation = EScreenOrientation.Landscape;
      PlayableManagerEvent.getInstance().emit("onOrientationChanged", EScreenOrientation.Landscape);
    }, 0.05)
  }
}