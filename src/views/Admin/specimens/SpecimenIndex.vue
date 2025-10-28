<template>
  <div class="specimens-container">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">
          <i class="fas fa-vial"></i> Specimens Management
        </h1>
<!--        <p class="page-subtitle">Manage all laboratory specimens</p>-->
      </div>
      <button @click="openCreateModal" class="btn-primary">
        <i class="fas fa-plus"></i> Add New Specimen
      </button>
    </div>

    <!-- Filters Section -->
    <div class="filters-section">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input
            type="text"
            v-model="filters.search"
            @input="debounceSearch"
            placeholder="Search specimens..."
        />
      </div>

      <div class="filter-group">
        <select v-model="filters.department_id" @change="fetchSpecimens" class="filter-select">
          <option value="">All Departments</option>
          <option v-for="dept in departments" :key="dept.id" :value="dept.id">
            {{ dept.name }}
          </option>
        </select>

        <select v-model="filters.is_available" @change="fetchSpecimens" class="filter-select">
          <option value="">All Status</option>
          <option value="1">Available</option>
          <option value="0">Not Available</option>
        </select>

        <button @click="clearFilters" class="btn-clear">
          <i class="fas fa-times"></i> Clear
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading specimens...</p>
    </div>

    <!-- Specimens Grid -->
    <div v-else-if="specimens.length > 0" class="specimens-grid">
      <specimen-card
          v-for="specimen in specimens"
          :key="specimen.id"
          :specimen="specimen"
          @edit="openEditModal"
          @delete="deleteSpecimen"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <i class="fas fa-flask"></i>
      <h3>No Specimens Found</h3>
      <p>Start by adding your first specimen</p>
      <button @click="openCreateModal" class="btn-primary">
        <i class="fas fa-plus"></i> Add Specimen
      </button>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.last_page > 1" class="pagination">
      <button
          @click="changePage(pagination.current_page - 1)"
          :disabled="pagination.current_page === 1"
          class="pagination-btn"
      >
        <i class="fas fa-chevron-left"></i> Previous
      </button>

      <span class="pagination-info">
        Page {{ pagination.current_page }} of {{ pagination.last_page }}
      </span>

      <button
          @click="changePage(pagination.current_page + 1)"
          :disabled="pagination.current_page === pagination.last_page"
          class="pagination-btn"
      >
        Next <i class="fas fa-chevron-right"></i>
      </button>
    </div>

    <!-- Form Modal -->
    <specimen-form
        v-if="showModal"
        :specimen="selectedSpecimen"
        :departments="departments"
        @close="closeModal"
        @saved="onSpecimenSaved"
    />
  </div>
</template>

<script>
import SpecimenCard from './SpecimenCard.vue';
import SpecimenForm from './SpecimenForm.vue';

export default {
  name: 'SpecimenIndex',
  components: {
    SpecimenCard,
    SpecimenForm
  },
  data() {
    return {
      specimens: [],
      departments: [],
      loading: false,
      showModal: false,
      selectedSpecimen: null,
      filters: {
        search: '',
        department_id: '',
        is_available: ''
      },
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 12,
        total: 0
      },
      searchTimeout: null
    };
  },
  mounted() {
    this.fetchSpecimens();
    this.fetchDepartments();
  },
  methods: {
    async fetchSpecimens(page = 1) {
      this.loading = true;
      try {
        const params = {
          page,
          ...this.filters
        };

        const response = await this.$api.get('/specimens', { params });
        this.specimens = response.data.data;
        this.pagination = {
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          per_page: response.data.per_page,
          total: response.data.total
        };
      } catch (error) {
        this.$toast.error('Failed to load specimens');
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    async fetchDepartments() {
      try {
        const response = await this.$api.get('/specimens/departments/list');
        this.departments = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    debounceSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.fetchSpecimens();
      }, 500);
    },

    clearFilters() {
      this.filters = {
        search: '',
        department_id: '',
        is_available: ''
      };
      this.fetchSpecimens();
    },

    changePage(page) {
      if (page >= 1 && page <= this.pagination.last_page) {
        this.fetchSpecimens(page);
      }
    },

    openCreateModal() {
      this.selectedSpecimen = null;
      this.showModal = true;
    },

    openEditModal(specimen) {
      this.selectedSpecimen = specimen;
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.selectedSpecimen = null;
    },

    onSpecimenSaved() {
      this.closeModal();
      this.fetchSpecimens(this.pagination.current_page);
    },

    async deleteSpecimen(specimen) {
      if (!confirm(`Are you sure you want to delete "${specimen.specimen_name}"?`)) {
        return;
      }

      try {
        await this.$api.delete(`/specimens/${specimen.id}`);
        this.$toast.success('Specimen deleted successfully!');
        this.fetchSpecimens(this.pagination.current_page);
      } catch (error) {
        this.$toast.error('Failed to delete specimen');
        console.error(error);
      }
    }
  }
};
</script>

<style scoped>
.specimens-container {
  padding: 2rem;
  /*max-width: 1400px;*/
  /*margin: 0 auto;*/
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-left {
  flex: 1;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
}

.page-title i {
  color: #667eea;
}

.page-subtitle {
  color: white;
  margin: 0;
  font-size: 0.95rem;
}

/* Filters */
.filters-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 250px;
  position: relative;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
}

.search-box input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s;
}

.search-box input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.filter-group {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 150px;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
}

/* Buttons */
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
  box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(102, 126, 234, 0.4);
}

.btn-clear {
  background: #f7fafc;
  color: #4a5568;
  border: 2px solid #e2e8f0;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.btn-clear:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
}

/* Loading */
.loading-state {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Grid */
.specimens-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.empty-state i {
  font-size: 4rem;
  color: #cbd5e0;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  color: #718096;
  margin: 0 0 1.5rem 0;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 2rem 0;
}

.pagination-btn {
  padding: 0.75rem 1.25rem;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-btn:hover:not(:disabled) {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-weight: 500;
  color: #4a5568;
}

/* Responsive */
@media (max-width: 768px) {
  .specimens-container {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .filters-section {
    flex-direction: column;
  }

  .filter-group {
    width: 100%;
  }

  .filter-select {
    flex: 1;
  }

  .specimens-grid {
    grid-template-columns: 1fr;
  }
}
</style>