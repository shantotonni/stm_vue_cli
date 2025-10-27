<template>
  <div class="card-type-form p-6 max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <router-link
          to="/card-types"
          class="text-blue-600 hover:text-blue-800 mb-4 inline-block"
      >
        <i class="fas fa-arrow-left mr-2"></i>Back to Card Types
      </router-link>
      <h1 class="text-3xl font-bold text-gray-900">
        {{ isEditMode ? 'Edit' : 'Create' }} Card Type
      </h1>
      <p class="text-gray-600 mt-2">
        {{ isEditMode ? 'Update card type information' : 'Create a new card type for student records' }}
      </p>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="bg-white rounded-lg shadow">
      <div class="p-6 space-y-6">
        <!-- Basic Information -->
        <div>
          <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-info-circle text-blue-600"></i>
            Basic Information
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Department -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Department <span class="text-red-500">*</span>
              </label>
              <select
                  v-model="form.department_id"
                  required
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="{'border-red-500': errors.department_id}"
              >
                <option value="">Select Department</option>
                <option
                    v-for="dept in departments"
                    :key="dept.id"
                    :value="dept.id"
                >
                  {{ dept.name }}
                </option>
              </select>
              <p v-if="errors.department_id" class="text-red-500 text-sm mt-1">
                {{ errors.department_id[0] }}
              </p>
            </div>

            <!-- Card Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Card Name <span class="text-red-500">*</span>
              </label>
              <input
                  v-model="form.card_name"
                  type="text"
                  required
                  placeholder="e.g., Thorax Card"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="{'border-red-500': errors.card_name}"
              />
              <p v-if="errors.card_name" class="text-red-500 text-sm mt-1">
                {{ errors.card_name[0] }}
              </p>
            </div>

            <!-- Card Code -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Card Code <span class="text-red-500">*</span>
              </label>
              <input
                  v-model="form.card_code"
                  type="text"
                  required
                  placeholder="e.g., ANAT-THORAX"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="{'border-red-500': errors.card_code}"
              />
              <p v-if="errors.card_code" class="text-red-500 text-sm mt-1">
                {{ errors.card_code[0] }}
              </p>
            </div>

            <!-- Card Category -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Category <span class="text-red-500">*</span>
              </label>
              <select
                  v-model="form.card_category"
                  required
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="{'border-red-500': errors.card_category}"
              >
                <option value="">Select Category</option>
                <option value="practical">Practical</option>
                <option value="dissection">Dissection</option>
                <option value="lab">Lab</option>
                <option value="clinical">Clinical</option>
                <option value="theory">Theory</option>
                <option value="assessment">Assessment</option>
              </select>
              <p v-if="errors.card_category" class="text-red-500 text-sm mt-1">
                {{ errors.card_category[0] }}
              </p>
            </div>

            <!-- Structure Type -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Structure Type <span class="text-red-500">*</span>
              </label>
              <select
                  v-model="form.structure_type"
                  required
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="item_based">Item Based (Flat List)</option>
                <option value="topic_based">Topic Based (Hierarchical)</option>
                <option value="module_based">Module Based</option>
                <option value="hybrid">Hybrid</option>
              </select>
              <p class="text-xs text-gray-500 mt-1">
                <span v-if="form.structure_type === 'item_based'">Simple list of items (e.g., Anatomy dissection items)</span>
                <span v-else-if="form.structure_type === 'topic_based'">Topics with nested content (e.g., Community Medicine)</span>
                <span v-else-if="form.structure_type === 'module_based'">Organized in modules</span>
                <span v-else>Combination of different structures</span>
              </p>
            </div>

            <!-- Applicable Year -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Applicable Year <span class="text-red-500">*</span>
              </label>
              <select
                  v-model="form.applicable_year"
                  required
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Year</option>
                <option :value="1">1st Year</option>
                <option :value="2">2nd Year</option>
                <option :value="3">3rd Year</option>
                <option :value="4">4th Year</option>
                <option :value="5">5th Year</option>
              </select>
            </div>

            <!-- Sequence -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Display Sequence <span class="text-red-500">*</span>
              </label>
              <input
                  v-model.number="form.sequence"
                  type="number"
                  min="0"
                  required
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p class="text-xs text-gray-500 mt-1">Order in which cards appear</p>
            </div>
          </div>

          <!-- Description -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
                v-model="form.description"
                rows="3"
                placeholder="Describe the purpose and content of this card..."
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>

        <!-- Marks Configuration -->
        <div>
          <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-calculator text-green-600"></i>
            Marks Configuration
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Total Marks <span class="text-red-500">*</span>
              </label>
              <input
                  v-model.number="form.total_marks"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Pass Marks <span class="text-red-500">*</span>
              </label>
              <input
                  v-model.number="form.pass_marks"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Marking Type
              </label>
              <select
                  v-model="form.marking_type"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="item_wise">Item Wise</option>
                <option value="topic_wise">Topic Wise</option>
                <option value="cumulative">Cumulative</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Features -->
        <div>
          <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-cog text-purple-600"></i>
            Features & Requirements
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Term Exams -->
            <div class="border rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                      v-model="form.has_term_exams"
                      type="checkbox"
                      class="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span class="font-medium">Has Term Exams</span>
                </label>
              </div>
              <div v-if="form.has_term_exams" class="mt-3">
                <label class="block text-sm text-gray-700 mb-1">Number of Terms</label>
                <input
                    v-model.number="form.term_exam_count"
                    type="number"
                    min="1"
                    max="10"
                    class="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            <!-- Attendance -->
            <div class="border rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                      v-model="form.has_attendance"
                      type="checkbox"
                      class="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span class="font-medium">Track Attendance</span>
                </label>
              </div>
              <div v-if="form.has_attendance" class="mt-3 space-y-2">
                <label class="block text-sm text-gray-700">Attendance Types</label>
                <div class="space-y-1">
                  <label
                      v-for="type in attendanceTypeOptions"
                      :key="type.value"
                      class="flex items-center gap-2"
                  >
                    <input
                        v-model="form.attendance_types"
                        type="checkbox"
                        :value="type.value"
                        class="w-4 h-4 text-blue-600 rounded"
                    />
                    <span class="text-sm">{{ type.label }}</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Requirements -->
            <div class="border rounded-lg p-4">
              <h3 class="font-medium mb-3">Resource Requirements</h3>
              <div class="space-y-2">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                      v-model="form.requires_cadaver"
                      type="checkbox"
                      class="w-4 h-4 text-blue-600 rounded"
                  />
                  <span class="text-sm">Requires Cadaver</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                      v-model="form.requires_specimen"
                      type="checkbox"
                      class="w-4 h-4 text-blue-600 rounded"
                  />
                  <span class="text-sm">Requires Specimen</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                      v-model="form.requires_equipment"
                      type="checkbox"
                      class="w-4 h-4 text-blue-600 rounded"
                  />
                  <span class="text-sm">Requires Equipment</span>
                </label>
              </div>
            </div>

            <!-- Active Status -->
            <div class="border rounded-lg p-4">
              <h3 class="font-medium mb-3">Status</h3>
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                    v-model="form.is_active"
                    type="checkbox"
                    class="w-5 h-5 text-blue-600 rounded"
                />
                <span class="text-sm">Active (Available for assignment)</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="px-6 py-4 bg-gray-50 border-t flex items-center justify-between rounded-b-lg">
        <router-link
            to="/card-types"
            class="px-4 py-2 text-gray-700 hover:text-gray-900"
        >
          Cancel
        </router-link>

        <div class="flex gap-3">
          <button
              v-if="isEditMode"
              type="button"
              @click="handleReset"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Reset
          </button>
          <button
              type="submit"
              :disabled="loading"
              class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <loading-spinner v-if="loading" class="w-4 h-4" />
            <i v-else class="fas fa-save"></i>
            {{ isEditMode ? 'Update' : 'Create' }} Card Type
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'CardTypeForm',

  data() {
    return {
      form: {
        department_id: '',
        card_name: '',
        card_code: '',
        card_category: '',
        structure_type: 'item_based',
        has_term_exams: false,
        term_exam_count: 0,
        has_attendance: false,
        attendance_types: [],
        requires_cadaver: false,
        requires_specimen: false,
        requires_equipment: false,
        total_marks: 100,
        pass_marks: 50,
        marking_type: 'item_wise',
        applicable_year: '',
        description: '',
        sequence: 1,
        is_active: true
      },
      errors: {},
      loading: false,
      attendanceTypeOptions: [
        { value: 'lecture', label: 'Lecture' },
        { value: 'tutorial', label: 'Tutorial' },
        { value: 'practical', label: 'Practical' },
        { value: 'demonstration', label: 'Demonstration' },
        { value: 'integrated', label: 'Integrated Teaching' },
        { value: 'other', label: 'Other' }
      ],
      originalForm: null
    }
  },

  computed: {
    ...mapState(['departments']),

    isEditMode() {
      return !!this.$route.params.id
    },

    cardId() {
      return this.$route.params.id
    }
  },

  created() {
    this.$store.dispatch('fetchDepartments')

    if (this.isEditMode) {
      this.loadCardType()
    }
  },

  methods: {
    ...mapActions('cardTypes', ['createCardType', 'updateCardType', 'fetchCardType']),

    async loadCardType() {
      this.loading = true
      try {
        const cardType = await this.fetchCardType(this.cardId)
        this.populateForm(cardType)
        this.originalForm = { ...this.form }
      } catch (error) {
        this.$toast.error('Error loading card type')
        this.$router.push('/card-types')
      } finally {
        this.loading = false
      }
    },

    populateForm(cardType) {
      this.form = {
        department_id: cardType.department_id,
        card_name: cardType.card_name,
        card_code: cardType.card_code,
        card_category: cardType.card_category,
        structure_type: cardType.structure_type,
        has_term_exams: cardType.has_term_exams,
        term_exam_count: cardType.term_exam_count,
        has_attendance: cardType.has_attendance,
        attendance_types: cardType.attendance_types || [],
        requires_cadaver: cardType.requires_cadaver,
        requires_specimen: cardType.requires_specimen,
        requires_equipment: cardType.requires_equipment,
        total_marks: cardType.total_marks,
        pass_marks: cardType.pass_marks,
        marking_type: cardType.marking_type,
        applicable_year: cardType.applicable_year,
        description: cardType.description,
        sequence: cardType.sequence,
        is_active: cardType.is_active
      }
    },

    async handleSubmit() {
      this.errors = {}
      this.loading = true

      try {
        if (this.isEditMode) {
          await this.updateCardType({
            id: this.cardId,
            data: this.form
          })
          this.$toast.success('Card type updated successfully')
        } else {
          const response = await this.createCardType(this.form)
          this.$toast.success('Card type created successfully')

          // Redirect to structure builder
          this.$router.push(`/card-types/${response.data.id}/structure`)
          return
        }

        this.$router.push('/card-types')
      } catch (error) {
        if (error.response && error.response.status === 422) {
          this.errors = error.response.data.errors
          this.$toast.error('Please fix the form errors')
        } else {
          this.$toast.error('Error saving card type')
        }
      } finally {
        this.loading = false
      }
    },

    handleReset() {
      if (this.originalForm) {
        this.form = { ...this.originalForm }
        this.$toast.info('Form reset to original values')
      }
    }
  },

  watch: {
    'form.has_term_exams'(value) {
      if (!value) {
        this.form.term_exam_count = 0
      } else if (this.form.term_exam_count === 0) {
        this.form.term_exam_count = 2
      }
    },

    'form.has_attendance'(value) {
      if (!value) {
        this.form.attendance_types = []
      } else if (this.form.attendance_types.length === 0) {
        this.form.attendance_types = ['lecture', 'practical']
      }
    }
  }
}
</script>