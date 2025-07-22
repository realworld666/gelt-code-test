<!--
  MASH Game Component - Vue TypeScript Implementation

  For React Developers:
  - This is like a functional component with useState, useEffect, etc.
  - ref() is like useState for primitive values
  - reactive() is like useState for objects
  - computed() is like useMemo
  - watch() is like useEffect with dependencies
  - Component imports are like importing other React components
-->
<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick } from 'vue'
import CategoryInput from './CategoryInput.vue'
import CategoryDisplay from './CategoryDisplay.vue'
import GameResults from './GameResults.vue'

// Type definitions (like TypeScript interfaces in React)
interface Category {
  name: string
  displayName: string
  options: string[]
  completed: boolean
  selectedIndex: number | null
  crossedOptions: Set<number> // Track which options are crossed out
}

interface GameState {
  phase: 'setup' | 'playing' | 'results'
  selectedCategory: string | null
  currentInput: string
  mashLetters: Array<{ letter: string; crossed: boolean; selected: boolean }>
  categories: Record<string, Category>
  magicNumber: number
  animationRunning: boolean
  currentAnimationIndex: number
  allItems: Array<{ type: 'mash' | 'category'; categoryKey?: string; index: number; crossed: boolean }>
}

// Reactive state (like useState in React)
// ref() creates a reactive reference for primitive values
const gameState = reactive<GameState>({
  phase: 'setup',
  selectedCategory: null,
  currentInput: '',
  mashLetters: [
    { letter: 'M', crossed: false, selected: false },
    { letter: 'A', crossed: false, selected: false },
    { letter: 'S', crossed: false, selected: false },
    { letter: 'H', crossed: false, selected: false }
  ],
  categories: {
    partner: { name: 'partner', displayName: 'Life Partner', options: [], completed: false, selectedIndex: null, crossedOptions: new Set() },
    kids: { name: 'kids', displayName: 'Number of Kids', options: [], completed: false, selectedIndex: null, crossedOptions: new Set() },
    job: { name: 'job', displayName: 'Job', options: [], completed: false, selectedIndex: null, crossedOptions: new Set() },
    salary: { name: 'salary', displayName: 'Salary', options: [], completed: false, selectedIndex: null, crossedOptions: new Set() },
    car: { name: 'car', displayName: 'Car', options: [], completed: false, selectedIndex: null, crossedOptions: new Set() },
    home: { name: 'home', displayName: 'Where You Live', options: [], completed: false, selectedIndex: null, crossedOptions: new Set() }
  },
  magicNumber: 0,
  animationRunning: false,
  currentAnimationIndex: 0,
  allItems: []
})

// Computed properties (like useMemo in React)
// These automatically update when their dependencies change
const availableCategories = computed(() => {
  return Object.values(gameState.categories).filter(cat => !cat.completed)
})

const allCategoriesComplete = computed(() => {
  return Object.values(gameState.categories).every(cat => cat.completed)
})

const canAddOption = computed(() => {
  const category = gameState.selectedCategory ? gameState.categories[gameState.selectedCategory] : null
  if (!category || category.options.length >= 5 || gameState.currentInput.trim().length === 0) {
    return false
  }
  // Check for duplicates (case-insensitive)
  const trimmedInput = gameState.currentInput.trim().toLowerCase()
  return !category.options.some(option => option.toLowerCase() === trimmedInput)
})

const canFinishCategory = computed(() => {
  const category = gameState.selectedCategory ? gameState.categories[gameState.selectedCategory] : null
  return category && category.options.length >= 4
})

const canStartGame = computed(() => {
  return allCategoriesComplete.value && gameState.mashLetters.filter(m => !m.crossed).length > 1
})

// Functions (like regular functions in React components)
const selectCategory = (categoryKey: string) => {
  if (gameState.selectedCategory) return // Category already selected
  
  gameState.selectedCategory = categoryKey
  gameState.currentInput = ''
}

const addOption = () => {
  if (!canAddOption.value || !gameState.selectedCategory) return
  
  const category = gameState.categories[gameState.selectedCategory]
  category.options.push(gameState.currentInput.trim())
  gameState.currentInput = ''
}

const addBadOption = () => {
  if (!gameState.selectedCategory) return
  
  const category = gameState.categories[gameState.selectedCategory]
  const badOptions = [
    'Terrible option', 'Worst case scenario', 'Nightmare choice', 
    'Absolutely awful', 'Complete disaster', 'Total failure'
  ]
  const randomBad = badOptions[Math.floor(Math.random() * badOptions.length)]
  category.options.push(randomBad)
}

const finishCategory = () => {
  if (!canFinishCategory.value || !gameState.selectedCategory) return
  
  const category = gameState.categories[gameState.selectedCategory]
  
  // Add bad option if we only have 4 options
  if (category.options.length === 4) {
    addBadOption()
  }
  
  category.completed = true
  gameState.selectedCategory = null
}

const buildAllItems = () => {
  const items: typeof gameState.allItems = []

  // Add MASH letters that aren't crossed out
  gameState.mashLetters.forEach((letter, index) => {
    if (!letter.crossed) {
      items.push({ type: 'mash', index, crossed: false })
    }
  })

  // Add category options that aren't crossed out and from incomplete categories
  Object.entries(gameState.categories).forEach(([key, category]) => {
    if (!category.completed) {
      category.options.forEach((option, index) => {
        // Check if this specific option was crossed out using the Set
        if (!category.crossedOptions.has(index)) {
          items.push({ type: 'category', categoryKey: key, index, crossed: false })
        }
      })
    }
  })

  gameState.allItems = items
}

const startGame = () => {
  if (!canStartGame.value) return
  
  gameState.phase = 'playing'
  gameState.magicNumber = Math.floor(Math.random() * 8) + 3 // Random number 3-10
  buildAllItems()
  
  // Start animation after a brief delay
  setTimeout(() => {
    runAnimation()
  }, 1000)
}

const runAnimation = async () => {
  gameState.animationRunning = true
  let currentPosition = 0

  while (true) {
    // Rebuild items list to get current state
    buildAllItems()

    // Check if we need to complete any categories
    checkAndCompleteCategories()

    // Rebuild again after category completion check
    buildAllItems()

    const activeItems = gameState.allItems.filter(item => !item.crossed)

    // Check if we're done (only one item left total, or each category has one item)
    const activeMash = gameState.mashLetters.filter(m => !m.crossed).length
    const incompleteCategories = Object.values(gameState.categories).filter(cat => !cat.completed).length

    if (activeMash <= 1 && incompleteCategories === 0) break
    if (activeItems.length <= 1) break

    // Adjust current position if it's out of bounds
    if (currentPosition >= activeItems.length) {
      currentPosition = 0
    }

    // Count through items
    let targetIndex = (currentPosition + gameState.magicNumber - 1) % activeItems.length

    // Animate counting
    for (let i = 0; i < gameState.magicNumber; i++) {
      const animIndex = (currentPosition + i) % activeItems.length
      // Visual highlighting would go here
      await new Promise(resolve => setTimeout(resolve, 200))
    }

    // Cross out the target item
    const itemToCross = activeItems[targetIndex]
    crossOutItem(itemToCross)

    // Set next starting position (skip the crossed out item)
    currentPosition = targetIndex

    await new Promise(resolve => setTimeout(resolve, 300))
  }

  // Final check and completion
  checkAndCompleteCategories()

  // Complete remaining MASH letters
  const remainingMash = gameState.mashLetters.filter(m => !m.crossed)
  if (remainingMash.length === 1) {
    remainingMash[0].selected = true
  }

  gameState.animationRunning = false
  gameState.phase = 'results'
}

const checkAndCompleteCategories = () => {
  Object.entries(gameState.categories).forEach(([key, category]) => {
    if (!category.completed) {
      const remainingOptions = category.options.filter((_, index) => !category.crossedOptions.has(index))

      if (remainingOptions.length === 1) {
        const remainingIndex = category.options.findIndex((_, index) => !category.crossedOptions.has(index))
        category.selectedIndex = remainingIndex
        category.completed = true
      }
    }
  })
}

const highlightItem = (item: typeof gameState.allItems[0], highlight: boolean) => {
  if (item.type === 'mash') {
    // Highlight MASH letter
    gameState.mashLetters[item.index].selected = highlight
  } else if (item.type === 'category' && item.categoryKey) {
    // Highlight category option
    const category = gameState.categories[item.categoryKey]
    if (category && !category.completed) {
      // We'll use a temporary property to track the currently highlighted item
      // This will be used in the template
      gameState.currentAnimationIndex = item.index
      gameState.selectedCategory = highlight ? item.categoryKey : null
    }
  }
}

const crossOutItem = (item: typeof gameState.allItems[0]) => {
  if (item.type === 'mash') {
    gameState.mashLetters[item.index].crossed = true
  } else if (item.type === 'category' && item.categoryKey) {
    // Add to the crossed options set
    const category = gameState.categories[item.categoryKey]
    category.crossedOptions.add(item.index)
  }
}

const skipAnimation = () => {
  // Complete the elimination instantly
  gameState.animationRunning = false
  
  // Randomly select one from each category and MASH
  Object.values(gameState.categories).forEach(category => {
    const randomIndex = Math.floor(Math.random() * category.options.length)
    category.selectedIndex = randomIndex
    category.completed = true
  })
  
  // Select random MASH letter
  const availableMash = gameState.mashLetters.filter(m => !m.crossed)
  if (availableMash.length > 0) {
    const randomMash = availableMash[Math.floor(Math.random() * availableMash.length)]
    randomMash.selected = true
    gameState.mashLetters.forEach(m => {
      if (m !== randomMash) m.crossed = true
    })
  }
  
  gameState.phase = 'results'
}

const newGame = () => {
  // Reset all state
  gameState.phase = 'setup'
  gameState.selectedCategory = null
  gameState.currentInput = ''
  gameState.magicNumber = 0
  gameState.animationRunning = false
  gameState.currentAnimationIndex = 0
  gameState.allItems = []
  
  // Reset MASH letters
  gameState.mashLetters.forEach(letter => {
    letter.crossed = false
    letter.selected = false
  })
  
  // Reset categories
  Object.values(gameState.categories).forEach(category => {
    category.options = []
    category.completed = false
    category.selectedIndex = null
    category.crossedOptions.clear()
  })
}

// Get final results
const getFinalResults = computed(() => {
  const selectedMash = gameState.mashLetters.find(m => m.selected || !m.crossed)
  const results = {
    homeType: selectedMash?.letter || 'M',
    partner: gameState.categories.partner.selectedIndex !== null 
      ? gameState.categories.partner.options[gameState.categories.partner.selectedIndex] 
      : '',
    kids: gameState.categories.kids.selectedIndex !== null 
      ? gameState.categories.kids.options[gameState.categories.kids.selectedIndex] 
      : '',
    job: gameState.categories.job.selectedIndex !== null 
      ? gameState.categories.job.options[gameState.categories.job.selectedIndex] 
      : '',
    salary: gameState.categories.salary.selectedIndex !== null 
      ? gameState.categories.salary.options[gameState.categories.salary.selectedIndex] 
      : '',
    car: gameState.categories.car.selectedIndex !== null 
      ? gameState.categories.car.options[gameState.categories.car.selectedIndex] 
      : '',
    home: gameState.categories.home.selectedIndex !== null 
      ? gameState.categories.home.options[gameState.categories.home.selectedIndex] 
      : ''
  }
  
  return results
})

// Input handling is now in CategoryInput component
</script>

<template>
  <!--
    Vue Template Syntax for React Developers:
    - v-if is like conditional rendering with &&
    - v-for is like .map() for arrays
    - v-model is like value + onChange combined
    - @click is like onClick
    - :class is like className with dynamic values
  -->
  <div class="mash-game">
    <!-- MASH Title - Always visible -->
    <div class="mash-title">
      <span
        v-for="(letter, index) in gameState.mashLetters"
        :key="index"
        :class="{
          'crossed': letter.crossed,
          'selected': letter.selected,
          'mash-letter': true
        }"
      >
        {{ letter.letter }}
      </span>
    </div>

    <!-- Setup Phase -->
    <div v-if="gameState.phase === 'setup'" class="setup-phase">
      <!-- Category Selection -->
      <div v-if="!gameState.selectedCategory" class="category-selection">
        <h2>Choose a category to fill out:</h2>

        <!-- Available Categories -->
        <div v-if="availableCategories.length > 0" class="category-buttons">
          <button
            v-for="category in availableCategories"
            :key="category.name"
            @click="selectCategory(category.name)"
            class="category-button"
          >
            {{ category.displayName }}
          </button>
        </div>

        <!-- Completed Categories Display -->
        <CategoryDisplay
          v-if="Object.values(gameState.categories).some(cat => cat.completed)"
          :categories="gameState.categories"
        />
      </div>

      <!-- Category Input -->
      <CategoryInput
        v-else
        :category-name="gameState.selectedCategory"
        :display-name="gameState.categories[gameState.selectedCategory].displayName"
        :options="gameState.categories[gameState.selectedCategory].options"
        v-model:current-input="gameState.currentInput"
        @add-option="addOption"
        @finish-category="finishCategory"
      />

      <!-- Start Game Button -->
      <div v-if="allCategoriesComplete" class="start-game-section">
        <h2>All categories complete!</h2>
        <button @click="startGame" class="start-game-button">
          Start MASH Game!
        </button>
      </div>
    </div>

    <!-- Playing Phase -->
    <div v-if="gameState.phase === 'playing'" class="playing-phase">
      <div class="game-info">
        <h2>Magic Number: {{ gameState.magicNumber }}</h2>
        <p v-if="gameState.animationRunning">Counting through options...</p>
      </div>

      <!-- Categories Display -->
      <div class="categories-display">
        <div
          v-for="(category, key) in gameState.categories"
          :key="key"
          class="category-display"
        >
          <h3>{{ category.displayName }}</h3>
          <div class="options-list">
            <span
              v-for="(option, index) in category.options"
              :key="index"
              :class="{
                'option': true,
                'crossed': category.crossedOptions.has(index),
                'selected': category.selectedIndex === index && category.completed
              }"
            >
              {{ option }}
            </span>
          </div>
        </div>
      </div>

      <!-- Skip Animation Button -->
      <button
        v-if="gameState.animationRunning"
        @click="skipAnimation"
        class="skip-button"
      >
        Skip Animation
      </button>
    </div>

    <!-- Results Phase -->
    <GameResults
      v-if="gameState.phase === 'results'"
      :results="getFinalResults"
    />

    <!-- New Game Button (always available) -->
    <button @click="newGame" class="new-game-button">
      New Game
    </button>
  </div>
</template>

<style scoped>
/*
  Scoped styles - these only apply to this component
  Similar to CSS modules in React
*/
.mash-game {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  width: 100%;
  text-align: center;
}

.mash-title {
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 30px;
  letter-spacing: 0.5rem;
  color: #333;
}

.mash-letter {
  display: inline-block;
  margin: 0 10px;
  transition: all 0.3s ease;
  position: relative;
}

.mash-letter.crossed {
  text-decoration: line-through;
  opacity: 0.5;
  color: #999;
}

.mash-letter.selected {
  color: #4CAF50;
  transform: scale(1.2);
  text-shadow: 2px 2px 4px rgba(76, 175, 80, 0.3);
}

.setup-phase {
  margin: 30px 0;
}

.category-selection h2 {
  margin-bottom: 20px;
  color: #333;
}

.category-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin: 20px 0;
}

.category-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 20px;
  border-radius: 10px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.category-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

/* Removed styles that are now in component files */

.start-game-section {
  margin: 30px 0;
}

.start-game-button {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  border: none;
  padding: 20px 40px;
  border-radius: 15px;
  font-size: 1.3rem;
  cursor: pointer;
  margin-top: 20px;
  transition: transform 0.2s ease;
}

.start-game-button:hover {
  transform: scale(1.05);
}

.playing-phase {
  margin: 30px 0;
}

.game-info {
  margin-bottom: 30px;
}

.game-info h2 {
  color: #333;
  margin-bottom: 10px;
}

.categories-display {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 30px 0;
}

.category-display {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  border: 2px solid #eee;
}

.category-display h3 {
  margin-bottom: 15px;
  color: #333;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option {
  background: white;
  padding: 8px 12px;
  border-radius: 5px;
  border: 1px solid #ddd;
  transition: all 0.3s ease;
}

.option.crossed {
  text-decoration: line-through;
  opacity: 0.5;
  background: #ffebee;
  color: #999;
}

.option.selected {
  background: #e8f5e8;
  border-color: #4CAF50;
  color: #2e7d32;
  font-weight: bold;
}

.skip-button {
  background: #f44336;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 20px;
}

/* Results styles moved to GameResults component */

.new-game-button {
  background: #9C27B0;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 10px;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 30px;
  transition: background 0.2s ease;
}

.new-game-button:hover {
  background: #7B1FA2;
}

/* Animation effects */
@keyframes highlight {
  0% { background-color: transparent; }
  50% { background-color: #ffeb3b; }
  100% { background-color: transparent; }
}

.option.highlighting {
  animation: highlight 0.3s ease;
}
</style>
