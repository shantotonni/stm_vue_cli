<template>
  <div class="file-upload">
    <div
        @dragover.prevent="dragover = true"
        @dragleave.prevent="dragover = false"
        @drop.prevent="handleDrop"
        :class="[
                'border-2 border-dashed rounded-lg p-6 text-center transition',
                dragover ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400',
                disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            ]"
        @click="!disabled && $refs.fileInput.click()"
    >
      <input
          ref="fileInput"
          type="file"
          :accept="accept"
          :multiple="multiple"
          :disabled="disabled"
          @change="handleFileSelect"
          class="hidden"
      />

      <div v-if="!files.length">
        <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-3"></i>
        <p class="text-gray-700 font-medium mb-1">
          {{ dragover ? 'Drop files here' : 'Click to upload or drag and drop' }}
        </p>
        <p class="text-sm text-gray-500">
          {{ acceptText }}
        </p>
        <p v-if="maxSize" class="text-xs text-gray-400 mt-1">
          Max size: {{ formatBytes(maxSize) }}
        </p>
      </div>

      <div v-else class="space-y-2">
        <div
            v-for="(file, index) in files"
            :key="index"
            class="flex items-center justify-between p-3 bg-gray-50 rounded"
        >
          <div class="flex items-center gap-3">
            <i :class="getFileIcon(file.type)" class="text-2xl"></i>
            <div class="text-left">
              <p class="text-sm font-medium text-gray-900">{{ file.name }}</p>
              <p class="text-xs text-gray-500">{{ formatBytes(file.size) }}</p>
            </div>
          </div>
          <button
              @click.stop="removeFile(index)"
              class="text-red-600 hover:text-red-800"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>

    <p v-if="error" class="mt-2 text-sm text-red-600">
      <i class="fas fa-exclamation-circle mr-1"></i>
      {{ error }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'FileUpload',

  props: {
    accept: {
      type: String,
      default: '*'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    maxSize: {
      type: Number,
      default: null // bytes
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      files: [],
      dragover: false,
      error: ''
    }
  },

  computed: {
    acceptText() {
      if (this.accept === '*') return 'Any file type'
      if (this.accept.includes('image')) return 'Images only'
      if (this.accept.includes('pdf')) return 'PDF files only'
      if (this.accept.includes('doc')) return 'Document files only'
      return this.accept
    }
  },

  methods: {
    handleFileSelect(event) {
      this.processFiles(event.target.files)
    },

    handleDrop(event) {
      this.dragover = false
      if (!this.disabled) {
        this.processFiles(event.dataTransfer.files)
      }
    },

    processFiles(fileList) {
      this.error = ''
      const files = Array.from(fileList)

      // Validate files
      for (const file of files) {
        if (this.maxSize && file.size > this.maxSize) {
          this.error = `File "${file.name}" exceeds maximum size of ${this.formatBytes(this.maxSize)}`
          return
        }
      }

      if (this.multiple) {
        this.files = [...this.files, ...files]
      } else {
        this.files = [files[0]]
      }

      this.$emit('change', this.files)
    },

    removeFile(index) {
      this.files.splice(index, 1)
      this.$emit('change', this.files)
    },

    formatBytes(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    },

    getFileIcon(type) {
      if (type.includes('image')) return 'fas fa-file-image text-blue-600'
      if (type.includes('pdf')) return 'fas fa-file-pdf text-red-600'
      if (type.includes('word') || type.includes('document')) return 'fas fa-file-word text-blue-700'
      if (type.includes('excel') || type.includes('spreadsheet')) return 'fas fa-file-excel text-green-600'
      if (type.includes('powerpoint') || type.includes('presentation')) return 'fas fa-file-powerpoint text-orange-600'
      return 'fas fa-file text-gray-600'
    }
  }
}
</script>