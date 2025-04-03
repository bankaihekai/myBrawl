// Get the current window width and height
const width = window.innerWidth;
const height = window.innerHeight;

const config = {
    type: Phaser.AUTO,
    width: CONSTANTS._gameWidth,
    height: CONSTANTS._gameHeight,
    transparent: true,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 1500 },
            debug: false,
        },
    },
    antialias: false,
    parent: 'game-container',
    scene: [LoadingScene, CreateScene, PlayerHome, PlayerSelect, PlayerFight],
    pixelArt: true,
};

const game = new Phaser.Game(config);

window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});
