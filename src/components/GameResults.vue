<script setup lang="ts">
import type { GameState } from '@/types.ts';
import { computed, inject } from 'vue';

interface Results {
  homeType: string;
  partner: string;
  kids: string;
  job: string;
  salary: string;
  car: string;
  home: string;
}

const gameState = inject('gameState') as GameState;

// Get final results
const results = computed<Results>(() => {
  const selectedMash = gameState.mashLetters.find((m) => m.selected || !m.crossed);
  return {
    homeType: selectedMash?.letter || 'M',
    partner:
      gameState.categories.partner.options
        .filter(
          (option) =>
            !gameState.categories.partner.crossedOptions.has(
              gameState.categories.partner.options.indexOf(option)
            )
        )
        .pop() || '',
    kids:
      gameState.categories.kids.options
        .filter(
          (option) =>
            !gameState.categories.kids.crossedOptions.has(
              gameState.categories.kids.options.indexOf(option)
            )
        )
        .pop() || '',
    job:
      gameState.categories.job.options
        .filter(
          (option) =>
            !gameState.categories.job.crossedOptions.has(
              gameState.categories.job.options.indexOf(option)
            )
        )
        .pop() || '',
    salary:
      gameState.categories.salary.options
        .filter(
          (option) =>
            !gameState.categories.salary.crossedOptions.has(
              gameState.categories.salary.options.indexOf(option)
            )
        )
        .pop() || '',
    car:
      gameState.categories.car.options
        .filter(
          (option) =>
            !gameState.categories.car.crossedOptions.has(
              gameState.categories.car.options.indexOf(option)
            )
        )
        .pop() || '',
    home:
      gameState.categories.home.options
        .filter(
          (option) =>
            !gameState.categories.home.crossedOptions.has(
              gameState.categories.home.options.indexOf(option)
            )
        )
        .pop() || '',
  };
});

const getHomeTypeText = (letter: string) => {
  switch (letter) {
    case 'M':
      return 'Mansion';
    case 'A':
      return 'Apartment';
    case 'S':
      return 'Shack';
    case 'H':
      return 'House';
    default:
      return 'House';
  }
};
</script>

<template>
  <div class="game-results">
    <h2>🎉 Your MASH Results! 🎉</h2>

    <div class="results-grid">
      <div class="result-item home-type">
        <h3>You will live in a...</h3>
        <div class="result-value highlight">{{ getHomeTypeText(results.homeType) }}</div>
      </div>

      <div class="result-item">
        <h3>Life Partner</h3>
        <div class="result-value">{{ results.partner }}</div>
      </div>

      <div class="result-item">
        <h3>Number of Kids</h3>
        <div class="result-value">{{ results.kids }}</div>
      </div>

      <div class="result-item">
        <h3>Job</h3>
        <div class="result-value">{{ results.job }}</div>
      </div>

      <div class="result-item">
        <h3>Salary</h3>
        <div class="result-value">{{ results.salary }}</div>
      </div>

      <div class="result-item">
        <h3>Car</h3>
        <div class="result-value">{{ results.car }}</div>
      </div>

      <div class="result-item">
        <h3>Where You Live</h3>
        <div class="result-value">{{ results.home }}</div>
      </div>
    </div>

    <div class="results-summary">
      <p>
        You will live in a <strong>{{ getHomeTypeText(results.homeType) }}</strong> in
        <strong>{{ results.home }}</strong> with <strong>{{ results.partner }}</strong
        >. You'll have <strong>{{ results.kids }}</strong> kids and work as a
        <strong>{{ results.job }}</strong> making <strong>{{ results.salary }}</strong
        >. You'll drive a <strong>{{ results.car }}</strong
        >!
      </p>
    </div>
  </div>
</template>

<style scoped>
.game-results {
  text-align: center;
  margin: 30px 0;
}

.game-results h2 {
  color: #333;
  margin-bottom: 30px;
  font-size: 2rem;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 30px 0;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.result-item {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
  border-radius: 15px;
  border: 2px solid #e0e6ed;
  transition: transform 0.2s ease;
}

.result-item:hover {
  transform: translateY(-2px);
}

.result-item.home-type {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.result-item h3 {
  margin-bottom: 10px;
  color: #555;
  font-size: 1rem;
}

.result-item.home-type h3 {
  color: #fff;
}

.result-value {
  font-size: 1.3rem;
  font-weight: bold;
  color: #333;
  padding: 10px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  word-wrap: break-word;
}

.result-value.highlight {
  background: rgba(255, 255, 255, 0.95);
  color: #764ba2;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.results-summary {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 15px;
  padding: 25px;
  margin-top: 30px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.results-summary p {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #444;
  margin: 0;
}

.results-summary strong {
  color: #667eea;
  font-weight: 600;
}
</style>
