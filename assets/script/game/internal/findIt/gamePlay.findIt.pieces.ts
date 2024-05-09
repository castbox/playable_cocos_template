import { _decorator, Button, Component, JsonAsset, Layers, Node, Sprite, SpriteFrame, Vec3 } from "cc";
import { PlayableManagerConfig } from "../../../framework/runtime/playable.manager.config";
import { PlayableManagerResource } from "../../../framework/runtime/playable.manager.resource";
import { utility } from "../../../framework/utils/utility";
import { PlayableDraggableScrolling } from "../../../framework/internal/draggable/playable.draggable.scrolling";
import { GamePlayFindItPiece } from "./gamePlay.findIt.piece";
import { PlayableManagerEvent } from "../../../framework/runtime/playable.manager.message";
const { ccclass, property } = _decorator;


@ccclass("GamePlayFindItPieces")
export class GamePlayFindItPieces extends PlayableDraggableScrolling
{
    @property(JsonAsset)
    public PiecesJsonData: JsonAsset = null;

    private _pieces: Map<number, GamePlayFindItPieces> = new Map<number, GamePlayFindItPieces>();

    public async init(piecesSequence: number[]): Promise<void>
    {
        this.node.active = false;

        const piecesData = this.PiecesJsonData.json as { levelId: string, JsonPiecesDataList: { XPos: number, YPos: number, Name: string }[] };
        for (let index = 0; index < piecesData.JsonPiecesDataList.length; index++)
        {
            try
            {
                const pieceSpec = piecesData.JsonPiecesDataList[index];

                let sprite: Sprite = null;
                let node = new Node(pieceSpec.Name);
                utility.setParent(node, this.node);
                node.position = new Vec3(pieceSpec.XPos, -pieceSpec.YPos, 0);
                utility.setLayer(node, "SCENE_2D");
                sprite = node.addComponent(Sprite);
                sprite.spriteFrame = await PlayableManagerResource.LoadSprite(`${piecesData.levelId}/${pieceSpec.Name}`);

                const id = this.containsID(pieceSpec.Name, piecesSequence);
                if (id)
                {
                    console.log(`Found piece ${pieceSpec.Name} with id ${id}`);

                    const piece = node.addComponent(GamePlayFindItPiece);
                    piece.Index = id;
                    const button = node.addComponent(Button);
                    button.node.on("click", piece.onClick.bind(piece));
                }
            }
            catch (error)
            {
                console.error(error);
            }
        }

        this.node.active = true;
    }

    protected onClick(): void
    {
        PlayableManagerEvent.getInstance().emit("onSceneClick", this.node)
    }

    private containsID(inputString: string, ids: number[]): number 
    {
        const idsPattern = ids.map(id => id.toString()).join('|');
        const pattern = new RegExp(`tfull.*(${idsPattern})|(${idsPattern}).*tfull`);

        if (pattern.test(inputString))
        {
            return parseInt(inputString.split('_')[4]);
        }

        return null;
    }
}