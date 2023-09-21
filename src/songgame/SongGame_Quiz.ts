import { Assets, Container, Sprite, Text } from "pixi.js";
import { IScene } from "../utils/IScene";
import { Manager } from "../utils/Manager";
import { SongButton } from "../UI/SongButton";
import { sound } from '@pixi/sound';
import '@pixi/gif';
import { songs } from "./songs";
import { SongGame_LevelSelector } from "./SongGame_LevelSelector";
import { levels } from "./levels";

export class SongGame_Quiz extends Container implements IScene {
    private bg: Sprite;
    private counter: number;
    private counterCorrect: number;
    private counterWrong: number;
    private texty: Text = new Text;
    private textScore: Text;
    private textHelp: Text;
    private textLevel: Text;
    private star: Sprite;

    constructor(options: any, level: number) {
        super();
        










        // Background + Text help
        this.bg = Sprite.from("QuizBackground");
        this.bg.anchor.set(0.5),
            this.bg.position.set(Manager.width / 2, Manager.height / 2)
        this.addChild(this.bg);

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

        // UI LEVEL
        const cinta = Sprite.from("Cinta");
        cinta.position.set(228,103);
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












        // Función Generar Pregunta
        const NUMERO_OPCIONES = options; // Número total de opciones por pregunta
        this.counter = 4 - 1 // CANTIDAD DE PREGUNTAS !!
        this.counterCorrect = 0
        this.counterWrong = 0
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


            const answerPositions = [650, 800, 950, 1100]; // Posiciones verticales de los botones

            opciones.sort(() => Math.random() - 0.5); // Reordena aleatoriamente las opciones

            const buttonsContainer = new Container();
            this.addChild(buttonsContainer);

            opciones.forEach((opcion, i) => {
                const button: SongButton = new SongButton(opcion.band, 500);
                button.position.set(Manager.width / 2, answerPositions[i]);

                button.onpointerup = () => {

                    if (opcion === cancionCorrecta) {
                        this.starRotation();
                        Manager.score++;
                        this.textScore.text=Manager.score;
                        this.counterCorrect += 1;
                        button.setButtonColor(0x00C18C);
                        this.eventMode = "none";
                        sound.play("Correct");
                    }

                    if (opcion !== cancionCorrecta) {
                        this.counterWrong += 1;
                        button.setButtonColor(0xF33302);
                        this.eventMode = "none";
                        sound.play("Wrong");
                    }

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
                            Manager.levelsAvailable[Manager.currentLevel+1]=true;
                            const button1 = new SongButton("Siguiente", 500);
                            button1.setButtonColor(0x00C18C);
                            button1.position.set(Manager.width / 2, 1005)

                            // define cual es el puzzle del nivel siguiente
                            button1.on("pointerup", () => {
                                Manager.changeScene(new SongGame_LevelSelector);
                                // if (levels[Manager.currentLevel + 1].isPuzzle) {
                                //     sound.stopAll();
                                //     Manager.currentLevel++;
                                //     Manager.changeScene(
                                //         new SongGame_Puzzle(
                                //             levels[Manager.currentLevel].song.img,
                                //             levels[Manager.currentLevel].difficulty));
                                //     sound.play(
                                //         levels[Manager.currentLevel].song.audio);
                                // }
                                // if (!levels[Manager.currentLevel + 1].isPuzzle) {
                                //     sound.stopAll();
                                //     Manager.currentLevel++;
                                //     Manager.changeScene(
                                //         new SongGame_Quiz(
                                //             levels[Manager.currentLevel].options,
                                //             levels[Manager.currentLevel].difficulty));
                                // }
                            })

                            this.addChild(button1);
                            this.removeChild(soundWave);
                            this.removeChild(this.textHelp);

                            this.texty = new Text(
                                `NIVEL COMPLETADO\n\nRespuestas correctas: ${this.counterCorrect}\n\nRespuestas Incorrectas: ${this.counterWrong}`,
                                {
                                    fontFamily: "Montserrat ExtraBold",
                                    fill: 0xFFFFFF,
                                    align: "center",
                                    fontSize: 40,
                                    lineHeight: 39
                                });
                            this.texty.anchor.set(0.5);
                            this.texty.position.set(Manager.width / 2, 700)
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
    











    // UPDATE ANIMACION NIVEL COMPLEADO
    currentTime = 0; // Tiempo actual para el cálculo de la escala
    update(deltaTime: number, _deltaFrame: number): void {
        const scaleMin = 0.97; // Escala mínima del objeto
        const scaleMax = 1.03; // Escala máxima del objeto
        const beatDuration = 800; // Duración de un latido en milisegundos
        this.currentTime += deltaTime;
        const t = (this.currentTime % beatDuration) / beatDuration;
        const scale = scaleMin + Math.abs(Math.sin(t * Math.PI)) * (scaleMax - scaleMin);
        this.texty.scale.set(scale);
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