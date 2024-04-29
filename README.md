## Playable Template 2D

### 目录结构

- #### rawRes

  这里放置美术资源，比如`animation`、`shader`、`spine`、`template`(事先创建好的`Prefab`，用于创建`Prefab`变体)、`texture`、`material` 等等。

- #### resources

   这里放置动态需要加载的资源，这些资源会引用`rawRes`然后进入包体，如果包体比较大首先考虑，减少这个目录下的资源。

- #### scene

  这里放置场景文件，Playable项目一般为一个场景就是`Launch`。

- #### script

  - ##### framework

    这里放置和项目无关的框架代码，用于保证核心逻辑和业务逻辑的解耦，使业务层流水线化。

  - ##### game

    这里放置业务逻辑相关的代码，主要分为`gamePlay`和`ui`两种类型 。

  - ##### test

    这里放置单元测试代码，测试完成后方可集成到主分支。

### 命名规范

- **使用小写字母和连字符（-）来分割单词**。例如， `spine-gray-bg.mtl`。这种命名方式有助于保持文件名的简洁性和可读性，同时也与许多现代Web开发的命名习惯保持一致。
- **类名与文件名匹配，并遵循类命名规范**。例如，`PlayableGamePlayCore` 类对应的文件名应为 `playable.gamePlay.core.ts`，`PlayableManagerCore` 类对应的文件名应为 `playable.manager.core.ts`。
- **类中私有字段应该以下划线(_)开始**。例如， `private _sceneOrientation: EScreenOrientation` 。
- **类中公有字段应该首字母大写**。例如， `public String : string`
- **类中所有的方法应该首字母小写**。例如，`private gameOver()`、`protected start()`、`public OnClick()`

### Gameplay

> [!IMPORTANT]
>
> 在使用Prefab的时候需要注意:
>
> 1. 在编辑实例化后的prefab时需要提交才算修改完毕，但是需要注意的是修改提交后会自动同步到链接到这个prefab的所有实例。
> 2. 推荐的做法是，实例化prafab后断开与prefab的链接，这样对当前实例的修改不会影响到其他实例。

- #### 接口

  - ###### `PlayableGamePlayCore`

    目前关卡以`Prefab`的形式承载，即一个关卡为一个`prefab`，每个关卡需要挂上实现`PlayableGamePlayCore`接口的组件，然后拖到`scene/canvas/gamePlay`下， 每一关结束时需要发送`onGameEnd`这个事件。

    | 接口名       | 说明                                                     |
    | :----------- | -------------------------------------------------------- |
    | `onEnter`    | 这一关开始时调用                                         |
    | `onUpdate`   | 这一关迭代更新，每一帧会调用                             |
    | `onGameOver` | 如果没有下一关了，会调用这个接口，方便做游戏结束后的操作 |
    | `onDestroy`  | 在关闭游戏时调用，用于清理资源                           |

### 事件

```typescript
private onWatch()
{
  // TODO
}
// 订阅一个事件
PlayableManagerEvent.getInstance().on('事件名', this.onWatch.bind(this));
// 取消订阅一个事件
PlayableManagerEvent.getInstance().off('事件名', this.onWatch.bind(this));
// 订阅一个事件，但是只触发一次
PlayableManagerEvent.getInstance().once('事件名', ()=>{
    // TODO
});

// 发布一个事件
PlayableManagerEvent.getInstance().emit('事件名', ${参数列表});
```

目前已经支持的事件类型如下：

| 事件名                 | 触发条件         | 参数                      |
| ---------------------- | ---------------- | ------------------------- |
| `onOrientationChanged` | 屏幕旋转         | 枚举 `EScreenOrientation` |
| `onSceneClick`         | 点击场景任何地方 | 点击的节点 `Node`         |
| `onGameStart`          | 每一个关卡开始   | 无                        |
| `onGameEnd`            | 每一个关卡结束   | 无                        |
| `onJumpToStore`        | 跳转到商店页面   | 无                        |

### 音频

> [!IMPORTANT]
>
> 音频资源需要放置在`resources/audio`目录下。

```typescript
// 播放背景音乐
PlayableManagerAudio.getInstance().playBGM("背景音乐名");
// 播放音效
PlayableManagerAudio.getInstance().playSFX("音效名");
```

### 特效

> [!IMPORTANT]
>
> 特效资源需要放置在resources/vfx 目录下。

```typescript
// 播放一个全局特效
PlayableManagerVFX.getInstance().playEffectAtWsPosition("特效名", ${世界坐标 : vec3});

// 播放一个局部特效
PlayableManagerVFX.getInstance().playParticleByTarget("特效名", ${目标 : Node});
```

### 输入

监听全局输入事件，特别是`TOUCH`事件。

```typescript
// 获取当前点击的世界坐标
const LastTouchPos: Vec3 = PlayableManagerInput.getInstance().LastTouchPos;
```

### View

- #### 自适应

  - 需要在横屏和竖屏交集范围內放置可交互物体，这样才能保证横竖屏切换时可交互物体不会被摄像机裁剪掉，从而影响游戏进程。

  - 按照可视范围大小调整关卡场景的缩放比例。

  - 使用提供的横竖屏事件通知，动态更换调整资源，比如layout。

    ```typescript
    // 只需要监听onOrientationChanged这个事件
    PlayableManagerEvent.getInstance().emit("onOrientationChanged", EScreenOrientation.Portrait);
    
    PlayableManagerEvent.getInstance().emit("onOrientationChanged", EScreenOrientation.Landscape);
    ```

- #### Layout

  在横竖屏自动切换的时候，特别是2d资源，可以借助自动重排的功能可以使之可定制化地自适应。

  ```typescript
  // 清理当前layout，根据旋转方向重排
  PlayableLayoutAdapter.getInstance().Clear();
  if (sceneOrientation == EScreenOrientation.Landscape)
  {
      // 创建横向排布的根节点
      let rootNode : LayoutNode = PlayableLayoutAdapter.getInstance().createLayout(ELayoutType.HORIZONTAL, 0);
      // 创建右侧按照纵向排布节点，并制定space(排布时中间的空隙)为80
      let right = PlayableLayoutAdapter.getInstance().createLayout(ELayoutType.VERTICAL, 80, rootNode);
      // 往右侧元素插入三部分UI元素
      right.PushChild(this._title.node);
      right.PushChild(this._describe.node);
      right.PushChild(this._input.node);
    
      // 在根节点下插入玩法元素和右侧的节点
      rootNode.pushChild(this._gamePlay.node);
      rootNode.pushChild(right.node);
  }
  else if (sceneOrientation == EScreenOrientation.Portrait)
  {
      // 创建纵向排布的根节点
      let rootNode = PlayableLayoutAdapter.getInstance().createLayout.createLayout(ELayoutType.VERTICAL, 40);
      
    	// 分别插入ui元素和玩法元素
      rootNode.pushChild(this._title.node);
      rootNode.pushChild(this._describe.node);
      rootNode.pushChild(this._gamePlay.node);
      rootNode.pushChild(this._input.node);
  }
  ```

### Config

所有的配置项都在`asset/resources/config/settings.json`中配置

```json
{
  "Google_Store_URL" : "https://play.google.com/store/apps/details?id=hidden.objects.find.it.out.seek.puzzle.games.free",
  
  "Apple_Store_URL" : "https://apps.apple.com/us/app/id6446246671"
}
```

```typescript
// 获取配置
const settings: JsonAsset = PlayableManagerConfig.getInstance().settings;
// 读取配置
settings.json[${配置项 : string}]
```

### Buid

> [!IMPORTANT]
>
> 如果项目中含有spine动画，导出的时候应该选择`cocos creator 3.7.4`，否则 `spine`资源会加载失败，建议可以使用最新版本开发，因为编辑器的bug要少得多，切换编辑器版本的方法为，删除项目文件下`library`然后选择对应的编辑器版本打开。

- #### 配置

  - ##### Project/Project Settings.Project Data		

    | 参数            | 数值    |
    | --------------- | ------- |
    | `Desgin Width`  | 720     |
    | `Desgin Herght` | 1280    |
    | `Fit Width`     | `false` |
    | `Fit Height`    | `false` |

  - ##### Project/Build

    | 参数        | 数值          |
    | ----------- | ------------- |
    | `Platfrom`  | `Web Desktop` |
    | `Md5 Cache` | `true`        |
