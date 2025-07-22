<!--
  CategoryInput Component - Handles input for a single category
  
  For React Developers:
  - This is like a controlled component that receives props and emits events
  - defineProps() is like props in React
  - defineEmits() is like passing callback functions as props
  - v-model creates two-way binding (value + onChange combined)
-->
<script setup lang="ts">
import { computed } from 'vue'

// Props definition (like TypeScript interface for props in React)
interface Props {
  categoryName: string
  displayName: string
  options: string[]
  currentInput: string
  maxOptions?: number
}

// Emits definition (like callback props in React)
interface Emits {
  'update:currentInput': [value: string]
  'add-option': []
  'finish-category': []
}

const props = withDefaults(defineProps<Props>(), {
  maxOptions: 5
})

const emit = defineEmits<Emits>()

// Computed properties (like useMemo in React)
const canAddOption = computed(() => {
  if (props.options.length >= props.maxOptions || props.currentInput.trim().length === 0) {
    return false
  }
  // Check for duplicates (case-insensitive)
  const trimmedInput = props.currentInput.trim().toLowerCase()
  return !props.options.some(option => option.toLowerCase() === trimmedInput)
})

const canFinishCategory = computed(() => {
  return props.options.length >= 4
})

// Event handlers (like regular functions in React)
const handleAddOption = () => {
  if (canAddOption.value) {
    emit('add-option')
  }
}

const handleFinishCategory = () => {
  if (canFinishCategory.value) {
    emit('finish-category')
  }
}

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && canAddOption.value) {
    handleAddOption()
  }
}

const updateInput = (value: string) => {
  emit('update:currentInput', value)
}
</script>

<template>
  <div class="category-input">
    <h2>{{ displayName }}</h2>
    <p>Add 4-5 options (your friend will add a terrible last option):</p>
    
    <!-- Current options display -->
    <div class="current-options">
      <div 
        v-for="(option, index) in options" 
        :key="index"
        class="option-item"
      >
        {{ index + 1 }}. {{ option }}
      </div>
      
      <!-- Show placeholder for remaining slots -->
      <div 
        v-for="n in Math.max(0, 4 - options.length)" 
        :key="`placeholder-${n}`"
        class="option-placeholder"
      >
        {{ options.length + n }}. (empty)
      </div>
    </div>

    <!-- Input section -->
    <div class="input-section">
      <input 
        :value="currentInput"
        @input="updateInput(($event.target as HTMLInputElement).value)"
        @keypress="handleKeyPress"
        :placeholder="`Enter option ${options.length + 1}`"
        class="option-input"
        maxlength="50"
      />
      <button 
        @click="handleAddOption"
        :disabled="!canAddOption"
        class="add-button"
        :title="!canAddOption && currentInput.trim() && options.some(opt => opt.toLowerCase() === currentInput.trim().toLowerCase()) ? 'This option already exists' : ''"
      >
        Add Option
      </button>
    </div>

    <!-- Validation message -->
    <div v-if="currentInput.trim() && !canAddOption" class="validation-message">
      <span v-if="options.length >= maxOptions">
        Maximum {{ maxOptions }} options allowed
      </span>
      <span v-else-if="options.some(opt => opt.toLowerCase() === currentInput.trim().toLowerCase())">
        This option already exists
      </span>
    </div>

    <!-- Finish category button -->
    <button 
      v-if="canFinishCategory"
      @click="handleFinishCategory"
      class="finish-category-button"
    >
      Finish Category ({{ options.length }}/5 options)
    </button>
  </div>
</template>

<style scoped>
.category-input {
  text-align: left;
  max-width: 500px;
  margin: 0 auto;
}

.category-input h2 {
  text-align: center;
  margin-bottom: 10px;
  color: #333;
}

.category-input p {
  text-align: center;
  margin-bottom: 20px;
  color: #666;
}

.current-options {
  margin: 20px 0;
  min-height: 120px;
}

.option-item {
  background: #f5f5f5;
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
  border-left: 4px solid #667eea;
  color: #333;
  font-weight: 500;
}

.option-placeholder {
  background: #f9f9f9;
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
  border-left: 4px solid #ddd;
  color: #999;
  font-style: italic;
}

.input-section {
  display: flex;
  gap: 10px;
  margin: 20px 0;
}

.option-input {
  flex: 1;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.option-input:focus {
  outline: none;
  border-color: #667eea;
}

.add-button {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s ease;
}

.add-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.add-button:hover:not(:disabled) {
  background: #45a049;
}

.validation-message {
  color: #f44336;
  font-size: 0.9rem;
  margin-top: 5px;
  text-align: center;
}

.finish-category-button {
  background: #FF9800;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 10px;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 20px;
  transition: background 0.2s ease;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.finish-category-button:hover {
  background: #F57C00;
}
</style>
