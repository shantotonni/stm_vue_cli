<template>
  <div class="e-library-container">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          <i class="fas fa-book-open"></i>
          Digital Library
        </h1>
        <p class="hero-subtitle">
          Thousands of books at your fingertips - Read, Learn, Progress
        </p>

        <!-- Search Bar -->
        <div class="search-container">
          <div class="search-wrapper">
            <i class="fas fa-search search-icon"></i>
            <input
                type="text"
                v-model="searchQuery"
                @input="debounceSearch"
                placeholder="Search by book name, author or ISBN..."
                class="search-input"
            />
            <button v-if="searchQuery" @click="clearSearch" class="clear-btn">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="stats-grid">
        <div class="stat-card">
          <i class="fas fa-book stat-icon"></i>
          <div class="stat-info">
            <h3>{{ stats.totalBooks }}</h3>
            <p>Total Books</p>
          </div>
        </div>
        <div class="stat-card">
          <i class="fas fa-download stat-icon"></i>
          <div class="stat-info">
            <h3>{{ stats.totalDownloads }}</h3>
            <p>Downloads</p>
          </div>
        </div>
        <div class="stat-card">
          <i class="fas fa-users stat-icon"></i>
          <div class="stat-info">
            <h3>{{ stats.totalReaders }}</h3>
            <p>Readers</p>
          </div>
        </div>
        <div class="stat-card">
          <i class="fas fa-layer-group stat-icon"></i>
          <div class="stat-info">
            <h3>{{ stats.totalCategories }}</h3>
            <p>Categories</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Books -->
    <section v-if="featuredBooks.length" class="section featured-section">
      <div class="section-header">
        <h2 class="section-title">
          <i class="fas fa-star"></i>
          Featured Books
        </h2>
        <a href="#" class="view-all-link">View All →</a>
      </div>
      <div class="books-carousel">
        <book-card
            v-for="book in featuredBooks"
            :key="book.id"
            :book="book"
            @view-details="viewBookDetails"
            @toggle-favorite="toggleFavorite"
        />
      </div>
    </section>

    <!-- Filters and Books Grid -->
    <section class="section main-section">
      <div class="content-wrapper">
        <!-- Sidebar Filters -->
        <aside class="filters-sidebar">
          <div class="filter-card">
            <h3 class="filter-title">
              <i class="fas fa-filter"></i>
              Filters
            </h3>

            <!-- Category Filter -->
            <div class="filter-group">
              <label class="filter-label">Category</label>
              <select v-model="filters.category_id" @change="applyFilters" class="filter-select">
                <option value="">All Categories</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }} ({{ cat.active_books_count }})
                </option>
              </select>
            </div>

            <!-- Department Filter -->
            <div class="filter-group">
              <label class="filter-label">Department</label>
              <select v-model="filters.department_id" @change="onDepartmentChange" class="filter-select">
                <option value="">All Departments</option>
                <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                  {{ dept.name }}
                </option>
              </select>
            </div>

            <!-- Subject Filter -->
            <div class="filter-group" v-if="subjects.length">
              <label class="filter-label">Subject</label>
              <select v-model="filters.subject_id" @change="applyFilters" class="filter-select">
                <option value="">All Subjects</option>
                <option v-for="sub in subjects" :key="sub.id" :value="sub.id">
                  {{ sub.name }}
                </option>
              </select>
            </div>

            <!-- Language Filter -->
            <div class="filter-group">
              <label class="filter-label">Language</label>
              <select v-model="filters.language" @change="applyFilters" class="filter-select">
                <option value="">All Languages</option>
                <option value="Bengali">Bengali</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
              </select>
            </div>

            <!-- Sort By -->
            <div class="filter-group">
              <label class="filter-label">Sort By</label>
              <select v-model="filters.sort_by" @change="applyFilters" class="filter-select">
                <option value="created_at">Newest First</option>
                <option value="popular">Popular</option>
                <option value="rating">Rating</option>
                <option value="title">Name (A-Z)</option>
              </select>
            </div>

            <!-- Clear Filters -->
            <button @click="clearFilters" class="clear-filters-btn">
              <i class="fas fa-redo"></i>
              Reset Filters
            </button>
          </div>
        </aside>

        <!-- Books Grid -->
        <div class="books-content">
          <div class="books-header">
            <h2 class="books-count">
              {{ pagination.total }} books found
            </h2>
            <div class="view-toggle">
              <button
                  @click="viewMode = 'grid'"
                  :class="['view-btn', { active: viewMode === 'grid' }]"
              >
                <i class="fas fa-th"></i>
              </button>
              <button
                  @click="viewMode = 'list'"
                  :class="['view-btn', { active: viewMode === 'list' }]"
              >
                <i class="fas fa-list"></i>
              </button>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Loading...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="!books.length" class="empty-state">
            <i class="fas fa-book-open empty-icon"></i>
            <h3>No books found</h3>
            <p>Try searching with something else</p>
          </div>

          <!-- Books Grid/List -->
          <div v-else :class="['books-grid', viewMode]">
            <book-card
                v-for="book in books"
                :key="book.id"
                :book="book"
                :view-mode="viewMode"
                @view-details="viewBookDetails"
                @toggle-favorite="toggleFavorite"
            />
          </div>

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
      </div>
    </section>

    <!-- Book Details Modal -->
    <book-details-modal
        v-if="showBookDetails"
        :book="selectedBook"
        @close="showBookDetails = false"
        @download="downloadBook"
        @toggle-favorite="toggleFavorite"
        @rate="rateBook"
    />
  </div>
</template>

<script>

import BookCard from './BookCard.vue';
import BookDetailsModal from './BookDetailsModal.vue';
// import api from "@/plugins/api";

export default {
  name: 'ELibrary',

  components: {
    BookCard,
    BookDetailsModal,
  },

  data() {
    return {
      searchQuery: '',
      searchTimeout: null,
      loading: false,
      viewMode: 'grid', // grid or list

      books: [],
      featuredBooks: [],
      categories: [],
      departments: [],
      subjects: [],

      filters: {
        category_id: '',
        department_id: '',
        subject_id: '',
        language: '',
        sort_by: 'created_at',
        sort_order: 'desc',
      },

      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 12,
        total: 0,
      },

      stats: {
        totalBooks: 0,
        totalDownloads: 0,
        totalReaders: 0,
        totalCategories: 0,
      },

      showBookDetails: false,
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
    this.loadInitialData();
  },

  methods: {
    async loadInitialData() {
      await Promise.all([
        this.fetchBooks(),
        this.fetchFeaturedBooks(),
        this.fetchCategories(),
        this.fetchDepartments(),
      ]);
    },

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

        this.stats.totalBooks = response.data.data.total;
      } catch (error) {
        console.error('Error fetching books:', error);
        this.$toast.error('Error loading books');
      } finally {
        this.loading = false;
      }
    },

    async fetchFeaturedBooks() {
      try {
        const response = await this.$api.get('/library/books/featured');
        this.featuredBooks = response.data.data;
      } catch (error) {
        console.error('Error fetching featured books:', error);
      }
    },

    async fetchCategories() {
      try {
        const response = await this.$api.get('/get-category');
        this.categories = response.data;
        this.stats.totalCategories = response.data.length;
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },

    async fetchDepartments() {
      try {
        const response = await this.$api.get('/get-departments');
        this.departments = response.data;
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    },

    async fetchSubjects() {
      if (!this.filters.department_id) {
        this.subjects = [];
        return;
      }

      try {
        const response = await this.$api.get('/get-subjects', {
          params: { department_id: this.filters.department_id },
        });
        this.subjects = response.data;
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    },

    debounceSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.pagination.current_page = 1;
        this.fetchBooks();
      }, 500);
    },

    clearSearch() {
      this.searchQuery = '';
      this.fetchBooks();
    },

    applyFilters() {
      this.pagination.current_page = 1;
      this.fetchBooks();
    },

    onDepartmentChange() {
      this.filters.subject_id = '';
      this.fetchSubjects();
      this.applyFilters();
    },

    clearFilters() {
      this.filters = {
        category_id: '',
        department_id: '',
        subject_id: '',
        language: '',
        sort_by: 'created_at',
        sort_order: 'desc',
      };
      this.subjects = [];
      this.applyFilters();
    },

    changePage(page) {
      if (page !== '...' && page >= 1 && page <= this.pagination.last_page) {
        this.pagination.current_page = page;
        this.fetchBooks();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    viewBookDetails(book) {
      this.selectedBook = book;
      this.showBookDetails = true;
    },

    async toggleFavorite(bookId) {
      try {
        const response = await this.$api.post(`/library/books/${bookId}/favorite`);

        // Update book in list
        const book = this.books.find(b => b.id === bookId);
        if (book) {
          book.is_favorited = response.data.is_favorited;
        }

        // Update in featured
        const featuredBook = this.featuredBooks.find(b => b.id === bookId);
        if (featuredBook) {
          featuredBook.is_favorited = response.data.is_favorited;
        }

        this.$toast.success(response.data.message);
      } catch (error) {
        console.error('Error toggling favorite:', error);
        this.$toast.error('An error occurred');
      }
    },

    async downloadBook(bookId) {
      try {
        const response = await this.$api.get(`/library/books/${bookId}/download`, {
          responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'book.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();

        this.$toast.success('Download started');
      } catch (error) {
        console.error('Error downloading book:', error);
        this.$toast.error('Error downloading');
      }
    },

    async rateBook(bookId, rating, review) {
      try {
        await this.$api.post(`/library/books/${bookId}/rate`, {
          rating,
          review,
        });

        this.$toast.success('Rating successful');
        this.fetchBooks();
      } catch (error) {
        console.error('Error rating book:', error);
        this.$toast.error('Error rating book');
      }
    },
  },
};
</script>

<style scoped>
/* Container */
.e-library-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-attachment: fixed;
}

/* Hero Section */
.hero-section {
  padding: 80px 20px;
  text-align: center;
  color: white;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.hero-title i {
  margin-right: 1rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.hero-subtitle {
  font-size: 1.3rem;
  margin-bottom: 2.5rem;
  opacity: 0.95;
}

.search-container {
  max-width: 600px;
  margin: 0 auto;
}

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border-radius: 50px;
  padding: 0 25px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  transition: all 0.3s;
}

.search-wrapper:focus-within {
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}

.search-icon {
  color: #667eea;
  font-size: 1.2rem;
  margin-right: 15px;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 20px 0;
  font-size: 1.1rem;
  color: #333;
}

.clear-btn {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 5px;
  transition: color 0.3s;
}

.clear-btn:hover {
  color: #667eea;
}

/* Stats Section */
.stats-section {
  padding: 40px 20px;
  max-width: 1200px;
  margin: -40px auto 0;
  position: relative;
  z-index: 10;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  padding: 30px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 2.5rem;
  color: #667eea;
  background: linear-gradient(135deg, #667eea20, #764ba220);
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
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
  font-size: 0.95rem;
}

/* Sections */
.section {
  padding: 60px 20px;
  background: white;
}

.featured-section {
  background: #f8f9fa;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto 30px;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  display: flex;
  align-items: center;
  gap: 15px;
}

.section-title i {
  color: #667eea;
}

.view-all-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s;
}

.view-all-link:hover {
  color: #764ba2;
  transform: translateX(5px);
}

/* Books Carousel */
.books-carousel {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  max-width: 1400px;
  margin: 0 auto;
}

/* Main Content */
.main-section {
  background: #f8f9fa;
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 30px;
}

/* Filters Sidebar */
.filters-sidebar {
  position: sticky;
  top: 20px;
  height: fit-content;
}

.filter-card {
  background: white;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.filter-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-title i {
  color: #667eea;
}

.filter-group {
  margin-bottom: 20px;
}

.filter-label {
  display: block;
  font-weight: 600;
  color: #555;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.filter-select {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 0.95rem;
  color: #333;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.clear-filters-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s;
}

.clear-filters-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

/* Books Content */
.books-content {
  min-height: 500px;
}

.books-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.books-count {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
}

.view-toggle {
  display: flex;
  gap: 10px;
}

.view-btn {
  width: 45px;
  height: 45px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1.1rem;
  color: #666;
  transition: all 0.3s;
}

.view-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.view-btn.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: #667eea;
  color: white;
}

/* Loading & Empty States */
.loading-state,
.empty-state {
  text-align: center;
  padding: 80px 20px;
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

/* Books Grid */
.books-grid {
  display: grid;
  gap: 30px;
  margin-bottom: 40px;
}

.books-grid.grid {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

.books-grid.list {
  grid-template-columns: 1fr;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 40px;
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

/* Responsive */
@media (max-width: 1024px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }

  .filters-sidebar {
    position: static;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .books-grid.grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .books-carousel {
    grid-template-columns: 1fr;
  }
}
</style>