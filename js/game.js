
const CONFIG = {
    WIDTH: 800,
    HEIGHT: 600,
    HUD_HEIGHT: 60,
    PADDING: 40, //отступ поля от краёв canvas по бокам
    WALL: 4,
    PADDLE_W: 100,
    PADDLE_H: 10,
    get FIELD_W() { return this.WIDTH - this.PADDING * 2; },
    get FIELD_H() { return this.HEIGHT - this.HUD_HEIGHT - this.PADDING; },
    BALL_R: 5,
    PADDLE_SPEED: 3.5,
    BALL_SPEED: 5,
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
        this.field = new PIXI.Container();
        this.field.x = CONFIG.PADDING;
        this.field.y = CONFIG.HUD_HEIGHT;
        this.app.stage.addChild(this.field);
        this.hud = new PIXI.Container();
        this.app.stage.addChild(this.hud);
    }

    drawWalls() {
        const FIELD_W = CONFIG.WIDTH - CONFIG.PADDING * 2;
        const FIELD_H = CONFIG.HEIGHT - CONFIG.HUD_HEIGHT - CONFIG.PADDING;
        const walls = new PIXI.Graphics();

        walls.rect(0, 0, FIELD_W, 4).fill(0xa9a9a9);
        walls.rect(0, 0, 4, FIELD_H).fill(0xa9a9a9);
        walls.rect(FIELD_W - 4, 0, 4, FIELD_H).fill(0xa9a9a9);

        this.field.addChild(walls);
    }

    createPaddle() {
        const paddle = new PIXI.Graphics();
        paddle.rect(0, 0, CONFIG.PADDLE_W, CONFIG.PADDLE_H).fill(0xffffff);

        paddle.x = (CONFIG.FIELD_W - CONFIG.PADDLE_W) / 2;
        paddle.y = CONFIG.FIELD_H - CONFIG.PADDLE_H - 10;

        this.field.addChild(paddle);
        this.paddle = paddle;
    }

    createBall() {
        const ball = new PIXI.Graphics();
        ball.circle(0, 0, CONFIG.BALL_R).fill(0xc0c0c0);

        ball.x = CONFIG.FIELD_W / 2;
        ball.y = CONFIG.FIELD_H - CONFIG.PADDLE_H - 30;

        this.field.addChild(ball);
        this.ball = ball;

        this.ball.vx = 0;
        this.ball.vy = 0;
    }

    createBlocks() {

    }

    setupInput() {
        window.addEventListener('keydown', (e) => {
            if(e.key === 'ArrowLeft') {
                this.keys.left = true;
            }
            else if(e.key === 'ArrowRight') {
                this.keys.right = true;
            }
            if (e.key === ' ' || e.key === 'Space') {
                if (this.ball && this.ball.vx === 0 && this.ball.vy === 0) {
                    this.ball.vx = 3;
                    this.ball.vy = -3;
                }
            }
        });
        window.addEventListener('keyup', (e) => {
            if(e.key === 'ArrowLeft') {
                this.keys.left = false;
            }
            else if(e.key === 'ArrowRight') {
                this.keys.right = false;
            }
        });
    }

    setupTicker() {
        this.app.ticker.add((ticker) => this.update(ticker.deltaTime));
    }

    update(delta) {
        if (this.keys.left){
            this.paddle.x -= CONFIG.PADDLE_SPEED * delta;
        }
        if (this.keys.right){
            this.paddle.x += CONFIG.PADDLE_SPEED * delta;
        }

        const minX = CONFIG.WALL;
        const maxX = CONFIG.FIELD_W - CONFIG.PADDLE_W - CONFIG.WALL;
        this.paddle.x = Math.max(minX, Math.min(maxX, this.paddle.x));

        this.ball.x += this.ball.vx * delta;
        this.ball.y += this.ball.vy * delta;

        if(this.ball.x + CONFIG.BALL_R > CONFIG.FIELD_W - CONFIG.WALL){
            this.ball.vx = -Math.abs(this.ball.vx);                      
            this.ball.x = CONFIG.FIELD_W - CONFIG.WALL - CONFIG.BALL_R; 
        }
        if(this.ball.x - CONFIG.BALL_R < CONFIG.WALL){
            this.ball.vx = Math.abs(this.ball.vx);                      
            this.ball.x = CONFIG.WALL + CONFIG.BALL_R; 
        }
        if(this.ball.y - CONFIG.BALL_R < CONFIG.WALL){
            this.ball.vy = Math.abs(this.ball.vy);                      
            this.ball.y = CONFIG.WALL + CONFIG.BALL_R; 
        }
    }

    destroy() {
        if (this.app) this.app.destroy(true);
    }
}