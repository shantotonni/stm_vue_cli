<template>
  <transition name="modal-fade">
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-container form-modal">
        <!-- Header -->
        <div class="modal-header">
          <h2 class="modal-title">
            <i :class="isEditMode ? 'fas fa-edit' : 'fas fa-plus'"></i>
            {{ isEditMode ? 'Edit Book' : 'Add New Book' }}
          </h2>
          <button @click="$emit('close')" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="submitForm" class="book-form">
          <div class="form-scroll" style="background: white">
            <!-- Book Cover Preview -->
            <div v-if="coverPreview || formData.cover_image_url" class="cover-preview-section">
              <img :src="coverPreview || formData.cover_image_url" alt="Book Cover" class="cover-preview" />
            </div>

            <!-- Cover Image Upload -->
            <div class="form-group">
              <label class="form-label">
                <i class="fas fa-image"></i>
                Book Cover Image
              </label>
              <div class="file-upload-wrapper">
                <input
                    type="file"
                    ref="coverInput"
                    @change="handleCoverUpload"
                    accept="image/jpeg,image/png,image/jpg"
                    class="file-input"
                    id="coverInput"
                />
                <label for="coverInput" class="file-label">
                  <i class="fas fa-cloud-upload-alt"></i>
                  <span>{{ coverFileName || 'Upload Image (JPG, PNG - Max 2MB)' }}</span>
                </label>
              </div>
              <span v-if="errors.cover_image" class="error-message">{{ errors.cover_image }}</span>
            </div>

            <!-- Book File Upload -->
            <div class="form-group">
              <label class="form-label required">
                <i class="fas fa-file-pdf"></i>
                Book File
              </label>
              <div class="file-upload-wrapper">
                <input
                    type="file"
                    ref="fileInput"
                    @change="handleFileUpload"
                    accept=".pdf,.epub,.mobi"
                    class="file-input"
                    id="fileInput"
                    :required="!isEditMode"
                />
                <label for="fileInput" class="file-label">
                  <i class="fas fa-cloud-upload-alt"></i>
                  <span>{{ bookFileName || 'Upload File (PDF, EPUB, MOBI - Max 50MB)' }}</span>
                </label>
              </div>
              <span v-if="errors.file" class="error-message">{{ errors.file }}</span>
            </div>

            <!-- Title -->
            <div class="form-row">
              <div class="form-group">
                <label class="form-label required">
                  <i class="fas fa-heading"></i>
                  Book Title
                </label>
                <input
                    type="text"
                    v-model="formData.title"
                    required
                    class="form-input"
                    placeholder="Enter full book title"
                />
                <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
              </div>
            </div>

            <!-- Author and Publisher -->
            <div class="form-row two-cols">
              <div class="form-group">
                <label class="form-label required">
                  <i class="fas fa-user-edit"></i>
                  Author
                </label>
                <input
                    type="text"
                    v-model="formData.author"
                    required
                    class="form-input"
                    placeholder="Author name"
                />
                <span v-if="errors.author" class="error-message">{{ errors.author }}</span>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-building"></i>
                  Publisher
                </label>
                <input
                    type="text"
                    v-model="formData.publisher"
                    class="form-input"
                    placeholder="Publisher name"
                />
              </div>
            </div>

            <!-- Category, Department, Subject -->
            <div class="form-row three-cols">
              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-layer-group"></i>
                  Category
                </label>
                <select v-model="formData.category_id" class="form-select">
                  <option value="">Select Category</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-university"></i>
                  Department
                </label>
                <select v-model="formData.department_id" @change="onDepartmentChange" class="form-select">
                  <option value="">Select Department</option>
                  <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                    {{ dept.name }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-book-reader"></i>
                  Subject
                </label>
                <select v-model="formData.subject_id" class="form-select">
                  <option value="">Select Subject</option>
                  <option v-for="sub in subjects" :key="sub.id" :value="sub.id">
                    {{ sub.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- ISBN, Edition, Publication Year -->
            <div class="form-row three-cols">
              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-barcode"></i>
                  ISBN
                </label>
                <input
                    type="text"
                    v-model="formData.isbn"
                    class="form-input"
                    placeholder="978-0-123456-78-9"
                />
              </div>

              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-bookmark"></i>
                  Edition
                </label>
                <input
                    type="text"
                    v-model="formData.edition"
                    class="form-input"
                    placeholder="1st Edition"
                />
              </div>

              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-calendar-alt"></i>
                  Publication Year
                </label>
                <input
                    type="number"
                    v-model.number="formData.publication_year"
                    class="form-input"
                    :min="1900"
                    :max="new Date().getFullYear()"
                    placeholder="2024"
                />
              </div>
            </div>

            <!-- Language and Pages -->
            <div class="form-row two-cols">
              <div class="form-group">
                <label class="form-label">
                  <i class="fas fa-file-alt"></i>
                  Number of Pages
                </label>
                <input
                    type="number"
                    v-model.number="formData.pages"
                    class="form-input"
                    min="1"
                    placeholder="450"
                />
              </div>
            </div>

            <!-- Description -->
            <div class="form-group">
              <label class="form-label">
                <i class="fas fa-align-left"></i>
                Description
              </label>
              <textarea
                  v-model="formData.description"
                  class="form-textarea"
                  rows="5"
                  placeholder="Write detailed description about the book..."
              ></textarea>
            </div>

            <!-- Checkboxes -->
            <div class="form-row checkbox-row">
              <label class="checkbox-label">
                <input type="checkbox" v-model="formData.is_featured" />
                <span class="checkbox-text">
                  <i class="fas fa-star"></i>
                  Featured Book
                </span>
              </label>

              <label class="checkbox-label">
                <input type="checkbox" v-model="formData.is_active" />
                <span class="checkbox-text">
                  <i class="fas fa-check-circle"></i>
                  Active
                </span>
              </label>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="form-actions">
            <button type="button" @click="$emit('close')" class="btn btn-cancel">
              <i class="fas fa-times"></i>
              Cancel
            </button>
            <button type="submit" :disabled="submitting" class="btn btn-submit">
              <i :class="submitting ? 'fas fa-spinner fa-spin' : 'fas fa-save'"></i>
              {{ submitting ? 'Saving...' : (isEditMode ? 'Update' : 'Save') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script>

export default {
  name: 'BookFormModal',

  props: {
    book: {
      type: Object,
      default: null,
    },
    categories: {
      type: Array,
      default: () => [],
    },
    departments: {
      type: Array,
      default: () => [],
    },
    subjects: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      formData: {
        title: '',
        author: '',
        publisher: '',
        category_id: '',
        department_id: '',
        subject_id: '',
        isbn: '',
        edition: '',
        publication_year: null,
        language: 'Bengali',
        pages: null,
        description: '',
        is_featured: false,
        is_active: true,
      },

      coverFile: null,
      bookFile: null,
      coverPreview: null,
      coverFileName: '',
      bookFileName: '',

      errors: {},
      submitting: false,
    };
  },

  computed: {
    isEditMode() {
      return this.book !== null;
    },

    filteredSubjects() {
      if (!this.formData.department_id) return [];
      return this.subjects.filter(s => s.department_id === this.formData.department_id);
    },
  },

  mounted() {
    if (this.isEditMode) {
      this.loadBookData();
    }
  },

  methods: {
    loadBookData() {
      this.formData = {
        title: this.book.title || '',
        author: this.book.author || '',
        publisher: this.book.publisher || '',
        category_id: this.book.category_id || '',
        department_id: this.book.department_id || '',
        subject_id: this.book.subject_id || '',
        isbn: this.book.isbn || '',
        edition: this.book.edition || '',
        publication_year: this.book.publication_year || null,
        language: this.book.language || 'Bengali',
        pages: this.book.pages || null,
        description: this.book.description || '',
        is_featured: this.book.is_featured || false,
        is_active: this.book.is_active !== undefined ? this.book.is_active : true,
        cover_image_url: this.book.cover_image_url || null,
      };
    },

    handleCoverUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        this.errors.cover_image = 'Only JPG, PNG formats are supported';
        return;
      }

      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        this.errors.cover_image = 'File size cannot exceed 2 MB';
        return;
      }

      this.coverFile = file;
      this.coverFileName = file.name;
      this.errors.cover_image = '';

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.coverPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      // Validate file type
      const validTypes = ['application/pdf', 'application/epub+zip', 'application/x-mobipocket-ebook'];
      console.log(validTypes)
      const validExtensions = ['.pdf', '.epub', '.mobi'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

      if (!validExtensions.includes(fileExtension)) {
        this.errors.file = 'Only PDF, EPUB, MOBI formats are supported';
        return;
      }

      // Validate file size (50MB)
      if (file.size > 50 * 1024 * 1024) {
        this.errors.file = 'File size cannot exceed 50 MB';
        return;
      }

      this.bookFile = file;
      this.bookFileName = file.name;
      this.errors.file = '';
    },

    async onDepartmentChange() {
      this.formData.subject_id = '';

      if (this.formData.department_id) {
        try {
          const response = await this.$api.get('/library/subjects', {
            params: { department_id: this.formData.department_id },
          });
          console.log(response)
          // Subjects will be filtered from the computed property
        } catch (error) {
          console.error('Error loading subjects:', error);
        }
      }
    },

    async submitForm() {
      this.errors = {};
      this.submitting = true;

      try {
        const formData = new FormData();

        formData.append('is_active', this.formData.is_active ? 1 : 0);
        formData.append('is_featured', this.formData.is_featured ? 1 : 0 );

        // Append all text fields
        Object.keys(this.formData).forEach(key => {
          if (this.formData[key] !== null && this.formData[key] !== '' && key !== 'cover_image_url') {
            formData.append(key, this.formData[key]);
          }
        });

        // Append files
        if (this.coverFile) {
          formData.append('cover_image', this.coverFile);
        }
        if (this.bookFile) {
          formData.append('file', this.bookFile);
        }

        let response;
        if (this.isEditMode) {
          // For update, add _method field for Laravel
          formData.append('_method', 'PUT');
          response = await this.$api.post(`/library/books/${this.book.id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        } else {
          response = await this.$api.post('/library/books', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }

        this.$toast.success(
            this.isEditMode ? 'Book updated successfully' : 'New book added successfully'
        );

        this.$emit('save', response.data.data);
      } catch (error) {
        console.error('Error saving book:', error);

        if (error.response && error.response.data.errors) {
          this.errors = error.response.data.errors;
        }

        this.$toast.error('Failed to save book');
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>

<style scoped>
.form-modal {
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: white;
  border-radius: 25px 25px 0 0;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-close {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

.book-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.form-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 30px;
}

.cover-preview-section {
  text-align: center;
  margin-bottom: 25px;
}

.cover-preview {
  max-width: 200px;
  max-height: 280px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.form-row {
  display: grid;
  gap: 20px;
  margin-bottom: 20px;
}

.form-row.two-cols {
  grid-template-columns: repeat(2, 1fr);
}

.form-row.three-cols {
  grid-template-columns: repeat(3, 1fr);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-label.required::after {
  content: '*';
  color: #ef4444;
  margin-left: 4px;
}

.form-label i {
  color: #2563eb;
  font-size: 0.9rem;
}

.form-input,
.form-select,
.form-textarea {
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s;
  background: white;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.file-upload-wrapper {
  position: relative;
}

.file-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.file-label {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 20px;
  background: linear-gradient(135deg, #dbeafe, #ede9fe);
  border: 2px dashed #2563eb;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.file-label:hover {
  background: linear-gradient(135deg, #bfdbfe, #ddd6fe);
  border-color: #7c3aed;
}

.file-label i {
  font-size: 1.5rem;
  color: #2563eb;
}

.file-label span {
  color: #666;
  font-size: 0.95rem;
}

.checkbox-row {
  display: flex;
  gap: 30px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.checkbox-text {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #333;
}

.checkbox-text i {
  color: #2563eb;
}

.error-message {
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 4px;
}

.form-actions {
  padding: 20px 30px;
  background: #f8f9fa;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  border-radius: 0 0 25px 25px;
}

.btn {
  padding: 12px 30px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.btn-cancel {
  background: white;
  color: #666;
  border: 2px solid #e0e0e0;
}

.btn-cancel:hover {
  border-color: #ef4444;
  color: #ef4444;
}

.btn-submit {
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  color: white;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition: transform 0.3s;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter .modal-container,
.modal-fade-leave-to .modal-container {
  transform: scale(0.9);
}

@media (max-width: 768px) {
  .form-row.two-cols,
  .form-row.three-cols {
    grid-template-columns: 1fr;
  }

  .modal-header {
    padding: 20px;
  }

  .form-scroll {
    padding: 20px;
  }

  .form-actions {
    padding: 15px 20px;
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>