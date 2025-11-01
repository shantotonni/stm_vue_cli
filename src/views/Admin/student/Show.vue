<template>
  <div class="student-show-container">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div>
          <h1 class="page-title">Student Details</h1>
          <p class="page-subtitle">Complete student information overview</p>
        </div>
      </div>
      <div class="header-actions">
        <button @click="editStudent" class="btn-edit">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          Edit
        </button>
        <button @click="goBack" class="btn-back">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to List
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner-large"></div>
      <p>Loading student data...</p>
    </div>

    <!-- Student Information -->
    <div v-else class="student-content">

      <!-- Status Badge -->
      <div class="status-badge-container">
        <span :class="['status-badge', student.status === 'Y' ? 'status-active' : 'status-inactive']">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {{ student.status === 'Y' ? 'Active' : 'Inactive' }}
        </span>
      </div>

      <!-- Personal Information Card -->
      <div class="info-card">
        <div class="card-header">
          <div class="card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <h2 class="card-title">Personal Information</h2>
        </div>
        <div class="card-content">
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Full Name</span>
              <span class="info-value">{{ student.name || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">User</span>
              <span class="info-value">{{ getUserName(student.user_id) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Date of Birth</span>
              <span class="info-value">{{ formatDate(student.date_of_birth) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Blood Group</span>
              <span class="info-value">
                <span class="blood-badge">{{ student.blood_group || 'N/A' }}</span>
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">NID Number</span>
              <span class="info-value">{{ student.nid || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Nationality</span>
              <span class="info-value">{{ student.nationality || 'N/A' }}</span>
            </div>
            <div class="info-item full-width">
              <span class="info-label">Address</span>
              <span class="info-value">{{ student.address || 'N/A' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Academic Information Card -->
      <div class="info-card">
        <div class="card-header">
          <div class="card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <h2 class="card-title">Academic Information</h2>
        </div>
        <div class="card-content">
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Student ID</span>
              <span class="info-value student-id">{{ student.student_id_number || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Roll Number</span>
              <span class="info-value">{{ student.roll_no || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Department</span>
              <span class="info-value">{{ getDepartmentName(student.department_id) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Phase</span>
              <span class="info-value">{{ getPhaseName(student.phase_id) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Program</span>
              <span class="info-value">{{ getProgramName(student.program_id) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Session</span>
              <span class="info-value">{{ getSessionName(student.session_id) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Category</span>
              <span class="info-value">{{ getCategoryName(student.category_id) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Year</span>
              <span class="info-value">{{ student.year ? student.year + ' Year' : 'N/A' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Semester</span>
              <span class="info-value">{{ student.semester ? student.semester + ' Semester' : 'N/A' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Batch</span>
              <span class="info-value">{{ student.batch || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Admission Date</span>
              <span class="info-value">{{ formatDate(student.admission_date) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Hostel Resident</span>
              <span class="info-value">
                <span :class="['hostel-badge', student.is_hostel === 'Yes' ? 'hostel-yes' : 'hostel-no']">
                  {{ student.is_hostel || 'N/A' }}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Information Card -->
      <div class="info-card">
        <div class="card-header">
          <div class="card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </div>
          <h2 class="card-title">Contact Information</h2>
        </div>
        <div class="card-content">
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Email</span>
              <span class="info-value">
                <a v-if="student.email" :href="'mailto:' + student.email" class="email-link">
                  {{ student.email }}
                </a>
                <span v-else>N/A</span>
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">Mobile Number</span>
              <span class="info-value">
                <a v-if="student.mobile" :href="'tel:' + student.mobile" class="phone-link">
                  {{ student.mobile }}
                </a>
                <span v-else>N/A</span>
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">Guardian Name</span>
              <span class="info-value">{{ student.guardian_name || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Guardian Phone</span>
              <span class="info-value">
                <a v-if="student.guardian_phone" :href="'tel:' + student.guardian_phone" class="phone-link">
                  {{ student.guardian_phone }}
                </a>
                <span v-else>N/A</span>
              </span>
            </div>
            <div class="info-item">
              <span class="info-label">Emergency Contact</span>
              <span class="info-value emergency-contact">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <a v-if="student.emergency_contact" :href="'tel:' + student.emergency_contact" class="phone-link">
                  {{ student.emergency_contact }}
                </a>
                <span v-else>N/A</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- System Information Card -->
      <div class="info-card system-info">
        <div class="card-header">
          <div class="card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <h2 class="card-title">System Information</h2>
        </div>
        <div class="card-content">
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Created At</span>
              <span class="info-value">{{ formatDateTime(student.created_at) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Last Updated</span>
              <span class="info-value">{{ formatDateTime(student.updated_at) }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'StudentShow',

  data() {
    return {
      studentId: null,
      loading: true,
      student: {},
      departments: [],
      categories: [],
      programs: [],
      phases: [],
      users: [],
      sessions: []
    };
  },
  created() {
    this.studentId = this.$route.params.id;
  },
  mounted() {
    this.fetchData();
  },

  methods: {
    async fetchData() {
      try {
        await Promise.allSettled([
          this.fetchStudent(),
          this.fetchDepartments(),
          this.fetchUsers(),
          this.fetchSessions(),
          this.fetchCategories(),
          this.fetchPrograms(),
          this.fetchPhases()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
        this.$toasted.error('Failed to load student data');
      } finally {
        this.loading = false;
      }
    },

    async fetchStudent() {
      const response = await this.$api.get(`/students/${this.studentId}`);
      this.student = response.data.data;
    },

    async fetchDepartments() {
      const response = await this.$api.get('/get-departments');
      this.departments = response.data;
    },

    async fetchUsers() {
      const response = await this.$api.get('/student-users');
      this.users = response.data;
    },

    async fetchSessions() {
      const response = await this.$api.get('/get-session');
      this.sessions = response.data;
    },

    async fetchCategories() {
      const response = await this.$api.get('/get-category');
      this.categories = response.data;
    },

    async fetchPrograms() {
      const response = await this.$api.get('/get-program');
      this.programs = response.data;
    },

    async fetchPhases() {
      const response = await this.$api.get('/get-phases');
      this.phases = response.data;
    },

    getUserName(userId) {
      const user = this.users.find(u => u.id === userId);
      return user ? `${user.name} (${user.login_code})` : 'N/A';
    },

    getDepartmentName(deptId) {
      const dept = this.departments.find(d => d.id === deptId);
      return dept ? dept.name : 'N/A';
    },

    getPhaseName(phaseId) {
      const phase = this.phases.find(p => p.id === phaseId);
      return phase ? phase.name : 'N/A';
    },

    getProgramName(programId) {
      const program = this.programs.find(p => p.id === programId);
      return program ? program.name : 'N/A';
    },

    getSessionName(sessionId) {
      const session = this.sessions.find(s => s.id === sessionId);
      return session ? session.name : 'N/A';
    },

    getCategoryName(categoryId) {
      const category = this.categories.find(c => c.id === categoryId);
      return category ? category.name : 'N/A';
    },

    formatDate(date) {
      if (!date) return 'N/A';
      const d = new Date(date);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },

    formatDateTime(datetime) {
      if (!datetime) return 'N/A';
      const d = new Date(datetime);
      return d.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    editStudent() {
      this.$router.push({ name: 'StudentEdit', params: { id: this.studentId } });
    },

    goBack() {
      this.$router.push({ name: 'StudentList' });
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.student-show-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-icon {
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-subtitle {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.9);
  margin: 6px 0 0 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn-edit,
.btn-back {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-edit {
  background: rgba(255, 255, 255, 0.95);
  color: #667eea;
}

.btn-edit:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.spinner-large {
  width: 60px;
  height: 60px;
  border: 4px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

.loading-container p {
  font-size: 16px;
  color: #718096;
  font-weight: 500;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Student Content */
.student-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Status Badge */
.status-badge-container {
  display: flex;
  justify-content: flex-end;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.status-active {
  background: rgba(72, 187, 120, 0.2);
  color: #22543d;
  border: 2px solid rgba(72, 187, 120, 0.4);
}

.status-inactive {
  background: rgba(245, 101, 101, 0.2);
  color: #742a2a;
  border: 2px solid rgba(245, 101, 101, 0.4);
}

/* Info Cards */
.info-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.info-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 24px 72px rgba(0, 0, 0, 0.2);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 32px 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.card-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
}

.card-content {
  padding: 40px;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-label {
  font-size: 13px;
  font-weight: 600;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 16px;
  font-weight: 500;
  color: #2d3748;
  line-height: 1.5;
}

.student-id {
  font-family: 'Courier New', monospace;
  font-weight: 700;
  color: #667eea;
  font-size: 18px;
}

/* Badges */
.blood-badge {
  display: inline-block;
  padding: 6px 14px;
  background: linear-gradient(135deg, #f56565 0%, #c53030 100%);
  color: white;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  box-shadow: 0 4px 12px rgba(245, 101, 101, 0.3);
}

.hostel-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
}

.hostel-yes {
  background: rgba(72, 187, 120, 0.15);
  color: #22543d;
  border: 1px solid rgba(72, 187, 120, 0.4);
}

.hostel-no {
  background: rgba(160, 174, 192, 0.15);
  color: #2d3748;
  border: 1px solid rgba(160, 174, 192, 0.4);
}

/* Links */
.email-link,
.phone-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.email-link:hover,
.phone-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

.emergency-contact {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #c53030;
  font-weight: 600;
}

.emergency-contact svg {
  flex-shrink: 0;
}

/* System Info Card */
.system-info {
  opacity: 0.9;
}

.system-info .card-header {
  background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
}

/* Responsive Design */
@media (max-width: 768px) {
  .student-show-container {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .header-icon {
    width: 56px;
    height: 56px;
  }

  .page-title {
    font-size: 26px;
  }

  .page-subtitle {
    font-size: 14px;
  }

  .header-actions {
    width: 100%;
    flex-direction: column;
  }

  .btn-edit,
  .btn-back {
    width: 100%;
    justify-content: center;
  }

  .card-header {
    padding: 24px;
  }

  .card-icon {
    width: 40px;
    height: 40px;
  }

  .card-title {
    font-size: 19px;
  }

  .card-content {
    padding: 24px;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .info-value {
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 22px;
  }

  .card-header {
    padding: 20px;
  }

  .card-title {
    font-size: 17px;
  }

  .card-content {
    padding: 20px;
  }

  .info-label {
    font-size: 12px;
  }

  .info-value {
    font-size: 14px;
  }
}
</style>