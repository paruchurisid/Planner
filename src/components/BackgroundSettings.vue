<template>
  <div class="background-settings">
    <h3 class="mb-3">Background Settings</h3>
    <div class="background-options">
      <div 
        v-for="(bg, index) in backgroundOptions" 
        :key="index"
        class="background-option"
        :class="{ 'selected': selectedBackground === bg }"
        @click="selectBackground(bg)"
      >
        <div 
          class="background-preview"
          :style="{ backgroundImage: `url(${getBackgroundPath(bg)})` }"
        ></div>
        <span class="background-name">{{ getBackgroundName(bg) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BackgroundSettings',
  data() {
    return {
      selectedBackground: 'default',
      backgroundOptions: [
        'default',
        'gradient1',
        'gradient2',
        'gradient3',
        'gradient4'
      ]
    }
  },
  methods: {
    getBackgroundPath(bgName) {
      if (bgName === 'default') return '';
      return `/backgrounds/${bgName}.jpg`; // Assuming you'll add these images to public/backgrounds/
    },
    getBackgroundName(bgName) {
      return bgName === 'default' ? 'Default' : 
             bgName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    },
    selectBackground(bg) {
      this.selectedBackground = bg;
      this.$emit('background-selected', this.getBackgroundPath(bg));
    }
  }
}
</script>

<style scoped>
.background-settings {
  padding: 1rem;
  background: var(--card-bg);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.background-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.background-option {
  cursor: pointer;
  text-align: center;
  transition: transform 0.2s;
  padding: 0.5rem;
  border-radius: 8px;
  border: 2px solid transparent;
}

.background-option:hover {
  transform: translateY(-2px);
}

.background-option.selected {
  border-color: var(--primary);
  background-color: rgba(var(--primary-rgb), 0.1);
}

.background-preview {
  width: 100%;
  height: 80px;
  border-radius: 4px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-bottom: 0.5rem;
  border: 1px solid var(--border-color);
}

.background-name {
  font-size: 0.8rem;
  color: var(--text-muted);
}
</style>
