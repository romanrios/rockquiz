import { Assets, Container, Sprite, Text } from "pixi.js";
import { IScene } from "../utils/IScene";
import { Manager } from "../utils/Manager";
import { SongButton } from "../UI/SongButton";
import { sound } from '@pixi/sound';
import '@pixi/gif';
import { songs } from "./songs";
import { SongGame_LevelSelector } from "./SongGame_LevelSelector";
import { ScoreUI } from "../UI/ScoreUI";
import { ButtonBack } from "../UI/ButtonBack";
import { Tween } from "tweedle.js";
import { LevelTitle } from "../UI/LevelTitle";
import { SongGame_Finish } from "./SongGame_Finish";

export class SongGame_Quiz extends Container implements IScene {
    private bg: Sprite;
    private counter: number;
    private counterCorrect: number;
    private texty: Text = new Text;
    private textHelp: Text;
    private nivelCompletado: Sprite = new Sprite;
    private star1: Sprite = Sprite.from("Star2");
    private star2: Sprite = Sprite.from("Star2");
    private star3: Sprite = Sprite.from("Star2");
    private star4: Sprite = Sprite.from("Star2");
    private numeroDePregunta: number = 1;
    private scoreUI: ScoreUI;
    regresar: ButtonBack;

    constructor(options: any, level: number) {
        super();

        // Background + Text help
        this.bg = Sprite.from("QuizBackground");
        this.bg.anchor.set(0.5);
        this.bg.position.set(Manager.width / 2, Manager.height / 2);
        this.addChild(this.bg);

        new Tween(this.bg)
            .to({ alpha: 0.8 }, 1000)
            .repeat(Infinity)
            .start()
            .yoyo(true)

        this.textHelp = new Text("ADIVINA LA BANDA", {
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

        // UI SCORE
        this.scoreUI = new ScoreUI;
        this.addChild(this.scoreUI);

        // UI Back button
        this.regresar = new ButtonBack;
        this.regresar.on("pointerup", () => {
            sound.stopAll();
            Manager.changeScene(new SongGame_LevelSelector())
        });
        this.addChild(this.regresar);

        // UI LEVEL        
        const levelTitle = new LevelTitle();
        this.addChild(levelTitle);

        this.star1.position.set(175, 670);
        this.star2.position.set(285, 670);
        this.star3.position.set(395, 670);
        this.star4.position.set(505, 670);

        this.star1.scale.set(1.2);
        this.star2.scale.set(1.2);
        this.star3.scale.set(1.2);
        this.star4.scale.set(1.2);

        // Función Generar Pregunta
        const NUMERO_OPCIONES = options; // Número total de opciones por pregunta
        this.counter = 4 - 1 // CANTIDAD DE PREGUNTAS !!
        this.counterCorrect = 0
        const opcionesCorrectasYaElegidas: number[] = []

        const generarPregunta = () => {
            const opciones = [];
            const opcionesIndices = [];

            // Obtiene una canción aleatoria como la opción correcta
            let indiceCorrecto = getRandomInteger(0, /*songs.length*/ level - 1);

            // Verifica que no se repita y actualiza los arreglos
            while (opcionesCorrectasYaElegidas.includes(indiceCorrecto)) {
                indiceCorrecto = getRandomInteger(0, /*songs.length*/ level - 1);
            }
            opcionesCorrectasYaElegidas.push(indiceCorrecto)
            const cancionCorrecta = songs[indiceCorrecto];
            opciones.push(cancionCorrecta);
            opcionesIndices.push(indiceCorrecto);

            // Genera opciones incorrectas hasta alcanzar el número total de opciones
            while (opciones.length < NUMERO_OPCIONES) {
                const indiceIncorrecto = getRandomInteger(0, /*songs.length*/level - 1);
                // Verifica que el índice no esté repetido y no sea el índice de la opción correcta
                if (!opcionesIndices.includes(indiceIncorrecto) && indiceIncorrecto !== indiceCorrecto) {
                    opciones.push(songs[indiceIncorrecto]);
                    opcionesIndices.push(indiceIncorrecto);
                }
            }

            // GIF DE ONDAS
            const soundWave = Assets.get('SoundWave');
            sound.play(cancionCorrecta.audio);
            soundWave.alpha = 0.8;
            soundWave.anchor.set(0.5);
            soundWave.position.set(Manager.width / 2, 388)
            soundWave.eventMode = 'static';
            soundWave.cursor = 'pointer';
            let isPlaying = true;
            soundWave.onpointerup = () => {
                if (isPlaying) {
                    soundWave.alpha = 0.3;
                    sound.stopAll();
                    isPlaying = false;
                } else {
                    soundWave.alpha = 0.8;
                    sound.play(cancionCorrecta.audio)
                    isPlaying = true;
                }
            }
            this.addChild(soundWave);


            const answerPositions = [655, 805, 955, 1105]; // Posiciones verticales de los botones

            opciones.sort(() => Math.random() - 0.5); // Reordena aleatoriamente las opciones

            const buttonsContainer = new Container();
            this.addChild(buttonsContainer);

            opciones.forEach((opcion, i) => {
                const button: SongButton = new SongButton(opcion.band, 500);
                button.position.set(Manager.width / 2, answerPositions[i]);

                button.onpointerup = () => {

                    if (opcion === cancionCorrecta) {
                        this.scoreUI.animacion();
                        Manager.score++;
                        this.scoreUI.actualizarPuntaje();
                        this.counterCorrect += 1;
                        button.setButtonColor(0x00C18C);
                        this.eventMode = "none";
                        sound.play("Correct");


                        if (this.numeroDePregunta == 1) {
                            new Tween(this.star1)
                                .to({ y: this.star1.y - 10 }, 300 * Math.random() + 800)
                                .start()
                                .yoyo(true)
                                .repeat(Infinity)

                        } if (this.numeroDePregunta == 2) {
                            new Tween(this.star2)
                                .to({ y: this.star1.y - 10 }, 300 * Math.random() + 800)
                                .start()
                                .yoyo(true)
                                .repeat(Infinity)

                        } if (this.numeroDePregunta == 3) {
                            new Tween(this.star3)
                                .to({ y: this.star1.y - 10 }, 300 * Math.random() + 800)
                                .start()
                                .yoyo(true)
                                .repeat(Infinity)

                        } if (this.numeroDePregunta == 4) {
                            new Tween(this.star4)
                                .to({ y: this.star1.y - 10 }, 300 * Math.random() + 800)
                                .start()
                                .yoyo(true)
                                .repeat(Infinity)
                        }

                    }

                    if (opcion !== cancionCorrecta) {
                        button.setButtonColor(0xF33302);
                        this.eventMode = "none";
                        sound.play("Wrong");

                        if (this.numeroDePregunta == 1) {
                            this.star1.alpha = 0.2;
                        } if (this.numeroDePregunta == 2) {
                            this.star2.alpha = 0.2;
                        } if (this.numeroDePregunta == 3) {
                            this.star3.alpha = 0.2;
                        } if (this.numeroDePregunta == 4) {
                            this.star4.alpha = 0.2;
                        }
                    }

                    this.numeroDePregunta++;

                    // función con retardo de 1 segundo
                    setTimeout(() => {
                        this.removeChild(buttonsContainer);
                        sound.stopAll();

                        if (this.counter > 0) {
                            generarPregunta();
                        }
                        this.counter -= 1
                        this.eventMode = "static"

                        if (this.counter < 0) {
                            Manager.levelsAvailable[Manager.currentLevel + 1] = true;
                            const button1 = new SongButton("Siguiente", 500);
                            button1.setButtonColor(0x00C18C);
                            button1.position.set(Manager.width / 2, 1005)

                            // define cual es el puzzle del nivel siguiente

                            button1.on("pointerup", () => {
                                if (Manager.currentLevel == 49) {
                                    Manager.changeScene(new SongGame_Finish);
                                } else {
                                    Manager.changeScene(new SongGame_LevelSelector);
                                }
                            });

                            this.addChild(button1);
                            this.removeChild(soundWave);
                            this.removeChild(this.textHelp);

                            this.nivelCompletado = Sprite.from("NivelCompletado");
                            this.nivelCompletado.anchor.set(0.5);
                            this.nivelCompletado.position.set(Manager.width / 2, 440);
                            this.addChild(this.nivelCompletado);

                            new Tween(this.nivelCompletado.scale)
                                .to({ x: 1.03, y: 1.03 }, 400)
                                .start()
                                .yoyo(true)
                                .repeat(Infinity)

                            this.addChild(this.star1);
                            this.addChild(this.star2);
                            this.addChild(this.star3);
                            this.addChild(this.star4);

                            this.texty = new Text(
                                `ACERTASTE ${this.counterCorrect} DE 4`,
                                {
                                    fontFamily: "Montserrat ExtraBold",
                                    fill: 0xFFFFFF,
                                    align: "center",
                                    fontSize: 28,
                                    lineHeight: 45,
                                    letterSpacing: 6
                                });
                            this.texty.anchor.set(0.5);
                            this.texty.position.set(Manager.width / 2, 780)
                            this.addChild(this.texty);
                            sound.play("Cheer");

                        }

                    }, 1000);

                }
                buttonsContainer.addChild(button);
                button.name = `button${i}`;
            });
            //END opciones.forEach
        }
        // END funcion generarPregunta

        function getRandomInteger(min: number, max: number): number {
            return Math.round(Math.random() * (max - min) + min);
        }

        generarPregunta();
    }


    update(_deltaTime: number, _deltaFrame: number): void {
    }
}