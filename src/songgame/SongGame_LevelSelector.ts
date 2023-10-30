import { Container, Graphics, Sprite, Text } from "pixi.js";
import { IScene } from "../utils/IScene";
import { SongButton } from "../UI/SongButton";
import { Manager } from "../utils/Manager";
import { sound } from "@pixi/sound";
import { levels } from "./levels";
import { SongGame_Puzzle } from "./SongGame_Puzzle";
import { SongGame_Quiz } from "./SongGame_Quiz";
import { ScoreUI } from "../UI/ScoreUI";
import { ButtonBack } from "../UI/ButtonBack";
import { SongGame_Title } from "./SongGame_Title";
import { Tween, Easing } from "tweedle.js"

export class SongGame_LevelSelector extends Container implements IScene {

    private buttons: SongButton[];
    private dragData: any | null = null;
    private dragStartY: number;
    private isDragging: boolean = false;
    private rayo2: Sprite;
    private rayo1: Sprite;
    private buttonHighlight: Graphics;
    private scoreUI: ScoreUI;

    constructor() {
        super();

        this.y = -1200;

        new Tween(this)
            .to({ y: 0 }, 600)
            .start()
            .easing(Easing.Quintic.Out)


        // Fondo y botón Regresar
        const background = Sprite.from("BlackPaper");
        this.addChild(background);

        const background2 = Sprite.from("BlackPaper");
        background2.scale.y = -1;
        background2.position.set(0, 2560);
        this.addChild(background2);

        const levelSelectorBanner = Sprite.from("LevelSelectorBanner");
        this.addChild(levelSelectorBanner);

        // UI Back button
        const regresar = new ButtonBack;
        regresar.on("pointerup", () => {
            sound.stopAll();
            Manager.changeScene(new SongGame_Title)
        });
        this.addChild(regresar);

        // UI SCORE
        this.scoreUI = new ScoreUI;
        this.addChild(this.scoreUI);

        const texty = new Text("N I V E L E S", {
            fontFamily: "Montserrat ExtraBold",
            fill: 0xFFFFFF,
            align: "center",
            fontSize: 27,
            lineHeight: 39
        });
        texty.anchor.set(0.5);
        texty.position.set(Manager.width / 2, 430);
        this.addChild(texty);

        // rayos 
        this.rayo1 = Sprite.from("Rayo2");
        this.rayo1.position.set(80, 405);
        this.rayo1.scale.x = 0.9
        this.addChild(this.rayo1);

        new Tween(this.rayo1.scale)
            .to({ x: 1.1 }, 400)
            .start()
            .yoyo(true)
            .repeat(Infinity)

        this.rayo2 = Sprite.from("Rayo2");
        this.rayo2.position.set(640, 405);
        this.rayo2.scale.x = -0.9;
        this.addChild(this.rayo2);

        new Tween(this.rayo2.scale)
            .to({ x: -1.1 }, 400)
            .start()
            .yoyo(true)
            .repeat(Infinity)

        this.buttonHighlight = new Graphics();
        this.buttonHighlight.beginFill(0xFFFFFF);
        this.buttonHighlight.drawRect(-55, -55, 110, 110);
        this.buttonHighlight.alpha = 0;

        new Tween(this.buttonHighlight)
            .to({ alpha: 0.3 }, 400)
            .start()
            .repeat(Infinity)
            .yoyo(true)

        // Calcular posición inicial en x para centrar el grupo de botones
        const buttonWidth = 110;
        const buttonHeight = 110;
        const buttonSpacingX = 120;
        const buttonSpacingY = 140;

        const startX = 120;
        let currentX = startX;
        let currentY = 580;

        // Generar los botones alimentados del array "levels"
        this.buttons = [];
        levels.forEach((levels, index) => {
            const button = new SongButton(levels.name, buttonWidth);
            this.addChild(button);
            button.width = buttonWidth;
            button.height = buttonHeight;
            button.position.set(currentX, currentY);

            //  Verifica si el nivel está dispónible
            if (!Manager.levelsAvailable[index]) {
                button.alpha = 0.3;
                button.eventMode = "none";
            }

            if (Manager.levelsAvailable[index] && !Manager.levelsAvailable[index + 1]) {
                button.addChild(this.buttonHighlight);
            }


            if (levels.isPuzzle) {
                button.on("pointerup", () => {
                    if (!this.isDragging) {
                        sound.stopAll();
                        Manager.currentLevel = index;
                        Manager.changeScene(new SongGame_Puzzle(levels.song.img, levels.difficulty));
                        sound.play(levels.song.audio);
                    }
                });
                this.buttons.push(button);
            }

            if (!levels.isPuzzle) {
                button.rectangle.tint = 0xF33302;
                button.on("pointerup", () => {
                    if (!this.isDragging) {
                        sound.stopAll();
                        Manager.currentLevel = index;
                        Manager.changeScene(new SongGame_Quiz(levels.options, levels.difficulty, false));
                    }
                });
                this.buttons.push(button);
            }

            currentX += buttonSpacingX;

            if ((index + 1) % 5 === 0) {
                currentX = startX;
                currentY += buttonSpacingY;
            }
        });

        // dragging
        this.eventMode = "static";
        this.dragStartY = 0;

        this.on("pointerdown", this.onDragStart)
            .on("pointerup", this.onDragEnd)
            .on("pointerupoutside", this.onDragEnd)
            .on("pointermove", this.onDragMove)
            .on("wheel", this.onMouseWheel);


    }


    update(_deltaTime: number, _deltaFrame: number): void {
    }


    private onDragStart(event: any): void {
        this.dragData = event.data;
        this.dragStartY = this.dragData.global.y;
    }

    private onDragMove(): void {
        if (this.dragData) {
            const newY = this.dragData.global.y;
            const deltaY = newY - this.dragStartY;

            this.y += deltaY;
            this.dragStartY = newY;

            setTimeout(() => { this.isDragging = true }, 10)

            if (this.y > 0) {
                this.y = 0;
            }

            if (this.y < -700) {
                this.y = -700;
            }
        }

    }

    private onDragEnd(): void {
        this.dragData = null;
        if (this.y > 0) {
            this.y = 0;
        }
        setTimeout(() => {
            this.isDragging = false;;
        }, 10);

    }

    private onMouseWheel(event: WheelEvent): void {
        const deltaY = event.deltaY;
        this.y -= deltaY;
        if (this.y > 0) {
            this.y = 0;
        }

        if (this.y < -700) {
            this.y = -700;
        }
    }

}


