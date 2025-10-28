<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-container">
      <div class="modal-header">
        <h2>
          <i class="fas fa-vial"></i>
          {{ isEdit ? 'Edit Specimen' : 'Add New Specimen' }}
        </h2>
        <button @click="$emit('close')" class="close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <form @submit.prevent="submitForm" class="modal-body">
        <div class="form-row">
          <div class="form-group">
            <label>Specimen Number <span class="required">*</span></label>
            <input
                type="text"
                v-model="form.specimen_number"
                placeholder="Enter specimen number"
                :class="{ 'input-error': errors.specimen_number }"
            />
            <span v-if="errors.specimen_number" class="error-text">
              {{ errors.specimen_number[0] }}
            </span>
          </div>

          <div class="form-group">
            <label>Department <span class="required">*</span></label>
            <select
                v-model="form.department_id"
                :class="{ 'input-error': errors.department_id }"
            >
              <option value="">Select Department</option>
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
            <span v-if="errors.department_id" class="error-text">
              {{ errors.department_id[0] }}
            </span>
          </div>
        </div>

        <div class="form-group">
          <label>Specimen Name <span class="required">*</span></label>
          <input
              type="text"
              v-model="form.specimen_name"
              placeholder="Enter specimen name"
              :class="{ 'input-error': errors.specimen_name }"
          />
          <span v-if="errors.specimen_name" class="error-text">
            {{ errors.specimen_name[0] }}
          </span>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Specimen Type</label>
            <input
                type="text"
                v-model="form.specimen_type"
                placeholder="Enter specimen type"
            />
          </div>

          <div class="form-group">
            <label>Location</label>
            <input
                type="text"
                v-model="form.location"
                placeholder="Enter location"
            />
          </div>
        </div>

        <div class="form-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="form.is_available" />
            <span class="checkbox-text">
              <i :class="form.is_available ? 'fas fa-check-square' : 'far fa-square'"></i>
              Specimen is available
            </span>
          </label>
        </div>

        <div class="form-group">
          <label>Notes</label>
          <textarea
              v-model="form.notes"
              rows="4"
              placeholder="Add any additional notes..."
          ></textarea>
        </div>

        <div class="modal-footer">
          <button type="button" @click="$emit('close')" class="btn-secondary">
            <i class="fas fa-times"></i> Cancel
          </button>
          <button type="submit" class="btn-primary" :disabled="submitting">
            <i :class="submitting ? 'fas fa-spinner fa-spin' : 'fas fa-save'"></i>
            {{ submitting ? 'Saving...' : 'Save Specimen' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SpecimenForm',
  props: {
    specimen: {
      type: Object,
      default: null
    },
    departments: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      form: {
        specimen_number: '',
        department_id: '',
        specimen_name: '',
        specimen_type: '',
        location: '',
        is_available: true,
        notes: ''
      },
      errors: {},
      submitting: false
    };
  },
  computed: {
    isEdit() {
      return !!this.specimen;
    }
  },
  mounted() {
    if (this.specimen) {
      this.form = { ...this.specimen };
    }
  },
  methods: {
    async submitForm() {
      this.errors = {};
      this.submitting = true;

      try {
        const url = this.isEdit
            ? `/specimens/${this.specimen.id}`
            : '/specimens';

        const method = this.isEdit ? 'put' : 'post';

        const response = await this.$api[method](url, this.form);

        this.$toast.success(response.data.message);
        this.$emit('saved', response.data.specimen);
      } catch (error) {
        if (error.response && error.response.status === 422) {
          this.errors = error.response.data.errors;
        } else {
          this.$toast.error('Something went wrong!');
        }
        console.error(error);
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-container {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 1.5rem 2rem;
  border-bottom: 2px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  color: white;
  font-size: 1.1rem;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.modal-body {
  padding: 2rem;
  overflow-y: auto;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.required {
  color: #e53e3e;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.input-error {
  border-color: #e53e3e !important;
}

.error-text {
  display: block;
  color: #e53e3e;
  font-size: 0.85rem;
  margin-top: 0.4rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.checkbox-label input[type="checkbox"] {
  display: none;
}

.checkbox-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: #4a5568;
}

.checkbox-text i {
  font-size: 1.25rem;
  color: #667eea;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 2px solid #f0f0f0;
  margin-top: 1rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
  font-size: 0.95rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f7fafc;
  color: #4a5568;
  border: 2px solid #e2e8f0;
}

.btn-secondary:hover {
  background: #edf2f7;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .modal-header {
    padding: 1.25rem 1.5rem;
  }

  .modal-header h2 {
    font-size: 1.25rem;
  }
}
</style>