import { Assets, Container, Graphics, Sprite, Text } from "pixi.js";
import { IScene } from "../utils/IScene";
import { Manager } from "../utils/Manager";
import { SongButton } from "../UI/SongButton";
import '@pixi/gif';
import { sound } from '@pixi/sound';
import { SongGame_LevelSelector } from "./SongGame_LevelSelector";
import { Tween } from "tweedle.js";

export class SongGame_Title extends Container implements IScene {

    private titleLogo: Sprite;
    private buttonHighlight: Graphics;

    constructor() {
        super();

        sound.play("Guitar");

        const titleBackground = Sprite.from("TitleBackground");
        this.addChild(titleBackground);

        this.titleLogo = Sprite.from("TitleLogo");
        this.titleLogo.anchor.set(0.5);
        this.titleLogo.position.set(Manager.width / 2, 550);
        this.titleLogo.scale.set(0.97);
        this.addChild(this.titleLogo);

        new Tween(this.titleLogo.scale)
            .to({ x: 1.03, y: 1.03 }, 400)
            .start()
            .yoyo(true)
            .repeat(Infinity)

        const rayo1 = Assets.get("Rayo");
        rayo1.position.set(40, 700);
        this.addChild(rayo1);

        const rayo2 = rayo1.clone();
        rayo2.scale.set(-0.9, 0.9);
        rayo2.position.set(680, 700);
        rayo2.angle = 10;
        this.addChild(rayo2);

        const button = new SongButton("Jugar", 500);
        button.position.set(Manager.width / 2, 1000);
        this.addChild(button);
        button.on("pointerup", () => {
            Manager.changeScene(new SongGame_LevelSelector);
        })

        this.buttonHighlight = new Graphics();
        this.buttonHighlight.beginFill(0xFFFFFF);
        this.buttonHighlight.drawRect(-250, -55, 500, 110);
        this.buttonHighlight.alpha = 0;
        button.addChild(this.buttonHighlight);

        new Tween(this.buttonHighlight)
            .to({ alpha: 0.3 }, 400)
            .start()
            .repeat(Infinity)
            .yoyo(true)

        const texty = new Text("© 2023  Román Ríos\nCreado con el apoyo de The Rabbit Hole\ny Capital Activa, Municipalidad de Santa Fe", {
            fontFamily: "Montserrat ExtraBold",
            fill: 0xFFFFFF,
            align: "center",
            fontSize: 22,
            lineHeight: 39
        });
        texty.anchor.set(0.5);
        texty.position.set(Manager.width / 2, 1180);
        this.addChild(texty);
    }

    update(_deltaTime: number, _deltaFrame: number): void {
    }

}