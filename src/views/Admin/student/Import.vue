<template>
  <div class="student-import-container">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </div>
        <div>
          <h1 class="page-title">Import Students</h1>
          <p class="page-subtitle">Upload Excel file to import multiple students</p>
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

    <!-- Import Container -->
    <div class="import-card">
      <!-- Download Template Section -->
<!--      <div class="template-section">-->
<!--        <div class="section-icon">-->
<!--          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">-->
<!--            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>-->
<!--            <polyline points="14 2 14 8 20 8"/>-->
<!--            <line x1="12" y1="18" x2="12" y2="12"/>-->
<!--            <line x1="9" y1="15" x2="12" y2="12"/>-->
<!--            <line x1="15" y1="15" x2="12" y2="12"/>-->
<!--          </svg>-->
<!--        </div>-->
<!--        <div class="template-content">-->
<!--          <h3 class="template-title">Step 1: Download Template</h3>-->
<!--          <p class="template-description">Download the Excel template file and fill in student information</p>-->
<!--          <button @click="downloadTemplate" class="btn-download">-->
<!--            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">-->
<!--              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>-->
<!--              <polyline points="7 10 12 15 17 10"/>-->
<!--              <line x1="12" y1="15" x2="12" y2="3"/>-->
<!--            </svg>-->
<!--            Download Template-->
<!--          </button>-->
<!--        </div>-->
<!--      </div>-->

      <div class="divider"></div>

      <!-- Upload Section -->
      <div class="upload-section">
        <div class="section-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        </div>
        <div class="upload-content">
          <h3 class="upload-title">Upload File</h3>
          <p class="upload-description">Select the filled Excel file to import students</p>

          <!-- File Upload Area -->
          <div
              class="file-drop-zone"
              :class="{ 'drag-over': isDragging, 'has-file': selectedFile }"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleFileDrop"
              @click="triggerFileInput"
          >
            <input
                ref="fileInput"
                type="file"
                accept=".xlsx, .xls"
                @change="handleFileSelect"
                style="display: none;"
            />

            <div v-if="!selectedFile" class="drop-zone-content">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <p class="drop-zone-text">Click to browse or drag and drop Excel file here</p>
              <p class="drop-zone-hint">Supports .xlsx and .xls files</p>
            </div>

            <div v-else class="selected-file">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <div class="file-info">
                <p class="file-name">{{ selectedFile.name }}</p>
                <p class="file-size">{{ formatFileSize(selectedFile.size) }}</p>
              </div>
              <button @click.stop="removeFile" class="btn-remove-file">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Error Messages -->
          <div v-if="errors.file" class="error-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{{ errors.file[0] }}</span>
          </div>

          <!-- Import Button -->
          <button
              @click="importStudents"
              :disabled="!selectedFile || importing"
              class="btn-import"
          >
            <svg v-if="!importing" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
            <span v-if="importing">Importing...</span>
            <span v-else>Import Students</span>
          </button>
        </div>
      </div>

      <!-- Import Progress -->
      <div v-if="importProgress" class="progress-section">
        <div class="progress-header">
          <span class="progress-label">Import Progress</span>
          <span class="progress-percentage">{{ importProgress.percentage }}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: importProgress.percentage + '%' }"></div>
        </div>
        <p class="progress-text">{{ importProgress.message }}</p>
      </div>

      <!-- Import Results -->
      <div v-if="importResults" class="results-section">
        <div class="results-header">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <h3>Import Completed</h3>
        </div>
        <div class="results-stats">
          <div class="stat-item success">
            <span class="stat-label">Successful</span>
            <span class="stat-value">{{ importResults.success }}</span>
          </div>
          <div class="stat-item inserted">
            <span class="stat-label">Inserted (New)</span>
            <span class="stat-value">{{ importResults.inserted }}</span>
          </div>
          <div class="stat-item updated">
            <span class="stat-label">Updated</span>
            <span class="stat-value">{{ importResults.updated }}</span>
          </div>
          <div class="stat-item error" v-if="importResults.failed > 0">
            <span class="stat-label">Failed</span>
            <span class="stat-value">{{ importResults.failed }}</span>
          </div>
          <div class="stat-item total">
            <span class="stat-label">Total</span>
            <span class="stat-value">{{ importResults.total }}</span>
          </div>
        </div>
        <button @click="resetImport" class="btn-import-another">
          Import Another File
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudentImport',

  data() {
    return {
      selectedFile: null,
      isDragging: false,
      importing: false,
      errors: {},
      importProgress: null,
      importResults: null
    };
  },

  methods: {
    downloadTemplate() {
      // API call to download template
      window.location.href = this.$api.defaults.baseURL + '/students/download-template';
      this.$toasted.success('Template download started');
    },

    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    handleFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        this.validateAndSetFile(file);
      }
    },

    handleFileDrop(event) {
      this.isDragging = false;
      const file = event.dataTransfer.files[0];
      if (file) {
        this.validateAndSetFile(file);
      }
    },

    validateAndSetFile(file) {
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ];

      if (!validTypes.includes(file.type)) {
        this.errors = { file: ['Please select a valid Excel file (.xlsx or .xls)'] };
        return;
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB
        this.errors = { file: ['File size should not exceed 10MB'] };
        return;
      }

      this.selectedFile = file;
      this.errors = {};
    },

    removeFile() {
      this.selectedFile = null;
      this.errors = {};
      this.$refs.fileInput.value = '';
    },

    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    },

    async importStudents() {
      if (!this.selectedFile) {
        this.$toasted.error('Please select a file');
        return;
      }

      this.importing = true;
      this.errors = {};
      this.importProgress = { percentage: 0, message: 'Starting import...' };

      const formData = new FormData();
      formData.append('file', this.selectedFile);

      try {
        // Simulate progress updates (you can implement real progress tracking)
        this.updateProgress(30, 'Reading file...');

        const response = await this.$api.post('/students/import', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        this.updateProgress(100, 'Import completed!');

        this.importResults = {
          success: response.data.success || 0,
          inserted: response.data.inserted || 0,
          updated: response.data.updated || 0,
          failed: response.data.failed || 0,
          total: response.data.total || 0
        };

        this.$toasted.success(`Successfully imported ${response.data.success} students! (${response.data.inserted} new, ${response.data.updated} updated)`);

      } catch (error) {
        if (error.response && error.response.status === 422) {
          this.errors = error.response.data.errors;
          this.$toasted.error('Validation error in uploaded file');
        } else {
          this.$toasted.error('Failed to import students');
        }
        console.error('Error importing students:', error);
      } finally {
        this.importing = false;
        this.importProgress = null;
      }
    },

    updateProgress(percentage, message) {
      this.importProgress = { percentage, message };
    },

    resetImport() {
      this.selectedFile = null;
      this.importResults = null;
      this.errors = {};
      this.$refs.fileInput.value = '';
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

.student-import-container {
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

/* Import Card */
.import-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  /*max-width: 900px;*/
  margin: 0 auto;
}

/* Template Section */
.template-section,
.upload-section {
  padding: 40px;
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.section-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.template-content,
.upload-content {
  flex: 1;
}

.template-title,
.upload-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 8px 0;
}

.template-description,
.upload-description {
  font-size: 14px;
  color: #718096;
  margin: 0 0 20px 0;
}

.btn-download {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
}

.btn-download:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(72, 187, 120, 0.4);
}

.divider {
  height: 1px;
  background: linear-gradient(to right, transparent, #e2e8f0, transparent);
  margin: 0 40px;
}

/* File Drop Zone */
.file-drop-zone {
  border: 2px dashed #cbd5e0;
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f7fafc;
  margin-bottom: 20px;
}

.file-drop-zone:hover {
  border-color: #667eea;
  background: #edf2f7;
}

.file-drop-zone.drag-over {
  border-color: #667eea;
  background: #e6f0ff;
  transform: scale(1.02);
}

.file-drop-zone.has-file {
  border-color: #48bb78;
  background: #f0fff4;
}

.drop-zone-content svg {
  color: #a0aec0;
  margin-bottom: 16px;
}

.drop-zone-text {
  font-size: 15px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 8px 0;
}

.drop-zone-hint {
  font-size: 13px;
  color: #718096;
  margin: 0;
}

/* Selected File */
.selected-file {
  display: flex;
  align-items: center;
  gap: 16px;
}

.selected-file svg {
  color: #48bb78;
  flex-shrink: 0;
}

.file-info {
  flex: 1;
  text-align: left;
}

.file-name {
  font-size: 15px;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 4px 0;
  word-break: break-word;
}

.file-size {
  font-size: 13px;
  color: #718096;
  margin: 0;
}

.btn-remove-file {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #fed7d7;
  color: #e53e3e;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.btn-remove-file:hover {
  background: #fc8181;
  color: white;
  transform: scale(1.1);
}

/* Error Box */
.error-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #fff5f5;
  border: 1px solid #feb2b2;
  border-radius: 10px;
  color: #e53e3e;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 20px;
}

/* Import Button */
.btn-import {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.btn-import:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5);
}

.btn-import:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Progress Section */
.progress-section {
  padding: 30px 40px;
  background: linear-gradient(to bottom, #f7fafc 0%, #edf2f7 100%);
  border-top: 1px solid #e2e8f0;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.progress-label {
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
}

.progress-percentage {
  font-size: 14px;
  font-weight: 700;
  color: #667eea;
}

.progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
  border-radius: 10px;
}

.progress-text {
  font-size: 13px;
  color: #718096;
  margin: 0;
}

/* Results Section */
.results-section {
  padding: 40px;
  background: linear-gradient(to bottom, #f0fff4 0%, #c6f6d5 100%);
  border-top: 1px solid #9ae6b4;
}

.results-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.results-header svg {
  color: #48bb78;
}

.results-header h3 {
  font-size: 20px;
  font-weight: 700;
  color: #22543d;
  margin: 0;
}

.results-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-item {
  padding: 20px;
  border-radius: 12px;
  text-align: center;
}

.stat-item.success {
  background: white;
  border: 2px solid #48bb78;
}

.stat-item.inserted {
  background: white;
  border: 2px solid #4299e1;
}

.stat-item.updated {
  background: white;
  border: 2px solid #ed8936;
}

.stat-item.error {
  background: white;
  border: 2px solid #f56565;
}

.stat-item.total {
  background: white;
  border: 2px solid #667eea;
}

.stat-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #718096;
  margin-bottom: 8px;
}

.stat-value {
  display: block;
  font-size: 28px;
  font-weight: 700;
}

.stat-item.success .stat-value {
  color: #48bb78;
}

.stat-item.inserted .stat-value {
  color: #4299e1;
}

.stat-item.updated .stat-value {
  color: #ed8936;
}

.stat-item.error .stat-value {
  color: #f56565;
}

.stat-item.total .stat-value {
  color: #667eea;
}

.btn-import-another {
  width: 100%;
  padding: 14px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-import-another:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .student-import-container {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .btn-back {
    width: 100%;
    justify-content: center;
  }

  .template-section,
  .upload-section {
    flex-direction: column;
    padding: 24px;
  }

  .divider {
    margin: 0 24px;
  }

  .file-drop-zone {
    padding: 30px 20px;
  }

  .progress-section,
  .results-section {
    padding: 24px;
  }
}
</style>