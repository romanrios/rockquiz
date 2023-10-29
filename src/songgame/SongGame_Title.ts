import { Assets, Container, Graphics, Sprite, Text } from "pixi.js";
import { IScene } from "../utils/IScene";
import { Manager } from "../utils/Manager";
import { SongButton } from "../UI/SongButton";
import '@pixi/gif';
import { sound } from '@pixi/sound';
import { SongGame_LevelSelector } from "./SongGame_LevelSelector";
import { Easing, Tween } from "tweedle.js";
import { ButtonBack } from "../UI/ButtonBack";
import { SongGame_Quiz } from "./SongGame_Quiz";
import { SongGame_Gallery } from "./SongGame_Gallery";

export class SongGame_Title extends Container implements IScene {

    private titleLogo: Sprite;
    private buttonHighlight: Graphics;

    constructor() {
        super();

        sound.play("Guitar");

        const titleBackground = Sprite.from("TitleBackground");
        this.addChild(titleBackground);

        const background = Sprite.from("BlackPaper");
        background.alpha = 0;
        this.addChild(background);

        this.titleLogo = Sprite.from("TitleLogo");
        this.titleLogo.anchor.set(0.5);
        this.titleLogo.position.set(Manager.width / 2, -100);
        this.titleLogo.scale.set(0.97);
        this.addChild(this.titleLogo);

        new Tween(this.titleLogo)
            .to({ y: 550 }, 500)
            .start()
            .easing(Easing.Bounce.Out)

        const logoAnimation = new Tween(this.titleLogo.scale)
            .to({ x: 1.03, y: 1.03 }, 400)
            .start()
            .yoyo(true)
            .repeat(Infinity)

        const rayo1 = Assets.get("Rayo");
        rayo1.position.set(40, 700);
        rayo1.scale.set(1);
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
            button.eventMode = "none";
            logoAnimation.stop();

            new Tween(this.titleLogo)
                .to({ scale: { x: 0.6, y: 0.6 }, y: 260 }, 500)
                .start()
                .easing(Easing.Quintic.In)

            new Tween(background)
                .to({ alpha: 1 }, 500)
                .start()
                .easing(Easing.Quintic.In)

            new Tween(rayo1)
                .to({ x: -150 }, 500)
                .start()
                .easing(Easing.Quintic.In)

            new Tween(rayo2)
                .to({ x: 870 }, 500)
                .start()
                .easing(Easing.Quintic.In)

            new Tween(button)
                .to({ alpha: 0 }, 500)
                .start()
                .easing(Easing.Quintic.In)

            // UI Back button
            const regresar = new ButtonBack;
            regresar.alpha = 0;
            regresar.on("pointerup", () => {
                sound.stopAll();
                Manager.changeScene(new SongGame_Title)
            });
            this.addChild(regresar);

            new Tween(regresar)
                .to({ alpha: 0.5 }, 500)
                .start()
                .easing(Easing.Quintic.In)

            const button1 = new SongButton("Juego Principal", 500);
            button1.position.set(-300, 550);
            button1.on("pointerup", () => Manager.changeScene(new SongGame_LevelSelector))
            button1.addChild(this.buttonHighlight);
            this.addChild(button1);

            new Tween(button1)
                .to({ x: Manager.width / 2 }, 500)
                .start()
                .easing(Easing.Quintic.In)

            const button2 = new SongButton("Quiz Definitivo", 500);
            button2.position.set(1020, 700);
            button2.on("pointerup", () => {
                sound.stopAll();
                Manager.changeScene(new SongGame_Quiz(4, 40, true));
            })
            this.addChild(button2);

            new Tween(button2)
                .to({ x: Manager.width / 2 }, 500)
                .start()
                .easing(Easing.Quintic.In)

            const button3 = new SongButton("Galería de Bandas", 500);
            button3.position.set(-300, 850);
            this.addChild(button3);
            button3.on("pointerup", () => {
                Manager.changeScene(new SongGame_Gallery);
            })

            new Tween(button3)
                .to({ x: Manager.width / 2 }, 500)
                .start()
                .easing(Easing.Quintic.In)


            const iconUnmuted = Sprite.from("./images/unmuted.png");
            iconUnmuted.position.set(-30, -26);

            const iconMuted = Sprite.from("./images/muted.png");
            iconMuted.position.set(-30, -26);

            const buttonMute = new SongButton("", 110);
            buttonMute.position.set(855, 1010);
            buttonMute.addChild(buttonMute);

            if (!Manager.muted) {
                buttonMute.addChild(iconUnmuted);
            } else {
                buttonMute.addChild(iconMuted);
                buttonMute.setButtonColor2(0xF33302, 1);
            }

            buttonMute.eventMode = "static"
            buttonMute.alpha = 0.7;
            buttonMute.scale.set(0.9);
            this.addChild(buttonMute);
            buttonMute.on("pointerup", () => {
                if (!Manager.muted) {
                    sound.muteAll();
                    Manager.muted = true;
                    buttonMute.removeChild(iconUnmuted);
                    buttonMute.addChild(iconMuted);
                    buttonMute.setButtonColor2(0xF33302, 1);
                }
                else {
                    sound.unmuteAll();
                    Manager.muted = false;
                    buttonMute.removeChild(iconMuted);
                    buttonMute.addChild(iconUnmuted);
                    buttonMute.setButtonColor2(0xFFFFFF, 0.0001);
                }
            })

            const buttonFullscreen = new SongButton("", 110);
            buttonFullscreen.position.set(1130, 1010)
            buttonFullscreen.addChild(buttonFullscreen);
            buttonFullscreen.alpha = 0.7;
            const iconFullscreen = Sprite.from("./images/fullscreen.png");
            iconFullscreen.position.set(-28, -28);
            buttonFullscreen.addChild(iconFullscreen);
            buttonFullscreen.eventMode = "static"
            buttonFullscreen.scale.set(0.9);
            this.addChild(buttonFullscreen);
            buttonFullscreen.on("pointerup", () => {
                if (!document.fullscreenElement) {
                    if (document.documentElement.requestFullscreen) {
                        document.documentElement.requestFullscreen();
                    }
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    }
                }
            })


            new Tween(buttonMute)
                .to({ x: 280 }, 500)
                .start()
                .easing(Easing.Quintic.In)

            new Tween(buttonFullscreen)
                .to({ x: 450 }, 500)
                .start()
                .easing(Easing.Quintic.In)



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