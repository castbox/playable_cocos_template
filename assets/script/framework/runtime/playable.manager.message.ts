/** 事件管理器
 * 用于管理游戏中的事件订阅和触发
 */

import { Vec2 } from "cc";
import { Singleton } from "../utils/singletonOf";

type PlayableEventHandler = (...args: any[]) => void;

export class PlayableManagerEvent extends Singleton<PlayableManagerEvent>
{
    private listeners: { [event: string]: PlayableEventHandler[] } = {};

    /**
     * 订阅事件
     * @param event 事件名称
     * @param handler 事件回调函数
     */
    public on(event: string, handler: PlayableEventHandler): void
    {
        if (!this.listeners[event])
        {
            this.listeners[event] = [];
        }

        if (this.listeners[event].indexOf(handler) === -1)
        {
            this.listeners[event].push(handler);
        }
    }

    /**
     * 订阅事件，只触发一次
     * @param event 事件名称
     * @param handler 事件回调函数
     */
    public once(event: string, handler: PlayableEventHandler): void
    {
        const onceHandler = (...args: any[]) =>
        {
            handler(...args);
            this.off(event, onceHandler);
        };
        this.on(event, onceHandler);
    }

    /**
     * 订阅一组事件，只触发一次
     * @param handler 事件回调函数
     * @param events 事件名称
     */
    public once_any(handler: PlayableEventHandler, ...events: string[]): void
    {
        const onceAnyHandler = (event: string, ...args: any[]) =>
        {
            handler(event, ...args);
            events.forEach(event => this.off(event, onceAnyHandler));
        };
        events.forEach(event => this.on(event, onceAnyHandler));
    }

    /**
     * 触发事件
     * @param event 事件名称
     * @param args 传递给回调函数的数据
     */
    public emit(event: string, ...args: any[]): void
    {
        const handlers = this.listeners[event];
        if (handlers)
        {
            handlers.forEach(handler =>
            {
                if (handler.name == "onceAnyHandler" || handler.name == "u")
                {
                    handler(event, ...args);
                }
                else
                {
                    handler(...args);
                }
            });
        }
    }

    /**
     * 移除事件监听器
     * @param event 事件名称
     * @param handlerToRemove 要取消订阅的回调函数 
     */
    public off(event: string, handlerToRemove: PlayableEventHandler): void
    {
        const handlers = this.listeners[event];
        if (handlers)
        {
            this.listeners[event] = handlers.filter(handler => handler !== handlerToRemove);
        }
    }

    /**
     * 移除事件的全部监听器
     * @param event 事件名称
     */
    public clean(event: string)
    {
        this.listeners[event] = null;
    }
}