<!-- MenuFormModal.vue -->
<template>
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <div class="modal-header">
        <h3>{{ isEditing ? 'Edit Menu' : 'Create New Menu' }}</h3>
        <button @click="closeModal" class="close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <form @submit.prevent="submitForm" class="modal-form">
        <div class="form-grid">
          <!-- Menu Name -->
          <div class="form-group">
            <label for="name">Menu Name <span class="required">*</span></label>
            <input
                id="name"
                v-model="form.name"
                type="text"
                class="form-control"
                :class="{ error: errors.name }"
                placeholder="e.g. dashboard, users, students"
                required
            />
            <small class="help-text">Unique identifier for the menu (lowercase, no spaces)</small>
            <span v-if="errors.name" class="error-text">{{ errors.name[0] }}</span>
          </div>

          <!-- Menu Title -->
          <div class="form-group">
            <label for="title">Display Title <span class="required">*</span></label>
            <input
                id="title"
                v-model="form.title"
                type="text"
                class="form-control"
                :class="{ error: errors.title }"
                placeholder="e.g. Dashboard, User Management, Students"
                required
            />
            <span v-if="errors.title" class="error-text">{{ errors.title[0] }}</span>
          </div>

          <!-- Menu Icon -->
          <div class="form-group">
            <label for="icon">Icon Class</label>
            <div class="icon-input-group">
              <input
                  id="icon"
                  v-model="form.icon"
                  type="text"
                  class="form-control icon-input"
                  :class="{ error: errors.icon }"
                  placeholder="e.g. fas fa-tachometer-alt"
              />
              <div class="icon-preview">
                <i v-if="form.icon" :class="form.icon"></i>
                <span v-else class="no-icon">No Icon</span>
              </div>
            </div>
            <small class="help-text">FontAwesome icon class (optional)</small>
            <span v-if="errors.icon" class="error-text">{{ errors.icon[0] }}</span>
          </div>

          <!-- Parent Menu -->
          <div class="form-group">
            <label>Parent Menu</label>
            <select
                id="parent_id"
                v-model="form.parent_id"
                class="form-control"
                :class="{ error: errors.parent_id }"
            >
              <option value="">-- No Parent (Top Level) --</option>
              <option
                  v-for="menu in parentMenuOptions"
                  :key="menu.id"
                  :value="menu.id"
              >
                {{ menu.title }}
              </option>
            </select>
            <span v-if="errors.parent_id" class="error-text">{{ errors.parent_id[0] }}</span>
          </div>

          <!-- Route -->
          <div class="form-group">
            <label for="route">Route Path</label>
            <input
                id="route"
                v-model="form.route"
                type="text"
                class="form-control"
                :class="{ error: errors.route }"
                placeholder="e.g. /dashboard, /users, /students"
            />
            <small class="help-text">Vue router path (leave empty for parent menus)</small>
            <span v-if="errors.route" class="error-text">{{ errors.route[0] }}</span>
          </div>

          <!-- External URL -->
          <div class="form-group">
            <label for="url">External URL</label>
            <input
                id="url"
                v-model="form.url"
                type="text"
                class="form-control"
                :class="{ error: errors.url }"
                placeholder="url"
            />
            <small class="help-text">External link (use instead of route for external links)</small>
            <span v-if="errors.url" class="error-text">{{ errors.url[0] }}</span>
          </div>

          <!-- Permission -->
          <div class="form-group">
            <label>Required Permission</label>
            <select
                id="permission"
                v-model="form.permission"
                class="form-control"
                :class="{ error: errors.permission }"
            >
              <option value="">-- No Permission Required --</option>
              <optgroup
                  v-for="(groupPermissions, module) in groupedPermissions"
                  :key="module"
                  :label="module.toUpperCase()"
              >
                <option
                    v-for="permission in groupPermissions"
                    :key="permission.name"
                    :value="permission.name"
                >
                  {{ permission.display_name }}
                </option>
              </optgroup>
            </select>
            <small class="help-text">Permission needed to access this menu</small>
            <span v-if="errors.permission" class="error-text">{{ errors.permission[0] }}</span>
          </div>

          <!-- Sort Order -->
          <div class="form-group">
            <label for="sort_order">Sort Order</label>
            <input
                id="sort_order"
                v-model.number="form.sort_order"
                type="number"
                class="form-control"
                :class="{ error: errors.sort_order }"
                min="0"
                placeholder="0"
            />
            <small class="help-text">Order in which menu appears (0 = first)</small>
            <span v-if="errors.sort_order" class="error-text">{{ errors.sort_order[0] }}</span>
          </div>

          <!-- Active Status -->
          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input
                  v-model="form.is_active"
                  type="checkbox"
                  class="checkbox-input"
              />
              <span class="checkbox-custom"></span>
              <span class="checkbox-text">Menu is Active</span>
            </label>
            <small class="help-text">Unchecked menus will be hidden from navigation</small>
          </div>
        </div>

        <!-- Role Assignment Section -->
        <div class="roles-section">
          <h4><i class="fas fa-users"></i> Role Assignment</h4>
          <p class="section-description">Select which roles can access this menu</p>

          <div class="roles-grid">
            <label
                v-for="role in roles"
                :key="role.id"
                class="role-checkbox-label"
                :class="{ checked: form.role_ids.includes(role.id) }"
            >
              <input
                  v-model="form.role_ids"
                  :value="role.id"
                  type="checkbox"
                  class="role-checkbox"
              />
              <div class="role-card">
                <div class="role-icon">
                  <i class="fas fa-shield-alt"></i>
                </div>
                <div class="role-info">
                  <h5>{{ role.display_name }}</h5>
                  <p>{{ role.description }}</p>
                </div>
                <div class="role-check">
                  <i class="fas fa-check"></i>
                </div>
              </div>
            </label>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="modal-actions">
          <button type="button" @click="closeModal" class="btn btn-secondary">
            <i class="fas fa-times"></i>
            Cancel
          </button>
          <button type="submit" :disabled="loading" class="btn btn-primary">
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-save"></i>
            {{ loading ? 'Saving...' : (isEditing ? 'Update Menu' : 'Create Menu') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'MenuFormModal',
  props: {
    menu: {
      type: Object,
      default: null
    },
    menus: {
      type: Array,
      default: () => []
    },
    permissions: {
      type: Array,
      default: () => []
    },
    roles: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      loading: false,
      errors: {},
      form: {
        name: '',
        title: '',
        icon: '',
        route: '',
        url: '',
        parent_id: '',
        permission: '',
        sort_order: 0,
        is_active: true,
        role_ids: []
      }
    }
  },

  computed: {
    isEditing() {
      return !!this.menu && !!this.menu.id
    },

    parentMenuOptions() {
      // Filter out current menu and its children from parent options
      if (!this.isEditing) {
        return this.menus.filter(menu => !menu.parent_id)
      }

      return this.menus.filter(menu => {
        return !menu.parent_id && menu.id !== this.menu.id
      })
    },

    groupedPermissions() {
      const grouped = {}
      this.permissions.forEach(permission => {
        const module = permission.module || 'general'
        if (!grouped[module]) {
          grouped[module] = []
        }
        grouped[module].push(permission)
      })
      return grouped
    }
  },

  mounted() {
    this.initializeForm()
    // Focus on first input
    this.$nextTick(() => {
      const firstInput = this.$el.querySelector('input')
      if (firstInput) {
        firstInput.focus()
      }
    })
  },

  methods: {
    initializeForm() {
      if (this.isEditing) {
        // Populate form with existing menu data
        this.form = {
          name: this.menu.name || '',
          title: this.menu.title || '',
          icon: this.menu.icon || '',
          route: this.menu.route || '',
          url: this.menu.url || '',
          parent_id: this.menu.parent_id || '',
          permission: this.menu.permission || '',
          sort_order: this.menu.sort_order || 0,
          is_active: this.menu.is_active !== false,
          role_ids: this.menu.roles ? this.menu.roles.map(r => r.id) : []
        }
      } else {
        // Set default values for new menu
        this.form = {
          name: '',
          title: '',
          icon: '',
          route: '',
          url: '',
          parent_id: this.menu?.parent_id || '',
          permission: '',
          sort_order: 0,
          is_active: true,
          role_ids: []
        }
      }
    },

    async submitForm() {
      this.loading = true
      this.errors = {}

      try {
        let response

        if (this.isEditing) {
          response = await this.$api.put(`/menus/${this.menu.id}`, this.form)
        } else {
          response = await this.$api.post('/menus', this.form)
        }

        this.$emit('saved', response.data)
        this.showSuccessMessage()
        this.closeModal()

      } catch (error) {
        this.handleFormError(error)
      } finally {
        this.loading = false
      }
    },

    handleFormError(error) {
      if (error.response?.status === 422) {
        this.errors = error.response.data.errors
      } else {
        this.$toast?.error(error.response?.data?.message || 'An error occurred')
        console.error('Form submission error:', error)
      }
    },

    showSuccessMessage() {
      const message = this.isEditing
          ? 'Menu updated successfully!'
          : 'Menu created successfully!'

      this.$toast?.success(message)
    },

    closeModal() {
      this.$emit('close')
    },

    // Helper method to generate menu name from title
    generateMenuName() {
      if (this.form.title && !this.form.name) {
        this.form.name = this.form.title
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '')
      }
    }
  },

  watch: {
    // Auto-generate menu name from title
    'form.title'() {
      if (!this.isEditing) {
        this.generateMenuName()
      }
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.modal-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: background 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.modal-form {
  padding: 32px;
  overflow-y: auto;
  flex: 1;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #374151;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.required {
  color: #ef4444;
}

.form-control {
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  background: #f9fafb;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-control.error {
  border-color: #ef4444;
  background: #fef2f2;
}

.help-text {
  color: #6b7280;
  font-size: 12px;
  font-style: italic;
}

.error-text {
  color: #ef4444;
  font-size: 12px;
  font-weight: 500;
}

/* Icon Input Group */
.icon-input-group {
  display: flex;
  gap: 12px;
}

.icon-input {
  flex: 1;
}

.icon-preview {
  width: 48px;
  height: 48px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  color: #667eea;
  font-size: 18px;
}

.no-icon {
  font-size: 10px;
  color: #9ca3af;
  text-align: center;
}

/* Checkbox Styling */
.checkbox-group {
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  font-weight: 500;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
  margin-top: 2px;
}

.checkbox-input:checked + .checkbox-custom {
  background: #667eea;
  border-color: #667eea;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '✓';
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.checkbox-text {
  color: #374151;
}

/* Roles Section */
.roles-section {
  margin-bottom: 32px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.roles-section h4 {
  color: #1f2937;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.roles-section h4 i {
  color: #667eea;
}

.section-description {
  color: #6b7280;
  margin-bottom: 20px;
  font-size: 14px;
}

.roles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.role-checkbox-label {
  cursor: pointer;
}

.role-checkbox {
  display: none;
}

.role-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.2s ease;
  background: #f9fafb;
  position: relative;
}

.role-checkbox-label:hover .role-card {
  border-color: #667eea;
  background: #f0f4ff;
}

.role-checkbox-label.checked .role-card {
  border-color: #667eea;
  background: linear-gradient(135deg, #f0f4ff 0%, #e0e9ff 100%);
}

.role-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  flex-shrink: 0;
}

.role-info {
  flex: 1;
}

.role-info h5 {
  margin: 0 0 4px 0;
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
}

.role-info p {
  margin: 0;
  color: #6b7280;
  font-size: 12px;
  line-height: 1.4;
}

.role-check {
  width: 24px;
  height: 24px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.role-checkbox-label.checked .role-check {
  background: #10b981;
  border-color: #10b981;
}

/* Modal Actions */
.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 24px 32px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  font-size: 14px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f3f4f6;
  color: #4b5563;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover:not(:disabled) {
  background: #e5e7eb;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 15px -3px rgba(0, 0, 0, 0.15);
}

/* Responsive Design */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 10px;
  }

  .modal-container {
    max-height: 95vh;
  }

  .modal-header,
  .modal-form,
  .modal-actions {
    padding: 20px;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .roles-grid {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column-reverse;
  }

  .btn {
    justify-content: center;
  }
}

/* Animation */
.modal-container {
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Custom Scrollbar */
.modal-form::-webkit-scrollbar {
  width: 6px;
}

.modal-form::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.modal-form::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.modal-form::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>