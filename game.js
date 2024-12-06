/* This variable is the main controller for the game. It contains various attributes that are 
relevant to the game. All of them are initialized in the generateNewGame() function */ 
var controller;

/* Basic three js variable that defines the scene/setting (initialized using THREE.Scene)  */
var scene;

/* Basic three js variable that defines the perpectivCamera (initalized using THREE.PerspectiveCamera) */
var perspCam;

/* Basic three js variable that defines the webGlRenderer (initalized using THREE.WebGLRenderer) */
var webGlRenderer;

/* Basic three js variable that will contain the renderer's domElement
It is the link between our HTML element (mainScene) and three js */
var container;

/* Variables used while generating the lights for the game setting  */
var ambLight, hemiLight, lightOfShadow;

/* Time value of current frame */
var currFrameTime = new Date().getTime();

/* Time value of previous frame */
var prevFrameTime = new Date().getTime();

/* This variable is a time element (time elapsed between consecutive animation frames). 
It is computed at the start of each frame using the Date().getTime() function */
var dT = 0;

/* This array contains all the active meteors in the game setting */
var meteorsPool = [];

/* This array contains all the active fragments(generated when a meteor 
  explodes when either the aircraft or a bullet hits it) in the game setting */
var fragmentsPool = [];

/* This array contains all the active bullets in the game setting
Bullets that either hit a meteor or move out of the window are 
deleted from this array immediately   */
var bulletsInUse = [];

/* This is a switch variable (bool - 0 or 1) */
var canFireBullet = 1;

/* Variable that defines the angle (in degrees) span that the camera is able to capture
in our current scene. Needed during camera initialization */
var viewSpan = 55;

/* Following variables represent the screen height and width  */
var HEIGHT = window.innerHeight;
var WIDTH = window.innerWidth;

/* Defines the aspect ratio of our screen. Needed during camera initialization  */
var aspRatio = WIDTH/HEIGHT;

/* This denotes the mouse pointer position. The aircraft is moved based on
changes in currMousePtrLoc.x and currMousePtrLoc.y  */
var currMousePtrLoc = { x: 0, y: 0 };

/* List of colors that we will be using throughout.. 
this variable is only for easier coding which otherwise holds no significance */
var usefulColours = { mediumAqua: 0x66CDAA, lightOceanGreen: 0x20B2AA, limeGreen: 0x1CE678, greenYellow: 0xADFF2F, lightBlue: 0x1E90FF, darkBlue: 0x00008B, red:0xf25346, white:0xd8d0d1, brown:0x59332e, blue:0x68c3c0, silver:0x808080,  black: 0x000000, violet: 0x8A2BE2};

/* Switch (bool - 0 or 1) variable used to determine when to display
the 'click to start' message  */
var gameStarted = 0;

/Variables for various objects in the game environment. Their names are self explanatory/
var ocean, aircraft, sky;

/*The following are variables that are associated with elements from the index.html file like 
  current points, no. of bullets etc. These are used as handles so that the internal changes in 
  the game parameters get reflected onto the UI */
var currPoints, healthMeterFill, replayMessage, stageField, stageContainer, bulletVal, startMessage;

/* *
 * ****************************************************************
 * ***********LIST OF FUNCTIONS FOR INITIALIZING***************** 
 * ****************THE THREEJS ENVIRONMENT***********************
  */

/* This function initializes the threejs scene, camera and renderer
so that we can render the scene with the camera  */
function generateScene() {
  scene = new THREE.Scene();
  perspCam = new THREE.PerspectiveCamera(viewSpan, aspRatio, 0.05, 12000);
  scene.fog = new THREE.Fog(0xAAF7D9, 99,1000);
  perspCam.position.x = 0;
  perspCam.position.z = 200;
  perspCam.position.y = controller.aircraftDefaultHeight;
  webGlRenderer = new THREE.WebGLRenderer({ stencil: true, alpha: true, logarithmicDepthBuffer: false, antialias: true });
  webGlRenderer.setSize(WIDTH, HEIGHT);
  webGlRenderer.shadowMap.enabled = true;
  container = document.getElementById('mainScene');
  container.appendChild(webGlRenderer.domElement);
}

/* This function lights the scene using three js library functions and populates
the light object's required attributes */ 
function generateLighting() {
  ambLight = new THREE.AmbientLight(0xdc8874, .5);
  hemiLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9);
  lightOfShadow = new THREE.DirectionalLight(0xffffff, .9);
  lightOfShadow.position.set(150, 350, 350);
  lightOfShadow.castShadow = true;
  lightOfShadow.shadow.camera.right = 400;
  lightOfShadow.shadow.camera.top = 400;
  lightOfShadow.shadow.camera.left = -400;
  lightOfShadow.shadow.camera.bottom = -400;
  lightOfShadow.shadow.camera.near = 1;
  lightOfShadow.shadow.camera.far = 1000;
  lightOfShadow.shadow.mapSize.width = 4096;
  lightOfShadow.shadow.mapSize.height = 4096;

  scene.add(hemiLight);
  scene.add(lightOfShadow);
  scene.add(ambLight);

}

/* This function is triggered/executed whenever the game is restarted.
It initializes the attributes of the controller variable and resets
the stage and bullets count on the UI  */
function generateNewGame(){
  controller = {
        stateOfGame : "notStarted",
        
        baseSpeed:.00035,
        startSpeed:.00035,
        distToUpdateSpeed:100,
        lastUpdatedSpeed:0,
        speed:0,
        targetBaseSpeed:.00035,
        increaseSpeedWithLevel:.000005,
        increaseSpeedWithTime:.0000025,

        pointsScored:0,
        ratioOfSpeedEnergy:3,
        ratioOfSpeedDistance:50,
        stage:1,
        health:100,

        stageLastUpdate:0,
        distanceForStageUpdate:1000,

        aircraftDefaultHeight:100,
        aircraftAmplitudeHt:80,
        aircraftAmplitudeWdth:75,
        
        aircraftMovementSensi:0.005,
        aircraftRotationXSensi:0.0008,
        aircraftRotationZSensi:0.0004,
        aircraftFallSpeed:.001,
        minAircraftSpeed:1.2,
        maxAircraftSpeed:1.6,
        aircraftSpeed:0,
        
        aircraftCollisionXDisplacement:0,
        aircraftCollisionXSpeed:0,
        aircraftCollisionYSpeed:0,
        aircraftCollisionYSpeed:0,

        bulletCount:2,
        bulletSpeed:100,

        radiusOfSea:600,
        lengthOfSea:800, 
        minSpeedOfWaves : 0.001,
        maxSpeedOfWaves : 0.003,
        minSizeOfWaves : 5,
        maxSizeOfWaves : 20,
       

        farPosOfCamera:500,
        nearPosOfCamera:150,
        cameraSensivity:0.002,

        jewelDistanceToler:15,
        speedOfJewel:.5,
        jewelSpawnDistance:100,
        valueOfJewel:3,
        lastSpawnOfJewel:0,

        healthLossByMeteor:10,
        meteorsSpeed:.6,
        distanceToleranceInMeteor:10,
        lastSpawnOfMeteor:0,
        meteorSpawnDistance:50,
        };
  stageField.innerHTML = Math.floor(controller.stage);
  bulletVal.innerHTML = Math.floor(controller.bulletCount);
}



/* *
 * *********************************************
 * *****FUNCTIONS FOR CREATING THE VARIOUS****
 * *****ELEMENTS IN THE SCENE LIKE BULLETS,***
 * *****AIRCRAFT,SKY,JEWELS,OCEAN, CLOUD,*****
 * *****METEOR,FRAGMENTS----------------******
  */
