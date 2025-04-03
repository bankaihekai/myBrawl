class CreateScene extends Phaser.Scene {
    constructor() {
        super({ key: "playGame" });

        this.currentCharDetails = {
            id: null,
            level: {
                current: 0,
                experience: 0,
                points: 1
            },
            kdStats: {
                createdDate: '',
                win: 0,
                lose: 0
            },
            name: "",
            gender: null,
            bodyFrame: null,
            hair: {
                number: null,
                frame: null
            },
            basicAttire: null,
            utilities: {
                skills: [],
                weapons: [],
                pets: []
            },
            attributes: {
                life: 60,
                damage: 1,
                agile: 1,
                speed: 1,
                armor: 1
            },
            psd: '',
            logs: {
                utility: []
            }
        }

        this.flags = {
            isLock: false, // flag to lock unlock creating character
            isSaving: false // flag to lock naming while entering password
        }

        this.existingUsers = [];

    }

    create() {

        this.setLoading(true);
        getAllUsers()
            .then(users => {
                this.existingUsers = users;
            })
            .catch(error => {
                console.error("Error fetching users in Phaser:", error);
            }).finally(() => {
                this.setLoading(false); // Hide the loading screen when done
            });

        this.displayloggedOut();
        this.validateLoggedIn();
        // localStorage.removeItem(CONSTANTS._charDetailsKey); // temporary comment for login user
        this.centerX = this.sys.game.config.width / 2;
        this.centerY = this.sys.game.config.height / 2;

        this.mainContainer = this.add.container(0, 0);
        this.mainContainer.setSize(CONSTANTS._gameWidth, CONSTANTS._gameHeight);

        this.background = this.add.image(0, 0, "bg-close").setOrigin(0);
        // this.background = this.add.image(0, 0, "bg-open").setOrigin(0);
        this.background.displayWidth = CONSTANTS._gameWidth;
        this.background.displayHeight = CONSTANTS._gameHeight;
        this.mainContainer.add(this.background);

        this.characterContainer = this.add.container(0, 0);
        this.characterContainer.setSize(CONSTANTS._gameWidth, CONSTANTS._gameHeight);
        this.characterContainer.add(this.createBorder(CONSTANTS._gameWidth, CONSTANTS._gameHeight));

        this.buttonContainer = this.add.container(0, 0);
        this.buttonContainer.setSize(CONSTANTS._gameWidth, CONSTANTS._gameHeight);

        this.charNameContainer = this.add.container(0, 0);
        this.charNameContainer.setSize(CONSTANTS._gameWidth, CONSTANTS._gameHeight);

        this.createName();
        this.createBarStatus(this.currentCharDetails.attributes);
        this.renderCreateCharacter();
        this.renderButtons();
        // console.log(this.getRandomUtils()); // get any weapon, skill, pet, etc.

    }

    createBorder(width, height) {
        const border = this.add.graphics();
        border.lineStyle(4, 0xffffff, 1); // Set border thickness and color (white)
        border.strokeRect(-0, -0 / 2, width, height); // Draw the rectangle centered around the origin
        return border;
    }

    renderCreateCharacter() {

        // Clear the preview container
        this.characterContainer.removeAll(true);
        this.renderButtons();
        this.renderUtils();

        // Define your desired numbers
        const gender = this.currentCharDetails.gender != null ? this.currentCharDetails.gender : CONSTANTS._genders[this.randomizer(CONSTANTS._genders.length - 1)];
        const bodyFrame = this.currentCharDetails.bodyFrame != null ? this.currentCharDetails.bodyFrame : CONSTANTS._bodyFrames[this.randomizer(CONSTANTS._bodyFrames.length - 1)];

        const randomHairFrames = this.currentCharDetails.hair.frame != null ? this.currentCharDetails.hair.frame : Phaser.Utils.Array.GetRandom(CONSTANTS._hairFrames);
        const hairGenderValue = gender == CONSTANTS._genders[1] ? CONSTANTS._hairSpriteCount.male : CONSTANTS._hairSpriteCount.female;
        const hairNumber = this.currentCharDetails.hair.number != null ? this.currentCharDetails.hair.number : this.randomizer(hairGenderValue);
        const hairFrameNumber = this.currentCharDetails.hair.frame != null ? this.currentCharDetails.hair.frame : randomHairFrames;

        const basicAttireRandomFrames = this.currentCharDetails.basicAttire != null ? this.currentCharDetails.basicAttire : Phaser.Utils.Array.GetRandom(CONSTANTS._basicAttireFrames);
        const basicAttireFrameNumber = this.currentCharDetails.basicAttire != null ? this.currentCharDetails.basicAttire : basicAttireRandomFrames;

        let currentCharDetails = {
            gender: gender,
            bodyFrame: bodyFrame,
            hair: {
                number: hairNumber,
                frame: hairFrameNumber
            },
            basicAttire: basicAttireFrameNumber
        }

        let charDetails = {
            x: CONSTANTS._charPositionX,
            y: (this.characterContainer.height / 2) - CONSTANTS._charPostionY,
            frame: 0,
            scale: 3,
            origin: 0.5
        }

        this.currentCharDetails.gender = currentCharDetails.gender;
        this.currentCharDetails.bodyFrame = currentCharDetails.bodyFrame;
        this.currentCharDetails.hair.number = currentCharDetails.hair.number;
        this.currentCharDetails.hair.frame = currentCharDetails.hair.frame;
        this.currentCharDetails.basicAttire = currentCharDetails.basicAttire;

        this.renderSprite(this.characterContainer, currentCharDetails, charDetails);
        // console.log(this.currentCharDetails);
    }

    renderSprite(container, currentCharDetails, charDetails) {
        const charShadow = this.add.sprite(charDetails.x - 20, charDetails.y - 5, "buttons").setFrame(8).setScale(3);
        container.add(charShadow);

        const charType = "body_".concat(currentCharDetails.gender);
        const charSprite = this.add.sprite(charDetails.x, charDetails.y, charType)
            .setFrame(currentCharDetails.bodyFrame)
            .setScale(charDetails.scale)
            .setOrigin(charDetails.origin);

        container.add(charSprite);

        const charAttireType = "body_basic_attire_".concat(currentCharDetails.gender);
        const charAttireSprite = this.add.sprite(charDetails.x, charDetails.y, charAttireType)
            .setFrame(currentCharDetails.basicAttire)
            .setScale(charDetails.scale)
            .setOrigin(charDetails.origin);

        container.add(charAttireSprite);

        if (currentCharDetails.hair.number !== 0 && currentCharDetails.hair.number !== null) {
            const charHair = "hair_".concat(currentCharDetails.gender, currentCharDetails.hair.number);
            const charHairSprite = this.add.sprite(charDetails.x, charDetails.y, charHair)
                .setFrame(currentCharDetails.hair.frame)
                .setScale(charDetails.scale)
                .setOrigin(charDetails.origin);

            container.add(charHairSprite);
        }
    }

    randomizer(max) {
        return Phaser.Math.Between(0, max);
    }

    renderButtons() {
        this.buttonContainer.removeAll(true);

        if (!this.flags.isLock) {

            let genderButtonOption;
            switch (this.currentCharDetails.gender) {
                case "male":
                    genderButtonOption = 5;
                    break;
                case "female":
                    genderButtonOption = 4;
                    break;
                default:
                    genderButtonOption = 6;
                    break;
            }
            const colorButton = this.add.sprite(this.centerX / 2 + 60, this.centerY + 30, "buttons").setFrame(2);
            colorButton.setInteractive();
            this.buttonContainer.add(colorButton);

            colorButton.on("pointerdown", () => {
                this.changeColor();
            });

            const genderButton = this.add.sprite(this.centerX / 2 - 60, this.centerY + 30, "buttons").setFrame(genderButtonOption);
            genderButton.setInteractive();
            this.buttonContainer.add(genderButton);

            genderButton.on("pointerdown", () => {
                this.changeGender();
            });

            const randomButton = this.add.sprite(this.centerX / 2, this.centerY + 30, "buttons").setFrame(21);
            randomButton.setInteractive();
            this.buttonContainer.add(randomButton);

            randomButton.on("pointerdown", () => {
                this.changeRandom();
            });
        }

        if (this.currentCharDetails.name.length !== 0 || this.currentCharDetails.name !== "") {
            this.saveButton = this.add.sprite(this.centerX / 2 + 160, this.centerY + 30, "buttons").setFrame(12);
            this.saveButton.setInteractive();
            this.buttonContainer.add(this.saveButton);

            this.saveButton.on("pointerdown", () => {
                const availableUserName = this.existingUsers.filter(data => data.name == this.currentCharDetails.name);

                if (availableUserName.length == 0) {

                    const randomId = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);

                    this.saveToLocalStorage("recentLogin", true);
                    this.currentCharDetails.id = randomId;
                    this.currentCharDetails.kdStats.createdDate = new Date().toLocaleDateString('en-US');
                    this.saveToLocalStorage(CONSTANTS._charUserKey, this.currentCharDetails.name); // character user key
                    this.saveToLocalStorage(CONSTANTS._charDetailsKey, this.currentCharDetails); // character data
                    this.scene.start("playerHome");
                } else {
                    this.createToast(this.generateRandomKeys(), CONSTANTS._errorMessages.userAlreadyExist);
                }
            });

        }

        let lockSpriteFrame = this.flags.isLock ? 22 : 23;
        const lockButton = this.add.sprite(this.centerX / 2, this.centerY - 60, "buttons").setFrame(lockSpriteFrame);
        lockButton.setInteractive();
        this.buttonContainer.add(lockButton);

        lockButton.on("pointerdown", () => {
            this.flags.isLock = !this.flags.isLock;
            this.currentCharDetails = this.currentCharDetails;
            this.renderCreateCharacter();
        });
    }

    changeGender() {
        this.currentCharDetails.gender = this.currentCharDetails.gender === CONSTANTS._genders[1] ? CONSTANTS._genders[0] : CONSTANTS._genders[1];
        this.renderCreateCharacter();
    }

    changeColor() {
        this.currentCharDetails.hair.frame = CONSTANTS._hairFrames[this.randomizer(CONSTANTS._hairFrames.length - 1)];
        this.currentCharDetails.bodyFrame = CONSTANTS._bodyFrames[this.randomizer(CONSTANTS._bodyFrames.length - 1)];
        this.currentCharDetails.basicAttire = CONSTANTS._basicAttireFrames[this.randomizer(CONSTANTS._bodyFrames.length - 1)];
        this.renderCreateCharacter();
    }

    changeRandom() {

        this.currentCharDetails.gender = CONSTANTS._genders[this.randomizer(CONSTANTS._genders.length - 1)];

        const hairGenderValue = this.currentCharDetails.gender == CONSTANTS._genders[1] ? CONSTANTS._hairSpriteCount.male : CONSTANTS._hairSpriteCount.female;
        this.currentCharDetails.hair.number = this.randomizer(hairGenderValue);
        this.currentCharDetails.hair.frame = CONSTANTS._hairFrames[this.randomizer(CONSTANTS._hairFrames.length - 1)];
        this.currentCharDetails.basicAttire = CONSTANTS._basicAttireFrames[this.randomizer(CONSTANTS._bodyFrames.length - 1)];
        this.currentCharDetails.bodyFrame = CONSTANTS._bodyFrames[this.randomizer(CONSTANTS._bodyFrames.length - 1)];

        this.renderCreateCharacter();
    }

    createBarStatus(charAttributes) {

        const barWidth = 80; // Total width of the bar
        const barHeight = 15; // Height of each segment
        const maxSegments = 10; // Always 10 segments per bar
        const segmentWidth = barWidth / maxSegments; // Width of each segment

        // CREATE COLORED BARs
        // this.creteBars(this.characterContainer);

        const getColor = (value) => {
            // Return colors based on value ranges
            if (value == 0) return CONSTANTS._colors[1]; // 01-10 slight Yellow-Green
            if (value == 1) return CONSTANTS._colors[2]; // 11-20 Yellow-Green
            if (value == 2) return CONSTANTS._colors[3]; // 21-30 Yellow
            if (value == 3) return CONSTANTS._colors[4]; // 31-40 Yellow-Orange
            if (value == 4) return CONSTANTS._colors[5]; // 41-50 Orange
            if (value == 5) return CONSTANTS._colors[6]; // 51-60 Red-Orange
            if (value == 6) return CONSTANTS._colors[7]; // 61-70 Red
            if (value == 7) return CONSTANTS._colors[8]; // 81-90 Dark Red
            if (value == 8) return CONSTANTS._colors[9]; // 91-100 Pink
            if (value == 9) return CONSTANTS._colors[10]; // 101-110 Dark Pink
            if (value == 10) return CONSTANTS._colors[11]; // 111-120 Violet
            if (value >= 11 && value <= 14) return CONSTANTS._colors[12]; // 121-150 Dark Blue
            if (value > 14) return CONSTANTS._colors[13]; // 151+ Black
        };

        Object.entries(charAttributes).forEach(([attribute, value], index) => {
            if (attribute == "armor") return;
            // Create a container for the health bar
            this.barContainer = this.add.container(this.centerX - 160, 135 + index * (barHeight + 5));

            if (attribute !== "life") {
                // Calculate the quotient and fractional part for the segments
                const quotient = value / 10;
                const integerPart = Math.floor(quotient);
                const fractionalPart = Math.round((quotient - integerPart) * 10);
                const remainingCount = 10 - fractionalPart;
                const integerPartColor = integerPart == 0 && remainingCount == 0 ? CONSTANTS._colors[0] : getColor(integerPart);
                const remainingColor = integerPart == 0 && remainingCount == 0 ? CONSTANTS._colors[0] : CONSTANTS._colors[CONSTANTS._colors.indexOf(integerPartColor) - 1];

                let setOfColor = [];

                // Add filled segments with integer color
                for (let i = 0; i < fractionalPart; i++) {
                    setOfColor.push(integerPartColor);
                }

                // Add unfilled segments with remaining color
                for (let i = 0; i < remainingCount; i++) {
                    setOfColor.push(remainingColor);
                }

                // Create segments for the bar
                for (let i = 0; i < maxSegments; i++) {
                    const color = setOfColor[i]; // Use the pre-determined colors
                    const borderThickness = 1; // Thickness of the border
                    const borderColor = setOfColor[i] == CONSTANTS._colors[13] ? 0xffffff : 0x000000;
                    // Create the outer rectangle (border)
                    const outerSegment = this.add.rectangle(
                        i * segmentWidth, // Position segments horizontally with spacing
                        0, // Align vertically
                        segmentWidth, // Outer rectangle includes the border
                        barHeight, // Outer rectangle includes the border
                        borderColor // Border color (black)
                    );
                    outerSegment.setOrigin(0); // Align to the top-left
                    this.barContainer.add(outerSegment);

                    // Create the inner rectangle (fill)
                    const innerSegment = this.add.rectangle(
                        i * segmentWidth + borderThickness, // Adjust for border thickness
                        borderThickness, // Adjust for border thickness
                        segmentWidth - 2, // Adjust for border thickness
                        barHeight - 2, // Adjust for border thickness
                        Phaser.Display.Color.HexStringToColor(color).color // Set color based on filled/unfilled segments
                    );
                    innerSegment.setOrigin(0); // Align to the top-left
                    this.barContainer.add(innerSegment);
                }
            }
            var iconFrame = 0;
            switch (attribute) {
                case "life":
                    iconFrame = 25;
                    break;
                case "damage":
                    iconFrame = 26;
                    break;
                case "agile":
                    iconFrame = 28;
                    break;
                case "speed":
                    iconFrame = 27;
                    break;
                default:
                    break;
            }

            const charShadow = this.add.sprite(-15, 8, "buttons").setFrame(iconFrame).setScale(0.4);
            this.barContainer.add(charShadow);

            // Add a label for the attribute
            // const attributeText = attribute.charAt(0).toUpperCase() + attribute.slice(1);
            // const label = this.add.text(-51, 0, attributeText, {
            //     fontSize: "14px",
            //     color: "#ffffff"
            // });
            // this.barContainer.add(label);

            const txtLocation = attribute == "life" ? 0 : 85;
            const valueLabel = this.add.text(txtLocation, 0, value, {
                fontSize: "14px",
                color: "#ffffff"
            });
            this.barContainer.add(valueLabel);
        });

        const valueLabel = this.add.text(0, 20, "LVL.".concat(this.currentCharDetails.level.current), {
            fontSize: "20px",
            color: "#ffffff",
            fill: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000', // Border color
            strokeThickness: 3 // Border thickness
        });
        this.barContainer.add(valueLabel);
    }

    createName() {
        // Clear the container first
        this.charNameContainer.removeAll(true);

        const createAChampionText = this.add.sprite(95, 0, "createAChampion").setFrame(1).setOrigin(0, 0);
        this.charNameContainer.add(createAChampionText);

        const loginText = this.add.sprite(this.scale.width - 110, 0, "loginTxt").setFrame(1).setOrigin(0, 0);
        loginText.setInteractive();
        this.charNameContainer.add(loginText);

        loginText.on("pointerdown", () => {
            this.flags.isSaving = true;

            const modal = document.createElement("div");
            modal.innerHTML = `
                    <div style="
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background: white;
                        padding: 20px;
                        box-shadow: 0px 0px 10px rgba(0,0,0,0.2);
                        text-align: center;
                        border-radius: 8px;
                    ">
                        <p>Username:</p>
                        <input type="text" id="usernameInput" style="padding: 5px; width: 200px;">
                        <p>Password:</p>
                        <input type="password" id="passwordInput" style="padding: 5px; width: 200px;">
                        <br><br>
                        <button id="submitPasswordBtn" style="padding: 5px 10px;">Submit</button>
                        <button id="cancelPasswordBtn" style="padding: 5px 10px; margin-left: 10px;">Cancel</button>
                    </div>
                `;

            document.body.appendChild(modal);

            document.getElementById("submitPasswordBtn").addEventListener("click", () => {
                const password = document.getElementById("passwordInput").value;
                const user_name = document.getElementById("usernameInput").value;
                console.log({ password: password });
                console.log({ user_name: user_name });
                if (user_name && password) {
                    const activeUserName = this.existingUsers.filter(data => data.name == user_name);

                    if (activeUserName.length > 0) {
                        this.saveToLocalStorage("recentLogin", true);
                        this.saveToLocalStorage(CONSTANTS._charUserKey, activeUserName[0].name); // character user key
                        this.saveToLocalStorage(CONSTANTS._charDetailsKey, activeUserName[0]); // character data
                        this.validateLoggedIn();

                    } else {
                        this.createToast(this.generateRandomKeys(), CONSTANTS._errorMessages.invalidCreds);
                    }
                } else {
                    this.createToast(this.generateRandomKeys(), CONSTANTS._errorMessages.requireCreds);
                }

                document.body.removeChild(modal);
            });

            // Handle modal cancel
            document.getElementById("cancelPasswordBtn").addEventListener("click", () => {
                this.flags.isSaving = false;
                document.body.removeChild(modal);
            });
            // Show prompt for username

        });

        // Add the "Enter Name" text below the "Create Character" title
        let nameText = this.add.text(120, 80, CONSTANTS._messages.inputName, {
            fontSize: '20px',
            fill: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',          // Border color
            strokeThickness: 1          // Border thickness
        });

        this.charNameContainer.add(nameText);

        if (!this.flags.isSaving) {

            // Enable typing by listening to keyboard input
            this.input.keyboard.on("keydown", (event) => {
                // Handle backspace
                if (this.flags.isSaving) return;
                if (event.key === "Backspace") {
                    this.currentCharDetails.name = this.currentCharDetails.name.slice(0, -1); // Remove last character
                    if (!this.flags.isLock) this.changeRandom();
                }
                // Handle alphanumeric input
                else if (event.key.length === 1 && event.key.match(/^[a-zA-Z0-9]$/)) {
                    // Only allow alphanumeric characters
                    if (this.currentCharDetails.name.length < 14) {
                        this.currentCharDetails.name += event.key; // Append new character
                        if (!this.flags.isLock) this.changeRandom();
                    } else {
                        // Optional: Feedback for exceeding max characters
                        this.createToast(this.generateRandomKeys(), CONSTANTS._errorMessages.maxCharNameLength.concat(this.currentCharDetails.name.length));
                        this.flags.isSaving = true;
                    }
                }
                // Handle invalid input (e.g., spaces)
                else if (event.key === " ") {
                    this.createToast(this.generateRandomKeys(), CONSTANTS._errorMessages.noSpace);
                    this.flags.isSaving = true;
                } else if (!event.key.match(/^[a-zA-Z0-9]*$/)) {
                    this.createToast(this.generateRandomKeys(), CONSTANTS._errorMessages.noSpecialChar);
                    this.flags.isSaving = true;
                }

                // Update the displayed text
                nameText.setText(this.currentCharDetails.name || CONSTANTS._messages.inputName);
                this.renderButtons();
            });

            // Make the text interactive to simulate focus
            nameText.setInteractive();
            nameText.on("pointerdown", () => {
                // Highlight or give visual feedback (optional)
                nameText.setStyle({ backgroundColor: "#743f39" });
            });
        }
    }

    createToolTip(toHover, content, utilKeys) {

        var position = {
            x: CONSTANTS._gameWidth,
            y: CONSTANTS._gameHeight
        };

        switch (utilKeys) {
            case "skills":
                position.x += 180, // left
                    position.y -= 170 // top
                break;
            case "weapons":
                break;
            case "pets":
                break;
            default:
                break;
        }

        toHover.setInteractive();

        toHover.on("pointerover", () => {
            document.getElementById("phaser-tooltip")?.remove();

            const modal = document.createElement("div");
            modal.id = "phaser-tooltip";
            modal.innerHTML = `
            <div class="position-absolute bg-dark text-white border rounded p-3" 
                 style="left: ${position.x}px; top: ${position.y}px; z-index: 1000; 
                        max-width: 350px; padding: 15px; border-radius: 8px; 
                        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2); font-weight: bold; border: 2px solid #ffffff;">
                ${content}
            </div>
        `;

            document.body.appendChild(modal);
        });

        toHover.on("pointerout", () => document.getElementById("phaser-tooltip")?.remove());
    }

    // GET random skill, weapon, pet, etc.
    getRandomItem(items) {

        let totalChance = items.reduce((sum, item) => sum + item.chance, 0);
        let randomNum = Math.random() * totalChance;
        let cumulativeChance = 0;

        for (let item of items) {
            cumulativeChance += item.chance;
            if (randomNum <= cumulativeChance) {
                return item;
            }
        }
    }

    getRandomUtils() {
        // todo avoid getting same skills and weapons
        const randomUtils = this.getRandomItem(CONSTANTS._utils);
        let utils;
        switch (randomUtils.name) {
            case "skills":
                utils = this.getRandomItem(CONSTANTS._skills);
                break;
            case "weapons":
                utils = this.getRandomItem(CONSTANTS._weapons);
                break;
            case "pets":
                var petResult = this.getRandomItem(CONSTANTS._pets);
                petResult.types = petResult.types[this.randomizer(petResult.types.length - 1)];
                utils = petResult;
                break;
            default:
                this.createToast(this.generateRandomKeys(), CONSTANTS._errorMessages.noUtilitiesFound);
        }

        if (utils) return { key: randomUtils.name, value: utils };
    }

    saveToLocalStorage(key, data) {
        const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), key.concat("1")).toString();
        localStorage.setItem(key, encryptedData);
    };

    loadCharacter() {
        const encryptedData = localStorage.getItem(CONSTANTS._charDetailsKey);

        if (encryptedData) {
            try {
                const bytes = CryptoJS.AES.decrypt(encryptedData, CONSTANTS._charDetailsKey.concat("1"));
                const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                // console.log("Character loaded!", decryptedData);
                return decryptedData;
            } catch (error) {
                console.error(CONSTANTS._errorMessages.failedDecrypt, error);
                return null;
            }
        }

        return null;
    }

    validateLoggedIn() {
        const activeUserName = localStorage.getItem(CONSTANTS._charUserKey);
        const activeUserDetails = localStorage.getItem(CONSTANTS._charDetailsKey);

        if (activeUserName && activeUserDetails) {
            try {
                const bytes = CryptoJS.AES.decrypt(activeUserDetails, CONSTANTS._charDetailsKey.concat("1"));
                const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                // console.log("Character logged In!", decryptedData);
                // this.scene.start("playerHome");
                
                this.scene.start("playerSelect");
            } catch (error) {
                console.error(CONSTANTS._errorMessages.failedDecrypt, error);
            }
        }
        // get db user data
        // login user data
    }

    displayloggedOut() {

        const localStorageLogout = localStorage.getItem(CONSTANTS._logout);

        if (localStorageLogout) {
            // setTimeout(() => {
            this.createToast(this.generateRandomKeys(), CONSTANTS._successMessages.logoutSuccess, true);
            // }, 500);

            localStorage.removeItem(CONSTANTS._charUserKey);
            localStorage.removeItem(CONSTANTS._charDetailsKey);
            localStorage.removeItem(CONSTANTS._logout);
        }
    }

    /**
     * Create reusable toast component to display message
     * @param {string} key - use as button id
     * @param {string} message - toast message
     * @param {boolean} isSuccess - flag for success or failed Message styling and display
     * @returns {void}
     */
    createToast(key, message, isSuccess) {
        const createSceneInstance = this;
        const color = isSuccess ? "success" : "danger";
        const header = isSuccess ? "Success" : "Failed";

        // Create toast container if not exists
        let toastContainer = document.getElementById("toast-container");
        if (!toastContainer) {
            toastContainer = document.createElement("div");
            toastContainer.id = "toast-container";
            toastContainer.className = "toast-container position-fixed top-0 end-0 p-3";
            document.body.appendChild(toastContainer);
        }

        // Generate a unique key for each toast
        const toastId = `toast-${Date.now()}`;

        // Create toast element
        const toast = document.createElement("div");
        toast.className = `toast align-items-center text-bg-${color} border-0 show mb-2`; // `mb-2` for spacing
        toast.setAttribute("role", "alert");
        toast.setAttribute("aria-live", "assertive");
        toast.setAttribute("aria-atomic", "true");
        toast.id = toastId; // Assign unique ID

        toast.innerHTML = `
            <div class="toast-header">
                <strong class="me-auto">${header}</strong>
                <small class="text-dark">Just now</small>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        `;

        toastContainer.appendChild(toast);

        // Initialize Bootstrap toast
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();

        // Close toast on button click
        toast.querySelector(".btn-close").addEventListener("click", function () {
            createSceneInstance.flags.isSaving = false;
            bsToast.hide();
            setTimeout(() => toast.remove(), 500);
        });

        // Auto-hide the toast after 3 seconds
        setTimeout(() => {
            createSceneInstance.flags.isSaving = false;
            bsToast.hide();
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    generateRandomKeys() {
        return Math.random().toString(36).substring(2, 7);
    }

    renderUtils() {
        const columns = 11; // Number of sprites per row
        const spriteSize = 32; // Size of each sprite
        let maxSprites = 55;

        for (let i = 0; i < 55; i++) {

            let positon = {
                x: 100 + (i % columns) * spriteSize,
                y: 100 + Math.floor(i / columns) * spriteSize
            }
            const closeSkill_sprite = this.add.image(positon.x + 332, positon.y + 301, 'bgSkills_Close', i);
            const skillDescription = CONSTANTS._skills.filter(skill => skill.number == maxSprites);
            const skillContent = `<span class="text-warning">${skillDescription[0].name}</span>: ${skillDescription[0].description}`;
            this.createToolTip(closeSkill_sprite, skillContent, "skills");

            this.characterContainer.add(closeSkill_sprite);
            maxSprites--;
        }
    }

    setLoading(withLoading) {
        const loadingScreen = document.getElementById("loading-screen");
        if (loadingScreen) {
            loadingScreen.style.display = withLoading ? "flex" : "none";
        } else {
            console.warn("Loading screen element not found!");
        }
    }
}

