<template>
  <transition name="modal-fade">
    <div v-if="show && exam" class="modal-overlay" @click.self="close">
      <div class="modern-supervisors-modal">
        <!-- Header -->
        <div class="modal-header-supervisors">
          <div class="header-content">
            <div class="header-icon">
              <i class="fas fa-user-tie"></i>
            </div>
            <div class="header-text">
              <h2 class="modal-title">Supervisor Management</h2>
              <p class="modal-subtitle">{{ exam.title }}</p>
            </div>
          </div>
          <button class="close-btn" @click="close">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Body -->
        <div class="modal-body-supervisors">
          <!-- Add Supervisor Section -->
          <div class="add-supervisor-section">
            <div class="section-header">
              <i class="fas fa-user-plus"></i>
              <h3>Add New Supervisor</h3>
            </div>
            <div class="add-form">
              <div class="form-group-supervisor">
                <label class="form-label">
                  <i class="fas fa-chalkboard-teacher"></i>
                  Select Teacher
                </label>
                <select class="form-select-supervisor" v-model="selectedTeacher">
                  <option value="">Choose a teacher...</option>
                  <option v-for="teacher in availableTeachers" :key="teacher.id" :value="teacher.id">
                    {{ teacher.name }} - {{ teacher.designation }}
                  </option>
                </select>
              </div>

              <div class="form-group-supervisor">
                <label class="form-label">
                  <i class="fas fa-user-tag"></i>
                  Supervisor Role
                </label>
                <select class="form-select-supervisor" v-model="selectedRole">
                  <option value="chief">Chief Supervisor</option>
                  <option value="assistant">Assistant Supervisor</option>
                  <option value="invigilator">Invigilator</option>
                </select>
              </div>

              <div class="form-group-supervisor form-button">
                <button
                    class="btn-add-supervisor"
                    @click="addSupervisor"
                    :disabled="!selectedTeacher"
                >
                  <i class="fas fa-plus-circle"></i>
                  Add Supervisor
                </button>
              </div>
            </div>
          </div>

          <!-- Role Distribution Statistics -->
          <div class="stats-grid">
            <div class="stat-card stat-total">
              <div class="stat-icon-wrapper">
                <i class="fas fa-users"></i>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ supervisors.length }}</div>
                <div class="stat-label">Total Supervisors</div>
              </div>
              <div class="stat-badge">
                <i class="fas fa-check-circle"></i>
              </div>
            </div>

            <div class="stat-card stat-chief">
              <div class="stat-icon-wrapper">
                <i class="fas fa-crown"></i>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ getCountByRole('chief') }}</div>
                <div class="stat-label">Chief Supervisors</div>
              </div>
              <div class="stat-progress">
                <div class="progress-bar" :style="{ width: getPercentage('chief') + '%' }"></div>
              </div>
            </div>

            <div class="stat-card stat-assistant">
              <div class="stat-icon-wrapper">
                <i class="fas fa-user-shield"></i>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ getCountByRole('assistant') }}</div>
                <div class="stat-label">Assistant Supervisors</div>
              </div>
              <div class="stat-progress">
                <div class="progress-bar" :style="{ width: getPercentage('assistant') + '%' }"></div>
              </div>
            </div>

            <div class="stat-card stat-invigilator">
              <div class="stat-icon-wrapper">
                <i class="fas fa-user-check"></i>
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ getCountByRole('invigilator') }}</div>
                <div class="stat-label">Invigilators</div>
              </div>
              <div class="stat-progress">
                <div class="progress-bar" :style="{ width: getPercentage('invigilator') + '%' }"></div>
              </div>
            </div>
          </div>

          <!-- Supervisors List Header -->
          <div class="list-header">
            <h3>
              <i class="fas fa-list"></i>
              Assigned Supervisors
              <span class="supervisor-count">{{ supervisors.length }}</span>
            </h3>
          </div>

          <!-- Empty State -->
          <div v-if="supervisors.length === 0" class="empty-state">
            <div class="empty-icon">
              <i class="fas fa-user-slash"></i>
            </div>
            <h3>No Supervisors Assigned</h3>
            <p>Add supervisors to this exam using the form above</p>
          </div>

          <!-- Supervisors Grid -->
          <div v-else class="supervisors-grid">
            <div
                v-for="supervisor in supervisors"
                :key="supervisor.id"
                class="supervisor-card"
                :class="'role-' + supervisor.pivot.role"
            >
              <div class="supervisor-header">
                <div class="supervisor-avatar-section">
                  <div class="supervisor-avatar">
                    <i class="fas fa-user-tie"></i>
                  </div>
                  <div class="supervisor-info">
                    <h4 class="supervisor-name">{{ supervisor.name }}</h4>
                    <p class="supervisor-designation">{{ supervisor.designation }}</p>
                  </div>
                </div>
                <div class="role-badge" :class="'badge-' + supervisor.pivot.role">
                  <i class="fas" :class="getRoleIcon(supervisor.pivot.role)"></i>
                  {{ getRoleLabel(supervisor.pivot.role) }}
                </div>
              </div>

              <div class="supervisor-body">
                <div class="role-selector">
                  <label class="selector-label">
                    <i class="fas fa-user-tag"></i>
                    Change Role
                  </label>
                  <select
                      class="role-select"
                      v-model="supervisor.pivot.role"
                      @change="updateRole(supervisor)"
                  >
                    <option value="chief">Chief Supervisor</option>
                    <option value="assistant">Assistant Supervisor</option>
                    <option value="invigilator">Invigilator</option>
                  </select>
                </div>

                <div class="supervisor-meta">
                  <div class="meta-item">
                    <i class="fas fa-envelope"></i>
                    <span>{{ supervisor.email || 'No email' }}</span>
                  </div>
                  <div class="meta-item">
                    <i class="fas fa-phone"></i>
                    <span>{{ supervisor.phone || 'No phone' }}</span>
                  </div>
                </div>
              </div>

              <div class="supervisor-footer">
                <button class="btn-remove" @click="removeSupervisor(supervisor)">
                  <i class="fas fa-trash-alt"></i>
                  Remove Supervisor
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer-supervisors">
          <div class="footer-info">
            <i class="fas fa-info-circle"></i>
            {{ supervisors.length }} supervisor{{ supervisors.length !== 1 ? 's' : '' }} assigned to this exam
          </div>
          <button class="btn-close-footer" @click="close">
            <i class="fas fa-times-circle"></i>
            Close
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ExamSupervisorsModal',

  props: {
    show: Boolean,
    exam: Object
  },

  data() {
    return {
      supervisors: [],
      availableTeachers: [],
      selectedTeacher: '',
      selectedRole: 'invigilator'
    };
  },

  watch: {
    show(val) {
      if (val && this.exam) {
        this.fetchSupervisors();
        setTimeout(()=>{
          this.fetchAvailableTeachers();
        },1000)
      }
    }
  },

  methods: {
    async fetchSupervisors() {
      try {
        const response = await this.$api.get(`/exams/${this.exam.id}/supervisors`);
        this.supervisors = response.data.data || response.data;
      } catch (error) {
        console.error('Error fetching supervisors:', error);
        this.$toast.error('Failed to load supervisors');
      }
    },

    async fetchAvailableTeachers() {
      try {
        const response = await this.$api.get('/get-teacher');
        this.availableTeachers = response.data;
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching teachers:', error);
        this.$toast.error('Failed to load teachers');
      }
    },

    async addSupervisor() {
      if (!this.selectedTeacher) return;

      try {
        await this.$api.post(`/exams/${this.exam.id}/supervisors`, {
          teacher_id: this.selectedTeacher,
          role: this.selectedRole
        });

        this.$toast.success('Supervisor added successfully');
        this.selectedTeacher = '';
        this.selectedRole = 'invigilator';
        this.fetchSupervisors();
      } catch (error) {
        console.error('Error adding supervisor:', error);
        this.$toast.error('Failed to add supervisor');
      }
    },

    async updateRole(supervisor) {
      try {
        await this.$api.put(`/exams/${this.exam.id}/supervisors/${supervisor.id}`, {
          role: supervisor.pivot.role
        });
        this.$toast.success('Role updated successfully');
        this.fetchSupervisors();
      } catch (error) {
        console.error('Error updating role:', error);
        this.$toast.error('Failed to update role');
      }
    },

    async removeSupervisor(supervisor) {
      if (confirm(`Remove ${supervisor.name} as supervisor?`)) {
        try {
          await this.$api.delete(`/exams/${this.exam.id}/supervisors/${supervisor.id}`);
          this.$toast.success('Supervisor removed successfully');
          this.fetchSupervisors();
        } catch (error) {
          console.error('Error removing supervisor:', error);
          this.$toast.error('Failed to remove supervisor');
        }
      }
    },

    getCountByRole(role) {
      return this.supervisors.filter(s => s.pivot.role === role).length;
    },

    getPercentage(role) {
      if (this.supervisors.length === 0) return 0;
      return Math.round((this.getCountByRole(role) / this.supervisors.length) * 100);
    },

    getRoleIcon(role) {
      const icons = {
        chief: 'fa-crown',
        assistant: 'fa-user-shield',
        invigilator: 'fa-user-check'
      };
      return icons[role] || 'fa-user';
    },

    getRoleLabel(role) {
      const labels = {
        chief: 'Chief',
        assistant: 'Assistant',
        invigilator: 'Invigilator'
      };
      return labels[role] || role;
    },

    close() {
      this.selectedTeacher = '';
      this.selectedRole = 'invigilator';
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
  overflow-y: auto;
}

.modern-supervisors-modal {
  background: white;
  border-radius: 24px;
  width: 100%;
  max-width: 1200px;
  max-height: 95vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideUp 0.4s ease-out;
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Header */
.modal-header-supervisors {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  color: #2d3748;
  padding: 2rem;
  position: relative;
  border-radius: 24px 24px 0 0;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.header-icon {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  color: #667eea;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.modal-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
}

.modal-subtitle {
  margin: 0.25rem 0 0 0;
  opacity: 0.8;
  font-size: 0.95rem;
}

.close-btn {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 10px;
  color: #2d3748;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: white;
  transform: scale(1.1);
}

/* Body */
.modal-body-supervisors {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  background: #f8f9fa;
}

/* Add Supervisor Section */
.add-supervisor-section {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e2e8f0;
}

.section-header i {
  width: 35px;
  height: 35px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.section-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #2d3748;
}

.add-form {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1fr;
  gap: 1rem;
  align-items: end;
}

.form-group-supervisor {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-label i {
  color: #667eea;
}

.form-select-supervisor {
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-select-supervisor:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn-add-supervisor {
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-add-supervisor:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-add-supervisor:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Statistics Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
}

.stat-total::before { background: #667eea; }
.stat-chief::before { background: #fbbf24; }
.stat-assistant::before { background: #4facfe; }
.stat-invigilator::before { background: #38ef7d; }

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-icon-wrapper {
  width: 60px;
  height: 60px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.stat-total .stat-icon-wrapper {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-chief .stat-icon-wrapper {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
}

.stat-assistant .stat-icon-wrapper {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.stat-invigilator .stat-icon-wrapper {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
}

.stat-content {
  margin-bottom: 1rem;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  line-height: 1;
}

.stat-label {
  font-size: 0.85rem;
  color: #718096;
  font-weight: 600;
  margin-top: 0.5rem;
}

.stat-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 35px;
  height: 35px;
  background: #f7fafc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
}

.stat-progress {
  height: 6px;
  background: #f1f1f1;
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  transition: width 0.6s ease;
}

.stat-chief .progress-bar {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
}

.stat-assistant .progress-bar {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-invigilator .progress-bar {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

/* List Header */
.list-header {
  background: white;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.list-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.list-header i {
  color: #667eea;
}

.supervisor-count {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.85rem;
  margin-left: auto;
}

/* Empty State */
.empty-state {
  background: white;
  border-radius: 16px;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.empty-icon {
  width: 100px;
  height: 100px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon i {
  font-size: 3rem;
  color: #cbd5e0;
}

.empty-state h3 {
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #718096;
}

/* Supervisors Grid */
.supervisors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.supervisor-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.supervisor-card.role-chief { border-left-color: #fbbf24; }
.supervisor-card.role-assistant { border-left-color: #4facfe; }
.supervisor-card.role-invigilator { border-left-color: #38ef7d; }

.supervisor-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.supervisor-header {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 2px solid #f1f1f1;
}

.supervisor-avatar-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.supervisor-avatar {
  width: 55px;
  height: 55px;
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #667eea;
  flex-shrink: 0;
}

.supervisor-info {
  flex: 1;
}

.supervisor-name {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #2d3748;
}

.supervisor-designation {
  margin: 0;
  font-size: 0.85rem;
  color: #718096;
  font-weight: 600;
}

.role-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.badge-chief {
  background: linear-gradient(135deg, #fbbf2415 0%, #f59e0b15 100%);
  color: #f59e0b;
  border: 2px solid #fbbf24;
}

.badge-assistant {
  background: linear-gradient(135deg, #4facfe15 0%, #00f2fe15 100%);
  color: #4facfe;
  border: 2px solid #4facfe;
}

.badge-invigilator {
  background: linear-gradient(135deg, #11998e15 0%, #38ef7d15 100%);
  color: #11998e;
  border: 2px solid #38ef7d;
}

.supervisor-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.role-selector {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.selector-label {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.selector-label i {
  color: #667eea;
}

.role-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.role-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.supervisor-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #718096;
  font-size: 0.9rem;
}

.meta-item i {
  color: #a0aec0;
  width: 20px;
}

.supervisor-footer {
  padding: 1rem 1.5rem;
  background: #f8f9fa;
}

.btn-remove {
  width: 100%;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-remove:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(235, 51, 73, 0.4);
}

/* Footer */
.modal-footer-supervisors {
  padding: 1.5rem 2rem;
  background: white;
  border-top: 2px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 0 0 24px 24px;
}

.footer-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #718096;
  font-size: 0.9rem;
  font-weight: 600;
}

.footer-info i {
  color: #667eea;
}

.btn-close-footer {
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 12px;
  background: #e2e8f0;
  color: #4a5568;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-close-footer:hover {
  background: #cbd5e0;
  transform: translateY(-2px);
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

/* Scrollbar */
.modal-body-supervisors::-webkit-scrollbar {
  width: 8px;
}

.modal-body-supervisors::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.modal-body-supervisors::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  border-radius: 10px;
}

/* Responsive */
@media (max-width: 1200px) {
  .supervisors-grid {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 0.5rem;
  }

  .modern-supervisors-modal {
    max-height: 98vh;
  }

  .modal-header-supervisors {
    padding: 1.5rem;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .modal-body-supervisors {
    padding: 1rem;
  }

  .add-form {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .supervisors-grid {
    grid-template-columns: 1fr;
  }

  .supervisor-header {
    flex-direction: column;
    gap: 1rem;
  }

  .role-badge {
    align-self: flex-start;
  }

  .modal-footer-supervisors {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .btn-close-footer {
    width: 100%;
    justify-content: center;
  }
}
</style>