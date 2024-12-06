# Game Documentation

## Overview

This game is built using **WebGL**, utilizing technologies such as **JavaScript**, **HTML**, **CSS**, and **Three.js** (a framework for WebGL). It provides a 3D experience where players control an aircraft, avoiding obstacles, collecting health gems, and firing bullets to survive as long as possible.

---

## Requirements

- **Three.js** and **TweenMax.js** are used as external libraries (located in the `libs` folder). These are open-source libraries and should not be considered for plagiarism during evaluation.
- The actual source code files include:
  - `game.js` - The main game logic, including aircraft movement, collision detection, and scoring.
  - `index.html` - The HTML file containing the structure of the game interface.
  - `game.css` - The stylesheet for the game, including the layout and visual appearance.

Please ensure that these files are not deleted for the game to function properly.

---

## How to Run the Game

1. **Execute the game by running the `index.html` file** present in the root folder of the game. Simply open it in a web browser that supports WebGL (such as Chrome or Firefox).
2. There is **no need for additional executables**, and hence none are provided.
3. Please **do not delete any files** in the other folders (like `libs`) as they are necessary for the proper functioning of the game.

---

## Game Controls

- **Aircraft Movement**: The aircraft moves based on the position of your mouse cursor. Simply move your mouse to control the aircraft’s direction in the 3D world.
- **Firing Bullets**: Press the **`x`** key to fire bullets. However, keep in mind that the number of bullets is **limited**, and you must manage them wisely.
  
---

## Game Objective

- **Survive as long as possible** while avoiding enemy meteors.
- **Collect health gems** to refuel your health and continue flying.
- **Earn points** by traveling through the game world and surviving longer.
- Travel as far as you can without losing health or getting hit by meteors.

---

## Game Flow

1. **Start Screen**: Upon loading the game, you will see a start screen. Click to begin.
2. **Gameplay**: The aircraft moves with your mouse, and you can shoot bullets with the `x` key.
3. **Avoid Obstacles**: Meteors will appear as obstacles in the game. Avoid them to prevent your health from decreasing.
4. **Health Refueling**: Collect health gems scattered across the environment to restore your health.
5. **Leveling Up**: As you travel further, the game will increase in difficulty, and the aircraft speed will increase.
6. **Game Over**: The game ends when the aircraft's health reaches zero, and your score is displayed. You can restart the game from this screen.

---

## Files in the Game

- **`game.js`**: The main JavaScript file that handles the game logic. This includes collision detection, aircraft movement, bullet firing, health management, meteor generation, score tracking, and game state management.
- **`index.html`**: The HTML file containing the structure of the game interface, such as the canvas where the game is rendered and the interface elements like score and health.
- **`game.css`**: The CSS file responsible for the layout, visual appearance, and styling of the game interface.

The external libraries, **Three.js** and **TweenMax.js**, are located in the `libs` folder. These libraries are crucial for rendering the 3D graphics, animations, and game effects.

---

## How to Play

### Starting the Game
- Click the **Start** button when you see the start screen to begin the game.

### Movement & Actions
- **Control the Aircraft**: Move your mouse around the screen to control the aircraft’s position in the game world.
- **Shoot Bullets**: Press **`x`** to fire bullets. Each stage increases the number of bullets available to you, but they are still limited, so manage them carefully.

### Collecting Gems & Avoiding Meteors
- Collect **health gems** to restore lost health and stay alive.
- **Meteors** are obstacles that you must avoid. If you collide with them, you lose health.
- As you progress, the game will spawn new obstacles (meteors), and the game environment will speed up.

---

## Level Progression & Difficulty

- Every **100 meters** traveled, the game will:
  - Increase the speed of the aircraft.
  - Spawn new meteors and obstacles.
  - Level up the game, resulting in more challenging gameplay.
  
---

## Game Features

- **Health Meter**: The health of your aircraft is represented by a health meter. Avoid meteors and collect health gems to keep your health full.
- **Bullet System**: Limited bullets are available for the aircraft to shoot. Press the **`x`** key to fire bullets. Bullets can destroy meteors.
- **Stage Progression**: The game tracks the player's progress and increments stages, making the game more difficult as the player advances.

---

## Acknowledgments

- Special thanks to the developers and contributors of **Three.js** and **TweenMax.js**, which were used to build the 3D world, animations, and game physics in this project.

---
