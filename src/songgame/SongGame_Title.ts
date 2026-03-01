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

            const menuButtonsConfig = [
                {
                    label: "Juego Principal",
                    index: 0,
                    fromLeft: true,
                    onClick: () => {
                        Manager.changeScene(new SongGame_LevelSelector());
                    }
                },
                {
                    label: "Quiz Definitivo",
                    index: 1,
                    fromLeft: false,
                    onClick: () => {
                        sound.stopAll();
                        Manager.changeScene(new SongGame_Quiz(4, 40, true));
                    }
                },
                {
                    label: "Galería de Bandas",
                    index: 2,
                    fromLeft: true,
                    onClick: () => {
                        Manager.changeScene(new SongGame_Gallery());
                    }
                }
            ];

            const menuBaseY = 550;
            const menuSpacingY = 150;
            const menuTargetX = Manager.width / 2;

            menuButtonsConfig.forEach((cfg) => {
                const buttonMenu = new SongButton(cfg.label, 500);
                const startX = cfg.fromLeft ? -300 : Manager.width + 300;
                const y = menuBaseY + cfg.index * menuSpacingY;

                buttonMenu.position.set(startX, y);
                buttonMenu.on("pointerup", cfg.onClick);
                this.addChild(buttonMenu);

                if (cfg.index === 0) {
                    buttonMenu.addChild(this.buttonHighlight);
                }

                new Tween(buttonMenu)
                    .to({ x: menuTargetX }, 500)
                    .start()
                    .easing(Easing.Quintic.In);
            });


            const iconUnmuted = Sprite.from("./images/unmuted.png");
            iconUnmuted.position.set(-30, -26);

            const iconMuted = Sprite.from("./images/muted.png");
            iconMuted.position.set(-30, -26);

            const buttonMute = new SongButton("", 110);
            const utilityButtonsY = 1010;
            buttonMute.position.set(Manager.width + 300, utilityButtonsY);
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
            buttonFullscreen.position.set(Manager.width + 300, utilityButtonsY);
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

            const openResetModal = () => {
                const overlay = new Container();
                overlay.eventMode = "static";

                const dimBackground = new Graphics();
                dimBackground.beginFill(0x000000, 0.95);
                dimBackground.drawRect(0, 0, Manager.width, Manager.height);
                dimBackground.endFill();
                dimBackground.alpha = 0;
                overlay.addChild(dimBackground);

                const centerX = Manager.width / 2;
                const centerY = Manager.height / 2;

                const dialogContainer = new Container();
                dialogContainer.position.set(centerX, centerY);
                dialogContainer.scale.set(0.4);
                overlay.addChild(dialogContainer);

                // const panel = new Graphics();
                // panel.beginFill(0x000000, 0.9);
                // panel.drawRoundedRect(-260, -120, 520, 230, 20);
                // panel.endFill();
                // dialogContainer.addChild(panel);

                const title = new Text("¿BORRAR TODO EL PROGRESO?", {
                    fontFamily: "Montserrat ExtraBold",
                    fill: 0xFFFFFF,
                    align: "center",
                    fontSize: 28,
                    lineHeight: 46,
                    letterSpacing: 6
                });
                title.anchor.set(0.5);
                title.position.set(0, -60);
                dialogContainer.addChild(title);

                const confirmButton = new SongButton("SÍ, BORRAR", 300);
                confirmButton.position.set(-140, 60);
                confirmButton.scale.set(0.8);
                confirmButton.setButtonColor(0x00C18C);
                dialogContainer.addChild(confirmButton);
                confirmButton.on("pointerup", () => {
                    Manager.resetProgress();
                    Manager.changeScene(new SongGame_Title());
                });

                const cancelButton = new SongButton("CANCELAR", 300);
                cancelButton.position.set(140, 60);
                cancelButton.scale.set(0.8);
                cancelButton.setButtonColor(0x555555);
                dialogContainer.addChild(cancelButton);
                cancelButton.on("pointerup", () => {
                    overlay.destroy({ children: true });
                });

                this.addChild(overlay);

                new Tween(dimBackground)
                    .to({ alpha: 1 }, 250)
                    .start()
                    .easing(Easing.Quadratic.InOut);

                new Tween(dialogContainer.scale)
                    .to({ x: 1, y: 1 }, 350)
                    .start()
                    .easing(Easing.Back.Out);
            };

            const buttonReset = new SongButton("Borrar\nProgreso", 240);
            buttonReset.position.set(Manager.width + 300, utilityButtonsY);
            buttonReset.alpha = 0.7;
            buttonReset.scale.set(0.8);
            buttonReset.setLabelOffsetY(-4);
            this.addChild(buttonReset);
            buttonReset.on("pointerup", () => {
                sound.stopAll();
                openResetModal();
            });


            const muteWidth = 110;
            const fullscreenWidth = 110;
            const resetWidth = 240;
            const spacing = 20;

            const groupWidth = muteWidth + fullscreenWidth + resetWidth + spacing * 2;
            const groupStartX = Manager.width / 2 - groupWidth / 2;

            const muteTargetX = groupStartX + muteWidth / 2;
            const fullscreenTargetX = muteTargetX + muteWidth / 2 + spacing + fullscreenWidth / 2;
            const resetTargetX = fullscreenTargetX + fullscreenWidth / 2 + spacing + resetWidth / 2;

            new Tween(buttonMute)
                .to({ x: muteTargetX }, 500)
                .start()
                .easing(Easing.Quintic.In)

            new Tween(buttonFullscreen)
                .to({ x: fullscreenTargetX }, 500)
                .start()
                .easing(Easing.Quintic.In)

            new Tween(buttonReset)
                .to({ x: resetTargetX }, 500)
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