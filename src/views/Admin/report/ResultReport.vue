<template>
  <div class="report-container">
    <!-- Header Section -->
    <div class="report-header">
      <h1 class="report-title">Student Result Report</h1>
      <p class="report-subtitle">View and manage student examination results</p>
    </div>

    <!-- Filter Section -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-item">
          <input
              type="text"
              v-model="filters.search"
              placeholder="Search by name, roll, or reg number..."
              class="search-input"
              @input="handleSearch"
          />
        </div>

        <div class="filter-item">
          <select v-model="filters.department_id" @change="fetchResults" class="filter-select">
            <option value="">All Departments</option>
            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
              {{ dept.name }}
            </option>
          </select>
        </div>

        <div class="filter-item">
          <select v-model="filters.exam_type" @change="fetchResults" class="filter-select">
            <option value="">All Exam Types</option>
            <option v-for="exam_type in exam_types" :key="exam_type.id" :value="exam_type.id">
              {{ exam_type.name }}
            </option>
          </select>
        </div>

        <div class="filter-item">
          <select v-model="filters.year" @change="fetchResults" class="filter-select">
            <option value="">All Year</option>
            <option v-for="year in years" :key="year.id" :value="year.id">
              {{ year.name }}
            </option>
          </select>
        </div>

        <div class="filter-item">
          <select v-model="filters.semester" @change="fetchResults" class="filter-select">
            <option value="">All Semesters</option>
            <option value="1st">First Semester</option>
            <option value="2nd">Second Semester</option>
          </select>
        </div>

        <button @click="exportResults" class="export-btn">
          <span class="export-icon">📥</span> Export PDF
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Loading results...</p>
    </div>

    <!-- Results Table -->
    <div v-else-if="results.length > 0" class="results-card">
      <div class="table-container">
        <table class="results-table">
          <thead>
          <tr>
            <th>Student Info</th>
            <th>Department</th>
            <th>Subject</th>
            <th>Exam Type</th>
            <th>Theory</th>
            <th>Practical</th>
            <th>Viva</th>
            <th>Total</th>
            <th>Grade</th>
            <th>GPA</th>
            <th>Status</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(result, index) in results" :key="index" :class="['result-row', result.pass_fail_status === 'pass' ? 'pass-row' : 'fail-row']"
          >
            <td class="student-info">
              <div class="student-name">{{ result.student_name }}</div>
              <div class="student-details">Roll: {{ result.roll_number }}</div>
              <div class="student-details">Reg: {{ result.registration_number }}</div>
            </td>
            <td>{{ result.department }}</td>
            <td>{{ result.subject_name }}</td>
            <td>
              <span class="exam-badge">{{ result.exam_type }}</span>
            </td>
            <td class="marks">{{ result.theory_marks }}</td>
            <td class="marks">{{ result.practical_marks || 'N/A' }}</td>
            <td class="marks">{{ result.viva_marks || 'N/A' }}</td>
            <td class="marks total-marks">{{ result.total_marks }}</td>
            <td class="grade">{{ result.grade }}</td>
            <td class="gpa">{{ result.gpa }}</td>
            <td>
                <span :class="['status-badge', result.pass_fail_status]">
                  {{ result.pass_fail_status }}
                </span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <button
            @click="previousPage"
            :disabled="currentPage === 1"
            class="pagination-btn"
        >
          ← Previous
        </button>
        <span class="page-info">Page {{ currentPage }} of {{ lastPage }}</span>
        <button
            @click="nextPage"
            :disabled="currentPage === lastPage"
            class="pagination-btn"
        >
          Next →
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-icon">📊</div>
      <h3>No Results Found</h3>
      <p>Try adjusting your filters or search criteria</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResultReport',
  data() {
    return {
      results: [],
      departments: [],
      exam_types: [],
      years: [],
      loading: false,
      filters: {
        search: '',
        department_id: '',
        exam_type: '',
        year: '',
        semester: '',
      },
      currentPage: 1,
      lastPage: 1,
      searchTimeout: null,
    };
  },
  mounted() {
    this.fetchDepartments();
    this.fetchResults();
    this.fetchExamTypes();
    this.fetchYear();
  },
  methods: {
    async fetchDepartments() {
      try {
        const response = await this.$api.get('/get-departments');
        this.departments = response.data;
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    },
    async fetchExamTypes() {
      try {
        const response = await this.$api.get('/get-exam-types');
        this.exam_types = response.data;
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    },
    async fetchYear() {
      try {
        const response = await this.$api.get('/get-year');
        this.years = response.data;
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    },
    async fetchResults() {
      this.loading = true;
      try {
        const params = {
          page: this.currentPage,
          ...this.filters,
        };
        const response = await this.$api.get('/reports/results', { params });
        this.results = response.data.data.data;
        this.currentPage = response.data.data.current_page;
        this.lastPage = response.data.data.last_page;
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        this.loading = false;
      }
    },
    handleSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.currentPage = 1;
        this.fetchResults();
      }, 500);
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchResults();
      }
    },
    nextPage() {
      if (this.currentPage < this.lastPage) {
        this.currentPage++;
        this.fetchResults();
      }
    },
    async exportResults() {
      try {
        const response = await this.$api.get('/reports/results/export', {
          params: this.filters,
          responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'student-results.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error('Error exporting results:', error);
      }
    },
  },
};
</script>

<style scoped>
/* Main Container */
.report-container {
  padding: 30px;
  /*max-width: 1400px;*/
  /*margin: 0 auto;*/
  background: #f5f7fa;
  min-height: 100vh;
}

/* Header Section */
.report-header {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: white;
  padding: 40px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.report-title {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.report-subtitle {
  margin: 8px 0 0 0;
  font-size: 16px;
  opacity: 0.9;
}

/* Filter Section */
.filter-section {
  background: white;
  padding: 25px;
  border-radius: 12px;
  margin-bottom: 25px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
}

.filter-row {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  align-items: center;
}

.filter-item {
  flex: 1;
  min-width: 200px;
}

.search-input,
.filter-select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: white;
}

.search-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.export-btn {
  padding: 12px 24px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.export-btn:hover {
  background: #059669;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.export-icon {
  font-size: 18px;
}

/* Loading State */
.loading-container {
  text-align: center;
  padding: 60px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Results Card */
.results-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.table-container {
  overflow-x: auto;
}

.results-table {
  width: 100%;
  border-collapse: collapse;
}

.results-table thead {
  background: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
}

.results-table th {
  padding: 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.result-row {
  border-bottom: 1px solid #f3f4f6;
  transition: all 0.2s ease;
}

.result-row:hover {
  background: #f9fafb;
  transform: scale(1.005);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.pass-row {
  background: rgba(16, 185, 129, 0.05);
}

.fail-row {
  background: rgba(239, 68, 68, 0.05);
}

.results-table td {
  padding: 16px;
  font-size: 14px;
  color: #1f2937;
}

.student-info {
  min-width: 180px;
}

.student-name {
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.student-details {
  font-size: 12px;
  color: #6b7280;
}

.exam-badge {
  display: inline-block;
  padding: 4px 12px;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.marks {
  text-align: center;
  font-weight: 500;
}

.total-marks {
  font-weight: 700;
  color: #1e40af;
}

.grade {
  text-align: center;
  font-weight: 700;
  font-size: 16px;
  color: #7c3aed;
}

.gpa {
  text-align: center;
  font-weight: 600;
  color: #059669;
}

.status-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.status-badge.pass {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.fail {
  background: #fee2e2;
  color: #991b1b;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 25px;
  border-top: 1px solid #e5e7eb;
}

.pagination-btn {
  padding: 10px 20px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.pagination-btn:disabled {
  background: #e5e7eb;
  color: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

.page-info {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  margin: 0 0 10px 0;
  color: #111827;
  font-size: 20px;
}

.empty-state p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .filter-row {
    flex-direction: column;
  }

  .filter-item {
    width: 100%;
  }

  .export-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .report-container {
    padding: 15px;
  }

  .report-header {
    padding: 25px;
  }

  .report-title {
    font-size: 24px;
  }

  .table-container {
    overflow-x: scroll;
  }

  .results-table {
    min-width: 1000px;
  }
}
</style>