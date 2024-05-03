import { _decorator, CCBoolean, Component, Enum, Node, Sprite, SpriteFrame } from 'cc';
import { GamePlayBallSortBottle } from './gamePlay.ballSort.bottle';
const { ccclass, property } = _decorator;

export enum EBallColor
{
    RED = 0,
    BLUE = 1,
    GREEN = 2,
    YELLOW = 3,
    ORANGE = 4,
    BLACK = 5,
}

@ccclass('GamePlayBallSortBall')
export class GamePlayBallSortBall extends Component
{
    @property(CCBoolean)
    public Known: boolean = false;

    @property({ type: Enum(EBallColor) })
    public Color: EBallColor = EBallColor.RED;

    private _sprite_ball: Sprite = null;
    private _sprite_unKnown: Sprite = null;
    private _belongsTo: GamePlayBallSortBottle = null;

    public get BelongsTo()
    {
        return this._belongsTo;
    }
    public set BelongsTo(value: GamePlayBallSortBottle)
    {
        this._belongsTo = value;
    }
    
    public setKnown(value: boolean)
    {
        this.Known = value;
        this.refresh();
    }

    protected override start()
    {
        this._sprite_ball = this.node.getChildByName("ball").getComponent(Sprite);
        this._sprite_unKnown = this.node.getChildByName("unknown").getComponent(Sprite);
        this.initByBall()
        this.refresh();
    }

    protected override update(deltaTime: number)
    {
        
    }
    
    private initByBall(spriteFrame: SpriteFrame = null)
    {
        this._sprite_ball.spriteFrame = this._sprite_ball.spriteFrame ? this._sprite_ball.spriteFrame : spriteFrame;

        if (this._sprite_ball.spriteFrame == null)
        {
            return;
        }

        const spit :string[]   = this._sprite_ball.spriteFrame.name.split("_");
        this.Color = EBallColor[spit[1].toUpperCase() as keyof typeof EBallColor];
    }

    private refresh()
    {
        this._sprite_ball.node.active = this.Known;
        this._sprite_unKnown.node.active = !this.Known;
    }
}

