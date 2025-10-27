<template>
  <div class="term-exam-results p-6">
    <loading-spinner v-if="loading" />

    <div v-else-if="exam" class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-6">
        <router-link
            :to="`/term-exams/${examId}`"
            class="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          <i class="fas fa-arrow-left mr-2"></i>Back to Exam Details
        </router-link>

        <div class="flex items-start justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Manage Results</h1>
            <div class="flex items-center gap-4 text-gray-600">
              <span><i class="fas fa-file-alt mr-2"></i>{{ exam.term_name }}</span>
              <span><i class="fas fa-id-card mr-2"></i>{{ exam.card_type.card_name }}</span>
              <span><i class="fas fa-calendar mr-2"></i>{{ formatDate(exam.exam_date) }}</span>
            </div>
          </div>

          <div class="flex gap-2">
            <button
                @click="bulkEntryMode = !bulkEntryMode"
                :class="[
                                'px-4 py-2 rounded-lg flex items-center gap-2',
                                bulkEntryMode ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
                            ]"
            >
              <i class="fas fa-table"></i>
              Bulk Entry
            </button>
            <button
                @click="saveAllResults"
                :disabled="!hasChanges || saving"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <loading-spinner v-if="saving" class="w-4 h-4" />
              <i v-else class="fas fa-save"></i>
              Save All
            </button>
          </div>
        </div>
      </div>

      <!-- Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Total Students</p>
              <p class="text-2xl font-bold text-gray-900">{{ statistics.total }}</p>
            </div>
            <i class="fas fa-users text-blue-600 text-2xl"></i>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Passed</p>
              <p class="text-2xl font-bold text-green-600">{{ statistics.passed }}</p>
              <p class="text-xs text-gray-500">{{ statistics.pass_percentage }}%</p>
            </div>
            <i class="fas fa-check-circle text-green-600 text-2xl"></i>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Failed</p>
              <p class="text-2xl font-bold text-red-600">{{ statistics.failed }}</p>
              <p class="text-xs text-gray-500">{{ statistics.fail_percentage }}%</p>
            </div>
            <i class="fas fa-times-circle text-red-600 text-2xl"></i>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Average Marks</p>
              <p class="text-2xl font-bold text-purple-600">{{ statistics.average_marks }}</p>
              <p class="text-xs text-gray-500">{{ statistics.average_percentage }}%</p>
            </div>
            <i class="fas fa-chart-bar text-purple-600 text-2xl"></i>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Highest Marks</p>
              <p class="text-2xl font-bold text-yellow-600">{{ statistics.highest_marks }}</p>
              <p class="text-xs text-gray-500">Top scorer</p>
            </div>
            <i class="fas fa-trophy text-yellow-600 text-2xl"></i>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-4 mb-6">
        <div class="flex items-center gap-4">
          <select
              v-model="filterResult"
              class="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Results</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
            <option value="absent">Absent</option>
          </select>

          <input
              v-model="searchQuery"
              type="text"
              placeholder="Search student..."
              class="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
              @click="markAllAbsent"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
          >
            Mark All Absent
          </button>
        </div>
      </div>

      <!-- Results Entry -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Results Entry</h2>

          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">S/N</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll</th>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Marks Obtained</th>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Percentage</th>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Result</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Examiner</th>
                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
              <tr
                  v-for="(result, index) in filteredResults"
                  :key="result.student_card_id"
                  :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'"
              >
                <td class="px-4 py-3 text-sm text-gray-900">{{ index + 1 }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold">
                      {{ getInitials(result.student.full_name) }}
                    </div>
                    <span class="text-sm font-medium text-gray-900">{{ result.student.full_name }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-sm text-gray-900">{{ result.student.roll_no }}</td>
                <td class="px-4 py-3">
                  <input
                      v-model.number="result.marks_obtained"
                      type="number"
                      step="0.01"
                      :max="exam.total_marks"
                      min="0"
                      @input="markAsChanged(result.student_card_id)"
                      :disabled="result.is_absent"
                      class="w-24 px-2 py-1 text-center border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  />
                </td>
                <td class="px-4 py-3 text-center">
                  <span class="font-semibold">{{ calculatePercentage(result.marks_obtained, exam.total_marks) }}%</span>
                </td>
                <td class="px-4 py-3 text-center">
                                        <span
                                            v-if="!result.is_absent"
                                            :class="[
                                                'px-2 py-1 text-xs font-semibold rounded-full',
                                                result.marks_obtained >= exam.pass_marks ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            ]"
                                        >
                                            {{ result.marks_obtained >= exam.pass_marks ? 'PASS' : 'FAIL' }}
                                        </span>
                  <span v-else class="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                            ABSENT
                                        </span>
                </td>
                <td class="px-4 py-3">
                  <select
                      v-model="result.examiner_id"
                      @change="markAsChanged(result.student_card_id)"
                      class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option
                        v-for="teacher in teachers"
                        :key="teacher.id"
                        :value="teacher.id"
                    >
                      {{ teacher.full_name }}
                    </option>
                  </select>
                </td>
                <td class="px-4 py-3 text-center">
                  <label class="flex items-center justify-center gap-2 cursor-pointer">
                    <input
                        v-model="result.is_absent"
                        type="checkbox"
                        @change="toggleAbsent(result)"
                        class="w-4 h-4 text-blue-600 rounded"
                    />
                    <span class="text-sm">Absent</span>
                  </label>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TermExamResults',

  data() {
    return {
      exam: null,
      results: [],
      statistics: {
        total: 0,
        passed: 0,
        failed: 0,
        pass_percentage: 0,
        fail_percentage: 0,
        average_marks: 0,
        average_percentage: 0,
        highest_marks: 0
      },
      teachers: [],
      loading: false,
      saving: false,
      changedResults: new Set(),
      bulkEntryMode: false,
      filterResult: '',
      searchQuery: ''
    }
  },

  computed: {
    examId() {
      return this.$route.params.id
    },

    hasChanges() {
      return this.changedResults.size > 0
    },

    filteredResults() {
      let filtered = [...this.results]

      // Filter by result
      if (this.filterResult === 'passed') {
        filtered = filtered.filter(r => !r.is_absent && r.marks_obtained >= this.exam.pass_marks)
      } else if (this.filterResult === 'failed') {
        filtered = filtered.filter(r => !r.is_absent && r.marks_obtained < this.exam.pass_marks)
      } else if (this.filterResult === 'absent') {
        filtered = filtered.filter(r => r.is_absent)
      }

      // Search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(r =>
            r.student.full_name.toLowerCase().includes(query) ||
            r.student.roll_no.toLowerCase().includes(query)
        )
      }

      return filtered
    }
  },

  created() {
    this.loadData()
  },

  methods: {
    async loadData() {
      this.loading = true
      try {
        // Load exam details
        const examResponse = await this.$http.get(`/term-exams/${this.examId}`)
        this.exam = examResponse.data.data

        // Load results
        const resultsResponse = await this.$http.get(`/term-exams/${this.examId}/results`)
        this.results = resultsResponse.data.data.results
        this.statistics = resultsResponse.data.data.statistics

        // Load teachers
        const teachersResponse = await this.$http.get('/teachers', {
          params: { per_page: 100, is_active: 1 }
        })
        this.teachers = teachersResponse.data.data
      } catch (error) {
        this.$toast.error('Error loading data')
        this.$router.push('/term-exams')
      } finally {
        this.loading = false
      }
    },

    markAsChanged(studentCardId) {
      this.changedResults.add(studentCardId)
    },

    toggleAbsent(result) {
      if (result.is_absent) {
        result.marks_obtained = 0
      }
      this.markAsChanged(result.student_card_id)
    },

    markAllAbsent() {
      if (confirm('Are you sure you want to mark all students as absent?')) {
        this.results.forEach(result => {
          result.is_absent = true
          result.marks_obtained = 0
          this.markAsChanged(result.student_card_id)
        })
      }
    },

    async saveAllResults() {
      if (this.changedResults.size === 0) return

      this.saving = true
      try {
        const resultsToSave = this.results
            .filter(r => this.changedResults.has(r.student_card_id))
            .map(r => ({
              student_card_id: r.student_card_id,
              marks_obtained: r.marks_obtained,
              examiner_id: r.examiner_id,
              is_absent: r.is_absent
            }))

        await this.$http.post(`/term-exams/${this.examId}/results/bulk`, {
          results: resultsToSave
        })

        this.changedResults.clear()
        await this.loadData()
        this.$toast.success('Results saved successfully')
      } catch (error) {
        this.$toast.error('Error saving results')
      } finally {
        this.saving = false
      }
    },

    calculatePercentage(obtained, total) {
      if (!total || total === 0) return 0
      return Math.round((obtained / total) * 100)
    },

    getInitials(name) {
      if (!name) return '?'
      return name
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .substring(0, 2)
    }
  }
}
</script>