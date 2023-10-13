import { Keyboard } from "./utils/Keyboard";
import { LoaderScene } from "./utils/LoaderScene";
import { Manager } from "./utils/Manager";

// Scale mode for all textures, will retain pixelation
// BaseTexture.defaultOptions.scaleMode = SCALE_MODES.NEAREST;

Manager.initialize(720, 1280, 0x0d0d0d);
Keyboard.initialize();

// We no longer need to tell the scene the size because we can ask Manager!
const loady: LoaderScene = new LoaderScene();
Manager.changeScene(loady);

