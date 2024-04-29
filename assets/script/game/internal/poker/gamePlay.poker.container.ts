import { GamePlayPoker } from "./gamePlay.poker";


export interface IGamePlayPokerContainer
{
    setIntractable(value: boolean): void;
    moveIn(poker: GamePlayPoker): void;
    moveOut(poker: GamePlayPoker): GamePlayPoker[];
    moveBack(poker: GamePlayPoker): void;
    remove(poker: GamePlayPoker): void;
}