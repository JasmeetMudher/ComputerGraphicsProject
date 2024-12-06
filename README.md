# Game Documentation

## Overview

This game is built using **WebGL**, utilizing technologies such as **JavaScript**, **HTML**, **CSS**, and **Three.js** (a framework for WebGL). It provides a 3D experience of controlling an aircraft while avoiding obstacles and collecting items to improve your health and score.

---

## Requirements

- **Three.js** and **TweenMax.js** are used as external libraries (located in the `libs` folder). These are open-source libraries and should not be considered for plagiarism during evaluation.
- The actual source code files include:
  - `game.js`
  - `index.html`
  - `game.css`

Please ensure that these files are not deleted for the game to function properly.

---

## How to Run the Game

1. **Execute the game by running the `index.html` file** present in the root folder of the game. Simply open it in a web browser that supports WebGL (like Chrome or Firefox).
2. There is **no requirement for executables**, and thus none are provided.
3. Please **do not delete any files** in the other folders as they are necessary for the proper functioning of the game.

---

## Game Controls

- **Aircraft Movement**: The aircraft moves according to the position of your mouse cursor. Move your mouse to control the aircraft's direction.
- **Firing Bullets**: Press the **`x`** key to fire bullets. However, keep in mind that the number of bullets is **limited**, and you must manage them wisely.

---

## Game Objective

- **Survive as long as possible** while avoiding the enemy meteors.
- **Collect health gems** to refuel your health and continue flying.
- Travel as far as you can without losing health or getting hit by meteors.

---

## Demonstration Videos

Two demonstration videos have been provided to showcase the gameplay:

- **demo1.mp4**: Played by Aniruddha Mahajan
- **demo2.mp4**: Played by Shreyas Srikrishna

These videos demonstrate how to play the game and can serve as an example for new players.

---

## Game Flow

1. **Start Screen**: Upon loading the game, you will see a start screen. Click to begin.
2. **Gameplay**: The aircraft moves with your mouse, and you can shoot bullets with the `x` key.
3. **Avoid Obstacles**: Meteors will appear as obstacles. Avoid them to prevent your health from decreasing.
4. **Health Refueling**: Collect health gems to restore your health.
5. **Game Over**: The game ends when the aircraft's health reaches zero.

---

## Files in the Game

- **`game.js`**: The main game logic, including collision detection, aircraft movement, and game state management.
- **`index.html`**: The HTML file containing the structure of the game interface.
- **`game.css`**: The stylesheet for the game, including the layout and visual appearance.

The external libraries, **Three.js** and **TweenMax.js**, are located in the `libs` folder. These libraries are crucial for rendering the 3D graphics and animations in the game.

---


## Acknowledgments

- Thanks to **Three.js** and **TweenMax.js** for providing the frameworks necessary for building the 3D graphics and animations.

---
