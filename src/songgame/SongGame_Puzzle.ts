import { Container, Rectangle, Sprite, Text, Graphics, Texture } from "pixi.js";
import { IScene } from "../utils/IScene";
import { Manager } from "../utils/Manager";
import { SongButton } from "../UI/SongButton";
import { SongGame_LevelSelector } from "./SongGame_LevelSelector";
import { sound } from "@pixi/sound";
import { levels } from "./levels";
import { SongGame_Quiz } from "./SongGame_Quiz";

export class SongGame_Puzzle extends Container implements IScene {

    private isImageComplete: boolean;
    private isAnimating: boolean = false
    private specialPieceIndex: number;
    private imgSong: Sprite[];
    private puzzleContainer: Container;

    private circleMask: Graphics;
    private imgComplete: any
    private textScore: Text;
    private textHelp: Text;
    private textLevel: Text;
    private star: Sprite;

    constructor(img: string, difficulty: number) {
        super();

        this.imgComplete = img;

        // background + text help
        const background = Sprite.from("BlackWall");
        this.addChild(background);

        this.textHelp = new Text("GIRA LAS PIEZAS\nPARA FORMAR LA IMAGEN", {
            fontFamily: "Montserrat ExtraBold",
            fill: 0xFFFFFF,
            align: "center",
            fontSize: 20,
            lineHeight: 40,
            letterSpacing: 7
        });
        this.textHelp.anchor.set(0.5);
        this.textHelp.position.set(Manager.width / 2, 290)
        this.addChild(this.textHelp);

        // UI Back button
        const backButton = new SongButton("", 110);
        this.addChild(backButton);
        backButton.position.set(90, 90)
        const back = Sprite.from("BackArrow");
        back.position.set(-30, -28);
        back.scale.set(0.7, 0.7);
        backButton.addChild(back);
        backButton.on("pointerup", () => {
            sound.stopAll();
            Manager.changeScene(new SongGame_LevelSelector)
        });

        // UI SCORE
        this.star = Sprite.from("Star");
        this.star.anchor.set(0.5);
        this.star.scale.set(0.6);
        this.star.position.set(550, 75);
        this.addChild(this.star);

        this.textScore = new Text(Manager.score, {
            fontFamily: "Montserrat ExtraBold",
            fill: 0xFFFFFF,
            align: "center",
            fontSize: 50,
        });
        this.textScore.anchor.set(0.5);
        this.textScore.position.set(640, 75)
        this.addChild(this.textScore);

        // UI LEVEL
        const cinta = Sprite.from("Cinta");
        cinta.position.set(228, 103);
        this.addChild(cinta);

        this.textLevel = new Text(`NIVEL ${levels[Manager.currentLevel].name}`, {
            fontFamily: "Montserrat ExtraBold",
            fill: 0x000000,
            align: "center",
            fontSize: 30,
        });
        this.textLevel.anchor.set(0.5);
        this.textLevel.position.set(360, 136)
        this.addChild(this.textLevel);









        // Dividir la imagen en piezas
        const texture = Texture.from(img);
        const numPiecesX = difficulty; // Número de piezas en el eje X
        const numPiecesY = difficulty; // Número de piezas en el eje Y
        const pieceWidth = texture.width / numPiecesX; // Ancho de cada pieza
        const pieceHeight = texture.height / numPiecesY; // Alto de cada pieza
        const pieces: Texture[] = [];

        for (let y = 0; y < numPiecesY; y++) {
            for (let x = 0; x < numPiecesX; x++) {
                const pieceTexture = new Texture(
                    texture.baseTexture,
                    new Rectangle(
                        x * pieceWidth,
                        y * pieceHeight,
                        pieceWidth,
                        pieceHeight));
                pieces.push(pieceTexture);
            }
        }




        this.imgSong = pieces.map((pieceTexture, index) => {
            const sprite = new Sprite(pieceTexture);
            sprite.anchor.set(0.5);

            // Calcular las posiciones X e Y para centrar las piezas
            const offsetX = (Manager.width - pieceWidth * numPiecesX) / 2;
            const offsetY = (Manager.height - pieceHeight * numPiecesY) / 2 + 20;

            sprite.position.set(
                offsetX + (index % numPiecesX) * pieceWidth + pieceWidth / 2,
                offsetY + Math.floor(index / numPiecesX) * pieceHeight + pieceHeight / 2
            );

            sprite.eventMode = "static";
            sprite.cursor = 'pointer';

            const randomRotation = Math.floor(Math.random() * 4) * 90;
            sprite.angle = randomRotation;


            // función al clickear una pieza del puzzle
            sprite.on("pointerdown", () => {
                sound.play("Pip");

                if (this.isAnimating) {
                    return; // previene activación del botón durante animación
                }
                this.isAnimating = true; // Marcar que se está realizando una animación

                // activa animación de rotación
                const targetRotation = sprite.angle + 90;
                const duration = 0.1; // Duración de la animación en segundos
                const frames = 60; // Número de fotogramas para la animación
                const increment = (targetRotation - sprite.angle) / frames;
                if (index === this.specialPieceIndex && Manager.currentLevel > 9) {
                    const linkedPiece = this.getLinkedPiece(sprite);
                    this.animateRotation(sprite, targetRotation, duration, frames, increment);
                    this.animateRotation(linkedPiece, targetRotation, duration, frames, increment);
                } else {
                    this.animateRotation(sprite, targetRotation, duration, frames, increment);
                }
            });

            sprite.on("mouseover", () => { sprite.tint = 0xffdfc2 })
                .on("mouseout", () => { sprite.tint = 0xFFFFFF })

            return sprite;
        });
        // END this.imgSong = pieces.map((pieceTexture, index)

        this.puzzleContainer = new Container();
        this.puzzleContainer.pivot.set(360, 660);
        this.puzzleContainer.position.set(360, 660);

        this.puzzleContainer.addChild(...this.imgSong);

        this.addChild(this.puzzleContainer);

        this.isImageComplete = false;
        this.specialPieceIndex = Math.floor(Math.random() * this.imgSong.length);

        this.circleMask = new Graphics();
        this.circleMask.beginFill(0xFFFFFF, 0.00001);

        this.circleMask.drawCircle(360, 660, 272)
        this.addChild(this.circleMask);
    }











    update(_deltaTime: number, _deltaFrame: number): void {
        if (this.isImageComplete) {
            this.puzzleContainer.angle += 0.1 * _deltaTime;
        };



    }













    private checkComplete(): void {
        const tolerance = 5; // Rango de tolerancia en grados
        const isComplete = this.imgSong.every(sprite => Math.abs(sprite.angle % 360) <= tolerance);
        this.isImageComplete = isComplete;

        if (this.isImageComplete) {
            this.puzzleCompleted();
        }
    }

    private puzzleCompleted(): void {
        this.starRotation();
        Manager.levelsAvailable[Manager.currentLevel + 1] = true;
        this.textHelp.text = "ESCUCHA Y MEMORIZA\nEL NOMBRE DE LA BANDA";
        Manager.score++;
        this.textScore.text = Manager.score;
        sound.play("Correct");
        this.disableButtons();
        const texty: Text = new Text(
            levels[Manager.currentLevel].song.band,
            {
                fontFamily: "Montserrat ExtraBold",
                fill: 0xFFFFFF,
                align: "center",
                fontSize: 50,
                lineHeight: 50,
            });
        texty.anchor.set(0.5);
        texty.position.set(Manager.width / 2, 1005)
        this.addChild(texty);

        // Crear botón que lleva al siguiente nivel y actualiza variable currentLevel
        const button1 = new SongButton("Siguiente nivel", 500);
        button1.setButtonColor(0x00C18C);
        button1.position.set(Manager.width / 2, 1170)
        button1.on("pointerup", () => {
            if (levels[Manager.currentLevel + 1].isPuzzle) {
                sound.stopAll();
                Manager.currentLevel++;
                Manager.changeScene(new SongGame_Puzzle(levels[Manager.currentLevel].song.img, levels[Manager.currentLevel].difficulty));
                sound.play(levels[Manager.currentLevel].song.audio);
            } else {
                sound.stopAll();
                Manager.currentLevel++;
                Manager.changeScene(new SongGame_Quiz(levels[Manager.currentLevel].options, levels[Manager.currentLevel].difficulty));
            }
        })
        this.addChild(button1);

        // Añadir botón de reproducción central
        const circleGraphics = new Graphics();
        circleGraphics.beginFill(0x000000, 0.3);
        circleGraphics.lineStyle(4, 0xFFFFFF);
        circleGraphics.drawCircle(0, 0, 60);
        circleGraphics.endFill;
        circleGraphics.position.set(Manager.width / 2, 660)
        this.addChild(circleGraphics);
        const playIcon = Sprite.from("Next");
        playIcon.scale.set(0.7);
        playIcon.anchor.set(0.5);
        playIcon.x = 5
        circleGraphics.addChild(playIcon)
        circleGraphics.eventMode = "static";
        circleGraphics.cursor = "pointer";
        circleGraphics.on("pointerup", () => {
            sound.stopAll(),
                sound.play(levels[Manager.currentLevel].song.audio)
        });

        // mask

        this.puzzleContainer.removeChildren();
        const imgComplete = Sprite.from(this.imgComplete);
        imgComplete.anchor.set(0.5);
        imgComplete.position.set(360, 660);
        this.puzzleContainer.addChild(imgComplete);
        this.puzzleContainer.mask = this.circleMask;
    }



    private disableButtons(): void {
        this.imgSong.forEach(sprite => {
            sprite.tint = 0xFFFFFF;
            sprite.eventMode = "none";
        });
    }


    private getLinkedPiece(piece: Sprite): Sprite {
        const index = this.imgSong.indexOf(piece);
        const linkedIndex = (index + 1) % this.imgSong.length; // Calcula el índice de la pieza vinculada
        return this.imgSong[linkedIndex];
    }

    private animateRotation(sprite: Sprite, targetRotation: number, duration: number, frames: number, increment: number): void {
        let currentFrame = 0;
        const animation = setInterval(() => {
            sprite.angle += increment;
            currentFrame++;

            if (currentFrame >= frames) {
                clearInterval(animation);
                this.isAnimating = false; // Marcar que la animación ha finalizado
                this.checkComplete();
            } else if (sprite.angle === targetRotation) {
                clearInterval(animation);
                this.isAnimating = false; // Marcar que la animación ha finalizado
                this.checkComplete();
            }
        }, duration * 1000 / frames);
    }

    private starRotation(): void {
        const targetRotation = this.star.rotation + Math.PI * 2; // Giro completo de 360 grados en radianes
        const frames = 60; // Número de fotogramas para completar la animación
        const increment = (targetRotation - this.star.rotation) / frames;

        let currentFrame = 0;
        const rotationAnimation = setInterval(() => {
            this.star.rotation += increment;
            currentFrame++;

            if (currentFrame >= frames) {
                clearInterval(rotationAnimation);
                // La animación ha finalizado, puedes realizar alguna acción adicional aquí si es necesario
            }
        }, 16.67); // Aproximadamente 60 fotogramas por segundo (1000 ms / 60 = 16.67)
    }

}