<template>
  <div class="preview-modal-overlay" @click.self="close">
    <div class="preview-modal">
      <div class="modal-header">
        <h3>Application Preview</h3>
        <div class="header-actions">
          <button @click="printApplication" class="btn btn-print">
            <i class="fas fa-print"></i> Print
          </button>
          <button @click="close" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div class="modal-body">
        <div id="printable-area" class="preview-content">
          <HostelApplicationPrint :application="application" />
        </div>
      </div>

      <div class="modal-footer">
        <button @click="close" class="btn btn-secondary">
          <i class="fas fa-arrow-left"></i> Back to Edit
        </button>
        <button @click="printApplication" class="btn btn-primary">
          <i class="fas fa-print"></i> Print Application
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import HostelApplicationPrint from './HostelApplicationPrint.vue';

export default {
  name: 'PreviewModal',

  components: {
    HostelApplicationPrint
  },

  props: {
    application: {
      type: Object,
      required: true
    }
  },

  methods: {
    printApplication() {
      const printContent = document.getElementById('printable-area').innerHTML;
      const originalContent = document.body.innerHTML;

      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload(); // Reload to restore Vue app
    },

    close() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.preview-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.preview-modal {
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-bottom: 2px solid #6b4c7a;
  background: #f8f9fa;
  flex-shrink: 0;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  color: #333;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
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
  flex: 1;
  overflow-y: auto;
  padding: 25px;
  background: #f8f9fa;
}

.preview-content {
  background: white;
  padding: 40px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-footer {
  padding: 20px 25px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-shrink: 0;
}

.btn {
  padding: 12px 24px;
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

.btn-primary {
  background: #6b4c7a;
  color: white;
}

.btn-primary:hover {
  background: #583a62;
}

.btn-secondary {
  background: white;
  color: #333;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background: #f8f9fa;
}

.btn-print {
  background: #28a745;
  color: white;
}

.btn-print:hover {
  background: #218838;
}

/* Responsive */
@media (max-width: 768px) {
  .preview-modal {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }

  .preview-content {
    padding: 20px;
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