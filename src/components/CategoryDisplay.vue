<!--
  CategoryDisplay Component - Shows completed categories in a grid
  
  For React Developers:
  - This is a presentational component that only receives props
  - No state management, just displays data
  - Similar to a React functional component that only renders
-->
<script setup lang="ts">
interface Category {
  name: string
  displayName: string
  options: string[]
  completed: boolean
  selectedIndex: number | null
}

interface Props {
  categories: Record<string, Category>
}

defineProps<Props>()
</script>

<template>
  <div class="completed-categories">
    <h3>Completed Categories:</h3>
    <div class="completed-grid">
      <div 
        v-for="category in Object.values(categories).filter(cat => cat.completed)" 
        :key="category.name"
        class="completed-category"
      >
        <h4>{{ category.displayName }}</h4>
        <div class="completed-options">
          <span 
            v-for="(option, index) in category.options" 
            :key="index"
            class="completed-option"
          >
            {{ option }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.completed-categories {
  margin-top: 30px;
  text-align: left;
}

.completed-categories h3 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.completed-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.completed-category {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  padding: 15px;
}

.completed-category h4 {
  margin-bottom: 10px;
  color: #495057;
  font-size: 1.1rem;
}

.completed-options {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.completed-option {
  background: white;
  padding: 8px 12px;
  border-radius: 5px;
  border: 1px solid #dee2e6;
  color: #495057;
  font-size: 0.9rem;
}
</style>
