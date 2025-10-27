<template>
  <div class="attendance-view p-6">
    <loading-spinner v-if="loading" />

    <div v-else-if="attendance" class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <router-link
            to="/attendance"
            class="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          <i class="fas fa-arrow-left mr-2"></i>Back to Attendance
        </router-link>

        <div class="flex items-start justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Attendance Details</h1>
            <div class="flex items-center gap-4 text-gray-600">
              <span><i class="fas fa-calendar mr-2"></i>{{ formatDate(attendance.attendance_date) }}</span>
              <span><i class="fas fa-clock mr-2"></i>{{ attendance.class_time }}</span>
              <span><i class="fas fa-book mr-2"></i>{{ attendance.subject?.name }}</span>
            </div>
          </div>

          <div class="flex gap-2">
            <router-link
                v-if="!attendance.is_finalized"
                :to="`/attendance/${attendance.id}/edit`"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <i class="fas fa-edit"></i>
              Edit
            </router-link>
            <button
                v-if="!attendance.is_finalized"
                @click="confirmFinalize"
                class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <i class="fas fa-lock"></i>
              Finalize
            </button>
            <button
                @click="printAttendance"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <i class="fas fa-print"></i>
              Print
            </button>
          </div>
        </div>
      </div>

      <!-- Status Badge -->
      <div v-if="attendance.is_finalized" class="mb-6">
        <div class="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <div class="flex items-center gap-3">
            <i class="fas fa-check-circle text-green-600 text-2xl"></i>
            <div>
              <p class="font-semibold text-green-900">Attendance Finalized</p>
              <p class="text-sm text-green-800">This attendance record has been locked and cannot be edited.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Total Students</p>
              <p class="text-2xl font-bold text-gray-900">{{ attendance.records.length }}</p>
            </div>
            <i class="fas fa-users text-blue-600 text-2xl"></i>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Present</p>
              <p class="text-2xl font-bold text-green-600">{{ presentCount }}</p>
              <p class="text-xs text-gray-500">{{ presentPercentage }}%</p>
            </div>
            <i class="fas fa-check-circle text-green-600 text-2xl"></i>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Absent</p>
              <p class="text-2xl font-bold text-red-600">{{ absentCount }}</p>
              <p class="text-xs text-gray-500">{{ absentPercentage }}%</p>
            </div>
            <i class="fas fa-times-circle text-red-600 text-2xl"></i>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Late</p>
              <p class="text-2xl font-bold text-yellow-600">{{ lateCount }}</p>
              <p class="text-xs text-gray-500">{{ latePercentage }}%</p>
            </div>
            <i class="fas fa-clock text-yellow-600 text-2xl"></i>
          </div>
        </div>
      </div>

      <!-- Class Information -->
      <div class="bg-white rounded-lg shadow mb-6">
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-info-circle text-blue-600"></i>
            Class Information
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex">
              <span class="font-medium text-gray-700 w-40">Date:</span>
              <span class="text-gray-900">{{ formatDate(attendance.attendance_date) }}</span>
            </div>
            <div class="flex">
              <span class="font-medium text-gray-700 w-40">Time:</span>
              <span class="text-gray-900">{{ attendance.class_time }}</span>
            </div>
            <div class="flex">
              <span class="font-medium text-gray-700 w-40">Type:</span>
              <span class="text-gray-900">{{ formatText(attendance.attendance_type) }}</span>
            </div>
            <div class="flex">
              <span class="font-medium text-gray-700 w-40">Duration:</span>
              <span class="text-gray-900">{{ attendance.duration_minutes }} minutes</span>
            </div>
            <div class="flex">
              <span class="font-medium text-gray-700 w-40">Subject:</span>
              <span class="text-gray-900">{{ attendance.subject?.name }}</span>
            </div>
            <div class="flex">
              <span class="font-medium text-gray-700 w-40">Teacher:</span>
              <span class="text-gray-900">{{ attendance.teacher?.full_name }}</span>
            </div>
            <div v-if="attendance.room_location" class="flex">
              <span class="font-medium text-gray-700 w-40">Location:</span>
              <span class="text-gray-900">{{ attendance.room_location }}</span>
            </div>
          </div>

          <div v-if="attendance.topic" class="mt-4 pt-4 border-t">
            <span class="font-medium text-gray-700">Topic:</span>
            <p class="text-gray-900 mt-1">{{ attendance.topic }}</p>
          </div>
        </div>
      </div>

      <!-- Attendance Records -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <i class="fas fa-list text-blue-600"></i>
              Student Records
            </h2>

            <!-- Filter -->
            <select
                v-model="statusFilter"
                class="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
            </select>
          </div>

          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  S/N
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roll Number
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Session
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remarks
                </th>
              </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
              <tr
                  v-for="(record, index) in filteredRecords"
                  :key="record.id"
                  :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ index + 1 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700 mr-3">
                      {{ getInitials(record.student.full_name) }}
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">
                        {{ record.student.full_name }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ record.student.roll_no }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ record.student.session?.session_name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                                        <span :class="getStatusClass(record.status)">
                                            {{ formatText(record.status) }}
                                        </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-900">
                  {{ record.remarks || '-' }}
                </td>
              </tr>
              </tbody>
            </table>
          </div>

          <div v-if="filteredRecords.length === 0" class="text-center py-8 text-gray-500">
            <i class="fas fa-inbox text-4xl mb-3"></i>
            <p>No records found</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirm Finalize Dialog -->
    <confirm-dialog
        :show="showFinalizeDialog"
        title="Finalize Attendance"
        message="Are you sure you want to finalize this attendance? Once finalized, it cannot be edited."
        confirm-text="Finalize"
        cancel-text="Cancel"
        variant="warning"
        @confirm="finalizeAttendance"
        @cancel="showFinalizeDialog = false"
    />
  </div>
</template>

<script>
export default {
  name: 'AttendanceView',

  data() {
    return {
      attendance: null,
      loading: false,
      statusFilter: '',
      showFinalizeDialog: false
    }
  },

  computed: {
    attendanceId() {
      return this.$route.params.id
    },

    presentCount() {
      return this.attendance?.records.filter(r => r.status === 'present').length || 0
    },

    absentCount() {
      return this.attendance?.records.filter(r => r.status === 'absent').length || 0
    },

    lateCount() {
      return this.attendance?.records.filter(r => r.status === 'late').length || 0
    },

    totalStudents() {
      return this.attendance?.records.length || 0
    },

    presentPercentage() {
      if (this.totalStudents === 0) return 0
      return Math.round((this.presentCount / this.totalStudents) * 100)
    },

    absentPercentage() {
      if (this.totalStudents === 0) return 0
      return Math.round((this.absentCount / this.totalStudents) * 100)
    },

    latePercentage() {
      if (this.totalStudents === 0) return 0
      return Math.round((this.lateCount / this.totalStudents) * 100)
    },

    filteredRecords() {
      if (!this.attendance?.records) return []
      if (!this.statusFilter) return this.attendance.records

      return this.attendance.records.filter(r => r.status === this.statusFilter)
    }
  },

  created() {
    this.loadAttendance()
  },

  methods: {
    async loadAttendance() {
      this.loading = true
      try {
        const response = await this.$http.get(`/attendance/${this.attendanceId}`)
        this.attendance = response.data.data
      } catch (error) {
        this.$toast.error('Error loading attendance')
        this.$router.push('/attendance')
      } finally {
        this.loading = false
      }
    },

    confirmFinalize() {
      this.showFinalizeDialog = true
    },

    async finalizeAttendance() {
      try {
        await this.$http.post(`/attendance/${this.attendanceId}/finalize`)
        this.$toast.success('Attendance finalized successfully')
        this.showFinalizeDialog = false
        await this.loadAttendance()
      } catch (error) {
        this.$toast.error(error.response?.data?.message || 'Error finalizing attendance')
      }
    },

    printAttendance() {
      window.print()
    },

    getStatusClass(status) {
      const classes = {
        present: 'px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800',
        absent: 'px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800',
        late: 'px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800'
      }
      return classes[status] || classes.present
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

    formatText(text) {
      if (!text) return ''
      return text.split('_').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    },

    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  }
}
</script>

<style scoped>
@media print {
  .no-print {
    display: none !important;
  }
}
</style>