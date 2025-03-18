class LoadingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'bootGame' });
    }

    preload() {
        this.add.text(20, 20, 'Loading game...');
        this.load.image('bg-open', 'assets/img/background/bgUtils_open.png');
        this.load.image('bg-close', 'assets/img/background/bgUtils_close.png');
        // this.load.spritesheet("charTest", "assets/img/sprite/character/maleWhite.png", {
        //     frameWidth: 100,
        //     frameHeight: 100,
        // });

        // this.load.image('bg-grass', 'assets/img/background/14.png');
        this.load.pack('spriteCharacter_Bundles', '../spritesCharacter.json');
        this.load.pack('spriteUtilities_Bundles', '../spritesUtilities.json');
        this.load.pack('spriteMisc_Bundles', '../spritesMisc.json');
        // this.load.atlas('femaleBody', '../assets/img/sprites/body/femaleBody.png', '../assets/img/sprites/body/femaleBody.json');
        // this.load.atlas('maleBody', '../assets/img/sprites/body/maleBody.png', '../assets/img/sprites/body/maleBody.json');
    }

    create() {
        setTimeout(() => {
            this.scene.start('playGame');
        }, 1000);
    }
}
