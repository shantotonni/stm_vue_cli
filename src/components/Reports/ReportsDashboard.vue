<template>
  <div class="reports-dashboard p-6">
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
      <p class="text-gray-600">Comprehensive insights and data visualization</p>
    </div>

    <!-- Quick Filters -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
          <select
              v-model="filters.academic_year_id"
              @change="applyFilters"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Years</option>
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
          <label class="block text-sm font-medium text-gray-700 mb-2">Department</label>
          <select
              v-model="filters.department_id"
              @change="applyFilters"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Departments</option>
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
          <label class="block text-sm font-medium text-gray-700 mb-2">Session</label>
          <select
              v-model="filters.session_id"
              @change="applyFilters"
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

        <div class="flex items-end">
          <button
              @click="refreshData"
              class="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <i class="fas fa-sync-alt mr-2"></i>
            Refresh
          </button>
        </div>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-blue-100 text-sm">Total Students</p>
            <p class="text-4xl font-bold">{{ metrics.total_students }}</p>
          </div>
          <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <i class="fas fa-users text-3xl"></i>
          </div>
        </div>
        <div class="flex items-center text-sm">
          <i class="fas fa-arrow-up mr-2"></i>
          <span>{{ metrics.students_growth }}% from last year</span>
        </div>
      </div>

      <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-green-100 text-sm">Active Cards</p>
            <p class="text-4xl font-bold">{{ metrics.active_cards }}</p>
          </div>
          <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <i class="fas fa-id-card text-3xl"></i>
          </div>
        </div>
        <div class="flex items-center text-sm">
          <span>{{ metrics.completed_cards }} completed</span>
        </div>
      </div>

      <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-purple-100 text-sm">Avg Progress</p>
            <p class="text-4xl font-bold">{{ metrics.average_progress }}%</p>
          </div>
          <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <i class="fas fa-chart-line text-3xl"></i>
          </div>
        </div>
        <div class="flex items-center text-sm">
          <span>Overall completion rate</span>
        </div>
      </div>

      <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
        <div class="flex items-center justify-between mb-4">
          <div>
            <p class="text-orange-100 text-sm">Avg Attendance</p>
            <p class="text-4xl font-bold">{{ metrics.average_attendance }}%</p>
          </div>
          <div class="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <i class="fas fa-user-check text-3xl"></i>
          </div>
        </div>
        <div class="flex items-center text-sm">
          <span>Across all sessions</span>
        </div>
      </div>
    </div>

    <!-- Charts Row 1 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Progress Distribution -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-chart-pie text-blue-600"></i>
            Progress Distribution
          </h2>
          <canvas id="progressChart"></canvas>
        </div>
      </div>

      <!-- Attendance Trends -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-chart-line text-green-600"></i>
            Attendance Trends
          </h2>
          <canvas id="attendanceChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Charts Row 2 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Department Performance -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-chart-bar text-purple-600"></i>
            Department Performance
          </h2>
          <canvas id="departmentChart"></canvas>
        </div>
      </div>

      <!-- Term Exam Results -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-chart-area text-orange-600"></i>
            Term Exam Pass Rates
          </h2>
          <canvas id="examChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Top Performers -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Top Students -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-trophy text-yellow-500"></i>
            Top Performers
          </h2>
          <div class="space-y-3">
            <div
                v-for="(student, index) in topStudents"
                :key="student.id"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <div
                    :class="[
                                        'w-8 h-8 rounded-full flex items-center justify-center font-bold text-white',
                                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-blue-600'
                                    ]"
                >
                  {{ index + 1 }}
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ student.full_name }}</p>
                  <p class="text-sm text-gray-600">{{ student.roll_no }} • {{ student.session?.session_name }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-gray-900">{{ student.average_marks }}%</p>
                <p class="text-xs text-gray-500">Average</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activities -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-clock text-blue-600"></i>
            Recent Activities
          </h2>
          <div class="space-y-3">
            <div
                v-for="activity in recentActivities"
                :key="activity.id"
                class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
            >
              <div :class="getActivityIconClass(activity.type)">
                <i :class="getActivityIcon(activity.type)"></i>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
                <p class="text-xs text-gray-600 mt-1">{{ activity.description }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ formatDateTime(activity.created_at) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Reports -->
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <i class="fas fa-file-download text-blue-600"></i>
          Quick Reports
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
              @click="generateReport('student_progress')"
              class="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-left"
          >
            <div class="flex items-center gap-3">
              <i class="fas fa-users text-blue-600 text-2xl"></i>
              <div>
                <p class="font-semibold text-gray-900">Student Progress</p>
                <p class="text-sm text-gray-600">Detailed progress report</p>
              </div>
            </div>
          </button>

          <button
              @click="generateReport('attendance_summary')"
              class="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition text-left"
          >
            <div class="flex items-center gap-3">
              <i class="fas fa-user-check text-green-600 text-2xl"></i>
              <div>
                <p class="font-semibold text-gray-900">Attendance Summary</p>
                <p class="text-sm text-gray-600">Monthly attendance report</p>
              </div>
            </div>
          </button>

          <button
              @click="generateReport('exam_results')"
              class="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition text-left"
          >
            <div class="flex items-center gap-3">
              <i class="fas fa-file-alt text-purple-600 text-2xl"></i>
              <div>
                <p class="font-semibold text-gray-900">Exam Results</p>
                <p class="text-sm text-gray-600">Term exam analysis</p>
              </div>
            </div>
          </button>

          <button
              @click="generateReport('department_wise')"
              class="p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition text-left"
          >
            <div class="flex items-center gap-3">
              <i class="fas fa-building text-orange-600 text-2xl"></i>
              <div>
                <p class="font-semibold text-gray-900">Department Report</p>
                <p class="text-sm text-gray-600">Department-wise analysis</p>
              </div>
            </div>
          </button>

          <button
              @click="generateReport('card_completion')"
              class="p-4 border-2 border-gray-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition text-left"
          >
            <div class="flex items-center gap-3">
              <i class="fas fa-id-card text-pink-600 text-2xl"></i>
              <div>
                <p class="font-semibold text-gray-900">Card Completion</p>
                <p class="text-sm text-gray-600">Completion status report</p>
              </div>
            </div>
          </button>

          <button
              @click="generateReport('custom')"
              class="p-4 border-2 border-gray-200 rounded-lg hover:border-gray-500 hover:bg-gray-50 transition text-left"
          >
            <div class="flex items-center gap-3">
              <i class="fas fa-cog text-gray-600 text-2xl"></i>
              <div>
                <p class="font-semibold text-gray-900">Custom Report</p>
                <p class="text-sm text-gray-600">Build your own report</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'

export default {
  name: 'ReportsDashboard',

  data() {
    return {
      filters: {
        academic_year_id: '',
        department_id: '',
        session_id: ''
      },
      metrics: {
        total_students: 0,
        students_growth: 0,
        active_cards: 0,
        completed_cards: 0,
        average_progress: 0,
        average_attendance: 0
      },
      topStudents: [],
      recentActivities: [],
      departments: [],
      academicYears: [],
      sessions: [],
      charts: {
        progress: null,
        attendance: null,
        department: null,
        exam: null
      }
    }
  },

  created() {
    this.loadFilterOptions()
    this.loadDashboardData()
  },

  mounted() {
    this.initializeCharts()
  },

  beforeUnmount() {
    // Destroy charts
    Object.values(this.charts).forEach(chart => {
      if (chart) chart.destroy()
    })
  },

  methods: {
    async loadFilterOptions() {
      try {
        // Load departments
        const deptResponse = await this.$http.get('/departments', {
          params: { per_page: 100, is_active: 1 }
        })
        this.departments = deptResponse.data.data

        // Load academic years
        const yearResponse = await this.$http.get('/academic-years')
        this.academicYears = yearResponse.data.data

        // Set current year as default
        const currentYear = this.academicYears.find(y => y.is_current)
        if (currentYear) {
          this.filters.academic_year_id = currentYear.id
        }

        // Load sessions
        const sessionResponse = await this.$http.get('/sessions', {
          params: { per_page: 100, is_active: 1 }
        })
        this.sessions = sessionResponse.data.data
      } catch (error) {
        console.error('Error loading filter options:', error)
      }
    },

    async loadDashboardData() {
      try {
        const response = await this.$http.get('/reports/dashboard', {
          params: this.filters
        })

        const data = response.data.data
        this.metrics = data.metrics
        this.topStudents = data.top_students
        this.recentActivities = data.recent_activities

        // Update charts
        this.updateCharts(data.charts)
      } catch (error) {
        this.$toast.error('Error loading dashboard data')
      }
    },

    initializeCharts() {
      // Progress Distribution Chart
      const progressCtx = document.getElementById('progressChart')
      if (progressCtx) {
        this.charts.progress = new Chart(progressCtx, {
          type: 'doughnut',
          data: {
            labels: ['Not Started', 'In Progress', 'Completed'],
            datasets: [{
              data: [0, 0, 0],
              backgroundColor: ['#EF4444', '#F59E0B', '#10B981']
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                position: 'bottom'
              }
            }
          }
        })
      }

      // Attendance Trends Chart
      const attendanceCtx = document.getElementById('attendanceChart')
      if (attendanceCtx) {
        this.charts.attendance = new Chart(attendanceCtx, {
          type: 'line',
          data: {
            labels: [],
            datasets: [{
              label: 'Attendance %',
              data: [],
              borderColor: '#10B981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100
              }
            }
          }
        })
      }

      // Department Performance Chart
      const departmentCtx = document.getElementById('departmentChart')
      if (departmentCtx) {
        this.charts.department = new Chart(departmentCtx, {
          type: 'bar',
          data: {
            labels: [],
            datasets: [{
              label: 'Average Progress',
              data: [],
              backgroundColor: '#8B5CF6'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100
              }
            }
          }
        })
      }

      // Exam Results Chart
      const examCtx = document.getElementById('examChart')
      if (examCtx) {
        this.charts.exam = new Chart(examCtx, {
          type: 'line',
          data: {
            labels: [],
            datasets: [{
              label: 'Pass Rate %',
              data: [],
              borderColor: '#F97316',
              backgroundColor: 'rgba(249, 115, 22, 0.1)',
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                max: 100
              }
            }
          }
        })
      }
    },

    updateCharts(chartData) {
      // Update Progress Chart
      if (this.charts.progress && chartData.progress) {
        this.charts.progress.data.datasets[0].data = chartData.progress
        this.charts.progress.update()
      }

      // Update Attendance Chart
      if (this.charts.attendance && chartData.attendance) {
        this.charts.attendance.data.labels = chartData.attendance.labels
        this.charts.attendance.data.datasets[0].data = chartData.attendance.data
        this.charts.attendance.update()
      }

      // Update Department Chart
      if (this.charts.department && chartData.departments) {
        this.charts.department.data.labels = chartData.departments.labels
        this.charts.department.data.datasets[0].data = chartData.departments.data
        this.charts.department.update()
      }

      // Update Exam Chart
      if (this.charts.exam && chartData.exams) {
        this.charts.exam.data.labels = chartData.exams.labels
        this.charts.exam.data.datasets[0].data = chartData.exams.data
        this.charts.exam.update()
      }
    },

    applyFilters() {
      this.loadDashboardData()
    },

    refreshData() {
      this.loadDashboardData()
      this.$toast.success('Data refreshed')
    },

    async generateReport(type) {
      try {
        this.$toast.info(`Generating ${type.replace('_', ' ')} report...`)

        const response = await this.$http.get(`/reports/generate/${type}`, {
          params: this.filters,
          responseType: 'blob'
        })

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${type}_report_${Date.now()}.pdf`)
        document.body.appendChild(link)
        link.click()
        link.remove()

        this.$toast.success('Report downloaded successfully')
      } catch (error) {
        this.$toast.error('Error generating report')
      }
    },

    getActivityIcon(type) {
      const icons = {
        card_assigned: 'fas fa-id-card',
        progress_updated: 'fas fa-tasks',
        attendance_marked: 'fas fa-user-check',
        exam_completed: 'fas fa-file-alt',
        result_published: 'fas fa-chart-bar'
      }
      return icons[type] || 'fas fa-circle'
    },

    getActivityIconClass(type) {
      const classes = {
        card_assigned: 'w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center',
        progress_updated: 'w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center',
        attendance_marked: 'w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center',
        exam_completed: 'w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center',
        result_published: 'w-10 h-10 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center'
      }
      return classes[type] || 'w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center'
    },

    formatDateTime(dateString) {
      if (!dateString) return '-'
      const date = new Date(dateString)
      const now = new Date()
      const diffMs = now - date
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)

      if (diffMins < 1) return 'Just now'
      if (diffMins < 60) return `${diffMins}m ago`
      if (diffHours < 24) return `${diffHours}h ago`
      if (diffDays < 7) return `${diffDays}d ago`

      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    }
  }
}
</script>