# MASH Game - Vue TypeScript Implementation

A modern implementation of the classic children's fortune-telling game MASH (Mansion, Apartment, Shack, House) built with Vue 3 and TypeScript.

## Game Rules

MASH is a fortune-telling game where players:
1. Choose categories (Life Partner, Number of Kids, Job, Salary, Car, Where You Live)
2. Add 4-5 options for each category (with a "terrible" option added by a friend)
3. Use a random number (3-10) to eliminate options through counting
4. Continue until only one option remains in each category
5. Read your complete fortune!

## Features

- **Interactive Setup**: Click category buttons to fill out options
- **Duplicate Prevention**: Cannot enter the same option twice in a category
- **Completed Categories Display**: View filled categories in a two-column grid layout
- **Animated Elimination**: Watch as the algorithm counts through MASH letters and category options
- **Visual Feedback**: See crossed-out items and highlighted selections with improved contrast
- **Skip Animation**: Option to complete the game instantly
- **Responsive Design**: Works on desktop and mobile devices
- **Component Architecture**: Modular Vue components following best practices
- **TypeScript**: Full type safety and excellent developer experience

## Vue Concepts for React Developers

This project demonstrates key Vue concepts with comments explaining the React equivalents:

- `ref()` and `reactive()` - Similar to `useState`
- `computed()` - Similar to `useMemo`
- `watch()` - Similar to `useEffect`
- `v-if`, `v-for`, `v-model` - Template directives for conditional rendering, lists, and two-way binding
- `<script setup>` - Composition API syntax similar to functional components with hooks

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Type checking:**
   ```bash
   npm run type-check
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## How to Play

1. **Setup Phase:**
   - Click on category buttons to select which category to fill out
   - Add 4-5 options for each category
   - A "terrible" option will be automatically added
   - Complete all 6 categories

2. **Game Phase:**
   - A random number (3-10) is selected
   - Watch the animation count through all options
   - Options are eliminated one by one
   - Categories are completed when only one option remains

3. **Results Phase:**
   - View your complete MASH fortune
   - Click "New Game" to play again

## Project Structure

- `src/App.vue` - Main application component
- `src/components/MashGame.vue` - Main game logic and state management
- `src/components/CategoryInput.vue` - Component for inputting category options
- `src/components/CategoryDisplay.vue` - Component for displaying completed categories
- `src/components/GameResults.vue` - Component for showing final fortune results
- `src/main.ts` - Application entry point
- TypeScript configuration for full type safety

## Component Architecture

Following Vue best practices, the application is split into focused, reusable components:

- **MashGame**: Main container with game state and logic
- **CategoryInput**: Handles user input with validation and duplicate prevention
- **CategoryDisplay**: Shows completed categories in a clean grid layout
- **GameResults**: Presents the final fortune with emojis and summary

## Technologies Used

- Vue 3 with Composition API
- TypeScript
- Vite (build tool)
- CSS with scoped styling

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
