
export class Singleton<T extends Singleton<T>>
{
    protected static instance: any;

    public static getInstance<T extends Singleton<T>>(this: new () => T): T
    {
        const cls = this as unknown as typeof Singleton;

        if (!cls.instance)
        {
            cls.instance = new this();
        }

        return cls.instance as T;
    }
}