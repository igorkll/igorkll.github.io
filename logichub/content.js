{
let cards = document.getElementById('cards');
let categories = document.getElementById('categories');

const states = {
    WIP: 0,
    SUSPENDED: 1,
    SUPPORTED: 2,
    COMPLETED: 3,
    REJECTED: 4,
};

let categoriesList = [];
let anchors = {};
let seletedCategory;

function selectCategory(categoryName) {
    for (let key in categoriesList) {
        let categoryObj = categoriesList[key];
        categoryObj[0].style.display = 'none';
        categoryObj[1].classList.remove("category-selector-button-active");
    }

    let categoryObj = categoriesList[categoryName];
    categoryObj[0].style.display = 'flex';
    categoryObj[1].classList.add("category-selector-button-active");
    seletedCategory = categoryObj[0];
}

function addCategory(categoryName) {
    let categoryButton = document.createElement('div');
    categoryButton.classList.add('category-selector-button');

    if (categoryName != null) {
        categoryButton.innerHTML = categoryName;
    }

    categoryButton.addEventListener('click', () => {
        selectCategory(categoryName);
    })

    categories.appendChild(categoryButton);

    // --------------------------------

    let categoryRoot = document.createElement('div');
    categoryRoot.classList.add('content-box');
    cards.appendChild(categoryRoot);
    
    categoriesList[categoryName] = [categoryRoot, categoryButton];
    
    categoryRoot.style.display = 'none';
    cards.appendChild(categoryRoot);

    // --------------------------------

    if (seletedCategory == null) {
        selectCategory(categoryName);
    }
}

function getCategoryRoot(categoryName) {
    if (categoriesList[categoryName] == null) {
        addCategory(categoryName);
    }

    return categoriesList[categoryName][0];
}

function addCard(title, description, logo, previews, buttons, langs, anchor, state, category) {
    let cardBody = document.createElement('div');
    cardBody.id = anchor;
    cardBody.classList.add('content-part');
    cardBody.classList.add('box-shadow');
    if (category != null) {
        let categoryRoot = getCategoryRoot(category);
        categoryRoot.appendChild(cardBody);
    } else {
        cards.appendChild(cardBody);
    }

    if (anchor != null && category != null) {
        anchors[anchor] = category;
    }

    if (title) {
        let cardTitle = document.createElement('div');
        cardTitle.classList.add('content-title');
        cardTitle.classList.add('text-shadow');
        cardTitle.innerHTML = title
        cardBody.appendChild(cardTitle);
    }

    if (previews) {
        if (previews.length == 1) {
            let cardPreview = document.createElement('img');
            cardPreview.classList.add('content-preview');
            cardPreview.classList.add('box-shadow');
            cardPreview.src = previews[0];
            cardBody.appendChild(cardPreview);
        } else {
            let previewScrollContainer = document.createElement('div');
            previewScrollContainer.classList.add('content-scroll-container');
            cardBody.appendChild(previewScrollContainer);

            let previewScrollButtons = document.createElement('div');
            previewScrollButtons.classList.add('content-scroll-button-container');
            previewScrollContainer.appendChild(previewScrollButtons);

            let previewScroll = document.createElement('div');
            previewScroll.classList.add('content-preview-scroll');
            previewScrollContainer.appendChild(previewScroll);

            for (let preview of previews) {
                if (getExtension(preview) == 'mp4') {
                    let cardPreview = document.createElement('video');
                    cardPreview.classList.add('content-preview');
                    cardPreview.classList.add('box-shadow');
                    cardPreview.src = preview;
                    cardPreview.controls = true;
                    previewScroll.appendChild(cardPreview);
                } else {
                    let cardPreview = document.createElement('img');
                    cardPreview.classList.add('content-preview');
                    cardPreview.classList.add('box-shadow');
                    cardPreview.src = preview;
                    previewScroll.appendChild(cardPreview);
                }
            }

            let previewScrollSub;
            let previewScrollAdd;

            let updateArrows = (index, maxIndex) => {
                previewScrollSub.style.visibility = index == 0 ? 'hidden' : 'visible';
                previewScrollAdd.style.visibility = index == (maxIndex - 1) ? 'hidden' : 'visible';
            };

            previewScrollSub = document.createElement('div');
            previewScrollSub.classList.add('content-scroll-button');
            previewScrollButtons.appendChild(previewScrollSub);

            let previewScrollSubIcon = document.createElement('div');
            previewScrollSubIcon.style.width = '60%';
            previewScrollSub.appendChild(previewScrollSubIcon);
            placeSvg('svg/left.svg', previewScrollSubIcon, '#000000ff');
            
            previewScrollSub.addEventListener('click', () => {
                let [index, maxIndex] = scrollToItem(previewScroll, -1);
                updateArrows(index, maxIndex);
            });

            previewScrollAdd = document.createElement('div');
            previewScrollAdd.classList.add('content-scroll-button');
            previewScrollButtons.appendChild(previewScrollAdd);
            
            let previewScrollAddIcon = document.createElement('div');
            previewScrollAddIcon.style.width = '60%';
            previewScrollAdd.appendChild(previewScrollAddIcon);
            placeSvg('svg/right.svg', previewScrollAddIcon, '#000000ff');

            previewScrollAdd.addEventListener('click', () => {
                let [index, maxIndex] = scrollToItem(previewScroll, 1);
                updateArrows(index, maxIndex);
            });

            let [index, maxIndex] = scrollToItem(previewScroll, 0);
            updateArrows(index, maxIndex);
        }
    }
    
    if (description) {
        let cardDescription = document.createElement('div');
        cardDescription.classList.add('content-description');
        cardDescription.classList.add('text-shadow');
        cardDescription.classList.add('box-shadow');
        cardDescription.innerHTML = description.replace(/\n/g, '<br>');
        cardBody.appendChild(cardDescription);
    }

    let cardCombiner = document.createElement('div');
    cardCombiner.classList.add('content-combiner');
    cardBody.appendChild(cardCombiner);

    if (buttons) {
        let cardButtons = document.createElement('div');
        cardButtons.classList.add('content-horisontal');
        cardButtons.classList.add('combiner-overlay');
        cardCombiner.appendChild(cardButtons);

        for (let buttoninfo of buttons) {
            let cardButton = document.createElement('div');
            cardButton.classList.add('button');
            cardButton.classList.add('box-shadow');
            cardButton.innerHTML = buttoninfo[0];
            cardButtons.appendChild(cardButton);

            cardButton.addEventListener('click', () => {
                let actiontype;
                if (buttoninfo.length >= 3) actiontype = buttoninfo[2];

                if (actiontype === 'dlgithub') {
                    downloadRelease(buttoninfo[1]);
                } else {
                    window.open(buttoninfo[1], '_blank');
                }
            });
        }
    }

    let cardStart = document.createElement('div');
    cardStart.classList.add('content-horisontal-start');
    cardCombiner.appendChild(cardStart);

    let stateText;
    let stateColor;
    let stateIcon;
    switch (state) {
        case states.WIP:
            stateText = "Work in process";
            stateColor = '#f9c701ff';
            stateIcon = 'svg/wip.svg';
            break;

        case states.SUSPENDED:
            stateText = "Suspended";
            stateColor = '#f96001ff';
            stateIcon = 'svg/suspended.svg';
            break;

        case states.COMPLETED:
            stateText = "Completed";
            stateColor = '#01f901ff';
            stateIcon = 'svg/completed.svg';
            break;

        case states.SUPPORTED:
            stateText = "Supported";
            stateColor = '#01f9e0ff';
            stateIcon = 'svg/supported.svg';
            break;

        case states.REJECTED:
            stateText = "Rejected";
            stateColor = '#f8130bff';
            stateIcon = 'svg/rejected.svg';
            break;
    }

    if (stateText != null) {
        let stateObj = document.createElement('div');
        stateObj.classList.add('state');
        stateObj.classList.add('box-shadow');
        stateObj.classList.add('content-horisontal');
        stateObj.style.gap = 'var(--content-padding)'
        cardStart.appendChild(stateObj);

        let stateIconObj = document.createElement('div');
        stateIconObj.style.width = '40px';
        stateObj.appendChild(stateIconObj);

        let stateTextObj = document.createElement('div');
        stateTextObj.innerHTML = stateText;
        stateTextObj.style.color = stateColor;
        stateObj.appendChild(stateTextObj);

        placeSvg(stateIcon, stateIconObj, stateColor);
    }

    let cardTitlebar = document.createElement('div');
    cardTitlebar.classList.add('content-titlebar');
    cardBody.appendChild(cardTitlebar);

    if (logo) {
        let cardLogo = document.createElement('img');
        cardLogo.classList.add('content-logo');
        cardLogo.src = logo;
        cardTitlebar.appendChild(cardLogo);
    }

    if (langs) {
        let cardLangs = document.createElement('div');
        cardLangs.classList.add('content-langs');
        cardTitlebar.appendChild(cardLangs);

        for (let lang of langs) {
            let cardLogo = document.createElement('img');
            cardLogo.classList.add('content-logo');
            cardLogo.src = 'langs/' + lang + '.png';
            cardLangs.appendChild(cardLogo);
        }
    }

    return cardBody;
}

let logicCard = addCard('Logic', 
`Hello! I am logic and BananaPen.
I love playing ScrapMechanic and programming.
This page is something like a collection of my projects that are ready for publication.
You will also find my contacts here so that you can contact me.`,
null, null, 
null, ['c', 'cs', 'js', 'lua', 'python']);
cards.insertBefore(logicCard, cards.firstChild)

// --------------------------------------------------------------- Devices

addCard('LGC Boombox', 
`WORK IN PROCESS! wait for the release
this speaker has a touchscreen display and runs on a redesigned Windows 10
i used winbox maker (my program) to create a custom Windows build: <a href="https://github.com/igorkll/WinBox-Maker/releases">https://github.com/igorkll/WinBox-Maker/releases</a>
WARNING! download the release (wait for the release), not the master branch. I'm doing a project in this branch, and there will probably be an unstable version, possibly completely broken
don't expect outstanding sound quality from this speaker. Also, an old motherboard from a tonk thin client will drain the battery quickly. my speaker runs for ~2 hours on a single charge`,
null, [
    'https://raw.githubusercontent.com/igorkll/LGC-Boombox/refs/heads/main/preview.jpg',
    'https://raw.githubusercontent.com/igorkll/LGC-Boombox/refs/heads/main/preview.mp4'
], 
[
    ['Project page', 'https://github.com/igorkll/LGC-Boombox']
], ['js', 'cs'], null, states.WIP, 'Devices');

// --------------------------------------------------------------- Software

addCard('WinBox Maker', 
`a tool for creating minimal embed versions of windows
takes on the task of modifying the windows image to remove excess and embed software there
the program is perfect for windows builds designed for ATM terminals and other devices that unauthorized people have access to and should not be allowed to leave the specified sandbox
the program needs to be run with administrator rights because it mounts images
the program is primarily aimed at creating Windows images for operation in kiosk mode, that is, the user will have access to only one of your programs that you add to the image and nothing more
however, the program can be used in other usage scenarios (for example, creating a TV set-top box or a Windows-based slot machine)
please note that the program requires the "dism" utility. usually it is built into Windows
the program is recommended to be used with the original English image of "Windows 10 Enterprise"
please note that winbox maker does not provide Windows images, it only provides a tool for reassembling Windows for use in kiosk mode`,
'logos/winbox.png', [
    'https://raw.githubusercontent.com/igorkll/WinBox-Maker/refs/heads/master/preview.png',
    'https://raw.githubusercontent.com/igorkll/WinBox-Maker/refs/heads/master/preview2.png',
    'https://raw.githubusercontent.com/igorkll/WinBox-Maker/refs/heads/master/preview3.png',
], 
[
    ['Project page', 'https://github.com/igorkll/WinBox-Maker'],
    ['Download', 'WinBox-Maker', 'dlgithub']
], ['cs'], 'winbox', states.SUPPORTED, 'Software');

// --------------------------------------------------------------- Services

addCard('Scrap Mechanic Server', 
`This is a survival server with mods
Here you can play with other people
You can build houses, create your own settlement, farm, or become a programmer and write code for SComputers!
The server has protection against crashes and dupes`,
'logos/smserver.png', ['images/smserver.png'], 
[
    ['Project page', 'https://igorkll.github.io/smserver/'],
    ['Steam page', 'https://steamcommunity.com/profiles/76561199809172866/']
], ['lua', 'cs', 'python'], null, states.SUPPORTED, 'Services');

// --------------------------------------------------------------- Scrap mechanic mods

addCard('SComputers', 
`SComputers is the best mod adding computers to Scrap Mechanic at the moment!
this mod originates from the ScriptableComputer mod, which is no longer supported by the developer
in fact, SComputers is an improved version of ScriptableComputer that has retained full compatibility with the original
the author of the original ScriptableComputer(TheFattestCat) doesn't mind that I'm doing a fork. and i got permission to create a fork`,
'logos/SComputers.png', ['images/SComputers.png'], 
[
    ['Project Page', 'https://igorkll.github.io/SComputers/'],
    ['Steam page', 'https://steamcommunity.com/sharedfiles/filedetails/?id=2949350596'],
    ['Repository', 'https://github.com/igorkll/SComputers']
], ['lua'], null, states.SUPPORTED, 'Scrap mechanic mods');

addCard('betterAPI', 
`this API adds additional methods to the game.
however, it does not provide full access to the lua API.
this mod expands the capabilities of the game API by adding additional features for use by other mods.
betterAPI has a built-in package manager with extensions. to open it, write to the chat /better

manual installation:
1. close scrap mechanic
2. subscribe to the mod
3. open folder: Steam\\steamapps\\workshop\\content\\387990\\3177944610\\content
4. copy all files
5. open folder: Steam\\steamapps\\common\\Scrap Mechanic\\Release
6. insert all the files with the replacement`,
'logos/betterAPI.png', ['images/betterAPI.jpg'], 
[
    ['Project Page', 'https://igorkll.github.io/betterAPI/'],
    ['Steam page', 'https://steamcommunity.com/sharedfiles/filedetails/?id=3177944610']
], ['lua', 'python', 'cpp', 'cs', 'c'], 'betterAPI', states.SUPPORTED, 'Scrap mechanic mods');

addCard('NES Emulator', 
`this mod allows you to emulate your favorite games from the NES platform right inside Scrap Mechanic!
this is a real emulator running inside the game, you can even connect a second controller and play with your friends!
just connect the console to the display and the joysticks to the console. insert the cartridge and play the NES right inside Scrap Mechanic!
the list of games will be updated, as well as in the future there will be support for add-ons for additional cartridges
audio emulation is not supported at the moment, but it will be supported in the future.
unfortunately, due to the restricted API of the game, when pressing several buttons in the joystick GUI, bugs sometimes occur and other buttons are released. if you install betterAPI, the button processing works fine, otherwise it is better to connect the controller with the seat.
you can connect the joystick to the seat to control the game from it. to import other control buttons, use the "Control Import" unit and connect it to the joystick.

controls:
wasd - crosshair
enter - start
i - select
o - B
p - A

unfortunately, the mod causes the STRONGEST LAGS!!! without betterAPI, the game runs at about 4-7 FPS and the console is slow. with betterAPI starting from version 40 (I added multithreading), the game outputs 70-120 FPS and the console runs at normal speed
i wish the developers of ScrapMechanic health and patience, and FINALLY MAKE A MULTITHREADED API FOR LUA!!
the emulator always works on the server side so that the game is synchronous for all players, so it is better that the host has a powerful processor. for the mod to work well, you need a single stream (high frequency)`,
null, ['images/NES_Emulator.jpg'], 
[
    ['Steam page', 'https://steamcommunity.com/sharedfiles/filedetails/?id=3353025650']
], ['lua'], null, states.COMPLETED, 'Scrap mechanic mods');

addCard('Robotization', 
`this mod allows you to create autopiloted cars/aircraft.
this mod can be guided in different ways and on different objects: tags, players, units, creations, etc.
it can be guided to a specific position specified by numerical logic.
a block with a specific uuid (guidance on the uuid has not yet been done).

this mod is designed to work in conjunction with "The modpack" or another mod that allows you to work with numbers.
crafting recipes will be added soon.
if a bug is found, I strongly ask you to write in the comments (and it will be fixed soon).

returns to the past at the time of 0.3.5))`,
null, ['images/robotization.jpg'], 
[
    ['Project page', 'https://steamcommunity.com/sharedfiles/filedetails/?id=2936300656']
], ['lua'], null, states.COMPLETED, 'Scrap mechanic mods');

addCard('Pocket Universe', 
`this mod allows you to create a separate small world in one block!
they can be used to make a magic circuit in one block!
please note that it is highly discouraged to use bearings inside the pocket universe, and IN ANY CASE, it is impossible to use loose parts!`,
null, ['images/pocket_universe.jpg'], 
[
    ['Project page', 'https://steamcommunity.com/sharedfiles/filedetails/?id=3088831605']
], ['lua'], null, states.COMPLETED, 'Scrap mechanic mods');

addCard('Wired & Wireless Cameras', 
`Adds cameras to the game with the ability to set a password and connect to them via a monitor.
you can even control the creation through the camera!
there are no visual distortions when the camera is moving.
the cameras can be connected directly or wirelessly.`,
null, ['images/wired_wireless_cameras.jpg'], 
[
    ['Project page', 'https://steamcommunity.com/sharedfiles/filedetails/?id=3034272798']
], ['lua'], null, states.COMPLETED, 'Scrap mechanic mods');

addCard('The Garment Cracker', 
`This custom game allows you to unlock all the clothes in the game in a couple of minutes.
dressbot is accelerated, and does everything in one go.
endless clothes and cotton appear in the inventory.
this option is great for those who do not want to sweat getting clothes or play only in the creative.`,
null, ['images/the_garment_cracker.jpg'], 
[
    ['Project page', 'https://steamcommunity.com/sharedfiles/filedetails/?id=3157384106']
], ['lua'], null, states.COMPLETED, 'Scrap mechanic mods');

addCard('Dangerous Blocks', 
`various DANGEROUS blocks, be careful!

black hole:
* sucks in creations/players/mobs

virus block:
* jumps between creations, spreads and interferes with the work of creations`,
null, ['images/dangerous_blocks.jpg'], 
[
    ['Project page', 'https://steamcommunity.com/sharedfiles/filedetails/?id=2989704611']
], ['lua'], null, states.COMPLETED, 'Scrap mechanic mods');

addCard('sound mod', 
`this mod adds speakers, turntables and records.
betterAPI game extensions are required for the mod to work.
the mod supports crafting, but the plates are not crafting.
plates in survival mode spawn in peace on earth.
the chance of finding a record is extremely small, on average one record will spawn once every 30 minutes. and the probability of finding it for the average player is ~ 10%. which means that you will receive approximately one record at 5 o'clock`,
null, ['images/sound_mod.jpg'], 
[
    ['Project page', 'https://steamcommunity.com/sharedfiles/filedetails/?id=2948210047']
], ['lua'], null, states.COMPLETED, 'Scrap mechanic mods');

addCard('alert mod', 
`contains three blocks for displaying messages to all players.
you enter the message yourself, which will be displayed when a logical signal is given.

types of output blocks:
* alert (displays a message from the top of the screen)
* chat
* console (outputs a message to the game's debugging console (launch option -dev))`,
null, ['images/alert_mod.jpg'], 
[
    ['Project page', 'https://steamcommunity.com/sharedfiles/filedetails/?id=3336418301']
], ['lua'], null, states.COMPLETED, 'Scrap mechanic mods');

addCard('advanced destruction physics', 
`This mod adds full-fledged destruction physics to the game.
This mod works automatically and does not require complicated configuration.
This mod (unlike similar ones available in the workshop) allows you to destroy one object against another (for example, you can break through a house with a car).
Please note that large creations can break down under their own weight.
The quality of destruction physics may decrease with lower FPS!!
The mod is not yet fully completed, and there may be bugs and inaccuracies in it.
IT IS STRONGLY NOT RECOMMENDED TO BUILD ANYTHING IN THE WORLD WHERE THIS MOD IS ENABLED, AS YOUR CREATION MAY SPONTANEOUSLY COLLAPSE!!!!`,
null, [
    'images/advanced_destruction_physics.jpg',
    'images/advanced_destruction_physics/1.jpg',
    'images/advanced_destruction_physics/2.jpg',
    'images/advanced_destruction_physics/3.jpg',
], 
[
    ['Project page', 'https://steamcommunity.com/sharedfiles/filedetails/?id=3171090685']
], ['lua'], null, states.COMPLETED, 'Scrap mechanic mods');

addCard('online boombox', 
`This radio runs on betterAPI and can play music via a direct link.
unfortunately, you cannot insert a link from youtube or something like that here,
but you can place your .mp3/.wav file on any hosting (for example, github) and insert a direct (raw) link to the file.
direct links to streaming Internet radio stations will also work (however, connecting to a streaming radio station can take a long time and not the first time).

SComputers api:
component name - onlineBoombox
onlineBoombox.play()
onlineBoombox.stop()
onlineBoombox.setVolume(value:number(0-1))
onlineBoombox.setMute(state:boolean)
onlineBoombox.setUrl(url:string)`,
null, ['images/online_boombox.jpg'], 
[
    ['Project page', 'https://steamcommunity.com/sharedfiles/filedetails/?id=3185287679']
], ['lua'], null, states.COMPLETED, 'Scrap mechanic mods');

// --------------------------------------------------------------- Other

addCard('esp32 opencomputers', 
`<h1 style="font-size: 32px; font-weight: bold; margin: 11px 0;">ESP32 - opencomputers emulator</h1><ul style="padding-left: 24px; list-style-type: disc;"><li style="margin: 8px 0;">emulates opencomputers on esp32</li><li style="margin: 8px 0;">the original opencomputers font</li><li style="margin: 8px 0;">sound is supported</li><li style="margin: 8px 0;">support screen backlight control via screen.turnOff / screen.turnOn</li><li style="margin: 8px 0;">screen.getAspectRatio returns the actual aspect ratio of the display</li><li style="margin: 8px 0;">all work with esp-idf is done in the "hal.h" and "hal.c" files so that the code can be easily adapted to different platforms and peripherals</li><li style="margin: 8px 0;">supports unicode</li><li style="margin: 8px 0;">to simulate the right mouse button, use a long press at one point of the screen</li><li style="margin: 8px 0;">computer case LEDs are supported</li><li style="margin: 8px 0;">a large number of settings in config.h</li><li style="margin: 8px 0;">hardware on/off/reboot buttons are supported</li><li style="margin: 8px 0;">self-locking power is supported</li><li style="margin: 8px 0;">the UUIDs of all components are randomly generated when the device is turned on for the first time</li><li style="margin: 8px 0;">screen precise mode is supported</li><li style="margin: 8px 0;">an SD card is supported (it is defined as a floppy disk)</li><li style="margin: 8px 0;">disk_drive.eject() unmounts the sd card. after that, it can be extracted without the risk of damaging the filesystem</li><li style="margin: 8px 0;">you can assign a separate LED to the memory card, which will blink when it is accessed</li></ul>`,
null, [
    'images/temporarily_unavailable.png',
], 
[
    ['Project page', 'https://github.com/igorkll/esp32_opencomputers'],
    ['Download', 'esp32_opencomputers', 'dlgithub']
], ['c', 'lua'], null, states.SUSPENDED, 'Other');

addCard('os in opencomputers - liked', 
`<h1 style="font-size: 32px; font-weight: bold; margin: 11px 0;">liked &amp; likeOS</h1><p style="margin: 16px 0; line-height: 1.6; color: #ffffff;">liked is a system based on likeOS.<br>designed for computers from the OpenComputers mod for Minecraft.<br>the installer can be run from any other OS or from the eeprom firmware.</p><h3 style="font-size: 19px; font-weight: bold; margin: 14px 0;">minimum system requirements:</h3><ul style="padding-left: 24px; list-style-type: disc;"><li style="margin: 8px 0;">video card - tier2</li><li style="margin: 8px 0;">monitor - tier2</li><li style="margin: 8px 0;">RAM - 768KB</li><li style="margin: 8px 0;">processor - tier1</li><li style="margin: 8px 0;">hdd - tier2</li></ul><h3 style="font-size: 19px; font-weight: bold; margin: 14px 0;">recommended system requirements:</h3><ul style="padding-left: 24px; list-style-type: disc;"><li style="margin: 8px 0;">video card - tier3</li><li style="margin: 8px 0;">monitor - tier3</li><li style="margin: 8px 0;">RAM - 1536KB</li><li style="margin: 8px 0;">processor - tier2</li><li style="margin: 8px 0;">hdd - tier2</li></ul><p style="margin: 16px 0; line-height: 1.6; color: #ffffff;">if openOS is installed on the device, then during installation, liked will offer to save your OS.<br>after which it can be launched with a single click on the liked desktop.</p><h2 style="font-size: 24px; font-weight: bold; margin: 12px 0;">installer link</h2><ul style="padding-left: 24px; list-style-type: disc;"><li style="margin: 8px 0;">installer: <a href="https://raw.githubusercontent.com/igorkll/liked/main/installer/webInstaller.lua" title="" style="color: #03d6d2; text-decoration: none;">https://raw.githubusercontent.com/igorkll/liked/main/installer/webInstaller.lua</a></li><li style="margin: 8px 0;">computercraft version(not supported yet): <a href="https://raw.githubusercontent.com/igorkll/liked/main/installer/computercraft.lua" title="" style="color: #03d6d2; text-decoration: none;">https://raw.githubusercontent.com/igorkll/liked/main/installer/computercraft.lua</a></li></ul><h2 style="font-size: 24px; font-weight: bold; margin: 12px 0;">installation commands:</h2><ul style="padding-left: 24px; list-style-type: disc;"><li style="margin: 8px 0;">openOS : wget <a href="https://raw.githubusercontent.com/igorkll/liked/main/installer/webInstaller.lua" title="" style="color: #03d6d2; text-decoration: none;">https://raw.githubusercontent.com/igorkll/liked/main/installer/webInstaller.lua</a> /tmp/like; /tmp/like</li><li style="margin: 8px 0;">craftOS: wget run <a href="https://raw.githubusercontent.com/igorkll/liked/main/installer/computercraft.lua" title="" style="color: #03d6d2; text-decoration: none;">https://raw.githubusercontent.com/igorkll/liked/main/installer/computercraft.lua</a></li></ul>`,
null, [
    'images/temporarily_unavailable.png',
], 
[
    ['Project page', 'https://github.com/igorkll/liked']
], ['lua'], null, states.REJECTED, 'Other');

// ---------------------------------------------------------------

let anchor = location.hash.substring(1);

if (anchor) {
    let category = anchors[anchor];
    if (category != null) {
        selectCategory(category);
    }

    let element = document.getElementById(anchor);
    if (element != null) {
        element.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

}