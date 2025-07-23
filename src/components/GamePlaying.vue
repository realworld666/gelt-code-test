<script setup lang="ts">
import CategoryDisplay from '@/components/CategoryDisplay.vue';
import type { GameState } from '@/types.ts';
import { inject } from 'vue';

const gameState = inject('gameState') as GameState;

const emit = defineEmits(['skip-animation']);

const skipAnimation = () => {
  emit('skip-animation');
};
</script>

<template>
  <div v-if="gameState.phase === 'playing'" class="playing-phase">
    <div class="game-info">
      <h2>Magic Number: {{ gameState.magicNumber }}</h2>
      <p v-if="gameState.animationRunning">Counting through options...</p>
    </div>

    <CategoryDisplay
      :categories="Object.values(gameState.categories)"
      :show-only-completed="false"
      :is-playing="true"
    />

    <!-- Skip Animation Button -->
    <button v-if="gameState.animationRunning" @click="skipAnimation" class="skip-button">
      Skip Animation
    </button>
  </div>
</template>

<style scoped>
.playing-phase {
  margin: 30px 0;
}

.game-info {
  margin-bottom: 30px;
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
</style>
