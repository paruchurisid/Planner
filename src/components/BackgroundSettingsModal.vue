<template>
  <div class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0, 0, 0, 0.5);">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Background Settings</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <ul class="nav nav-tabs mb-3" id="backgroundTabs" role="tablist">
            <li class="nav-item" role="presentation">
              <button 
                class="nav-link" 
                :class="{ 'active': activeTab === 'gradients' }"
                @click="activeTab = 'gradients'"
              >
                Gradients
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button 
                class="nav-link" 
                :class="{ 'active': activeTab === 'images' }"
                @click="activeTab = 'images'"
              >
                Your Images
              </button>
            </li>
          </ul>

          <!-- Gradients Tab -->
          <div v-if="activeTab === 'gradients'" class="mb-3">
            <div class="d-flex flex-wrap gap-2">
              <div 
                v-for="(bg, index) in gradientOptions" 
                :key="'gradient-' + index"
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

          <!-- Custom Images Tab -->
          <div v-else class="mb-3">
            <div class="d-flex flex-wrap gap-2">
              <div 
                v-for="(img, index) in customImages" 
                :key="'img-' + index"
                class="background-option"
                :class="{ 'selected': selectedBackground === img }"
                @click="selectBackground(img)"
              >
                <div 
                  class="background-preview"
                  :style="{ backgroundImage: `url(${img})` }"
                ></div>
                <span class="background-name">{{ getImageName(img) }}</span>
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label for="customBackground" class="form-label">Or use a custom image URL</label>
            <div class="input-group">
              <input 
                type="text" 
                class="form-control" 
                id="customBackground" 
                v-model="customBackground"
                placeholder="Enter image URL"
              >
              <button class="btn btn-outline-secondary" type="button" @click="useCustomBackground">
                Apply
              </button>
            </div>
          </div>
          <div class="d-flex justify-content-between">
            <button class="btn btn-outline-danger" @click="clearBackground">
              <i class="bi-trash"></i> Remove Background
            </button>
            <button class="btn btn-primary" @click="applyBackground">
              <i class="bi-check-lg"></i> Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'BackgroundSettingsModal',
  data() {
    return {
      selectedBackground: 'default',
      customBackground: '',
      activeTab: 'gradients',
      gradientOptions: [
        'gradient1',
        'gradient2',
        'gradient3',
        'gradient4',
        'gradient5'
      ],
      customImages: [
        'cedric-letsch-FYDNbPE9Bw4-unsplash.jpg',
        'haomeng-yang-bcFK5G9_z1M-unsplash.jpg',
        'hendrik-cornelissen--qrcOR33ErA-unsplash.jpg',
        'jacky-huang-6rC8fmNW3pk-unsplash.jpg',
        'jamie-hagan-RWzPBcWVdpw-unsplash.jpg',
        'jess-barnett-9O3_JJOT3As-unsplash.jpg',
        'john-lee-oMneOBYhJxY-unsplash.jpg',
        'krista-joy-montgomery-ixt2E1MfNUI-unsplash.jpg',
        'louis-paulin-4Q10JVnBhr4-unsplash.jpg',
        'matthew-fournier-ycv7guIlR9c-unsplash.jpg',
        'mojave-jeff-wihIN_DjxeA-unsplash.jpg',
        'priscilla-du-preez-Y_coTG5xEsE-unsplash.jpg',
        'rebecca-hembree-aG8zqk5zklU-unsplash.jpg',
        'renden-yoder-wichGSWwxMY-unsplash.jpg',
        'sebastien-gabriel-cUKmN4dMCMk-unsplash.jpg',
        'tevin-trinh-eGxctlWZQYw-unsplash.jpg',
        'yannick-menard-uGbRqOBtoiU-unsplash.jpg'
      ].map(img => `/Pictures/${img}`)
    };
  },
  methods: {
    getBackgroundPath(bgName) {
      if (bgName === 'default') return '';
      return `/backgrounds/${bgName}.jpg`;
    },
    getBackgroundName(bgName) {
      if (bgName === 'default') return 'Default';
      return bgName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    },
    getImageName(imgPath) {
      // Extract filename without extension
      const filename = imgPath.split('/').pop().split('.')[0];
      // Replace dashes and underscores with spaces
      return filename
        .replace(/[-_]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    },
    selectBackground(bg) {
      this.selectedBackground = bg;
      this.customBackground = '';
    },
    useCustomBackground() {
      if (this.customBackground) {
        this.$emit('background-selected', this.customBackground);
        this.closeModal();
      }
    },
    applyBackground() {
      if (this.selectedBackground === 'default') {
        this.$emit('background-selected', '');
      } else {
        this.$emit('background-selected', this.getBackgroundPath(this.selectedBackground));
      }
      this.closeModal();
    },
    clearBackground() {
      this.$emit('background-selected', '');
      this.closeModal();
    },
    closeModal() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: none;
}

.modal-dialog {
  margin: 0;
  max-width: 90%;
  width: 100%;
  max-width: 800px;
  z-index: 10000;
  transform: none !important;
}

.modal-content {
  border: none;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  transform: translateZ(0);
  backface-visibility: hidden;
  -webkit-font-smoothing: subpixel-antialiased;
}

.modal-body {
  max-height: 70vh;
  overflow-y: auto;
  padding: 1.5rem;
}

/* Remove any transform/transition that might cause blur */
.modal {
  transform: none !important;
}

/* Ensure the modal is properly positioned */
.modal.show {
  display: flex !important;
  align-items: center;
  justify-content: center;
}

/* Fix for Bootstrap modal backdrop */
.modal-backdrop.fade {
  opacity: 0.5;
}

.modal-backdrop.show {
  opacity: 0.5;
}

/* Ensure the modal is above the backdrop */
.modal {
  z-index: 10000;
}
.background-option {
  width: 100px;
  cursor: pointer;
  margin-bottom: 10px;
  text-align: center;
  transition: all 0.2s;
  border: 2px solid transparent;
  border-radius: 8px;
  padding: 5px;
}

.background-option:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.background-option.selected {
  border-color: var(--primary);
  background-color: rgba(var(--primary-rgb), 0.1);
}

.background-preview {
  width: 100%;
  height: 60px;
  border-radius: 4px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-bottom: 5px;
  border: 1px solid #dee2e6;
}

.background-name {
  font-size: 0.75rem;
  color: var(--text-muted);
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.modal-content {
  border: none;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-header {
  border-bottom: 1px solid var(--border-color);
  background-color: var(--card-bg);
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.modal-body {
  background-color: var(--card-bg);
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  padding: 1.5rem;
}

.btn-close {
  background: transparent url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e") center/1em auto no-repeat;
  opacity: 0.5;
}

.btn-close:hover {
  opacity: 0.75;
}

.dark-theme .btn-close {
  filter: invert(1) grayscale(100%) brightness(200%);
}
</style>
