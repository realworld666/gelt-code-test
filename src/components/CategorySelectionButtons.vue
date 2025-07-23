<script setup lang="ts">
import type { Category } from '@/types.ts';

interface Props {
  categories: Category[];
}
interface Emits {
  (e: 'categorySelected', value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
</script>

<template>
  <div class="category-selection">
    <h2>Choose a category to fill out:</h2>

    <!-- Available Categories -->
    <div v-if="props.categories.length > 0" class="category-buttons">
      <button
        v-for="category in props.categories"
        :key="category.name"
        @click="emit('categorySelected', category.name)"
        class="category-button"
      >
        {{ category.displayName }}
      </button>
    </div>
  </div>
</template>

<style scoped>
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
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.category-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}
</style>
