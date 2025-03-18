import Phaser from 'phaser';

export default class Scene2 extends Phaser.Scene {
    constructor() {
        super({ key: "playGame" });

        this.limits = {
            bodyHead: 6,
            eyes: 9,
            eyebrows: 26,
            hair: 26,
            legs: 26,
            shirts: 26
        }

        this.spriteRows = {
            eyes: [63],
            eyebrows: [52, 130],
            hairs: [52, 130, 208, 286, 364, 442, 520, 598, 676, 754],
            maleLegs: [52, 130, 286],
            femaleLegs: [52, 130, 208, 286, 364, 442, 520, 598],
            shirts: {
                left: [0, 78, 156, 234, 312, 390, 468, 546, 624, 702],
                right: [52, 130, 208, 286, 364, 442, 520, 598, 676, 754]
            },
        }

        this.flagChanged = false;
        this.isLockedDesign = false;
        this.nameText;
        this.bodyColors = ['light', 'amber', 'olive', 'bronze', 'brown', 'black'];

        this.currentCharacter = {
            id: null,
            name: '',
            gender: "male",
            bodyHead: 0,
            eyes: {
                value: null,
                rowValue: null
            },
            eyebrows: {
                value: null,
                rowValue: null
            },
            hair: {
                name: null,
                value: null,
                rowValue: null
            },
            legs: {
                name: null,
                value: null,
                rowValue: null
            },
            shirts: {
                name: null,
                value: null,
                rowValue: null
            },
            level: 0,
            stats: {
                strength: 0,
                agility: 0,
                speed: 0,
                win: 0,
                lose: 0
            },
            items: [],
            talent: [],
            extra: [],
            pets: [],
            password: null,
            created: new Date(new Date().getTime() + 8 * 60 * 60 * 1000)
        };

        this.spriteBundles = this.createSpriteBundles();
    }

    create() {
        // Set the background
        this.background = this.add.image(0, 0, "bg-grass").setOrigin(0);
        this.background.displayWidth = this.sys.game.config.width;
        this.background.displayHeight = this.sys.game.config.height;

        // Calculate center positions
        const centerX = this.sys.game.config.width / 2;
        const centerY = this.sys.game.config.height / 2;

        // Create the containers for character customization and preview
        // Center the character container on the background
        this.characterContainer = this.add.container(centerX, centerY);

        // Position the preview container in the middle of the character container
        this.previewContainer = this.add.container(0, 0);
        this.characterContainer.add(this.previewContainer);

        // Render the character creation elements
        this.renderCreateCharacter();
        this.drawCreateCharacterBorder(0, 0, 300, 400); // Adjust border position accordingly
    }

    createSpriteBundles() {
        return {
            misc: {
                preloadName: "miscBundle",
                arrows: [728, 729], // left, right
                paints: [730, 731], // color, no color
                genderIcons: [732, 733, 734], // female, male, none
                shadows: [735, 736], // left, right
                buttons: [754, 755, 756, 757, 758, 759, 760, 761, 762, 763, 764] // action buttons
            },
            // smallparts: {
            //     preloadName: "smallPartsBundle",
            //     eyebrows: this.createCombineParts([0, 26, this.spriteRowsRight.eyebrows[0]], [78, 104, this.spriteRowsRight.eyebrows[1]], this.limits.eyebrows),
            // },
            // hairs: {
            //     preloadName: "hair",
            //     frames: this.createBundles(
            //         [0, 78, 156, 234, 312, 390, 468, 546, 624, 702],
            //         [26, 104, 182, 260, 338, 416, 494, 572, 650, 728],
            //         this.spriteRowsRight.hairs,
            //         this.limits.hair
            //     )
            // },
            // maleLegs: {
            //     preloadName: "male-legs",
            //     frames: this.createBundles(
            //         [0, 78, 156],
            //         [26, 104, 182],
            //         this.spriteRowsRight.maleLegs,
            //         this.limits.legs
            //     )
            // },
            // femaleLegs: {
            //     preloadName: "female-legs",
            //     frames: this.createBundles(
            //         [0, 78, 156, 234, 312, 390, 468, 546],
            //         [26, 104, 182, 260, 338, 416, 494, 572],
            //         this.spriteRowsRight.femaleLegs,
            //         this.limits.legs
            //     )
            // },
            shirts: {
                preloadName: "shirts",
                frames: this.createBundles(
                    this.spriteRows.shirts.left,
                    this.spriteRows.shirts.right,
                    this.limits.shirts
                )
            }
        };
    }

    createBundles(leftFrame, rightFrame, limit) {
        // Initialize the frame containers for left, center, and right
        let leftFrames = [];
        let rightFrames = [];

        // Loop through each frame position and append the frame arrays
        for (let i = 0; i < leftFrame.length; i++) {
            leftFrames = leftFrames.concat(this.createFrameArray(leftFrame[i], limit));
            rightFrames = rightFrames.concat(this.createFrameArray(rightFrame[i], limit));
        }

        // Return the frames as a single object containing left, center, and right
        return {
            left: leftFrames,
            right: rightFrames
        };
    }

    createFrameArray(startFrame, length) {
        var frames = [];
        for (var i = 0; i < length; i++) {
            frames.push(startFrame + i);
        }
        return frames;
    }

    renderCreateCharacter() {
        // Clear the preview container
        this.previewContainer.removeAll(true);
        const gender = this.currentCharacter.gender;
        console.log(this.currentCharacter);
        // const legsSprite = gender === 'male' ? this.spriteBundles.maleLegs.frames.right : this.spriteBundles.femaleLegs.frames.right;

        // if (this.lockIcon && this.SaveCharacter) {
        //     this.lockIcon.destroy();
        //     this.SaveCharacter.destroy();
        //     this.isLockedDesign = false;
        // }

        // if (this.isLockedDesign) {
        //     // When locked, don't render the paint and gender icons
        //     if (this.paintSprite) this.paintSprite.destroy();
        //     if (this.genderSprite) this.genderSprite.destroy();
        // } else {
        //     // Render the paint and gender icons
        //     this.renderMiscButtons(400);
        // }

        const bodyColor = this.bodyColors[this.currentCharacter.bodyHead];
        this.renderSprite(null, gender.concat('Body'), `${bodyColor}/${bodyColor}-39.png`, false);

        const indices = {
            bodyHead: this.currentCharacter.bodyHead ?? this.randomizer(this.limits.bodyHead - 1),
            // eyes: this.currentCharacter.eyes.value ?? this.randomizer(this.spriteBundles.bodyParts.eyes.right.length - 1),
            // eyebrows: this.currentCharacter.eyebrows.value ?? this.randomizer(this.spriteBundles.smallparts.eyebrows.right.length - 1),
            // hair: this.currentCharacter.hair.value ?? this.randomizer(this.spriteBundles.hairs.frames.right.length - 1),
            // legs: this.currentCharacter.legs.value ?? this.randomizer(legsSprite.length - 1),
            shirts: this.currentCharacter.shirts.value ?? this.randomizer(this.spriteBundles.shirts.frames.right.length - 1),
        };
        
        var shirtsDataGender = null;
        const shirtSprite = `${gender}-${this.spriteBundles.shirts.preloadName}`;
        if (gender === 'male') {
            shirtsDataGender = Phaser.Math.RND.pick(
                [
                    'no-shirts',
                    shirtSprite,
                    shirtSprite,
                    shirtSprite
                ]
            )
        } else if (gender === 'female') {
            shirtsDataGender = Phaser.Math.RND.pick(
                [
                    shirtSprite.concat('1'),
                    shirtSprite.concat('2'),
                    shirtSprite.concat('3')
                ]
            )
        } else {
            shirtsDataGender = this.spriteBundles.shirts.preloadName;
        }

        const names = {
        //     hair: this.currentCharacter.hair.name ?? `${this.spriteBundles.hairs.preloadName}${Math.floor(Math.random() * 10)}`,
        //     legs: this.currentCharacter.legs.name ?? this.spriteBundles[`${gender}Legs`].preloadName,
            shirts: this.currentCharacter.shirts.name ?? shirtsDataGender,
        };
        console.log([indices,names]);
        // Sprite Values
        const bodyHead = {
        //     eyes: this.spriteBundles.bodyParts.eyes.right[indices.eyes],
        //     eyebrows: this.spriteBundles.smallparts.eyebrows.right[indices.eyebrows],
        //     hairs: this.spriteBundles.hairs.frames.right[indices.hair],
        //     legs: legsSprite[indices.legs],
            shirts: this.spriteBundles.shirts.frames.right[indices.shirts],
        };

        const selectedRows = {};
        const selectedRowLegsName = `${gender}Legs`;

        // Determine Row Selection
        Object.entries(bodyHead).forEach(([name, value]) => {
            if (name === 'head' || name === 'body') return;

            const rowName = name === 'legs' ? selectedRowLegsName : name;
            const rows = this.spriteRows[rowName].right;

            selectedRows[rowName] = this.getRowValue(rows, value);
        });

        // Create Sprites
        // this.renderSprite(this.spriteBundles.bodyParts.shadow[1], "charShadow", this.spriteBundles.bodyParts.preloadName);
        // this.renderSprite(bodyHead.eyes, "charEyes", this.spriteBundles.bodyParts.preloadName);
        // this.renderSprite(bodyHead.eyebrows, "charEyeBrows", this.spriteBundles.smallparts.preloadName);
        // this.renderSprite(bodyHead.hairs, "charHair", names.hair);
        // this.renderSprite(bodyHead.legs, "charLegs", names.legs);
        this.renderSprite(bodyHead.shirts, "charShirts", names.shirts, true);

        // Update Current Character
        this.currentCharacter = {
            ...this.currentCharacter,
            bodyHead: indices.bodyHead,
        //     eyes: {
        //         value: indices.eyes,
        //         rowValue: this.currentCharacter.eyes.rowValue || selectedRows.eyes
        //     },
        //     eyebrows: {
        //         value: indices.eyebrows,
        //         rowValue: this.currentCharacter.eyebrows.rowValue || selectedRows.eyebrows
        //     },
        //     hair: {
        //         name: names.hair,
        //         value: indices.hair,
        //         rowValue: this.currentCharacter.hair.rowValue || selectedRows.hairs
        //     },
        //     legs: {
        //         name: names.legs,
        //         value: indices.legs,
        //         rowValue: this.currentCharacter.legs.rowValue || selectedRows[selectedRowLegsName]
        //     },
            shirts: {
                name: names.shirts,
                value: indices.shirts,
                rowValue: this.currentCharacter.shirts.rowValue || selectedRows.shirts
            },
        };


        // if (this.isNameValid(this.currentCharacter.name)) {
        //     const lockFrame = this.isLockedDesign ? 397 : 398;

        //     // Lock icon (beside the paint icon)
        //     this.lockIcon = this.add.sprite(0, -400 / 2 + 320, this.spriteBundles.bodyParts.preloadName)
        //         .setFrame(lockFrame)
        //         .setInteractive();
        //     this.lockIcon.on("pointerdown", () => {
        //         this.isLockedDesign = !this.isLockedDesign; // Toggle lock status
        //         // Update lock icon frame based on new lock status
        //         var newFrame = this.isLockedDesign ? 397 : 398;
        //         this.lockIcon.setFrame(newFrame);
        //         this.renderMiscButtons(400);
        //     });
        //     this.characterContainer.add(this.lockIcon);

        //     // Save Character icon (bottom right)
        //     this.SaveCharacter = this.add.sprite(this.cameras.main.width / 2 - 60, 400 / 2 + 50, this.spriteBundles.bodyParts.preloadName).setFrame(419).setInteractive();
        //     this.SaveCharacter.on("pointerdown", () => {
        //         this.saveCharacter(this.currentCharacter);
        //     });

        //     this.characterContainer.add(this.SaveCharacter);
        // }
    }

    // Helper method to get row value
    getRowValue(rows, value) {
        if (rows.length === 1) {
            return rows[0];
        }

        for (let i = 0; i < rows.length; i++) {
            if (value >= rows[i]) {
                if (i + 1 < rows.length && value < rows[i + 1]) {
                    return rows[i];
                } else if (i + 1 === rows.length) {
                    return rows[i];
                }
            }
        }
    }

    renderSprite(frame, subjectName, preloadName, isFrame) {
        if (isFrame) {
            this[subjectName] = this.add.sprite(0, 0, preloadName).setFrame(frame).setScale(2);
        }
        else {
            this[subjectName] = this.add.sprite(0, 0, subjectName, preloadName).setScale(2);
        }
        this.previewContainer.add(this[subjectName]);
    }

    renderMiscButtons(height) {
        // Remove existing buttons if they exist
        if (this.paintSprite) {
            this.paintSprite.destroy();
        }
        if (this.genderSprite) {
            this.genderSprite.destroy();
        }

        // Add buttons only if design is not locked
        if (!this.isLockedDesign || this.currentCharacter.name === '') {
            var padding = 250;
            var self = this;

            // Paint icon
            this.paintSprite = this.add.sprite(60, -height / 2 + padding + 60, this.spriteBundles.misc.preloadName)
                .setFrame(this.spriteBundles.misc.paints[0])
                .setInteractive();
            this.paintSprite.on("pointerdown", function () {
                self.changeCharacterColor();
            });
            this.characterContainer.add(this.paintSprite);

            // Gender icon
            var frame = this.currentCharacter.gender === "male" ? this.spriteBundles.misc.genderIcons[1] : this.spriteBundles.misc.genderIcons[0];
            this.genderSprite = this.add.sprite(-60, -height / 2 + padding + 60, this.spriteBundles.misc.preloadName)
                .setFrame(frame)
                .setInteractive();
            this.genderSprite.on("pointerdown", function () {
                self.changeGender();
            });
            this.characterContainer.add(this.genderSprite);
        }
    }

    randomizer(end) {
        const start = 0;
        let array = [];
        for (let i = start; i <= end; i++) {
            array.push(i);
        }
        return Phaser.Math.RND.pick(array);
    }

    changeGender() {

        // if (this.isNameValid(this.currentCharacter.name) && this.currentCharacter.name !== null && this.currentCharacter.name !== undefined) {
        this.flagChanged = true;
        this.currentCharacter.gender = this.currentCharacter.gender === "male" ? "female" : "male"; // Toggle gender

        var frame = this.currentCharacter.gender === "male" ? this.spriteBundles.misc.genderIcons[1] : this.spriteBundles.misc.genderIcons[0];
        this.genderSprite.setFrame(frame); // change gender icon

        this.currentCharacter.bodyHead = this.randomizer(this.limits.bodyHead - 1);
        this.currentCharacter.eyes = {
            value: null,
            rowValue: null
        };
        this.currentCharacter.eyebrows = {
            value: null,
            rowValue: null
        };
        this.currentCharacter.hair = {
            name: null,
            value: null,
            rowValue: null
        };
        this.currentCharacter.legs = {
            name: null,
            value: null,
            rowValue: null
        };
        this.currentCharacter.shirts = {
            name: null,
            value: null,
            rowValue: null
        };

        this.renderCreateCharacter();
        // }
    }

    changeCharacterColor() {
        // Update character properties
        this.currentCharacter.bodyHead = this.randomizer(this.limits.bodyHead - 1);
        // this.currentCharacter.eyes.value = this.randomizer(this.spriteBundles.bodyParts.eyes.right.length - 1);

        // // Update eyebrows
        // this.updateCharacterPart(
        //     this.spriteBundles.smallparts.eyebrows.right,
        //     'eyebrows',
        //     this.currentCharacter.eyebrows
        // );

        // // Update legs
        // const legsSprite = this.currentCharacter.gender === 'male' ?
        //     this.spriteBundles.maleLegs.frames.right :
        //     this.spriteBundles.femaleLegs.frames.right;

        // this.updateCharacterPart(
        //     legsSprite,
        //     'legs',
        //     this.currentCharacter.legs
        // );

        // // Update hair
        // this.updateCharacterPart(
        //     this.spriteBundles.hairs.frames.right,
        //     'hair',
        //     this.currentCharacter.hair
        // );

        // this.updateCharacterPart(
        //     this.spriteBundles.shirts.frames.right,
        //     'shirts',
        //     this.currentCharacter.shirts
        // );

        this.renderCreateCharacter();
    }

    drawCreateCharacterBorder(x, y, width, height) {
        this.renderMiscButtons(height);

        // Title text for "Create Character"
        var text = this.add.text(0, -height / 2 + 10, "Create Character", {
            fontSize: '25px',
            fill: '#DAF7A6',
            fontStyle: 'bold',
            stroke: '#000000',          // Border color
            strokeThickness: 1
        }).setOrigin(0.5, 0);
        this.characterContainer.add(text);

        // Add the "Enter Name" text below the "Create Character" title
        // this.nameText = this.add.text(0, -height / 2 + 50, 'Please input a name.', {
        //     fontSize: '24px',
        //     fill: '#ffffff',
        //     fontStyle: 'bold',
        //     stroke: '#000000',          // Border color
        //     strokeThickness: 1          // Border thickness
        // }).setOrigin(0.5, 0);

        // this.characterContainer.add(this.nameText);
    }
}