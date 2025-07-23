<!--
  CategoryDisplay Component - Shows categories in a consistent grid layout

  For React Developers:
  - This is a presentational component that only receives props
  - Now handles both completed categories and playing phase categories
  - Similar to a React functional component that renders different states
-->
<script setup lang="ts">
import type { Category } from '@/types.ts';

interface Props {
  categories: Category[];
  isPlaying?: boolean; // If true, show crossed-out options and selected items
}

const props = withDefaults(defineProps<Props>(), {
  isPlaying: false,
});
</script>

<template>
  <div class="category-display-container">
    <div class="categories-grid">
      <div
        v-for="category in props.categories"
        :key="category.name"
        class="category-item"
        :class="{ 'playing-mode': isPlaying }"
      >
        <h4>{{ category.displayName }}</h4>
        <div class="options-list">
          <span
            v-for="(option, index) in category.options"
            :key="index"
            class="option"
            :class="{
              crossed: isPlaying && category.crossedOptions.has(index),
              selected: isPlaying && category.selectedIndex === index,
              'completed-option': !isPlaying,
            }"
          >
            {{ option }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.category-display-container {
  margin-top: 30px;
  text-align: left;
}

.category-display-container h3 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.category-item {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  padding: 15px;
}

.category-item.playing-mode {
  background: #f9f9f9;
  border: 2px solid #eee;
}

.category-item h4 {
  margin-bottom: 10px;
  color: #495057;
  font-size: 1.1rem;
  text-align: center;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option {
  padding: 8px 12px;
  border-radius: 5px;
  border: 1px solid #dee2e6;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.completed-option {
  background: white;
  color: #495057;
}

/* Playing mode styles */
.option.crossed {
  text-decoration: line-through;
  opacity: 0.5;
  background: #ffebee;
  color: #999;
}

.option.selected {
  background: #e8f5e8;
  border-color: #4caf50;
  color: #2e7d32;
  font-weight: bold;
}

.option:not(.crossed):not(.selected) {
  background: white;
  border: 1px solid #ddd;
}
</style>
