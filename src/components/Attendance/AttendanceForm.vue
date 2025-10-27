<template>
  <div class="attendance-form p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <router-link
            to="/attendance"
            class="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          <i class="fas fa-arrow-left mr-2"></i>Back to Attendance
        </router-link>

        <h1 class="text-3xl font-bold text-gray-900">{{ isEditMode ? 'Edit' : 'Mark' }} Attendance</h1>
        <p class="text-gray-600 mt-2">Record student attendance for classes</p>
      </div>

      <!-- Step Progress -->
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

      <!-- Step 1: Class Information -->
      <div v-if="step === 0" class="bg-white rounded-lg shadow">
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-info-circle text-blue-600"></i>
            Step 1: Class Information
          </h2>

          <form @submit.prevent="nextStep" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Date <span class="text-red-500">*</span>
                </label>
                <input
                    v-model="form.attendance_date"
                    type="date"
                    required
                    :max="maxDate"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Class Time <span class="text-red-500">*</span>
                </label>
                <input
                    v-model="form.class_time"
                    type="time"
                    required
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Attendance Type <span class="text-red-500">*</span>
                </label>
                <select
                    v-model="form.attendance_type"
                    required
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Type</option>
                  <option value="lecture">Lecture</option>
                  <option value="practical">Practical</option>
                  <option value="tutorial">Tutorial</option>
                  <option value="clinic">Clinic</option>
                  <option value="seminar">Seminar</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Subject <span class="text-red-500">*</span>
                </label>
                <select
                    v-model="form.subject_id"
                    required
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Subject</option>
                  <option
                      v-for="subject in subjects"
                      :key="subject.id"
                      :value="subject.id"
                  >
                    {{ subject.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Teacher <span class="text-red-500">*</span>
                </label>
                <select
                    v-model="form.teacher_id"
                    required
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Teacher</option>
                  <option
                      v-for="teacher in teachers"
                      :key="teacher.id"
                      :value="teacher.id"
                  >
                    {{ teacher.full_name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <input
                    v-model.number="form.duration_minutes"
                    type="number"
                    min="15"
                    step="15"
                    placeholder="e.g., 60"
                    class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Topic / Description
              </label>
              <textarea
                  v-model="form.topic"
                  rows="3"
                  placeholder="What was covered in this class..."
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Room / Location
              </label>
              <input
                  v-model="form.room_location"
                  type="text"
                  placeholder="e.g., Lecture Hall 1, Lab 3"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div class="flex justify-end">
              <button
                  type="submit"
                  class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next: Select Students
                <i class="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          </form>
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
          <div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <span class="text-sm font-medium text-blue-900">
                            <i class="fas fa-info-circle mr-2"></i>
                            {{ selectedStudents.length }} student(s) selected
                        </span>
          </div>

          <!-- Students List -->
          <div v-if="loadingStudents" class="text-center py-8">
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
              <div class="flex items-center justify-between">
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
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Next: Mark Attendance
              <i class="fas fa-arrow-right ml-2"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Step 3: Mark Attendance -->
      <div v-if="step === 2" class="bg-white rounded-lg shadow">
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-user-check text-blue-600"></i>
            Step 3: Mark Attendance
          </h2>

          <!-- Quick Actions -->
          <div class="mb-6 flex gap-2">
            <button
                @click="markAllAs('present')"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
            >
              <i class="fas fa-check mr-2"></i>
              Mark All Present
            </button>
            <button
                @click="markAllAs('absent')"
                class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
            >
              <i class="fas fa-times mr-2"></i>
              Mark All Absent
            </button>
            <button
                @click="markAllAs('late')"
                class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm"
            >
              <i class="fas fa-clock mr-2"></i>
              Mark All Late
            </button>
          </div>

          <!-- Attendance Records -->
          <div class="space-y-2 max-h-96 overflow-y-auto">
            <div
                v-for="studentId in selectedStudents"
                :key="studentId"
                class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700">
                  {{ getInitials(getStudentById(studentId)?.full_name) }}
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ getStudentById(studentId)?.full_name }}</p>
                  <p class="text-sm text-gray-600">Roll: {{ getStudentById(studentId)?.roll_no }}</p>
                </div>
              </div>

              <div class="flex gap-2">
                <button
                    @click="setAttendance(studentId, 'present')"
                    :class="[
                                        'px-4 py-2 rounded-lg font-medium transition',
                                        attendanceRecords[studentId]?.status === 'present'
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-green-100'
                                    ]"
                >
                  <i class="fas fa-check mr-1"></i>
                  Present
                </button>
                <button
                    @click="setAttendance(studentId, 'absent')"
                    :class="[
                                        'px-4 py-2 rounded-lg font-medium transition',
                                        attendanceRecords[studentId]?.status === 'absent'
                                            ? 'bg-red-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-red-100'
                                    ]"
                >
                  <i class="fas fa-times mr-1"></i>
                  Absent
                </button>
                <button
                    @click="setAttendance(studentId, 'late')"
                    :class="[
                                        'px-4 py-2 rounded-lg font-medium transition',
                                        attendanceRecords[studentId]?.status === 'late'
                                            ? 'bg-yellow-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-yellow-100'
                                    ]"
                >
                  <i class="fas fa-clock mr-1"></i>
                  Late
                </button>
              </div>
            </div>
          </div>

          <!-- Summary -->
          <div class="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 class="font-semibold text-gray-900 mb-3">Summary</h3>
            <div class="grid grid-cols-3 gap-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-green-600">{{ countByStatus('present') }}</div>
                <div class="text-sm text-gray-600">Present</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-red-600">{{ countByStatus('absent') }}</div>
                <div class="text-sm text-gray-600">Absent</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-yellow-600">{{ countByStatus('late') }}</div>
                <div class="text-sm text-gray-600">Late</div>
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
                @click="submitAttendance"
                :disabled="submitting || !allStudentsMarked"
                class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              <loading-spinner v-if="submitting" class="w-4 h-4" />
              <i v-else class="fas fa-check"></i>
              {{ submitting ? 'Submitting...' : 'Submit Attendance' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AttendanceForm',

  data() {
    return {
      step: 0,
      steps: ['Class Info', 'Select Students', 'Mark Attendance'],
      form: {
        attendance_date: new Date().toISOString().split('T')[0],
        class_time: '',
        attendance_type: '',
        subject_id: '',
        teacher_id: '',
        duration_minutes: 60,
        topic: '',
        room_location: ''
      },
      studentFilters: {
        session_id: '',
        batch_id: '',
        search: ''
      },
      subjects: [],
      teachers: [],
      sessions: [],
      batches: [],
      students: [],
      selectedStudents: [],
      attendanceRecords: {},
      loadingStudents: false,
      submitting: false
    }
  },

  computed: {
    isEditMode() {
      return !!this.$route.params.id
    },

    maxDate() {
      return new Date().toISOString().split('T')[0]
    },

    allSelected() {
      return this.students.length > 0 && this.selectedStudents.length === this.students.length
    },

    allStudentsMarked() {
      return this.selectedStudents.every(id => this.attendanceRecords[id]?.status)
    }
  },

  created() {
    this.loadInitialData()
    if (this.isEditMode) {
      this.loadAttendanceData()
    }
  },

  methods: {
    async loadInitialData() {
      try {
        // Load subjects
        const subjectsResponse = await this.$http.get('/subjects', {
          params: { per_page: 100, is_active: 1 }
        })
        this.subjects = subjectsResponse.data.data

        // Load teachers
        const teachersResponse = await this.$http.get('/teachers', {
          params: { per_page: 100, is_active: 1 }
        })
        this.teachers = teachersResponse.data.data

        // Load sessions
        const sessionsResponse = await this.$http.get('/sessions', {
          params: { per_page: 100, is_active: 1 }
        })
        this.sessions = sessionsResponse.data.data

        // Load batches
        const batchesResponse = await this.$http.get('/batches', {
          params: { per_page: 100, is_active: 1 }
        })
        this.batches = batchesResponse.data.data
      } catch (error) {
        this.$toast.error('Error loading initial data')
      }
    },

    async loadAttendanceData() {
      try {
        const response = await this.$http.get(`/attendance/${this.$route.params.id}`)
        const data = response.data.data

        this.form = {
          attendance_date: data.attendance_date,
          class_time: data.class_time,
          attendance_type: data.attendance_type,
          subject_id: data.subject_id,
          teacher_id: data.teacher_id,
          duration_minutes: data.duration_minutes,
          topic: data.topic,
          room_location: data.room_location
        }

        // Load attendance records
        this.selectedStudents = data.records.map(r => r.student_id)
        data.records.forEach(record => {
          this.attendanceRecords[record.student_id] = {
            status: record.status,
            remarks: record.remarks
          }
        })
      } catch (error) {
        this.$toast.error('Error loading attendance data')
        this.$router.push('/attendance')
      }
    },

    async loadStudents() {
      this.loadingStudents = true
      try {
        const response = await this.$http.get('/students', {
          params: {
            ...this.studentFilters,
            is_active: 1,
            per_page: 200
          }
        })
        this.students = response.data.data
      } catch (error) {
        this.$toast.error('Error loading students')
      } finally {
        this.loadingStudents = false
      }
    },

    toggleStudent(studentId) {
      const index = this.selectedStudents.indexOf(studentId)
      if (index > -1) {
        this.selectedStudents.splice(index, 1)
        delete this.attendanceRecords[studentId]
      } else {
        this.selectedStudents.push(studentId)
        this.attendanceRecords[studentId] = { status: '', remarks: '' }
      }
    },

    toggleSelectAll() {
      if (this.allSelected) {
        this.selectedStudents = []
        this.attendanceRecords = {}
      } else {
        this.selectedStudents = this.students.map(s => s.id)
        this.students.forEach(student => {
          if (!this.attendanceRecords[student.id]) {
            this.attendanceRecords[student.id] = { status: '', remarks: '' }
          }
        })
      }
    },

    setAttendance(studentId, status) {
      if (!this.attendanceRecords[studentId]) {
        this.attendanceRecords[studentId] = { status: '', remarks: '' }
      }
      this.attendanceRecords[studentId].status = status
    },

    markAllAs(status) {
      this.selectedStudents.forEach(studentId => {
        if (!this.attendanceRecords[studentId]) {
          this.attendanceRecords[studentId] = { status: '', remarks: '' }
        }
        this.attendanceRecords[studentId].status = status
      })
    },

    countByStatus(status) {
      return Object.values(this.attendanceRecords).filter(r => r.status === status).length
    },

    getStudentById(id) {
      return this.students.find(s => s.id === id)
    },

    getInitials(name) {
      if (!name) return '?'
      return name
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .substring(0, 2)
    },

    nextStep() {
      if (this.step === 0) {
        // Validate class info
        if (!this.form.attendance_date || !this.form.attendance_type || !this.form.subject_id || !this.form.teacher_id) {
          this.$toast.error('Please fill all required fields')
          return
        }
        this.loadStudents()
      } else if (this.step === 1) {
        if (this.selectedStudents.length === 0) {
          this.$toast.error('Please select at least one student')
          return
        }
        // Initialize attendance records
        this.selectedStudents.forEach(studentId => {
          if (!this.attendanceRecords[studentId]) {
            this.attendanceRecords[studentId] = { status: '', remarks: '' }
          }
        })
      }
      this.step++
    },

    prevStep() {
      this.step--
    },

    async submitAttendance() {
      if (!this.allStudentsMarked) {
        this.$toast.error('Please mark attendance for all students')
        return
      }

      this.submitting = true
      try {
        const data = {
          ...this.form,
          records: this.selectedStudents.map(studentId => ({
            student_id: studentId,
            status: this.attendanceRecords[studentId].status,
            remarks: this.attendanceRecords[studentId].remarks
          }))
        }

        if (this.isEditMode) {
          await this.$http.put(`/attendance/${this.$route.params.id}`, data)
          this.$toast.success('Attendance updated successfully')
        } else {
          await this.$http.post('/attendance', data)
          this.$toast.success('Attendance marked successfully')
        }

        this.$router.push('/attendance')
      } catch (error) {
        this.$toast.error(error.response?.data?.message || 'Error submitting attendance')
      } finally {
        this.submitting = false
      }
    }
  }
}
</script>