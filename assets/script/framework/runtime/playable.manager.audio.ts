import { _decorator, Component, AudioSource, AudioClip, resources, Node, director } from 'cc';
import SingletonComponent from '../utils/singletonOf.component';
import { utility } from '../utils/utility';
import { PlayableManagerResource } from './playable.manager.resource';
const { ccclass, property } = _decorator;

@ccclass('PlayableManagerAudio')
export class PlayableManagerAudio extends SingletonComponent<PlayableManagerAudio>
{
    private _bgmAudioSource: AudioSource = null;
    private _sfxAudioSource: AudioSource = null;
    private _volume : number

    protected onLoad()
    {
        this._bgmAudioSource = this.node.getChildByName('bgm').getComponent(AudioSource);
        this._sfxAudioSource = this.node.getChildByName('sfx').getComponent(AudioSource);
    }

    /**
     * 播放背景音乐
     * @param bgm 
     * @param loop 
     */
    public async playBGM(bgm: string, loop: boolean = true)
    {
        if (this._bgmAudioSource.clip != null && this._bgmAudioSource.clip.name == bgm)
        {
            return;
        }
        
        try
        {
            const bmgClip = await PlayableManagerResource.LoadAudioClip(bgm)
            this._bgmAudioSource.clip = bmgClip;
            this._bgmAudioSource.loop = loop;
            this._bgmAudioSource.volume = this._volume;
            this._bgmAudioSource.play();
        }
        catch (error)
        {
            console.error(`Failed to load BGM: ${error}`);
        }
    }

    /**
     * 停止背景音乐
     */
    public stopBGM()
    {
        this._bgmAudioSource.stop();
    }

    /**
     * 暂停背景音乐
     */
    public pauseBGM()
    {
        this._bgmAudioSource.pause();
    }

    /**
     * 恢复背景音乐
     */
    public resumeBGM()
    {
        this._bgmAudioSource.play();
    }

    public mute()
    {
        this._volume = 0
        this._bgmAudioSource.volume = this._volume
        this._sfxAudioSource.volume = this._volume
    }

    public unmute()
    {
        this._volume = 1
        this._bgmAudioSource.volume = this._volume
        this._sfxAudioSource.volume = this._volume
    }

    /**
     * 播放音效
     * @param sfx 
     */
    public async playSFX(sfx: string)
    {
        try
        {
            const sfxClip = await PlayableManagerResource.LoadAudioClip(sfx);
            this._sfxAudioSource.loop = false;
            this._sfxAudioSource.playOneShot(sfxClip, this._volume);
        }
        catch (error)
        {
            console.error(`Failed to load SFX: ${error}`);
        }
    }

    public stopSFX()
    {
        this._sfxAudioSource.stop();
    }
}
