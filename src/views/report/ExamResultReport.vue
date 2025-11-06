<template>
  <div class="exam-result-report-container">
    <!-- Header -->
    <div class="report-header modern-card">
      <div class="card-body">
        <div class="header-content">
          <div class="logo-wrapper">
            <div class="logo-circle">
              <i class="fa fa-file-alt"></i>
            </div>
          </div>
          <h3 class="college-name">{{ collegeName }}</h3>
          <h5 class="report-subtitle">
            <i class="fa fa-chart-line"></i>
            Examination Result Report
          </h5>
        </div>

        <!-- Report Type Selection -->
        <div class="report-type-selector">
          <button
              :class="['type-btn', { active: reportType === 'student' }]"
              @click="reportType = 'student'"
          >
            <i class="fa fa-user-graduate"></i>
            <span>Student-wise</span>
          </button>
          <button
              :class="['type-btn', { active: reportType === 'exam' }]"
              @click="reportType = 'exam'"
          >
            <i class="fa fa-clipboard-check"></i>
            <span>Exam-wise</span>
          </button>
          <button
              :class="['type-btn', { active: reportType === 'comparative' }]"
              @click="reportType = 'comparative'"
          >
            <i class="fa fa-balance-scale"></i>
            <span>Comparative</span>
          </button>
        </div>

        <!-- Student-wise Filters -->
        <div v-if="reportType === 'student'" class="filters-section">
          <div class="row">
            <div class="col-md-3 mb-3">
              <label class="modern-label">
                <i class="fa fa-id-card mr-2"></i>Student ID
                <span class="text-danger">*</span>
              </label>
              <input
                  v-model="studentFilters.studentId"
                  type="text"
                  class="form-control modern-input"
                  placeholder="Enter Student ID"
                  @keyup.enter="fetchStudentReport"
              />
            </div>
            <div class="col-md-2 mb-3">
              <label class="modern-label">
                <i class="fa fa-calendar mr-2"></i>Session
              </label>
              <select v-model="studentFilters.sessionId" class="form-control modern-input">
                <option value="">All Sessions</option>
                <option v-for="session in sessions" :key="session.id" :value="session.id">
                  {{ session.name }}
                </option>
              </select>
            </div>
            <div class="col-md-2 mb-3">
              <label class="modern-label">
                <i class="fa fa-layer-group mr-2"></i>Year
              </label>
              <select v-model="studentFilters.year" class="form-control modern-input">
                <option value="">All Years</option>
                <option value="1st">1st Year</option>
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
                <option value="5th">5th Year</option>
              </select>
            </div>
            <div class="col-md-2 mb-3">
              <label class="modern-label">
                <i class="fa fa-book-open mr-2"></i>Semester
              </label>
              <select v-model="studentFilters.semester" class="form-control modern-input">
                <option value="">All Semesters</option>
                <option value="1st">1st Semester</option>
                <option value="2nd">2nd Semester</option>
              </select>
            </div>
            <div class="col-md-3 mb-3">
              <label class="modern-label">&nbsp;</label>
              <button
                  @click="fetchStudentReport"
                  class="btn btn-block modern-btn"
                  :disabled="loading"
              >
                <i class="fa fa-search mr-2"></i>
                <span v-if="!loading">Generate Report</span>
                <span v-else>Loading...</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Exam-wise Filters -->
        <div v-if="reportType === 'exam'" class="filters-section">
          <div class="row">
            <div class="col-md-10 mb-3">
              <label class="modern-label">
                <i class="fa fa-clipboard-list mr-2"></i>Select Exam
                <span class="text-danger">*</span>
              </label>
              <select v-model="examFilters.examId" class="form-control modern-input">
                <option value="">Choose an exam</option>
                <option v-for="exam in exams" :key="exam.id" :value="exam.id">
                  {{ exam.title }} - {{ exam.subject_name }}
                </option>
              </select>
            </div>
            <div class="col-md-2 mb-3">
              <label class="modern-label">&nbsp;</label>
              <button
                  @click="fetchExamReport"
                  class="btn btn-block modern-btn btn-success"
                  :disabled="loading"
              >
                <i class="fa fa-search mr-2"></i>
                <span v-if="!loading">Generate</span>
                <span v-else>Loading...</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Comparative Filters -->
        <div v-if="reportType === 'comparative'" class="filters-section">
          <div class="row">
            <div class="col-md-3 mb-3">
              <label class="modern-label">
                <i class="fa fa-calendar mr-2"></i>Session
              </label>
              <select v-model="comparativeFilters.sessionId" class="form-control modern-input">
                <option value="">Select Session</option>
                <option v-for="session in sessions" :key="session.id" :value="session.id">
                  {{ session.name }}
                </option>
              </select>
            </div>
            <div class="col-md-3 mb-3">
              <label class="modern-label">
                <i class="fa fa-layer-group mr-2"></i>Year
              </label>
              <select v-model="comparativeFilters.year" class="form-control modern-input">
                <option value="">Select Year</option>
                <option value="1st">1st Year</option>
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
                <option value="5th">5th Year</option>
              </select>
            </div>
            <div class="col-md-3 mb-3">
              <label class="modern-label">
                <i class="fa fa-book-open mr-2"></i>Semester
              </label>
              <select v-model="comparativeFilters.semester" class="form-control modern-input">
                <option value="">Select Semester</option>
                <option value="1st">1st Semester</option>
                <option value="2nd">2nd Semester</option>
              </select>
            </div>
            <div class="col-md-3 mb-3">
              <label class="modern-label">&nbsp;</label>
              <button
                  @click="fetchComparativeReport"
                  class="btn btn-block modern-btn btn-info"
                  :disabled="loading"
              >
                <i class="fa fa-chart-bar mr-2"></i>
                <span v-if="!loading">Analyze</span>
                <span v-else>Loading...</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-container">
      <div class="modern-spinner">
        <div class="spinner"></div>
      </div>
      <p class="loading-text">Generating report...</p>
    </div>

    <!-- Student-wise Report Content -->
    <div v-if="!loading && reportType === 'student' && studentReportData" class="report-content">

      <!-- Student Info -->
      <div class="modern-card student-info-card">
        <div class="card-header gradient-header">
          <i class="fa fa-user-graduate mr-2"></i>
          <h5 class="mb-0">Student Information</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <div class="info-item">
                <span class="info-label">
                  <i class="fa fa-user"></i> Name
                </span>
                <span class="info-value">{{ studentReportData.student_info.name }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">
                  <i class="fa fa-id-badge"></i> Student ID
                </span>
                <span class="info-value">{{ studentReportData.student_info.student_id }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">
                  <i class="fa fa-hashtag"></i> Roll No
                </span>
                <span class="info-value">{{ studentReportData.student_info.roll_no }}</span>
              </div>
            </div>
            <div class="col-md-6">
              <div class="info-item">
                <span class="info-label">
                  <i class="fa fa-calendar-alt"></i> Session
                </span>
                <span class="info-value">{{ studentReportData.student_info.session }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">
                  <i class="fa fa-layer-group"></i> Year & Semester
                </span>
                <span class="info-value">
                  {{ studentReportData.student_info.year }}, {{ studentReportData.student_info.semester }}
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">
                  <i class="fa fa-building"></i> Department
                </span>
                <span class="info-value">{{ studentReportData.student_info.department }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Overall Summary Statistics -->
      <div class="summary-stats-grid">
        <div class="stat-card stat-card-1">
          <div class="stat-icon-wrapper">
            <div class="stat-icon">
              <i class="fa fa-file-alt"></i>
            </div>
          </div>
          <div class="stat-content">
            <h6 class="stat-label">Total Exams</h6>
            <h3 class="stat-value">{{ studentReportData.overall_summary.total_exams }}</h3>
            <div class="stat-bar">
              <div class="stat-bar-fill"></div>
            </div>
          </div>
        </div>

        <div class="stat-card stat-card-2">
          <div class="stat-icon-wrapper">
            <div class="stat-icon">
              <i class="fa fa-check-circle"></i>
            </div>
          </div>
          <div class="stat-content">
            <h6 class="stat-label">Passed</h6>
            <h3 class="stat-value">{{ studentReportData.overall_summary.passed }}</h3>
            <div class="stat-bar">
              <div class="stat-bar-fill" :style="{width: (studentReportData.overall_summary.passed / studentReportData.overall_summary.total_exams * 100) + '%'}"></div>
            </div>
          </div>
        </div>

        <div class="stat-card stat-card-3">
          <div class="stat-icon-wrapper">
            <div class="stat-icon">
              <i class="fa fa-times-circle"></i>
            </div>
          </div>
          <div class="stat-content">
            <h6 class="stat-label">Failed</h6>
            <h3 class="stat-value">{{ studentReportData.overall_summary.failed }}</h3>
            <div class="stat-bar">
              <div class="stat-bar-fill" :style="{width: (studentReportData.overall_summary.failed / studentReportData.overall_summary.total_exams * 100) + '%'}"></div>
            </div>
          </div>
        </div>

        <div :class="'stat-card stat-card-4 ' + getPerformanceCardClass(studentReportData.overall_summary.overall_percentage)">
          <div class="stat-icon-wrapper">
            <div class="stat-icon">
              <i class="fa fa-percentage"></i>
            </div>
          </div>
          <div class="stat-content">
            <h6 class="stat-label">Overall Percentage</h6>
            <h3 class="stat-value">{{ studentReportData.overall_summary.overall_percentage }}%</h3>
            <p class="stat-status">{{ studentReportData.overall_summary.performance_status }}</p>
            <div class="stat-bar">
              <div class="stat-bar-fill" :style="{width: studentReportData.overall_summary.overall_percentage + '%'}"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- GPA & CGPA Cards -->
      <div class="row mb-4">
        <div class="col-md-4">
          <div class="gpa-card card-marks">
            <div class="gpa-icon">
              <i class="fa fa-calculator"></i>
            </div>
            <div class="gpa-content">
              <h6>Total Marks Obtained</h6>
              <h2>
                {{ studentReportData.overall_summary.total_marks_obtained }}
                <span class="text-muted">/ {{ studentReportData.overall_summary.total_max_marks }}</span>
              </h2>
              <div class="progress-bar-wrapper">
                <div class="progress-bar-fill marks"
                     :style="{width: (studentReportData.overall_summary.total_marks_obtained / studentReportData.overall_summary.total_max_marks * 100) + '%'}">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="gpa-card card-gpa">
            <div class="gpa-icon">
              <i class="fa fa-star"></i>
            </div>
            <div class="gpa-content">
              <h6>Average GPA</h6>
              <h2>{{ studentReportData.overall_summary.average_gpa }}</h2>
              <div class="progress-bar-wrapper">
                <div class="progress-bar-fill gpa"
                     :style="{width: (studentReportData.overall_summary.average_gpa / 4 * 100) + '%'}">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="gpa-card card-cgpa">
            <div class="gpa-icon">
              <i class="fa fa-trophy"></i>
            </div>
            <div class="gpa-content">
              <h6>CGPA</h6>
              <h2>{{ studentReportData.overall_summary.cgpa }}</h2>
              <div class="progress-bar-wrapper">
                <div class="progress-bar-fill cgpa"
                     :style="{width: (studentReportData.overall_summary.cgpa / 4 * 100) + '%'}">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts -->
      <div class="row mb-4">
        <div class="col-md-6">
          <div class="modern-card chart-card">
            <div class="card-header gradient-header-blue">
              <i class="fa fa-chart-pie mr-2"></i>
              <h6 class="mb-0">Grade Distribution</h6>
            </div>
            <div class="card-body">
              <canvas ref="gradeDistributionChart"></canvas>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="modern-card chart-card">
            <div class="card-header gradient-header-green">
              <i class="fa fa-chart-line mr-2"></i>
              <h6 class="mb-0">Performance Trend</h6>
            </div>
            <div class="card-body">
              <canvas ref="performanceTrendChart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Subject-wise Performance -->
      <div class="modern-card mb-4">
        <div class="card-header gradient-header-orange">
          <i class="fa fa-book mr-2"></i>
          <h5 class="mb-0">Subject-wise Performance</h5>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="modern-table">
              <thead>
              <tr>
                <th width="20%">Subject</th>
                <th width="10%">Code</th>
                <th width="15%">Department</th>
                <th class="text-center" width="8%">Exams</th>
                <th class="text-center" width="15%">Marks</th>
                <th class="text-center" width="10%">Percentage</th>
                <th class="text-center" width="10%">Avg GPA</th>
                <th class="text-center" width="12%">Status</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(subject, index) in studentReportData.subject_wise" :key="'subj-' + index" class="table-row">
                <td><strong class="subject-name">{{ subject.subject_name }}</strong></td>
                <td><span class="subject-code">{{ subject.subject_code }}</span></td>
                <td><small class="text-muted">{{ subject.department }}</small></td>
                <td class="text-center"><span class="count-badge">{{ subject.exams_count }}</span></td>
                <td class="text-center">
                  <strong>{{ subject.total_marks_obtained }}</strong>
                  <span class="text-muted">/ {{ subject.total_max_marks }}</span>
                </td>
                <td class="text-center">
                  <span :class="'modern-badge badge-' + getPercentageBadge(subject.percentage)">
                    {{ subject.percentage }}%
                  </span>
                </td>
                <td class="text-center">
                  <strong class="gpa-value">{{ subject.average_gpa }}</strong>
                </td>
                <td class="text-center">
                  <span :class="'status-badge status-' + subject.status">
                    <i :class="subject.status === 'pass' ? 'fa fa-check' : 'fa fa-times'"></i>
                    {{ subject.status }}
                  </span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Exam Type-wise Performance -->
      <div class="modern-card mb-4">
        <div class="card-header gradient-header-purple">
          <i class="fa fa-clipboard-list mr-2"></i>
          <h5 class="mb-0">Exam Type-wise Performance</h5>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="modern-table">
              <thead>
              <tr>
                <th width="20%">Exam Type</th>
                <th class="text-center" width="10%">Total Exams</th>
                <th class="text-center" width="15%">Marks Obtained</th>
                <th class="text-center" width="15%">Total Marks</th>
                <th class="text-center" width="12%">Percentage</th>
                <th class="text-center" width="10%">Passed</th>
                <th class="text-center" width="10%">Failed</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(type, index) in studentReportData.exam_type_wise" :key="'type-' + index" class="table-row">
                <td><strong class="type-name">{{ type.exam_type }}</strong></td>
                <td class="text-center"><span class="count-badge">{{ type.exams_count }}</span></td>
                <td class="text-center"><strong>{{ type.total_marks_obtained }}</strong></td>
                <td class="text-center">{{ type.total_max_marks }}</td>
                <td class="text-center">
                  <span :class="'modern-badge badge-' + getPercentageBadge(type.percentage)">
                    {{ type.percentage }}%
                  </span>
                </td>
                <td class="text-center">
                  <span class="pass-count">{{ type.passed }}</span>
                </td>
                <td class="text-center">
                  <span class="fail-count">{{ type.failed }}</span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Detailed Results -->
      <div class="modern-card mb-4">
        <div class="card-header gradient-header-dark">
          <i class="fa fa-list-alt mr-2"></i>
          <h5 class="mb-0">Detailed Examination Results</h5>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="modern-table details-table">
              <thead>
              <tr>
                <th width="5%">Rank</th>
                <th width="18%">Exam Title</th>
                <th width="12%">Subject</th>
                <th width="10%">Type</th>
                <th width="10%">Date</th>
                <th width="10%">Marks</th>
                <th width="8%">%</th>
                <th width="7%">Grade</th>
                <th width="7%">GPA</th>
                <th width="8%">Status</th>
                <th width="5%">Remarks</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(result, index) in studentReportData.detailed_results" :key="'res-' + index" class="table-row">
                <td>
                  <span :class="'rank-badge rank-' + getRankClass(result.class_rank)">
                    {{ result.class_rank }}
                  </span>
                </td>
                <td><small>{{ result.exam_title }}</small></td>
                <td><small>{{ result.subject }}</small></td>
                <td><span class="type-badge">{{ result.exam_type }}</span></td>
                <td><span class="date-badge">{{ formatDate(result.exam_date) }}</span></td>
                <td>
                  <strong>{{ result.marks_obtained }}</strong>
                  <span class="text-muted">/{{ result.total_marks }}</span>
                </td>
                <td>
                  <span :class="'modern-badge badge-' + getPercentageBadge(result.percentage)">
                    {{ result.percentage }}%
                  </span>
                </td>
                <td><span class="grade-badge">{{ result.grade }}</span></td>
                <td><strong class="gpa-value">{{ result.gpa }}</strong></td>
                <td>
                  <span :class="'status-badge status-' + result.status">
                    <i :class="result.status === 'pass' ? 'fa fa-check' : 'fa fa-times'"></i>
                    {{ result.status }}
                  </span>
                </td>
                <td><small class="remarks-text">{{ result.remarks || '-' }}</small></td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Exam-wise Report Content -->
    <div v-if="!loading && reportType === 'exam' && examReportData" class="report-content">

      <!-- Exam Information -->
      <div class="modern-card exam-info-card">
        <div class="card-header gradient-header-green">
          <i class="fa fa-clipboard-check mr-2"></i>
          <h5 class="mb-0">Examination Information</h5>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-6">
              <div class="info-item">
                <span class="info-label">
                  <i class="fa fa-file-alt"></i> Exam Title
                </span>
                <span class="info-value">{{ examReportData.exam_info.title }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">
                  <i class="fa fa-book"></i> Subject
                </span>
                <span class="info-value">
                  {{ examReportData.exam_info.subject }} ({{ examReportData.exam_info.subject_code }})
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">
                  <i class="fa fa-clipboard-list"></i> Exam Type
                </span>
                <span class="info-value">{{ examReportData.exam_info.exam_type }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">
                  <i class="fa fa-building"></i> Department
                </span>
                <span class="info-value">{{ examReportData.exam_info.department }}</span>
              </div>
            </div>
            <div class="col-md-6">
              <div class="info-item">
                <span class="info-label">
                  <i class="fa fa-calendar-alt"></i> Exam Date
                </span>
                <span class="info-value">{{ formatDate(examReportData.exam_info.exam_date) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">
                  <i class="fa fa-calculator"></i> Total Marks
                </span>
                <span class="info-value">{{ examReportData.exam_info.total_marks }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">
                  <i class="fa fa-check-circle"></i> Pass Marks
                </span>
                <span class="info-value">{{ examReportData.exam_info.pass_marks }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">
                  <i class="fa fa-clock"></i> Duration
                </span>
                <span class="info-value">{{ examReportData.exam_info.duration }} minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Exam Statistics -->
      <div class="summary-stats-grid">
        <div class="stat-card stat-card-1">
          <div class="stat-icon-wrapper">
            <div class="stat-icon">
              <i class="fa fa-users"></i>
            </div>
          </div>
          <div class="stat-content">
            <h6 class="stat-label">Total Students</h6>
            <h3 class="stat-value">{{ examReportData.statistics.total_students }}</h3>
            <div class="stat-bar">
              <div class="stat-bar-fill"></div>
            </div>
          </div>
        </div>

        <div class="stat-card stat-card-2">
          <div class="stat-icon-wrapper">
            <div class="stat-icon">
              <i class="fa fa-check"></i>
            </div>
          </div>
          <div class="stat-content">
            <h6 class="stat-label">Passed</h6>
            <h3 class="stat-value">{{ examReportData.statistics.passed }}</h3>
            <div class="stat-bar">
              <div class="stat-bar-fill" :style="{width: (examReportData.statistics.passed / examReportData.statistics.total_students * 100) + '%'}"></div>
            </div>
          </div>
        </div>

        <div class="stat-card stat-card-3">
          <div class="stat-icon-wrapper">
            <div class="stat-icon">
              <i class="fa fa-times"></i>
            </div>
          </div>
          <div class="stat-content">
            <h6 class="stat-label">Failed</h6>
            <h3 class="stat-value">{{ examReportData.statistics.failed }}</h3>
            <div class="stat-bar">
              <div class="stat-bar-fill" :style="{width: (examReportData.statistics.failed / examReportData.statistics.total_students * 100) + '%'}"></div>
            </div>
          </div>
        </div>

        <div class="stat-card stat-card-4">
          <div class="stat-icon-wrapper">
            <div class="stat-icon">
              <i class="fa fa-percentage"></i>
            </div>
          </div>
          <div class="stat-content">
            <h6 class="stat-label">Pass Rate</h6>
            <h3 class="stat-value">{{ examReportData.statistics.pass_percentage }}%</h3>
            <div class="stat-bar">
              <div class="stat-bar-fill" :style="{width: examReportData.statistics.pass_percentage + '%'}"></div>
            </div>
          </div>
        </div>

        <div class="stat-card stat-card-5">
          <div class="stat-icon-wrapper">
            <div class="stat-icon">
              <i class="fa fa-chart-line"></i>
            </div>
          </div>
          <div class="stat-content">
            <h6 class="stat-label">Average Marks</h6>
            <h3 class="stat-value">{{ examReportData.statistics.average_marks }}</h3>
            <div class="stat-bar">
              <div class="stat-bar-fill" :style="{width: (examReportData.statistics.average_marks / examReportData.exam_info.total_marks * 100) + '%'}"></div>
            </div>
          </div>
        </div>

        <div class="stat-card stat-card-6">
          <div class="stat-icon-wrapper">
            <div class="stat-icon">
              <i class="fa fa-star"></i>
            </div>
          </div>
          <div class="stat-content">
            <h6 class="stat-label">Average GPA</h6>
            <h3 class="stat-value">{{ examReportData.statistics.average_gpa }}</h3>
            <div class="stat-bar">
              <div class="stat-bar-fill" :style="{width: (examReportData.statistics.average_gpa / 4 * 100) + '%'}"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Marks Statistics Cards -->
      <div class="row mb-4">
        <div class="col-md-4">
          <div class="marks-stat-card highest">
            <div class="marks-stat-icon">
              <i class="fa fa-arrow-up"></i>
            </div>
            <div class="marks-stat-content">
              <h6>Highest Marks</h6>
              <h2>{{ examReportData.statistics.highest_marks }}</h2>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="marks-stat-card average">
            <div class="marks-stat-icon">
              <i class="fa fa-minus"></i>
            </div>
            <div class="marks-stat-content">
              <h6>Average Marks</h6>
              <h2>{{ examReportData.statistics.average_marks }}</h2>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="marks-stat-card lowest">
            <div class="marks-stat-icon">
              <i class="fa fa-arrow-down"></i>
            </div>
            <div class="marks-stat-content">
              <h6>Lowest Marks</h6>
              <h2>{{ examReportData.statistics.lowest_marks }}</h2>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts for Exam Report -->
      <div class="row mb-4">
        <div class="col-md-6">
          <div class="modern-card chart-card">
            <div class="card-header gradient-header-blue">
              <i class="fa fa-chart-pie mr-2"></i>
              <h6 class="mb-0">Grade Distribution</h6>
            </div>
            <div class="card-body">
              <canvas ref="examGradeChart"></canvas>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="modern-card chart-card">
            <div class="card-header gradient-header-orange">
              <i class="fa fa-chart-bar mr-2"></i>
              <h6 class="mb-0">Marks Range Distribution</h6>
            </div>
            <div class="card-body">
              <canvas ref="marksRangeChart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- Top 10 Students -->
      <div class="modern-card mb-4">
        <div class="card-header gradient-header-gold">
          <i class="fa fa-trophy mr-2"></i>
          <h5 class="mb-0">Top 10 Performers</h5>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="modern-table top-students-table">
              <thead>
              <tr>
                <th width="8%">Rank</th>
                <th width="28%">Student Name</th>
                <th width="15%">Roll No</th>
                <th width="13%">Marks</th>
                <th width="12%">%</th>
                <th width="12%">Grade</th>
                <th width="12%">GPA</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(student, index) in examReportData.top_students" :key="'top-' + index" class="table-row top-row">
                <td>
                  <span :class="'rank-badge rank-' + getRankClass(student.rank)">
                    <i :class="getRankIcon(student.rank)"></i>
                    {{ student.rank }}
                  </span>
                </td>
                <td><strong class="student-name">{{ student.name }}</strong></td>
                <td>{{ student.roll_no }}</td>
                <td><strong class="marks-value">{{ student.marks_obtained }}</strong></td>
                <td>
                  <span :class="'modern-badge badge-' + getPercentageBadge(student.percentage)">
                    {{ student.percentage }}%
                  </span>
                </td>
                <td><span class="grade-badge">{{ student.grade }}</span></td>
                <td><strong class="gpa-value">{{ student.gpa }}</strong></td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- All Students Results -->
      <div class="modern-card mb-4">
        <div class="card-header gradient-header-dark">
          <i class="fa fa-list mr-2"></i>
          <h5 class="mb-0">Complete Result List</h5>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="modern-table details-table">
              <thead>
              <tr>
                <th width="5%">Rank</th>
                <th width="18%">Name</th>
                <th width="10%">Roll No</th>
                <th width="10%">Student ID</th>
                <th width="12%">Department</th>
                <th width="8%">Year</th>
                <th width="10%">Marks</th>
                <th width="8%">%</th>
                <th width="7%">Grade</th>
                <th width="7%">GPA</th>
                <th width="5%">Status</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(result, index) in examReportData.all_results" :key="'all-' + index" class="table-row">
                <td>
                  <span class="rank-badge rank-default">{{ result.rank }}</span>
                </td>
                <td><small>{{ result.name }}</small></td>
                <td>{{ result.roll_no }}</td>
                <td>{{ result.student_id }}</td>
                <td><small class="text-muted">{{ result.department }}</small></td>
                <td>{{ result.year }}</td>
                <td><strong>{{ result.marks_obtained }}</strong></td>
                <td>
                  <span :class="'modern-badge badge-' + getPercentageBadge(result.percentage)">
                    {{ result.percentage }}%
                  </span>
                </td>
                <td><span class="grade-badge">{{ result.grade }}</span></td>
                <td><strong class="gpa-value">{{ result.gpa }}</strong></td>
                <td>
                  <span :class="'status-badge status-' + result.status">
                    <i :class="result.status === 'pass' ? 'fa fa-check' : 'fa fa-times'"></i>
                    {{ result.status }}
                  </span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Comparative Analysis Report -->
    <div v-if="!loading && reportType === 'comparative' && comparativeReportData" class="report-content">

      <!-- Subject Comparison -->
      <div class="modern-card mb-4">
        <div class="card-header gradient-header">
          <i class="fa fa-balance-scale mr-2"></i>
          <h5 class="mb-0">Subject-wise Comparative Analysis</h5>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="modern-table">
              <thead>
              <tr>
                <th width="20%">Subject</th>
                <th class="text-center" width="10%">Students</th>
                <th class="text-center" width="10%">Passed</th>
                <th class="text-center" width="10%">Failed</th>
                <th class="text-center" width="12%">Avg %</th>
                <th class="text-center" width="12%">Avg GPA</th>
                <th class="text-center" width="13%">Highest</th>
                <th class="text-center" width="13%">Lowest</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(subject, index) in comparativeReportData.subject_comparison" :key="'comp-' + index" class="table-row">
                <td><strong class="subject-name">{{ subject.subject }}</strong></td>
                <td class="text-center"><span class="count-badge">{{ subject.total_students }}</span></td>
                <td class="text-center"><span class="pass-count">{{ subject.pass_count }}</span></td>
                <td class="text-center"><span class="fail-count">{{ subject.fail_count }}</span></td>
                <td class="text-center">
                  <span :class="'modern-badge badge-' + getPercentageBadge(subject.average_percentage)">
                    {{ subject.average_percentage }}%
                  </span>
                </td>
                <td class="text-center"><strong class="gpa-value">{{ subject.average_gpa }}</strong></td>
                <td class="text-center"><span class="highest-badge">{{ subject.highest_marks }}</span></td>
                <td class="text-center"><span class="lowest-badge">{{ subject.lowest_marks }}</span></td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Subject Comparison Chart -->
      <div class="modern-card mb-4">
        <div class="card-header gradient-header-blue">
          <i class="fa fa-chart-bar mr-2"></i>
          <h5 class="mb-0">Subject Performance Comparison</h5>
        </div>
        <div class="card-body">
          <canvas ref="subjectComparisonChart" height="100"></canvas>
        </div>
      </div>

      <!-- Exam Type Comparison -->
      <div class="modern-card mb-4">
        <div class="card-header gradient-header-green">
          <i class="fa fa-chart-line mr-2"></i>
          <h5 class="mb-0">Exam Type Comparison</h5>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="modern-table">
              <thead>
              <tr>
                <th width="30%">Exam Type</th>
                <th class="text-center" width="20%">Total Exams</th>
                <th class="text-center" width="20%">Average %</th>
                <th class="text-center" width="30%">Pass Rate</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(type, index) in comparativeReportData.exam_type_comparison" :key="'etype-' + index" class="table-row">
                <td><strong class="type-name">{{ type.exam_type }}</strong></td>
                <td class="text-center"><span class="count-badge">{{ type.total_exams }}</span></td>
                <td class="text-center">
                  <span :class="'modern-badge badge-' + getPercentageBadge(type.average_percentage)">
                    {{ type.average_percentage }}%
                  </span>
                </td>
                <td class="text-center">
                  <div class="modern-progress-bar">
                    <div
                        :class="'modern-progress-fill progress-' + getPercentageBadge(type.pass_rate)"
                        :style="{ width: type.pass_rate + '%' }"
                    >
                      <span class="progress-text">{{ type.pass_rate }}%</span>
                    </div>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div v-if="!loading && (studentReportData || examReportData || comparativeReportData)" class="action-buttons">
      <button @click="printReport" class="action-btn print-btn">
        <i class="fa fa-print"></i>
        <span>Print Report</span>
      </button>
      <button @click="exportPDF" class="action-btn pdf-btn">
        <i class="fa fa-file-pdf"></i>
        <span>Export PDF</span>
      </button>
      <button @click="exportExcel" class="action-btn excel-btn">
        <i class="fa fa-file-excel"></i>
        <span>Export Excel</span>
      </button>
    </div>

    <!-- No Data Message -->
    <div v-if="!loading && !studentReportData && !examReportData && !comparativeReportData" class="no-data-container">
      <div class="no-data-icon">
        <i class="fa fa-chart-bar"></i>
      </div>
      <h4>No Report Generated</h4>
      <p>Please select report type and fill required filters to generate report</p>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: 'ExamResultReport',

  data() {
    return {
      collegeName: 'Your Medical College Name',
      loading: false,
      reportType: 'student',

      studentReportData: null,
      examReportData: null,
      comparativeReportData: null,

      sessions: [],
      exams: [],

      studentFilters: {
        studentId: '',
        sessionId: '',
        year: '',
        semester: ''
      },
      examFilters: {
        examId: ''
      },
      comparativeFilters: {
        sessionId: '',
        year: '',
        semester: ''
      },

      charts: {}
    }
  },

  mounted() {
    this.loadSessions();
    this.loadExams();
  },

  methods: {
    async loadSessions() {
      try {
        const response = await this.$api.get('/get-session');
        this.sessions = response.data;
      } catch (error) {
        console.error('Error loading sessions:', error);
      }
    },

    async loadExams() {
      try {
        const response = await this.$api.get('/exams');
        this.exams = response.data.data;
      } catch (error) {
        console.error('Error loading exams:', error);
      }
    },

    async fetchStudentReport() {
      if (!this.studentFilters.studentId) {
        this.$notify({
          type: 'warning',
          title: 'Warning',
          text: 'Please enter Student ID'
        });
        return;
      }

      this.loading = true;
      this.studentReportData = null;

      try {
        const response = await this.$api.get(`/reports/exam-results/student/${this.studentFilters.studentId}`,
            { params: this.studentFilters }
        );

        if (response.data.success) {
          this.studentReportData = response.data.data;
          this.$nextTick(() => {
            setTimeout(() => {
              this.renderStudentCharts();
            }, 100);
          });
        }
      } catch (error) {
        console.error('Error:', error);
        this.$notify({
          type: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to load report'
        });
      } finally {
        this.loading = false;
      }
    },

    async fetchExamReport() {
      if (!this.examFilters.examId) {
        this.$notify({
          type: 'warning',
          title: 'Warning',
          text: 'Please select an exam'
        });
        return;
      }

      this.loading = true;
      this.examReportData = null;

      try {
        const response = await this.$api.get(
            `/reports/exam-results/exam/${this.examFilters.examId}`
        );

        if (response.data.success) {
          this.examReportData = response.data.data;
          this.$nextTick(() => {
            setTimeout(() => {
              this.renderExamCharts();
            }, 100);
          });
        }
      } catch (error) {
        console.error('Error:', error);
        this.$notify({
          type: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to load report'
        });
      } finally {
        this.loading = false;
      }
    },

    async fetchComparativeReport() {
      this.loading = true;
      this.comparativeReportData = null;

      try {
        const response = await this.$api.get('/reports/exam-results/comparative', {
          params: this.comparativeFilters
        });

        if (response.data.success) {
          this.comparativeReportData = response.data.data;
          this.$nextTick(() => {
            setTimeout(() => {
              this.renderComparativeCharts();
            }, 100);
          });
        }
      } catch (error) {
        console.error('Error:', error);
        this.$notify({
          type: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to load report'
        });
      } finally {
        this.loading = false;
      }
    },

    renderStudentCharts() {
      this.renderGradeDistribution();
      this.renderPerformanceTrend();
    },

    renderExamCharts() {
      this.renderExamGradeDistribution();
      this.renderMarksRangeDistribution();
    },

    renderComparativeCharts() {
      this.renderSubjectComparison();
    },

    renderGradeDistribution() {
      if (this.charts.gradeDistribution) {
        this.charts.gradeDistribution.destroy();
      }

      if (!this.$refs.gradeDistributionChart) {
        console.warn('Grade distribution chart ref not found');
        return;
      }

      if (!this.studentReportData || !this.studentReportData.grade_distribution) {
        console.warn('Grade distribution data not available');
        return;
      }

      const ctx = this.$refs.gradeDistributionChart.getContext('2d');
      const data = this.studentReportData.grade_distribution;

      this.charts.gradeDistribution = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: data.map(item => item.grade),
          datasets: [{
            data: data.map(item => item.count),
            backgroundColor: [
              'rgba(67, 233, 123, 0.8)',
              'rgba(79, 172, 254, 0.8)',
              'rgba(250, 112, 154, 0.8)',
              'rgba(255, 193, 7, 0.8)',
              'rgba(240, 147, 251, 0.8)',
            ],
            borderWidth: 4,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                padding: 15,
                font: {
                  size: 12,
                  weight: 'bold'
                }
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 12,
              borderColor: '#667eea',
              borderWidth: 2,
            }
          }
        }
      });
    },

    renderPerformanceTrend() {
      if (this.charts.performanceTrend) {
        this.charts.performanceTrend.destroy();
      }

      if (!this.$refs.performanceTrendChart) {
        console.warn('Performance trend chart ref not found');
        return;
      }

      if (!this.studentReportData || !this.studentReportData.monthly_trend) {
        console.warn('Performance trend data not available');
        return;
      }

      const ctx = this.$refs.performanceTrendChart.getContext('2d');
      const data = this.studentReportData.monthly_trend;

      this.charts.performanceTrend = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.map(item => item.month),
          datasets: [{
            label: 'Percentage',
            data: data.map(item => item.percentage),
            borderColor: 'rgb(102, 126, 234)',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 6,
            pointBackgroundColor: 'rgb(102, 126, 234)',
            pointBorderColor: '#fff',
            pointBorderWidth: 3,
            fill: true
          }, {
            label: 'GPA (×20)',
            data: data.map(item => item.average_gpa * 20),
            borderColor: 'rgb(67, 233, 123)',
            backgroundColor: 'rgba(67, 233, 123, 0.1)',
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 6,
            pointBackgroundColor: 'rgb(67, 233, 123)',
            pointBorderColor: '#fff',
            pointBorderWidth: 3,
            fill: true
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                padding: 20,
                font: {
                  size: 12,
                  weight: 'bold'
                }
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 12,
              borderColor: '#667eea',
              borderWidth: 2,
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    },

    renderExamGradeDistribution() {
      if (this.charts.examGrade) {
        this.charts.examGrade.destroy();
      }

      if (!this.$refs.examGradeChart) {
        console.warn('Exam grade chart ref not found');
        return;
      }

      if (!this.examReportData || !this.examReportData.grade_distribution) {
        console.warn('Exam grade distribution data not available');
        return;
      }

      const ctx = this.$refs.examGradeChart.getContext('2d');
      const data = this.examReportData.grade_distribution;

      this.charts.examGrade = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: data.map(item => `${item.grade} (${item.percentage}%)`),
          datasets: [{
            data: data.map(item => item.count),
            backgroundColor: [
              'rgba(67, 233, 123, 0.8)',
              'rgba(79, 172, 254, 0.8)',
              'rgba(250, 112, 154, 0.8)',
              'rgba(255, 193, 7, 0.8)',
              'rgba(240, 147, 251, 0.8)',
            ],
            borderWidth: 4,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 15,
                font: {
                  size: 12,
                  weight: 'bold'
                }
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 12,
              borderColor: '#667eea',
              borderWidth: 2,
            }
          }
        }
      });
    },

    renderMarksRangeDistribution() {
      if (this.charts.marksRange) {
        this.charts.marksRange.destroy();
      }

      if (!this.$refs.marksRangeChart) {
        console.warn('Marks range chart ref not found');
        return;
      }

      if (!this.examReportData || !this.examReportData.marks_ranges) {
        console.warn('Marks range data not available');
        return;
      }

      const ctx = this.$refs.marksRangeChart.getContext('2d');
      const data = this.examReportData.marks_ranges;

      this.charts.marksRange = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(data),
          datasets: [{
            label: 'Number of Students',
            data: Object.values(data),
            backgroundColor: 'rgba(102, 126, 234, 0.8)',
            borderRadius: 10,
            borderSkipped: false,
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 12,
              borderColor: '#667eea',
              borderWidth: 2,
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    },

    renderSubjectComparison() {
      if (this.charts.subjectComparison) {
        this.charts.subjectComparison.destroy();
      }

      if (!this.$refs.subjectComparisonChart) {
        console.warn('Subject comparison chart ref not found');
        return;
      }

      if (!this.comparativeReportData || !this.comparativeReportData.subject_comparison) {
        console.warn('Subject comparison data not available');
        return;
      }

      const ctx = this.$refs.subjectComparisonChart.getContext('2d');
      const data = this.comparativeReportData.subject_comparison;

      this.charts.subjectComparison = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.map(item => item.subject),
          datasets: [{
            label: 'Average Percentage',
            data: data.map(item => item.average_percentage),
            backgroundColor: 'rgba(102, 126, 234, 0.8)',
            borderRadius: 10,
            borderSkipped: false,
          }, {
            label: 'Average GPA (×20)',
            data: data.map(item => item.average_gpa * 20),
            backgroundColor: 'rgba(67, 233, 123, 0.8)',
            borderRadius: 10,
            borderSkipped: false,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                padding: 20,
                font: {
                  size: 12,
                  weight: 'bold'
                }
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: 12,
              borderColor: '#667eea',
              borderWidth: 2,
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString('en-GB');
    },

    getPerformanceCardClass(percentage) {
      if (percentage >= 90) return 'performance-excellent';
      if (percentage >= 80) return 'performance-good';
      if (percentage >= 70) return 'performance-average';
      if (percentage >= 60) return 'performance-poor';
      return 'performance-critical';
    },

    getPercentageBadge(percentage) {
      if (percentage >= 80) return 'success';
      if (percentage >= 60) return 'primary';
      if (percentage >= 50) return 'info';
      if (percentage >= 40) return 'warning';
      return 'danger';
    },

    getRankClass(rank) {
      if (rank <= 3) return 'top';
      if (rank <= 10) return 'high';
      return 'default';
    },

    getRankIcon(rank) {
      if (rank === 1) return 'fa fa-crown';
      if (rank === 2) return 'fa fa-medal';
      if (rank === 3) return 'fa fa-award';
      return '';
    },

    printReport() {
      window.print();
    },

    async exportPDF() {
      this.$notify({
        type: 'info',
        title: 'Info',
        text: 'PDF export functionality will be implemented'
      });
    },

    async exportExcel() {
      this.$notify({
        type: 'info',
        title: 'Info',
        text: 'Excel export functionality will be implemented'
      });
    }
  },

  beforeDestroy() {
    Object.values(this.charts).forEach(chart => {
      if (chart) chart.destroy();
    });
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.exam-result-report-container {
  /*padding: 30px;*/
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

/* Report Header */
.report-header {
  background: white;
  border-radius: 24px;
  padding: 40px;
  margin-bottom: 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  animation: slideDown 0.6s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-content {
  text-align: center;
  margin-bottom: 35px;
}

.logo-wrapper {
  margin-bottom: 20px;
}

.logo-circle {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 42px;
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 20px 50px rgba(102, 126, 234, 0.6);
  }
}

.college-name {
  color: #2d3748;
  font-weight: 800;
  font-size: 36px;
  margin-bottom: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
}

.report-subtitle {
  color: #4a5568;
  font-weight: 600;
  font-size: 22px;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

/* Report Type Selector */
.report-type-selector {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  padding: 10px;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border-radius: 20px;
}

.type-btn {
  flex: 1;
  padding: 20px;
  border: 3px solid #e2e8f0;
  border-radius: 16px;
  background: white;
  color: #4a5568;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.type-btn i {
  font-size: 32px;
}

.type-btn:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.type-btn.active {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

/* Filters Section */
.filters-section {
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  padding: 30px;
  border-radius: 20px;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-top: 20px;
}

.modern-label {
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  font-size: 14px;
}

.modern-input {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px 18px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: white;
  font-weight: 500;
}

.modern-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  transform: translateY(-1px);
}

.modern-btn {
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 700;
  font-size: 14px;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modern-btn.btn-success {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  box-shadow: 0 6px 20px rgba(67, 233, 123, 0.4);
}

.modern-btn.btn-info {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4);
}

.modern-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.6);
}

.modern-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Loading */
.loading-container {
  background: white;
  border-radius: 24px;
  padding: 80px 20px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modern-spinner {
  display: inline-block;
  margin-bottom: 20px;
}

.spinner {
  width: 70px;
  height: 70px;
  border: 6px solid #e2e8f0;
  border-top: 6px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #4a5568;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

/* Report Content */
.report-content {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Modern Card */
.modern-card {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  margin-bottom: 30px;
}

.modern-card:hover {
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.15);
  transform: translateY(-5px);
}

.card-header {
  padding: 25px 35px;
  color: white;
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 18px;
}

.gradient-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.gradient-header-blue {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.gradient-header-green {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.gradient-header-orange {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.gradient-header-purple {
  background: linear-gradient(135deg, #a044ff 0%, #6a3093 100%);
}

.gradient-header-dark {
  background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
}

.gradient-header-gold {
  background: linear-gradient(135deg, #f12711 0%, #f5af19 100%);
}

.card-body {
  padding: 35px;
}

/* Info Items */
.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  margin-bottom: 12px;
  background: #f7fafc;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.info-item:hover {
  background: #edf2f7;
  transform: translateX(5px);
}

.info-label {
  font-weight: 600;
  color: #718096;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-label i {
  color: #667eea;
  font-size: 16px;
}

.info-value {
  color: #2d3748;
  font-weight: 700;
  font-size: 15px;
}

/* Summary Stats Grid */
.summary-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  transition: height 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.stat-card:hover::before {
  height: 100%;
  opacity: 0.1;
}

.stat-card-1::before { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.stat-card-2::before { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.stat-card-3::before { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.stat-card-4::before { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
.stat-card-5::before { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.stat-card-6::before { background: linear-gradient(135deg, #f12711 0%, #f5af19 100%); }

.performance-excellent::before { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
.performance-good::before { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.performance-average::before { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
.performance-poor::before { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.performance-critical::before { background: linear-gradient(135deg, #ee0979 0%, #ff6a00 100%); }

.stat-icon-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.stat-icon {
  width: 70px;
  height: 70px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.stat-card-1 .stat-icon { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.stat-card-2 .stat-icon { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }
.stat-card-3 .stat-icon { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.stat-card-4 .stat-icon { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
.stat-card-5 .stat-icon { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.stat-card-6 .stat-icon { background: linear-gradient(135deg, #f12711 0%, #f5af19 100%); }

.performance-excellent .stat-icon { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
.performance-good .stat-icon { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.performance-average .stat-icon { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); }
.performance-poor .stat-icon { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.performance-critical .stat-icon { background: linear-gradient(135deg, #ee0979 0%, #ff6a00 100%); }

.stat-content {
  text-align: center;
}

.stat-label {
  color: #718096;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-value {
  font-size: 36px;
  font-weight: 800;
  color: #2d3748;
  margin: 10px 0;
  line-height: 1;
}

.stat-status {
  color: #a0aec0;
  font-size: 12px;
  margin-top: 8px;
  font-weight: 600;
  text-transform: uppercase;
}

.stat-bar {
  height: 6px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 15px;
}

.stat-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  width: 70%;
  animation: barFill 1.5s ease-out;
}

@keyframes barFill {
  from { width: 0; }
}

.stat-card-1 .stat-bar-fill { background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); }
.stat-card-2 .stat-bar-fill { background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%); }
.stat-card-3 .stat-bar-fill { background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%); }
.stat-card-4 .stat-bar-fill { background: linear-gradient(90deg, #fa709a 0%, #fee140 100%); }
.stat-card-5 .stat-bar-fill { background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%); }
.stat-card-6 .stat-bar-fill { background: linear-gradient(90deg, #f12711 0%, #f5af19 100%); }

/* GPA Cards */
.gpa-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.gpa-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
}

.card-marks::before { background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); }
.card-gpa::before { background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%); }
.card-cgpa::before { background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%); }

.gpa-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.12);
}

.gpa-icon {
  font-size: 48px;
  margin-bottom: 15px;
  color: #667eea;
}

.card-marks .gpa-icon { color: #667eea; }
.card-gpa .gpa-icon { color: #43e97b; }
.card-cgpa .gpa-icon { color: #4facfe; }

.gpa-content h6 {
  color: #718096;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 15px;
}

.gpa-content h2 {
  font-size: 42px;
  font-weight: 800;
  color: #2d3748;
  margin-bottom: 20px;
  line-height: 1;
}

.gpa-content h2 .text-muted {
  font-size: 24px;
  color: #a0aec0;
}

.progress-bar-wrapper {
  height: 8px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 10px;
  animation: barFill 1.5s ease-out;
}

.progress-bar-fill.marks { background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); }
.progress-bar-fill.gpa { background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%); }
.progress-bar-fill.cgpa { background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%); }

/* Marks Stat Cards (for exam report) */
.marks-stat-card {
  background: white;
  border-radius: 20px;
  padding: 30px;
  display: flex;
  align-items: center;
  gap: 25px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.marks-stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 6px;
  height: 100%;
}

.highest::before { background: linear-gradient(180deg, #43e97b 0%, #38f9d7 100%); }
.average::before { background: linear-gradient(180deg, #4facfe 0%, #00f2fe 100%); }
.lowest::before { background: linear-gradient(180deg, #f093fb 0%, #f5576c 100%); }

.marks-stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.12);
}

.marks-stat-icon {
  width: 70px;
  height: 70px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: white;
}

.highest .marks-stat-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.average .marks-stat-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.lowest .marks-stat-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.marks-stat-content h6 {
  color: #718096;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 10px;
}

.marks-stat-content h2 {
  font-size: 42px;
  font-weight: 800;
  margin: 0;
}

.highest .marks-stat-content h2 { color: #43e97b; }
.average .marks-stat-content h2 { color: #4facfe; }
.lowest .marks-stat-content h2 { color: #f093fb; }

/* Modern Table */
.modern-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.modern-table thead {
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
}

.modern-table th {
  padding: 20px 15px;
  text-align: left;
  font-weight: 700;
  color: #2d3748;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 3px solid #e2e8f0;
}

.modern-table tbody tr {
  transition: all 0.3s ease;
  border-bottom: 1px solid #f0f0f0;
}

.modern-table tbody tr:hover {
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  transform: scale(1.01);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
}

.modern-table td {
  padding: 18px 15px;
  color: #4a5568;
  font-size: 14px;
}

.subject-name,
.type-name,
.student-name {
  color: #2d3748;
  font-size: 15px;
}

.subject-code {
  display: inline-block;
  padding: 6px 12px;
  background: #f7fafc;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  color: #667eea;
}

.count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  background: #edf2f7;
  font-weight: 700;
  font-size: 14px;
  color: #2d3748;
}

.pass-count {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(67, 233, 123, 0.2) 0%, rgba(56, 249, 215, 0.2) 100%);
  color: #22543d;
  font-weight: 700;
  font-size: 14px;
}

.fail-count {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(240, 147, 251, 0.2) 0%, rgba(245, 87, 108, 0.2) 100%);
  color: #742a2a;
  font-weight: 700;
  font-size: 14px;
}

.highest-badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(67, 233, 123, 0.2) 0%, rgba(56, 249, 215, 0.2) 100%);
  color: #22543d;
  font-weight: 700;
  font-size: 14px;
}

.lowest-badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(240, 147, 251, 0.2) 0%, rgba(245, 87, 108, 0.2) 100%);
  color: #742a2a;
  font-weight: 700;
  font-size: 14px;
}

.modern-badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
}

.badge-success {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
}

.badge-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.badge-info {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.badge-warning {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
}

.badge-danger {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.grade-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  border-radius: 12px;
  background: linear-gradient(135deg, #a044ff 0%, #6a3093 100%);
  color: white;
  font-weight: 800;
  font-size: 18px;
  box-shadow: 0 5px 15px rgba(160, 68, 255, 0.3);
}

.gpa-value {
  color: #667eea;
  font-size: 16px;
}

.marks-value {
  color: #2d3748;
  font-size: 16px;
}

.status-badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 0.5px;
}

.status-pass {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
}

.status-fail {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.date-badge {
  display: inline-block;
  padding: 6px 12px;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border-radius: 8px;
  font-weight: 600;
  font-size: 12px;
  color: #4a5568;
}

.type-badge {
  display: inline-block;
  padding: 6px 12px;
  background: #edf2f7;
  border-radius: 8px;
  font-weight: 600;
  font-size: 12px;
  color: #667eea;
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  min-width: 50px;
  height: 40px;
  padding: 0 15px;
  border-radius: 12px;
  font-weight: 800;
  font-size: 16px;
}

.rank-top {
  background: linear-gradient(135deg, #f12711 0%, #f5af19 100%);
  color: white;
  box-shadow: 0 5px 15px rgba(241, 39, 17, 0.3);
}

.rank-high {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.rank-default {
  background: #edf2f7;
  color: #4a5568;
}

.remarks-text {
  color: #718096;
  font-style: italic;
}

/* Modern Progress Bar */
.modern-progress-bar {
  height: 30px;
  background: #e2e8f0;
  border-radius: 15px;
  overflow: hidden;
  position: relative;
}

.modern-progress-fill {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: width 1s ease;
  position: relative;
  overflow: hidden;
}

.progress-text {
  position: relative;
  z-index: 2;
  color: white;
  font-weight: 700;
  font-size: 13px;
}

.progress-success { background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%); }
.progress-primary { background: linear-gradient(90deg, #667eea 0%, #764ba2 100%); }
.progress-info { background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%); }
.progress-warning { background: linear-gradient(90deg, #fa709a 0%, #fee140 100%); }
.progress-danger { background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%); }

/* Action Buttons */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 40px 0;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 36px;
  border: none;
  border-radius: 16px;
  font-weight: 700;
  font-size: 15px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.action-btn:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
}

.print-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.pdf-btn {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.excel-btn {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

/* No Data */
.no-data-container {
  background: white;
  border-radius: 24px;
  padding: 100px 30px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.5s ease-out;
}

.no-data-icon {
  font-size: 100px;
  color: #cbd5e0;
  margin-bottom: 25px;
}

.no-data-container h4 {
  color: #2d3748;
  font-weight: 700;
  font-size: 28px;
  margin-bottom: 15px;
}

.no-data-container p {
  color: #718096;
  font-size: 16px;
  max-width: 500px;
  margin: 0 auto;
}

/* Responsive */
@media (max-width: 768px) {
  .exam-result-report-container {
    padding: 20px 15px;
  }

  .report-header {
    padding: 25px 20px;
  }

  .college-name {
    font-size: 26px;
  }

  .report-subtitle {
    font-size: 18px;
  }

  .logo-circle {
    width: 70px;
    height: 70px;
    font-size: 32px;
  }

  .report-type-selector {
    flex-direction: column;
    gap: 10px;
  }

  .type-btn {
    flex-direction: row;
    justify-content: center;
  }

  .type-btn i {
    font-size: 24px;
  }

  .summary-stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  .stat-value {
    font-size: 28px;
  }

  .gpa-content h2 {
    font-size: 32px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 15px;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }

  .card-body {
    padding: 25px 20px;
  }

  .modern-table {
    font-size: 12px;
  }

  .modern-table th,
  .modern-table td {
    padding: 12px 8px;
  }
}

@media (max-width: 576px) {
  .summary-stats-grid {
    grid-template-columns: 1fr;
  }

  .filters-section .col-md-2,
  .filters-section .col-md-3,
  .filters-section .col-md-10 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}

/* Print Styles */
@media print {
  .exam-result-report-container {
    background: white;
    padding: 0;
  }

  .report-header .report-type-selector,
  .report-header .filters-section,
  .action-buttons,
  .modern-btn,
  .type-btn {
    display: none !important;
  }

  .modern-card {
    box-shadow: none;
    page-break-inside: avoid;
  }

  .card-header {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}

/* Utility Classes */
.text-center { text-align: center; }
.text-right { text-align: right; }
.text-muted { color: #a0aec0; }
.text-danger { color: #f56565; }

.mb-0 { margin-bottom: 0 !important; }
.mb-3 { margin-bottom: 1rem !important; }
.mb-4 { margin-bottom: 1.5rem !important; }
.mr-2 { margin-right: 0.5rem !important; }

.p-0 { padding: 0 !important; }

.row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
}

.col-md-2, .col-md-3, .col-md-4, .col-md-6, .col-md-10 {
  position: relative;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
}

@media (min-width: 768px) {
  .col-md-2 { flex: 0 0 16.666667%; max-width: 16.666667%; }
  .col-md-3 { flex: 0 0 25%; max-width: 25%; }
  .col-md-4 { flex: 0 0 33.333333%; max-width: 33.333333%; }
  .col-md-6 { flex: 0 0 50%; max-width: 50%; }
  .col-md-10 { flex: 0 0 83.333333%; max-width: 83.333333%; }
}
</style>