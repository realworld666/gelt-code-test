<script setup lang="ts">
interface Props {
  confirm: () => void;
  cancel: () => void;
}

const props = defineProps<Props>();
</script>

<template>
  <div class="modal-overlay">
    <div class="modal">
      <h2>Start a New Game?</h2>
      <p>There is progress that will be lost. Are you sure you want to start a new game?</p>
      <div class="modal-actions">
        <button @click="props.confirm" class="confirm-button">Yes, start new game</button>
        <button @click="props.cancel" class="cancel-button">Cancel</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 10px;
  padding: 20px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal h2 {
  margin-bottom: 15px;
  color: #333;
}

.modal p {
  margin-bottom: 20px;
  color: #666;
}

.modal-actions {
  display: flex;
  justify-content: space-around;
}

.confirm-button {
  background: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.confirm-button:hover {
  background: #45a049;
}

.cancel-button {
  background: #f44336;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.cancel-button:hover {
  background: #e53935;
}
</style>
