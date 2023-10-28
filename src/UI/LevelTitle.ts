import { Container, Sprite, Text } from "pixi.js";
import { Manager } from "../utils/Manager";
import { levels } from "../songgame/levels";

export class LevelTitle extends Container {
    textLevel: Text;
    cinta: Sprite;

    constructor() {
        super();

        this.cinta = Sprite.from("Cinta");
        this.cinta.position.set(228, 103);
        this.addChild(this.cinta);

        this.textLevel = new Text(`NIVEL ${levels[Manager.currentLevel].name}`, {
            fontFamily: "Montserrat ExtraBold",
            fill: 0x000000,
            align: "center",
            fontSize: 30,
        });
        this.textLevel.anchor.set(0.5);
        this.textLevel.position.set(360, 136)
        this.addChild(this.textLevel);


    }

}
