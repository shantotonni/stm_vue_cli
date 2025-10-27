<template>
  <div class="student-card-assign p-6">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <router-link
            to="/student-cards"
            class="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          <i class="fas fa-arrow-left mr-2"></i>Back to Student Cards
        </router-link>

        <h1 class="text-3xl font-bold text-gray-900">Assign Cards to Students</h1>
        <p class="text-gray-600 mt-2">Select students and assign them to a card type</p>
      </div>

      <!-- Progress Steps -->
      <div class="bg-white rounded-lg shadow mb-6">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div
                v-for="(stepItem, index) in steps"
                :key="index"
                class="flex items-center"
                :class="{ 'flex-1': index < steps.length - 1 }"
            >
              <div class="flex flex-col items-center">
                <div
                    :class="[
                                        'w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg',
                                        step > index ? 'bg-green-500 text-white' :
                                        step === index ? 'bg-blue-600 text-white' :
                                        'bg-gray-200 text-gray-600'
                                    ]"
                >
                  <i v-if="step > index" class="fas fa-check"></i>
                  <span v-else>{{ index + 1 }}</span>
                </div>
                <span class="text-sm font-medium mt-2" :class="step >= index ? 'text-gray-900' : 'text-gray-500'">
                                    {{ stepItem }}
                                </span>
              </div>
              <div
                  v-if="index < steps.length - 1"
                  class="flex-1 h-1 mx-4"
                  :class="step > index ? 'bg-green-500' : 'bg-gray-200'"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 1: Select Card Type -->
      <div v-if="step === 0" class="bg-white rounded-lg shadow">
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-id-card text-blue-600"></i>
            Step 1: Select Card Type
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Department <span class="text-red-500">*</span>
              </label>
              <select
                  v-model="filters.department_id"
                  @change="loadCardTypes"
                  required
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Year <span class="text-red-500">*</span>
              </label>
              <select
                  v-model="filters.applicable_year"
                  @change="loadCardTypes"
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

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Academic Year <span class="text-red-500">*</span>
              </label>
              <select
                  v-model="assignment.academic_year_id"
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
          </div>

          <!-- Card Type Selection -->
          <div v-if="cardTypes.length > 0" class="space-y-3">
            <p class="text-sm font-medium text-gray-700 mb-3">Available Card Types:</p>
            <div
                v-for="cardType in cardTypes"
                :key="cardType.id"
                @click="selectCardType(cardType)"
                :class="[
                                'p-4 border-2 rounded-lg cursor-pointer transition',
                                assignment.card_type_id === cardType.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                            ]"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <h3 class="font-semibold text-gray-900">{{ cardType.card_name }}</h3>
                    <span class="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                                            {{ cardType.card_code }}
                                        </span>
                  </div>
                  <p class="text-sm text-gray-600 mb-2">{{ cardType.description }}</p>
                  <div class="flex gap-4 text-xs text-gray-500">
                    <span><i class="fas fa-calculator mr-1"></i>{{ cardType.total_marks }} marks</span>
                    <span><i class="fas fa-sitemap mr-1"></i>{{ cardType.structure_type.replace('_', ' ') }}</span>
                    <span v-if="cardType.has_term_exams">
                                            <i class="fas fa-file-alt mr-1"></i>{{ cardType.term_exam_count }} terms
                                        </span>
                    <span v-if="cardType.has_attendance">
                                            <i class="fas fa-user-check mr-1"></i>Attendance
                                        </span>
                  </div>
                </div>
                <div v-if="assignment.card_type_id === cardType.id" class="ml-4">
                  <i class="fas fa-check-circle text-blue-600 text-2xl"></i>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-12 text-gray-500">
            <i class="fas fa-inbox text-5xl mb-4"></i>
            <p>Select department and year to view available card types</p>
          </div>

          <div class="mt-6 flex justify-end">
            <button
                @click="nextStep"
                :disabled="!assignment.card_type_id || !assignment.academic_year_id"
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next: Select Students
              <i class="fas fa-arrow-right ml-2"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Step 2: Select Students -->
      <div v-if="step === 1" class="bg-white rounded-lg shadow">
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-users text-blue-600"></i>
            Step 2: Select Students
          </h2>

          <!-- Student Filters -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Session</label>
              <select
                  v-model="studentFilters.session_id"
                  @change="loadStudents"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Sessions</option>
                <option
                    v-for="session in sessions"
                    :key="session.id"
                    :value="session.id"
                >
                  {{ session.session_name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Batch</label>
              <select
                  v-model="studentFilters.batch_id"
                  @change="loadStudents"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Batches</option>
                <option
                    v-for="batch in batches"
                    :key="batch.id"
                    :value="batch.id"
                >
                  {{ batch.batch_name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                  v-model="studentFilters.search"
                  @input="loadStudents"
                  type="text"
                  placeholder="Name or Roll..."
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div class="flex items-end">
              <button
                  @click="toggleSelectAll"
                  class="w-full px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                <i :class="allSelected ? 'fas fa-check-square' : 'far fa-square'" class="mr-2"></i>
                {{ allSelected ? 'Deselect All' : 'Select All' }}
              </button>
            </div>
          </div>

          <!-- Selected Count -->
          <div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
            <div class="flex items-center gap-2">
              <i class="fas fa-info-circle text-blue-600"></i>
              <span class="text-sm font-medium text-blue-900">
                                {{ selectedStudents.length }} student(s) selected
                            </span>
            </div>
            <button
                v-if="selectedStudents.length > 0"
                @click="selectedStudents = []"
                class="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear Selection
            </button>
          </div>

          <!-- Students List -->
          <div v-if="loading" class="text-center py-8">
            <loading-spinner />
          </div>

          <div v-else-if="students.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
            <div
                v-for="student in students"
                :key="student.id"
                @click="toggleStudent(student.id)"
                :class="[
                                'p-4 border-2 rounded-lg cursor-pointer transition',
                                selectedStudents.includes(student.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                            ]"
            >
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-3">
                  <div
                      :class="[
                                            'w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white',
                                            selectedStudents.includes(student.id) ? 'bg-blue-600' : 'bg-gray-400'
                                        ]"
                  >
                    {{ getInitials(student.full_name) }}
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">{{ student.full_name }}</p>
                    <p class="text-sm text-gray-600">Roll: {{ student.roll_no }}</p>
                    <p class="text-xs text-gray-500">{{ student.session?.session_name }} • {{ student.batch?.batch_name }}</p>
                  </div>
                </div>
                <div v-if="selectedStudents.includes(student.id)">
                  <i class="fas fa-check-circle text-blue-600 text-xl"></i>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-12 text-gray-500">
            <i class="fas fa-user-slash text-5xl mb-4"></i>
            <p>No students found</p>
            <button
                @click="loadStudents"
                class="mt-4 text-blue-600 hover:text-blue-800"
            >
              Refresh List
            </button>
          </div>

          <div class="mt-6 flex items-center justify-between">
            <button
                @click="prevStep"
                class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <i class="fas fa-arrow-left mr-2"></i>
              Previous
            </button>
            <button
                @click="nextStep"
                :disabled="selectedStudents.length === 0"
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next: Assignment Details
              <i class="fas fa-arrow-right ml-2"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Step 3: Assignment Details -->
      <div v-if="step === 2" class="bg-white rounded-lg shadow">
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-cog text-blue-600"></i>
            Step 3: Assignment Details
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Placement Start Date <span class="text-red-500">*</span>
              </label>
              <input
                  v-model="assignment.placement_start_date"
                  type="date"
                  required
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Placement End Date (Optional)
              </label>
              <input
                  v-model="assignment.placement_end_date"
                  type="date"
                  :min="assignment.placement_start_date"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <!-- Summary -->
          <div class="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 class="font-semibold text-gray-900 mb-4">Assignment Summary</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600">Card Type</p>
                <p class="font-medium text-gray-900">{{ selectedCardType?.card_name }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Department</p>
                <p class="font-medium text-gray-900">{{ selectedCardType?.department.name }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Academic Year</p>
                <p class="font-medium text-gray-900">{{ selectedAcademicYear?.year_name }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Students</p>
                <p class="font-medium text-gray-900">{{ selectedStudents.length }} student(s)</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Start Date</p>
                <p class="font-medium text-gray-900">{{ formatDate(assignment.placement_start_date) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">End Date</p>
                <p class="font-medium text-gray-900">
                  {{ assignment.placement_end_date ? formatDate(assignment.placement_end_date) : 'Not set' }}
                </p>
              </div>
            </div>
          </div>

          <div class="mt-6 flex items-center justify-between">
            <button
                @click="prevStep"
                class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <i class="fas fa-arrow-left mr-2"></i>
              Previous
            </button>
            <button
                @click="submitAssignment"
                :disabled="submitting"
                class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              <loading-spinner v-if="submitting" class="w-4 h-4" />
              <i v-else class="fas fa-check"></i>
              {{ submitting ? 'Assigning...' : 'Assign Cards' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'StudentCardAssign',

  data() {
    return {
      step: 0,
      steps: ['Select Card Type', 'Select Students', 'Assignment Details'],
      loading: false,
      submitting: false,

      filters: {
        department_id: '',
        applicable_year: ''
      },

      studentFilters: {
        session_id: '',
        batch_id: '',
        search: ''
      },

      assignment: {
        card_type_id: '',
        academic_year_id: '',
        placement_start_date: '',
        placement_end_date: ''
      },

      departments: [],
      academicYears: [],
      sessions: [],
      batches: [],
      cardTypes: [],
      students: [],
      selectedStudents: []
    }
  },

  computed: {
    allSelected() {
      return this.students.length > 0 && this.selectedStudents.length === this.students.length
    },

    selectedCardType() {
      return this.cardTypes.find(c => c.id === this.assignment.card_type_id)
    },

    selectedAcademicYear() {
      return this.academicYears.find(y => y.id === this.assignment.academic_year_id)
    }
  },

  created() {
    this.loadInitialData()
  },

  methods: {
    ...mapActions('studentCards', ['bulkAssignStudents']),

    async loadInitialData() {
      try {
        // Load departments
        const deptResponse = await this.$http.get('/departments', {
          params: { per_page: 100, is_active: 1 }
        })
        this.departments = deptResponse.data.data

        // Load academic years
        const yearResponse = await this.$http.get('/academic-years')
        this.academicYears = yearResponse.data.data

        // Load sessions
        const sessionResponse = await this.$http.get('/sessions', {
          params: { per_page: 100, is_active: 1 }
        })
        this.sessions = sessionResponse.data.data

        // Load batches
        const batchResponse = await this.$http.get('/batches', {
          params: { per_page: 100, is_active: 1 }
        })
        this.batches = batchResponse.data.data

        // Set current academic year as default
        const currentYear = this.academicYears.find(y => y.is_current)
        if (currentYear) {
          this.assignment.academic_year_id = currentYear.id
        }

        // Set today as default start date
        this.assignment.placement_start_date = new Date().toISOString().split('T')[0]
      } catch (error) {
        this.$toast.error('Error loading initial data')
      }
    },

    async loadCardTypes() {
      if (!this.filters.department_id || !this.filters.applicable_year) {
        this.cardTypes = []
        return
      }

      try {
        const response = await this.$http.get('/card-types', {
          params: {
            department_id: this.filters.department_id,
            applicable_year: this.filters.applicable_year,
            is_active: 1,
            per_page: 100
          }
        })
        this.cardTypes = response.data.data
      } catch (error) {
        this.$toast.error('Error loading card types')
      }
    },

    async loadStudents() {
      this.loading = true
      try {
        const response = await this.$http.get('/students', {
          params: {
            ...this.studentFilters,
            is_active: 1,
            per_page: 100
          }
        })
        this.students = response.data.data
      } catch (error) {
        this.$toast.error('Error loading students')
      } finally {
        this.loading = false
      }
    },

    selectCardType(cardType) {
      this.assignment.card_type_id = cardType.id
    },

    toggleStudent(studentId) {
      const index = this.selectedStudents.indexOf(studentId)
      if (index > -1) {
        this.selectedStudents.splice(index, 1)
      } else {
        this.selectedStudents.push(studentId)
      }
    },

    toggleSelectAll() {
      if (this.allSelected) {
        this.selectedStudents = []
      } else {
        this.selectedStudents = this.students.map(s => s.id)
      }
    },

    nextStep() {
      if (this.step === 0) {
        if (!this.assignment.card_type_id || !this.assignment.academic_year_id) {
          this.$toast.error('Please select card type and academic year')
          return
        }
        this.loadStudents()
      } else if (this.step === 1) {
        if (this.selectedStudents.length === 0) {
          this.$toast.error('Please select at least one student')
          return
        }
      }

      this.step++
    },

    prevStep() {
      this.step--
    },

    async submitAssignment() {
      if (!this.assignment.placement_start_date) {
        this.$toast.error('Please select placement start date')
        return
      }

      this.submitting = true
      try {
        const data = {
          student_ids: this.selectedStudents,
          card_type_id: this.assignment.card_type_id,
          academic_year_id: this.assignment.academic_year_id,
          placement_start_date: this.assignment.placement_start_date,
          placement_end_date: this.assignment.placement_end_date || null
        }

        const response = await this.$http.post('/student-cards/bulk-assign', data)

        this.$toast.success(response.data.message)
        this.$router.push('/student-cards')
      } catch (error) {
        this.$toast.error(error.response?.data?.message || 'Error assigning cards')
      } finally {
        this.submitting = false
      }
    },

    getInitials(name) {
      return name
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .substring(0, 2)
    },

    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
  }
}
</script>