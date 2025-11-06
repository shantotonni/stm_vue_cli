<template>
  <main class="admin-dashboard">
    <!-- Top Stats Overview -->
    <div class="top-stats-grid">
      <div class="stat-card gradient-blue">
        <div class="stat-icon">👥</div>
        <div class="stat-details">
          <h3>Total Students</h3>
          <div class="stat-value">{{ stats.total_students || 0 }}</div>
          <div class="stat-meta">
            <span class="badge badge-success">+{{ stats.new_students || 0 }} This Month</span>
          </div>
        </div>
      </div>

      <div class="stat-card gradient-purple">
        <div class="stat-icon">👨‍🏫</div>
        <div class="stat-details">
          <h3>Total Teachers</h3>
          <div class="stat-value">{{ stats.total_teachers || 0 }}</div>
          <div class="stat-meta">
            <span class="badge badge-info">{{ stats.active_teachers || 0 }} Active</span>
          </div>
        </div>
      </div>

      <div class="stat-card gradient-green">
        <div class="stat-icon">🏢</div>
        <div class="stat-details">
          <h3>Departments</h3>
          <div class="stat-value">{{ stats.total_departments || 0 }}</div>
          <div class="stat-meta">
            <span class="badge badge-primary">All Active</span>
          </div>
        </div>
      </div>

      <div class="stat-card gradient-orange">
        <div class="stat-icon">📊</div>
        <div class="stat-details">
          <h3>Avg Attendance</h3>
          <div class="stat-value">{{ stats.avg_attendance || 0 }}%</div>
          <div class="stat-meta">
            <span :class="stats.attendance_trend === 'up' ? 'trend-up' : 'trend-down'">
              {{ stats.attendance_trend === 'up' ? '↗' : '↘' }} {{ stats.attendance_change || 0 }}%
            </span>
          </div>
        </div>
      </div>

      <div class="stat-card gradient-red">
        <div class="stat-icon">⚠️</div>
        <div class="stat-details">
          <h3>Low Attendance</h3>
          <div class="stat-value">{{ stats.low_attendance_count || 0 }}</div>
          <div class="stat-meta">
            <span class="badge badge-danger">Below 75%</span>
          </div>
        </div>
      </div>

      <div class="stat-card gradient-teal">
        <div class="stat-icon">📚</div>
        <div class="stat-details">
          <h3>Active Courses</h3>
          <div class="stat-value">{{ stats.active_courses || 0 }}</div>
          <div class="stat-meta">
            <span class="badge badge-success">{{ stats.current_semester }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions Section -->
    <div class="section-card quick-actions-section">
      <div class="section-header">
        <h2 class="section-title">
          <span class="icon">⚡</span>
          Quick Actions
        </h2>
      </div>
      <div class="quick-actions-grid">
        <router-link to="/admin/students" class="action-btn action-primary">
          <div class="action-icon">👥</div>
          <span>Manage Students</span>
        </router-link>
        <router-link to="/admin/teachers" class="action-btn action-success">
          <div class="action-icon">👨‍🏫</div>
          <span>Manage Teachers</span>
        </router-link>
        <router-link to="/admin/departments" class="action-btn action-info">
          <div class="action-icon">🏢</div>
          <span>Departments</span>
        </router-link>
        <router-link to="/admin/subjects" class="action-btn action-warning">
          <div class="action-icon">📖</div>
          <span>Subjects & Courses</span>
        </router-link>
        <router-link to="/admin/exams" class="action-btn action-danger">
          <div class="action-icon">📝</div>
          <span>Exam Management</span>
        </router-link>
        <router-link to="/admin/card-types" class="action-btn action-purple">
          <div class="action-icon">📋</div>
          <span>Card Types</span>
        </router-link>
        <router-link to="/admin/attendance" class="action-btn action-teal">
          <div class="action-icon">✅</div>
          <span>Attendance</span>
        </router-link>
        <router-link to="/admin/settings" class="action-btn action-dark">
          <div class="action-icon">⚙️</div>
          <span>System Settings</span>
        </router-link>
      </div>
    </div>

    <!-- Department Overview & Alerts -->
    <div class="two-column-layout">
      <!-- Department Performance -->
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">
            <span class="icon">🏢</span>
            Department Performance
          </h2>
          <router-link to="/admin/reports/departments" class="view-all-link">
            View Details →
          </router-link>
        </div>
        <div class="department-list">
          <div
              v-for="dept in departments"
              :key="dept.id"
              class="department-item"
          >
            <div class="dept-info">
              <div class="dept-name">{{ dept.name }}</div>
              <div class="dept-stats">
                <span class="stat-chip">
                  <span class="chip-label">Students:</span>
                  <span class="chip-value">{{ dept.student_count }}</span>
                </span>
                <span class="stat-chip">
                  <span class="chip-label">Teachers:</span>
                  <span class="chip-value">{{ dept.teacher_count }}</span>
                </span>
              </div>
            </div>
            <div class="dept-performance">
              <div class="performance-label">Avg Performance</div>
              <div class="progress-bar-mini">
                <div
                    class="progress-fill-mini"
                    :style="{ width: dept.avg_performance + '%' }"
                    :class="getPerformanceClass(dept.avg_performance)"
                ></div>
              </div>
              <span class="performance-value">{{ dept.avg_performance }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- System Alerts & Notifications -->
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">
            <span class="icon">🔔</span>
            System Alerts
          </h2>
          <button class="btn-clear-all" @click="clearAllAlerts">Clear All</button>
        </div>
        <div class="alerts-list">
          <div
              v-for="alert in alerts"
              :key="alert.id"
              class="alert-item"
              :class="'alert-' + alert.type"
          >
            <div class="alert-icon">{{ getAlertIcon(alert.type) }}</div>
            <div class="alert-content">
              <div class="alert-title">{{ alert.title }}</div>
              <div class="alert-message">{{ alert.message }}</div>
              <div class="alert-time">{{ formatTime(alert.created_at) }}</div>
            </div>
            <button class="alert-dismiss" @click="dismissAlert(alert.id)">×</button>
          </div>

          <div v-if="alerts.length === 0" class="no-alerts">
            <span class="no-alerts-icon">✓</span>
            <p>No pending alerts</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Reports Section -->
    <div class="section-card reports-section">
      <div class="section-header">
        <h2 class="section-title">
          <span class="icon">📊</span>
          Reports & Analytics
        </h2>
        <router-link to="/admin/reports" class="view-all-link">
          View All Reports →
        </router-link>
      </div>
      <div class="reports-grid">
        <router-link
            v-for="report in reports"
            :key="report.id"
            :to="report.route"
            class="report-card"
        >
          <div class="report-icon" :style="{ background: report.color }">
            {{ report.icon }}
          </div>
          <div class="report-info">
            <h3>{{ report.name }}</h3>
            <p>{{ report.description }}</p>
          </div>
          <div class="report-arrow">→</div>
        </router-link>
      </div>
    </div>

    <!-- Recent Activities & Statistics Chart -->
    <div class="two-column-layout">
      <!-- Recent Activities -->
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">
            <span class="icon">📝</span>
            Recent Activities
          </h2>
        </div>
        <div class="activities-list">
          <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="activity-item"
          >
            <div class="activity-icon" :class="'activity-' + activity.type">
              {{ getActivityIcon(activity.type) }}
            </div>
            <div class="activity-details">
              <div class="activity-text">{{ activity.description }}</div>
              <div class="activity-meta">
                <span class="activity-user">{{ activity.user }}</span>
                <span class="activity-time">{{ formatTime(activity.created_at) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Attendance Trend Chart -->
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">
            <span class="icon">📈</span>
            Attendance Trend (Last 7 Days)
          </h2>
        </div>
        <div class="chart-container">
          <canvas ref="attendanceChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Pending Approvals -->
    <div class="section-card">
      <div class="section-header">
        <h2 class="section-title">
          <span class="icon">⏳</span>
          Pending Approvals
        </h2>
      </div>
      <div class="approvals-grid">
        <div class="approval-card">
          <div class="approval-header">
            <span class="approval-type">Leave Requests</span>
            <span class="approval-count">{{ pendingApprovals.leave_requests || 0 }}</span>
          </div>
          <router-link to="/admin/approvals/leave" class="approval-action">
            Review →
          </router-link>
        </div>

        <div class="approval-card">
          <div class="approval-header">
            <span class="approval-type">Result Verification</span>
            <span class="approval-count">{{ pendingApprovals.result_verification || 0 }}</span>
          </div>
          <router-link to="/admin/approvals/results" class="approval-action">
            Review →
          </router-link>
        </div>

        <div class="approval-card">
          <div class="approval-header">
            <span class="approval-type">Course Registrations</span>
            <span class="approval-count">{{ pendingApprovals.course_registrations || 0 }}</span>
          </div>
          <router-link to="/admin/approvals/courses" class="approval-action">
            Review →
          </router-link>
        </div>

        <div class="approval-card">
          <div class="approval-header">
            <span class="approval-type">Document Requests</span>
            <span class="approval-count">{{ pendingApprovals.document_requests || 0 }}</span>
          </div>
          <router-link to="/admin/approvals/documents" class="approval-action">
            Review →
          </router-link>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: "AdminDashboard",
  data() {
    return {
      loading: true,
      stats: {
        total_students: 0,
        new_students: 0,
        total_teachers: 0,
        active_teachers: 0,
        total_departments: 0,
        avg_attendance: 0,
        attendance_trend: 'up',
        attendance_change: 0,
        low_attendance_count: 0,
        active_courses: 0,
        current_semester: '',
      },
      departments: [],
      alerts: [],
      reports: [
        {
          id: 1,
          name: 'Student Progress Report',
          description: 'Individual student card progress',
          icon: '📊',
          color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          route: '/admin/reports/student-progress'
        },
        {
          id: 2,
          name: 'Attendance Report',
          description: 'Department & class wise attendance',
          icon: '✅',
          color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          route: '/admin/reports/attendance'
        },
        {
          id: 3,
          name: 'Exam Results',
          description: 'Term exam results & analysis',
          icon: '📝',
          color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          route: '/admin/reports/exam-results'
        },
        {
          id: 4,
          name: 'Teacher Performance',
          description: 'Teacher evaluation & feedback',
          icon: '👨‍🏫',
          color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          route: '/admin/reports/teacher-performance'
        },
        {
          id: 5,
          name: 'Department Statistics',
          description: 'Overall department performance',
          icon: '🏢',
          color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          route: '/admin/reports/department-stats'
        },
        {
          id: 6,
          name: 'Low Attendance Alert',
          description: 'Students with attendance < 75%',
          icon: '⚠️',
          color: 'linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)',
          route: '/admin/reports/low-attendance'
        },
      ],
      recentActivities: [],
      pendingApprovals: {
        leave_requests: 0,
        result_verification: 0,
        course_registrations: 0,
        document_requests: 0,
      },
      attendanceChart: null,
    };
  },
  computed: {
    user() {
      return this.$store.getters.currentUser;
    },
  },
  async mounted() {
    document.title = `Admin Dashboard | ${process.env.VUE_APP_PROJECT_NAME}`;
    await this.loadDashboardData();
    this.initializeChart();
  },
  methods: {
    async loadDashboardData() {
      try {
        this.loading = true;
        const res = await this.$api.get("/reports/dashboard");

        this.stats = res.data.stats || this.stats;
        this.departments = res.data.departments || [];
        this.alerts = res.data.alerts || [];
        this.recentActivities = res.data.recent_activities || [];
        this.pendingApprovals = res.data.pending_approvals || this.pendingApprovals;

        // Update chart if it exists
        if (this.attendanceChart && res.data.attendance_trend) {
          this.updateChart(res.data.attendance_trend);
        }

        this.loading = false;
      } catch (err) {
        console.error("Error loading admin dashboard:", err);
        this.loading = false;
      }
    },

    initializeChart() {
      const ctx = this.$refs.attendanceChart;
      if (!ctx) return;

      this.attendanceChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Attendance %',
            data: [85, 88, 92, 87, 90, 86, 89],
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: '#667eea',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: '#fff',
              titleColor: '#333',
              bodyColor: '#666',
              borderColor: '#ddd',
              borderWidth: 1,
              padding: 12,
              displayColors: false,
              callbacks: {
                label: (context) => `${context.parsed.y}%`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: (value) => value + '%',
                color: '#666',
                font: {
                  size: 12
                }
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            },
            x: {
              ticks: {
                color: '#666',
                font: {
                  size: 12
                }
              },
              grid: {
                display: false
              }
            }
          }
        }
      });
    },

    updateChart(data) {
      if (this.attendanceChart && data) {
        this.attendanceChart.data.labels = data.labels;
        this.attendanceChart.data.datasets[0].data = data.values;
        this.attendanceChart.update();
      }
    },

    getPerformanceClass(percentage) {
      if (percentage >= 80) return 'performance-excellent';
      if (percentage >= 60) return 'performance-good';
      if (percentage >= 40) return 'performance-average';
      return 'performance-poor';
    },

    getAlertIcon(type) {
      const icons = {
        danger: '🔴',
        warning: '⚠️',
        info: 'ℹ️',
        success: '✅'
      };
      return icons[type] || 'ℹ️';
    },

    getActivityIcon(type) {
      const icons = {
        student: '👤',
        teacher: '👨‍🏫',
        exam: '📝',
        attendance: '✅',
        result: '📊',
        system: '⚙️'
      };
      return icons[type] || '📌';
    },

    formatTime(datetime) {
      if (!datetime) return '';
      const date = new Date(datetime);
      const now = new Date();
      const diff = Math.floor((now - date) / 1000); // seconds

      if (diff < 60) return 'Just now';
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

      return date.toLocaleDateString();
    },

    clearAllAlerts() {
      if (confirm('Are you sure you want to clear all alerts?')) {
        this.alerts = [];
        // API call to clear alerts
        this.$api.post('/report/alerts/clear-all').catch(err => {
          console.error('Error clearing alerts:', err);
        });
      }
    },

    dismissAlert(alertId) {
      this.alerts = this.alerts.filter(alert => alert.id !== alertId);
      // API call to dismiss alert
      this.$api.post(`/report/alerts/${alertId}/dismiss`).catch(err => {
        console.error('Error dismissing alert:', err);
      });
    }
  },

  beforeDestroy() {
    if (this.attendanceChart) {
      this.attendanceChart.destroy();
    }
  }
}
</script>

<style scoped>
/* Admin Dashboard Styles */
.admin-dashboard {
  padding: 2rem;
  background: #f5f7fa;
  min-height: 100vh;
}

/* Top Stats Grid */
.top-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.75rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient, linear-gradient(135deg, #667eea 0%, #764ba2 100%));
}

.stat-card.gradient-blue { --gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.stat-card.gradient-purple { --gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.stat-card.gradient-green { --gradient: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.stat-card.gradient-orange { --gradient: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
.stat-card.gradient-red { --gradient: linear-gradient(135deg, #ff6a88 0%, #ff9a56 100%); }
.stat-card.gradient-teal { --gradient: linear-gradient(135deg, #30cfd0 0%, #330867 100%); }

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.stat-card .stat-icon {
  font-size: 2.5rem;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 12px;
}

.stat-details {
  flex: 1;
}

.stat-details h3 {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.stat-meta {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-success { background: #d1fae5; color: #065f46; }
.badge-info { background: #dbeafe; color: #1e40af; }
.badge-primary { background: #e0e7ff; color: #4338ca; }
.badge-danger { background: #fee2e2; color: #991b1b; }

.trend-up, .trend-down {
  font-weight: 600;
  font-size: 0.875rem;
}

.trend-up { color: #059669; }
.trend-down { color: #dc2626; }

/* Section Card */
.section-card {
  background: white;
  border-radius: 16px;
  padding: 1.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f3f4f6;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

.section-title .icon {
  font-size: 1.5rem;
}

.view-all-link {
  color: #667eea;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}

.view-all-link:hover {
  color: #5a67d8;
}

/* Quick Actions */
.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 1rem;
  border-radius: 12px;
  text-decoration: none;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  text-align: center;
}

.action-btn .action-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}

.action-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.action-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.action-success { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.action-info { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.action-warning { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
.action-danger { background: linear-gradient(135deg, #ff6a88 0%, #ff9a56 100%); }
.action-purple { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.action-teal { background: linear-gradient(135deg, #30cfd0 0%, #330867 100%); }
.action-dark { background: linear-gradient(135deg, #3a3a52 0%, #1f1f2e 100%); }

/* Two Column Layout */
.two-column-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

/* Department List */
.department-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.department-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  background: #f9fafb;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.department-item:hover {
  background: #f3f4f6;
  transform: translateX(4px);
}

.dept-info {
  flex: 1;
}

.dept-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.dept-stats {
  display: flex;
  gap: 1rem;
}

.stat-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
}

.chip-label {
  color: #6b7280;
}

.chip-value {
  font-weight: 700;
  color: #374151;
}

.dept-performance {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  min-width: 120px;
}

.performance-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
}

.progress-bar-mini {
  width: 100px;
  height: 8px;
  background: #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill-mini {
  height: 100%;
  border-radius: 10px;
  transition: width 0.6s ease;
}

.performance-excellent { background: linear-gradient(90deg, #10b981, #34d399); }
.performance-good { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
.performance-average { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
.performance-poor { background: linear-gradient(90deg, #ef4444, #f87171); }

.performance-value {
  font-weight: 700;
  font-size: 0.875rem;
  color: #374151;
}

/* Alerts */
.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
}

.alert-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  border-left: 4px solid;
  background: #f9fafb;
  transition: all 0.3s ease;
  position: relative;
}

.alert-item:hover {
  background: #f3f4f6;
}

.alert-danger { border-left-color: #ef4444; background: #fef2f2; }
.alert-warning { border-left-color: #f59e0b; background: #fffbeb; }
.alert-info { border-left-color: #3b82f6; background: #eff6ff; }
.alert-success { border-left-color: #10b981; background: #f0fdf4; }

.alert-icon {
  font-size: 1.5rem;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.alert-message {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.alert-time {
  font-size: 0.75rem;
  color: #9ca3af;
}

.alert-dismiss {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #9ca3af;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.alert-dismiss:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #4b5563;
}

.btn-clear-all {
  padding: 0.5rem 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-clear-all:hover {
  background: #dc2626;
}

.no-alerts {
  text-align: center;
  padding: 3rem 1rem;
  color: #9ca3af;
}

.no-alerts-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
  color: #10b981;
}

/* Reports Grid */
.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.report-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.report-card:hover {
  background: white;
  border-color: #667eea;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.report-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-size: 1.75rem;
  flex-shrink: 0;
}

.report-info {
  flex: 1;
}

.report-info h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.report-info p {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.report-arrow {
  font-size: 1.25rem;
  color: #9ca3af;
  transition: transform 0.3s;
}

.report-card:hover .report-arrow {
  transform: translateX(4px);
  color: #667eea;
}

/* Activities */
.activities-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.activity-item:hover {
  background: #f3f4f6;
}

.activity-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.activity-student { background: #dbeafe; }
.activity-teacher { background: #fef3c7; }
.activity-exam { background: #fce7f3; }
.activity-attendance { background: #d1fae5; }
.activity-result { background: #e0e7ff; }
.activity-system { background: #f3f4f6; }

.activity-details {
  flex: 1;
}

.activity-text {
  color: #1f2937;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.activity-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.activity-user {
  font-weight: 600;
}

/* Chart Container */
.chart-container {
  height: 300px;
  padding: 1rem 0;
}

/* Approvals Grid */
.approvals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.approval-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 1.5rem;
  color: white;
  transition: all 0.3s ease;
}

.approval-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.approval-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.approval-type {
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.approval-count {
  font-size: 1.75rem;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.2);
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.approval-action {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  transition: all 0.2s;
}

.approval-action:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .admin-dashboard {
    padding: 1rem;
  }

  .top-stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .two-column-layout {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .quick-actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .reports-grid {
    grid-template-columns: 1fr;
  }

  .approvals-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .stat-card {
    padding: 1.25rem;
  }

  .stat-card .stat-icon {
    width: 50px;
    height: 50px;
    font-size: 2rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .quick-actions-grid {
    grid-template-columns: 1fr;
  }
}

/* Loading State */
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #9ca3af;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-card,
.section-card,
.action-btn {
  animation: fadeInUp 0.6s ease backwards;
}

.stat-card:nth-child(1) { animation-delay: 0.05s; }
.stat-card:nth-child(2) { animation-delay: 0.1s; }
.stat-card:nth-child(3) { animation-delay: 0.15s; }
.stat-card:nth-child(4) { animation-delay: 0.2s; }
.stat-card:nth-child(5) { animation-delay: 0.25s; }
.stat-card:nth-child(6) { animation-delay: 0.3s; }

/* Scrollbar Styling */
.activities-list::-webkit-scrollbar,
.alerts-list::-webkit-scrollbar {
  width: 6px;
}

.activities-list::-webkit-scrollbar-track,
.alerts-list::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 10px;
}

.activities-list::-webkit-scrollbar-thumb,
.alerts-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.activities-list::-webkit-scrollbar-thumb:hover,
.alerts-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>