import { Capacitor } from "@capacitor/core";
import { Keyboard } from "./utils/Keyboard";
import { LoaderScene } from "./utils/LoaderScene";
import { Manager } from "./utils/Manager";
import { StatusBar } from "@capacitor/status-bar";
import { NavigationBar } from "@hugotomazi/capacitor-navigation-bar";
import { KeepAwake } from "@capacitor-community/keep-awake";
import { App } from "@capacitor/app";

// Scale mode for all textures, will retain pixelation
// BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;

Manager.initialize(720, 1280, 0x0d0d0d);
Keyboard.initialize();

// We no longer need to tell the scene the size because we can ask Manager!
const loady: LoaderScene = new LoaderScene();
Manager.changeScene(loady);

window.addEventListener("contextmenu", e => e.preventDefault());

if (Capacitor.isNativePlatform()) {
    StatusBar.hide();
    NavigationBar.hide();
    KeepAwake.keepAwake();
    App.addListener("appStateChange", (e) => {
        if (e.isActive) {
            // resumo el juego
        } else {
            // pauso el juego
        }
    })
}