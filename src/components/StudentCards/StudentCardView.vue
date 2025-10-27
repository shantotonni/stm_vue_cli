<template>
  <div class="student-card-view p-6">
    <loading-spinner v-if="loading" />

    <div v-else-if="card" class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <router-link
            to="/student-cards"
            class="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          <i class="fas fa-arrow-left mr-2"></i>Back to Student Cards
        </router-link>

        <div class="flex items-start justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ card.student.full_name }}</h1>
            <div class="flex items-center gap-4 text-gray-600">
              <span><i class="fas fa-id-card mr-2"></i>{{ card.student.roll_no }}</span>
              <span><i class="fas fa-graduation-cap mr-2"></i>{{ card.student.session?.session_name }}</span>
              <span><i class="fas fa-users mr-2"></i>{{ card.student.batch?.batch_name }}</span>
            </div>
          </div>

          <div class="flex gap-2">
            <router-link
                :to="`/student-cards/${card.id}/progress`"
                class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <i class="fas fa-tasks"></i>
              Track Progress
            </router-link>
            <router-link
                :to="`/student-cards/${card.id}/report`"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <i class="fas fa-file-pdf"></i>
              Generate Report
            </router-link>
          </div>
        </div>
      </div>

      <!-- Card Info Section -->
      <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 mb-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold mb-2">{{ card.card_type.card_name }}</h2>
            <p class="text-blue-100">{{ card.card_type.department.name }}</p>
            <p class="text-sm text-blue-100 mt-1">Card Number: {{ card.card_number || 'Not Assigned' }}</p>
          </div>
          <div class="text-right">
            <div class="text-4xl font-bold">{{ card.marks_percentage }}%</div>
            <div class="text-sm text-blue-100">
              {{ card.total_marks_obtained }}/{{ card.card_type.total_marks }} marks
            </div>
            <div class="mt-2">
                            <span :class="card.is_passed ? 'bg-green-500' : 'bg-red-500'" class="px-3 py-1 rounded-full text-xs font-semibold">
                                {{ card.is_passed ? 'Passed' : 'Not Passed' }}
                            </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Progress</p>
              <p class="text-2xl font-bold text-gray-900">{{ card.progress_percentage }}%</p>
              <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                    class="h-2 rounded-full bg-blue-500 transition-all"
                    :style="{ width: card.progress_percentage + '%' }"
                ></div>
              </div>
            </div>
            <i class="fas fa-chart-line text-blue-600 text-2xl"></i>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Status</p>
              <p class="text-lg font-bold text-gray-900">{{ formatStatus(card.status) }}</p>
            </div>
            <i :class="getStatusIcon(card.status)"></i>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Attendance</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ card.attendance_percentage !== null ? card.attendance_percentage + '%' : 'N/A' }}
              </p>
              <p class="text-xs text-gray-500 mt-1">{{ card.total_attendance }} classes</p>
            </div>
            <i class="fas fa-user-check text-green-600 text-2xl"></i>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Duration</p>
              <p class="text-sm font-bold text-gray-900">{{ formatDate(card.placement_start_date) }}</p>
              <p class="text-xs text-gray-500">to</p>
              <p class="text-sm font-bold text-gray-900">
                {{ card.placement_end_date ? formatDate(card.placement_end_date) : 'Ongoing' }}
              </p>
            </div>
            <i class="fas fa-calendar text-purple-600 text-2xl"></i>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Progress Overview -->
          <div class="bg-white rounded-lg shadow">
            <div class="p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <i class="fas fa-tasks text-blue-600"></i>
                Structure Progress
              </h2>

              <div v-if="card.structure_progress && card.structure_progress.length > 0" class="space-y-3">
                <div
                    v-for="progress in card.structure_progress.slice(0, 10)"
                    :key="progress.id"
                    class="border-l-4 pl-4 py-2"
                    :class="progress.is_completed ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <div class="flex items-center gap-2">
                        <i
                            :class="progress.is_completed ? 'fas fa-check-circle text-green-600' : 'far fa-circle text-gray-400'"
                        ></i>
                        <span class="font-medium text-gray-900">
                                                    {{ progress.structure_level.title }}
                                                </span>
                      </div>
                      <div class="text-xs text-gray-500 mt-1 ml-6">
                                                <span v-if="progress.date_of_beginning">
                                                    Started: {{ formatDate(progress.date_of_beginning) }}
                                                </span>
                        <span v-if="progress.date_of_examination" class="ml-3">
                                                    Examined: {{ formatDate(progress.date_of_examination) }}
                                                </span>
                        <span v-if="progress.lecturer" class="ml-3">
                                                    By: {{ progress.lecturer.full_name }}
                                                </span>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="font-semibold text-gray-900">
                        {{ progress.marks_obtained || 0 }}/{{ progress.max_marks }}
                      </div>
                      <div class="text-xs text-gray-500">
                        {{ progress.percentage }}%
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="card.structure_progress.length > 10" class="text-center pt-3">
                  <router-link
                      :to="`/student-cards/${card.id}/progress`"
                      class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View All {{ card.structure_progress.length }} Items
                    <i class="fas fa-arrow-right ml-1"></i>
                  </router-link>
                </div>
              </div>

              <div v-else class="text-center py-8 text-gray-500">
                <i class="fas fa-inbox text-4xl mb-3"></i>
                <p>No progress data available</p>
              </div>
            </div>
          </div>

          <!-- Term Exams Results -->
          <div v-if="card.card_type.has_term_exams && card.term_exam_results" class="bg-white rounded-lg shadow">
            <div class="p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <i class="fas fa-file-alt text-green-600"></i>
                Term Exam Results
              </h2>

              <div v-if="card.term_exam_results.length > 0" class="overflow-x-auto">
                <table class="min-w-full">
                  <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Term</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Marks</th>
                    <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Percentage</th>
                    <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Result</th>
                  </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                  <tr v-for="result in card.term_exam_results" :key="result.id">
                    <td class="px-4 py-3 text-sm font-medium text-gray-900">
                      {{ result.term_exam.term_name }}
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-600">
                      {{ formatDate(result.exam_date) }}
                    </td>
                    <td class="px-4 py-3 text-sm text-right font-semibold">
                      {{ result.marks_obtained }}/{{ result.term_exam.total_marks }}
                    </td>
                    <td class="px-4 py-3 text-sm text-right">
                      {{ result.percentage }}%
                    </td>
                    <td class="px-4 py-3 text-center">
                                                <span
                                                    :class="result.is_passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                                                    class="px-2 py-1 text-xs font-semibold rounded-full"
                                                >
                                                    {{ result.is_passed ? 'Passed' : 'Failed' }}
                                                </span>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>

              <div v-else class="text-center py-8 text-gray-500">
                <i class="fas fa-clipboard text-4xl mb-3"></i>
                <p>No term exam results yet</p>
              </div>
            </div>
          </div>

          <!-- Attendance Summary -->
          <div v-if="card.card_type.has_attendance && card.attendance_data" class="bg-white rounded-lg shadow">
            <div class="p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <i class="fas fa-user-check text-purple-600"></i>
                Attendance Summary
              </h2>

              <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div
                    v-for="(data, type) in card.attendance_data"
                    :key="type"
                    class="border rounded-lg p-4"
                >
                  <h3 class="text-sm font-medium text-gray-600 mb-2">{{ formatStatus(type) }}</h3>
                  <div class="flex items-baseline gap-2">
                    <span class="text-2xl font-bold text-gray-900">{{ data.attended }}</span>
                    <span class="text-sm text-gray-500">/ {{ data.held }}</span>
                  </div>
                  <div class="mt-2">
                    <div class="text-xs text-gray-600 mb-1">
                      {{ calculatePercentage(data.attended, data.held) }}%
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                          class="h-1.5 rounded-full bg-green-500"
                          :style="{ width: calculatePercentage(data.attended, data.held) + '%' }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="space-y-6">
          <!-- Resource Assignment -->
          <div class="bg-white rounded-lg shadow">
            <div class="p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Resource Assignment</h2>

              <div class="space-y-4">
                <div v-if="card.cadaver" class="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <i class="fas fa-procedures text-red-600 text-xl"></i>
                  <div>
                    <p class="text-sm font-medium text-gray-900">Cadaver</p>
                    <p class="text-xs text-gray-600">{{ card.cadaver.cadaver_number }}</p>
                    <p class="text-xs text-gray-500">{{ card.cadaver.location }}</p>
                  </div>
                </div>

                <div v-if="card.specimen" class="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <i class="fas fa-flask text-blue-600 text-xl"></i>
                  <div>
                    <p class="text-sm font-medium text-gray-900">Specimen</p>
                    <p class="text-xs text-gray-600">{{ card.specimen.specimen_number }}</p>
                    <p class="text-xs text-gray-500">{{ card.specimen.specimen_name }}</p>
                  </div>
                </div>

                <div v-if="!card.cadaver && !card.specimen" class="text-center py-4 text-gray-500">
                  <i class="fas fa-box-open text-3xl mb-2"></i>
                  <p class="text-sm">No resources assigned</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Signatures -->
          <div class="bg-white rounded-lg shadow">
            <div class="p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Signatures</h2>

              <div class="space-y-4">
                <div class="border-b pb-4">
                  <p class="text-sm font-medium text-gray-600 mb-2">Batch Teacher</p>
                  <div v-if="card.batch_teacher_signature" class="flex items-center gap-2">
                    <i class="fas fa-check-circle text-green-600"></i>
                    <div>
                      <p class="text-sm text-gray-900">Signed</p>
                      <p class="text-xs text-gray-500">
                        {{ formatDateTime(card.batch_teacher_signed_at) }}
                      </p>
                    </div>
                  </div>
                  <div v-else class="flex items-center gap-2 text-gray-400">
                    <i class="far fa-circle"></i>
                    <p class="text-sm">Not signed yet</p>
                  </div>
                </div>

                <div>
                  <p class="text-sm font-medium text-gray-600 mb-2">Head of Department</p>
                  <div v-if="card.hod_signature" class="flex items-center gap-2">
                    <i class="fas fa-check-circle text-green-600"></i>
                    <div>
                      <p class="text-sm text-gray-900">Signed</p>
                      <p class="text-xs text-gray-500">
                        {{ formatDateTime(card.hod_signed_at) }}
                      </p>
                    </div>
                  </div>
                  <div v-else class="flex items-center gap-2 text-gray-400">
                    <i class="far fa-circle"></i>
                    <p class="text-sm">Not signed yet</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Remarks -->
          <div v-if="card.overall_remarks" class="bg-white rounded-lg shadow">
            <div class="p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Overall Remarks</h2>
              <p class="text-sm text-gray-700 whitespace-pre-line">{{ card.overall_remarks }}</p>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white rounded-lg shadow">
            <div class="p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div class="space-y-2">
                <router-link
                    :to="`/student-cards/${card.id}/progress`"
                    class="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"
                >
                  <i class="fas fa-tasks text-purple-600"></i>
                  <span class="text-sm font-medium">Update Progress</span>
                </router-link>

                <router-link
                    :to="`/attendance?student_id=${card.student_id}`"
                    class="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"
                >
                  <i class="fas fa-user-check text-green-600"></i>
                  <span class="text-sm font-medium">Mark Attendance</span>
                </router-link>

                <router-link
                    :to="`/student-cards/${card.id}/report`"
                    class="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"
                >
                  <i class="fas fa-file-pdf text-red-600"></i>
                  <span class="text-sm font-medium">Print Report</span>
                </router-link>

                <button
                    @click="calculateMarks"
                    class="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50"
                >
                  <i class="fas fa-calculator text-blue-600"></i>
                  <span class="text-sm font-medium">Recalculate Marks</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Metadata -->
          <div class="bg-white rounded-lg shadow">
            <div class="p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Metadata</h2>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Created:</span>
                  <span class="font-medium">{{ formatDateTime(card.created_at) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Updated:</span>
                  <span class="font-medium">{{ formatDateTime(card.updated_at) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Academic Year:</span>
                  <span class="font-medium">{{ card.academic_year.year_name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'StudentCardView',

  data() {
    return {
      card: null,
      loading: false
    }
  },

  computed: {
    cardId() {
      return this.$route.params.id
    }
  },

  created() {
    this.loadCard()
  },

  methods: {
    ...mapActions('studentCards', ['fetchStudentCard']),

    async loadCard() {
      this.loading = true
      try {
        this.card = await this.fetchStudentCard(this.cardId)
      } catch (error) {
        this.$toast.error('Error loading student card')
        this.$router.push('/student-cards')
      } finally {
        this.loading = false
      }
    },

    async calculateMarks() {
      try {
        const response = await this.$http.post(`/student-cards/${this.cardId}/calculate-marks`)
        this.card.total_marks_obtained = response.data.data.total_marks_obtained
        this.$toast.success('Marks recalculated successfully')
      } catch (error) {
        this.$toast.error('Error calculating marks')
      }
    },

    formatStatus(status) {
      return status.split('_').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    },

    getStatusIcon(status) {
      const icons = {
        not_started: 'fas fa-clock text-gray-600 text-2xl',
        in_progress: 'fas fa-spinner text-yellow-600 text-2xl',
        completed: 'fas fa-check-circle text-green-600 text-2xl',
        failed: 'fas fa-times-circle text-red-600 text-2xl'
      }
      return icons[status] || icons.not_started
    },

    formatDate(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },

    formatDateTime(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    calculatePercentage(attended, total) {
      if (!total || total === 0) return 0
      return Math.round((attended / total) * 100)
    }
  }
}
</script>