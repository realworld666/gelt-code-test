<script setup lang="ts">
import GamePlaying from '@/components/GamePlaying.vue';
import GameSetup from '@/components/GameSetup.vue';
import NewGameNewGameModal from '@/components/NewGameModal.vue';
import type { GameState } from '@/types.ts';
import { computed, provide, reactive, ref } from 'vue';
import GameResults from './GameResults.vue';

// If this is set to true then pressing "New Game" will populate all the categories with dummy values for testing
const DEBUG_ANIMATION_STAGE = false;

// Game State
const gameState = reactive<GameState>({
  phase: 'setup',
  selectedCategory: null,
  currentInput: '',
  mashLetters: [
    { letter: 'M', crossed: false, selected: false },
    { letter: 'A', crossed: false, selected: false },
    { letter: 'S', crossed: false, selected: false },
    { letter: 'H', crossed: false, selected: false },
  ],
  categories: {
    partner: {
      name: 'partner',
      displayName: 'Life Partner',
      options: [],
      allOptionsAdded: false,
      selectedIndex: null,
      crossedOptions: new Set(),
      badOptions: [
        'Your Year 9 Maths teacher',
        "A tax-evading minor celebrity from the '80s",
        'The AI that answers your bank’s phone system',
        'A wax statue of Mr. Bean',
        "A conspiracy YouTuber who thinks birds aren't real",
      ],
    },
    kids: {
      name: 'kids',
      displayName: 'Number of Kids',
      options: [],
      allOptionsAdded: false,
      selectedIndex: null,
      crossedOptions: new Set(),
      badOptions: ['100', '1000'],
    },
    job: {
      name: 'job',
      displayName: 'Job',
      options: [],
      allOptionsAdded: false,
      selectedIndex: null,
      crossedOptions: new Set(),
      badOptions: [
        'Professional cheese sniffer (in a windowless basement)',
        'Telemarketer for cursed encyclopedias',
        'Mascot for a failing fish & chips chain',
        'The person who tests public toilet hand dryers',
        'Goose herder on a motorway median',
      ],
    },
    salary: {
      name: 'salary',
      displayName: 'Salary',
      options: [],
      allOptionsAdded: false,
      selectedIndex: null,
      crossedOptions: new Set(),
      badOptions: ['£1 a year', '200 Babybels', 'Monopoly money'],
    },
    car: {
      name: 'car',
      displayName: 'Car',
      options: [],
      allOptionsAdded: false,
      selectedIndex: null,
      crossedOptions: new Set(),
      badOptions: [
        'A unicycle with no seat',
        'Flintstones-style car (you power it with your feet)',
        'A hearse full of angry wasps',
        'A Smart car permanently stuck in reverse',
        'A 1993 Vauxhall Astra with a haunted satnav',
      ],
    },
    home: {
      name: 'home',
      displayName: 'Where You Live',
      options: [],
      allOptionsAdded: false,
      selectedIndex: null,
      crossedOptions: new Set(),
      badOptions: [
        'A cardboard box behind Tesco',
        'Haunted caravan in Slough',
        'Inflatable bouncy castle (shared with 12 goats)',
        'Victorian sewer converted into a studio flat',
        'Room under the stairs (with a poltergeist roommate)',
      ],
    },
  },
  magicNumber: 0,
  animationRunning: false,
  currentAnimationIndex: 0,
  allItems: [],
});

provide('gameState', gameState);

// Add state for confirmation modal
const showConfirmModal = ref(false);

// Avoid user accidentally losing their progress by clicking the wrong button (yes, I did this more than once)
// Check if there's progress that would be lost
const hasProgress = computed(() => {
  // Check if any categories have options added or are completed
  const hasAddedOptions = Object.values(gameState.categories).some(
    (cat) => cat.options.length > 0 || cat.allOptionsAdded
  );

  // Check if the game is not in the setup phase
  const gameInProgress = gameState.phase !== 'setup';

  return hasAddedOptions || gameInProgress;
});

// here we calculate which of the options are still active for during the animation phase
const buildAllItems = () => {
  const items: typeof gameState.allItems = [];

  // Add MASH letters that aren't crossed out if we have more than one item not crossed out
  if (gameState.mashLetters.filter((m) => !m.crossed).length > 1) {
    gameState.mashLetters.forEach((letter, index) => {
      if (!letter.crossed) {
        items.push({ type: 'mash', index, crossed: false });
      }
    });
  }

  // Add category options that aren't crossed out and from incomplete categories
  Object.entries(gameState.categories).forEach(([key, category]) => {
    if (category.crossedOptions.size < category.options.length - 1) {
      category.options.forEach((option, index) => {
        // Check if this specific option was crossed out using the Set
        if (!category.crossedOptions.has(index)) {
          items.push({ type: 'category', categoryKey: key, index, crossed: false });
        }
      });
    }
  });

  gameState.allItems = items;
};

const startGame = () => {
  gameState.phase = 'playing';
  gameState.magicNumber = Math.floor(Math.random() * 8) + 3; // Random number 3-10

  // Start animation after a brief delay
  const runAnimationLoop = async () => {
    let currentPosition = 0;
    while (gameState.phase === 'playing') {
      // Create a list of all items not accepted or crossed out
      buildAllItems();
      // Animate counting to the next item
      currentPosition = await runAnimationStep(currentPosition);
      // Check if we're done
      if (currentPosition === -1) {
        // Final check and completion
        checkAndCompleteCategories();

        // Complete remaining MASH letters
        const remainingMash = gameState.mashLetters.filter((m) => !m.crossed);
        if (remainingMash.length === 1) {
          remainingMash[0].selected = true;
        }

        gameState.animationRunning = false;
        gameState.phase = 'results';
        break;
      }
    }
  };
  if (!gameState.animationRunning) {
    runAnimationLoop();
  }
};

const runAnimationStep = async (currentPosition: number) => {
  gameState.animationRunning = true;

  // Check if we need to complete any categories
  checkAndCompleteCategories();

  const activeItems = gameState.allItems.filter((item) => !item.crossed);

  if (activeItems.length <= 1) return -1;

  // Adjust current position if it's out of bounds
  if (currentPosition >= activeItems.length) {
    currentPosition = 0;
  }

  // Animate counting
  for (let i = 0; i < gameState.magicNumber; i++) {
    const animIndex = (currentPosition + i) % activeItems.length;
    highlightItem(activeItems[animIndex], true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    highlightItem(activeItems[animIndex], false);
  }

  // Work out which item to cross out
  let targetIndex = (currentPosition + gameState.magicNumber - 1) % activeItems.length;

  // Cross out the target item
  const itemToCross = activeItems[targetIndex];
  crossOutItem(itemToCross);

  return targetIndex;
};

const checkAndCompleteCategories = () => {
  Object.entries(gameState.categories).forEach(([, category]) => {
    if (!category.allOptionsAdded) {
      const remainingOptions = category.options.filter(
        (_, index) => !category.crossedOptions.has(index)
      );

      if (remainingOptions.length === 1) {
        category.selectedIndex = category.options.findIndex(
          (_, index) => !category.crossedOptions.has(index)
        );
        category.allOptionsAdded = true;
      }
    }
  });
};

const highlightItem = (item: (typeof gameState.allItems)[0], highlight: boolean) => {
  if (item.type === 'mash') {
    // Highlight MASH letter
    gameState.mashLetters[item.index].selected = highlight;
  } else if (item.type === 'category' && item.categoryKey) {
    // Highlight category option
    const category = gameState.categories[item.categoryKey];
    if (category) {
      category.selectedIndex = highlight ? item.index : null;
    }
  }
};

const crossOutItem = (item: (typeof gameState.allItems)[0]) => {
  if (item.type === 'mash') {
    gameState.mashLetters[item.index].crossed = true;
  } else if (item.type === 'category' && item.categoryKey) {
    // Add to the crossed options set
    const category = gameState.categories[item.categoryKey];
    category.crossedOptions.add(item.index);
  }
};

const skipAnimation = () => {
  // Complete the elimination instantly
  gameState.animationRunning = false;

  // Randomly select one from each category and MASH
  Object.values(gameState.categories).forEach((category) => {
    category.selectedIndex = Math.floor(Math.random() * category.options.length);
    category.allOptionsAdded = true;
  });

  // Select random MASH letter
  const availableMash = gameState.mashLetters.filter((m) => !m.crossed);
  if (availableMash.length > 0) {
    const randomMash = availableMash[Math.floor(Math.random() * availableMash.length)];
    randomMash.selected = true;
    gameState.mashLetters.forEach((m) => {
      if (m !== randomMash) m.crossed = true;
    });
  }

  gameState.phase = 'results';
};

const newGame = () => {
  // Check if there's progress that would be lost
  if (hasProgress.value) {
    showConfirmModal.value = true;
    return;
  }

  // If no progress, start new game immediately
  resetGame();
};

const confirmNewGame = () => {
  showConfirmModal.value = false;
  resetGame();
};

const cancelNewGame = () => {
  showConfirmModal.value = false;
};

const resetGame = () => {
  // Reset all state
  gameState.phase = 'setup';
  gameState.selectedCategory = null;
  gameState.currentInput = '';
  gameState.magicNumber = 0;
  gameState.animationRunning = false;
  gameState.currentAnimationIndex = 0;
  gameState.allItems = [];

  // Reset MASH letters
  gameState.mashLetters.forEach((letter) => {
    letter.crossed = false;
    letter.selected = false;
  });

  // Reset categories
  Object.values(gameState.categories).forEach((category) => {
    category.options = [];
    category.allOptionsAdded = false;
    category.selectedIndex = null;
    category.crossedOptions.clear();
    if (DEBUG_ANIMATION_STAGE && category.options.length === 0) {
      for (let i = 0; i < 4; i++) {
        category.options.push(`${i + 1}`);
      }
      category.allOptionsAdded = true;
    }
  });
};
</script>

<template>
  <div class="mash-game">
    <!-- MASH Title -->
    <div class="mash-title" v-if="gameState.phase !== 'results'">
      <span
        v-for="(letter, index) in gameState.mashLetters"
        :key="index"
        :class="{
          crossed: letter.crossed,
          selected: letter.selected,
          'mash-letter': true,
        }"
      >
        {{ letter.letter }}
      </span>
    </div>
    <!-- Setup Phase -->
    <GameSetup v-if="gameState.phase === 'setup'" @start-game="startGame" />

    <!-- Playing Phase -->
    <GamePlaying v-if="gameState.phase === 'playing'" @skip-animation="skipAnimation" />

    <!-- Results Phase -->
    <GameResults v-if="gameState.phase === 'results'" />

    <!-- New Game Button (always available) -->
    <button @click="newGame" class="new-game-button">New Game</button>

    <!-- Confirmation Modal -->
    <NewGameNewGameModal
      v-if="showConfirmModal"
      :confirm="confirmNewGame"
      :cancel="cancelNewGame"
    />
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
  color: #4caf50;
  transform: scale(1.2);
  text-shadow: 2px 2px 4px rgba(76, 175, 80, 0.3);
}

.game-info h2 {
  color: #333;
  margin-bottom: 10px;
}

.new-game-button {
  background: #9c27b0;
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
  background: #7b1fa2;
}

/* Animation effects */
@keyframes highlight {
  0% {
    background-color: transparent;
  }
  50% {
    background-color: #ffeb3b;
  }
  100% {
    background-color: transparent;
  }
}
</style>
