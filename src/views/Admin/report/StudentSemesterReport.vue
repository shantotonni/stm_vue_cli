<template>
  <div class="results-page">
    <!-- Filters Section -->
    <div class="filters-card">
      <h2>Select Student and Semester</h2>
      <div class="filters-grid">
        <div class="form-group">
          <label>Student:</label>
          <select id="student-select" v-model="selectedStudentId" class="form-control">
            <option value="">-- Select Student --</option>
            <option v-for="student in students" :key="student.id" :value="student.id">
              {{ student.name }} ({{ student.roll_no }})
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>Semester/Session:</label>
          <select id="session-select" v-model="selectedSessionId" class="form-control">
            <option value="">-- Select Session --</option>
            <option v-for="session in sessions" :key="session.id" :value="session.id">
              {{ session.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <button
              @click="viewResults"
              class="btn btn-view"
              :disabled="!selectedStudentId || !selectedSessionId"
          >
            <i class="fas fa-eye"></i> View Results
          </button>
        </div>
      </div>
    </div>

    <!-- Results Component -->
    <student-semester-results
        v-if="showResults && selectedStudentId && selectedSessionId"
        :student-id="selectedStudentId"
        :session-id="selectedSessionId"
    />
  </div>
</template>

<script>
import StudentSemesterResults from './StudentSemesterResults.vue';

export default {
  name: 'ResultsPage',

  components: {
    StudentSemesterResults
  },

  data() {
    return {
      students: [],
      sessions: [],
      selectedStudentId: '',
      selectedSessionId: '',
      showResults: false
    };
  },

  mounted() {
    this.fetchStudents();
    this.fetchSessions();
  },

  methods: {
    async fetchStudents() {
      try {
        const response = await this.$api.get('/get-students');
        this.students = response.data || [];
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    },

    async fetchSessions() {
      try {
        const response = await this.$api.get('/get-session');
        this.sessions = response.data || [];
      } catch (error) {
        console.error('Error fetching sessions:', error);
      }
    },

    viewResults() {
      this.showResults = true;
    }
  }
};
</script>

<style scoped>
.results-page {
  padding: 20px;
  /*max-width: 1400px;*/
  /*margin: 0 auto;*/
}

.filters-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filters-card h2 {
  margin: 0 0 25px 0;
  font-size: 20px;
  color: #333;
}

.filters-grid {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 20px;
  align-items: end;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #555;
  font-size: 14px;
}

.form-control {
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
}

.btn-view {
  padding: 12px 30px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.btn-view:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-view:disabled {
  background: #ccc;
  cursor: not-allowed;
}

@media screen and (max-width: 768px) {
  .filters-grid {
    grid-template-columns: 1fr;
  }

  .btn-view {
    width: 100%;
    justify-content: center;
  }
}
</style>