
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
    BLOCK_COLS: 10,           
    BLOCK_ROWS: 6,            
    BLOCK_H: 20,              
    BLOCK_GAP: 4,            
    BLOCK_TOP: 40, 
    BLOCK_OFFSET_X: 2, 
    get BLOCK_W() { return (this.FIELD_W - this.BLOCK_GAP * 2) / 10 },         
};

const LEVEL_MAP = [
    "SSSSSSSSSS",   
    "RRRRRRRRRR",   
    "BBBBBBBBBB",   
    "YYYYYYYYYY",   
    "PPPPPPPPPP",  
    "GGGGGGGGGG",   
];

const BLOCK_TYPES = {
    'S': { color: 0xc0c0c0, hits: 2, score: 50 },  
    'R': { color: 0xff0000, hits: 1, score: 90 },  
    'B': { color: 0x0000ff, hits: 1, score: 100 },  
    'Y': { color: 0xffff00, hits: 1, score: 120 },  
    'P': { color: 0xff69b4, hits: 1, score: 110 },  
    'G': { color: 0x00ff00, hits: 1, score: 80 },   
}

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
        this.lives = 3;
        this.gameOver = false; 
        this.score = 0;
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
        for (let i = 0; i < CONFIG.BLOCK_ROWS; i++){
            for (let j = 0; j < CONFIG.BLOCK_COLS; j++){
                const symbol = LEVEL_MAP[i][j];
                const type = BLOCK_TYPES[symbol];
                const bloсs = new PIXI.Graphics();
                bloсs.rect(0, 0, CONFIG.BLOCK_W - CONFIG.BLOCK_GAP, CONFIG.BLOCK_H).fill(type.color);
                bloсs.x = (CONFIG.BLOCK_GAP + j * CONFIG.BLOCK_W) + CONFIG.BLOCK_OFFSET_X;
                bloсs.y = CONFIG.BLOCK_TOP + i * (CONFIG.BLOCK_H + CONFIG.BLOCK_GAP);

                bloсs.hitsLeft = type.hits;
                bloсs.score = type.score;
                this.field.addChild(bloсs);
                this.blocks.push(bloсs);
            }
        }
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
        if(this.gameOver) {return;}

        if (this.keys.left){
            this.paddle.x -= CONFIG.PADDLE_SPEED * delta;
        }
        if (this.keys.right){
            this.paddle.x += CONFIG.PADDLE_SPEED * delta;
        }

        const minX = CONFIG.WALL;
        const maxX = CONFIG.FIELD_W - CONFIG.PADDLE_W - CONFIG.WALL;
        this.paddle.x = Math.max(minX, Math.min(maxX, this.paddle.x));

        if (this.ball.vx === 0 && this.ball.vy === 0) {
            this.ball.x = this.paddle.x + CONFIG.PADDLE_W / 2;
            this.ball.y = this.paddle.y - CONFIG.BALL_R - 2;
        }

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


        if (this.ball.vy > 0){
            const hit = 
            this.ball.x + CONFIG.BALL_R > this.paddle.x &&
            this.ball.x - CONFIG.BALL_R < this.paddle.x + CONFIG.PADDLE_W &&
            this.ball.y + CONFIG.BALL_R > this.paddle.y &&
            this.ball.y - CONFIG.BALL_R < this.paddle.y + CONFIG.PADDLE_H;

            if(hit) {
                const paddleCenter = this.paddle.x + CONFIG.PADDLE_W / 2;
                const rawHitPos = (this.ball.x - paddleCenter) / (CONFIG.PADDLE_W / 2);
                const hitPos = Math.max(-0.8, Math.min(0.8, rawHitPos));
                
                const speed = CONFIG.BALL_SPEED;
                this.ball.vx = hitPos * speed;
                this.ball.vy = -Math.sqrt(speed * speed - this.ball.vx * this.ball.vx);
                this.ball.y = this.paddle.y - CONFIG.BALL_R;
            }
        }

        if(this.ball.y - CONFIG.BALL_R > CONFIG.FIELD_H){
            if(this.lives < 1){
                this.gameOver = true; 
            }else{
                this.lives -= 1;
                this.ball.vx = 0;
                this.ball.vy = 0;
                this.ball.x = this.paddle.x + CONFIG.PADDLE_W / 2;
                this.ball.y = this.paddle.y - CONFIG.BALL_R - 10;
            }
        }
        
    }

    destroy() {
        if (this.app) this.app.destroy(true);
    }
}