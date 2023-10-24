import { Container, Sprite, Text } from "pixi.js";
import { Manager } from "../utils/Manager";
import { Easing, Tween } from "tweedle.js";

export class ScoreUI extends Container {
    private star: Sprite;
    private textScore: Text;

    constructor() {
        super()

        // UI SCORE
        this.textScore = new Text(Manager.score, {
            fontFamily: "Montserrat ExtraBold",
            fill: 0xFFFFFF,
            align: "center",
            fontSize: 50,
        });
        this.textScore.anchor.set(0.5);
        this.textScore.position.set(640, 75)
        this.addChild(this.textScore);

        this.star = Sprite.from("Star");
        this.star.scale.set(0.8);
        this.star.anchor.set(0.5);
        this.star.position.set(this.textScore.x - (this.textScore.width / 2) - 50, 75);
        this.addChild(this.star);
    }

    actualizarPuntaje() {
        this.textScore.text = Manager.score;
        this.star.position.set(this.textScore.x - (this.textScore.width / 2) - 50, 75);
    }

    animacion() {
        new Tween(this.star)
            .to({ y: this.star.y - 30 }, 300)
            .start()
            .yoyo(true)
            .repeat(1)
            .easing(Easing.Elastic.Out);

    }

}