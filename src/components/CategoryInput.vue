<!--
  CategoryInput Component - Handles input for a specific category

  For React Developers:
  - This component manages local input state and emits events to parent
  - Similar to a controlled component in React with onChange callbacks
-->
<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  categoryName: string;
  displayName: string;
  options: string[];
  currentInput: string;
}

interface Emits {
  (e: 'update:currentInput', value: string): void;
  (e: 'addOption'): void;
  (e: 'finishCategory'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const canAddOption = computed(() => {
  if (props.options.length >= 5 || props.currentInput.trim().length === 0) {
    return false;
  }
  // Check for duplicates (case-insensitive)
  const trimmedInput = props.currentInput.trim().toLowerCase();
  return !props.options.some((option) => option.toLowerCase() === trimmedInput);
});

const canFinishCategory = computed(() => {
  return props.options.length >= 4;
});

const handleAddOption = () => {
  if (canAddOption.value) {
    emit('addOption');
  }
};

const handleFinishCategory = () => {
  if (canFinishCategory.value) {
    emit('finishCategory');
  }
};

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    if (canAddOption.value) {
      handleAddOption();
    }
  }
};
</script>

<template>
  <div class="category-input">
    <h2>{{ displayName }}</h2>

    <!-- Current Options -->
    <div v-if="options.length > 0" class="current-options">
      <h3>Current options:</h3>
      <div class="options-list">
        <span v-for="(option, index) in options" :key="index" class="option-item">
          {{ option }}
        </span>
      </div>
    </div>

    <!-- Input Section -->
    <div class="input-section">
      <input
        :value="currentInput"
        @input="emit('update:currentInput', ($event.target as HTMLInputElement).value)"
        @keypress="handleKeyPress"
        type="text"
        :placeholder="`Enter ${displayName.toLowerCase()}`"
        class="category-input-field"
        maxlength="50"
      />
      <button @click="handleAddOption" :disabled="!canAddOption" class="add-button">
        Add Option
      </button>
    </div>

    <!-- Progress and Actions -->
    <div class="category-actions">
      <p class="progress">{{ options.length }}/5 options (minimum 4 required)</p>

      <div class="action-buttons">
        <button v-if="canFinishCategory" @click="handleFinishCategory" class="finish-button">
          Finish {{ displayName }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.category-input {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 15px;
  padding: 30px;
  margin: 20px 0;
  text-align: center;
}

.category-input h2 {
  color: #333;
  margin-bottom: 20px;
}

.current-options {
  margin-bottom: 25px;
}

.current-options h3 {
  color: #666;
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.options-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  margin-bottom: 20px;
}

.option-item {
  background: white;
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid #ddd;
  color: #333;
  font-weight: 500;
}

.input-section {
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.category-input-field {
  padding: 12px 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  min-width: 200px;
  flex: 1;
  max-width: 300px;
}

.category-input-field:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.add-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.add-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.add-button:not(:disabled):hover {
  opacity: 0.9;
}

.category-actions {
  text-align: center;
}

.progress {
  color: #666;
  margin-bottom: 15px;
  font-size: 0.9rem;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.finish-button {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 10px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.finish-button:hover {
  transform: translateY(-1px);
}
</style>
