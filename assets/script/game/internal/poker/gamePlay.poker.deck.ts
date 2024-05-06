import { _decorator, Component, Node, tween, UITransform, Vec3 } from 'cc';
import { PlayableManagerResource } from './../../../framework/runtime/playable.manager.resource';
import { ECardSuit, GamePlayPoker } from './gamePlay.poker';
import { GamePlayPokerTableau } from './gamePlay.poker.tableau';
import { utility } from '../../../framework/utils/utility';
import { IGamePlayPokerContainer } from './gamePlay.poker.container';
import { GamePlayPokerHoling } from './gamePlay.poker.holding';
const { ccclass, property } = _decorator;

@ccclass('GamePlayPokerDeck')
export class GamePlayPokerDeck extends Component
{
    private deck: number[] = [];
    private reserved: number[] = [];

    public init()
    {
        for (let i = 0; i < 52; i++)
        {
            this.deck.push(i);
        }
    }

    public shuffle()
    {
        for (let i = this.deck.length - 1; i > 0; i--)
        {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    public setReserved(...list: { suit: ECardSuit, rank: number }[])
    {
        list.forEach((poker) =>
        {
            const number = this.pokerToNumber(poker.suit, poker.rank);
            this.reserved.push(number);
            this.deck.splice(this.deck.indexOf(number), 1)
        });
    }

    public async DealPoker(
        target: { container: IGamePlayPokerContainer, worldPosition: Vec3, holding: GamePlayPokerHoling },
        duration: number,
        ...specGrp: { faceOn: boolean, suit: ECardSuit, rank: number, init: boolean }[]): Promise<GamePlayPoker[]>
    {
        const do_create = async (spec: { faceOn: boolean, suit: ECardSuit, rank: number, init: boolean }): Promise<GamePlayPoker> =>
        {
            return new Promise<GamePlayPoker>(async (resolve, reject) =>
            {
                try
                {
                    const poker: GamePlayPoker = await PlayableManagerResource.loadPrefab(GamePlayPoker, "prefab/poker");
                    utility.setParent(poker.node, this.node);

                    let number: number;
                    if (spec.suit != ECardSuit.UNKNOWN && spec.rank != -1)
                    {
                        number = this.pokerToNumber(spec.suit, spec.rank);
                        // this.deck.splice(this.deck.indexOf(number), 1);
                    }
                    else
                    {
                        number = this.deck.pop();
                    }
                    const [suit, rank] = this.numberToPoker(number);
                    if (spec.init)
                    {
                        poker.initByFace(await PlayableManagerResource.LoadSprite(`poker/poker_${suit}_${rank}`))
                    }
                    
                    poker.setFaceOn(spec.faceOn)
                    poker.Intractable = false
                    resolve(poker)
                }
                catch (error)
                {
                    reject(error)
                    console.error(error);
                }
            });
        };

        const do_deal = async (target: { container: IGamePlayPokerContainer, worldPosition: Vec3, holding: GamePlayPokerHoling }, pokerGrp: GamePlayPoker[]) =>
        {
            return new Promise<void>(async (resolve, reject) =>
            {
                try
                {
                    target.holding.pickUp(pokerGrp, this.node.getWorldPosition())
                    if (duration > 0 && target.worldPosition != null)
                    {
                        tween(target.holding.node).to(duration, { worldPosition: target.worldPosition }).call(() =>
                        {
                            target.holding.drop(target.container);
                            resolve();
                        }).start();
                    }
                    else
                    {
                        target.holding.drop(target.container);
                        resolve();
                    }
                }
                catch (error)
                {
                    reject(error)
                    console.error(error);
                }
            });
        };

        return new Promise(async (resolve, reject) =>
        {
            try
            {
                let pokerGrp = [];
                for (let i = 0; i < specGrp.length; i++)
                {
                    const spec = specGrp[i];
                    const poker = await do_create(spec);
                    pokerGrp.push(poker);
                }
                await do_deal(target, pokerGrp);
                resolve(pokerGrp)

            } catch (error)
            {
                reject(error)
                console.error(error);
            }
        })
    }

    private numberToPoker = (number: number): [ECardSuit, number] =>
    {
        const rank = number % 13 + 1;
        const suit = Math.floor(number / 13);
        return [suit, rank]
    }

    private pokerToNumber = (suit: ECardSuit, rank: number): number =>
    {
        return suit * 13 + rank - 1;
    }

    protected update(deltaTime: number)
    {

    }
}

