let anchors = {};

{
let cards = document.getElementById('cards');
let categories = document.getElementById('categories');

const states = {
    WIP: 0,
    SUSPENDED: 1,
    SUPPORTED: 2,
    COMPLETED: 3,
    REJECTED: 4,
    BETA: 5,
    WAIT_PUBLISH: 6
};

let categoriesList = [];
let seletedCategory;

window.selectCategory = function (categoryName) {
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
        categoryButton.innerText = categoryName;
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

function addState(parent, state) {
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

        case states.BETA:
            stateText = "Beta test";
            stateColor = '#ff5afcff';
            stateIcon = 'svg/beta.svg';
            break;

        case states.WAIT_PUBLISH:
            stateText = "Awaiting publication";
            stateColor = '#fe1f84ff';
            stateIcon = 'svg/wait_publish.svg';
            break;
    }

    if (stateText != null) {
        let stateObj = document.createElement('div');
        stateObj.classList.add('state');
        stateObj.classList.add('box-shadow');
        stateObj.classList.add('content-horisontal');
        stateObj.style.gap = 'var(--content-padding)'
        parent.appendChild(stateObj);

        let stateIconObj = document.createElement('div');
        stateIconObj.style.width = '40px';
        stateObj.appendChild(stateIconObj);

        let stateTextObj = document.createElement('div');
        stateTextObj.innerText = stateText;
        stateTextObj.style.color = stateColor;
        stateObj.appendChild(stateTextObj);

        placeSvg(stateIcon, stateIconObj, stateColor);
    }
}

function addText(parent, text) {
    let stateObj = document.createElement('div');
    stateObj.classList.add('content-description');
    stateObj.classList.add('text-shadow');
    stateObj.classList.add('box-shadow');
    stateObj.classList.add('content-horisontal');
    stateObj.style.gap = 'var(--content-padding)'
    parent.appendChild(stateObj);

    let stateIconObj = document.createElement('div');
    stateIconObj.style.width = '40px';
    stateObj.appendChild(stateIconObj);

    let stateTextObj = document.createElement('div');
    stateTextObj.innerHTML = text;
    stateObj.appendChild(stateTextObj);
}

window.addCard = function (title, description, logo, previews, buttons, langs, anchor, state, category, minititle) {
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
        cardTitle.innerText = title;
        cardBody.appendChild(cardTitle);
    }

    if (minititle) {
        let cardMiniTitle = document.createElement('div');
        cardMiniTitle.classList.add('content-mini-title');
        cardMiniTitle.classList.add('text-shadow');
        cardMiniTitle.innerText = minititle;
        cardBody.appendChild(cardMiniTitle);
    }

    if (previews && previews.length > 0) {
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
            previewScrollSub.classList.add('box-shadow');
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
            previewScrollAdd.classList.add('box-shadow');
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
            cardButton.innerText = buttoninfo[0];
            cardButtons.appendChild(cardButton);

            cardButton.addEventListener('click', () => {
                let actiontype;
                if (buttoninfo.length >= 3) actiontype = buttoninfo[2];

                if (actiontype === 'dlgithub') {
                    downloadRelease(buttoninfo[1]);
                } else if (actiontype === 'dlgithub_source_zip') {
                    downloadRelease(buttoninfo[1], 'zip');
                } else if (actiontype === 'dlgithub_source_tar') {
                    downloadRelease(buttoninfo[1], 'tar');
                } else {
                    window.open(buttoninfo[1], '_blank');
                }
            });
        }
    }

    let cardStart = document.createElement('div');
    cardStart.classList.add('content-horisontal-start');
    cardCombiner.appendChild(cardStart);
    addState(cardStart, state);

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

function addNote(title, message, category="Roadmap") {
    addCard(title, message,
    null, null, 
    null, null, null, null, category);
}

function addRoadmap(title, messages) {
    let cardBody = document.createElement('div');
    cardBody.classList.add('content-part');
    cardBody.classList.add('box-shadow');

    let categoryRoot = getCategoryRoot("Roadmap");
    categoryRoot.appendChild(cardBody);

    if (title) {
        let cardTitle = document.createElement('div');
        cardTitle.classList.add('content-title');
        cardTitle.classList.add('text-shadow');
        cardTitle.innerText = title
        cardBody.appendChild(cardTitle);
    }

    let roadmap = document.createElement('div');
    roadmap.classList.add('roadmap-grid');
    cardBody.appendChild(roadmap);

    for (let i = 0; i < messages.length; i += 2) {
        let state = messages[i];
        let text = messages[i + 1];
        addState(roadmap, state);
        addText(roadmap, text);
    }

    return cardBody;
}

let logicCard = addCard('Logic', 
`Hello! I am logic and BananaPen.
I love playing ScrapMechanic and programming.
This page is something like a collection of my projects that are ready for publication.
You will also find my contacts here so that you can contact me.`,
null, null, 
null, ['c', 'cs', 'js', 'lua', 'python', 'cpp']);
cards.insertBefore(logicCard, cards.firstChild)

// --------------------------------------------------------------- Notes

addNote(null,
`This is my roadmap! That's what I'm going to do, or have already started doing. It's just a collection of ideas that I need to find the time to implement.
Some of them have already been implemented, some are in the process, some are just in the idea format.
sooner or later, everything is likely to be implemented, but it takes time.
If someone likes any of the ideas from this list, you could speed up the development by making a cash donation to boosty, or by contacting me and discussing another way.
I also don't mind taking software development orders.`);

addNote('LGC Boombox', 
`it will be necessary to finally finish this project. add Bluetooth, wifi, browser, sorting and search in explorer and battery level detector`);

addNote('Logic Hub', 
`adapt the page to touchscreens, improve auto-translation, and add a settings menu.`);

addNote('Everyfun Sandbox', 
`Add dynamic creations, inventory, a default map, multiplayer, a menu for creating and managing worlds and present the first version of this game to the world`);

addRoadmap('Winbox Maker', 
[
    states.COMPLETED, `add options for configuring WinRE (at the moment it is simply disabled but not removed from the image) (the ability to allow/prohibit entry into the recovery menu, activate/deactivate auto-entry in case of failure and replace the functionality of the recovery menu with custom or functionality provided by winbox maker, or even completely remove it from the image if it is not needed)`,
    states.WIP, `the ability to export a device firmware update file *.wnu, which can be installed via custom recovery (WinRE) if it was activated in the original image and its functionality was changed to that provided by winbox maker`,
    states.WIP, `the ability to integrate custom bcd settings into the image`,
    states.WIP, `an alternative way to export *.img is by creating a bootable image immediately (without installing via qemu), however, in this case, the output will be an uninitialized img, and the device with it cannot be immediately given to the user without turning on at least once`,
    states.COMPLETED, `export *.esd`,
    states.WIP, `the ability to preset settings such as the system language (and add them) and keyboard layouts (including several) and the ability to set keyboard shortcuts to change them.`,
    states.WIP, `The ability to integrate appx/msix into an image (including unsigned ones) and use a packaged/UWP application as the main kiosk application.`,
    states.COMPLETED, `more settings for windows customization, including those that are not calculated for kiosks but are suitable for creating custom builds for PCs (for example, customization of personalization, desktop and explorer)`,
    states.WIP, `the ability to set settings through a virtual machine with a running system (but without violating the concept of replicability and full version control through git) that is, the virtual machine will start only when it is necessary to make changes to the settings, then winbox maker will check what exactly has been changed in the system and save in the project resources only the changes that will later be integrated into the image with each build and will be deployed again in the virtual machine if necessary to manually change the settings. I want to implement this in the form of "layers" of modification, in each of which it will be possible to make different changes to the system (install programs and drivers in the usual way and change settings) and then it will be possible to arrange the modification layers in any order by placing somewhere between them the "winbox maker default" layer where the modifications of the winbox maker itself are located. the modification layers will be saved in the "winbox_resources/_layers" directory`,
    states.WIP, `replacing the system boot logo for BIOS-based devices via reassembly bootres.dll`,
    states.WIP, `ability to customize network behavior`,
    states.WIP, `the ability to set up auto-connection to wifi`,
    states.WIP, `the ability to integrate remote access tools into a ready-made image`,
    states.COMPLETED, `the ability to change the list of enabled/disabled services`,
    states.COMPLETED, `add more build events (for example, to mount WinPE and WinRE so that they can be changed from them)`,
    states.COMPLETED, `a menu with deletion settings where you can remove unnecessary files from the image or disable dism components`,
    states.WIP, `the ability to create several "export templates" that can be based on different base images (including images for different processor architectures) and can be configured to overwrite individual project settings (for example, you can set a different output image format and different system activation keys) and then you can export the project using all the templates by pressing one button and say at once get a project build for ARM and x86, or immediately get a project build in both the installation iso file format and the already installed system in img format`,
    states.COMPLETED, `add more options to modify the system installer`,
    states.WIP, `add the option to enlarge the system volume to the maximum size when the device is turned on for the first time. This can be used if the system is deployed on a device from an exported img with a fixed size and the size of the drive in the device has a larger volume than the exported img file.`,
    states.WIP, `the ability to install a postinstall script that will be executed only the first time it is turned on on the actual device when deployed via img, and not twice (the first time after installation on qemu and the second time when running on a real machine) how is this happening now by default with the current postinstall script "winbox user"`,
    states.WIP, `the ability to set the swap partition configuration`,
    states.WIP, `the ability to configure app locker and UWF (unified write filter)`,
    states.WIP, `the ability to use wim/esd as a base system image (in this case, the iso cannot be exported)`,
    states.WIP, `exporting the system in FFU (full flash image) format`,
    states.WIP, `the ability to install the gpu driver in the image in "deep" mode. in this case, they will be embedded in the image with the native installer and deployed through it the first time you turn it on (but with updates disabled and the proprietary panel) this will allow you to install not only the driver itself, but also the video card libraries (for example, PhysX on nvidia)`,
    states.WIP, `export to raspberry pi using the WoR project`,
    states.WIP, `the ability to configure the replacement of the EFI logo at system startup (via efivars and CLI utilities from motherboard manufacturers), however, this is not possible on every motherboard.`,
    states.COMPLETED, `the ability to specify in what ways the system activation key specified in the project settings will be applied (by adding a key file to the installer, via DISM for the mounted system, via slmgr in SetupComplete) at the moment, all these three methods are used simultaneously, and since the slmgr call occurs in the SetupComplete script, the key is actually saved in the script in clear text which is not good. I want to give users the opportunity to decide exactly how the activation key will be applied`,
    states.WIP, `add the option "run install.wim before packaging" when it is activated after the install.wim build, but before it is packaged, the system will be started on qemu and shut down before the "first boot action" stage. in this case, install.wim will include a system that has already been initially configured, which will speed up the installation of the system from the image in the future (this option will not make sense when exporting to img via qemu, since the system will already be with the initial configuration inside *.img)`,
    states.WIP, `the architecture filter on the "build", "download", "layers" tab will be optional, but it will allow you to perform some actions only during assembly for the specified architecture, which improves the ability to assemble a single project into several architectures.`,
    states.COMPLETED, `setting the time zone, auto-synchronization of time, switching to winter time (in particular, checkbox to DISABLE this bullshit) and also is the BIOS time UTC/local`
]);

addNote('Livesys maker', 
`The program is an alternative to winbox maker,
for those who prefer the "classic" approach in the settings of OEM operating systems - through installation on a virtual machine to make changes.
Although I plan to write this program for windows, it will also be able to manage the creation of OEM linux and windows distributions.
the main task of this program is to control the versions of disk images and minimize the occupied space.
for example, for windows, you need a 20 GB file for a disk, but you also need to contrast the versions of the project...
in general, it will be necessary to calculate the difference between two virtual disks somehow. that's basically all.
The main configuration will be performed on a virtual machine, or using the built-in tools of livesys maker.
you simply create a project, select a basic system image, and livesys maker will launch a virtual machine where you will configure the OS.
manually... yes, this approach is more convenient for someone than the declarative one in winbox maker...
as a normal embedded developer, it hurts me to look at this, but yes there are such people and I want to give them at least a tool for version control of the system image instead of "copy a 20 gig file the disk image"
This program is more suitable for creating OEM images of systems for laptops/computers or other devices than for embedded or kiosks.
since the main task is to provide a convenient toolkit for project version control, launching a virtual machine and configuring it (without unnecessary fuss with the configuration of virtual machines)`);

addNote('Gnubox maker', 
`this program will be a kind of add-on for syslbuild (my build script for creating linux system images) and will essentially be a kind of winbox maker in the linux world.
it will allow you to select the base distribution, configure packages, configuration, network, and language.
add your files and settings and automatically pack it all into an image (installer, live or img for firmware on disk) just like winbox maker,
gnubox maker will create a project with all the settings and its versions can be contrasted via git,
the entire configuration will also be in json format and the GUI will allow you to change system settings.
although the settings are made through the GUI, the approach is still declarative, since the configuration with all project files can be controlled through git.
The scope of the project is to create embedded/ kiosk/ OEM assemblies from ready-made Linux distributions and subsequent update management.
The gnubox maker tools will be designed in such a way as to ensure the cross-assembly of one system on different platforms. This way you can make your embedded /kiosk /oem assembly once and then export it to a PC, tablet, smartphone and orange PI (the device is selected as an example) if the device is not in the list of supported devices, you can add it yourself. you won't have to change the configuration much to export a single image for both a PC and a supported smartphone model (pine phone, pine phone pro, librem 5 will definitely be supported out of the box, although I'll have to get reference devices for development somewhere)`);

addNote('USB_gadget_UI.deb', 
`this package will allow laptops, tablets, and smartphones running the debian operating system
(or other debian-compatible devices that support the installation of deb packages)
which can be charged via a type C, micro usb or another type of USB will be determined by the computer as a peripheral device in USB gadget mode
the idea was borrowed from android, for some reason unknown to me, such convenient functionality is not supported in Windows and all those operating systems that I checked
however, if your laptop supports type C charging, then it can probably work as a USB client in hardware
this package will allow you to connect your laptop to a computer via a type C cable, after which a pop up UI will appear on the screen with a choice of operating modes (charging only, file transfer (only the user's directory will be available) and possibly other modes such as transferring images from a webcam, which will allow you to use the laptop as a PC camera)
when you select file transfer mode, the laptop will immediately be detected by the computer as a file storage and you can view and edit files in the user's directory and on flash drives and microSD connected to the laptop (as is done in android)
I sincerely don't understand why someone didn't do it except Google in android, why it's not in Windows, ubuntu and mint, but it will be extremely useful.`);

addNote('skyOS', 
`a new linux distribution that I develop in my spare time

WARNING: next, you will receive very harsh statements about the most popular linux distributions, if you may be traumatized by this, please do not read further 😉
WARNING 2: Chipy, don't read this. I don't want to hurt your psyche 😁. i excluded arch from the list of distributions that I have complaints about in WARNING 3)
WARNING 3: this statement applies ONLY to distributions for the end user, which in my opinion should be completely different. for distributions that are used on servers, as a package base for creating embedded or other systems or distributions for advanced users like arch linux or gentoo, these principles DO NOT APPLY

problems with all linux distributions except ChromeOS and android:
I SINCERELY DO NOT UNDERSTAND why there is still not a single non-commercial opensource distribution that will do FINE
WHY the FUCK does a good half of distributions have this fucking systemd that crashes every now and then, why the hell do CONSOLE POP-UP MESSAGES sometimes APPEAR ON TOP OF the BOOT LOGO when booting the system?
why did I HAVE to OPEN a TERMINAL to set up hibernation mode in linux mint! I HATE THE FUCKING TERMINAL AND I DON'T WANT TO SEE IT ON MY PC!!!
why do most distributions have a package manager that CHANGES THE ENVIRONMENT FOR THE ENTIRE SYSTEM, AND DOES IT USING ROOT ACCESS?! WHAT KIND OF IDIOT CAME UP WITH THE IDEA TO INSTALL APPLICATIONS USING ROOT ACCESS??
All this inevitably turns into a hell of dependencies that CANNOT be RAKED OUT.
why the fuck do file access rights continue to work when I connect an external flash drive with an ext4 file system? WHAT THE FUCK?? why can't you mount it by disabling file access rights and adding noexec (so that you can't get root rights on someone else's PC using a fucking USB flash drive with the SUID executable)
WHY IS THERE A SYSTEM OF "USERS" AT ALL?? WHAT THE FUCK?? why do I need a file access rights system? WHY IS IT STUCK IN THE SYSTEM IN FRONT OF THE USER?!! WHAT THE FUCK????
imagine a housewife who wants to come home, sit at her computer, drink tea and watch youtube, and the system keeps asking her to enter her root password, log in to the terminal to update something, trying to impose the use of a batch manager that changes system directories, and for some reason displaying some obscure file access rights for each file in the GUI. this is terrible!!
LITERALLY, NOT A SINGLE linux distribution except android and ChromeOS still cannot become a normal operating system for the masses. WELL, WHY DON'T STUPID ENGINEERS UNDERSTAND THAT ALL THIS CRAP IS NOT NEEDED BY ORDINARY USERS AND SHOULD BE FUCKING CUT OUT OF THE SYSTEM FOR THE SAKE OF SIMPLIFICATION FOR ORDINARY USERS! how Google did it in its android and chromeOS
why the fuck don't almost some distributions silently clean the cache of their fucking package manager and update the package list automatically, as a result, if the user tries to use only the GUI of the package manager, then most likely EVERYTHING WILL JUST BREAK AND the OS WILL BE FILLED WITH GARBAGE! IT'S FUCKED UP! It's just a failure.
how can there be anything INCONGRUOUS in one system, two package managers like flatpak and apt. but only applications from one run in an isolated environment and do not require root to install, while others run with user rights and require root to install. HOW ARE YOU GOING TO EXPLAIN THIS SHIT TO THE USER?? imagine that a smartphone will appear, complete with 10 pages of instructions on how to set up x11 and use the package manager, how packages in the flatpak format differ from deb, and so on, BUT SUCH A PHONE WOULD SWEAT IN THE TRASH AND A PERSON WOULD GO AND BUY AN IPHONE, BECAUSE THERE IS NO SUCH SHIT.
IF SOMEONE DOESN'T START CHANGING SOMETHING, THEN THERE SIMPLY WON'T BE A FUTURE FOR OPEN SOURCE LINUX DISTRIBUTIONS!!
Most people DON'T WANT TO, WON'T, AREN'T GOING TO, AND THEY DON'T HAVE TIME TO STUDY HOW THE SYSTEM WORKS INTERNALLY. Not because they're stupid, BUT BECAUSE THEY DON'T NEED IT, THEY're NOT INTERESTED, and it's a waste of time for them.
NOT ALL PEOPLE ARE ENGINEERS. there are janitors and locksmiths, truck drivers and security guards, salesmen and groomsmen. AND THEY WILL NOT USE AN OPERATING SYSTEM IN WHICH THE TERMINAL WILL HAVE TO BE OPENED AT LEAST ONCE IN THEIR LIFE.
that doesn't mean they're stupid, THEY JUST DON'T FUCKING NEED IT.
the fact that desktop linux currently looks more like a terminal for hackers than a normal OS like android or macOS is SIMPLY COMPLETELY KILLING THE FUTURE OF OPEN SOURCE SYSTEMS ON THE DESKTOP WITHOUT GIVING UP A SINGLE CHANCE!
I URGE linux distribution developers who are user-friendly at least a little bit, at least OUT OF THE CORNER OF THEIR EYE, TO LISTEN TO THESE ARGUMENTS.
if we really want to make a user-friendly and user-friendly linux distribution AND NOT COMPLETELY RUIN the FUTURE OF LINUX ON the DESKTOP, then we will have to cut out of the system: terminal, root access, user system (including the ability to create users through useradd), batch manager, sysrq and virtual ttys. We will also need to add a permission system for applications and a sandbox like in android.
The terminal and root access can be opened in a menu like "for developers" or "for advanced users" to leave it as a backup option. BUT THIS SHOULD NOT BE THE MAIN METHOD OF MANAGING THE SYSTEM! This should not be seen by the average user at all.
also, the root file system itself should be read-only and updated atomically (that is, the entire system is updated in one block at once, you can download only changes to optimize download time, BUT one version of the system for different users should ALWAYS have completely the same configuration)
the user's file directory, internal PC disks and external USB flash drives and disks must be mounted WITH file access rights COMPLETELY DISABLED so that access rights do not affect the accessibility of the file to the user at all (it's FUCKING STRANGE when a person connects a flash drive and suddenly it turns out that he does not have access to some file on it) they should also be mounted with noexec to eliminate vulnerabilities with SUID

the main feature of the distribution is user friendly and the complete abandonment of terminal and root access as a means of system management
this operating system was inspired by android and ChromeOS, which I consider to be almost perfect representatives of linux systems
i decided to start development on the basis of the debian distribution as a package base, but apt and dpkg were cut out and replaced with self-written solutions.
the entire UI of the system will be made on electron, and the system framework for writing applications in java script.
All applications will run in a sandbox and have a strictly limited set of privileges that the user can manage through settings.
the root filesystem is read-only and is updated atomically
The PID is used as the identifier of the application installed in the system to differentiate access to application files in order to isolate them from each other.
The GID is used to grant permissions in the system to grant access to something through a toggle in the settings.
sysrq and virtual tty are completely inaccessible.
there is no multiuser system at all. the password can be set on the device lock screen (as in android), but not on a specific user (because there are no users)
there is no getty, instead it has its own lock screen and its own shell.
there is a complete lack of terminal and root access as system management tools. you can find them in the "for developers" settings, but this is not the main system management tool, but rather a debugging tool.
there is no way to change access rights to files at all. it will not be in the GUI, and all file systems accessible to the user will be mounted without this functionality
(there is no need to change file access rights when there are no users as a phenomenon to the PID and the GID is used by the system to allocate application rights and create sandboxes)

the distribution is planned to be available for PCs, laptops, tablets, smartphones and single-board computers.
It is also planned to develop a configurator tool that will automate the process of creating custom SkyOS images for embedded/kiosk solutions.
the quality of the system will be improved .img images for BIOS and for UEFI (optional) which can be installed on a computer disk and it will work immediately. initramfs will have a script that will automatically expand the user's file system to the maximum possible size
`);

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
], ['js', 'cs'], null, states.BETA, 'Devices');

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
    'https://raw.githubusercontent.com/igorkll/WinBox-Maker/refs/heads/master/previewlogo.png',
    'https://raw.githubusercontent.com/igorkll/WinBox-Maker/refs/heads/master/preview.png',
    'https://raw.githubusercontent.com/igorkll/WinBox-Maker/refs/heads/master/preview2.png',
    'https://raw.githubusercontent.com/igorkll/WinBox-Maker/refs/heads/master/preview3.png',
    'https://raw.githubusercontent.com/igorkll/WinBox-Maker/refs/heads/master/preview4.png',
    'https://raw.githubusercontent.com/igorkll/WinBox-Maker/refs/heads/master/preview5.png',
    'https://raw.githubusercontent.com/igorkll/WinBox-Maker/refs/heads/master/preview6.png',
    'https://raw.githubusercontent.com/igorkll/WinBox-Maker/refs/heads/master/preview7.png',
    'https://raw.githubusercontent.com/igorkll/WinBox-Maker/refs/heads/master/preview8.png',
], 
[
    ['Project page', 'https://github.com/igorkll/WinBox-Maker'],
    ['Download', 'WinBox-Maker', 'dlgithub']
], ['cs'], 'winbox', states.SUPPORTED, 'Software');

addCard('syslbuild (BETA)', 
`syslbuild is a build system for linux distributions (analogous to buildroot, yocta project and OpenEmbedded) that is primarily designed for embedded and kiosk distributions. The program is a python script that builds a distribution package from a description in json. The assembler can assemble the system from ready-made popular distributions such as debian, but by implementing their own settings and patches, as well as independently assemble software and libraries from the source code or copy ready-made files from the project folder. at the output, you can get an already installed system in img format with a bootloader and a partition table (OEM image) so is the boot (life) or installation iso image.
any behavior of the system can be customized by changing the json configuration, and the build will always remain replicated, and to make changes it will only be necessary to change the json and rebuild the system.
syslbuild can be used both to generate img for BIOS/UEFI and to generate img for running on OrangePi and Raspberry Pi of different models.
a bunch of examples will be added to syslbuild with the assembly of different systems for different platforms with different tasks.
starting from a simple debian-based operating system for navigator, where there will be only one application running from root, the boot logo will be replaced, sysrq and virtual tty will be disabled
ending with full-fledged desktop distributions pre-configured to work in certain tasks (for example, in an office with early configured remote access and with root rights blocked)
syslbuild will support cross-build for other architectures, as well as one project can be compiled for multiple architectures at once (you can make your project only once, and then export it for x86_64 and OrangePi zero 3 if you need it).
syslbuild provides many functions for creating locked down operating systems designed to work in kiosk mode or on embedded devices (ATM, car radios, medical equipment, information stands)
among them: disabling sysrq and virtual tty (it is better not to use systemd on embedded systems at all) and installing your application as a system shell. as a result, you will receive an img with the system already installed for your desired platform, with your custom download logo and one application from which you cannot exit. however, this is not the only scope of application.
syslbuild projects can also use git to control project versions, and changes are made not in the mounted system, but in a json text file and other files in the project folder, which makes it easy to track changes and demolish new ones, as well as work in the command.
syslbuild will make it easy to create your own operating systems based on open source linux software and configure them to work for your needs.
syslbuild also allows you to add links to the files you need to the project file and they will be downloaded during the build, which prevents the need to store all the source code in the syslbuild project repository. if you are using another distribution as the basis of your OS, then you can specify a specific snapshot (which will be the best solution)
syslbuild can also be used to build LFS/BLFS.`,
'logos/syslbuild.png', [
    'https://raw.githubusercontent.com/igorkll/syslbuild/refs/heads/main/preview.png'
], 
[
    ['Project page', 'https://github.com/igorkll/syslbuild'],
    ['Download', 'syslbuild', 'dlgithub_source_zip']
], ['python'], 'syslbuild', states.BETA, 'Software');

addCard('EveryfunSandbox', 
`the game I'm writing right now. something like a minecraft clone and scrap mechanic at the same time. but the main thing is that the game will have a lot of electronics and work with real files. for example, there will be a gramophone and a recording device that will allow you to replicate records from real mp3 on a computer inside the game, the game will copy the file to the save folder and link it to the item. A video recorder will work on the same principle. The game will also have computers in lua as an interpreter. the game will be in the genre of survival`,
'logos/everyfunsandbox.png', [
    'https://raw.githubusercontent.com/igorkll/EveryfunSandbox/refs/heads/main/EveryfunSandbox/gui/splash.png'
], 
[
    ['Project page', 'https://github.com/igorkll/EveryfunSandbox']//,
    //['Download', 'EveryfunSandbox', 'dlgithub_source_zip']
], ['godot'], null, states.WIP, 'Software');

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

addCard('SComputers invisible [SComputers addon]', 
`adds invisible versions of all blocks from SComputers and power toys`,
null, ['images/scomputers_invisible.jpg'], 
[
    ['Project page', 'https://steamcommunity.com/sharedfiles/filedetails/?id=3654930099']
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

addCard('efivars-cli-powershell', 
`A powershell cli interface for reading and writing to efi variables for windows.
allows you to view the entire efi variables list for all GUIDs, write and read variables.`,
null, [
], 
[
    ['Project page', 'https://github.com/igorkll/efivars-cli-powershell'],
    ['Download', 'efivars-cli-powershell', 'dlgithub_source_zip']
], ['ps1'], null, states.COMPLETED, 'Other');

addCard('linux-embedded-patchs', 
`a set of patches for embedded linux systems
the patches were tested on kernel version 6.8.12
these patches should also work on newer kernel versions, because the \`patch\` utility applies changes using contextual lines and can automatically adjust offsets if the surrounding code has shifted
in order for these patches to work, make sure that \`CONFIG_WERROR\` is NOT enabled in the kernel config
<h2>pathes</h2><ul><li>disable_vt_swithing_from_keyboard.patch - disables VT switching at the kernel level, but VT switching can still work from x11. it completely kills VT switching from the keyboard, but does not prevent VT switching from userspace (for example, via chvt). please note that if you disabled VT switching using the patch, it will only work in tty! switching processing can still occur at the graphics session level, it's easy to disable in x11, but it depends on the composer in wayland</li>
  <li>disable_sysrq.patch - it completely prohibits the operation of sysrq, regardless of the kernel parameters</li>
  <li>disable_cad.patch - blocks restarting by pressing ctrl+alt+del</li>
  <li>disable_printk.patch - will make the kernel shut up</li></ul>`,
null, [
], 
[
    ['Project page', 'https://github.com/igorkll/linux-embedded-patchs'],
    ['Download', 'linux-embedded-patchs', 'dlgithub_source_zip']
], null, null, states.COMPLETED, 'Other');

addCard('custom-debian-initramfs-init', 
`custom /init script for initramfs in debian, adding several useful parameters to the cmdline of the kernel  
the parameters added here make the most sense for embedded devices  
it also allows you to mount rootfs from *.img (loop), including from real rootfs  
Attention! I have NO guarantee that this will go down to your system and won't break it. I warned you, I'm not responsible for anything  
<h2>kernel parameters</h2><ul><li>clear - clears the terminal during initialization. does this as early as possible. the original script has initramfs.clear, but apparently it doesn't work
<li>noCursorBlink - prevents cursor blinking when loading
<li>earlysplash - an alternative way to initialize plymouth is to try to initialize plymouth as early as possible. for plymouth to really work, you need the splash parameter right after quiet. in this case, you will get something like "quiet splash earlysplash"
<li>noctrlaltdel - disables support for ctrl+alt+del in the kernel as early as possible
<li>nosysrq - disables support for sysrq in the kernel as early as possible. As practice shows, sysrq=0 does not always work
<li>loop=/path - allows you to mount loop files (rootfs in .img file) as root (it seems like this already exists in ubuntu but not in debian) here is the path relative to the initramfs root, however, the real root is accessible via the path /realroot so you can mount the loop, which is located in the real root partition. also, if there is an empty realroot directory inside your loop rootfs, then the real root will be mounted there.
<li>loopflags= - flags that the loop will be mounted with (not necessary for the loop= to work)
<li>loopfstype= - the type of file system inside the loop file. can be determined automatically, not necessary for the loop= to work
<li>loopreadonly - it says that the loop needs to be mounted as readonly even if the real root is not readonly
<li>makevartmp - makes a tmpfs "/var" directory by copying the real contents into it. may be necessary for readonly filesystems
<li>makehometmp - makes a tmpfs "/home" directory by copying the real contents into it. may be necessary for readonly filesystems
<li>makeroothometmp - makes a tmpfs "/root" directory by copying the real contents into it. may be necessary for readonly filesystems
<li>logodelay=10 - It was created to create a delay in system loading and the logo was displayed longer.
<li>minlogotime=10 - a more preferable option. sets exactly the minimum display time for the logo and does not make a stupid delay. it starts before of the init system, but after mounting, when the environment is almost ready.
<li>logoautohide - automatically hides the logo just before the initialization system starts. it should be used if your userspace itself does not hide the logo
<li>root_processing - enables additional processing of the root partition. It doesn't do anything by itself, but it's needed for other parameters.
<li>root_expand - expands the root partition to the maximum possible size on this disk. This is necessary if you are publishing a system image that can be written to any disk with an unknown size, and you need rootfs to take up all available space. you also need to add root_processing</li></ul>`,
null, [],
[
    ['Project page', 'https://github.com/igorkll/custom-debian-initramfs-init'],
    ['Download', 'custom-debian-initramfs-init', 'dlgithub_source_zip']
], ['bash'], null, states.SUPPORTED, 'Other');

// --------------------------------------------------------------- Web

addCard('Logic Gallery', 
`just a collection of art,
I had nothing to do and I wrote it during the assembly of my linux distribution
(building the system is a long process and I decided not to waste time)`,
null, ['images/logicgallery.png'],
[
    ['Open', 'https://igorkll.github.io/logicgallery'],
], ['js'], null, states.SUPPORTED, 'Web');

// --------------------------------------------------------------- Ideas

addNote('Syberia Continuation Game Generator with AI', 
`I want to somehow write something like a script that, using neural networks, will allow me to endlessly generate a sequel to one of my favorite games, Syberia, starting with either the first or the second part (what came out recently is complete shit.. although I went through all the parts)
I understand that at the moment this idea is rather closer to fantasy than something more feasible, but I think that GPT 5 can already generate a plot, and if I had access to the neural networks I need, I would be able to do something more +- working

here are the current versions of the tools in the order they are used to try to create manual continuations:
chatGPT: create an alternative sequel plot for the game Syberia (check out the plot on the Internet), starting with part 1 and continuing it, that is, your plot should start where the plot of the original game ended (на Русском)

In these promts, you can change some settings such as the language of the game and the part with which the generation continues.
if I have access to all the keys and free time, then I will do it`, 'Ideas');

// --------------------------------------------------------------- Portfolio

addCard('Ordy', 
`Ordy is a smart digital assistant designed to bring order into your daily life.

It helps you remember important things, manage tasks, set reminders, and keep track of your schedule — all in one simple and intuitive place. Ordy understands natural language, so you can talk to it like a real assistant, not a complicated app.

Whether it’s a meeting tomorrow, a quick reminder, or organizing your day, Ordy keeps everything clear, structured, and stress-free.

No chaos.
No overthinking.
Just order — with Ordy.`,
null, ['images/ordy.jpg'], 
[
    ['Project page', 'https://my-ordy.com/']
], ['python', 'js'], null, states.SUPPORTED, 'Portfolio');
    

}