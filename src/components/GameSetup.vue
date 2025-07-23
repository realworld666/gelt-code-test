<script setup lang="ts">
import CategoryDisplay from '@/components/CategoryDisplay.vue';
import CategoryInput from '@/components/CategoryInput.vue';
import CategorySelectionButtons from '@/components/CategorySelectionButtons.vue';
import type { GameState } from '@/types.ts';
import { computed, inject } from 'vue';

const MAX_OPTIONS = 5;
const MIN_OPTIONS = 4;

interface Emits {
  (e: 'start-game'): void;
}

const emit = defineEmits<Emits>();

const gameState = inject('gameState') as GameState;

const allCategoriesComplete = computed(() => {
  return Object.values(gameState.categories).every((cat) => cat.allOptionsAdded);
});

// Categories the user hasn't filled yet
const availableCategories = computed(() => {
  return Object.values(gameState.categories).filter((cat) => !cat.allOptionsAdded);
});

// Have we added enough options to complete the category?
const canFinishCategory = computed(() => {
  const category = gameState.selectedCategory
    ? gameState.categories[gameState.selectedCategory]
    : null;
  return category && category.options.length >= MIN_OPTIONS;
});

// Should we show the add option button?
const canAddOption = computed(() => {
  const category = gameState.selectedCategory
    ? gameState.categories[gameState.selectedCategory]
    : null;
  if (
    !category ||
    category.options.length >= MAX_OPTIONS ||
    gameState.currentInput.trim().length === 0
  ) {
    return false;
  }
  // Check for duplicates (case-insensitive)
  const trimmedInput = gameState.currentInput.trim().toLowerCase();
  return !category.options.some((option) => option.toLowerCase() === trimmedInput);
});

const addBadOption = () => {
  if (!gameState.selectedCategory) return;

  const category = gameState.categories[gameState.selectedCategory];
  const randomBad = category.badOptions[Math.floor(Math.random() * category.badOptions.length)];
  category.options.push(randomBad);
};

const selectCategory = (categoryKey: string) => {
  if (gameState.selectedCategory) return; // Category already selected

  gameState.selectedCategory = categoryKey;
  gameState.currentInput = '';
};

const addOption = () => {
  if (!canAddOption.value || !gameState.selectedCategory) return;

  const category = gameState.categories[gameState.selectedCategory];
  category.options.push(gameState.currentInput.trim());
  gameState.currentInput = '';
};

const finishCategory = () => {
  if (!canFinishCategory.value || !gameState.selectedCategory) return;

  const category = gameState.categories[gameState.selectedCategory];

  addBadOption();

  category.allOptionsAdded = true;
  gameState.selectedCategory = null;
};
</script>

<template>
  <div class="setup-phase">
    <div class="category-selection">
      <!-- Category Selection -->
      <CategorySelectionButtons
        v-if="!gameState.selectedCategory"
        :categories="availableCategories"
        @category-selected="selectCategory"
      />

      <!-- Completed Categories Display -->
      <CategoryDisplay
        v-if="Object.values(gameState.categories).some((cat) => cat.allOptionsAdded)"
        :categories="Object.values(gameState.categories).filter((cat) => cat.allOptionsAdded)"
        :is-playing="false"
      />
    </div>

    <!-- Category Input -->
    <CategoryInput
      v-if="gameState.selectedCategory"
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
      <button @click="emit('start-game')" class="start-game-button">Start MASH Game!</button>
    </div>
  </div>
</template>

<style scoped>
.setup-phase {
  margin: 30px 0;
}

.start-game-section {
  margin: 30px 0;
}

.start-game-button {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
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
</style>
