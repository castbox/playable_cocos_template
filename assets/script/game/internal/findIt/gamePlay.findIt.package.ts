import { _decorator, Component, Label, Layers, Layout, Node, Sprite, Tween, tween, Vec3 } from "cc";
import { GamePlayFindItPiece } from "./gamePlay.findIt.piece";
import { PlayableManagerResource } from "../../../framework/runtime/playable.manager.resource";
import { utility } from "../../../framework/utils/utility";
const { ccclass, property } = _decorator;

@ccclass('GamePlayFindItPackage')
export class GamePlayFindItPackage extends Component
{
    private _layout_root: Layout
    private _node_content: Node;
    private _findPieces: Map<number, Sprite> = new Map<number, Sprite>();

    public get FindPieces(): Map<number, Sprite>
    {
        return this._findPieces;
    }

    protected override onLoad(): void
    {
        this._node_content = this.node.getChildByName("content");
        this._layout_root = this._node_content.getChildByName("root").getComponent(Layout);
        this._layout_root.updateLayout();
    }

    public async init(levelId: string, piecesSequence: number[])
    {
        piecesSequence.forEach(async (pieceIndex) =>
        {
            const spriteName: string = `${levelId}_titem_${pieceIndex}`;
            const node = new Node(spriteName);
            utility.setParent(node, this._layout_root.node);
            utility.setLayer(node, "SCENE_2D");
            const sprite = node.addComponent(Sprite);
            sprite.spriteFrame = await PlayableManagerResource.LoadSprite(`${levelId}/titem/${spriteName}`);
            sprite.setSharedMaterial(await PlayableManagerResource.LoadMaterial("gray"), 0);
            this._findPieces.set(pieceIndex, sprite);
        })
    }

    public async findPiece(piece: GamePlayFindItPiece): Promise<void>
    {
        Tween.stopAllByTarget(piece.node);

        return new Promise<void>((resolve) =>
        {
            utility.setParent(piece.node, this.node, true);
            const sprite = this._findPieces.get(piece.Index);
            tween(piece.node).to(0.5, { scale: new Vec3(0.5, 0.5, 1) }).start();
            tween(piece.node).to(0.5, { worldPosition: sprite.node.worldPosition }).call(async () =>
            {
                sprite.material = await PlayableManagerResource.LoadMaterial("normal");
                resolve();
            }).start();
        });
    }
}