<template>
  <div class="card-structure-levels">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-md-6">
        <h2 class="fw-bold">Card Structure Levels</h2>
        <p class="text-muted">Manage hierarchical card structure levels</p>
      </div>
      <div class="col-md-6 text-md-end">
        <router-link to="/card-structure-levels/create" class="btn btn-primary">
          <i class="bi bi-plus-circle me-2"></i>New Structure Level
        </router-link>
      </div>
    </div>

    <!-- Filters -->
    <div class="card mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-3">
            <select v-model="filters.card_type_id" @change="loadLevels" class="form-select">
              <option value="">All Card Types</option>
              <!-- Dynamic card types -->
            </select>
          </div>
          <div class="col-md-3">
            <select v-model="filters.level_type" @change="loadLevels" class="form-select">
              <option value="">All Level Types</option>
              <option value="topic">Topic</option>
              <option value="item">Item</option>
              <option value="content">Content</option>
              <option value="sub_content">Sub Content</option>
            </select>
          </div>
          <div class="col-md-3">
            <select v-model="filters.is_active" @change="loadLevels" class="form-select">
              <option value="">All Status</option>
              <option value="1">Active</option>
              <option value="0">Inactive</option>
            </select>
          </div>
          <div class="col-md-3">
            <button @click="clearFilters" class="btn btn-secondary w-100">
              <i class="bi bi-arrow-clockwise me-2"></i>Clear Filters
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <!-- Table -->
    <div v-else class="card">
      <div class="table-responsive">
        <table class="table table-hover mb-0">
          <thead class="table-light">
          <tr>
            <th>Level #</th>
            <th>Title</th>
            <th>Type</th>
            <th>Card Type</th>
            <th>Parent</th>
            <th>Max Marks</th>
            <th>Sequence</th>
            <th>Status</th>
            <th class="text-end">Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="levels.length === 0">
            <td colspan="9" class="text-center py-4 text-muted">No levels found</td>
          </tr>
          <tr v-for="level in levels" :key="level.id">
            <td><strong>{{ level.level_number }}</strong></td>
            <td>{{ level.title }}</td>
            <td>
              <span class="badge bg-info">{{ formatLevelType(level.level_type) }}</span>
            </td>
            <td>{{ level.card_type ? level.card_type.name : 'N/A' }}</td>
            <td>{{ level.parent ? level.parent.title : 'Root' }}</td>
            <td>{{ level.max_marks || 0 }}</td>
            <td>{{ level.sequence }}</td>
            <td>
                <span class="badge" :class="level.is_active ? 'bg-success' : 'bg-secondary'">
                  {{ level.is_active ? 'Active' : 'Inactive' }}
                </span>
            </td>
            <td class="text-end">
              <div class="btn-group btn-group-sm">
                <router-link :to="`/card-structure-levels/${level.id}/edit`" class="btn btn-warning">
                  <i class="bi bi-pencil"></i>
                </router-link>
                <button @click="confirmDelete(level)" class="btn btn-danger">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.total > 0" class="card-footer">
        <div class="row align-items-center">
          <div class="col-md-6">
            <p class="mb-0 text-muted">
              Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} records
            </p>
          </div>
          <div class="col-md-6">
            <nav>
              <ul class="pagination pagination-sm mb-0 justify-content-end">
                <li class="page-item" :class="{ disabled: pagination.current_page === 1 }">
                  <a class="page-link" @click.prevent="changePage(pagination.current_page - 1)" href="#">Previous</a>
                </li>
                <li v-for="page in visiblePages" :key="page" class="page-item" :class="{ active: page === pagination.current_page }">
                  <a class="page-link" @click.prevent="changePage(page)" href="#">{{ page }}</a>
                </li>
                <li class="page-item" :class="{ disabled: pagination.current_page === pagination.last_page }">
                  <a class="page-link" @click.prevent="changePage(pagination.current_page + 1)" href="#">Next</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <div v-if="deleteModal.show" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirm Delete</h5>
            <button type="button" class="btn-close" @click="deleteModal.show = false"></button>
          </div>
          <div class="modal-body">
            Are you sure you want to delete this structure level?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="deleteModal.show = false">Cancel</button>
            <button type="button" class="btn btn-danger" @click="deleteLevel">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/plugins/card';

export default {
  name: 'CardStructureLevelList',
  data() {
    return {
      levels: [],
      loading: false,
      filters: {
        card_type_id: '',
        level_type: '',
        is_active: ''
      },
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
        from: 0,
        to: 0
      },
      deleteModal: {
        show: false,
        level: null
      }
    };
  },
  computed: {
    visiblePages() {
      const pages = [];
      const currentPage = this.pagination.current_page;
      const lastPage = this.pagination.last_page;
      const delta = 2;

      for (let i = Math.max(2, currentPage - delta); i <= Math.min(lastPage - 1, currentPage + delta); i++) {
        pages.push(i);
      }

      if (currentPage - delta > 2) pages.unshift('...');
      if (currentPage + delta < lastPage - 1) pages.push('...');

      pages.unshift(1);
      if (lastPage !== 1) pages.push(lastPage);

      return pages.filter((value, index, self) => self.indexOf(value) === index);
    }
  },
  mounted() {
    this.loadLevels();
  },
  methods: {
    async loadLevels() {
      this.loading = true;
      try {
        const params = {
          page: this.pagination.current_page,
          per_page: this.pagination.per_page,
          ...this.filters
        };

        const response = await api.cardStructureLevels.getAll(params);
        this.levels = response.data.data;
        this.pagination = {
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          per_page: response.data.per_page,
          total: response.data.total,
          from: response.data.from,
          to: response.data.to
        };
      } catch (error) {
        this.$root.$emit('show-notification', {
          message: 'Failed to load structure levels',
          type: 'danger'
        });
      } finally {
        this.loading = false;
      }
    },
    changePage(page) {
      if (page >= 1 && page <= this.pagination.last_page && page !== '...') {
        this.pagination.current_page = page;
        this.loadLevels();
      }
    },
    clearFilters() {
      this.filters = {
        card_type_id: '',
        level_type: '',
        is_active: ''
      };
      this.pagination.current_page = 1;
      this.loadLevels();
    },
    confirmDelete(level) {
      this.deleteModal = { show: true, level: level };
    },
    async deleteLevel() {
      try {
        await api.cardStructureLevels.delete(this.deleteModal.level.id);
        this.$root.$emit('show-notification', {
          message: 'Structure level deleted successfully',
          type: 'success'
        });
        this.deleteModal.show = false;
        this.loadLevels();
      } catch (error) {
        this.$root.$emit('show-notification', {
          message: error.response?.data?.message || 'Failed to delete level',
          type: 'danger'
        });
      }
    },
    formatLevelType(type) {
      return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  }
};
</script>