import { Container, Graphics, Text, TextStyle } from "pixi.js";

export class SongButton extends Container {

    /*private*/ rectangle: Graphics;

    constructor(band: string, myWidth: number) {
        super();

        this.rectangle = new Graphics();
        this.rectangle.lineStyle(4, 0xFFFFFF);
        this.rectangle.beginFill(0xFFFFFF, 0.00000001)
        this.rectangle.drawRect(0, 0, myWidth, 110);
        this.rectangle.pivot.x = this.rectangle.width / 2
        this.rectangle.pivot.y = this.rectangle.height / 2
        this.addChild(this.rectangle);

        const styly: TextStyle = new TextStyle({
            fontFamily: "Montserrat ExtraBold",
            fill: 0xFFFFFF,
            align: "center",
            fontSize: 40,
            lineHeight: 39
        });
        const texty: Text = new Text(band, styly);
        texty.anchor.set(0.5);
        texty.y = -3
        this.addChild(texty);

        this.eventMode = 'static';
        this.cursor = 'pointer';

        this.on("mouseover", () => { this.scale.set(this.scale.x * 1.07) })
            .on("mouseout", () => { this.scale.set(this.scale.x / 1.07)});

    }

    public setButtonColor(color: number) {
        this.rectangle.clear();
        this.rectangle.lineStyle(4, 0xFFFFFF);
        this.rectangle.beginFill(color, 1);
        this.rectangle.drawRect(0, 0, 500, 110);
        this.rectangle.pivot.x = this.rectangle.width / 2;
        this.rectangle.pivot.y = this.rectangle.height / 2;
    }


};