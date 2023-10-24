import { Container, Sprite } from "pixi.js";
import { SongButton } from "./SongButton";

export class ButtonBack extends Container {
    private boton: SongButton;
    private arrow: Sprite;

    constructor() {
        super();

        this.boton = new SongButton("", 110);
        this.boton.position.set(90, 90)
        this.addChild(this.boton);

        this.arrow = Sprite.from("BackArrow");
        this.arrow.position.set(-30, -28);
        this.arrow.scale.set(0.7, 0.7);
        this.boton.addChild(this.arrow);

        this.eventMode="static"


    }
}