<template>
  <div class="attendance-bulk-mark">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h2 class="page-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3.854 2.146a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708L2 3.293l1.146-1.147a.5.5 0 0 1 .708 0m0 4a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 1 1 .708-.708L2 7.293l1.146-1.147a.5.5 0 0 1 .708 0m0 4a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0l-.5-.5a.5.5 0 0 1 .708-.708l.146.147 1.146-1.147a.5.5 0 0 1 .708 0"/>
            </svg>
            Bulk Mark Attendance
          </h2>
          <p class="page-subtitle">Mark attendance for multiple students at once</p>
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

    <!-- Class Information Card -->
    <div class="class-info-card">
      <div class="card-header-custom">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
          <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
        </svg>
        <h5>Class Information</h5>
      </div>
      <div class="card-body-custom">
        <div class="form-grid-triple">
          <div class="form-group">
            <label class="form-label required">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5"/>
              </svg>
              Class Date
            </label>
            <input
                v-model="classInfo.class_date"
                type="date"
                class="form-control"
                required
            />
          </div>

          <div class="form-group">
            <label class="form-label required">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5z"/>
              </svg>
              Class Type
            </label>
            <select
                v-model="classInfo.class_type"
                class="form-control"
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
          </div>

          <div class="form-group">
            <label class="form-label required">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/>
                <path d="M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/>
              </svg>
              Card Type
            </label>
            <select v-model="classInfo.card_type_id" class="form-control" required>
              <option value="">Select Card Type</option>
              <option v-for="type in cardTypes" :key="type.id" :value="type.id">
                {{ type.card_name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                <path d="M3 2.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0v.006c0 .07 0 .27-.038.494H15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 14.5V7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.038A3 3 0 0 1 3 2.506zm1.068.5H7v-.5a1.5 1.5 0 1 0-3 0c0 .085.002.274.045.43zM9 3h2.932l.023-.07c.043-.156.045-.345.045-.43a1.5 1.5 0 0 0-3 0zM1 4v2h6V4zm8 0v2h6V4zm5 3H9v8h4.5a.5.5 0 0 0 .5-.5zm-7 8V7H2v7.5a.5.5 0 0 0 .5.5z"/>
              </svg>
              Class Topic
            </label>
            <input v-model="classInfo.class_topic" type="text" class="form-control" placeholder="Enter topic"/>
          </div>

          <div class="form-group">
            <label class="form-label">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/>
              </svg>
              Conducted By
            </label>
            <select v-model="classInfo.conducted_by_teacher_id" class="form-control">
              <option value="">Select Teacher (Optional)</option>
              <option v-for="lecturer in lecturers" :key="lecturer.id" :value="lecturer.id">
                {{ lecturer.name }}
              </option>
            </select>
          </div>

          <div class="form-group load-button-container">
            <label class="form-label">&nbsp;</label>
            <button
                @click="loadStudents"
                type="button"
                class="btn btn-load"
                :disabled="!isClassInfoValid || loading"
            >
              <span v-if="loading" class="spinner"></span>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0"/>
                <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z"/>
              </svg>
              Load Students
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- No Students Message -->
    <div v-if="!loading && classInfo.card_type_id && students.length === 0" class="info-message">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
      </svg>
      <h3>Ready to Load Students</h3>
      <p>Click "Load Students" to fetch students for this card type</p>
    </div>

    <!-- Students List -->
    <div v-if="students.length > 0" class="students-card">
      <div class="students-header">
        <div class="header-left">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
            <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
          </svg>
          <h5>Mark Attendance ({{ students.length }} Students)</h5>
        </div>
        <div class="bulk-actions">
          <button @click="markAll('present')" type="button" class="btn-quick btn-quick-success">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
            All Present
          </button>
          <button @click="markAll('absent')" type="button" class="btn-quick btn-quick-danger">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
            </svg>
            All Absent
          </button>
        </div>
      </div>

      <div class="students-body">
        <div class="table-wrapper">
          <table class="students-table">
            <thead>
            <tr>
              <th>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                </svg>
                Student Name
              </th>
              <th>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/>
                </svg>
                Student ID
              </th>
              <th>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
                </svg>
                Status
              </th>
              <th>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M5 1a2 2 0 0 0-2 2v1h10V3a2 2 0 0 0-2-2zm6 8H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1"/>
                  <path d="M0 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2H2a2 2 0 0 1-2-2zm2.5 1a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1"/>
                </svg>
                Remarks
              </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(student, index) in students" :key="student.id" class="student-row">
              <td>
                <div class="student-info">
                  <div class="avatar">{{ getInitials(student.name) }}</div>
                  <strong>{{ student.name }}</strong>
                </div>
              </td>
              <td>
                <span class="student-id">{{ student.student_id || 'N/A' }}</span>
              </td>
              <td>
                <div class="status-buttons">
                  <input
                      type="radio"
                      :name="`status-${student.id}`"
                      :id="`present-${student.id}`"
                      v-model="attendanceRecords[index].status"
                      value="present"
                  />
                  <label class="status-btn status-present" :for="`present-${student.id}`">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
                    </svg>
                    Present
                  </label>

                  <input
                      type="radio"
                      :name="`status-${student.id}`"
                      :id="`absent-${student.id}`"
                      v-model="attendanceRecords[index].status"
                      value="absent"
                  />
                  <label class="status-btn status-absent" :for="`absent-${student.id}`">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
                    </svg>
                    Absent
                  </label>

                  <input
                      type="radio"
                      :name="`status-${student.id}`"
                      :id="`late-${student.id}`"
                      v-model="attendanceRecords[index].status"
                      value="late"
                  />
                  <label class="status-btn status-late" :for="`late-${student.id}`">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
                    </svg>
                    Late
                  </label>

                  <input
                      type="radio"
                      :name="`status-${student.id}`"
                      :id="`excused-${student.id}`"
                      v-model="attendanceRecords[index].status"
                      value="excused"
                  />
                  <label class="status-btn status-excused" :for="`excused-${student.id}`">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                      <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                    </svg>
                    Excused
                  </label>
                </div>
              </td>
              <td>
                <input
                    v-model="attendanceRecords[index].remarks"
                    type="text"
                    class="remarks-input"
                    placeholder="Optional remarks"
                />
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="students-footer">
        <router-link to="/attendance" class="btn btn-cancel">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
          </svg>
          Cancel
        </router-link>
        <button
            @click="submitBulkAttendance"
            type="button"
            class="btn btn-submit"
            :disabled="submitting"
        >
          <span v-if="submitting" class="spinner"></span>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
          </svg>
          Submit Attendance ({{ students.length }} students)
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/plugins/card';
import cardTypeService from "@/views/Admin/card-type/cardTypeService";

export default {
  name: 'AttendanceBulkMark',
  data() {
    return {
      classInfo: {
        class_date: new Date().toISOString().split('T')[0],
        class_type: '',
        card_type_id: '',
        class_topic: '',
        conducted_by_teacher_id: ''
      },
      students: [],
      attendanceRecords: [],
      lecturers: [],
      cardTypes: [],
      loading: false,
      submitting: false
    };
  },
  computed: {
    isClassInfoValid() {
      return this.classInfo.class_date && this.classInfo.class_type && this.classInfo.card_type_id;
    }
  },
  mounted() {
    this.loadLecturers();
    this.loadCardTypes();
  },
  methods: {
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
    async loadStudents() {
      this.loading = true;
      try {
        const response = await api.students.getByCardType(this.classInfo.card_type_id);
        console.log(response)
        this.students = response.data.data || response.data || [];

        if (this.students.length === 0) {
          this.$root.$emit('show-notification', {
            message: 'No students found for this card type',
            type: 'info'
          });
          return;
        }

        // Initialize attendance records with default 'present' status
        this.attendanceRecords = this.students.map(student => ({
          student_id: student.id,
          status: 'present',
          remarks: ''
        }));

        this.$root.$emit('show-notification', {
          message: `Successfully loaded ${this.students.length} students`,
          type: 'success'
        });

      } catch (error) {
        this.students = [];
        this.attendanceRecords = [];

        const errorMessage = error.response?.data?.message
            || error.message
            || 'Failed to load students. Please try again.';

        this.$root.$emit('show-notification', {
          message: errorMessage,
          type: 'danger'
        });
      } finally {
        this.loading = false;
      }
    },
    markAll(status) {
      this.attendanceRecords.forEach(record => {
        record.status = status;
      });
    },
    async submitBulkAttendance() {
      this.submitting = true;
      try {
        const attendances = this.attendanceRecords.map(record => ({
          student_id: record.student_id,
          card_type_id: this.classInfo.card_type_id,
          class_date: this.classInfo.class_date,
          class_type: this.classInfo.class_type,
          class_topic: this.classInfo.class_topic,
          status: record.status,
          remarks: record.remarks,
          conducted_by_teacher_id: this.classInfo.conducted_by_teacher_id || null,
          marked_by_teacher_id: this.classInfo.conducted_by_teacher_id || null
        }));

        await api.attendance.bulkMark({ attendances });

        this.$root.$emit('show-notification', {
          message: `Attendance marked successfully for ${this.students.length} students`,
          type: 'success'
        });

        this.$router.push('/attendance');
      } catch (error) {
        this.$root.$emit('show-notification', {
          message: error.response?.data?.message || 'Failed to submit attendance',
          type: 'danger'
        });
      } finally {
        this.submitting = false;
      }
    },
    getInitials(name) {
      if (!name) return 'NA';
      return name
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
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
.attendance-bulk-mark {
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

.btn-load {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  width: 100%;
  justify-content: center;
}

.btn-load:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%);
}

.btn-load:disabled {
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

/* Class Info Card */
.class-info-card {
  background: white;
  border-radius: 16px;
  box-shadow: var(--shadow-md);
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

.card-header-custom {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-header-custom svg {
  flex-shrink: 0;
}

.card-header-custom h5 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
}

.card-body-custom {
  padding: 32px 24px;
}

/* Form Grid */
.form-grid-triple {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.load-button-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

/* Form Labels & Controls */
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

/* Info Message */
.info-message {
  background: white;
  border-radius: 16px;
  padding: 60px 40px;
  text-align: center;
  box-shadow: var(--shadow);
  animation: fadeInUp 0.5s ease-out 0.2s both;
}

.info-message svg {
  color: var(--info);
  margin-bottom: 20px;
}

.info-message h3 {
  font-size: 24px;
  font-weight: 700;
  color: var(--gray-900);
  margin: 0 0 12px 0;
}

.info-message p {
  font-size: 16px;
  color: var(--gray-600);
  margin: 0;
}

/* Students Card */
.students-card {
  background: white;
  border-radius: 16px;
  box-shadow: var(--shadow-md);
  overflow: hidden;
  animation: fadeInUp 0.5s ease-out 0.2s both;
}

.students-header {
  background: deepskyblue;
  padding: 20px 24px;
  border-bottom: 2px solid var(--gray-200);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-left svg {
  color: var(--primary);
  flex-shrink: 0;
}

.header-left h5 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--gray-800);
}

.bulk-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn-quick {
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-quick svg {
  flex-shrink: 0;
}

.btn-quick-success {
  background: linear-gradient(135deg, var(--success) 0%, var(--success-dark) 100%);
  color: white;
}

.btn-quick-success:hover {
  background: linear-gradient(135deg, var(--success-dark) 0%, var(--success) 100%);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.btn-quick-danger {
  background: linear-gradient(135deg, var(--danger) 0%, var(--danger-dark) 100%);
  color: white;
}

.btn-quick-danger:hover {
  background: linear-gradient(135deg, var(--danger-dark) 0%, var(--danger) 100%);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

/* Students Table */
.students-body {
  padding: 0;
}

.table-wrapper {
  overflow-x: auto;
}

.students-table {
  width: 100%;
  border-collapse: collapse;
}

.students-table thead {
  background: linear-gradient(135deg, var(--gray-900) 0%, var(--gray-800) 100%);
  color: white;
}

.students-table thead th {
  padding: 18px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.students-table thead th svg {
  margin-right: 6px;
  opacity: 0.8;
  vertical-align: middle;
}

.student-row {
  border-bottom: 1px solid var(--gray-200);
  transition: all 0.3s ease;
}

.student-row:hover {
  background: var(--gray-50);
}

.students-table tbody td {
  padding: 16px;
  color: var(--gray-700);
  font-size: 14px;
  vertical-align: middle;
}

/* Student Info */
.student-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
  flex-shrink: 0;
}

.student-id {
  color: var(--gray-600);
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  font-weight: 500;
}

/* Status Buttons */
.status-buttons {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.status-buttons input[type="radio"] {
  display: none;
}

.status-btn {
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  border: 2px solid transparent;
  background: var(--gray-100);
  color: var(--gray-600);
  white-space: nowrap;
}

.status-btn svg {
  flex-shrink: 0;
}

.status-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.status-buttons input[type="radio"]:checked + .status-present {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: var(--success-dark);
  border-color: var(--success);
}

.status-buttons input[type="radio"]:checked + .status-absent {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: var(--danger-dark);
  border-color: var(--danger);
}

.status-buttons input[type="radio"]:checked + .status-late {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: var(--warning-dark);
  border-color: var(--warning);
}

.status-buttons input[type="radio"]:checked + .status-excused {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: var(--info-dark);
  border-color: var(--info);
}

/* Remarks Input */
.remarks-input {
  padding: 8px 12px;
  border: 2px solid var(--gray-200);
  border-radius: 8px;
  font-size: 13px;
  color: var(--gray-700);
  background: white;
  transition: all 0.3s ease;
  outline: none;
  width: 100%;
  min-width: 150px;
}

.remarks-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* Students Footer */
.students-footer {
  padding: 20px 24px;
  background: var(--gray-50);
  border-top: 2px solid var(--gray-200);
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .form-grid-triple {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .attendance-bulk-mark {
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

  .form-grid-triple {
    grid-template-columns: 1fr;
  }

  .card-body-custom {
    padding: 24px 16px;
  }

  .students-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .bulk-actions {
    width: 100%;
  }

  .bulk-actions button {
    flex: 1;
  }

  .status-buttons {
    flex-direction: column;
  }

  .status-btn {
    width: 100%;
    justify-content: center;
  }

  .students-footer {
    flex-direction: column-reverse;
  }

  .students-footer .btn {
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

  .student-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .avatar {
    width: 32px;
    height: 32px;
    font-size: 11px;
  }
}

/* Print Styles */
@media print {
  .header-actions,
  .bulk-actions,
  .students-footer {
    display: none !important;
  }

  .attendance-bulk-mark {
    background: white;
    padding: 0;
  }

  .class-info-card,
  .students-card {
    box-shadow: none;
    border: 1px solid var(--gray-300);
  }
}

/* Accessibility */
.form-control:focus,
.btn:focus,
.status-btn:focus,
.remarks-input:focus {
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