import { Container, Sprite, Text } from "pixi.js";
import { songs } from "../songgame/songs";
import { Manager } from "../utils/Manager";
import { levels } from "../songgame/levels";

export class GalleryCard extends Container {
    private imgSong: Sprite;

    constructor(actualSong: number) {
        super();

        // NIVEL NUMERO
        const textNivel = new Text("NIVEL " + levels[this.transformarNumero(actualSong)].name, {
            fontFamily: "Montserrat ExtraBold",
            fill: 0xFFFFFF,
            align: "center",
            fontSize: 25,
            lineHeight: 40,
            letterSpacing: 7
        });
        textNivel.anchor.set(0.5);
        textNivel.position.set(Manager.width / 2, 270)
        this.addChild(textNivel);

        // IMAGEN TAPA DE DISCO
        this.imgSong = Sprite.from(songs[actualSong].img);
        this.imgSong.anchor.set(0.5);
        this.imgSong.position.set(Manager.width / 2, 600);
        this.addChild(this.imgSong);

        // NOMBRE BANDA
        const texty = new Text(
            songs[actualSong].band,
            {
                fontFamily: "Montserrat ExtraBold",
                fill: 0xFFFFFF,
                align: "center",
                fontSize: 50,
                lineHeight: 50,
            });
        texty.anchor.set(0.5);
        texty.position.set(Manager.width / 2, 935)
        this.addChild(texty);

        // NOMBRE CANCION
        const textHelp = new Text(songs[actualSong].songName, {
            fontFamily: "Montserrat ExtraBold",
            fill: 0xFFFFFF,
            align: "center",
            fontSize: 23,
            lineHeight: 40,
            letterSpacing: 6,

        });
        textHelp.anchor.set(0.5);
        textHelp.position.set(Manager.width / 2, 1010)
        this.addChild(textHelp);

    }

    private transformarNumero(numero: number) {
        var saltos = Math.floor(numero / 4);
        var valorSerie2 = numero + saltos;
        return valorSerie2;
    }

}