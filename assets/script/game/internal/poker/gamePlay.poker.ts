import { _decorator, CCBoolean, CCInteger, Animation, Enum, Node, Sprite, tween, Vec3 } from 'cc';
import { DragInfo, PlayableDraggable } from '../../../framework/internal/draggable/playable.draggable';
import { PlayableManagerEvent } from '../../../framework/runtime/playable.manager.message';
import { PlayableManagerConfig } from '../../../framework/runtime/playable.manager.config';
import { IGamePlayPokerContainer } from './gamePlay.poker.container';
import { PlayableManagerAudio } from '../../../framework/runtime/playable.manager.audio';
const { ccclass, property } = _decorator;

export enum ECardSuit
{
    UNKNOWN = 1000,

    // ♠ 黑桃
    CLUB = 0,
    // ♦ 方块
    DIAMOND = 1,
    // ♥ 红桃
    HEART = 2,
    // ♣ 梅花
    SPADE = 3
}

@ccclass('GamePlayPoker')
export class GamePlayPoker extends PlayableDraggable
{
    @property({ type: Enum(ECardSuit) })
    public Suit: ECardSuit = ECardSuit.CLUB;

    @property({
        type: CCInteger,
        range: [1, 13],
    })
    public Rank: number;

    @property(CCBoolean)
    public FaceOn: boolean = false;

    private _back: Sprite
    private _face: Sprite
    private _belongsTo: IGamePlayPokerContainer
    private _animation: Animation
    public set BelongsTo(value: IGamePlayPokerContainer)
    {
        this._belongsTo = value;
    }
    public get BelongsTo(): IGamePlayPokerContainer
    {
        return this._belongsTo;
    }

    public get Described(): string
    {
        return `${this.Suit}_${this.Rank}`;
    }

    public setFaceOn(value: boolean)
    {
        this.FaceOn = value;
        this.refresh();
    }

    protected override onLoad()
    {
        super.onLoad();

        this._back = this.node.getChildByName("back").getComponent(Sprite);
        this._face = this.node.getChildByName("face").getComponent(Sprite);
        this._animation = this.node.getComponentInChildren(Animation);

        this.refresh()

        this.node.name = `${this.Suit}${this.Rank}`;
        this.initByFace()
    }

    protected override start()
    {

    }

    protected override update(deltaTime: number)
    {
        
    }

    public initByFace(spriteFrame = null)
    {
        this._face.spriteFrame = this._face.spriteFrame ? this._face.spriteFrame : spriteFrame;

        if (this._face.spriteFrame == null)
        {
            return
        }

        const spit = this._face.spriteFrame.name.split('_')
        this.Suit = Number(spit[1])
        this.Rank = Number(spit[2])
    }

    public initByData()
    {

    }

    public shake()
    {
        PlayableManagerEvent.getInstance().emit("onPokerShake", this);
        this._animation.play("poker_shake");
        PlayableManagerAudio.getInstance().playSFX("error");
    }

    public isAlternateColor(suit: ECardSuit): boolean
    {
       const isRed1 = (this.Suit === ECardSuit.HEART || this.Suit === ECardSuit.DIAMOND);
       const isRed2 = (suit === ECardSuit.HEART || suit === ECardSuit.DIAMOND);
       return isRed1 !== isRed2;
    }

    public async Flip(immediately: boolean = true): Promise<void>
    {
        PlayableManagerAudio.getInstance().playSFX("flip")

        return new Promise<void>((resolve, reject) =>
        {
            if (immediately)
            {
                this.setFaceOn(!this.FaceOn)
                resolve();
                return;
            }

            const tweenTm = PlayableManagerConfig.getInstance().settings.json.poker.flip_time / 2;
            tween(this.FaceOn ? this._face.node : this._back.node).to(tweenTm, { scale: new Vec3(0, 1, 0) }).call(
                () =>
                {
                    this.setFaceOn(!this.FaceOn)
                }).to(tweenTm, { scale: new Vec3(1, 1, 0) }).call(() =>
                {
                    resolve();
                }).start();
        });
    }

    public is(suit: ECardSuit, rank: number)
    {
        return this.Suit == suit && this.Rank == rank;
    }

    protected override onDragStart()
    {
        super.onDragStart();
        PlayableManagerEvent.getInstance().emit("onSceneClick", this.node);

        const popLst = this.BelongsTo.moveOut(this)
        if (popLst.length > 0)
        {
            PlayableManagerEvent.getInstance().emit("onPokerDragStart", popLst, this.lastDragInfo.StartWSPos)
            return true
        }
        return false;
    }

    protected override onDragMove()
    {
        super.onDragMove();

        PlayableManagerEvent.getInstance().emit("onPokerDragMove", this.lastDragInfo.CurrentWSPos);
    }

    protected override onDragEnd()
    {
        super.onDragEnd();

        PlayableManagerEvent.getInstance().emit("onPokerDragEnd", this);
    }

    protected override onDragCancel()
    {
        super.onDragCancel();

        PlayableManagerEvent.getInstance().emit("onPokerDragEnd", this);
    }

    protected override onClick()
    {
        PlayableManagerEvent.getInstance().emit("onPokerClick", this);
        PlayableManagerEvent.getInstance().emit("onSceneClick", this.node);
    }

    private refresh()
    {
        this._back.node.active = !this.FaceOn;
        this._face.node.active = this.FaceOn;
    }
}

