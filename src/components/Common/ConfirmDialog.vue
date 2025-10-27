<template>
  <transition name="modal">
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" @click.self="cancel">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <!-- Backdrop -->
        <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="cancel"></div>

        <!-- Modal -->
        <div
            class="relative inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div class="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <!-- Icon -->
              <div
                  :class="[
                                    'flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto rounded-full sm:mx-0 sm:h-10 sm:w-10',
                                    iconClass
                                ]"
              >
                <i :class="icon" class="text-xl"></i>
              </div>

              <!-- Content -->
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                <h3 class="text-lg font-medium leading-6 text-gray-900">
                  {{ title }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    {{ message }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
            <button
                @click="confirm"
                :class="confirmButtonClass"
                class="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
            >
              {{ confirmText }}
            </button>
            <button
                @click="cancel"
                class="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              {{ cancelText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ConfirmDialog',

  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Confirm Action'
    },
    message: {
      type: String,
      default: 'Are you sure you want to proceed?'
    },
    confirmText: {
      type: String,
      default: 'Confirm'
    },
    cancelText: {
      type: String,
      default: 'Cancel'
    },
    variant: {
      type: String,
      default: 'primary', // primary, danger, warning, success
      validator: (value) => ['primary', 'danger', 'warning', 'success'].includes(value)
    }
  },

  computed: {
    icon() {
      const icons = {
        primary: 'fas fa-question-circle',
        danger: 'fas fa-exclamation-triangle',
        warning: 'fas fa-exclamation-circle',
        success: 'fas fa-check-circle'
      }
      return icons[this.variant]
    },

    iconClass() {
      const classes = {
        primary: 'bg-blue-100 text-blue-600',
        danger: 'bg-red-100 text-red-600',
        warning: 'bg-yellow-100 text-yellow-600',
        success: 'bg-green-100 text-green-600'
      }
      return classes[this.variant]
    },

    confirmButtonClass() {
      const classes = {
        primary: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
        danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
        warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
        success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
      }
      return classes[this.variant]
    }
  },

  methods: {
    confirm() {
      this.$emit('confirm')
    },

    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>