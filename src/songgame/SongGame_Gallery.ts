import { Container, Sprite } from "pixi.js";
import { IScene } from "../utils/IScene";
import { songs } from "../songgame/songs"
import { SongGame_Title } from "./SongGame_Title";
import { ButtonBack } from "../UI/ButtonBack";
import { sound } from "@pixi/sound";
import { Manager } from "../utils/Manager";
import { LevelTitle } from "../UI/LevelTitle";
import { Easing, Tween } from "tweedle.js";
import { GalleryCard } from "../UI/GalleryCard";
import { ButtonPlay } from "../UI/ButtonPlay";

export class SongGame_Gallery extends Container implements IScene {
    private songCard1: any;
    private songCard2: any;

    constructor() {
        super();

        let actualSong = 0;

        const background = Sprite.from("BlackPaper");
        background.alpha = 0.7;
        this.addChild(background);


        const regresar = new ButtonBack;
        regresar.on("pointerup", () => {
            sound.stopAll();
            Manager.changeScene(new SongGame_Title)
        });
        this.addChild(regresar);

        const levelTitle = new LevelTitle();
        levelTitle.textLevel.text = "GALERÍA\nDE BANDAS";
        levelTitle.textLevel.style.lineHeight = 30;
        levelTitle.cinta.height += 20;
        levelTitle.cinta.y -= 10;
        this.addChild(levelTitle);

        this.songCard1 = new GalleryCard(actualSong);
        this.addChild(this.songCard1);




        //LEFT ARROW
        const arrow1 = Sprite.from("./images/arrow.png");
        arrow1.eventMode = "static";
        arrow1.cursor = "pointer";
        arrow1.anchor.set(0.5);
        arrow1.position.set(125, 1150);
        arrow1.scale.x = -1;
        this.addChild(arrow1);


        arrow1.on("pointerup", () => {
            new Tween(this.songCard1)
                .to({ x: 640 }, 400)
                .start()
                .easing(Easing.Quintic.Out)

            arrow1.eventMode = "none";
            arrow2.eventMode = "none";

            actualSong--;
            if (actualSong < 0) {
                actualSong = 39;
            }

            this.songCard2 = new GalleryCard(actualSong);
            this.songCard2.x -= 640;
            this.addChild(this.songCard2);

            new Tween(this.songCard2)
                .to({ x: 0 }, 400)
                .start()
                .easing(Easing.Quintic.Out)
                .onComplete(() => {
                    this.songCard1 = this.songCard2;
                    arrow1.eventMode = "static";
                    arrow2.eventMode = "static";
                })
        })



        // RIGHT ARROW
        const arrow2 = Sprite.from("./images/arrow.png");
        arrow2.anchor.set(0.5);
        arrow2.position.set(595, 1150);
        arrow2.eventMode = "static";
        arrow2.cursor = "pointer";
        this.addChild(arrow2);

        arrow2.on("pointerup", () => {
            new Tween(this.songCard1)
                .to({ x: -640 }, 400)
                .start()
                .easing(Easing.Quintic.Out)

            arrow1.eventMode = "none";
            arrow2.eventMode = "none";
            actualSong++;
            if (actualSong > 39) {
                actualSong = 0;
            }
            this.songCard2 = new GalleryCard(actualSong);
            this.songCard2.x = 640;
            this.addChild(this.songCard2);

            new Tween(this.songCard2)
                .to({ x: 0 }, 400)
                .start()
                .easing(Easing.Quintic.Out)
                .onComplete(() => {
                    this.songCard1 = this.songCard2;
                    arrow1.eventMode = "static";
                    arrow2.eventMode = "static";
                })
        })


        // ARROW TWEENS         
        new Tween(arrow1)
            .to({ x: arrow1.x - 20 }, 400)
            .start()
            .repeat(Infinity)
            .easing(Easing.Quintic.Out)
            .yoyo(true)

        new Tween(arrow2)
            .to({ x: arrow2.x + 20 }, 400)
            .start()
            .repeat(Infinity)
            .easing(Easing.Quintic.Out)
            .yoyo(true)


        // Añadir botón de reproducción central
        let isPlaying = false;
        const buttonPlay = new ButtonPlay();
        buttonPlay.position.set(Manager.width / 2, 1150);
        buttonPlay.eventMode = "static";
        this.addChild(buttonPlay);
        buttonPlay.on("pointerup", () => {
            if (isPlaying == false) {
                isPlaying = true;
                sound.stopAll(),
                    sound.play(songs[actualSong].audio, () => {
                        buttonPlay.changeState();
                        isPlaying = false;
                    });
                buttonPlay.changeState();
            } else {
                sound.stopAll();
                buttonPlay.changeState();
                isPlaying = false;
            }
        });

    }


    update(_deltaTime: number, _deltaFrame: number): void {
        // throw new Error("Method not implemented.");
    }

}
