<template>
  <div class="term-exams-list">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h2 class="page-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
              <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/>
              <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
            </svg>
            Term Exams
          </h2>
          <p class="page-subtitle">Manage and track term examinations</p>
        </div>
        <div class="header-actions">
          <router-link to="/term-exams/create" class="btn btn-primary-custom">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
            </svg>
            <span>New Term Exam</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Filters Card -->
    <div class="filters-card">
      <div class="filters-header">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
          <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z"/>
        </svg>
        <span>Filter Exams</span>
      </div>
      <div class="filters-body">
        <div class="filter-grid">
          <div class="filter-item">
            <label class="filter-label">Card Type</label>
            <select v-model="filters.card_type_id" @change="loadExams" class="custom-select">
              <option value="">All Card Types</option>
              <option v-for="type in cardTypes" :key="type.id" :value="type.id">
                {{ type.card_name }}
              </option>
            </select>
          </div>

          <div class="filter-item">
            <label class="filter-label">Academic Year</label>
            <select v-model="filters.academic_year_id" @change="loadExams" class="custom-select">
              <option value="">All Academic Years</option>
              <option v-for="year in academicYears" :key="year.id" :value="year.id">
                {{ year.name }}
              </option>
            </select>
          </div>

          <div class="filter-item filter-actions">
            <label class="filter-label">&nbsp;</label>
            <button @click="clearFilters" class="btn-reset">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
              </svg>
              <span>Clear Filters</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="spinner-custom"></div>
      <p class="loading-text">Loading term exams...</p>
    </div>

    <!-- Exams Table -->
    <div v-else class="table-card">
      <div class="table-wrapper">
        <table class="exams-table">
          <thead>
          <tr>
            <th>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                <path d="M9.669.864 8 0 6.331.864l-1.858.282-.842 1.68-1.337 1.32L2.6 6l-.306 1.854 1.337 1.32.842 1.68 1.858.282L8 12l1.669-.864 1.858-.282.842-1.68 1.337-1.32L13.4 6l.306-1.854-1.337-1.32-.842-1.68zm1.196 1.193.684 1.365 1.086 1.072L12.387 6l.248 1.506-1.086 1.072-.684 1.365-1.51.229L8 10.874l-1.355-.702-1.51-.229-.684-1.365-1.086-1.072L3.614 6l-.25-1.506 1.087-1.072.684-1.365 1.51-.229L8 1.126l1.356.702z"/>
                <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1z"/>
              </svg>
              Term #
            </th>
            <th>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783"/>
              </svg>
              Term Name
            </th>
            <th>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/>
                <path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/>
              </svg>
              Card Type
            </th>
            <th>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5"/>
              </svg>
              Academic Year
            </th>
            <th>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"/>
                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
              </svg>
              Exam Date
            </th>
            <th>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5z"/>
              </svg>
              Total Marks
            </th>
            <th>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
              </svg>
              Pass Marks
            </th>
            <th>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
              </svg>
              Results
            </th>
            <th class="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
              </svg>
              Actions
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="exams.length === 0" class="empty-row">
            <td colspan="9">
              <div class="empty-state">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5"/>
                  <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
                </svg>
                <p>No term exams found</p>
                <small>Try adjusting your filters or create a new exam</small>
              </div>
            </td>
          </tr>
          <tr v-for="exam in exams" :key="exam.id" class="data-row">
            <td>
              <div class="term-number">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M9.669.864 8 0 6.331.864l-1.858.282-.842 1.68-1.337 1.32L2.6 6l-.306 1.854 1.337 1.32.842 1.68 1.858.282L8 12l1.669-.864 1.858-.282.842-1.68 1.337-1.32L13.4 6l.306-1.854-1.337-1.32-.842-1.68zm1.196 1.193.684 1.365 1.086 1.072L12.387 6l.248 1.506-1.086 1.072-.684 1.365-1.51.229L8 10.874l-1.355-.702-1.51-.229-.684-1.365-1.086-1.072L3.614 6l-.25-1.506 1.087-1.072.684-1.365 1.51-.229L8 1.126l1.356.702z"/>
                </svg>
                <strong>{{ exam.term_number }}</strong>
              </div>
            </td>
            <td>
              <div class="term-name">{{ exam.term_name }}</div>
            </td>
            <td>
              <span class="badge-custom badge-primary">{{ exam.card_type ? exam.card_type.card_name : 'N/A' }}</span>
            </td>
            <td>
              <span class="year-badge">{{ exam.academic_year ? exam.academic_year.name : 'N/A' }}</span>
            </td>
            <td>
              <div class="date-cell">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5"/>
                </svg>
                {{ formatDate(exam.exam_date) }}
              </div>
            </td>
            <td>
              <div class="marks-cell">
                <span class="marks-value">{{ exam.total_marks || 0 }}</span>
              </div>
            </td>
            <td>
              <div class="marks-cell">
                <span class="marks-value pass-marks">{{ exam.pass_marks || 0 }}</span>
              </div>
            </td>
            <td>
              <span class="badge-custom badge-results">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                </svg>
                {{ exam.student_results ? exam.student_results.length : 0 }} students
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <router-link
                    :to="`/term-exams/${exam.id}/edit`"
                    class="action-btn btn-edit"
                    title="Edit Exam"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
                  </svg>
                </router-link>
                <router-link
                    :to="`/term-exam-results?term_exam_id=${exam.id}`"
                    class="action-btn btn-view"
                    title="View Results"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
                  </svg>
                </router-link>
                <button
                    @click="confirmDelete(exam)"
                    class="action-btn btn-delete"
                    title="Delete Exam"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.total > 0" class="pagination-container">
        <div class="pagination-info">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
          </svg>
          <span>Showing {{ pagination.from }} to {{ pagination.to }} of {{ pagination.total }} records</span>
        </div>
        <div class="pagination-controls">
          <button
              class="page-btn"
              :class="{ disabled: pagination.current_page === 1 }"
              @click.prevent="changePage(pagination.current_page - 1)"
              :disabled="pagination.current_page === 1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/>
            </svg>
          </button>

          <button
              v-for="page in visiblePages"
              :key="page"
              class="page-btn page-number"
              :class="{ active: page === pagination.current_page, dots: page === '...' }"
              @click.prevent="page !== '...' && changePage(page)"
              :disabled="page === '...'"
          >
            {{ page }}
          </button>

          <button
              class="page-btn"
              :class="{ disabled: pagination.current_page === pagination.last_page }"
              @click.prevent="changePage(pagination.current_page + 1)"
              :disabled="pagination.current_page === pagination.last_page"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <transition name="modal-fade">
      <div v-if="deleteModal.show" class="modal-overlay" @click="deleteModal.show = false">
        <div class="modal-container" @click.stop>
          <div class="modal-header-custom">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
            </svg>
            <h5>Confirm Delete</h5>
            <button type="button" class="btn-close-custom" @click="deleteModal.show = false">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
              </svg>
            </button>
          </div>
          <div class="modal-body-custom">
            <p>Are you sure you want to delete this term exam?</p>
            <p class="warning-text">This action cannot be undone and will affect all associated student results.</p>
          </div>
          <div class="modal-footer-custom">
            <button type="button" class="btn btn-cancel" @click="deleteModal.show = false">
              Cancel
            </button>
            <button type="button" class="btn btn-danger-custom" @click="deleteExam">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
              </svg>
              Delete Exam
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import api from '@/plugins/card';
import cardTypeService from '../Admin/card-type/cardTypeService';

export default {
  name: 'TermExamList',
  data() {
    return {
      exams: [],
      cardTypes: [],
      academicYears: [],
      loading: false,
      filters: {
        card_type_id: '',
        academic_year_id: ''
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
        exam: null
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
    this.loadExams();
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
    async loadExams() {
      this.loading = true;
      try {
        const params = {
          page: this.pagination.current_page,
          per_page: this.pagination.per_page,
          ...this.filters
        };

        const response = await api.termExams.getAll(params);
        this.exams = response.data.data;
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
          message: 'Failed to load exams',
          type: 'danger'
        });
      } finally {
        this.loading = false;
      }
    },
    changePage(page) {
      if (page >= 1 && page <= this.pagination.last_page && page !== '...') {
        this.pagination.current_page = page;
        this.loadExams();
      }
    },
    clearFilters() {
      this.filters = {
        card_type_id: '',
        academic_year_id: ''
      };
      this.pagination.current_page = 1;
      this.loadExams();
    },
    confirmDelete(exam) {
      this.deleteModal = { show: true, exam: exam };
    },
    async deleteExam() {
      try {
        await api.termExams.delete(this.deleteModal.exam.id);
        this.$root.$emit('show-notification', {
          message: 'Term exam deleted successfully',
          type: 'success'
        });
        this.deleteModal.show = false;
        this.loadExams();
      } catch (error) {
        this.$root.$emit('show-notification', {
          message: 'Failed to delete exam',
          type: 'danger'
        });
      }
    },
    formatDate(date) {
      if (!date) return '-';
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(date).toLocaleDateString('en-US', options);
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
.term-exams-list {
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

.btn-primary-custom {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
}

.btn-primary-custom:hover {
  background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%);
}

.btn-danger-custom {
  background: linear-gradient(135deg, var(--danger) 0%, var(--danger-dark) 100%);
  color: white;
}

.btn-danger-custom:hover {
  background: linear-gradient(135deg, var(--danger-dark) 0%, var(--danger) 100%);
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

/* Filters Card */
.filters-card {
  background: white;
  border-radius: 16px;
  box-shadow: var(--shadow);
  margin-bottom: 24px;
  overflow: hidden;
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

.filters-header {
  background: linear-gradient(135deg, var(--gray-50) 0%, var(--gray-100) 100%);
  padding: 16px 24px;
  border-bottom: 2px solid var(--gray-200);
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: var(--gray-700);
}

.filters-header svg {
  color: var(--primary);
  flex-shrink: 0;
}

.filters-body {
  padding: 24px;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.filter-item {
  display: flex;
  flex-direction: column;
}

.filter-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--gray-700);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.custom-select {
  padding: 12px 16px;
  border: 2px solid var(--gray-200);
  border-radius: 10px;
  font-size: 14px;
  color: var(--gray-700);
  background: white;
  transition: all 0.3s ease;
  outline: none;
}

.custom-select:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.custom-select:hover {
  border-color: var(--gray-300);
}

.btn-reset {
  padding: 12px 20px;
  background: var(--gray-100);
  color: var(--gray-700);
  border: 2px solid var(--gray-200);
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.btn-reset svg {
  transition: transform 0.3s ease;
}

.btn-reset:hover {
  background: var(--gray-200);
  border-color: var(--gray-300);
}

.btn-reset:hover svg {
  transform: rotate(180deg);
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: var(--shadow);
}

.spinner-custom {
  width: 60px;
  height: 60px;
  border: 4px solid var(--gray-200);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  margin-top: 20px;
  color: var(--gray-600);
  font-size: 16px;
  font-weight: 500;
}

/* Table Card */
.table-card {
  background: white;
  border-radius: 16px;
  box-shadow: var(--shadow);
  overflow: hidden;
  animation: fadeInUp 0.5s ease-out 0.2s both;
}

.table-wrapper {
  overflow-x: auto;
}

.exams-table {
  width: 100%;
  border-collapse: collapse;
}

.exams-table thead {
  background: linear-gradient(135deg, var(--gray-900) 0%, var(--gray-800) 100%);
  color: white;
}

.exams-table thead th {
  padding: 18px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.exams-table thead th svg {
  margin-right: 6px;
  opacity: 0.8;
  vertical-align: middle;
}

.exams-table tbody tr {
  border-bottom: 1px solid var(--gray-200);
  transition: all 0.3s ease;
}

.exams-table tbody tr:hover {
  background: var(--gray-50);
  transform: scale(1.01);
  box-shadow: var(--shadow-sm);
}

.exams-table tbody td {
  padding: 16px;
  color: var(--gray-700);
  font-size: 14px;
}

/* Table Cell Styles */
.term-number {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--primary);
  font-size: 16px;
}

.term-number svg {
  color: var(--warning);
}

.term-name {
  font-weight: 600;
  color: var(--gray-900);
}

.date-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--gray-600);
}

.date-cell svg {
  color: var(--primary);
  opacity: 0.7;
}

.marks-cell {
  text-align: center;
}

.marks-value {
  display: inline-block;
  padding: 6px 12px;
  background: linear-gradient(135deg, var(--gray-100) 0%, var(--gray-200) 100%);
  border-radius: 8px;
  font-weight: 700;
  color: var(--gray-800);
}

.pass-marks {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: var(--success-dark);
}

.year-badge {
  display: inline-flex;
  padding: 6px 12px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: var(--warning-dark);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}

/* Badge Styles */
.badge-custom {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.badge-custom svg {
  flex-shrink: 0;
}

.badge-primary {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: var(--info-dark);
}

.badge-results {
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  color: var(--primary-dark);
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  text-decoration: none;
}

.action-btn svg {
  flex-shrink: 0;
}

.btn-edit {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: var(--warning-dark);
}

.btn-edit:hover {
  background: linear-gradient(135deg, #fde68a 0%, #fbbf24 100%);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.btn-view {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: var(--info-dark);
}

.btn-view:hover {
  background: linear-gradient(135deg, #bfdbfe 0%, #3b82f6 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.btn-delete {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: var(--danger-dark);
}

.btn-delete:hover {
  background: linear-gradient(135deg, #fecaca 0%, #ef4444 100%);
  color: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--gray-500);
}

.empty-state svg {
  color: var(--gray-300);
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.empty-state small {
  font-size: 14px;
  color: var(--gray-400);
}

/* Pagination */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-top: 2px solid var(--gray-200);
  background: var(--gray-50);
  flex-wrap: wrap;
  gap: 16px;
}

.pagination-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--gray-600);
  font-size: 14px;
  font-weight: 500;
}

.pagination-info svg {
  color: var(--primary);
  flex-shrink: 0;
}

.pagination-controls {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.page-btn {
  min-width: 40px;
  height: 40px;
  border: 2px solid var(--gray-200);
  background: white;
  color: var(--gray-700);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
}

.page-btn:hover:not(.disabled):not(.dots) {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.page-btn.active {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  border-color: var(--primary);
  box-shadow: var(--shadow);
}

.page-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-btn.dots {
  cursor: default;
  border-color: transparent;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 20px;
  box-shadow: var(--shadow-lg);
  max-width: 500px;
  width: 100%;
  overflow: hidden;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header-custom {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
}

.modal-header-custom svg {
  color: var(--danger);
  flex-shrink: 0;
}

.modal-header-custom h5 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: var(--gray-900);
  flex: 1;
}

.btn-close-custom {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: white;
  color: var(--gray-600);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-close-custom:hover {
  background: var(--gray-100);
  color: var(--gray-900);
}

.modal-body-custom {
  padding: 32px 24px;
}

.modal-body-custom p {
  margin: 0 0 12px 0;
  color: var(--gray-700);
  font-size: 15px;
  line-height: 1.6;
}

.warning-text {
  color: var(--danger);
  font-weight: 600;
  font-size: 14px;
}

.modal-footer-custom {
  padding: 20px 24px;
  background: var(--gray-50);
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

/* Modal Transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .filter-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .term-exams-list {
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

  .filter-grid {
    grid-template-columns: 1fr;
  }

  .filters-body {
    padding: 16px;
  }

  .exams-table {
    font-size: 12px;
  }

  .exams-table thead th,
  .exams-table tbody td {
    padding: 12px 8px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .pagination-container {
    flex-direction: column;
    align-items: flex-start;
  }

  .pagination-controls {
    width: 100%;
    justify-content: center;
  }

  .page-btn {
    min-width: 36px;
    height: 36px;
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

  .btn {
    padding: 10px 16px;
    font-size: 13px;
  }

  .exams-table thead th {
    font-size: 11px;
    padding: 10px 6px;
  }

  .badge-custom {
    font-size: 10px;
    padding: 4px 10px;
  }
}

/* Print Styles */
@media print {
  .header-actions,
  .filters-card,
  .action-buttons,
  .pagination-container {
    display: none !important;
  }

  .term-exams-list {
    background: white;
    padding: 0;
  }

  .table-card {
    box-shadow: none;
    border: 1px solid var(--gray-300);
  }
}

/* Accessibility */
.exams-table tbody tr:focus-within {
  outline: 3px solid var(--primary);
  outline-offset: -3px;
}

.btn:focus,
.action-btn:focus,
.page-btn:focus,
.custom-select:focus {
  outline: 3px solid var(--primary);
  outline-offset: 2px;
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