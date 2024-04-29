import { _decorator, CCString, Component, instantiate, Node, Prefab, resources } from 'cc';
import { PlayableManagerCore } from '../framework/runtime/playable.manager.core';
import { PlayableLayoutAdapter } from '../framework/internal/layout/playable.layout.adapter';
import { PlayableManagerEvent } from '../framework/runtime/playable.manager.message';
const { ccclass, property } = _decorator;

@ccclass("Test")
export class Test extends Component
{
    protected onLoad(): void
    {
        
    }
}