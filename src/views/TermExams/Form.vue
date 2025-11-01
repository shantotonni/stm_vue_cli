<template>
  <div class="term-exam-form">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h2 class="page-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/>
              <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
            </svg>
            {{ isEdit ? 'Edit' : 'Create' }} Term Exam
          </h2>
          <p class="page-subtitle">{{ isEdit ? 'Update' : 'Add new' }} term examination details</p>
        </div>
        <div class="header-actions">
          <router-link to="/term-exams" class="btn btn-secondary-custom">
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
                Academic Year
              </label>
              <select v-model="form.academic_year_id" class="form-control" :class="{ 'error': errors.academic_year_id }" required>
                <option value="">Select Academic Year</option>
                <option v-for="year in academicYears" :key="year.id" :value="year.id">
                  {{ year.name }}
                </option>
              </select>
              <div v-if="errors.academic_year_id" class="error-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                </svg>
                {{ errors.academic_year_id[0] }}
              </div>
            </div>

            <div class="form-group">
              <label class="form-label required">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M9.669.864 8 0 6.331.864l-1.858.282-.842 1.68-1.337 1.32L2.6 6l-.306 1.854 1.337 1.32.842 1.68 1.858.282L8 12l1.669-.864 1.858-.282.842-1.68 1.337-1.32L13.4 6l.306-1.854-1.337-1.32-.842-1.68zm1.196 1.193.684 1.365 1.086 1.072L12.387 6l.248 1.506-1.086 1.072-.684 1.365-1.51.229L8 10.874l-1.355-.702-1.51-.229-.684-1.365-1.086-1.072L3.614 6l-.25-1.506 1.087-1.072.684-1.365 1.51-.229L8 1.126l1.356.702z"/>
                </svg>
                Term Number
              </label>
              <input
                  v-model.number="form.term_number"
                  type="number"
                  min="1"
                  class="form-control"
                  :class="{ 'error': errors.term_number }"
                  required
              />
              <div v-if="errors.term_number" class="error-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                </svg>
                {{ errors.term_number[0] }}
              </div>
            </div>

            <div class="form-group">
              <label class="form-label required">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5z"/>
                </svg>
                Term Name
              </label>
              <input
                  v-model="form.term_name"
                  type="text"
                  class="form-control"
                  :class="{ 'error': errors.term_name }"
                  placeholder="e.g., First Term Exam"
                  required
              />
              <div v-if="errors.term_name" class="error-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                </svg>
                {{ errors.term_name[0] }}
              </div>
            </div>

            <div class="form-group full-width">
              <label class="form-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"/>
                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
                </svg>
                Exam Date
              </label>
              <input
                  v-model="form.exam_date"
                  type="date"
                  class="form-control"
                  :class="{ 'error': errors.exam_date }"
              />
              <div v-if="errors.exam_date" class="error-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                </svg>
                {{ errors.exam_date[0] }}
              </div>
            </div>
          </div>
        </div>

        <!-- Marks Information Section -->
        <div class="form-section">
          <div class="section-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917zM8 8.46 1.758 5.965 8 3.052l6.242 2.913z"/>
              <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466zm-.068 1.873.22-.748 3.496 1.311a.5.5 0 0 0 .352 0l3.496-1.311.22.748L8 12.46z"/>
            </svg>
            <h5>Marks Information</h5>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm6 4c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995A.905.905 0 0 1 8 4m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                </svg>
                Total Marks
              </label>
              <div class="input-with-icon">
                <input
                    v-model.number="form.total_marks"
                    type="number"
                    step="0.01"
                    min="0"
                    class="form-control"
                    :class="{ 'error': errors.total_marks }"
                    placeholder="100.00"
                />
                <span class="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5z"/>
                  </svg>
                </span>
              </div>
              <div v-if="errors.total_marks" class="error-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                </svg>
                {{ errors.total_marks[0] }}
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                </svg>
                Pass Marks
              </label>
              <div class="input-with-icon">
                <input
                    v-model.number="form.pass_marks"
                    type="number"
                    step="0.01"
                    min="0"
                    class="form-control"
                    :class="{ 'error': errors.pass_marks }"
                    placeholder="40.00"
                />
                <span class="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                  </svg>
                </span>
              </div>
              <div v-if="errors.pass_marks" class="error-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                </svg>
                {{ errors.pass_marks[0] }}
              </div>
            </div>

            <!-- Pass Percentage Calculator -->
            <div class="form-group full-width" v-if="form.total_marks && form.pass_marks">
              <div class="calculator-card">
                <div class="calculator-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                    <path d="M4 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"/>
                  </svg>
                </div>
                <div class="calculator-content">
                  <h6>Pass Percentage</h6>
                  <div class="percentage-display">
                    {{ ((form.pass_marks / form.total_marks) * 100).toFixed(2) }}%
                  </div>
                  <div class="marks-breakdown">
                    <span>{{ form.pass_marks }} out of {{ form.total_marks }} marks</span>
                  </div>
                </div>
                <div class="calculator-visual">
                  <div class="progress-ring">
                    <svg width="80" height="80">
                      <circle
                          class="progress-ring-circle-bg"
                          stroke-width="6"
                          fill="transparent"
                          r="34"
                          cx="40"
                          cy="40"
                      />
                      <circle
                          class="progress-ring-circle"
                          stroke-width="6"
                          fill="transparent"
                          r="34"
                          cx="40"
                          cy="40"
                          :style="getProgressStyle()"
                      />
                    </svg>
                    <div class="progress-text">
                      {{ Math.round((form.pass_marks / form.total_marks) * 100) }}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <router-link to="/term-exams" class="btn btn-cancel">
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
            {{ isEdit ? 'Update' : 'Create' }} Exam
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
  name: 'TermExamForm',
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {
      form: {
        card_type_id: '',
        academic_year_id: '',
        term_number: 1,
        term_name: '',
        exam_date: '',
        total_marks: 100,
        pass_marks: 40
      },
      cardTypes: [],
      academicYears: [],
      errors: {},
      submitting: false
    };
  },
  computed: {
    isEdit() {
      return !!this.id;
    }
  },
  mounted() {
    if (this.isEdit) {
      this.loadExam();
    }
    this.loadCardTypes();
    this.loadAcademicYears();
  },
  methods: {
    async loadAcademicYears() {
      try {
        const response = await this.$api.get('/get-academic-year');
        this.academicYears = response.data;
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
    async loadExam() {
      try {
        const response = await api.termExams.getById(this.id);
        const exam = response.data;

        this.form = {
          card_type_id: exam.card_type_id,
          academic_year_id: exam.academic_year_id,
          term_number: exam.term_number,
          term_name: exam.term_name,
          exam_date: exam.exam_date || '',
          total_marks: exam.total_marks || 100,
          pass_marks: exam.pass_marks || 40
        };
      } catch (error) {
        this.$root.$emit('show-notification', {
          message: 'Failed to load exam',
          type: 'danger'
        });
        this.$router.push('/term-exams');
      }
    },
    async submitForm() {
      this.errors = {};
      this.submitting = true;

      try {
        if (this.isEdit) {
          await api.termExams.update(this.id, this.form);
          this.$root.$emit('show-notification', {
            message: 'Exam updated successfully',
            type: 'success'
          });
        } else {
          await api.termExams.create(this.form);
          this.$root.$emit('show-notification', {
            message: 'Exam created successfully',
            type: 'success'
          });
        }

        this.$router.push('/term-exams');
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
    },
    getProgressStyle() {
      const percentage = (this.form.pass_marks / this.form.total_marks) * 100;
      const circumference = 2 * Math.PI * 34;
      const offset = circumference - (percentage / 100) * circumference;
      return {
        strokeDasharray: `${circumference} ${circumference}`,
        strokeDashoffset: offset
      };
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
.term-exam-form {
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

/* Input with Icon */
.input-with-icon {
  position: relative;
}

.input-with-icon .form-control {
  padding-right: 48px;
}

.input-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray-400);
  pointer-events: none;
  display: flex;
  align-items: center;
}

.input-with-icon .form-control:focus ~ .input-icon {
  color: var(--primary);
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

/* Calculator Card */
.calculator-card {
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 24px;
  box-shadow: var(--shadow);
  animation: scaleIn 0.5s ease-out;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.calculator-icon {
  width: 64px;
  height: 64px;
  background: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
}

.calculator-icon svg {
  color: var(--primary);
}

.calculator-content {
  flex: 1;
}

.calculator-content h6 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-dark);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.percentage-display {
  font-size: 36px;
  font-weight: 800;
  color: var(--primary);
  line-height: 1;
  margin-bottom: 8px;
}

.marks-breakdown {
  font-size: 14px;
  color: var(--gray-700);
  font-weight: 500;
}

/* Progress Ring */
.calculator-visual {
  flex-shrink: 0;
}

.progress-ring {
  position: relative;
  width: 80px;
  height: 80px;
}

.progress-ring-circle-bg {
  stroke: rgba(255, 255, 255, 0.5);
}

.progress-ring-circle {
  stroke: var(--primary);
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  transition: stroke-dashoffset 0.5s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 16px;
  font-weight: 700;
  color: var(--primary-dark);
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
  .term-exam-form {
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

  .calculator-card {
    flex-direction: column;
    text-align: center;
  }

  .calculator-content {
    order: 2;
  }

  .calculator-visual {
    order: 1;
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

  .percentage-display {
    font-size: 28px;
  }

  .calculator-card {
    padding: 20px;
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

  .term-exam-form {
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