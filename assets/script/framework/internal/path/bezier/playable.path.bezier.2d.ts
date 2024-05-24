import { _decorator, bezier, Component, Graphics, Node, Tween, tween, Vec2, Vec3 } from "cc";
import { EDITOR } from "cc/env";
import { PlayablePath } from "../playable.path";
const { ccclass, executeInEditMode, property } = _decorator;

@ccclass('PlayablePathBezier2D')
@executeInEditMode
export class PlayablePathBezier2D extends PlayablePath
{
    @property(Node)
    public Node_Start: Node = null;

    @property(Node)
    public Node_End: Node = null;

    @property([Node])
    public Node_Control: Node[] = [];

    @property({
        tooltip: '运行时显示Bezier曲线', visible: function ()
        {
            let line = this._graphics as Graphics;
            if (this.Debug)
            {
                line.lineWidth = 5;
            } else
            {
                line.lineWidth = 0;
            }
            return true;
        },
    })
    public Debug = false;

    private _p1: Node | null = null;
    private _c1: Node | null = null;
    private _c2: Node | null = null;
    private _p2: Node | null = null;
    private _graphics: Graphics | null = null;
    private _tween: Tween<Vec3>;

    public override async move(target: Node, speed: number): Promise<void>
    {
        await super.move(target, speed);

        let startPos = this.Node_Start.worldPosition.clone();
        let endPos = this.Node_End.worldPosition.clone();
        target.setWorldPosition(startPos);

        const c1x = this._c1.worldPosition.x;
        const c1y = this._c1.worldPosition.y;
        const c2x = this._c2.worldPosition.x;
        const c2y = this._c2.worldPosition.y;
        const startX = startPos.x;
        const startY = startPos.y;
        const endX = endPos.x;
        const endY = endPos.y;

        return new Promise<void>((resolve, reject) =>
        {
            this.stop();

            let progressX = function (start: number, end: number, current: number, t: number)
            {
                current = bezier(startX, c1x, c2x, endX, t);
                return current;
            };
            let progressY = function (start: number, end: number, current: number, t: number)
            {
                current = bezier(startY, c1y, c2y, endY, t);
                return current;
            };

            const calculate = (ratio) =>
            {
                if (ratio > 0.99)
                {
                    return;
                }

                let t = ratio;
                let x = (1 - t) * (1 - t) * (1 - t) * startPos.x + 3 * (1 - t) * (1 - t) * t * c1x + 3 * (1 - t) * t * t * c2x + t * t * t * endPos.x;
                let y = (1 - t) * (1 - t) * (1 - t) * startPos.y + 3 * (1 - t) * (1 - t) * t * c1y + 3 * (1 - t) * t * t * c2y + t * t * t * endPos.y;
                let dx = -3 * (1 - t) * (1 - t) * startPos.x + 3 * (3 * t * t - 4 * t + 1) * c1x + 3 * (2 - 3 * t) * t * c2x + 3 * t * t * endPos.x;
                let dy = -3 * (1 - t) * (1 - t) * startPos.y + 3 * (3 * t * t - 4 * t + 1) * c1y + 3 * (2 - 3 * t) * t * c2y + 3 * t * t * endPos.y;

                let angle = Math.atan2(dy, dx);
                target.setWorldPosition(x, y, 0);
                target.angle = angle / Math.PI * 180;


                // // 计算四个控制点的x坐标
                // let cx1 = startPos.x, cx2 = c1x, cx3 = c2x, cx4 = endPos.x;

                // // 计算当前时间点的x坐标
                // let t = ratio;
                // let x = bezier(cx1, cx2, cx3, cx4, t);

                // // 计算四个控制点的y坐标  
                // let cy1 = startPos.y, cy2 = c1y, cy3 = c2y, cy4 = endPos.y;

                // // 计算当前时间点的y坐标
                // let y = bezier(cy1, cy2, cy3, cy4, t);

                // // 计算Δt时间后的y坐标
                // let dt = 0.01;
                // let t2 = Math.min(t + dt, 1);
                // let y2 = bezier(cy1, cy2, cy3, cy4, t2);

                // // 计算切线的斜率
                // let dx = (cx4 - cx1) * dt;
                // let dy = y2 - y;
                // let slope = dy / dx;

                // // 将斜率转为角度
                // let radian = Math.atan(slope);
                // let angle = radian * 180 / Math.PI;

                // // 设置节点的位置和旋转
                // target.setPosition(x, y);
                // target.angle = angle;
            }
            let s1 = Vec3.distance(startPos, this._c1.worldPosition);
            let s2 = Vec3.distance(this._c1.worldPosition, this._c2.worldPosition);
            let s3 = Vec3.distance(this._c2.worldPosition, endPos);
            let total = s1 + s2 + s3;
            let duration = total / speed;

            this._tween = tween(startPos)
                .parallel
                (
                    tween().to(duration, { x: endPos.x },
                        {
                            progress: progressX, easing: "smooth", onUpdate: (pos, ratio) =>
                            {
                                //target.setPosition(startPos);
                                calculate(ratio);
                            }
                        }),
                    tween().to(duration, { y: endPos.y },
                        {
                            progress: progressY, easing: "smooth", onUpdate: (pos, ratio) =>
                            {
                                //target.setPosition(startPos);
                                 calculate(ratio);
                            }
                        }),
                )
                .call(() =>
                {
                    resolve();
                });

            this._tween.start();
        });
    }

    public stop()
    {
        if (this._tween)
        {
            this._tween.stop();
        }
    }

    protected override onLoad(): void
    {
        this._graphics = this.getComponent(Graphics);

        this._p1 = this.Node_Start;
        this._p2 = this.Node_End;
        this._c1 = this.Node_Control[0];
        this._c2 = this.Node_Control.length < 2 ? this.Node_Control[0] : this.Node_Control[1];
    }

    protected override update()
    {
        if (EDITOR)
        {
            this.draw();
        } else
        {
            if (this.Debug)
            {
                this.draw();
            }
        }
    }

    private draw()
    {
        if (!this.Debug && !EDITOR) return;

        if (!this._p1 || !this._c1 || !this._c2 || !this._p2)
        {
            this._graphics.clear();
            return;
        }
        let p1 = this._p1.position;
        let c1 = this._c1.position;
        let c2 = this._c2.position;
        let p2 = this._p2.position;
        this._graphics.clear();
        this._graphics.moveTo(p1.x, p1.y);
        this._graphics.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, p2.x, p2.y);
        this._graphics.stroke();
    }
}