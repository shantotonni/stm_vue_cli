<template>
  <div class="card-type-management">
    <!-- Modern Header with Gradient (same as Teacher) -->
    <div class="header-section">
      <div class="header-content">
        <div class="title-section">
          <div class="icon-wrapper">
            <i class="fa fa-id-card-alt"></i>
          </div>
          <div>
            <h1>Card Type Management</h1>
            <p class="subtitle">Manage and organize medical card types efficiently</p>
          </div>
        </div>
        <button @click="openCreateModal" class="btn-add">
          <i class="fa fa-plus-circle"></i>
          <span>Add New Card Type</span>
        </button>
      </div>
    </div>

    <!-- Stats Cards (same style as Teacher) -->
    <div class="stats-cards" v-if="statistics">
      <div class="stat-card">
        <div class="stat-icon blue">
          <i class="fa fa-layer-group"></i>
        </div>
        <div class="stat-info">
          <h3>{{ statistics.total_card_types || 0 }}</h3>
          <p>Total Cards</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">
          <i class="fa fa-check-circle"></i>
        </div>
        <div class="stat-info">
          <h3>{{ statistics.active_card_types || 0 }}</h3>
          <p>Active Cards</p>
        </div>
      </div>
      <div class="stat-card" v-for="category in statistics.by_category" :key="category.card_category">
        <div class="stat-icon" :class="getCategoryIconClass(category.card_category)">
          <i :class="getCategoryIcon(category.card_category)"></i>
        </div>
        <div class="stat-info">
          <h3>{{ category.total }}</h3>
          <p>{{ category.card_category | capitalize }}</p>
        </div>
      </div>
    </div>

    <!-- Filters Section (same style as Teacher) -->
    <div class="filters-section">
      <div class="search-container">
        <i class="fa fa-search search-icon"></i>
        <input
            v-model="filters.search"
            @input="debounceSearch"
            type="text"
            placeholder="Search by name, code, or description..."
            class="search-input"
        />
      </div>

      <div class="filter-group">
        <div class="filter-item">
          <label><i class="fa fa-building"></i> Department</label>
          <select v-model="filters.department_id" @change="fetchCardTypes" class="filter-select">
            <option value="">All Departments</option>
            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
              {{ dept.name }}
            </option>
          </select>
        </div>

        <div class="filter-item">
          <label><i class="fa fa-calendar"></i> Year</label>
          <select v-model="filters.applicable_year" @change="fetchCardTypes" class="filter-select">
            <option value="">All Years</option>
            <option v-for="year in years" :key="year" :value="year">Year {{ year }}</option>
          </select>
        </div>

        <div class="filter-item">
          <label><i class="fa fa-tag"></i> Category</label>
          <select v-model="filters.card_category" @change="fetchCardTypes" class="filter-select">
            <option value="">All Categories</option>
            <option value="practical">Practical</option>
            <option value="dissection">Dissection</option>
            <option value="lab">Lab</option>
            <option value="clinical">Clinical</option>
          </select>
        </div>

        <div class="filter-item">
          <label><i class="fa fa-toggle-on"></i> Status</label>
          <select v-model="filters.is_active" @change="fetchCardTypes" class="filter-select">
            <option value="">All Status</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Modern Table (same style as Teacher) -->
    <div class="table-card">
      <div class="table-wrapper">
        <table class="modern-table">
          <thead>
          <tr>
            <th><i class="fa fa-hashtag"></i> Seq</th>
            <th><i class="fa fa-barcode"></i> Code</th>
            <th><i class="fa fa-id-card"></i> Card Name</th>
            <th><i class="fa fa-building"></i> Department</th>
            <th><i class="fa fa-tag"></i> Category</th>
            <th><i class="fa fa-calendar"></i> Year</th>
            <th><i class="fa fa-star"></i> Marks</th>
            <th><i class="fa fa-puzzle-piece"></i> Features</th>
            <th><i class="fa fa-toggle-on"></i> Status</th>
            <th><i class="fa fa-cog"></i> Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="loading">
            <td colspan="10" class="loading-cell">
              <div class="loading-spinner">
                <i class="fa fa-spinner fa-spin"></i>
                <span>Loading card types...</span>
              </div>
            </td>
          </tr>
          <tr v-else-if="cardTypes.length === 0">
            <td colspan="10" class="empty-cell">
              <div class="empty-state">
                <i class="fa fa-inbox"></i>
                <p>No card types found</p>
              </div>
            </td>
          </tr>
          <tr v-else v-for="cardType in cardTypes" :key="cardType.id" class="table-row">
            <td><span class="id-badge">{{ cardType.sequence }}</span></td>
            <td><span class="bmdc-code">{{ cardType.card_code }}</span></td>
            <td>
              <div class="teacher-name-cell">
                <span class="name">{{ cardType.card_name }}</span>
                <small v-if="cardType.description" class="description">
                  {{ cardType.description | truncate(40) }}
                </small>
              </div>
            </td>
            <td>
                <span class="dept-badge">
                  {{ cardType.department ? cardType.department.name : 'N/A' }}
                </span>
            </td>
            <td>
                <span class="designation-badge" :class="getCategoryBadge(cardType.card_category)">
                  {{ cardType.card_category | capitalize }}
                </span>
            </td>
            <td>
              <span class="year-badge">Year {{ cardType.applicable_year }}</span>
            </td>
            <td>
              <div class="marks-cell">
                  <span class="email">
                    <i class="fa fa-star"></i> {{ cardType.total_marks }}
                  </span>
                <span class="mobile">
                    <i class="fa fa-check"></i> {{ cardType.pass_marks }}
                  </span>
              </div>
            </td>
            <td>
              <div class="features-icons">
                  <span v-if="cardType.has_term_exams" class="feature-badge" title="Has Term Exams">
                    <i class="fa fa-file-alt"></i>
                  </span>
                <span v-if="cardType.has_attendance" class="feature-badge" title="Has Attendance">
                    <i class="fa fa-calendar-check"></i>
                  </span>
                <span v-if="cardType.requires_cadaver" class="feature-badge" title="Requires Cadaver">
                    <i class="fa fa-user-injured"></i>
                  </span>
              </div>
            </td>
            <td>
              <button
                  @click="toggleStatus(cardType)"
                  :class="['head-toggle', cardType.is_active ? 'is-head' : 'not-head']"
                  :title="cardType.is_active ? 'Active' : 'Inactive'"
              >
                <i :class="cardType.is_active ? 'fa fa-toggle-on' : 'fa fa-toggle-off'"></i>
                {{ cardType.is_active ? 'Active' : 'Inactive' }}
              </button>
            </td>
            <td>
              <div class="action-buttons">
                <button @click="viewCardType(cardType)" class="btn-action btn-view" title="View">
                  <i class="fa fa-eye"></i>
                </button>
                <button @click="editCardType(cardType)" class="btn-action btn-edit" title="Edit">
                  <i class="fa fa-edit"></i>
                </button>
                <button @click="confirmDelete(cardType)" class="btn-action btn-delete" title="Delete">
                  <i class="fa fa-trash-alt"></i>
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Modern Pagination (same style as Teacher) -->
      <div class="pagination-wrapper" v-if="pagination.last_page > 1">
        <div class="pagination-info">
          Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} card types
        </div>
        <div class="pagination-controls">
          <button
              @click="goToPage(1)"
              :disabled="pagination.current_page === 1"
              class="page-btn"
              title="First Page"
          >
            <i class="fa fa-angle-double-left"></i>
          </button>
          <button
              @click="goToPage(pagination.current_page - 1)"
              :disabled="pagination.current_page === 1"
              class="page-btn"
          >
            <i class="fa fa-angle-left"></i>
          </button>

          <div class="page-numbers">
            <button
                v-for="page in paginationPages"
                :key="page"
                @click="goToPage(page)"
                :class="['page-number', { active: page === pagination.current_page }]"
                :disabled="page === '...'"
            >
              {{ page }}
            </button>
          </div>

          <button
              @click="goToPage(pagination.current_page + 1)"
              :disabled="pagination.current_page === pagination.last_page"
              class="page-btn"
          >
            <i class="fa fa-angle-right"></i>
          </button>
          <button
              @click="goToPage(pagination.last_page)"
              :disabled="pagination.current_page === pagination.last_page"
              class="page-btn"
              title="Last Page"
          >
            <i class="fa fa-angle-double-right"></i>
          </button>
        </div>
        <div class="per-page-selector">
          <select v-model="filters.per_page" @change="fetchCardTypes" class="per-page-select">
            <option value="10">10 / page</option>
            <option value="25">25 / page</option>
            <option value="50">50 / page</option>
            <option value="100">100 / page</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Modern Modal (same style as Teacher) -->
    <transition name="modal-fade">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-container">
          <div class="modal-header">
            <div class="modal-title">
              <i :class="isEditing ? 'fa fa-edit' : 'fa fa-plus-circle'"></i>
              <h2>{{ isEditing ? 'Edit Card Type' : 'Create New Card Type' }}</h2>
            </div>
            <button @click="closeModal" class="modal-close">
              <i class="fa fa-times"></i>
            </button>
          </div>

          <form @submit.prevent="saveCardType" class="modal-form">
            <div class="form-grid">
              <!-- Basic Information -->
              <div class="form-field">
                <label class="field-label">
                  <i class="fa fa-building"></i>
                  Department <span class="required">*</span>
                </label>
                <select
                    v-model="form.department_id"
                    class="field-select"
                    :class="{ 'error': errors.department_id }"
                    required
                >
                  <option value="">Select Department</option>
                  <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                    {{ dept.name }}
                  </option>
                </select>
                <span v-if="errors.department_id" class="error-message">
                  <i class="fa fa-exclamation-circle"></i>
                  {{ errors.department_id[0] }}
                </span>
              </div>

              <div class="form-field">
                <label class="field-label">
                  <i class="fa fa-tag"></i>
                  Category <span class="required">*</span>
                </label>
                <select
                    v-model="form.card_category"
                    class="field-select"
                    :class="{ 'error': errors.card_category }"
                    required
                >
                  <option value="">Select Category</option>
                  <option value="practical">Practical</option>
                  <option value="dissection">Dissection</option>
                  <option value="lab">Lab</option>
                  <option value="clinical">Clinical</option>
                </select>
                <span v-if="errors.card_category" class="error-message">
                  <i class="fa fa-exclamation-circle"></i>
                  {{ errors.card_category[0] }}
                </span>
              </div>

              <div class="form-field">
                <label class="field-label">
                  <i class="fa fa-id-card"></i>
                  Card Name <span class="required">*</span>
                </label>
                <input
                    v-model="form.card_name"
                    type="text"
                    class="field-input"
                    :class="{ 'error': errors.card_name }"
                    placeholder="Enter card name"
                    required
                />
                <span v-if="errors.card_name" class="error-message">
                  <i class="fa fa-exclamation-circle"></i>
                  {{ errors.card_name[0] }}
                </span>
              </div>

              <div class="form-field">
                <label class="field-label">
                  <i class="fa fa-barcode"></i>
                  Card Code <span class="required">*</span>
                </label>
                <input
                    v-model="form.card_code"
                    type="text"
                    class="field-input"
                    :class="{ 'error': errors.card_code }"
                    placeholder="e.g., PRAC-001"
                    required
                />
                <span v-if="errors.card_code" class="error-message">
                  <i class="fa fa-exclamation-circle"></i>
                  {{ errors.card_code[0] }}
                </span>
              </div>

              <div class="form-field">
                <label class="field-label">
                  <i class="fa fa-sitemap"></i>
                  Structure Type
                </label>
                <select v-model="form.structure_type" class="field-select">
                  <option value="item_based">Item Based</option>
                  <option value="topic_based">Topic Based</option>
                  <option value="module_based">Module Based</option>
                </select>
              </div>

              <div class="form-field">
                <label class="field-label">
                  <i class="fa fa-calendar"></i>
                  Applicable Year <span class="required">*</span>
                </label>
                <select
                    v-model="form.applicable_year"
                    class="field-select"
                    :class="{ 'error': errors.applicable_year }"
                    required
                >
                  <option value="">Select Year</option>
                  <option v-for="year in years" :key="year" :value="year">Year {{ year }}</option>
                </select>
                <span v-if="errors.applicable_year" class="error-message">
                  <i class="fa fa-exclamation-circle"></i>
                  {{ errors.applicable_year[0] }}
                </span>
              </div>

              <div class="form-field">
                <label class="field-label">
                  <i class="fa fa-star"></i>
                  Total Marks <span class="required">*</span>
                </label>
                <input
                    v-model.number="form.total_marks"
                    type="number"
                    step="0.01"
                    class="field-input"
                    :class="{ 'error': errors.total_marks }"
                    placeholder="0.00"
                    required
                />
                <span v-if="errors.total_marks" class="error-message">
                  <i class="fa fa-exclamation-circle"></i>
                  {{ errors.total_marks[0] }}
                </span>
              </div>

              <div class="form-field">
                <label class="field-label">
                  <i class="fa fa-check-circle"></i>
                  Pass Marks <span class="required">*</span>
                </label>
                <input
                    v-model.number="form.pass_marks"
                    type="number"
                    step="0.01"
                    class="field-input"
                    :class="{ 'error': errors.pass_marks }"
                    placeholder="0.00"
                    required
                />
                <span v-if="errors.pass_marks" class="error-message">
                  <i class="fa fa-exclamation-circle"></i>
                  {{ errors.pass_marks[0] }}
                </span>
              </div>

              <div class="form-field">
                <label class="field-label">
                  <i class="fa fa-clipboard-check"></i>
                  Marking Type
                </label>
                <select v-model="form.marking_type" class="field-select">
                  <option value="item_wise">Item Wise</option>
                  <option value="topic_wise">Topic Wise</option>
                  <option value="cumulative">Cumulative</option>
                </select>
              </div>

              <div class="form-field">
                <label class="field-label">
                  <i class="fa fa-sort-numeric-up"></i>
                  Sequence <span class="required">*</span>
                </label>
                <input
                    v-model.number="form.sequence"
                    type="number"
                    class="field-input"
                    placeholder="1"
                    required
                />
              </div>

              <div class="form-field full-width">
                <label class="field-label">
                  <i class="fa fa-align-left"></i>
                  Description
                </label>
                <input
                    v-model="form.description"
                    type="text"
                    class="field-input"
                    placeholder="Enter description..."
                />
              </div>

              <!-- Features Checkboxes -->
              <div class="form-field full-width">
                <label class="field-label">
                  <i class="fa fa-puzzle-piece"></i>
                  Additional Features
                </label>
                <div class="checkboxes-row">
                  <div class="checkbox-wrapper">
                    <input
                        v-model="form.has_term_exams"
                        type="checkbox"
                        class="checkbox-input"
                        id="has_term_exams"
                    />
                    <label for="has_term_exams" class="checkbox-label">
                      <i class="fa fa-file-alt"></i> Has Term Exams
                    </label>
                  </div>

                  <div class="checkbox-wrapper" v-if="form.has_term_exams">
                    <label class="field-label">
                      <i class="fa fa-hashtag"></i>
                      Term Exam Count
                    </label>
                    <input
                        v-model.number="form.term_exam_count"
                        type="number"
                        class="field-input"
                        min="1"
                        max="10"
                        placeholder="Count"
                    />
                  </div>

                  <div class="checkbox-wrapper">
                    <input
                        v-model="form.has_attendance"
                        type="checkbox"
                        class="checkbox-input"
                        id="has_attendance"
                    />
                    <label for="has_attendance" class="checkbox-label">
                      <i class="fa fa-calendar-check"></i> Has Attendance
                    </label>
                  </div>

                  <div class="checkbox-wrapper">
                    <input
                        v-model="form.requires_cadaver"
                        type="checkbox"
                        class="checkbox-input"
                        id="requires_cadaver"
                    />
                    <label for="requires_cadaver" class="checkbox-label">
                      <i class="fa fa-user-injured"></i> Requires Cadaver
                    </label>
                  </div>

                  <div class="checkbox-wrapper">
                    <input
                        v-model="form.requires_specimen"
                        type="checkbox"
                        class="checkbox-input"
                        id="requires_specimen"
                    />
                    <label for="requires_specimen" class="checkbox-label">
                      <i class="fa fa-flask"></i> Requires Specimen
                    </label>
                  </div>

                  <div class="checkbox-wrapper">
                    <input
                        v-model="form.requires_equipment"
                        type="checkbox"
                        class="checkbox-input"
                        id="requires_equipment"
                    />
                    <label for="requires_equipment" class="checkbox-label">
                      <i class="fa fa-tools"></i> Requires Equipment
                    </label>
                  </div>

                  <div class="checkbox-wrapper">
                    <input
                        v-model="form.is_active"
                        type="checkbox"
                        class="checkbox-input"
                        id="is_active"
                    />
                    <label for="is_active" class="checkbox-label">
                      <i class="fa fa-toggle-on"></i> Active Status
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" @click="closeModal" class="btn-cancel">
                <i class="fa fa-times"></i>
                <span>Cancel</span>
              </button>
              <button type="submit" class="btn-submit" :disabled="saving">
                <i :class="saving ? 'fa fa-spinner fa-spin' : 'fa fa-save'"></i>
                <span>{{ saving ? 'Saving...' : (isEditing ? 'Update' : 'Create') }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- View Modal -->
    <transition name="modal-fade">
      <div v-if="showViewModal" class="modal-overlay" @click.self="closeViewModal">
        <div class="modal-container">
          <div class="modal-header">
            <div class="modal-title">
              <i class="fa fa-info-circle"></i>
              <h2>Card Type Details</h2>
            </div>
            <button @click="closeViewModal" class="modal-close">
              <i class="fa fa-times"></i>
            </button>
          </div>

          <div class="modal-form" v-if="selectedCardType">
            <div class="detail-grid">
              <div class="detail-item">
                <label>Code:</label>
                <strong>{{ selectedCardType.card_code }}</strong>
              </div>
              <div class="detail-item">
                <label>Name:</label>
                <strong>{{ selectedCardType.card_name }}</strong>
              </div>
              <div class="detail-item">
                <label>Department:</label>
                <strong>{{ selectedCardType.department ? selectedCardType.department.name : 'N/A' }}</strong>
              </div>
              <div class="detail-item">
                <label>Category:</label>
                <strong>{{ selectedCardType.card_category | capitalize }}</strong>
              </div>
              <div class="detail-item">
                <label>Year:</label>
                <strong>Year {{ selectedCardType.applicable_year }}</strong>
              </div>
              <div class="detail-item">
                <label>Total Marks:</label>
                <strong>{{ selectedCardType.total_marks }}</strong>
              </div>
              <div class="detail-item">
                <label>Pass Marks:</label>
                <strong>{{ selectedCardType.pass_marks }} ({{ selectedCardType.pass_percentage }}%)</strong>
              </div>
              <div class="detail-item">
                <label>Sequence:</label>
                <strong>{{ selectedCardType.sequence }}</strong>
              </div>
              <div class="detail-item full-width" v-if="selectedCardType.description">
                <label>Description:</label>
                <p>{{ selectedCardType.description }}</p>
              </div>
              <div class="detail-item full-width" v-if="hasFeatures(selectedCardType)">
                <label>Features:</label>
                <div class="features-tags">
                  <span v-if="selectedCardType.has_term_exams" class="feature-tag">
                    <i class="fa fa-file-alt"></i> Term Exams ({{ selectedCardType.term_exam_count }}x)
                  </span>
                  <span v-if="selectedCardType.has_attendance" class="feature-tag">
                    <i class="fa fa-calendar-check"></i> Attendance
                  </span>
                  <span v-if="selectedCardType.requires_cadaver" class="feature-tag">
                    <i class="fa fa-user-injured"></i> Cadaver
                  </span>
                  <span v-if="selectedCardType.requires_specimen" class="feature-tag">
                    <i class="fa fa-flask"></i> Specimen
                  </span>
                  <span v-if="selectedCardType.requires_equipment" class="feature-tag">
                    <i class="fa fa-tools"></i> Equipment
                  </span>
                </div>
              </div>
            </div>

            <div class="modal-actions">
              <button @click="closeViewModal" class="btn-cancel">
                <i class="fa fa-times"></i>
                <span>Close</span>
              </button>
              <button @click="editCardType(selectedCardType)" class="btn-submit">
                <i class="fa fa-edit"></i>
                <span>Edit</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Delete Confirmation Modal -->
    <transition name="modal-fade">
      <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
        <div class="modal-container small-modal">
          <div class="modal-header danger">
            <div class="modal-title">
              <i class="fa fa-exclamation-triangle"></i>
              <h2>Confirm Delete</h2>
            </div>
            <button @click="closeDeleteModal" class="modal-close">
              <i class="fa fa-times"></i>
            </button>
          </div>

          <div class="modal-form" v-if="selectedCardType">
            <div class="delete-warning">
              <i class="fa fa-exclamation-circle"></i>
              <p>Are you sure you want to delete this card type?</p>
              <div class="delete-info">
                <strong>{{ selectedCardType.card_name }}</strong>
                <small>Code: {{ selectedCardType.card_code }}</small>
              </div>
              <p class="warning-text">This action cannot be undone!</p>
            </div>

            <div class="modal-actions">
              <button @click="closeDeleteModal" class="btn-cancel">
                <i class="fa fa-times"></i>
                <span>Cancel</span>
              </button>
              <button @click="deleteCardType" class="btn-delete-confirm" :disabled="deleting">
                <i :class="deleting ? 'fa fa-spinner fa-spin' : 'fa fa-trash-alt'"></i>
                <span>{{ deleting ? 'Deleting...' : 'Delete' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import cardTypeService from './cardTypeService';

export default {
  name: 'CardTypeManagement',

  data() {
    return {
      cardTypes: [],
      departments: [],
      statistics: null,
      loading: false,
      saving: false,
      deleting: false,
      showModal: false,
      showViewModal: false,
      showDeleteModal: false,
      isEditing: false,
      selectedCardType: null,
      years: [1, 2, 3, 4, 5],

      filters: {
        department_id: '',
        applicable_year: '',
        card_category: '',
        is_active: '',
        search: '',
        sort_by: 'sequence',
        sort_order: 'asc',
        per_page: 10
      },

      pagination: {
        current_page: 1,
        last_page: 1,
        from: 0,
        to: 0,
        total: 0
      },

      form: {
        department_id: '',
        card_name: '',
        card_code: '',
        card_category: '',
        structure_type: 'item_based',
        has_term_exams: false,
        term_exam_count: 0,
        has_attendance: false,
        requires_cadaver: false,
        requires_specimen: false,
        requires_equipment: false,
        total_marks: 0,
        pass_marks: 0,
        marking_type: 'item_wise',
        applicable_year: '',
        description: '',
        sequence: 1,
        is_active: true
      },

      errors: {},
      searchTimeout: null
    };
  },

  computed: {
    paginationPages() {
      const pages = [];
      const current = this.pagination.current_page;
      const last = this.pagination.last_page;

      let start = Math.max(1, current - 2);
      let end = Math.min(last, current + 2);

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < last) {
        if (end < last - 1) pages.push('...');
        pages.push(last);
      }

      return pages;
    }
  },

  filters: {
    capitalize(value) {
      if (!value) return '';
      return value.charAt(0).toUpperCase() + value.slice(1);
    },

    truncate(value, length) {
      if (!value) return '';
      if (value.length <= length) return value;
      return value.substring(0, length) + '...';
    }
  },

  mounted() {
    this.fetchDepartments();
    this.fetchCardTypes();
    this.fetchStatistics();
  },

  methods: {
    async fetchDepartments() {
      try {
        const response = await cardTypeService.getDepartments();
        this.departments = response.data;
      } catch (error) {
        console.error('Failed to load departments:', error);
      }
    },

    async fetchCardTypes() {
      this.loading = true;
      try {
        const params = {
          ...this.filters,
          page: this.pagination.current_page
        };
        const response = await cardTypeService.getAll(params);
        this.cardTypes = response.data.data;
        this.pagination = {
          current_page: response.data.current_page,
          last_page: response.data.last_page,
          from: response.data.from,
          to: response.data.to,
          total: response.data.total
        };
      } catch (error) {
        console.error('Failed to load card types:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchStatistics() {
      try {
        const response = await cardTypeService.getStatistics();
        this.statistics = response.data;
      } catch (error) {
        console.error('Failed to load statistics:', error);
      }
    },

    debounceSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.fetchCardTypes();
      }, 500);
    },

    goToPage(page) {
      if (page !== '...' && page >= 1 && page <= this.pagination.last_page) {
        this.pagination.current_page = page;
        this.fetchCardTypes();
      }
    },

    openCreateModal() {
      this.isEditing = false;
      this.resetForm();
      this.showModal = true;
    },

    viewCardType(cardType) {
      this.selectedCardType = cardType;
      this.showViewModal = true;
    },

    editCardType(cardType) {
      this.isEditing = true;
      this.selectedCardType = cardType;
      this.form = {
        department_id: cardType.department_id,
        card_name: cardType.card_name,
        card_code: cardType.card_code,
        card_category: cardType.card_category,
        structure_type: cardType.structure_type,
        has_term_exams: cardType.has_term_exams,
        term_exam_count: cardType.term_exam_count,
        has_attendance: cardType.has_attendance,
        requires_cadaver: cardType.requires_cadaver,
        requires_specimen: cardType.requires_specimen,
        requires_equipment: cardType.requires_equipment,
        total_marks: cardType.total_marks,
        pass_marks: cardType.pass_marks,
        marking_type: cardType.marking_type,
        applicable_year: cardType.applicable_year,
        description: cardType.description,
        sequence: cardType.sequence,
        is_active: cardType.is_active
      };
      this.showViewModal = false;
      this.showModal = true;
    },

    confirmDelete(cardType) {
      this.selectedCardType = cardType;
      this.showDeleteModal = true;
    },

    async saveCardType() {
      this.saving = true;
      this.errors = {};

      try {
        if (this.isEditing) {
          await cardTypeService.update(this.selectedCardType.id, this.form);
        } else {
          await cardTypeService.create(this.form);
        }

        this.closeModal();
        this.fetchCardTypes();
        this.fetchStatistics();
      } catch (error) {
        if (error.errors) {
          this.errors = error.errors;
        }
      } finally {
        this.saving = false;
      }
    },

    async deleteCardType() {
      this.deleting = true;

      try {
        await cardTypeService.delete(this.selectedCardType.id);
        this.closeDeleteModal();
        this.fetchCardTypes();
        this.fetchStatistics();
      } catch (error) {
        console.error('Failed to delete:', error);
      } finally {
        this.deleting = false;
      }
    },

    async toggleStatus(cardType) {
      try {
        const response = await cardTypeService.toggleActive(cardType.id);
        cardType.is_active = response.data.is_active;
      } catch (error) {
        console.error('Failed to update status:', error);
      }
    },

    closeModal() {
      this.showModal = false;
      this.resetForm();
    },

    closeViewModal() {
      this.showViewModal = false;
      this.selectedCardType = null;
    },

    closeDeleteModal() {
      this.showDeleteModal = false;
      this.selectedCardType = null;
    },

    resetForm() {
      this.form = {
        department_id: '',
        card_name: '',
        card_code: '',
        card_category: '',
        structure_type: 'item_based',
        has_term_exams: false,
        term_exam_count: 0,
        has_attendance: false,
        requires_cadaver: false,
        requires_specimen: false,
        requires_equipment: false,
        total_marks: 0,
        pass_marks: 0,
        marking_type: 'item_wise',
        applicable_year: '',
        description: '',
        sequence: 1,
        is_active: true
      };
      this.errors = {};
      this.selectedCardType = null;
    },

    getCategoryBadge(category) {
      const badges = {
        practical: 'practical',
        dissection: 'dissection',
        lab: 'lab',
        clinical: 'clinical'
      };
      return badges[category] || '';
    },

    getCategoryIcon(category) {
      const icons = {
        practical: 'fa fa-hand-paper',
        dissection: 'fa fa-cut',
        lab: 'fa fa-flask',
        clinical: 'fa fa-user-md'
      };
      return icons[category] || 'fa fa-tag';
    },

    getCategoryIconClass(category) {
      const classes = {
        practical: 'blue',
        dissection: 'red',
        lab: 'green',
        clinical: 'purple'
      };
      return classes[category] || 'orange';
    },

    hasFeatures(cardType) {
      return cardType.has_term_exams ||
          cardType.has_attendance ||
          cardType.requires_cadaver ||
          cardType.requires_specimen ||
          cardType.requires_equipment;
    }
  }
};
</script>

<style scoped>
/* Base Styles */
.card-type-management {
  padding: 30px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Modern Header with Gradient */
.header-section {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 10px 30px rgba(17, 153, 142, 0.3);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
}

.icon-wrapper {
  width: 70px;
  height: 70px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: white;
}

.title-section h1 {
  font-size: 32px;
  color: white;
  font-weight: 700;
  margin: 0;
}

.subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 15px;
  margin: 5px 0 0 0;
}

.btn-add {
  padding: 15px 30px;
  background: white;
  color: #11998e;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

/* Stats Cards */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 70px;
  height: 70px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
}

.stat-icon.blue {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-icon.green {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.stat-icon.orange {
  background: linear-gradient(135deg, #f39c12 0%, #f39c12 100%);
}

.stat-icon.purple {
  background: linear-gradient(135deg, #8e44ad 0%, #c0392b 100%);
}

.stat-icon.red {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
}

.stat-info h3 {
  font-size: 36px;
  color: #2d3748;
  font-weight: 700;
  margin: 0;
}

.stat-info p {
  font-size: 14px;
  color: #718096;
  margin: 5px 0 0 0;
}

/* Filters Section */
.filters-section {
  background: white;
  border-radius: 15px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.search-container {
  position: relative;
  margin-bottom: 20px;
}

.search-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: #718096;
  font-size: 16px;
}

.search-input {
  width: 100%;
  padding: 15px 20px 15px 50px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #11998e;
  box-shadow: 0 0 0 3px rgba(17, 153, 142, 0.1);
}

.filter-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 15px;
}

.filter-item label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
}

.filter-item label i {
  color: #11998e;
}

.filter-select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: white;
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: #11998e;
  box-shadow: 0 0 0 3px rgba(17, 153, 142, 0.1);
}

/* Modern Table Card */
.table-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.table-wrapper {
  overflow-x: auto;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
}

.modern-table thead {
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
}

.modern-table th {
  padding: 18px 15px;
  text-align: left;
  color: white;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modern-table th i {
  margin-right: 6px;
  opacity: 0.8;
}

.modern-table tbody tr {
  border-bottom: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.modern-table tbody tr:hover {
  background: #f7fafc;
}

.modern-table td {
  padding: 18px 15px;
  font-size: 14px;
  color: #2d3748;
}

/* Loading & Empty States */
.loading-cell,
.empty-cell {
  text-align: center;
  padding: 60px 20px !important;
}

.loading-spinner,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  color: #718096;
}

.loading-spinner i,
.empty-state i {
  font-size: 48px;
  opacity: 0.3;
}

/* Table Cell Styles */
.id-badge {
  display: inline-block;
  padding: 6px 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
}

.bmdc-code {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #11998e;
  padding: 6px 12px;
  background: rgba(17, 153, 142, 0.1);
  border-radius: 6px;
  font-size: 13px;
}

.teacher-name-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.teacher-name-cell .name {
  font-weight: 600;
  color: #2d3748;
}

.teacher-name-cell .description {
  font-size: 12px;
  color: #718096;
}

.email {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4a5568;
  font-size: 13px;
}

.email i {
  color: #11998e;
}

.mobile {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4a5568;
  font-size: 13px;
}

.mobile i {
  color: #11998e;
}

.dept-badge {
  display: inline-block;
  padding: 6px 14px;
  background: #e6fffa;
  color: #047857;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}

.designation-badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.designation-badge.practical {
  background: #e0e7ff;
  color: #4338ca;
}

.designation-badge.dissection {
  background: #fee2e2;
  color: #b91c1c;
}

.designation-badge.lab {
  background: #d1fae5;
  color: #065f46;
}

.designation-badge.clinical {
  background: #f3e8ff;
  color: #6b21a8;
}

.year-badge {
  display: inline-block;
  padding: 6px 12px;
  background: #fef3c7;
  color: #92400e;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}

.marks-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.features-icons {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.feature-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: #e6fffa;
  color: #11998e;
  border-radius: 6px;
  font-size: 12px;
  cursor: help;
}

.head-toggle {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.head-toggle.is-head {
  background: #fef3c7;
  color: #92400e;
}

.head-toggle.not-head {
  background: #e2e8f0;
  color: #4a5568;
}

.head-toggle:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-action {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.3s ease;
}

.btn-action.btn-view {
  background: #dbeafe;
  color: #1e40af;
}

.btn-action.btn-view:hover {
  background: #3b82f6;
  color: white;
}

.btn-action.btn-edit {
  background: #fef3c7;
  color: #92400e;
}

.btn-action.btn-edit:hover {
  background: #f59e0b;
  color: white;
}

.btn-action.btn-delete {
  background: #fee2e2;
  color: #991b1b;
}

.btn-action.btn-delete:hover {
  background: #ef4444;
  color: white;
}

/* Modern Pagination */
.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  border-top: 1px solid #e2e8f0;
  gap: 15px;
  flex-wrap: wrap;
}

.pagination-info {
  color: #4a5568;
  font-size: 14px;
}

.pagination-controls {
  display: flex;
  gap: 8px;
}

.page-btn {
  width: 38px;
  height: 38px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #4a5568;
  transition: all 0.3s ease;
}

.page-btn:hover:not(:disabled) {
  border-color: #11998e;
  color: #11998e;
  background: rgba(17, 153, 142, 0.05);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 6px;
}

.page-number {
  min-width: 38px;
  height: 38px;
  padding: 0 12px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #4a5568;
  transition: all 0.3s ease;
}

.page-number:hover:not(:disabled) {
  border-color: #11998e;
  color: #11998e;
  background: rgba(17, 153, 142, 0.05);
}

.page-number.active {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
  border-color: #11998e;
}

.page-number:disabled {
  cursor: default;
  border-color: transparent;
}

.per-page-selector select {
  padding: 10px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.per-page-selector select:focus {
  outline: none;
  border-color: #11998e;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 20px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-container.small-modal {
  max-width: 500px;
}

.modal-header {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  padding: 25px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 20px 20px 0 0;
}

.modal-header.danger {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 15px;
  color: white;
}

.modal-title i {
  font-size: 28px;
}

.modal-title h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
}

.modal-close {
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: white;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.modal-form {
  padding: 30px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.form-field {
  display: flex;
  flex-direction: column;
}

.form-field.full-width {
  grid-column: 1 / -1;
}

.field-label {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
}

.field-label i {
  margin-right: 8px;
  color: #11998e;
}

.required {
  color: #e53e3e;
  margin-left: 4px;
}

.field-input,
.field-select {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: white;
}

.field-input:focus,
.field-select:focus {
  outline: none;
  border-color: #11998e;
  box-shadow: 0 0 0 3px rgba(17, 153, 142, 0.1);
}

.field-input.error,
.field-select.error {
  border-color: #fc8181;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  color: #e53e3e;
  font-size: 12px;
}

/* Checkboxes */
.checkboxes-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #f7fafc;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.checkbox-wrapper:hover {
  background: #edf2f7;
}

.checkbox-input {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  cursor: pointer;
  accent-color: #11998e;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #4a5568;
  cursor: pointer;
}

.checkbox-label i {
  color: #11998e;
}

/* Modal Actions */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 25px;
  border-top: 1px solid #e2e8f0;
}

.btn-cancel,
.btn-submit,
.btn-delete-confirm {
  padding: 12px 28px;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-cancel:hover {
  background: #cbd5e0;
}

.btn-submit {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(17, 153, 142, 0.4);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(17, 153, 142, 0.6);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-delete-confirm {
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.4);
}

.btn-delete-confirm:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.6);
}

.btn-delete-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Detail View */
.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.detail-item {
  padding: 15px;
  background: #f7fafc;
  border-radius: 10px;
}

.detail-item.full-width {
  grid-column: 1 / -1;
}

.detail-item label {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.detail-item strong {
  font-size: 15px;
  color: #2d3748;
}

.detail-item p {
  font-size: 14px;
  color: #4a5568;
  line-height: 1.6;
  margin: 0;
}

.features-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.feature-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #e6fffa;
  color: #11998e;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}

/* Delete Warning */
.delete-warning {
  text-align: center;
  padding: 20px;
}

.delete-warning > i {
  font-size: 64px;
  color: #e74c3c;
  margin-bottom: 20px;
  display: block;
}

.delete-warning p {
  font-size: 16px;
  color: #2d3748;
  margin: 15px 0;
}

.delete-info {
  padding: 20px;
  background: #fee2e2;
  border-radius: 12px;
  margin: 20px 0;
}

.delete-info strong {
  display: block;
  font-size: 18px;
  color: #2d3748;
  margin-bottom: 5px;
}

.delete-info small {
  font-size: 14px;
  color: #991b1b;
}

.warning-text {
  font-weight: 600;
  color: #e74c3c;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/* Modal Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  .filter-group {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 992px) {
  .card-type-management {
    padding: 20px 15px;
  }
  .header-section {
    padding: 20px;
  }
  .title-section h1 {
    font-size: 26px;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: stretch;
  }
  .title-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  .btn-add {
    width: 100%;
    justify-content: center;
  }
  .stats-cards {
    grid-template-columns: 1fr;
  }
  .filter-group {
    grid-template-columns: 1fr;
  }
  .table-card {
    margin: 0 -20px;
    border-radius: 0;
  }
  .modern-table {
    font-size: 12px;
  }
  .modern-table th,
  .modern-table td {
    padding: 10px 8px;
  }
  .form-grid {
    grid-template-columns: 1fr;
  }
  .pagination-wrapper {
    flex-direction: column;
  }
  .modal-actions {
    flex-direction: column-reverse;
  }
  .btn-cancel,
  .btn-submit,
  .btn-delete-confirm {
    width: 100%;
    justify-content: center;
  }
  .checkboxes-row {
    grid-template-columns: 1fr;
  }
  .detail-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .card-type-management {
    padding: 15px 10px;
  }
  .title-section h1 {
    font-size: 22px;
  }
  .stat-card {
    padding: 15px;
  }
  .action-buttons {
    flex-direction: column;
    gap: 6px;
  }
  .btn-action {
    width: 30px;
    height: 30px;
  }
}

/* Scrollbar Styling */
html {
  scroll-behavior: smooth;
}

.table-wrapper::-webkit-scrollbar,
.modal-container::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}

.table-wrapper::-webkit-scrollbar-track,
.modal-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.table-wrapper::-webkit-scrollbar-thumb,
.modal-container::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 10px;
}

.table-wrapper::-webkit-scrollbar-thumb:hover,
.modal-container::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}
</style>