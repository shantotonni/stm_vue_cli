<template>
  <div class="student-create-container">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div>
          <h1 class="page-title">Add New Student</h1>
          <p class="page-subtitle">Fill in the student information to create a new record</p>
        </div>
      </div>
      <button @click="goBack" class="btn-back">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
        Back to List
      </button>
    </div>

    <!-- Form Container -->
    <form @submit.prevent="submitForm" class="student-form">

      <!-- Personal Information -->
      <div class="form-section">
        <div class="section-header">
          <div class="section-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <h2 class="section-title">Personal Information</h2>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label required">User</label>
            <div class="input-wrapper">
              <select v-model="form.user_id" class="form-input" :class="{ 'input-error': errors.user_id }">
                <option value="">Select User</option>
                <option v-for="user in users" :key="user.id" :value="user.id">
                  {{ user.name }} ({{ user.login_code }})
                </option>
              </select>
              <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <span v-if="errors.user_id" class="error-message">{{ errors.user_id[0] }}</span>
          </div>

          <div class="form-group">
            <label class="form-label required">Full Name</label>
            <div class="input-wrapper">
              <input
                  v-model="form.name"
                  type="text"
                  class="form-input"
                  :class="{ 'input-error': errors.name }"
                  placeholder="Enter full name"
              />
              <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <span v-if="errors.name" class="error-message">{{ errors.name[0] }}</span>
          </div>

          <div class="form-group">
            <label class="form-label required">Date of Birth</label>
            <div class="input-wrapper">
              <input
                  v-model="form.date_of_birth"
                  type="date"
                  class="form-input"
                  :class="{ 'input-error': errors.date_of_birth }"
              />
              <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <span v-if="errors.date_of_birth" class="error-message">{{ errors.date_of_birth[0] }}</span>
          </div>

          <div class="form-group">
            <label class="form-label required">Blood Group</label>
            <div class="input-wrapper">
              <select v-model="form.blood_group" class="form-input" :class="{ 'input-error': errors.blood_group }">
                <option value="">Select Blood Group</option>
                <option v-for="bg in bloodGroups" :key="bg" :value="bg">{{ bg }}</option>
              </select>
              <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <span v-if="errors.blood_group" class="error-message">{{ errors.blood_group[0] }}</span>
          </div>

          <div class="form-group">
            <label class="form-label">NID Number</label>
            <div class="input-wrapper">
              <input
                  v-model="form.nid"
                  type="text"
                  class="form-input"
                  placeholder="National ID Number"
              />
              <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="M7 15h0M2 9.5h20"/>
              </svg>
            </div>
          </div>

          <div class="form-group full-width">
            <label class="form-label">Nationality</label>
            <div class="input-wrapper">
              <input
                  v-model="form.nationality"
                  type="text"
                  class="form-input"
                  placeholder="Enter nationality"
              />
              <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </div>
          </div>

          <div class="form-group full-width">
            <label class="form-label">Address</label>
            <div class="input-wrapper">
              <textarea
                  v-model="form.address"
                  class="form-textarea"
                  rows="3"
                  placeholder="Enter full address"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Academic Information -->
      <div class="form-section">
        <div class="section-header">
          <div class="section-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <h2 class="section-title">Academic Information</h2>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label required">Phase</label>
            <div class="input-wrapper">
              <select v-model="form.phase_id" class="form-input" :class="{ 'input-error': errors.phase_id }">
                <option value="">Select phase</option>
                <option v-for="phase in phases" :key="phase.id" :value="phase.id">
                  {{ phase.name }}
                </option>
              </select>
              <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <span v-if="errors.phase_id" class="error-message">{{ errors.phase_id[0] }}</span>
          </div>

          <div class="form-group">
            <label class="form-label required">Program</label>
            <div class="input-wrapper">
              <select v-model="form.program_id" class="form-input" :class="{ 'input-error': errors.program_id }">
                <option value="">Select Program</option>
                <option v-for="program in programs" :key="program.id" :value="program.id">
                  {{ program.name }}
                </option>
              </select>
              <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <span v-if="errors.program_id" class="error-message">{{ errors.program_id[0] }}</span>
          </div>

          <div class="form-group">
            <label class="form-label required">Session</label>
            <div class="input-wrapper">
              <select v-model="form.session_id" class="form-input" :class="{ 'input-error': errors.session_id }">
                <option value="">Select Session</option>
                <option v-for="session in sessions" :key="session.id" :value="session.id">
                  {{ session.name }}
                </option>
              </select>
              <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <span v-if="errors.session_id" class="error-message">{{ errors.session_id[0] }}</span>
          </div>

          <div class="form-group">
            <label class="form-label required">Category</label>
            <div class="input-wrapper">
              <select v-model="form.category_id" class="form-input" :class="{ 'input-error': errors.category_id }">
                <option value="">Select Session</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
              <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <span v-if="errors.category_id" class="error-message">{{ errors.category_id[0] }}</span>
          </div>

          <div class="form-group">
            <label class="form-label required">Student ID</label>
            <div class="input-wrapper">
              <input
                  v-model="form.student_id_number"
                  type="text"
                  class="form-input"
                  :class="{ 'input-error': errors.student_id_number }"
                  placeholder="e.g., 2024001"
              />
              <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <span v-if="errors.student_id_number" class="error-message">{{ errors.student_id_number[0] }}</span>
          </div>

          <div class="form-group">
            <label class="form-label required">Roll Number</label>
            <div class="input-wrapper">
              <input
                  v-model="form.roll_no"
                  type="text"
                  class="form-input"
                  :class="{ 'input-error': errors.roll_no }"
                  placeholder="Enter roll number"
              />
              <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <span v-if="errors.roll_no" class="error-message">{{ errors.roll_no[0] }}</span>
          </div>

          <div class="form-group">
            <label class="form-label required">Department</label>
            <div class="input-wrapper">
              <select v-model="form.department_id" class="form-input" :class="{ 'input-error': errors.department_id }">
                <option value="">Select Department</option>
                <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                  {{ dept.name }}
                </option>
              </select>
              <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              </svg>
            </div>
            <span v-if="errors.department_id" class="error-message">{{ errors.department_id[0] }}</span>
          </div>

<!--          <div class="form-group">-->
<!--            <label class="form-label required">Session</label>-->
<!--            <div class="input-wrapper">-->
<!--              <input-->
<!--                  v-model="form.session"-->
<!--                  type="text"-->
<!--                  class="form-input"-->
<!--                  :class="{ 'input-error': errors.session }"-->
<!--                  placeholder="e.g., 2023-2024"-->
<!--              />-->
<!--            </div>-->
<!--            <span v-if="errors.session" class="error-message">{{ errors.session[0] }}</span>-->
<!--          </div>-->

          <div class="form-group">
            <label class="form-label required">Year</label>
            <div class="input-wrapper">
              <select v-model="form.year" class="form-input" :class="{ 'input-error': errors.year }">
                <option value="">Select Year</option>
                <option value="1st">1st Year</option>
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
                <option value="5th">5th Year</option>
              </select>
            </div>
            <span v-if="errors.year" class="error-message">{{ errors.year[0] }}</span>
          </div>

          <div class="form-group">
            <label class="form-label required">Semester</label>
            <div class="input-wrapper">
              <select v-model="form.semester" class="form-input" :class="{ 'input-error': errors.semester }">
                <option value="">Select Semester</option>
                <option value="1st">1st Semester</option>
                <option value="2nd">2nd Semester</option>
              </select>
            </div>
            <span v-if="errors.semester" class="error-message">{{ errors.semester[0] }}</span>
          </div>

          <div class="form-group">
            <label class="form-label">Batch</label>
            <div class="input-wrapper">
              <input
                  v-model="form.batch"
                  type="number"
                  class="form-input"
                  placeholder="e.g., 2023"
              />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label required">Admission Date</label>
            <div class="input-wrapper">
              <input
                  v-model="form.admission_date"
                  type="date"
                  class="form-input"
                  :class="{ 'input-error': errors.admission_date }"
              />
            </div>
            <span v-if="errors.admission_date" class="error-message">{{ errors.admission_date[0] }}</span>
          </div>

<!--          <div class="form-group">-->
<!--            <label class="form-label">Category</label>-->
<!--            <div class="input-wrapper">-->
<!--              <input-->
<!--                  v-model="form.category"-->
<!--                  type="text"-->
<!--                  class="form-input"-->
<!--                  placeholder="Student category"-->
<!--              />-->
<!--            </div>-->
<!--          </div>-->

          <div class="form-group">
            <label class="form-label">Hostel Resident</label>
            <div class="input-wrapper">
              <select v-model="form.is_hostel" class="form-input">
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="form-section">
        <div class="section-header">
          <div class="section-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </div>
          <h2 class="section-title">Contact Information</h2>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Email</label>
            <div class="input-wrapper">
              <input
                  v-model="form.email"
                  type="email"
                  class="form-input"
                  :class="{ 'input-error': errors.email }"
                  placeholder="student@example.com"
              />
              <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <span v-if="errors.email" class="error-message">{{ errors.email[0] }}</span>
          </div>

          <div class="form-group">
            <label class="form-label">Mobile Number</label>
            <div class="input-wrapper">
              <input
                  v-model="form.mobile"
                  type="text"
                  class="form-input"
                  placeholder="+880 1xxx-xxxxxx"
              />
              <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                <line x1="12" y1="18" x2="12.01" y2="18"/>
              </svg>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label required">Guardian Name</label>
            <div class="input-wrapper">
              <input
                  v-model="form.guardian_name"
                  type="text"
                  class="form-input"
                  :class="{ 'input-error': errors.guardian_name }"
                  placeholder="Enter guardian name"
              />
              <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <span v-if="errors.guardian_name" class="error-message">{{ errors.guardian_name[0] }}</span>
          </div>

          <div class="form-group">
            <label class="form-label required">Guardian Phone</label>
            <div class="input-wrapper">
              <input
                  v-model="form.guardian_phone"
                  type="text"
                  class="form-input"
                  :class="{ 'input-error': errors.guardian_phone }"
                  placeholder="Guardian contact number"
              />
              <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <span v-if="errors.guardian_phone" class="error-message">{{ errors.guardian_phone[0] }}</span>
          </div>

          <div class="form-group">
            <label class="form-label required">Emergency Contact</label>
            <div class="input-wrapper">
              <input
                  v-model="form.emergency_contact"
                  type="text"
                  class="form-input"
                  :class="{ 'input-error': errors.emergency_contact }"
                  placeholder="Emergency contact number"
              />
              <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <span v-if="errors.emergency_contact" class="error-message">{{ errors.emergency_contact[0] }}</span>
          </div>

          <div class="form-group">
            <label class="form-label">Status</label>
            <div class="input-wrapper">
              <select v-model="form.status" class="form-input">
                <option value="Y">Active</option>
                <option value="N">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <button type="button" @click="goBack" class="btn-cancel">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
          Cancel
        </button>
        <button type="submit" :disabled="submitting" class="btn-submit">
          <svg v-if="!submitting" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <svg v-else class="spinner" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="2" x2="12" y2="6"/>
            <line x1="12" y1="18" x2="12" y2="22"/>
            <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/>
            <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
            <line x1="2" y1="12" x2="6" y2="12"/>
            <line x1="18" y1="12" x2="22" y2="12"/>
            <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/>
            <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
          </svg>
          <span v-if="submitting">Saving...</span>
          <span v-else>Save Student</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'StudentCreate',

  data() {
    return {
      form: {
        user_id: '',
        department_id: '',
        name: '',
        student_id_number: '',
        roll_no: '',
        email: '',
        mobile: '',
        session_id: '',
        category_id: '',
        phase_id: '',
        program_id: '',
        year: '',
        semester: '',
        is_hostel: '',
        nationality: 'Bangladeshi',
        address: '',
        nid: '',
        date_of_birth: '',
        batch: null,
        blood_group: '',
        guardian_name: '',
        guardian_phone: '',
        emergency_contact: '',
        admission_date: '',
        status: 'Y'
      },
      departments: [],
      categories: [],
      programs: [],
      phases: [],
      users: [],
      sessions: [],
      bloodGroups: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
      errors: {},
      submitting: false
    };
  },

  mounted() {
    this.fetchDepartments();
    this.fetchUsers();
    this.fetchSession();
    this.fetchCategory();
    this.loadProgram();
    this.fetchPhase();
  },

  methods: {
    async fetchPhase() {
      try {
        const response = await this.$api.get('/get-phases');
        this.phases = response.data;
      } catch (error) {
        console.error('Error fetching departments:', error);
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
    async loadProgram() {
      try {
        const response = await this.$api.get('/get-program');
        this.programs = response.data;
      } catch (error) {
        this.showError('Failed to load departments');
      }
    },
    async fetchSession() {
      try {
        const response = await this.$api.get('/get-session');
        this.sessions = response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    async fetchCategory() {
      try {
        const response = await this.$api.get('/get-category');
        this.categories = response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    async fetchUsers() {
      try {
        const response = await this.$api.get('/student-users');
        this.users = response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    async submitForm() {
      this.submitting = true;
      this.errors = {};

      try {
        const response = await this.$api.post('/students', this.form);
        this.$toasted.success('Student created successfully!');
        console.log(response)
        this.$router.push({ name: 'student-list' });
      } catch (error) {
        if (error.response && error.response.status === 422) {
          this.errors = error.response.data.errors;
          this.$toasted.error('Please check the form for errors');
        } else {
          this.$toasted.error('Failed to create student');
        }
        console.error('Error creating student:', error);
      } finally {
        this.submitting = false;
      }
    },

    goBack() {
      this.$router.push({ name: 'StudentList' });
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.student-create-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-icon {
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-subtitle {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.9);
  margin: 6px 0 0 0;
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

/* Form */
.student-form {
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.form-section {
  padding: 40px;
  border-bottom: 1px solid #f0f0f0;
}

.form-section:last-of-type {
  border-bottom: none;
}

/* Section Header */
.section-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
}

.section-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.section-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.form-label.required::after {
  content: '*';
  color: #e53e3e;
  margin-left: 4px;
  font-size: 16px;
}

/* Input Wrapper */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  right: 14px;
  color: #a0aec0;
  pointer-events: none;
  transition: color 0.3s ease;
}

.form-input:focus ~ .input-icon,
.form-textarea:focus ~ .input-icon {
  color: #667eea;
}

/* Inputs */
.form-input,
.form-textarea {
  width: 100%;
  padding: 14px 46px 14px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  color: #2d3748;
  background: #f7fafc;
  transition: all 0.3s ease;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #a0aec0;
}

.form-input:hover,
.form-textarea:hover {
  border-color: #cbd5e0;
  background: white;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  padding-right: 16px;
  font-family: inherit;
}

.input-error {
  border-color: #e53e3e !important;
  background: #fff5f5 !important;
}

.input-error:focus {
  box-shadow: 0 0 0 4px rgba(229, 62, 62, 0.1) !important;
}

.error-message {
  color: #e53e3e;
  font-size: 13px;
  margin-top: 6px;
  font-weight: 500;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding: 32px 40px;
  background: linear-gradient(to bottom, #f7fafc 0%, #edf2f7 100%);
}

.btn-cancel,
.btn-submit {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: white;
  color: #4a5568;
  border: 2px solid #e2e8f0;
}

.btn-cancel:hover {
  background: #f7fafc;
  border-color: #cbd5e0;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5);
}

.btn-submit:active:not(:disabled) {
  transform: translateY(0);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .student-create-container {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .header-icon {
    width: 56px;
    height: 56px;
  }

  .page-title {
    font-size: 26px;
  }

  .page-subtitle {
    font-size: 14px;
  }

  .btn-back {
    width: 100%;
    justify-content: center;
  }

  .form-section {
    padding: 24px;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .section-header {
    flex-direction: row;
    gap: 12px;
  }

  .section-icon {
    width: 40px;
    height: 40px;
  }

  .section-title {
    font-size: 19px;
  }

  .form-actions {
    flex-direction: column;
    padding: 24px;
  }

  .btn-cancel,
  .btn-submit {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 22px;
  }

  .form-section {
    padding: 20px;
  }

  .section-title {
    font-size: 17px;
  }

  .form-input,
  .form-textarea {
    font-size: 14px;
    padding: 12px 42px 12px 14px;
  }

  .form-label {
    font-size: 13px;
  }
}

/* Dark Mode Support (Optional) */
@media (prefers-color-scheme: dark) {
  .student-form {
    background: #1a202c;
  }

  .form-section {
    border-bottom-color: #2d3748;
  }

  .section-title {
    color: #e2e8f0;
  }

  .form-label {
    color: #cbd5e0;
  }

  .form-input,
  .form-textarea {
    background: #2d3748;
    border-color: #4a5568;
    color: #e2e8f0;
  }

  .form-input:hover,
  .form-textarea:hover {
    background: #374151;
    border-color: #6b7280;
  }

  .form-actions {
    background: linear-gradient(to bottom, #2d3748 0%, #1a202c 100%);
  }

  .btn-cancel {
    background: #2d3748;
    color: #e2e8f0;
    border-color: #4a5568;
  }

  .btn-cancel:hover {
    background: #374151;
    border-color: #6b7280;
  }
}
</style>