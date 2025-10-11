<template>
  <transition name="modal-fade">
    <div v-if="show" class="modal-overlay" @click.self="close">
      <div class="modern-form-modal">
        <!-- Header -->
        <div class="modal-header-gradient">
          <div class="header-content">
            <div class="header-icon">
              <i class="fas" :class="isEdit ? 'fa-edit' : 'fa-calendar-plus'"></i>
            </div>
            <div class="header-text">
              <h2 class="modal-title">{{ isEdit ? 'Edit Exam' : 'Schedule New Exam' }}</h2>
              <p class="modal-subtitle">{{ isEdit ? 'Update exam information' : 'Create a new examination schedule' }}</p>
            </div>
          </div>
          <button class="close-btn" @click="close">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Form Body -->
        <form @submit.prevent="saveExam">
          <div class="modal-body-scroll">
            <!-- Basic Information Section -->
            <div class="form-section">
              <div class="section-header">
                <i class="fas fa-info-circle"></i>
                <h3>Basic Information</h3>
              </div>

              <div class="form-grid">
                <div class="form-group span-2">
                  <label class="form-label">
                    <i class="fas fa-heading"></i>
                    Exam Title
                    <span class="required">*</span>
                  </label>
                  <input type="text" class="form-input" v-model="form.title" :class="{ 'error': errors.title }" placeholder="e.g., 1st Year Anatomy Mid-term Exam" required>
                  <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <i class="fas fa-tag"></i>
                    Exam Type
                    <span class="required">*</span>
                  </label>
                  <select class="form-select" v-model.number="form.exam_type_id" :class="{ 'error': errors.exam_type_id }" required>
                    <option value="">Select Type</option>
                    <option v-for="type in examTypes" :key="type.id" :value="type.id">
                      {{ type.name }}
                    </option>
                  </select>
                  <span v-if="errors.exam_type_id" class="error-message">{{ errors.exam_type_id }}</span>
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <i class="fas fa-building"></i>
                    Department
                    <span class="required">*</span>
                  </label>
                  <select class="form-select" v-model.number="selectedDepartment" @change="loadSubjects" required>
                    <option value="">Select Department</option>
                    <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                      {{ dept.name }}
                    </option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <i class="fas fa-book"></i>
                    Subject
                    <span class="required">*</span>
                  </label>
                  <select class="form-select" v-model.number="form.subject_id" @change="loadTeachers" :class="{ 'error': errors.subject_id }" :disabled="!selectedDepartment" required>
                    <option value="">Select Subject</option>
                    <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
                      {{ subject.name }} ({{ subject.code }})
                    </option>
                  </select>
                  <span v-if="errors.subject_id" class="error-message">{{ errors.subject_id }}</span>
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <i class="fas fa-chalkboard-teacher"></i>
                    Teacher
                    <span class="required">*</span>
                  </label>
                  <select class="form-select" v-model.number="form.teacher_id" :class="{ 'error': errors.teacher_id }" :disabled="!form.subject_id" required>
                    <option value="">Select Teacher</option>
                    <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                      {{ teacher.name }}
                    </option>
                  </select>
                  <span v-if="errors.teacher_id" class="error-message">{{ errors.teacher_id }}</span>
                </div>
              </div>
            </div>

            <!-- Date & Time Section -->
            <div class="form-section">
              <div class="section-header">
                <i class="fas fa-calendar-alt"></i>
                <h3>Date & Time Details</h3>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">
                    <i class="fas fa-calendar-day"></i>
                    Exam Date
                    <span class="required">*</span>
                  </label>
                  <input type="date" class="form-input" v-model="form.exam_date" :class="{ 'error': errors.exam_date }" required>
                  <span v-if="errors.exam_date" class="error-message">{{ errors.exam_date }}</span>
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <i class="fas fa-clock"></i>
                    Start Time
                    <span class="required">*</span>
                  </label>
                  <input type="time" class="form-input" v-model="form.start_time" :class="{ 'error': errors.start_time }" required>
                  <span v-if="errors.start_time" class="error-message">{{ errors.start_time }}</span>
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <i class="fas fa-clock"></i>
                    End Time
                    <span class="required">*</span>
                  </label>
                  <input type="time" class="form-input" v-model="form.end_time" :class="{ 'error': errors.end_time }" required>
                  <span v-if="errors.end_time" class="error-message">{{ errors.end_time }}</span>
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <i class="fas fa-hourglass-half"></i>
                    Duration (minutes)
                    <span class="required">*</span>
                  </label>
                  <input type="number" class="form-input" v-model="form.duration_minutes" :class="{ 'error': errors.duration_minutes }" min="1" placeholder="120" required>
                  <span v-if="errors.duration_minutes" class="error-message">{{ errors.duration_minutes }}</span>
                </div>
              </div>
            </div>

            <!-- Marks & Academic Section -->
            <div class="form-section">
              <div class="section-header">
                <i class="fas fa-graduation-cap"></i>
                <h3>Marks & Academic Details</h3>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">
                    <i class="fas fa-award"></i>
                    Total Marks
                    <span class="required">*</span>
                  </label>
                  <input type="number" class="form-input" v-model="form.total_marks" :class="{ 'error': errors.total_marks }" min="1" placeholder="100" required>
                  <span v-if="errors.total_marks" class="error-message">{{ errors.total_marks }}</span>
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <i class="fas fa-check-double"></i>
                    Passing Marks
                    <span class="required">*</span>
                  </label>
                  <input type="number" class="form-input" v-model="form.pass_marks" :class="{ 'error': errors.pass_marks }" min="1" placeholder="40" required>
                  <span v-if="errors.pass_marks" class="error-message">{{ errors.pass_marks }}</span>
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <i class="fas fa-user-graduate"></i>
                    Year
                    <span class="required">*</span>
                  </label>
                  <select class="form-select" v-model="form.year" :class="{ 'error': errors.year }" required>
                    <option value="">Select Year</option>
                    <option value="1st">1st Year</option>
                    <option value="2nd">2nd Year</option>
                    <option value="3rd">3rd Year</option>
                    <option value="4th">4th Year</option>
                    <option value="5th">5th Year</option>
                  </select>
                  <span v-if="errors.year" class="error-message">{{ errors.year }}</span>
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <i class="fas fa-calendar-week"></i>
                    Semester
                    <span class="required">*</span>
                  </label>
                  <select class="form-select" v-model="form.semester" :class="{ 'error': errors.semester }" required>
                    <option value="">Select Semester</option>
                    <option value="1st">Semester 1</option>
                    <option value="2nd">Semester 2</option>
                  </select>
                  <span v-if="errors.semester" class="error-message">{{ errors.semester }}</span>
                </div>

<!--                <div class="form-group">-->
<!--                  <label class="form-label">-->
<!--                    <i class="fas fa-calendar-alt"></i>-->
<!--                    Academic Year-->
<!--                    <span class="required">*</span>-->
<!--                  </label>-->
<!--                  <input type="text" class="form-input" v-model="form.academic_year" :class="{ 'error': errors.academic_year }" placeholder="2024-2025" required>-->
<!--                  <span v-if="errors.academic_year" class="error-message">{{ errors.academic_year }}</span>-->
<!--                </div>-->
              </div>
            </div>

            <!-- Venue Section -->
            <div class="form-section">
              <div class="section-header">
                <i class="fas fa-map-marker-alt"></i>
                <h3>Venue Details</h3>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">
                    <i class="fas fa-chalkboard-teacher"></i>
                    Class Room
                    <span class="required">*</span>
                  </label>
                  <select class="form-select" v-model.number="form.classroom_id" :class="{ 'error': errors.classroom_id }" required>
                    <option value="">Select Class Room</option>
                    <option v-for="classe in classes" :key="classe.id" :value="classe.id">
                      {{ classe.name }}
                    </option>
                  </select>
                  <span v-if="errors.classroom_id" class="error-message">{{ errors.classroom_id }}</span>
                </div>
                <div class="form-group">
                  <label class="form-label">
                    <i class="fas fa-chalkboard-teacher"></i>
                    Session
                    <span class="required">*</span>
                  </label>
                  <select class="form-select" v-model.number="form.session_id" :class="{ 'error': errors.session_id }" required>
                    <option value="">Select Class Room</option>
                    <option v-for="session in sessions" :key="session.id" :value="session.id">
                      {{ session.name }}
                    </option>
                  </select>
                  <span v-if="errors.session_id" class="error-message">{{ errors.session_id }}</span>
                </div>

<!--                <div class="form-group">-->
<!--                  <label class="form-label">-->
<!--                    <i class="fas fa-door-open"></i>-->
<!--                    Room Number-->
<!--                  </label>-->
<!--                  <input type="text" class="form-input" v-model="form.room_number" placeholder="e.g., Hall-A, Room-301">-->
<!--                </div>-->

<!--                <div class="form-group span-2">-->
<!--                  <label class="form-label">-->
<!--                    <i class="fas fa-building"></i>-->
<!--                    Venue-->
<!--                  </label>-->
<!--                  <input type="text" class="form-input" v-model="form.venue" placeholder="e.g., Medical College Main Building">-->
<!--                </div>-->
              </div>
            </div>
            <!-- Additional Information Section -->
            <div class="form-section">
              <div class="section-header">
                <i class="fas fa-clipboard-list"></i>
                <h3>Additional Information</h3>
              </div>

              <div class="form-grid-full">
                <div class="form-group">
                  <label class="form-label">
                    <i class="fas fa-list-ul"></i>
                    Instructions
                  </label>
                  <textarea class="form-textarea" v-model="form.instructions" rows="3" placeholder="Special instructions for students..."></textarea>
                </div>

                <div class="form-group">
                  <label class="form-label">
                    <i class="fas fa-book-open"></i>
                    Syllabus Topics
                  </label>
                  <textarea class="form-textarea" v-model="form.syllabus_topics" rows="3" placeholder="Covered topics: Chapters 1-5..."></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="modal-footer-actions">
            <button type="button" class="btn-cancel" @click="close" :disabled="saving">
              <i class="fas fa-times"></i>
              Cancel
            </button>
            <button type="submit" class="btn-save" :disabled="saving">
              <span v-if="saving">
                <i class="fas fa-spinner fa-spin"></i>
                Saving...
              </span>
              <span v-else>
                <i class="fas fa-save"></i>
                Save Exam
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ExamFormModal',

  props: {
    show: Boolean,
    exam: Object,
    isEdit: Boolean,
    departments: Array,
    examTypes: Array
  },

  data() {
    return {
      form: this.getDefaultForm(),
      subjects: [],
      teachers: [],
      classes: [],
      sessions: [],
      selectedDepartment: null,
      errors: {},
      saving: false
    };
  },

  watch: {
    exam: {
      immediate: true,
      handler(ex) {
        if (ex) {
          this.form = { ...ex };
          if (this.form.exam_date && this.form.exam_date.includes(' ')) {
            this.form.exam_date = this.form.exam_date.substring(0, 10);
          }
          this.selectedDepartment = ex.subject ? ex.subject.department_id : null;
          if (this.selectedDepartment) {
            this.loadSubjects();
          }
          if (this.form.subject_id) {
            this.loadTeachers();
          }
        } else {
          this.form = this.getDefaultForm();
        }
      }
    }
  },
  mounted() {
    const serverDatetime = this.form.exam_date;
    this.form.exam_date = serverDatetime ? serverDatetime.substring(0, 10) : null;
    this.loadClassesRoom()
    this.loadSession()
  },
  methods: {
    getDefaultForm() {
      return {
        subject_id: '',
        exam_type_id: '',
        teacher_id: '',
        classroom_id : '',
        session_id : '',
        title: '',
        exam_date: '',
        start_time: '',
        end_time: '',
        duration_minutes: '',
        total_marks: '',
        passing_marks: '',
        room_number: '',
        venue: '',
        // academic_year: '',
        semester: '',
        year: '',
        instructions: '',
        syllabus_topics: ''
      };
    },

    async loadSubjects() {
      if (!this.selectedDepartment) return;

      try {
        const response = await this.$api.get('/get-subjects', {
          params: { department_id: this.selectedDepartment }
        });
        this.subjects = response.data;
        if (!this.isEdit) {
          this.form.subject_id = '';
          this.form.teacher_id = '';
          this.teachers = [];
        }
      } catch (error) {
        console.error('Error loading subjects:', error);
        this.$toast.error('Failed to load subjects');
      }
    },

    async loadClassesRoom() {
      try {
        const response = await this.$api.get('/get-classroom');
        this.classes = response.data;
        if (!this.isEdit) {
          this.form.classroom_id = '';
        }
      } catch (error) {
        console.error('Error loading classes:', error);
        this.$toast.error('Failed to load classes');
      }
    },
    async loadSession() {
      try {
        const response = await this.$api.get('/get-session');
        this.sessions = response.data;
        if (!this.isEdit) {
          this.form.session_id = '';
        }
      } catch (error) {
        console.error('Error loading classes:', error);
        this.$toast.error('Failed to load classes');
      }
    },

    async loadTeachers() {
      if (!this.form.subject_id) return;

      try {
        const response = await this.$api.get(`/subjects/${this.form.subject_id}/teachers`);
        this.teachers = response.data.data || response.data;
        if (!this.isEdit) {
          this.form.teacher_id = '';
        }
      } catch (error) {
        console.error('Error loading teachers:', error);
        this.$toast.error('Failed to load teachers');
      }
    },

    async saveExam() {
      this.saving = true;
      this.errors = {};

      try {
        if (this.isEdit) {
          await this.$api.put(`/exams/${this.form.id}`, this.form);
        } else {
          await this.$api.post('/exams', this.form);
        }

        this.$emit('saved');
      } catch (error) {
        if (error.response && error.response.data.errors) {
          this.errors = error.response.data.errors;
        }
        console.error('Error saving exam:', error);
        this.$toast.error('Failed to save exam');
      } finally {
        this.saving = false;
      }
    },

    close() {
      this.form = this.getDefaultForm();
      this.errors = {};
      this.subjects = [];
      this.teachers = [];
      this.selectedDepartment = null;
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

.modern-form-modal {
  background: white;
  border-radius: 24px;
  width: 100%;
  max-width: 1100px;
  max-height: 95vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlideUp 0.4s ease-out;
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Header */
.modal-header-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
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
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  flex-shrink: 0;
}

.modal-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  color: white;
}

.modal-subtitle {
  margin: 0.25rem 0 0 0;
  opacity: 0.95;
  font-size: 0.95rem;
}

.close-btn {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1);
}

/* Modal Body */
.modal-body-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  background: #f8f9fa;
}

/* Form Sections */
.form-section {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
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
  font-size: 1rem;
}

.section-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #2d3748;
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.form-grid-full {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.span-2 {
  grid-column: span 2;
}

/* Form Group */
.form-group {
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
  font-size: 0.9rem;
}

.required {
  color: #f5576c;
  font-weight: 700;
}

/* Form Inputs */
.form-input,
.form-select,
.form-textarea {
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
  color: #2d3748;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input:disabled,
.form-select:disabled {
  background: #f1f1f1;
  cursor: not-allowed;
  opacity: 0.6;
}

.form-input.error,
.form-select.error,
.form-textarea.error {
  border-color: #f5576c;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.error-message {
  color: #f5576c;
  font-size: 0.85rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.error-message::before {
  content: '⚠';
}

/* Footer Actions */
.modal-footer-actions {
  padding: 1.5rem 2rem;
  background: white;
  border-top: 2px solid #e2e8f0;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  border-radius: 0 0 24px 24px;
}

.btn-cancel,
.btn-save {
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-cancel:hover:not(:disabled) {
  background: #cbd5e0;
  transform: translateY(-2px);
}

.btn-save {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
}

.btn-cancel:disabled,
.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
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

/* Scrollbar Styling */
.modal-body-scroll::-webkit-scrollbar {
  width: 8px;
}

.modal-body-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.modal-body-scroll::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
}

.modal-body-scroll::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
}

/* Responsive Design */
@media (max-width: 992px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 0.5rem;
  }

  .modal-header-gradient {
    padding: 1.5rem;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .modal-title {
    font-size: 1.25rem;
  }

  .modal-body-scroll {
    padding: 1rem;
  }

  .form-section {
    padding: 1rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .span-2 {
    grid-column: span 1;
  }

  .modal-footer-actions {
    flex-direction: column;
    gap: 0.75rem;
  }

  .btn-cancel,
  .btn-save {
    width: 100%;
    justify-content: center;
  }
}
</style>