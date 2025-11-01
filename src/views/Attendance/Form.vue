<template>
  <div class="attendance-form">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h2 class="page-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
              <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
            </svg>
            {{ isEdit ? 'Edit' : 'Mark' }} Attendance
          </h2>
          <p class="page-subtitle">{{ isEdit ? 'Update' : 'Record' }} student attendance information</p>
        </div>
        <div class="header-actions">
          <router-link to="/attendance" class="btn btn-secondary-custom">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
            </svg>
            <span>Back to List</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Form Card -->
    <div class="form-card">
      <form @submit.prevent="submitForm">
        <!-- Basic Information Section -->
        <div class="form-section">
          <div class="section-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
              <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
            </svg>
            <h5>Basic Information</h5>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label required">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                </svg>
                Student
              </label>
              <select v-model="form.student_id" class="form-control" :class="{ 'error': errors.student_id }" required>
                <option value="">Select Student</option>
                <option v-for="student in students" :key="student.id" :value="student.id">
                  {{ student.name }}({{ student.roll_no }})
                </option>
              </select>
              <div v-if="errors.student_id" class="error-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                </svg>
                {{ errors.student_id[0] }}
              </div>
            </div>

            <div class="form-group">
              <label class="form-label required">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/>
                  <path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/>
                </svg>
                Card Type
              </label>
              <select v-model="form.card_type_id" class="form-control" :class="{ 'error': errors.card_type_id }" required>
                <option value="">Select Card Type</option>
                <option v-for="type in cardTypes" :key="type.id" :value="type.id">
                  {{ type.card_name }}
                </option>
              </select>
              <div v-if="errors.card_type_id" class="error-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                </svg>
                {{ errors.card_type_id[0] }}
              </div>
            </div>

            <div class="form-group">
              <label class="form-label required">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5"/>
                </svg>
                Class Date
              </label>
              <input
                  v-model="form.class_date"
                  type="date"
                  class="form-control"
                  :class="{ 'error': errors.class_date }"
                  required
              />
              <div v-if="errors.class_date" class="error-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                </svg>
                {{ errors.class_date[0] }}
              </div>
            </div>

            <div class="form-group">
              <label class="form-label required">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5z"/>
                </svg>
                Class Type
              </label>
              <select
                  v-model="form.class_type"
                  class="form-control"
                  :class="{ 'error': errors.class_type }"
                  required
              >
                <option value="">Select Type</option>
                <option value="lecture">Lecture</option>
                <option value="tutorial">Tutorial</option>
                <option value="practical">Practical</option>
                <option value="demonstration">Demonstration</option>
                <option value="integrated">Integrated</option>
                <option value="other">Other</option>
              </select>
              <div v-if="errors.class_type" class="error-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                </svg>
                {{ errors.class_type[0] }}
              </div>
            </div>

            <div class="form-group full-width">
              <label class="form-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M3 2.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0v.006c0 .07 0 .27-.038.494H15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 14.5V7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.038A3 3 0 0 1 3 2.506zm1.068.5H7v-.5a1.5 1.5 0 1 0-3 0c0 .085.002.274.045.43zM9 3h2.932l.023-.07c.043-.156.045-.345.045-.43a1.5 1.5 0 0 0-3 0zM1 4v2h6V4zm8 0v2h6V4zm5 3H9v8h4.5a.5.5 0 0 0 .5-.5zm-7 8V7H2v7.5a.5.5 0 0 0 .5.5z"/>
                </svg>
                Class Topic
              </label>
              <input
                  v-model="form.class_topic"
                  type="text"
                  class="form-control"
                  :class="{ 'error': errors.class_topic }"
                  placeholder="Enter class topic or subject"
              />
              <div v-if="errors.class_topic" class="error-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                </svg>
                {{ errors.class_topic[0] }}
              </div>
            </div>
          </div>
        </div>

        <!-- Attendance Status Section -->
        <div class="form-section">
          <div class="section-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
              <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1" fill="none"/>
            </svg>
            <h5>Attendance Status</h5>
          </div>

          <div class="status-section">
            <label class="form-label required">Select Status</label>
            <div class="status-options">
              <label class="status-card" :class="{ active: form.status === 'present' }">
                <input
                    v-model="form.status"
                    type="radio"
                    value="present"
                    name="status"
                    required
                />
                <div class="status-content status-present">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                  </svg>
                  <span class="status-label">Present</span>
                </div>
              </label>

              <label class="status-card" :class="{ active: form.status === 'absent' }">
                <input
                    v-model="form.status"
                    type="radio"
                    value="absent"
                    name="status"
                />
                <div class="status-content status-absent">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
                  </svg>
                  <span class="status-label">Absent</span>
                </div>
              </label>

              <label class="status-card" :class="{ active: form.status === 'late' }">
                <input
                    v-model="form.status"
                    type="radio"
                    value="late"
                    name="status"
                />
                <div class="status-content status-late">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                  </svg>
                  <span class="status-label">Late</span>
                </div>
              </label>

              <label class="status-card" :class="{ active: form.status === 'excused' }">
                <input
                    v-model="form.status"
                    type="radio"
                    value="excused"
                    name="status"
                />
                <div class="status-content status-excused">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                  </svg>
                  <span class="status-label">Excused</span>
                </div>
              </label>
            </div>
            <div v-if="errors.status" class="error-message">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
              </svg>
              {{ errors.status[0] }}
            </div>
          </div>
        </div>

        <!-- Teacher Information Section -->
        <div class="form-section">
          <div class="section-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
            </svg>
            <h5>Teacher Information</h5>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/>
                </svg>
                Conducted By
              </label>
              <select v-model="form.conducted_by_teacher_id" class="form-control" :class="{ 'error': errors.conducted_by_teacher_id }">
                <option value="">Select Teacher (Optional)</option>
                <option v-for="lecturer in lecturers" :key="lecturer.id" :value="lecturer.id">
                  {{ lecturer.name }}
                </option>
              </select>
              <div v-if="errors.conducted_by_teacher_id" class="error-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                </svg>
                {{ errors.conducted_by_teacher_id[0] }}
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                </svg>
                Marked By
              </label>
              <select v-model="form.marked_by_teacher_id" class="form-control" :class="{ 'error': errors.marked_by_teacher_id }">
                <option value="">Select Teacher (Optional)</option>
                <option v-for="lecturer in lecturers" :key="lecturer.id" :value="lecturer.id">
                  {{ lecturer.name }}
                </option>
              </select>
              <div v-if="errors.marked_by_teacher_id" class="error-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                </svg>
                {{ errors.marked_by_teacher_id[0] }}
              </div>
            </div>

            <div class="form-group full-width">
              <label class="form-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1"/>
                  <path d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1"/>
                </svg>
                Remarks
              </label>
              <textarea
                  v-model="form.remarks"
                  class="form-control textarea-control"
                  :class="{ 'error': errors.remarks }"
                  rows="4"
                  placeholder="Enter any additional remarks or notes about the attendance..."
              ></textarea>
              <div v-if="errors.remarks" class="error-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                </svg>
                {{ errors.remarks[0] }}
              </div>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <router-link to="/attendance" class="btn btn-cancel">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
            </svg>
            Cancel
          </router-link>
          <button type="submit" class="btn btn-submit" :disabled="submitting">
            <span v-if="submitting" class="spinner"></span>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
              <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1" fill="none"/>
            </svg>
            {{ isEdit ? 'Update' : 'Mark' }} Attendance
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import api from '@/plugins/card';
import cardTypeService from "@/views/Admin/card-type/cardTypeService";

export default {
  name: 'AttendanceForm',
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {
      form: {
        student_id: '',
        card_type_id: '',
        class_date: new Date().toISOString().split('T')[0],
        class_type: '',
        class_topic: '',
        status: 'present',
        remarks: '',
        conducted_by_teacher_id: '',
        marked_by_teacher_id: ''
      },
      errors: {},
      submitting: false,
      lecturers : [],
      students : [],
      cardTypes : []
    };
  },
  computed: {
    isEdit() {
      return !!this.id;
    }
  },
  mounted() {
    if (this.isEdit) {
      this.loadAttendance();
    }
    this.loadStudents()
    this.loadCardTypes()
    this.loadLecturers()
  },
  methods: {
    async loadStudents() {
      try {
        const response = await this.$api.get('/get-students');
        this.students = response.data;
      } catch (error) {
        console.error('Failed to load stats');
      }
    },
    async loadLecturers() {
      try {
        const response = await this.$api.get('/get-teacher');
        this.lecturers = response.data;
      } catch (error) {
        console.error('Failed to load students:', error);
        this.$root.$emit('show-notification', {
          message: 'Failed to load students',
          type: 'danger'
        });
      }
    },
    async loadCardTypes() {
      try {
        const response = await cardTypeService.getAll({ per_page: 100 });
        this.cardTypes = response.data.data || response.data;
      } catch (error) {
        console.error('Failed to load card types:', error);
      }
    },
    async loadAttendance() {
      try {
        const response = await api.attendance.getById(this.id);
        const attendance = response.data;

        this.form = {
          student_id: attendance.student_id,
          card_type_id: attendance.card_type_id,
          class_date: attendance.class_date.split('T')[0] || '',
          class_type: attendance.class_type,
          class_topic: attendance.class_topic || '',
          status: attendance.status,
          remarks: attendance.remarks || '',
          conducted_by_teacher_id: attendance.conducted_by_teacher_id || '',
          marked_by_teacher_id: attendance.marked_by_teacher_id || ''
        };
      } catch (error) {
        this.$root.$emit('show-notification', {
          message: 'Failed to load attendance',
          type: 'danger'
        });
        this.$router.push('/attendance');
      }
    },
    async submitForm() {
      this.errors = {};
      this.submitting = true;

      try {
        if (this.isEdit) {
          await api.attendance.update(this.id, this.form);
          this.$root.$emit('show-notification', {
            message: 'Attendance updated successfully',
            type: 'success'
          });
        } else {
          await api.attendance.create(this.form);
          this.$root.$emit('show-notification', {
            message: 'Attendance marked successfully',
            type: 'success'
          });
        }

        this.$router.push('/attendance');
      } catch (error) {
        if (error.response && error.response.status === 422) {
          this.errors = error.response.data.errors || {};
          this.$root.$emit('show-notification', {
            message: error.response.data.message || 'Validation failed',
            type: 'danger'
          });
        } else {
          this.$root.$emit('show-notification', {
            message: 'An error occurred',
            type: 'danger'
          });
        }
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>

<style scoped>
/* Modern Color Palette */
:root {
  --primary: #6366f1;
  --primary-dark: #4f46e5;
  --primary-light: #818cf8;
  --success: #10b981;
  --success-dark: #059669;
  --danger: #ef4444;
  --danger-dark: #dc2626;
  --warning: #f59e0b;
  --warning-dark: #d97706;
  --info: #3b82f6;
  --info-dark: #2563eb;
  --secondary: #6b7280;
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Base Styles */
.attendance-form {
  padding: 24px;
  background: var(--gray-50);
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Page Header */
.page-header {
  margin-bottom: 32px;
  animation: slideDown 0.5s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--gray-900);
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-title svg {
  color: var(--primary);
  flex-shrink: 0;
}

.page-subtitle {
  color: var(--gray-600);
  margin: 0;
  font-size: 16px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* Custom Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  box-shadow: var(--shadow-sm);
}

.btn svg {
  flex-shrink: 0;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn:active {
  transform: translateY(0);
}

.btn-secondary-custom {
  background: linear-gradient(135deg, var(--gray-100) 0%, var(--gray-200) 100%);
  color: var(--gray-700);
}

.btn-secondary-custom:hover {
  background: linear-gradient(135deg, var(--gray-200) 0%, var(--gray-300) 100%);
}

.btn-cancel {
  background: white;
  color: var(--gray-700);
  border: 2px solid var(--gray-200);
}

.btn-cancel:hover {
  background: var(--gray-50);
  border-color: var(--gray-300);
}

.btn-submit {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Form Card */
.form-card {
  background: white;
  border-radius: 16px;
  box-shadow: var(--shadow-md);
  padding: 32px;
  animation: fadeInUp 0.5s ease-out 0.1s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Form Sections */
.form-section {
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 2px solid var(--gray-100);
}

.form-section:last-of-type {
  border-bottom: none;
  padding-bottom: 0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--gray-200);
}

.section-header svg {
  color: var(--primary);
  flex-shrink: 0;
}

.section-header h5 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--gray-800);
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

/* Form Labels */
.form-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-700);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.form-label svg {
  color: var(--primary);
  flex-shrink: 0;
  opacity: 0.8;
}

.form-label.required::after {
  content: '*';
  color: var(--danger);
  margin-left: 4px;
  font-weight: 700;
}

/* Form Controls */
.form-control {
  padding: 12px 16px;
  border: 2px solid var(--gray-200);
  border-radius: 10px;
  font-size: 14px;
  color: var(--gray-700);
  background: white;
  transition: all 0.3s ease;
  outline: none;
  font-family: inherit;
}

.form-control:hover {
  border-color: var(--gray-300);
}

.form-control:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-control.error {
  border-color: var(--danger);
}

.form-control.error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.textarea-control {
  resize: vertical;
  min-height: 100px;
  line-height: 1.6;
}

/* Error Messages */
.error-message {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--danger);
  font-size: 13px;
  margin-top: 6px;
  font-weight: 500;
}

.error-message svg {
  flex-shrink: 0;
}

/* Status Section */
.status-section {
  padding: 20px;
  background: var(--gray-50);
  border-radius: 12px;
}

.status-section .form-label {
  margin-bottom: 16px;
  font-size: 15px;
}

.status-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
}

.status-card {
  position: relative;
  cursor: pointer;
}

.status-card input[type="radio"] {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.status-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px;
  border-radius: 12px;
  border: 3px solid transparent;
  background: white;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-sm);
}

.status-content svg {
  transition: transform 0.3s ease;
}

.status-card:hover .status-content {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.status-card.active .status-content {
  border-color: currentColor;
  box-shadow: var(--shadow-md);
}

.status-card.active .status-content svg {
  transform: scale(1.2);
}

.status-present {
  color: var(--success);
}

.status-card.active .status-present {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
}

.status-absent {
  color: var(--danger);
}

.status-card.active .status-absent {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
}

.status-late {
  color: var(--warning);
}

.status-card.active .status-late {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
}

.status-excused {
  color: var(--info);
}

.status-card.active .status-excused {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
}

.status-label {
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding-top: 24px;
  margin-top: 8px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .attendance-form {
    padding: 16px;
  }

  .page-title {
    font-size: 24px;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions .btn {
    flex: 1;
    justify-content: center;
  }

  .form-card {
    padding: 24px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .status-options {
    grid-template-columns: repeat(2, 1fr);
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .form-actions .btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 20px;
  }

  .page-title svg {
    width: 24px;
    height: 24px;
  }

  .form-card {
    padding: 20px;
  }

  .section-header h5 {
    font-size: 16px;
  }

  .status-options {
    grid-template-columns: 1fr;
  }

  .status-content {
    flex-direction: row;
    justify-content: flex-start;
    padding: 16px;
  }

  .status-content svg {
    width: 20px;
    height: 20px;
  }
}

/* Accessibility */
.form-control:focus,
.btn:focus {
  outline: 3px solid var(--primary);
  outline-offset: 2px;
}

/* Print Styles */
@media print {
  .header-actions,
  .form-actions {
    display: none !important;
  }

  .attendance-form {
    background: white;
    padding: 0;
  }

  .form-card {
    box-shadow: none;
    border: 1px solid var(--gray-300);
  }
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: var(--gray-100);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: var(--gray-400);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--gray-500);
}
</style>