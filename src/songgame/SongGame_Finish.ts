import { Container, Sprite, Text } from "pixi.js";
import { IScene } from "../utils/IScene";
import { Manager } from "../utils/Manager";
import { SongButton } from "../UI/SongButton";
import { ScoreUI } from "../UI/ScoreUI";
import { Tween } from "tweedle.js";
import { sound } from '@pixi/sound';
import { SongGame_LevelSelector } from "./SongGame_LevelSelector";


export class SongGame_Finish extends Container implements IScene {

    constructor() {
        super();
        
        sound.play("Guitar",{volume:0.9});

        const background = Sprite.from("BlackPaper");
        this.addChild(background);

        const titleLogo = Sprite.from("TitleLogo");
        titleLogo.anchor.set(0.5);
        titleLogo.position.set(Manager.width / 2, 300);
        titleLogo.scale.set(0.6);
        this.addChild(titleLogo);


        const texty = new Text("¡Felicitaciones por\ncompletar el juego!\n\nTu nivel de rock es:", {
            fontFamily: "Montserrat ExtraBold",
            fill: 0xFFFFFF,
            align: "center",
            fontSize: 38,
            lineHeight: 52
        });
        texty.anchor.set(0.5);
        texty.position.set(Manager.width / 2, 620);
        this.addChild(texty);

        const scoreUI = new ScoreUI;
        scoreUI.scale.set(1.5);
        scoreUI.pivot.set(600, 75);
        scoreUI.position.set(350, 805)
        this.addChild(scoreUI);

        new Tween(scoreUI.scale)
            .to({ x: 1.8, y: 1.8 }, 400)
            .start()
            .repeat(Infinity)
            .yoyo(true)


        const button1 = new SongButton("Continuar", 500);
        button1.setButtonColor(0x00C18C);
        button1.position.set(Manager.width / 2, 1005)
        button1.on("pointerup", (() => {
            Manager.changeScene(new SongGame_LevelSelector);
        }))
        this.addChild(button1);


    }
    update(_deltaTime: number, _deltaFrame: number): void {
        // throw new Error("Method not implemented.");
    }
}