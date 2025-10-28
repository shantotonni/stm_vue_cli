<template>
  <div class="card-structure-level-form">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-md-6">
        <h2 class="fw-bold">{{ isEdit ? 'Edit' : 'Create' }} Card Structure Level</h2>
        <p class="text-muted">{{ isEdit ? 'Update' : 'Add new' }} structure level</p>
      </div>
      <div class="col-md-6 text-md-end">
        <router-link to="/card-structure-levels" class="btn btn-secondary">
          <i class="bi bi-arrow-left me-2"></i>Back to List
        </router-link>
      </div>
    </div>

    <!-- Form Card -->
    <div class="card">
      <div class="card-body">
        <form @submit.prevent="submitForm">
          <!-- Basic Information -->
          <h5 class="mb-3 pb-2 border-bottom">Basic Information</h5>

          <div class="row g-3 mb-4">
            <div class="col-md-6">
              <label class="form-label required">Card Type</label>
              <select v-model="form.card_type_id" class="form-select" :class="{ 'is-invalid': errors.card_type_id }" required>
                <option value="">Select Card Type</option>
                <!-- Dynamic options -->
              </select>
              <div v-if="errors.card_type_id" class="invalid-feedback">{{ errors.card_type_id[0] }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label required">Level Type</label>
              <select v-model="form.level_type" class="form-select" :class="{ 'is-invalid': errors.level_type }" required>
                <option value="">Select Type</option>
                <option value="topic">Topic</option>
                <option value="item">Item</option>
                <option value="content">Content</option>
                <option value="sub_content">Sub Content</option>
              </select>
              <div v-if="errors.level_type" class="invalid-feedback">{{ errors.level_type[0] }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label">Parent Level</label>
              <select v-model="form.parent_id" class="form-select" :class="{ 'is-invalid': errors.parent_id }">
                <option value="">None (Root Level)</option>
                <!-- Dynamic parent levels -->
              </select>
              <div v-if="errors.parent_id" class="invalid-feedback">{{ errors.parent_id[0] }}</div>
            </div>

            <div class="col-md-6">
              <label class="form-label required">Level Number</label>
              <input v-model.number="form.level_number" type="number" class="form-control" :class="{ 'is-invalid': errors.level_number }" required />
              <div v-if="errors.level_number" class="invalid-feedback">{{ errors.level_number[0] }}</div>
            </div>

            <div class="col-md-12">
              <label class="form-label required">Title</label>
              <input v-model="form.title" type="text" class="form-control" :class="{ 'is-invalid': errors.title }" placeholder="Enter title" required />
              <div v-if="errors.title" class="invalid-feedback">{{ errors.title[0] }}</div>
            </div>

            <div class="col-md-12">
              <label class="form-label">Description</label>
              <textarea v-model="form.description" class="form-control" :class="{ 'is-invalid': errors.description }" rows="3" placeholder="Enter description"></textarea>
              <div v-if="errors.description" class="invalid-feedback">{{ errors.description[0] }}</div>
            </div>
          </div>

          <!-- Additional Details -->
          <h5 class="mb-3 pb-2 border-bottom">Additional Details</h5>

          <div class="row g-3 mb-4">
            <div class="col-md-4">
              <label class="form-label">Max Marks</label>
              <input v-model.number="form.max_marks" type="number" step="0.01" class="form-control" :class="{ 'is-invalid': errors.max_marks }" placeholder="0.00" />
              <div v-if="errors.max_marks" class="invalid-feedback">{{ errors.max_marks[0] }}</div>
            </div>

            <div class="col-md-4">
              <label class="form-label required">Sequence</label>
              <input v-model.number="form.sequence" type="number" class="form-control" :class="{ 'is-invalid': errors.sequence }" required />
              <div v-if="errors.sequence" class="invalid-feedback">{{ errors.sequence[0] }}</div>
            </div>

            <div class="col-md-4">
              <label class="form-label">Status</label>
              <select v-model="form.is_active" class="form-select">
                <option :value="true">Active</option>
                <option :value="false">Inactive</option>
              </select>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="d-flex justify-content-between">
            <router-link to="/card-structure-levels" class="btn btn-secondary">Cancel</router-link>
            <button type="submit" class="btn btn-primary" :disabled="submitting">
              <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
              {{ isEdit ? 'Update' : 'Create' }} Level
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/plugins/card';

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
      errors: {},
      submitting: false
    };
  },
  computed: {
    isEdit() {
      return !!this.id;
    }
  },
  mounted() {
    if (this.isEdit) {
      this.loadLevel();
    }
  },
  methods: {
    async loadLevel() {
      try {
        const response = await api.cardStructureLevels.getById(this.id);
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
      } catch (error) {
        this.$root.$emit('show-notification', {
          message: 'Failed to load level',
          type: 'danger'
        });
        this.$router.push('/card-structure-levels');
      }
    },
    async submitForm() {
      this.errors = {};
      this.submitting = true;

      try {
        if (this.isEdit) {
          await api.cardStructureLevels.update(this.id, this.form);
          this.$root.$emit('show-notification', {
            message: 'Level updated successfully',
            type: 'success'
          });
        } else {
          await api.cardStructureLevels.create(this.form);
          this.$root.$emit('show-notification', {
            message: 'Level created successfully',
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
            message: 'An error occurred',
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
.required::after {
  content: ' *';
  color: red;
}
</style>