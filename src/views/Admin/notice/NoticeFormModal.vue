<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-container">
      <!-- Modal Header -->
      <div class="modal-header">
        <h2 class="modal-title">
          {{ isEdit ? '✏️ Edit Notice' : '➕ Create New Notice' }}
        </h2>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>

      <!-- Modal Body -->
      <div class="modal-body">
        <form @submit.prevent="handleSubmit">
          <!-- Title -->
          <div class="form-group">
            <label class="form-label required">Notice Title</label>
            <input
                type="text"
                class="form-control"
                v-model="form.title"
                placeholder="Enter notice title..."
                required
            >
            <span v-if="errors.title" class="error-text">{{ errors.title[0] }}</span>
          </div>

          <!-- Content -->
          <div class="form-group">
            <label class="form-label required">Notice Content</label>
            <textarea
                class="form-control textarea"
                v-model="form.content"
                rows="6"
                placeholder="Enter detailed notice content..."
                required
            ></textarea>
            <span v-if="errors.content" class="error-text">{{ errors.content[0] }}</span>
            <div class="char-count">{{ form.content.length }} characters</div>
          </div>

          <!-- Two Column Layout -->
          <div class="form-row">
            <!-- Notice Type -->
            <div class="form-group">
              <label class="form-label required">Notice Type</label>
              <select class="form-control" v-model="form.notice_type" required>
                <option value="">Select Type</option>
                <option value="general">📢 General</option>
                <option value="academic">📚 Academic</option>
                <option value="exam">✍️ Exam</option>
                <option value="event">🎉 Event</option>
                <option value="urgent">🚨 Urgent</option>
              </select>
              <span v-if="errors.notice_type" class="error-text">{{ errors.notice_type[0] }}</span>
            </div>

            <!-- Target Audience -->
            <div class="form-group">
              <label class="form-label required">Target Audience</label>
              <select class="form-control" v-model="form.target_audience" required>
                <option value="">Select Audience</option>
                <option value="all">👥 All</option>
                <option value="students">🎓 Students</option>
                <option value="teachers">👨‍🏫 Teachers</option>
                <option value="department">🏛️ Department</option>
              </select>
              <span v-if="errors.target_audience" class="error-text">{{ errors.target_audience[0] }}</span>
            </div>
          </div>

          <!-- Conditional Fields -->
          <div class="form-row">
            <!-- Department (if target_audience is department) -->
            <div class="form-group" v-if="form.target_audience === 'department'">
              <label class="form-label">Department</label>
              <select class="form-control" v-model="form.department_id">
                <option value="">Select Department</option>
                <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                  {{ dept.name }}
                </option>
              </select>
            </div>

            <!-- Year (for students) -->
            <div class="form-group" v-if="form.target_audience === 'students'">
              <label class="form-label">Year</label>
              <select class="form-control" v-model="form.year">
                <option value="">All Years</option>
                <option value="1st">1st Year</option>
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
                <option value="5th">5th Year</option>
              </select>
            </div>
          </div>

          <!-- Date Fields -->
          <div class="form-row">
            <!-- Publish Date -->
            <div class="form-group">
              <label class="form-label required">Publish Date</label>
              <input
                  type="date"
                  class="form-control"
                  v-model="form.publish_date"
                  required
              >
              <span v-if="errors.publish_date" class="error-text">{{ errors.publish_date[0] }}</span>
            </div>

            <!-- Expire Date -->
            <div class="form-group">
              <label class="form-label">Expire Date (Optional)</label>
              <input
                  type="date"
                  class="form-control"
                  v-model="form.expire_date"
                  :min="form.publish_date"
              >
              <span v-if="errors.expire_date" class="error-text">{{ errors.expire_date[0] }}</span>
            </div>
          </div>

          <!-- Active Status -->
          <div class="form-group">
            <label class="checkbox-container">
              <input type="checkbox" v-model="form.is_active">
              <span class="checkbox-label">
                <strong>Active Notice</strong>
                <small>Inactive notices won't be visible to users</small>
              </span>
            </label>
          </div>

          <!-- Preview Section -->
          <div class="preview-section" v-if="form.title || form.content">
            <h4 class="preview-title">📋 Preview</h4>
            <div class="preview-card" :class="`notice-${form.notice_type}`">
              <div class="preview-header">
                <span class="preview-badge" :class="`badge-${getTypeBadgeColor(form.notice_type)}`">
                  {{ form.notice_type || 'Type' }}
                </span>
                <span class="preview-badge badge-outline">
                  {{ form.target_audience || 'Audience' }}
                </span>
              </div>
              <h3 class="preview-notice-title">{{ form.title || 'Notice Title' }}</h3>
              <p class="preview-content">{{ form.content || 'Notice content will appear here...' }}</p>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click="$emit('close')">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" :disabled="submitting">
              <span v-if="submitting" class="btn-spinner"></span>
              {{ submitting ? 'Saving...' : (isEdit ? 'Update Notice' : 'Create Notice') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoticeFormModal',
  props: {
    notice: {
      type: Object,
      default: null
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        title: '',
        content: '',
        notice_type: '',
        target_audience: '',
        department_id: null,
        year: null,
        is_active: true,
        publish_date: this.getTodayDate(),
        expire_date: null
      },
      departments: [],
      errors: {},
      submitting: false
    };
  },
  mounted() {
    this.fetchDepartments();
    if (this.isEdit && this.notice) {
      this.populateForm();
    }
  },
  methods: {
    async fetchDepartments() {
      try {
        const response = await this.$api.get('/departments');
        this.departments = response.data;
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    },

    populateForm() {
      this.form = {
        title: this.notice.title,
        content: this.notice.content,
        notice_type: this.notice.notice_type,
        target_audience: this.notice.target_audience,
        department_id: this.notice.department_id,
        year: this.notice.year,
        is_active: this.notice.is_active,
        publish_date: this.formatDateForInput(this.notice.publish_date),
        expire_date: this.formatDateForInput(this.notice.expire_date)
      };
    },

    async handleSubmit() {
      this.errors = {};
      this.submitting = true;

      try {
        const payload = { ...this.form };

        // Remove null/empty optional fields
        if (!payload.department_id) delete payload.department_id;
        if (!payload.year) delete payload.year;
        if (!payload.expire_date) delete payload.expire_date;

        let response;
        if (this.isEdit) {
          response = await this.$api.put(`/notices/${this.notice.id}`, payload);
        } else {
          response = await this.$api.post('/notices', payload);
        }

        this.$toast.success(response.data.message);
        this.$emit('saved', response.data.notice);
      } catch (error) {
        if (error.response && error.response.status === 422) {
          this.errors = error.response.data.errors;
          this.$toast.error('Please fix the validation errors');
        } else {
          console.error('Error saving notice:', error);
          this.$toast.error('Failed to save notice');
        }
      } finally {
        this.submitting = false;
      }
    },

    getTodayDate() {
      return new Date().toISOString().split('T')[0];
    },

    formatDateForInput(date) {
      if (!date) return null;
      return new Date(date).toISOString().split('T')[0];
    },

    getTypeBadgeColor(type) {
      const colors = {
        urgent: 'red',
        exam: 'orange',
        academic: 'blue',
        event: 'green',
        general: 'gray'
      };
      return colors[type] || 'gray';
    }
  }
};
</script>

<style scoped>
/* Modal Overlay */
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
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Modal Container */
.modal-container {
  background: white;
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Modal Header */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 30px;
  border-bottom: 2px solid #f1f3f5;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 24px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

/* Modal Body */
.modal-body {
  padding: 30px;
  overflow-y: auto;
  max-height: calc(90vh - 80px);
}

/* Form Styles */
.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #343a40;
  margin-bottom: 8px;
}

.form-label.required::after {
  content: '*';
  color: #ff6b6b;
  margin-left: 4px;
}

.form-control {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.3s ease;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.textarea {
  resize: vertical;
  min-height: 120px;
}

.char-count {
  font-size: 12px;
  color: #868e96;
  text-align: right;
  margin-top: 4px;
}

/* Form Row (Two Columns) */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* Error Text */
.error-text {
  color: #ff6b6b;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

.form-control:invalid,
.form-control.error {
  border-color: #ff6b6b;
}

/* Checkbox */
.checkbox-container {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: background 0.2s;
}

.checkbox-container:hover {
  background: #e9ecef;
}

.checkbox-container input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-top: 2px;
}

.checkbox-label {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.checkbox-label small {
  color: #868e96;
  font-weight: normal;
}

/* Preview Section */
.preview-section {
  margin-top: 32px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 2px dashed #dee2e6;
}

.preview-title {
  font-size: 16px;
  font-weight: 600;
  color: #495057;
  margin: 0 0 16px 0;
}

.preview-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  border-left: 4px solid #dee2e6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.notice-urgent { border-left-color: #ff6b6b; }
.notice-exam { border-left-color: #ff922b; }
.notice-academic { border-left-color: #4dabf7; }
.notice-event { border-left-color: #51cf66; }
.notice-general { border-left-color: #adb5bd; }

.preview-header {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.preview-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-red { background: #ffe0e0; color: #c92a2a; }
.badge-orange { background: #ffe8cc; color: #e8590c; }
.badge-blue { background: #e0f2ff; color: #1864ab; }
.badge-green { background: #d3f9d8; color: #2b8a3e; }
.badge-gray { background: #f1f3f5; color: #495057; }
.badge-outline {
  background: transparent;
  border: 1px solid #dee2e6;
  color: #495057;
}

.preview-notice-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.preview-content {
  font-size: 14px;
  color: #495057;
  line-height: 1.6;
  margin: 0;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 2px solid #f1f3f5;
}

.btn {
  padding: 12px 28px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f1f3f5;
  color: #495057;
}

.btn-secondary:hover {
  background: #e9ecef;
}

.btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid white;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .modal-container {
    max-width: 100%;
    margin: 0;
    border-radius: 0;
    max-height: 100vh;
  }

  .modal-body {
    padding: 20px;
    max-height: calc(100vh - 80px);
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>