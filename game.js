/* This variable is the main controller for the game. It contains various attributes that are 
relevant to the game. All of them are initialized in the generateNewGame() function */
var controller

/* Basic three js variable that defines the scene/setting (initialized using THREE.Scene)  */
var scene

/* Basic three js variable that defines the perpectivCamera (initalized using THREE.PerspectiveCamera) */
var perspCam

/* Basic three js variable that defines the webGlRenderer (initalized using THREE.WebGLRenderer) */
var webGlRenderer

/* Basic three js variable that will contain the renderer's domElement
It is the link between our HTML element (mainScene) and three js */
var container

/* Variables used while generating the lights for the game setting  */
var ambLight, hemiLight, lightOfShadow

/* Time value of current frame */
var currFrameTime = new Date().getTime()

/* Time value of previous frame */
var prevFrameTime = new Date().getTime()

/* This variable is a time element (time elapsed between consecutive animation frames). 
It is computed at the start of each frame using the Date().getTime() function */
var dT = 0

/* This array contains all the active meteors in the game setting */
var meteorsPool = []

/* This array contains all the active fragments(generated when a meteor 
  explodes when either the aircraft or a bullet hits it) in the game setting */
var fragmentsPool = []

/* This array contains all the active bullets in the game setting
Bullets that either hit a meteor or move out of the window are 
deleted from this array immediately   */
var bulletsInUse = []

/* This is a switch variable (bool - 0 or 1) */
var canFireBullet = 1

/* Variable that defines the angle (in degrees) span that the camera is able to capture
in our current scene. Needed during camera initialization */
var viewSpan = 55

/* Following variables represent the screen height and width  */
var HEIGHT = window.innerHeight
var WIDTH = window.innerWidth

/* Defines the aspect ratio of our screen. Needed during camera initialization  */
var aspRatio = WIDTH / HEIGHT

/* This denotes the mouse pointer position. The aircraft is moved based on
changes in currMousePtrLoc.x and currMousePtrLoc.y  */
var currMousePtrLoc = { x: 0, y: 0 }

/* List of colors that we will be using throughout.. 
this variable is only for easier coding which otherwise holds no significance */
var usefulColours = {
  mediumAqua: 0x66cdaa,
  lightOceanGreen: 0x20b2aa,
  limeGreen: 0x1ce678,
  greenYellow: 0xadff2f,
  lightBlue: 0x1e90ff,
  darkBlue: 0x00008b,
  red: 0xf25346,
  white: 0xd8d0d1,
  brown: 0x59332e,
  blue: 0x68c3c0,
  silver: 0x808080,
  black: 0x000000,
  violet: 0x8a2be2,
}

/* Switch (bool - 0 or 1) variable used to determine when to display
the 'click to start' message  */
var gameStarted = 0

;/Variables for various objects in the game environment. Their names are self explanatory/
var ocean, aircraft, sky

/*The following are variables that are associated with elements from the index.html file like 
  current points, no. of bullets etc. These are used as handles so that the internal changes in 
  the game parameters get reflected onto the UI */
var currPoints,
  healthMeterFill,
  replayMessage,
  stageField,
  stageContainer,
  bulletVal,
  startMessage

/* *
 * ****************************************************************
 * ***********LIST OF FUNCTIONS FOR INITIALIZING*****************
 * ****************THE THREEJS ENVIRONMENT***********************
 */

/* This function initializes the threejs scene, camera and renderer
so that we can render the scene with the camera  */
function generateScene() {
  scene = new THREE.Scene()
  perspCam = new THREE.PerspectiveCamera(viewSpan, aspRatio, 0.05, 12000)
  scene.fog = new THREE.Fog(0xaaf7d9, 99, 1000)
  perspCam.position.x = 0
  perspCam.position.z = 200
  perspCam.position.y = controller.aircraftDefaultHeight
  webGlRenderer = new THREE.WebGLRenderer({
    stencil: true,
    alpha: true,
    logarithmicDepthBuffer: false,
    antialias: true,
  })
  webGlRenderer.setSize(WIDTH, HEIGHT)
  webGlRenderer.shadowMap.enabled = true
  container = document.getElementById('mainScene')
  container.appendChild(webGlRenderer.domElement)
}

/* This function lights the scene using three js library functions and populates
the light object's required attributes */
function generateLighting() {
  ambLight = new THREE.AmbientLight(0xdc8874, 0.5)
  hemiLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9)
  lightOfShadow = new THREE.DirectionalLight(0xffffff, 0.9)
  lightOfShadow.position.set(150, 350, 350)
  lightOfShadow.castShadow = true
  lightOfShadow.shadow.camera.right = 400
  lightOfShadow.shadow.camera.top = 400
  lightOfShadow.shadow.camera.left = -400
  lightOfShadow.shadow.camera.bottom = -400
  lightOfShadow.shadow.camera.near = 1
  lightOfShadow.shadow.camera.far = 1000
  lightOfShadow.shadow.mapSize.width = 4096
  lightOfShadow.shadow.mapSize.height = 4096

  scene.add(hemiLight)
  scene.add(lightOfShadow)
  scene.add(ambLight)
}

/* This function is triggered/executed whenever the game is restarted.
It initializes the attributes of the controller variable and resets
the stage and bullets count on the UI  */
function generateNewGame() {
  controller = {
    stateOfGame: 'notStarted',

    baseSpeed: 0.00035,
    startSpeed: 0.00035,
    distToUpdateSpeed: 100,
    lastUpdatedSpeed: 0,
    speed: 0,
    targetBaseSpeed: 0.00035,
    increaseSpeedWithLevel: 0.000005,
    increaseSpeedWithTime: 0.0000025,

    pointsScored: 0,
    ratioOfSpeedEnergy: 3,
    ratioOfSpeedDistance: 50,
    stage: 1,
    health: 100,

    stageLastUpdate: 0,
    distanceForStageUpdate: 1000,

    aircraftDefaultHeight: 100,
    aircraftAmplitudeHt: 80,
    aircraftAmplitudeWdth: 75,

    aircraftMovementSensi: 0.005,
    aircraftRotationXSensi: 0.0008,
    aircraftRotationZSensi: 0.0004,
    aircraftFallSpeed: 0.001,
    minAircraftSpeed: 1.2,
    maxAircraftSpeed: 1.6,
    aircraftSpeed: 0,

    aircraftCollisionXDisplacement: 0,
    aircraftCollisionXSpeed: 0,
    aircraftCollisionYSpeed: 0,
    aircraftCollisionYSpeed: 0,

    bulletCount: 2,
    bulletSpeed: 100,

    radiusOfSea: 600,
    lengthOfSea: 800,
    minSpeedOfWaves: 0.001,
    maxSpeedOfWaves: 0.003,
    minSizeOfWaves: 5,
    maxSizeOfWaves: 20,

    farPosOfCamera: 500,
    nearPosOfCamera: 150,
    cameraSensivity: 0.002,

    jewelDistanceToler: 15,
    speedOfJewel: 0.5,
    jewelSpawnDistance: 100,
    valueOfJewel: 3,
    lastSpawnOfJewel: 0,

    healthLossByMeteor: 10,
    meteorsSpeed: 0.6,
    distanceToleranceInMeteor: 10,
    lastSpawnOfMeteor: 0,
    meteorSpawnDistance: 50,
  }
  stageField.innerHTML = Math.floor(controller.stage)
  bulletVal.innerHTML = Math.floor(controller.bulletCount)
}

/**************** 1: BULLET ************ */
/* ******************Function related to bullet creation.******************* */
/* This function is used to create mesh of bullet object (bullet constructor) */
Bullet = function () {
  this.mesh = new THREE.Mesh(
    new THREE.SphereGeometry(3, 8, 8),
    new THREE.MeshBasicMaterial({ color: usefulColours.black })
  )
}

/* This function creates an individual bullet. */
function generateBullet() {
  if (controller.bulletCount > 0) {
    var fireSound = new Audio('sounds/bulletFire.wav')
    fireSound.play()
    fireSound.volume = 0.6
    controller.bulletCount--
    if (controller.bulletCount == 0)
      bulletVal.style.animationName = 'flickering'
    bulletVal.innerHTML = Math.floor(controller.bulletCount)
    var newBullet = new Bullet()
    newBullet.mesh.position.copy(aircraft.rotor.getWorldPosition())
    bulletsInUse.push(newBullet)
    scene.add(newBullet.mesh)
  }
}

/* This function is used to update the postion of the bullet. It also checks for collision of bullets with enemy Meteors. */
function updateBullet() {
  for (var i = 0; i < bulletsInUse.length; i++) {
    var bullet = bulletsInUse[i]
    bulletsInUse[i].mesh.position.x += 8

    for (var j = 0; j < meteorsHolder.meteorsInUse.length; j++) {
      var meteor = meteorsHolder.meteorsInUse[j]
      var position_diff = bullet.mesh.position
        .clone()
        .sub(meteor.mesh.position.clone())
      var diff = position_diff.length()
      if (diff < controller.distanceToleranceInMeteor) {
        fragmentsHolder.spawnFragments(
          meteor.mesh.position.clone(),
          15,
          usefulColours.violet,
          3
        )
        meteorsPool.unshift(meteorsHolder.meteorsInUse.splice(j, 1)[0])
        meteorsHolder.mesh.remove(meteor.mesh)
        scene.remove(bulletsInUse[i].mesh)
        bulletsInUse.splice(i, 1)
        controller.pointsScored += 100
        var meteor_bulletSound = new Audio('sounds/rockBreaking.wav')
        meteor_bulletSound.play()
        meteor_bulletSound.volume = 1
      } else {
      }
    }
  }
}

/**************** 2: AIRCRAFT ************ */
/* ******************Function related to aircraft creation.******************* */
/* This function is used to create mesh of bullet object. (aircraft constructor)*/
var Aircraft = function () {
  //1.Define the mesh as a generic 3D Object
  this.mesh = new THREE.Object3D()
  this.mesh.castShadow = true
  this.mesh.receiveShadow = true
  this.mesh.name = 'aircraft'

  //2.Create the fuselage
  var fuselageGeometry = new THREE.BoxGeometry(80, 50, 50) //generates cuboid with l,b,h=80,50,50
  fuselageGeometry.vertices[4].y -= 10
  fuselageGeometry.vertices[5].y -= 10
  fuselageGeometry.vertices[6].y += 30
  fuselageGeometry.vertices[7].y += 30
  fuselageGeometry.vertices[4].z += 20
  fuselageGeometry.vertices[5].z -= 20
  fuselageGeometry.vertices[6].z += 20
  fuselageGeometry.vertices[7].z -= 20
  var fuselageMaterial = new THREE.MeshPhongMaterial({
    emissiveIntensity: 0.9,
    color: usefulColours.darkBlue,
  })
  var fuselage = new THREE.Mesh(fuselageGeometry, fuselageMaterial)
  fuselage.receiveShadow = true
  fuselage.castShadow = true
  this.mesh.add(fuselage)

  //3. Create the Nose of the Aircraft (the part before the propelller)
  var noseGeometry = new THREE.BoxGeometry(20, 50, 50)
  var noseMaterial = new THREE.MeshPhongMaterial({
    emissiveIntensity: 0.9,
    color: usefulColours.lightBlue,
  })
  var nose = new THREE.Mesh(noseGeometry, noseMaterial)
  nose.position.x = 50
  nose.castShadow = true
  nose.receiveShadow = true
  this.mesh.add(nose)

  //4. Create the tail of the Aircraft (Part where the airline logo is usually located)
  var tailFinGeometry = new THREE.BoxGeometry(15, 20, 5)
  var tailFinMaterial = new THREE.MeshPhongMaterial({
    emissiveIntensity: 0.9,
    color: usefulColours.lightBlue,
  })
  var tailFin = new THREE.Mesh(tailFinGeometry, tailFinMaterial)
  tailFin.receiveShadow = true
  tailFin.position.set(-40, 20, 0)
  tailFin.castShadow = true
  this.mesh.add(tailFin)

  //5. Create the side wing of the Aircraft
  var wingGeometry = new THREE.BoxGeometry(30, 5, 120)
  var wingMaterial = new THREE.MeshPhongMaterial({
    emissiveIntensity: 0.9,
    color: usefulColours.mediumAqua,
    shading: THREE.FlatShading,
  })
  var wing = new THREE.Mesh(wingGeometry, wingMaterial)
  wing.castShadow = true
  wing.receiveShadow = true

  wing.position.set(0, 15, 0)
  this.mesh.add(wing)

  //6.1. Create the rotor/propelller of the Aircraft
  var rotorGeometry = new THREE.BoxGeometry(20, 10, 10)
  rotorGeometry.vertices[4].y -= 5
  rotorGeometry.vertices[5].y -= 5
  rotorGeometry.vertices[6].y += 5
  rotorGeometry.vertices[7].y += 5
  rotorGeometry.vertices[4].z += 5
  rotorGeometry.vertices[5].z -= 5
  rotorGeometry.vertices[6].z += 5
  rotorGeometry.vertices[7].z -= 5
  var rotorMaterial = new THREE.MeshPhongMaterial({
    emissiveIntensity: 0.9,
    color: usefulColours.brown,
    shading: THREE.FlatShading,
  })
  this.rotor = new THREE.Mesh(rotorGeometry, rotorMaterial)
  this.rotor.castShadow = true
  this.rotor.receiveShadow = true

  //6.2. Create the blades for the rotor
  var propBladeGeometry = new THREE.BoxGeometry(1, 80, 10)
  var propBladeMaterial = new THREE.MeshPhongMaterial({
    emissiveIntensity: 0.9,
    color: usefulColours.black,
    shading: THREE.FlatShading,
  })
  var vertPropBlade = new THREE.Mesh(propBladeGeometry, propBladeMaterial)
  vertPropBlade.castShadow = true
  vertPropBlade.receiveShadow = true
  vertPropBlade.position.set(8, 0, 0)
  var horizPropBlade = vertPropBlade.clone()

  horizPropBlade.rotation.x = Math.PI / 2
  horizPropBlade.castShadow = true
  horizPropBlade.receiveShadow = true
  this.rotor.add(vertPropBlade)
  this.rotor.add(horizPropBlade)
  this.rotor.position.set(60, 0, 0)
  this.mesh.add(this.rotor)

  //7. Design the wheels/landing gear for the aircraft
  //7.1 Add the right landing gear
  var landingGearGeometry = new THREE.BoxGeometry(24, 24, 4)
  var landingGearMaterial = new THREE.MeshPhongMaterial({
    emissiveIntensity: 0.9,
    color: usefulColours.black,
    shading: THREE.FlatShading,
  })
  var rightMainlandingGear = new THREE.Mesh(
    landingGearGeometry,
    landingGearMaterial
  )
  rightMainlandingGear.position.set(25, -28, 25)
  //7.1.1 Add the axis for the landing gear
  var LandingGearAxisGeometry = new THREE.BoxGeometry(10, 10, 6)
  var LandingGearAxisMaterial = new THREE.MeshPhongMaterial({
    emissiveIntensity: 0.9,
    color: usefulColours.brown,
    shading: THREE.FlatShading,
  })
  var LandingGearAxis = new THREE.Mesh(
    LandingGearAxisGeometry,
    LandingGearAxisMaterial
  )
  rightMainlandingGear.add(LandingGearAxis)
  this.mesh.add(rightMainlandingGear)
  //7.2 Clone right tire to make left landin gear
  var leftMainlandingGear = rightMainlandingGear.clone()
  leftMainlandingGear.position.z = -rightMainlandingGear.position.z
  this.mesh.add(leftMainlandingGear)
  //7.3 Clone the right tire to make the rear landing gear
  var rearlandingGear = rightMainlandingGear.clone()

  rearlandingGear.scale.set(0.5, 0.5, 0.5)
  rearlandingGear.position.set(-35, -5, 0)
  this.mesh.add(rearlandingGear)
  //7.4 Add the chock/cover for the right gear
  var LandingGearChockGeometry = new THREE.BoxGeometry(30, 15, 10)
  var LandingGearChockMaterial = new THREE.MeshPhongMaterial({
    emissiveIntensity: 0.9,
    color: usefulColours.red,
    shading: THREE.FlatShading,
  })
  var LandingGearRightChock = new THREE.Mesh(
    LandingGearChockGeometry,
    LandingGearChockMaterial
  )
  LandingGearRightChock.position.set(25, -20, 25)
  this.mesh.add(LandingGearRightChock)
  //7.5 Clone the rear wheel chock to make left chock
  var LandingGearLeftChock = LandingGearRightChock.clone()
  LandingGearLeftChock.position.z = -LandingGearRightChock.position.z
  this.mesh.add(LandingGearLeftChock)
}

/* This function creates our aircraft. */
function generateAircraft() {
  aircraft = new Aircraft()
  aircraft.mesh.scale.set(0.25, 0.25, 0.25)

  aircraft.mesh.position.y = controller.aircraftDefaultHeight
  scene.add(aircraft.mesh)
}

/* This function is used to update the postion of the aircraft
Also, it handles the collision of aircraft with meteors
and appropriately triggers the code for generating meteor
fragments upon collision */
function updateAircraft() {
  controller.aircraftSpeed = transformValue(
    currMousePtrLoc.x,
    -0.5,
    0.5,
    controller.minAircraftSpeed,
    controller.maxAircraftSpeed
  )

  var targetX = transformValue(
    currMousePtrLoc.x,
    -1,
    1,
    -controller.aircraftAmplitudeWdth * 0.7,
    -controller.aircraftAmplitudeWdth
  )
  controller.aircraftCollisionXDisplacement +=
    controller.aircraftCollisionXSpeed
  targetX += controller.aircraftCollisionXDisplacement

  var targetY = transformValue(
    currMousePtrLoc.y,
    -0.75,
    0.75,
    controller.aircraftDefaultHeight - controller.aircraftAmplitudeHt,
    controller.aircraftDefaultHeight + controller.aircraftAmplitudeHt
  )
  controller.aircraftCollisionYSpeed += controller.aircraftCollisionYSpeed
  targetY += controller.aircraftCollisionYSpeed

  aircraft.mesh.position.y +=
    (targetY - aircraft.mesh.position.y) * dT * controller.aircraftMovementSensi
  aircraft.mesh.position.x +=
    (targetX - aircraft.mesh.position.x) * dT * controller.aircraftMovementSensi

  aircraft.mesh.rotation.z =
    (targetY - aircraft.mesh.position.y) *
    dT *
    controller.aircraftRotationXSensi
  aircraft.mesh.rotation.x =
    (aircraft.mesh.position.y - targetY) *
    dT *
    controller.aircraftRotationZSensi

  var targetCameraZ = transformValue(
    controller.aircraftSpeed,
    controller.minAircraftSpeed,
    controller.maxAircraftSpeed,
    controller.nearPosOfCamera,
    controller.farPosOfCamera
  )
  perspCam.fov = transformValue(currMousePtrLoc.x, -1, 1, 40, 80)
  perspCam.updateProjectionMatrix()
  perspCam.position.y +=
    (aircraft.mesh.position.y - perspCam.position.y) *
    dT *
    controller.cameraSensivity
  controller.aircraftCollisionXSpeed +=
    (0 - controller.aircraftCollisionXSpeed) * dT * 0.03
  controller.aircraftCollisionXDisplacement +=
    (0 - controller.aircraftCollisionXDisplacement) * dT * 0.01
  controller.aircraftCollisionYSpeed +=
    (0 - controller.aircraftCollisionYSpeed) * dT * 0.03
  controller.aircraftCollisionYSpeed +=
    (0 - controller.aircraftCollisionYSpeed) * dT * 0.01
}

/* *
 * *********************************************
 * *****FUNCTIONS FOR CREATING THE VARIOUS****
 * *****ELEMENTS IN THE SCENE LIKE BULLETS,***
 * *****AIRCRAFT,SKY,JEWELS,OCEAN, CLOUD,*****
 * *****METEOR,FRAGMENTS----------------******
 */
/**************** 3: SKY ************ */
/* ***************Functions related to creation of the sky.************************** */
/* This function creates the sky. */ 
Sky = function() {
  this.mesh = new THREE.Object3D();
  this.nClouds = 20;
  this.clouds = [];
  var stepAngle = Math.PI*2 / this.nClouds;
  for(var i=0; i<this.nClouds; i++){    
    var cloud = new Cloud();
    this.clouds.push(cloud);
    var ang = stepAngle*i;
    var ht = controller.radiusOfSea + Math.random()*200 + 150;
    cloud.mesh.position.x = ht*(Math.cos(ang));
    cloud.mesh.position.y = ht*(Math.sin(ang));
    cloud.mesh.rotation.z = ang + Math.PI/2;
    cloud.mesh.position.z = -300-(Math.random()*500);
    var scl = 1+(Math.random()*2);
    cloud.mesh.scale.set(scl,scl,scl);
    this.mesh.add(cloud.mesh);       
  }
}

/* This function creates our sky. */
function generateSky(){
  sky = new Sky();
  sky.mesh.position.y = -controller.radiusOfSea;
  scene.add(sky.mesh);
}

/* This function move clouds in sky. */
Sky.prototype.moveClouds = function(){
  for(var k=0; k<this.nClouds; k++){
    var cld = this.clouds[k];
    cld.rotate();
  }
  this.mesh.rotation.z += controller.speed*dT;
}


/**************** 4: OCEAN ************ */
/* ******************Function related to ocean creation.******************* */
/* Function used for creating ocean. */ 
Ocean = function(){
  var geo = new THREE.CylinderGeometry(controller.radiusOfSea,controller.radiusOfSea,controller.lengthOfSea,40,10);
  geo.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI/2));
  geo.mergeVertices();
  var lengthOfVer = geo.vertices.length;

  this.waves = [];

  for (var i=0;i<lengthOfVer;i++){
    var vert = geo.vertices[i];
    this.waves.push({y:vert.y, x:vert.x, z:vert.z, ang:Math.random()Math.PI*2, amp:controller.minSizeOfWaves + Math.random()(controller.maxSizeOfWaves-controller.minSizeOfWaves), speed:controller.minSpeedOfWaves + Math.random()*(controller.maxSpeedOfWaves - controller.minSpeedOfWaves)});
  };
  var matr = new THREE.MeshPhongMaterial({
    color: usefulColours.lightOceanGreen,
    transparent: true,
    opacity:.7,
    shading:THREE.FlatShading,

  });
  this.mesh = new THREE.Mesh(geo, matr);
  this.mesh.name = "waves";
  this.mesh.receiveShadow = true;
}

/* This function creates our set of clouds. */
function generateOcean(){
  ocean = new Ocean();
  ocean.mesh.position.y = -controller.radiusOfSea;
  scene.add(ocean.mesh);
}

/* Function to make and move waves in ocean */ 
Ocean.prototype.moveWaves = function (){
  var verts = this.mesh.geometry.vertices;
  var vertLen = verts.length;
  for (var i=0; i<vertLen; i++){
    var singleVert = verts[i];
    var vertexOfWaves = this.waves[i];
    singleVert.x =  vertexOfWaves.x + Math.cos(vertexOfWaves.ang)*vertexOfWaves.amp;
    singleVert.y = vertexOfWaves.y + vertexOfWaves.amp*(Math.sin(vertexOfWaves.ang));
    vertexOfWaves.ang += vertexOfWaves.speed*dT;
    this.mesh.geometry.verticesNeedUpdate=true;
  }
}


/**************** 5: CLOUDS ************ */
/* ******Functions related to creation and movement of clouds************ */

/* Function for creating clouds.  */ 
Cloud = function(){
  this.mesh = new THREE.Object3D();
  this.mesh.name = "cloud";
  var geomet = new THREE.CubeGeometry(20,20,20);
  var matr = new THREE.MeshPhongMaterial({color:usefulColours.silver,});
  var nBlocks = 3 + (Math.floor(Math.random()*3));
  for (var i=0; i<nBlocks; i++ ){
    var mesH = new THREE.Mesh(geomet.clone(), matr);
    mesH.position.x = i*15;
    mesH.position.y = Math.random()*10;
    mesH.position.z = Math.random()*10;
    mesH.rotation.y = 2*(Math.random()*Math.PI);
    mesH.rotation.z = 2*(Math.random()*Math.PI);
    var sRand = .1 + Math.random()*.9;
    mesH.scale.set(sRand,sRand,sRand);
    mesH.castShadow = true;
    mesH.receiveShadow = true;
    this.mesh.add(mesH);
  }
}

/* Functions used for rotating the clouds. */ 
Cloud.prototype.rotate = function(){
  var len = this.mesh.children.length;
  for(var i=0; i<len; i++){
    var mChild = this.mesh.children[i];
    //console.log(mChild);
    mChild.rotation.y+= Math.random()(i+1).002;
    mChild.rotation.z+= Math.random()(i+1).005;
  }
}


/**************** 6: Enemy Meteors  ************ */
/* ******************Functions used for creating enemy meteors obstacles**************** */

/*  This function creates a single meteor obstacle. */
Meteor = function(){
  var geom = new THREE.TetrahedronGeometry(8,2);
  var matrl = new THREE.MeshPhongMaterial({color:usefulColours.violet, shininess:0, specular:0xffffff,shading:THREE.FlatShading});
  this.mesh = new THREE.Mesh(geom,matrl);
  this.mesh.castShadow = true;
  this.angle = 0;
  this.dist = 0;
}

/*  This function populates the meteor holder.   */
MeteorsHolder = function (){
  this.mesh = new THREE.Object3D();
  this.meteorsInUse = [];
}

/* This function creates meteors and adds them to scene. */
function generateMeteors(){
  for (var i=0; i<10; i++){
    var meteor = new Meteor();
    meteorsPool.push(meteor);
  }
  meteorsHolder = new MeteorsHolder();
  scene.add(meteorsHolder.mesh)
}

/* This function creates a set of meteor obstacles. */
MeteorsHolder.prototype.spawnMeteors = function(){
  var nmeteors = controller.stage;

  for (var i=0; i<nmeteors; i++){
    var meteor;
    if (meteorsPool.length) {
      meteor = meteorsPool.pop();
    }else{
      meteor = new Meteor();
    }

    meteor.angle = - (i*0.1);
    meteor.pointsScored = controller.aircraftDefaultHeight + controller.radiusOfSea +  (-1 + Math.random() * 2) * controller.aircraftAmplitudeHt;
    meteor.mesh.position.x = Math.cos(meteor.angle)*meteor.pointsScored;
    meteor.mesh.position.y = -(controller.radiusOfSea) + Math.sin(meteor.angle)*meteor.pointsScored;

    this.mesh.add(meteor.mesh);
    this.meteorsInUse.push(meteor);
  }
}

/*This function rotates meteor obstacles on their place (rotational motion). */
MeteorsHolder.prototype.rotateMeteors = function(){
  for (var i=0; i<this.meteorsInUse.length; i++){
    var meteor = this.meteorsInUse[i];
    meteor.angle += controller.speed*controller.meteorsSpeed*dT;

    if (meteor.angle > Math.PI*2) 
        meteor.angle -= Math.PI*2;

    meteor.mesh.position.y = -(controller.radiusOfSea) + Math.sin(meteor.angle)*meteor.pointsScored;
    meteor.mesh.position.x = Math.cos(meteor.angle)*meteor.pointsScored;
    meteor.mesh.rotation.y += (Math.random())*.1;
    meteor.mesh.rotation.z += (Math.random())*.1;

    var diff_position = aircraft.mesh.position.clone().sub(meteor.mesh.position.clone());
    var diff = diff_position.length();
    if (diff < controller.distanceToleranceInMeteor){
      fragmentsHolder.spawnFragments(meteor.mesh.position.clone(), 15, usefulColours.violet, 3);

      meteorsPool.unshift(this.meteorsInUse.splice(i,1)[0]);
      this.mesh.remove(meteor.mesh);
      controller.aircraftCollisionXSpeed = 100 * diff_position.x / diff;
      controller.aircraftCollisionYSpeed = 100 * diff_position.y / diff;
      ambLight.intensity = 2;
      var meteor_planeSound = new Audio('sounds/rockBreaking.wav');
      meteor_planeSound.play();
      meteor_planeSound.volume = 1;
      decreaseHealth();
      i--;
    }else if (meteor.angle > Math.PI){
      meteorsPool.unshift(this.meteorsInUse.splice(i,1)[0]);
      this.mesh.remove(meteor.mesh);
      i--;
    }
  }
}