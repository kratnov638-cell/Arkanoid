
const CONFIG = {
    WIDTH: 800,
    HEIGHT: 600,
    HUD_HEIGHT: 60,
    PADDING: 40, //отступ поля от краёв canvas по бокам
    WALL: 4,
};

class ArkanoidGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.app = null;      
        this.field = null;    
        this.hud = null;      
        this.paddle = null;   
        this.ball = null;     
        this.blocks = [];     
        this.keys = { left: false, right: false };
    }
    
    async init() {
        this.app = new PIXI.Application();
        await this.app.init({
            width: CONFIG.WIDTH,
            height: CONFIG.HEIGHT,
            backgroundColor: 0x000000,
            antialias: false,
        });

        this.container.appendChild(this.app.canvas);

        this.createScenes();
        this.drawWalls();
        this.createPaddle();
        this.createBall();
        this.createBlocks();
        this.setupInput();
        this.setupTicker();

        console.log('init done');
    }

    createScenes() {
        this.field = new PIXI.Container()
        this.field.x = CONFIG.PADDING, this.field.y = CONFIG.HUD_HEIGHT
        this.app.stage.addChild(this.field)
        this.hud = new PIXI.Container()
        this.app.stage.addChild(this.hud)
    }

    drawWalls() {
        const FIELD_W = CONFIG.WIDTH - CONFIG.PADDING * 2;
        const FIELD_H = CONFIG.HEIGHT - CONFIG.HUD_HEIGHT - CONFIG.PADDING;
        const walls = new PIXI.Graphics();
        walls.rect(0, 0, FIELD_W, 4).fill(0xffffff);
        walls.rect(0, 0, 4, FIELD_H).fill(0xffffff);
        walls.rect(FIELD_W - 4, 0, 4, FIELD_H).fill(0xffffff);
        this.field.addChild(walls);
    }

    createPaddle() {
    }

    createBall() {
    }

    createBlocks() {
    }

    setupInput() {
    }

    setupTicker() {
    }

    update(delta) {
    }

    destroy() {
        if (this.app) this.app.destroy(true);
    }
}