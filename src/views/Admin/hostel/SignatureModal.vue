<template>
  <div class="signature-modal-overlay" @click.self="close">
    <div class="signature-modal">
      <div class="modal-header">
        <h3>{{ modalTitle }}</h3>
        <button @click="close" class="close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="modal-body">
        <div class="signature-pad-container">
          <canvas
              ref="signatureCanvas"
              @mousedown="startDrawing"
              @mousemove="draw"
              @mouseup="stopDrawing"
              @mouseleave="stopDrawing"
              @touchstart="handleTouchStart"
              @touchmove="handleTouchMove"
              @touchend="stopDrawing"
              class="signature-canvas"
          ></canvas>
        </div>

        <div class="signature-instructions">
          <p>Please sign above using your mouse or touchscreen</p>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="clearSignature" class="btn btn-clear">
          <i class="fas fa-eraser"></i> Clear
        </button>
        <button @click="saveSignature" class="btn btn-save" :disabled="isEmpty">
          <i class="fas fa-check"></i> Save Signature
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SignatureModal',

  props: {
    signatureType: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      isDrawing: false,
      context: null,
      lastX: 0,
      lastY: 0,
      isEmpty: true
    };
  },

  computed: {
    modalTitle() {
      const titles = {
        student: "Student's Signature",
        father: "Father's Signature",
        mother: "Mother's Signature",
        local_guardian: "Local Guardian's Signature"
      };
      return titles[this.signatureType] || 'Signature';
    }
  },

  mounted() {
    this.initializeCanvas();
  },

  methods: {
    initializeCanvas() {
      const canvas = this.$refs.signatureCanvas;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      this.context = canvas.getContext('2d');
      this.context.strokeStyle = '#000';
      this.context.lineWidth = 2;
      this.context.lineCap = 'round';
      this.context.lineJoin = 'round';
    },

    startDrawing(e) {
      this.isDrawing = true;
      const rect = this.$refs.signatureCanvas.getBoundingClientRect();
      this.lastX = e.clientX - rect.left;
      this.lastY = e.clientY - rect.top;
      this.isEmpty = false;
    },

    draw(e) {
      if (!this.isDrawing) return;

      const rect = this.$refs.signatureCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      this.context.beginPath();
      this.context.moveTo(this.lastX, this.lastY);
      this.context.lineTo(x, y);
      this.context.stroke();

      this.lastX = x;
      this.lastY = y;
    },

    stopDrawing() {
      this.isDrawing = false;
    },

    handleTouchStart(e) {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = this.$refs.signatureCanvas.getBoundingClientRect();
      this.isDrawing = true;
      this.lastX = touch.clientX - rect.left;
      this.lastY = touch.clientY - rect.top;
      this.isEmpty = false;
    },

    handleTouchMove(e) {
      if (!this.isDrawing) return;
      e.preventDefault();

      const touch = e.touches[0];
      const rect = this.$refs.signatureCanvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      this.context.beginPath();
      this.context.moveTo(this.lastX, this.lastY);
      this.context.lineTo(x, y);
      this.context.stroke();

      this.lastX = x;
      this.lastY = y;
    },

    clearSignature() {
      const canvas = this.$refs.signatureCanvas;
      this.context.clearRect(0, 0, canvas.width, canvas.height);
      this.isEmpty = true;
    },

    saveSignature() {
      if (this.isEmpty) {
        this.$notify({
          title: 'Warning',
          message: 'Please provide a signature first',
          type: 'warning'
        });
        return;
      }

      const canvas = this.$refs.signatureCanvas;
      const signatureData = canvas.toDataURL('image/png');
      this.$emit('save', signatureData);
    },

    close() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.signature-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.signature-modal {
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 2px solid #6b4c7a;
  background: #f8f9fa;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  color: #333;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.3s;
}

.close-btn:hover {
  background: #e9ecef;
  color: #333;
}

.modal-body {
  padding: 25px;
}

.signature-pad-container {
  width: 100%;
  height: 250px;
  border: 3px solid #6b4c7a;
  border-radius: 8px;
  background: white;
  position: relative;
  overflow: hidden;
}

.signature-canvas {
  width: 100%;
  height: 100%;
  cursor: crosshair;
  touch-action: none;
}

.signature-instructions {
  margin-top: 15px;
  text-align: center;
}

.signature-instructions p {
  margin: 0;
  color: #666;
  font-size: 13px;
}

.modal-footer {
  padding: 20px 25px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.btn {
  padding: 10px 24px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.btn-clear {
  background: #dc3545;
  color: white;
}

.btn-clear:hover {
  background: #c82333;
}

.btn-save {
  background: #6b4c7a;
  color: white;
}

.btn-save:hover {
  background: #583a62;
}

.btn-save:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .signature-modal {
    max-width: 100%;
    margin: 0 10px;
  }

  .signature-pad-container {
    height: 200px;
  }

  .modal-footer {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>