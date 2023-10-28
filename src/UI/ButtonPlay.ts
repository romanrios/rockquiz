import { Container, Graphics, Sprite } from "pixi.js";

export class ButtonPlay extends Container {
    private playIcon: Sprite;
    private stopIcon: Graphics;

    constructor() {
        super();

        // Añadir botón de reproducción central
        const buttonPlay = new Graphics();
        buttonPlay.beginFill(0x000000, 0.3);
        buttonPlay.lineStyle(4, 0xFFFFFF);
        buttonPlay.drawCircle(0, 0, 60);
        buttonPlay.endFill;
        this.addChild(buttonPlay);
        buttonPlay.eventMode = "static";
        buttonPlay.cursor = "pointer";

        this.playIcon = Sprite.from("Next");
        this.playIcon.scale.set(0.7);
        this.playIcon.anchor.set(0.5);
        this.playIcon.x = 5;
        this.playIcon.visible = true;
        buttonPlay.addChild(this.playIcon)

        this.stopIcon = new Graphics();
        this.stopIcon.beginFill(0xFFFFFF);
        this.stopIcon.drawRect(-18, -18, 36, 36);
        this.stopIcon.visible = false;
        buttonPlay.addChild(this.stopIcon);
    }


    changeState() {
        if (this.playIcon.visible == true) {
            this.playIcon.visible = false;
            this.stopIcon.visible = true;
        } else {
            this.playIcon.visible = true;
            this.stopIcon.visible = false;
        }
    }



}