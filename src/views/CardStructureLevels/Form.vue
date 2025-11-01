<template>
  <div class="card-structure-level-form">
    <!-- Modern Header with Gradient -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-section">
          <div class="icon-wrapper">
            <i :class="isEdit ? 'fa fa-edit' : 'fa fa-plus-circle'"></i>
          </div>
          <div>
            <h1>{{ isEdit ? 'Edit' : 'Create' }} Structure Level</h1>
            <p class="subtitle">{{ isEdit ? 'Update existing' : 'Add new' }} card structure level</p>
          </div>
        </div>
        <router-link to="/card-structure-levels" class="btn-back">
          <i class="fa fa-arrow-left"></i>
          <span>Back to List</span>
        </router-link>
      </div>
    </div>

    <!-- Form Card -->
    <div class="form-card">
      <form @submit.prevent="submitForm">
        <!-- Basic Information Section -->
        <div class="form-section">
          <div class="section-header">
            <i class="fa fa-info-circle"></i>
            <h3>Basic Information</h3>
          </div>

          <div class="form-grid">
            <div class="form-field">
              <label class="field-label">
                <i class="fa fa-id-card"></i>
                Card Type <span class="required">*</span>
              </label>
              <select v-model="form.card_type_id" class="field-select" :class="{ 'error': errors.card_type_id }" required>
                <option value="">Select Card Type</option>
                <option v-for="type in cardTypes" :key="type.id" :value="type.id">
                  {{ type.card_name }}
                </option>
              </select>
              <span v-if="errors.card_type_id" class="error-message">
                <i class="fa fa-exclamation-circle"></i>
                {{ errors.card_type_id[0] }}
              </span>
            </div>

            <div class="form-field">
              <label class="field-label">
                <i class="fa fa-tag"></i>
                Level Type <span class="required">*</span>
              </label>
              <select
                  v-model="form.level_type"
                  class="field-select"
                  :class="{ 'error': errors.level_type }"
                  required
              >
                <option value="">Select Type</option>
                <option value="topic">Topic</option>
                <option value="item">Item</option>
                <option value="content">Content</option>
                <option value="sub_content">Sub Content</option>
              </select>
              <span v-if="errors.level_type" class="error-message">
                <i class="fa fa-exclamation-circle"></i>
                {{ errors.level_type[0] }}
              </span>
            </div>

            <div class="form-field">
              <label class="field-label">
                <i class="fa fa-sitemap"></i>
                Parent Level
              </label>
              <select
                  v-model="form.parent_id"
                  class="field-select"
                  :class="{ 'error': errors.parent_id }"
              >
                <option value="">None (Root Level)</option>
                <option v-for="level in parentLevels" :key="level.id" :value="level.id">
                  {{ level.title }} (Level {{ level.level_number }})
                </option>
              </select>
              <span v-if="errors.parent_id" class="error-message">
                <i class="fa fa-exclamation-circle"></i>
                {{ errors.parent_id[0] }}
              </span>
            </div>

            <div class="form-field">
              <label class="field-label">
                <i class="fa fa-hashtag"></i>
                Level Number <span class="required">*</span>
              </label>
              <input
                  v-model.number="form.level_number"
                  type="number"
                  class="field-input"
                  :class="{ 'error': errors.level_number }"
                  placeholder="Enter level number"
                  required
              />
              <span v-if="errors.level_number" class="error-message">
                <i class="fa fa-exclamation-circle"></i>
                {{ errors.level_number[0] }}
              </span>
            </div>

            <div class="form-field full-width">
              <label class="field-label">
                <i class="fa fa-heading"></i>
                Title <span class="required">*</span>
              </label>
              <input
                  v-model="form.title"
                  type="text"
                  class="field-input"
                  :class="{ 'error': errors.title }"
                  placeholder="Enter level title"
                  required
              />
              <span v-if="errors.title" class="error-message">
                <i class="fa fa-exclamation-circle"></i>
                {{ errors.title[0] }}
              </span>
            </div>

            <div class="form-field full-width">
              <label class="field-label">
                <i class="fa fa-align-left"></i>
                Description
              </label>
              <textarea
                  v-model="form.description"
                  class="field-textarea"
                  :class="{ 'error': errors.description }"
                  rows="4"
                  placeholder="Enter description (optional)"
              ></textarea>
              <span v-if="errors.description" class="error-message">
                <i class="fa fa-exclamation-circle"></i>
                {{ errors.description[0] }}
              </span>
            </div>
          </div>
        </div>

        <!-- Additional Details Section -->
        <div class="form-section">
          <div class="section-header">
            <i class="fa fa-cogs"></i>
            <h3>Additional Details</h3>
          </div>

          <div class="form-grid">
            <div class="form-field">
              <label class="field-label">
                <i class="fa fa-star"></i>
                Max Marks
              </label>
              <input
                  v-model.number="form.max_marks"
                  type="number"
                  step="0.01"
                  class="field-input"
                  :class="{ 'error': errors.max_marks }"
                  placeholder="0.00"
              />
              <span v-if="errors.max_marks" class="error-message">
                <i class="fa fa-exclamation-circle"></i>
                {{ errors.max_marks[0] }}
              </span>
            </div>

            <div class="form-field">
              <label class="field-label">
                <i class="fa fa-sort-numeric-up"></i>
                Sequence <span class="required">*</span>
              </label>
              <input
                  v-model.number="form.sequence"
                  type="number"
                  class="field-input"
                  :class="{ 'error': errors.sequence }"
                  placeholder="Enter sequence"
                  required
              />
              <span v-if="errors.sequence" class="error-message">
                <i class="fa fa-exclamation-circle"></i>
                {{ errors.sequence[0] }}
              </span>
            </div>

            <div class="form-field">
              <label class="field-label">
                <i class="fa fa-toggle-on"></i>
                Status
              </label>
              <select v-model="form.is_active" class="field-select">
                <option :value="true">Active</option>
                <option :value="false">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <router-link to="/card-structure-levels" class="btn-cancel">
            <i class="fa fa-times"></i>
            <span>Cancel</span>
          </router-link>
          <button type="submit" class="btn-submit" :disabled="submitting">
            <i :class="submitting ? 'fa fa-spinner fa-spin' : (isEdit ? 'fa fa-save' : 'fa fa-plus-circle')"></i>
            <span>{{ submitting ? 'Saving...' : (isEdit ? 'Update Level' : 'Create Level') }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import cardTypeService from '../Admin/card-type/cardTypeService';
import card from '@/plugins/card';

export default {
  name: 'CardStructureLevelForm',
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {
      form: {
        card_type_id: '',
        level_type: '',
        parent_id: '',
        level_number: 1,
        title: '',
        description: '',
        max_marks: 0,
        sequence: 1,
        is_active: true
      },
      cardTypes: [],
      parentLevels: [],
      errors: {},
      submitting: false,
      loading: false
    };
  },
  computed: {
    isEdit() {
      return !!this.id;
    }
  },
  watch: {
    'form.card_type_id': function(newVal) {
      if (newVal) {
        this.loadParentLevels(newVal);
      }
    }
  },
  mounted() {
    this.loadCardTypes();
    //alert('ok')
    if (this.isEdit) {
      this.loadLevel();
    }
  },
  methods: {
    async loadCardTypes() {
      try {
        const response = await cardTypeService.getAll({ per_page: 100, is_active: 1 });
        this.cardTypes = response.data.data || response.data;
      } catch (error) {
        console.error('Failed to load card types:', error);
        this.$root.$emit('show-notification', {
          message: 'Failed to load card types',
          type: 'danger'
        });
      }
    },

    async loadParentLevels(cardTypeId) {
      try {
        const response = await card.cardStructureLevels.getAll({
          card_type_id: cardTypeId,
          per_page: 100
        });
        this.parentLevels = response.data.data || response.data;

        // Filter out current level if editing
        if (this.isEdit) {
          this.parentLevels = this.parentLevels.filter(level => level.id !== parseInt(this.id));
        }
      } catch (error) {
        console.error('Failed to load parent levels:', error);
      }
    },

    async loadLevel() {
      this.loading = true;
      try {
        const response = await card.cardStructureLevels.getById(this.id);
        const level = response.data;

        this.form = {
          card_type_id: level.card_type_id,
          level_type: level.level_type,
          parent_id: level.parent_id || '',
          level_number: level.level_number,
          title: level.title,
          description: level.description || '',
          max_marks: level.max_marks || 0,
          sequence: level.sequence,
          is_active: level.is_active
        };

        // Load parent levels for the selected card type
        if (level.card_type_id) {
          await this.loadParentLevels(level.card_type_id);
        }
      } catch (error) {
        this.$root.$emit('show-notification', {
          message: 'Failed to load level',
          type: 'danger'
        });
        this.$router.push('/card-structure-levels');
      } finally {
        this.loading = false;
      }
    },

    async submitForm() {
      this.errors = {};
      this.submitting = true;

      try {
        if (this.isEdit) {
          await card.cardStructureLevels.update(this.id, this.form);
          this.$root.$emit('show-notification', {
            message: 'Structure level updated successfully',
            type: 'success'
          });
        } else {
          await card.cardStructureLevels.create(this.form);
          this.$root.$emit('show-notification', {
            message: 'Structure level created successfully',
            type: 'success'
          });
        }

        this.$router.push('/card-structure-levels');
      } catch (error) {
        if (error.response && error.response.status === 422) {
          this.errors = error.response.data.errors || {};
          this.$root.$emit('show-notification', {
            message: error.response.data.message || 'Validation failed',
            type: 'danger'
          });
        } else {
          this.$root.$emit('show-notification', {
            message: 'An error occurred while saving',
            type: 'danger'
          });
        }
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>

<style scoped>
/* Base Styles */
.card-structure-level-form {
  padding: 30px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Modern Header with Gradient */
.header-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  animation: slideDown 0.5s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
}

.icon-wrapper {
  width: 70px;
  height: 70px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: white;
}

.title-section h1 {
  font-size: 32px;
  color: white;
  font-weight: 700;
  margin: 0;
}

.subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 15px;
  margin: 5px 0 0 0;
}

.btn-back {
  padding: 12px 24px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-decoration: none;
}

.btn-back:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  color: #667eea;
}

/* Form Card */
.form-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  animation: fadeInUp 0.5s ease-out 0.1s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Form Sections */
.form-section {
  padding: 35px 40px;
  border-bottom: 1px solid #e2e8f0;
}

.form-section:last-of-type {
  border-bottom: none;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e2e8f0;
}

.section-header i {
  font-size: 24px;
  color: #667eea;
}

.section-header h3 {
  font-size: 20px;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25px;
}

.form-field {
  display: flex;
  flex-direction: column;
}

.form-field.full-width {
  grid-column: 1 / -1;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
}

.field-label i {
  color: #667eea;
  font-size: 14px;
}

.required {
  color: #e53e3e;
  font-weight: 700;
}

/* Form Inputs */
.field-input,
.field-select,
.field-textarea {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  color: #2d3748;
  transition: all 0.3s ease;
  background: white;
  font-family: inherit;
}

.field-input:focus,
.field-select:focus,
.field-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.field-input:hover,
.field-select:hover,
.field-textarea:hover {
  border-color: #cbd5e0;
}

.field-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 14px center;
  background-repeat: no-repeat;
  background-size: 20px;
  padding-right: 45px;
}

.field-textarea {
  resize: vertical;
  min-height: 100px;
  line-height: 1.6;
}

/* Error States */
.field-input.error,
.field-select.error,
.field-textarea.error {
  border-color: #fc8181;
  background: #fff5f5;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  color: #e53e3e;
  font-size: 13px;
  font-weight: 500;
}

.error-message i {
  font-size: 14px;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 40px;
  background: #f8fafc;
  gap: 15px;
}

.btn-cancel,
.btn-submit {
  padding: 14px 32px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn-cancel {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-cancel:hover {
  background: #cbd5e0;
  transform: translateY(-2px);
  color: #4a5568;
}

.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(102, 126, 234, 0.6);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-submit i,
.btn-cancel i {
  font-size: 16px;
}

/* Loading State */
.fa-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Placeholder Styling */
.field-input::placeholder,
.field-textarea::placeholder {
  color: #a0aec0;
}

/* Focus Visible */
.field-input:focus-visible,
.field-select:focus-visible,
.field-textarea:focus-visible {
  outline: none;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .card-structure-level-form {
    padding: 20px;
  }

  .form-section {
    padding: 25px 30px;
  }

  .form-actions {
    padding: 20px 30px;
  }
}

@media (max-width: 768px) {
  .card-structure-level-form {
    padding: 15px;
  }

  .header-section {
    padding: 20px;
  }

  .header-content {
    flex-direction: column;
    align-items: stretch;
  }

  .title-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .icon-wrapper {
    width: 60px;
    height: 60px;
    font-size: 28px;
  }

  .title-section h1 {
    font-size: 26px;
  }

  .subtitle {
    font-size: 14px;
  }

  .btn-back {
    width: 100%;
    justify-content: center;
  }

  .form-section {
    padding: 20px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .section-header i {
    font-size: 20px;
  }

  .section-header h3 {
    font-size: 18px;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .form-actions {
    flex-direction: column-reverse;
    padding: 20px;
  }

  .btn-cancel,
  .btn-submit {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .card-structure-level-form {
    padding: 10px;
  }

  .header-section {
    padding: 15px;
    border-radius: 15px;
  }

  .title-section h1 {
    font-size: 22px;
  }

  .icon-wrapper {
    width: 50px;
    height: 50px;
    font-size: 24px;
  }

  .form-section {
    padding: 15px;
  }

  .field-input,
  .field-select,
  .field-textarea {
    padding: 12px 14px;
    font-size: 14px;
  }

  .btn-cancel,
  .btn-submit {
    padding: 12px 24px;
    font-size: 15px;
  }
}

/* Nice Touches */
.form-card {
  position: relative;
  overflow: hidden;
}

.form-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

/* Smooth Transitions */
* {
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

/* Custom Scrollbar */
.field-textarea::-webkit-scrollbar {
  width: 8px;
}

.field-textarea::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.field-textarea::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 10px;
}

.field-textarea::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* Auto-fill Styling */
.field-input:-webkit-autofill,
.field-select:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 30px white inset !important;
  -webkit-text-fill-color: #2d3748 !important;
}

/* Disabled State */
.field-input:disabled,
.field-select:disabled,
.field-textarea:disabled {
  background: #f7fafc;
  color: #a0aec0;
  cursor: not-allowed;
}

/* Success State (for future use) */
.field-input.success,
.field-select.success,
.field-textarea.success {
  border-color: #48bb78;
  background: #f0fff4;
}

/* Print Styles */
@media print {
  .header-section,
  .form-actions {
    display: none;
  }

  .form-card {
    box-shadow: none;
    border: 1px solid #e2e8f0;
  }
}
</style>