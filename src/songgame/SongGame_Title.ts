import { Assets, Container, Graphics, Sprite, Text } from "pixi.js";
import { IScene } from "../utils/IScene";
import { Manager } from "../utils/Manager";
import { SongButton } from "../UI/SongButton";
import '@pixi/gif';
import { sound } from '@pixi/sound';
import { SongGame_LevelSelector } from "./SongGame_LevelSelector";
// import { exit } from '@tauri-apps/api/process';
// import { appWindow } from '@tauri-apps/api/window';

export class SongGame_Title extends Container implements IScene {
    private titleLogo: Sprite;
    private buttonHighlight: Graphics;

    constructor() {
        super();

        sound.play("Guitar");

        const titleBackground = Sprite.from("TitleBackground");
        this.addChild(titleBackground);

        this.titleLogo = Sprite.from("TitleLogo");
        this.titleLogo.anchor.set(0.5);
        this.titleLogo.position.set(Manager.width / 2, 550);
        this.addChild(this.titleLogo);

        const rayo1 = Assets.get("Rayo");
        rayo1.position.set(40, 700);
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
            const newScene = new SongGame_LevelSelector();
            Manager.changeScene(newScene);
        })


        // const button2 = new SongButton("Pantalla completa", 500);
        // button2.position.set(Manager.width / 2, 1075);
        // this.addChild(button2);
        // button2.on("pointerup", async () => {
        //     //@ts-expect-error Tauri is injected in Tauri apps.
        //     if (window.__TAURI__) {
        //         const isFull = await appWindow.isFullscreen();
        //         await appWindow.setFullscreen(!isFull);
        //     }
        // })

        // const button3 = new SongButton("Salir del juego", 500);
        // button3.position.set(Manager.width / 2, 1200);
        // this.addChild(button3);
        // button3.on("pointerup", () => {
        //     //@ts-expect-error Tauri is injected in Tauri apps.
        //     if (window.__TAURI__) { exit() };
        // })


        this.buttonHighlight = new Graphics();
        this.buttonHighlight.beginFill(0xFFFFFF);
        this.buttonHighlight.drawRect(-250, -55, 500, 110);
        button.addChild(this.buttonHighlight);


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

    currentTime = 0; // Tiempo actual para el cálculo de la escala

    update(deltaTime: number, _deltaFrame: number): void {

        const scaleMin = 0.97; // Escala mínima del objeto
        const scaleMax = 1.03; // Escala máxima del objeto
        const beatDuration = 800; // Duración de un latido en milisegundos

        this.currentTime += deltaTime;

        const t = (this.currentTime % beatDuration) / beatDuration;
        const scale = scaleMin + Math.abs(Math.sin(t * Math.PI)) * (scaleMax - scaleMin);

        this.titleLogo.scale.set(scale);

        this.buttonHighlight.alpha = Math.abs(Math.sin(t * Math.PI)) * 0.3

    }
}