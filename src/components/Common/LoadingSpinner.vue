<template>
  <div :class="containerClass">
    <div :class="spinnerClass">
      <div class="spinner-border"></div>
    </div>
    <p v-if="text" :class="textClass">{{ text }}</p>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',

  props: {
    size: {
      type: String,
      default: 'medium', // small, medium, large
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    text: {
      type: String,
      default: ''
    },
    overlay: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    containerClass() {
      return {
        'flex flex-col items-center justify-center': true,
        'fixed inset-0 bg-black bg-opacity-50 z-50': this.overlay,
        'py-4': !this.overlay
      }
    },

    spinnerClass() {
      const sizes = {
        small: 'w-6 h-6',
        medium: 'w-10 h-10',
        large: 'w-16 h-16'
      }

      return `${sizes[this.size]} relative`
    },

    textClass() {
      return {
        'mt-3 text-sm': this.size === 'small',
        'mt-4 text-base': this.size === 'medium',
        'mt-5 text-lg': this.size === 'large',
        'text-white': this.overlay,
        'text-gray-600': !this.overlay
      }
    }
  }
}
</script>

<style scoped>
.spinner-border {
  width: 100%;
  height: 100%;
  border: 3px solid rgba(59, 130, 246, 0.3);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>