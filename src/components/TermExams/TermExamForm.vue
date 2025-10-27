<template>
  <div class="term-exam-form p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <router-link
            to="/term-exams"
            class="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          <i class="fas fa-arrow-left mr-2"></i>Back to Term Exams
        </router-link>

        <h1 class="text-3xl font-bold text-gray-900">
          {{ isEditMode ? 'Edit' : 'Create' }} Term Examination
        </h1>
        <p class="text-gray-600 mt-2">Set up term examination details</p>
      </div>

      <!-- Form -->
      <div class="bg-white rounded-lg shadow">
        <form @submit.prevent="submitForm" class="p-6">
          <!-- Basic Information -->
          <div class="mb-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
              Basic Information
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Card Type <span class="text-red-500">*</span>
                </label>
                <select
                    v-model="form.card_type_id"
                    required
                    :disabled="isEditMode"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Card Type</option>
                  <option
                      v-for="cardType in cardTypes"
                      :key="cardType.id"
                      :value="cardType.id"
                  >
                    {{ cardType.card_name }}
                  </option>
                </select>
                <p class="text-xs text-gray-500 mt-1">Only card types with term exams enabled</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Academic Year <span class="text-red-500">*</span>
                </label>
                <select
                    v-model="form.academic_year_id"
                    required
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Academic Year</option>
                  <option
                      v-for="year in academicYears"
                      :key="year.id"
                      :value="year.id"
                  >
                    {{ year.year_name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Term Name <span class="text-red-500">*</span>
                </label>
                <input
                    v-model="form.term_name"
                    type="text"
                    required
                    placeholder="e.g., First Term, Mid-Term"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Term Number <span class="text-red-500">*</span>
                </label>
                <input
                    v-model.number="form.term_number"
                    type="number"
                    min="1"
                    required
                    placeholder="e.g., 1, 2, 3"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <!-- Schedule -->
          <div class="mb-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
              Schedule
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Exam Date <span class="text-red-500">*</span>
                </label>
                <input
                    v-model="form.exam_date"
                    type="date"
                    required
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Start Time <span class="text-red-500">*</span>
                </label>
                <input
                    v-model="form.start_time"
                    type="time"
                    required
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  End Time <span class="text-red-500">*</span>
                </label>
                <input
                    v-model="form.end_time"
                    type="time"
                    required
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <!-- Marks Configuration -->
          <div class="mb-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
              Marks Configuration
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Total Marks <span class="text-red-500">*</span>
                </label>
                <input
                    v-model.number="form.total_marks"
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    placeholder="e.g., 100"
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
                    min="1"
                    step="0.01"
                    required
                    :max="form.total_marks"
                    placeholder="e.g., 50"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div class="mt-4 p-3 bg-blue-50 rounded-lg">
              <p class="text-sm text-blue-800">
                <i class="fas fa-info-circle mr-2"></i>
                Pass Percentage: {{ passPercentage }}%
              </p>
            </div>
          </div>

          <!-- Additional Details -->
          <div class="mb-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
              Additional Details
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Venue / Location
                </label>
                <input
                    v-model="form.venue"
                    type="text"
                    placeholder="e.g., Examination Hall 1"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Status <span class="text-red-500">*</span>
                </label>
                <select
                    v-model="form.status"
                    required
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Description / Instructions
              </label>
              <textarea
                  v-model="form.description"
                  rows="4"
                  placeholder="Add exam instructions, syllabus coverage, or other details..."
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>

          <!-- Examiners -->
          <div class="mb-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
              Examiners
            </h2>

            <div class="space-y-3">
              <div
                  v-for="(examiner, index) in form.examiners"
                  :key="index"
                  class="flex gap-3"
              >
                <select
                    v-model="form.examiners[index]"
                    class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Examiner</option>
                  <option
                      v-for="teacher in teachers"
                      :key="teacher.id"
                      :value="teacher.id"
                  >
                    {{ teacher.full_name }}
                  </option>
                </select>
                <button
                    v-if="form.examiners.length > 1"
                    @click="removeExaminer(index)"
                    type="button"
                    class="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>

              <button
                  @click="addExaminer"
                  type="button"
                  class="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-gray-600 hover:text-blue-600"
              >
                <i class="fas fa-plus mr-2"></i>
                Add Examiner
              </button>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex items-center justify-end gap-3 pt-6 border-t">
            <router-link
                to="/term-exams"
                class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </router-link>
            <button
                type="submit"
                :disabled="submitting"
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <loading-spinner v-if="submitting" class="w-4 h-4" />
              <i v-else class="fas fa-save"></i>
              {{ submitting ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }} Exam
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TermExamForm',

  data() {
    return {
      form: {
        card_type_id: '',
        academic_year_id: '',
        term_name: '',
        term_number: 1,
        exam_date: '',
        start_time: '',
        end_time: '',
        total_marks: 100,
        pass_marks: 50,
        venue: '',
        description: '',
        status: 'scheduled',
        examiners: ['']
      },
      cardTypes: [],
      academicYears: [],
      teachers: [],
      submitting: false
    }
  },

  computed: {
    isEditMode() {
      return !!this.$route.params.id
    },

    passPercentage() {
      if (!this.form.total_marks || this.form.total_marks === 0) return 0
      return Math.round((this.form.pass_marks / this.form.total_marks) * 100)
    }
  },

  created() {
    this.loadInitialData()
    if (this.isEditMode) {
      this.loadExamData()
    }
  },

  methods: {
    async loadInitialData() {
      try {
        // Load card types with term exams
        const cardTypesResponse = await this.$http.get('/card-types', {
          params: { per_page: 100, is_active: 1, has_term_exams: 1 }
        })
        this.cardTypes = cardTypesResponse.data.data

        // Load academic years
        const yearsResponse = await this.$http.get('/academic-years')
        this.academicYears = yearsResponse.data.data

        // Set current academic year as default
        const currentYear = this.academicYears.find(y => y.is_current)
        if (currentYear && !this.isEditMode) {
          this.form.academic_year_id = currentYear.id
        }

        // Load teachers
        const teachersResponse = await this.$http.get('/teachers', {
          params: { per_page: 100, is_active: 1 }
        })
        this.teachers = teachersResponse.data.data
      } catch (error) {
        this.$toast.error('Error loading initial data')
      }
    },

    async loadExamData() {
      try {
        const response = await this.$http.get(`/term-exams/${this.$route.params.id}`)
        const data = response.data.data

        this.form = {
          card_type_id: data.card_type_id,
          academic_year_id: data.academic_year_id,
          term_name: data.term_name,
          term_number: data.term_number,
          exam_date: data.exam_date,
          start_time: data.start_time,
          end_time: data.end_time,
          total_marks: data.total_marks,
          pass_marks: data.pass_marks,
          venue: data.venue || '',
          description: data.description || '',
          status: data.status,
          examiners: data.examiners?.length > 0 ? data.examiners.map(e => e.id) : ['']
        }
      } catch (error) {
        this.$toast.error('Error loading exam data')
        this.$router.push('/term-exams')
      }
    },

    addExaminer() {
      this.form.examiners.push('')
    },

    removeExaminer(index) {
      this.form.examiners.splice(index, 1)
    },

    async submitForm() {
      // Validate
      if (this.form.pass_marks > this.form.total_marks) {
        this.$toast.error('Pass marks cannot be greater than total marks')
        return
      }

      // Filter out empty examiners
      const examiners = this.form.examiners.filter(e => e)

      const data = {
        ...this.form,
        examiner_ids: examiners
      }
      delete data.examiners

      this.submitting = true
      try {
        if (this.isEditMode) {
          await this.$http.put(`/term-exams/${this.$route.params.id}`, data)
          this.$toast.success('Term exam updated successfully')
        } else {
          await this.$http.post('/term-exams', data)
          this.$toast.success('Term exam created successfully')
        }

        this.$router.push('/term-exams')
      } catch (error) {
        this.$toast.error(error.response?.data?.message || 'Error saving term exam')
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>