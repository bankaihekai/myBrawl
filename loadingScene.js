class LoadingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'bootGame' });
    }

    preload() {
        this.add.text(20, 20, 'Loading game...');
        this.load.image('bg-open', 'assets/img/background/bgUtils_open.png');
        this.load.image('bg-close', 'assets/img/background/bgUtils_close.png');
        this.load.image('bg-blank', 'assets/img/background/bg-blank.png');

        this.load.image('bg-0', 'assets/img/background/1.png');
        this.load.image('bg-1', 'assets/img/background/2.png');
        this.load.image('bg-2', 'assets/img/background/3.png');
        this.load.image('bg-3', 'assets/img/background/4.png');
        this.load.image('bg-4', 'assets/img/background/5.png');
        this.load.image('bg-5', 'assets/img/background/6.png');
        this.load.image('bg-6', 'assets/img/background/7.png');
        this.load.image('bg-7', 'assets/img/background/8.png');
        this.load.image('bg-8', 'assets/img/background/9.png');
        this.load.image('bg-9', 'assets/img/background/10.png');
        this.load.image('bg-10', 'assets/img/background/11.png');
        this.load.image('bg-11', 'assets/img/background/12.png');
        this.load.image('bg-12', 'assets/img/background/13.png');
        this.load.image('bg-13', 'assets/img/background/14.png');
        this.load.image('bg-14', 'assets/img/background/15.png');
        // this.load.spritesheet("charTest", "assets/img/sprite/character/maleWhite.png", {
        //     frameWidth: 100,
        //     frameHeight: 100,
        // });

        // this.load.image('bg-grass', 'assets/img/background/14.png');
        this.load.pack('spriteCharacter_Bundles', 'spriteBundles/spritesCharacter.json');
        this.load.pack('spriteUtilities_Bundles', 'spriteBundles/spritesUtilities.json');
        this.load.pack('spriteMisc_Bundles', 'spriteBundles/spritesMisc.json');
        // this.load.atlas('femaleBody', '../assets/img/sprites/body/femaleBody.png', '../assets/img/sprites/body/femaleBody.json');
        // this.load.atlas('maleBody', '../assets/img/sprites/body/maleBody.png', '../assets/img/sprites/body/maleBody.json');
    }

    create() {
        setTimeout(() => {
            this.scene.start('playGame');
        }, 1000);
    }
}
