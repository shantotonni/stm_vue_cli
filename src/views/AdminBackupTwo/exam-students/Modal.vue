<template>
  <transition name="modal-fade">
    <div class="modal-backdrop" @click.self="close">
      <div class="modal-container" @click.stop>
        <button class="modal-close" @click="close">
          <i class="icon-x"></i>
        </button>
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ModalPage',
  mounted() {
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', this.handleEscape);
  },
  beforeDestroy() {
    document.body.style.overflow = '';
    document.removeEventListener('keydown', this.handleEscape);
  },
  methods: {
    close() {
      this.$emit('close');
    },
    handleEscape(e) {
      if (e.key === 'Escape') {
        this.close();
      }
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
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: #f1f3f5;
  border-radius: 8px;
  cursor: pointer;
  font-size: 20px;
  color: #495057;
  transition: all 0.3s ease;
  z-index: 10;
}

.modal-close:hover {
  background: #e9ecef;
  color: #1a1a1a;
  transform: rotate(90deg);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter .modal-container,
.modal-fade-leave-to .modal-container {
  transform: scale(0.9) translateY(20px);
}

@keyframes modalSlideIn {
  from {
    transform: scale(0.9) translateY(20px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

/* Scrollbar styling */
.modal-container::-webkit-scrollbar {
  width: 8px;
}

.modal-container::-webkit-scrollbar-track {
  background: #f1f3f5;
  border-radius: 4px;
}

.modal-container::-webkit-scrollbar-thumb {
  background: #adb5bd;
  border-radius: 4px;
}

.modal-container::-webkit-scrollbar-thumb:hover {
  background: #868e96;
}

@media (max-width: 768px) {
  .modal-backdrop {
    padding: 0;
    align-items: flex-end;
  }

  .modal-container {
    max-width: 100%;
    max-height: 95vh;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    animation: modalSlideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes modalSlideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
}
</style>