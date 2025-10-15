<template>
  <div class="book-management">
    <!-- Header -->
    <div class="management-header">
      <div class="header-content">
        <h1 class="page-title">
          <i class="fas fa-books"></i>
          Book Management
        </h1>
        <button @click="openCreateModal" class="btn btn-primary">
          <i class="fas fa-plus"></i>
          Add New Book
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-container">
      <div class="stat-card">
        <i class="fas fa-book stat-icon"></i>
        <div class="stat-info">
          <h3>{{ stats.total }}</h3>
          <p>Total Books</p>
        </div>
      </div>
      <div class="stat-card">
        <i class="fas fa-check-circle stat-icon active"></i>
        <div class="stat-info">
          <h3>{{ stats.active }}</h3>
          <p>Active Books</p>
        </div>
      </div>
      <div class="stat-card">
        <i class="fas fa-star stat-icon featured"></i>
        <div class="stat-info">
          <h3>{{ stats.featured }}</h3>
          <p>Featured Books</p>
        </div>
      </div>
      <div class="stat-card">
        <i class="fas fa-eye-slash stat-icon inactive"></i>
        <div class="stat-info">
          <h3>{{ stats.inactive }}</h3>
          <p>Inactive Books</p>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="filters-section">
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input
            v-model="searchQuery"
            @input="debounceSearch"
            type="text"
            placeholder="Search by book name, author or ISBN..."
        />
      </div>

      <div class="filter-controls">
        <select v-model="filters.status" @change="applyFilters" class="filter-select">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <select v-model="filters.category_id" @change="applyFilters" class="filter-select">
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>

        <select v-model="filters.sort_by" @change="applyFilters" class="filter-select">
          <option value="created_at">Newest First</option>
          <option value="title">Name (A-Z)</option>
          <option value="popular">Popular</option>
          <option value="rating">Rating</option>
        </select>
      </div>
    </div>

    <!-- Books Table -->
    <div class="table-container">
      <!-- Loading -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="!books.length" class="empty-state">
        <i class="fas fa-inbox empty-icon"></i>
        <h3>No books found</h3>
        <p>Add new book or use different filters</p>
      </div>

      <!-- Table -->
      <table v-else class="books-table">
        <thead>
        <tr>
          <th width="80">#</th>
          <th width="100">Cover</th>
          <th>Book Name</th>
          <th>Author</th>
          <th width="120">Category</th>
          <th width="100" class="text-center">Rating</th>
          <th width="100" class="text-center">Downloads</th>
          <th width="100" class="text-center">Status</th>
          <th width="200" class="text-center">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(book, index) in books" :key="book.id">
          <td>{{ (pagination.current_page - 1) * pagination.per_page + index + 1 }}</td>
          <td>
            <img :src="fullImageUrl(book.cover_image_url)" :alt="book.title" class="book-thumbnail" />
          </td>
          <td>
            <div class="book-title-cell">
              <strong>{{ book.title }}</strong>
              <span v-if="book.is_featured" class="featured-tag">
                  <i class="fas fa-star"></i> Featured
                </span>
            </div>
          </td>
          <td>{{ book.author }}</td>
          <td>
              <span v-if="book.category" class="category-badge">
                {{ book.category.name }}
              </span>
          </td>
          <td class="text-center">
            <div class="rating-cell">
              <i class="fas fa-star"></i>
              {{ book.rating }}
            </div>
          </td>
          <td class="text-center">
            <div class="count-cell">
              <i class="fas fa-download"></i>
              {{ book.download_count }}
            </div>
          </td>
          <td class="text-center">
              <span :class="['status-badge', book.is_active ? 'active' : 'inactive']">
                {{ book.is_active ? 'Active' : 'Inactive' }}
              </span>
          </td>
          <td class="text-center">
            <div class="action-buttons">
              <button
                  @click="viewBook(book)"
                  class="action-btn view-btn"
                  title="View Details"
              >
                <i class="fas fa-eye"></i>
              </button>
              <button
                  @click="editBook(book)"
                  class="action-btn edit-btn"
                  title="Edit"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button
                  @click="toggleBookStatus(book)"
                  class="action-btn toggle-btn"
                  :title="book.is_active ? 'Deactivate' : 'Activate'"
              >
                <i :class="book.is_active ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
              <button
                  @click="deleteBook(book)"
                  class="action-btn delete-btn"
                  title="Delete"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="pagination.last_page > 1" class="pagination">
        <button
            @click="changePage(pagination.current_page - 1)"
            :disabled="pagination.current_page === 1"
            class="page-btn"
        >
          <i class="fas fa-chevron-left"></i>
        </button>

        <button
            v-for="page in visiblePages"
            :key="page"
            @click="changePage(page)"
            :class="['page-btn', { active: page === pagination.current_page }]"
            :disabled="page === '...'"
        >
          {{ page }}
        </button>

        <button
            @click="changePage(pagination.current_page + 1)"
            :disabled="pagination.current_page === pagination.last_page"
            class="page-btn"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <transition name="modal-fade">
      <div v-if="showFormModal" class="modal-overlay" @click.self="closeFormModal">
        <div class="modal-container large">
          <book-form
              :book="selectedBook"
              :categories="categories"
              :departments="departments"
              :subjects="subjects"
              :modal="true"
              @close="closeFormModal"
              @success="onBookSaved"
          />
        </div>
      </div>
    </transition>

    <!-- View Modal -->
    <book-details-modal
        v-if="showViewModal"
        :book="selectedBook"
        @close="showViewModal = false"
    />
  </div>
</template>

<script>

import BookForm from './BookForm.vue';
import BookDetailsModal from './BookDetailsModal.vue';
import api from "@/plugins/api";

export default {
  name: 'BookManagement',

  components: {
    BookForm,
    BookDetailsModal,
  },

  data() {
    return {
      loading: false,
      books: [],
      categories: [],
      departments: [],
      subjects: [],

      searchQuery: '',
      searchTimeout: null,

      filters: {
        status: '',
        category_id: '',
        sort_by: 'created_at',
      },

      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
      },

      stats: {
        total: 0,
        active: 0,
        inactive: 0,
        featured: 0,
      },

      showFormModal: false,
      showViewModal: false,
      selectedBook: null,
    };
  },

  computed: {
    visiblePages() {
      const current = this.pagination.current_page;
      const last = this.pagination.last_page;
      const delta = 2;
      const pages = [];

      for (let i = Math.max(2, current - delta); i <= Math.min(last - 1, current + delta); i++) {
        pages.push(i);
      }

      if (current - delta > 2) {
        pages.unshift('...');
      }
      if (current + delta < last - 1) {
        pages.push('...');
      }

      pages.unshift(1);
      if (last > 1) {
        pages.push(last);
      }

      return pages;
    },
  },

  mounted() {
    this.fetchBooks();
    this.fetchCategories();
    this.fetchStats();
    this.fetchDepartments();
    this.fetchSubject();
  },

  methods: {
    async fetchBooks() {
      this.loading = true;
      try {
        const params = {
          page: this.pagination.current_page,
          per_page: this.pagination.per_page,
          search: this.searchQuery,
          ...this.filters,
        };

        const response = await this.$api.get('/library/books', { params });

        this.books = response.data.data.data;
        this.pagination = {
          current_page: response.data.data.current_page,
          last_page: response.data.data.last_page,
          per_page: response.data.data.per_page,
          total: response.data.data.total,
        };
      } catch (error) {
        console.error('Error fetching books:', error);
        alert('Error loading books');
      } finally {
        this.loading = false;
      }
    },
    async fetchDepartments() {
      try {
        const response = await this.$api.get('/get-departments');
        this.departments = response.data.data || response.data;
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    },
    async fetchSubject() {
      try {
        const response = await this.$api.get('/get-subjects');
        this.subjects = response.data.data || response.data;
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    },
    async fetchCategories() {
      try {
        const response = await this.$api.get('/get-category');
        this.categories = response.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    async fetchStats() {
      try {
        // This would ideally come from a dedicated stats endpoint
        // For now, we'll calculate from the current data
        const response = await this.$api.get('/library/books?per_page=1000');
        const allBooks = response.data.data.data;

        this.stats = {
          total: allBooks.length,
          active: allBooks.filter(b => b.is_active).length,
          inactive: allBooks.filter(b => !b.is_active).length,
          featured: allBooks.filter(b => b.is_featured).length,
        };
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    },
    fullImageUrl(path) {
      const baseURL = api.defaults.baseURL.replace('/api/', '');
      return path ? `${baseURL}${path}` : `${baseURL}/images/default-book.jpg`;
    },
    debounceSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.pagination.current_page = 1;
        this.fetchBooks();
      }, 500);
    },
    applyFilters() {
      this.pagination.current_page = 1;
      this.fetchBooks();
    },
    changePage(page) {
      if (page !== '...' && page >= 1 && page <= this.pagination.last_page) {
        this.pagination.current_page = page;
        this.fetchBooks();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    openCreateModal() {
      this.selectedBook = null;
      this.showFormModal = true;
    },
    viewBook(book) {
      this.selectedBook = book;
      this.showViewModal = true;
    },
    editBook(book) {
      this.selectedBook = book;
      this.showFormModal = true;
    },

    async toggleBookStatus(book) {
      try {
        const newStatus = !book.is_active;
        await this.$api.put(`/library/books/${book.id}`, {
          is_active: newStatus,
        });

        book.is_active = newStatus;
        this.fetchStats();

        alert(`Book has been ${newStatus ? 'activated' : 'deactivated'}`);
      } catch (error) {
        console.error('Error toggling book status:', error);
        alert('Error changing status');
      }
    },

    async deleteBook(book) {
      if (!confirm(`Do you want to delete "${book.title}" book?`)) {
        return;
      }

      try {
        await this.$api.delete(`/library/books/${book.id}`);

        this.fetchBooks();
        this.fetchStats();

        alert('Book deleted successfully');
      } catch (error) {
        console.error('Error deleting book:', error);
        alert('Error deleting book');
      }
    },

    closeFormModal() {
      this.showFormModal = false;
      this.selectedBook = null;
    },

    onBookSaved(book) {
      console.log(book)
      this.fetchBooks();
      this.fetchStats();
      this.closeFormModal();
    },
  },
};
</script>

<style scoped>
/* All styles remain exactly the same */
.book-management {
  padding: 20px;
  background: #f8f9fa;
  min-height: 100vh;
}

/* Header */
.management-header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 40px;
  border-radius: 20px;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  color: white;
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 15px;
}

/* Stats Cards */
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 2.5rem;
  color: #667eea;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea20, #764ba220);
  border-radius: 15px;
}

.stat-icon.active {
  color: #52c234;
  background: linear-gradient(135deg, #52c23420, #4caf5020);
}

.stat-icon.featured {
  color: #FFD700;
  background: linear-gradient(135deg, #FFD70020, #FFA50020);
}

.stat-icon.inactive {
  color: #e74c3c;
  background: linear-gradient(135deg, #e74c3c20, #c0392b20);
}

.stat-info h3 {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.stat-info p {
  color: #666;
  margin: 5px 0 0;
}

/* Filters */
.filters-section {
  max-width: 1400px;
  margin: 0 auto 30px;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 300px;
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border-radius: 15px;
  padding: 0 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.search-box i {
  color: #999;
  font-size: 1.2rem;
  margin-right: 15px;
}

.search-box input {
  flex: 1;
  border: none;
  outline: none;
  padding: 18px 0;
  font-size: 1rem;
}

.filter-controls {
  display: flex;
  gap: 15px;
}

.filter-select {
  padding: 15px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 15px;
  background: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
}

/* Table */
.table-container {
  max-width: 1400px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.books-table {
  width: 100%;
  border-collapse: collapse;
}

.books-table thead {
  background: #f8f9fa;
}

.books-table th {
  padding: 15px;
  text-align: left;
  font-weight: 700;
  color: #333;
  border-bottom: 2px solid #e0e0e0;
}

.books-table th.text-center {
  text-align: center;
}

.books-table td {
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.books-table td.text-center {
  text-align: center;
}

.books-table tbody tr {
  transition: background 0.3s;
}

.books-table tbody tr:hover {
  background: #f8f9fa;
}

.book-thumbnail {
  width: 60px;
  height: 85px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
}

.book-title-cell {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.featured-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: white;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  width: fit-content;
}

.category-badge {
  display: inline-block;
  padding: 5px 12px;
  background: #667eea;
  color: white;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.rating-cell,
.count-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-weight: 600;
  color: #666;
}

.rating-cell i {
  color: #FFD700;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-badge.active {
  background: #52c23420;
  color: #52c234;
}

.status-badge.inactive {
  background: #e74c3c20;
  color: #e74c3c;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.action-btn {
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: white;
  font-size: 0.95rem;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-btn {
  background: #3498db;
}

.view-btn:hover {
  background: #2980b9;
  transform: translateY(-2px);
}

.edit-btn {
  background: #f39c12;
}

.edit-btn:hover {
  background: #e67e22;
  transform: translateY(-2px);
}

.toggle-btn {
  background: #9b59b6;
}

.toggle-btn:hover {
  background: #8e44ad;
  transform: translateY(-2px);
}

.delete-btn {
  background: #e74c3c;
}

.delete-btn:hover {
  background: #c0392b;
  transform: translateY(-2px);
}

/* Loading & Empty States */
.loading-state,
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 5rem;
  color: #ddd;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #666;
  margin-bottom: 10px;
}

.empty-state p {
  color: #999;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 30px;
}

.page-btn {
  min-width: 45px;
  height: 45px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  color: #666;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
}

.page-btn.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: #667eea;
  color: white;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  overflow-y: auto;
}

.modal-container {
  max-width: 1200px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-container.large {
  max-width: 1400px;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

/* Buttons */
.btn {
  padding: 15px 30px;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s;
  font-size: 1rem;
}

.btn-primary {
  background: white;
  color: #667eea;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 255, 255, 0.3);
}

/* Responsive */
@media (max-width: 1200px) {
  .books-table {
    font-size: 0.9rem;
  }

  .action-buttons {
    flex-wrap: wrap;
  }
}

@media (max-width: 968px) {
  .header-content {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .filters-section {
    flex-direction: column;
  }

  .filter-controls {
    flex-direction: column;
  }

  .filter-select {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.8rem;
  }

  .books-table {
    display: block;
    overflow-x: auto;
  }

  .stats-container {
    grid-template-columns: 1fr;
  }
}
</style>