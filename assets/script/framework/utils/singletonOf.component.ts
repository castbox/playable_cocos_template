import { _decorator, Component, director, js, utils, Node } from 'cc';
const { ccclass } = _decorator;

@ccclass
export default class SingletonComponent<T extends SingletonComponent<T>> extends Component
{
    protected static instance: any;

    public static getInstance<T extends SingletonComponent<T>>(this: new () => T): T
    {
        const cls = this as unknown as typeof SingletonComponent;

        if (!cls.instance)
        {
            cls.instance = director.getScene().getComponentInChildren(this);

            if (!cls.instance)
            {
                const newNode = new Node(js.getClassName(this));
                cls.instance = newNode.addComponent(this);
                director.getScene().addChild(newNode);
            }
        }

        return cls.instance as T;
    }
}
