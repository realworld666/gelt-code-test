<!--
  GameResults Component - Displays the final MASH fortune
  
  For React Developers:
  - This component receives the final results as props
  - Pure presentation component with no side effects
  - Similar to a React component that just renders the final state
-->
<script setup lang="ts">
interface Results {
  homeType: string
  partner: string
  kids: string
  job: string
  salary: string
  car: string
  home: string
}

interface Props {
  results: Results
}

defineProps<Props>()

// Helper function to get full home type name
const getHomeTypeName = (letter: string): string => {
  switch (letter) {
    case 'M': return 'Mansion'
    case 'A': return 'Apartment'
    case 'S': return 'Shack'
    case 'H': return 'House'
    default: return 'House'
  }
}
</script>

<template>
  <div class="results-phase">
    <h2>🔮 Your MASH Fortune! 🔮</h2>
    <div class="fortune-results">
      <div class="result-item">
        <strong>🏠 Home Type:</strong> 
        {{ getHomeTypeName(results.homeType) }}
      </div>
      <div class="result-item">
        <strong>💕 Life Partner:</strong> 
        {{ results.partner || 'Not specified' }}
      </div>
      <div class="result-item">
        <strong>👶 Number of Kids:</strong> 
        {{ results.kids || 'Not specified' }}
      </div>
      <div class="result-item">
        <strong>💼 Job:</strong> 
        {{ results.job || 'Not specified' }}
      </div>
      <div class="result-item">
        <strong>💰 Salary:</strong> 
        {{ results.salary || 'Not specified' }}
      </div>
      <div class="result-item">
        <strong>🚗 Car:</strong> 
        {{ results.car || 'Not specified' }}
      </div>
      <div class="result-item">
        <strong>🌍 Where You Live:</strong> 
        {{ results.home || 'Not specified' }}
      </div>
    </div>
    
    <div class="fortune-summary">
      <p>
        <strong>Your destiny:</strong> You will live in a {{ getHomeTypeName(results.homeType).toLowerCase() }} 
        <span v-if="results.home">in {{ results.home }}</span>
        <span v-if="results.partner">with {{ results.partner }}</span><span v-if="results.kids">, 
        have {{ results.kids }} kids</span><span v-if="results.job">, work as {{ results.job }}</span><span v-if="results.salary">, 
        earn {{ results.salary }}</span><span v-if="results.car">, and drive {{ results.car }}</span>!
      </p>
    </div>
  </div>
</template>

<style scoped>
.results-phase {
  margin: 30px 0;
  text-align: center;
}

.results-phase h2 {
  color: #333;
  margin-bottom: 30px;
  font-size: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.fortune-results {
  text-align: left;
  max-width: 500px;
  margin: 0 auto 30px auto;
}

.result-item {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 20px;
  margin: 10px 0;
  border-radius: 10px;
  font-size: 1.1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.result-item:hover {
  transform: translateY(-2px);
}

.result-item strong {
  display: inline-block;
  width: 140px;
  font-weight: 600;
}

.fortune-summary {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 15px;
  padding: 20px;
  margin: 30px auto;
  max-width: 600px;
  font-size: 1.1rem;
  line-height: 1.6;
  color: #495057;
}

.fortune-summary strong {
  color: #333;
}

.fortune-summary p {
  margin: 0;
  text-align: center;
}
</style>
