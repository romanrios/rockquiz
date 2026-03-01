import { Application, Ticker } from "pixi.js";
import { IScene } from "./IScene";
import { Group } from "tweedle.js";

export class Manager {
    static muted: boolean = false;

    private constructor() { /*this class is purely static. No constructor to see here*/ }

    // Safely store variables for our game
    private static app: Application;
    private static currentScene: IScene;

    private static readonly SAVE_KEY = "quiz_game_save_data";

    // QUIZGAME Current level & score variable getter and setter
    private static _currentLevel: number = 0;
    private static _score: number = 0;
    private static _levelsAvailable: boolean[] = [];



    public static get currentLevel(): number {
        return Manager._currentLevel;
    }
    public static set currentLevel(value: number) {
        Manager._currentLevel = value;
    }

    public static get score(): number {
        return Manager._score;
    }
    public static set score(value: number) {
        Manager._score = value;
        Manager.saveToLocalStorage();
    }

    public static get levelsAvailable(): boolean[] {
        return Manager._levelsAvailable;
    }
    public static set levelsAvailable(value: boolean[]) {
        Manager._levelsAvailable = value;
    }

    public static unlockLevel(index: number): void {
        if (index < 0) {
            return;
        }
        // Ensure the levels array has the expected length
        if (Manager._levelsAvailable.length < 51) {
            const filled = new Array<boolean>(51).fill(false);
            for (let i = 0; i < Manager._levelsAvailable.length && i < 51; i++) {
                filled[i] = !!Manager._levelsAvailable[i];
            }
            Manager._levelsAvailable = filled;
        }

        if (index >= Manager._levelsAvailable.length) {
            return;
        }

        if (!Manager._levelsAvailable[index]) {
            Manager._levelsAvailable[index] = true;
            Manager.saveToLocalStorage();
        }
    }

    public static resetProgress(): void {
        // Reset in-memory progress
        Manager._score = 0;
        Manager._levelsAvailable = new Array(51).fill(false);
        Manager._levelsAvailable[0] = true;

        // Clear saved data without affecting other localStorage entries
        try {
            if (typeof window !== "undefined" && window.localStorage) {
                window.localStorage.removeItem(Manager.SAVE_KEY);
            }
        } catch {
            // Ignore storage errors so the game never crashes because of them
        }
    }

    private static saveToLocalStorage(): void {
        try {
            if (typeof window === "undefined" || !window.localStorage) {
                return;
            }

            const data = {
                score: Manager._score,
                levelsAvailable: Manager._levelsAvailable,
            };

            window.localStorage.setItem(Manager.SAVE_KEY, JSON.stringify(data));
        } catch {
            // Ignore storage errors so the game never crashes because of them
        }
    }

    private static loadFromLocalStorageOrDefaults(): void {
        // Default progress: 51 levels, only level 0 unlocked, score 0
        Manager._score = 0;
        Manager._levelsAvailable = new Array(51).fill(false);
        Manager._levelsAvailable[0] = true;

        try {
            if (typeof window === "undefined" || !window.localStorage) {
                return;
            }

            const raw = window.localStorage.getItem(Manager.SAVE_KEY);
            if (!raw) {
                // No existing save; persist defaults
                Manager.saveToLocalStorage();
                return;
            }

            const parsed = JSON.parse(raw);

            const loadedScore =
                parsed && typeof parsed.score === "number" ? parsed.score : 0;

            const loadedLevelsRaw = parsed && parsed.levelsAvailable;
            const loadedLevels: boolean[] | null = Array.isArray(loadedLevelsRaw)
                ? loadedLevelsRaw.map((v: unknown) => !!v)
                : null;

            if (!loadedLevels || loadedLevels.length !== 51) {
                // Corrupted or unexpected data; keep defaults and overwrite bad save
                Manager.saveToLocalStorage();
                return;
            }

            Manager._score = loadedScore;
            Manager._levelsAvailable = loadedLevels;
        } catch {
            // Any error (including JSON.parse) falls back to defaults
        }
    }

    // Width and Height are read-only after creation (for now)
    private static _width: number;
    private static _height: number;

    // With getters but not setters, these variables become read-only
    public static get width(): number {
        return Manager._width;
    }
    public static get height(): number {
        return Manager._height;
    }

    // Use this function ONCE to start the entire machinery
    public static initialize(width: number, height: number, background: number): void {

        // Load saved progress (or defaults if none / corrupted)
        Manager.loadFromLocalStorageOrDefaults();

        // store our width and height
        Manager._width = width;
        Manager._height = height;

        // Create our pixi app
        Manager.app = new Application({
            view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
            // resolution: window.devicePixelRatio || 1,
            // autoDensity: true,
            backgroundColor: background,
            width: width,
            height: height
        });

        // eslint-disable-line ***PIXI DEV TOOLS***
        (globalThis as any).__PIXI_APP__ = Manager.app;

        // Screen resize
        window.addEventListener("resize", () => {
            const scaleX = window.innerWidth / this.app.screen.width;
            const scaleY = window.innerHeight / this.app.screen.height;
            const scale = Math.min(scaleX, scaleY);

            const gameWidth = Math.round(this.app.screen.width * scale);
            const gameHeight = Math.round(this.app.screen.height * scale);

            const marginHorizontal = Math.floor((window.innerWidth - gameWidth) / 2);
            const marginVertical = Math.floor((window.innerHeight - gameHeight) / 2);

            const appview = this.app.view as HTMLCanvasElement; // added for Pixi v7

            appview.style.width = gameWidth + "px";
            appview.style.height = gameHeight + "px";
            appview.style.marginLeft = marginHorizontal + "px";
            appview.style.marginRight = marginHorizontal + "px";
            appview.style.marginTop = marginVertical + "px";
            appview.style.marginBottom = marginVertical + "px";
        });

        window.dispatchEvent(new Event("resize"));

        // Add the ticker
        //Manager.app.ticker.add(Manager.update)
        Ticker.shared.add(Manager.update)

    }

    // Call this function when you want to go to a new scene
    public static changeScene(newScene: IScene): void {
        // Remove and destroy old scene... if we had one..
        if (Manager.currentScene) {
            Manager.app.stage.removeChild(Manager.currentScene);
            Manager.currentScene.destroy();
        }

        // Add the new one
        Manager.currentScene = newScene;
        Manager.app.stage.addChild(Manager.currentScene);
    }


    // This update will be called by a pixi ticker and tell the scene that a tick happened
    private static update(deltaFrame: number): void {

        Group.shared.update(); // for tweedle.js !! 

        // Let the current scene know that we updated it...
        // Just for funzies, sanity check that it exists first.
        if (Manager.currentScene) {
            Manager.currentScene.update(Ticker.shared.deltaMS, deltaFrame);
        }
        // as I said before, I HATE the "frame passed" approach. I would rather use `Manager.app.ticker.deltaMS`
    }



}

