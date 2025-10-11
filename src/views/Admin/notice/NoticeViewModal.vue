<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-container">
      <!-- Modal Header -->
      <div class="modal-header" :class="`header-${notice.notice_type}`">
        <div class="header-content">
          <div class="notice-badges">
            <span class="badge" :class="`badge-${notice.type_badge}`">
              {{ notice.notice_type }}
            </span>
            <span class="badge badge-outline">
              {{ notice.target_audience }}
            </span>
            <span v-if="notice.year" class="badge badge-year">
              {{ notice.year }} Year
            </span>
            <span class="badge" :class="`badge-status-${notice.status_label}`">
              {{ notice.status_label }}
            </span>
          </div>
          <button class="close-btn" @click="$emit('close')">✕</button>
        </div>
      </div>

      <!-- Modal Body -->
      <div class="modal-body">
        <!-- Notice Title -->
        <h1 class="notice-title">{{ notice.title }}</h1>

        <!-- Notice Meta Information -->
        <div class="notice-meta-grid">
          <div class="meta-card">
            <div class="meta-icon">📅</div>
            <div class="meta-content">
              <div class="meta-label">Published On</div>
              <div class="meta-value">{{ formatDate(notice.publish_date) }}</div>
            </div>
          </div>

          <div class="meta-card" v-if="notice.expire_date">
            <div class="meta-icon">⏰</div>
            <div class="meta-content">
              <div class="meta-label">Expires On</div>
              <div class="meta-value">{{ formatDate(notice.expire_date) }}</div>
            </div>
          </div>

          <div class="meta-card">
            <div class="meta-icon">👤</div>
            <div class="meta-content">
              <div class="meta-label">Created By</div>
              <div class="meta-value">{{ notice.creator?.name || 'Unknown' }}</div>
              <div class="meta-subtext" v-if="notice.creator?.email">
                {{ notice.creator.email }}
              </div>
            </div>
          </div>

          <div class="meta-card" v-if="notice.department">
            <div class="meta-icon">🏛️</div>
            <div class="meta-content">
              <div class="meta-label">Department</div>
              <div class="meta-value">{{ notice.department.name }}</div>
            </div>
          </div>
        </div>

        <!-- Notice Content -->
        <div class="notice-content-section">
          <h3 class="section-title">📄 Notice Details</h3>
          <div class="notice-content" v-html="formatContent(notice.content)"></div>
        </div>

        <!-- Additional Information -->
        <div class="info-section">
          <div class="info-row">
            <span class="info-label">Notice ID:</span>
            <span class="info-value">#{{ notice.id }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Status:</span>
            <span class="info-value">
              <span class="status-indicator" :class="notice.is_active ? 'active' : 'inactive'"></span>
              {{ notice.is_active ? 'Active' : 'Inactive' }}
            </span>
          </div>
          <div class="info-row" v-if="notice.is_expired">
            <span class="info-label">Notice:</span>
            <span class="info-value warning">⚠️ This notice has expired</span>
          </div>
          <div class="info-row">
            <span class="info-label">Created:</span>
            <span class="info-value">{{ formatDateTime(notice.created_at) }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Last Updated:</span>
            <span class="info-value">{{ formatDateTime(notice.updated_at) }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-section">
          <button class="btn btn-edit" @click="$emit('edit', notice)">
            ✏️ Edit Notice
          </button>
          <button class="btn btn-delete" @click="$emit('delete', notice)">
            🗑️ Delete Notice
          </button>
          <button class="btn btn-secondary" @click="printNotice">
            🖨️ Print
          </button>
          <button class="btn btn-secondary" @click="shareNotice">
            📤 Share
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoticeViewModal',
  props: {
    notice: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },

    formatDateTime(datetime) {
      if (!datetime) return 'N/A';
      return new Date(datetime).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    formatContent(content) {
      // Convert newlines to <br> and preserve formatting
      return content.replace(/\n/g, '<br>');
    },

    printNotice() {
      window.print();
    },

    shareNotice() {
      const url = window.location.href;
      if (navigator.share) {
        navigator.share({
          title: this.notice.title,
          text: this.notice.content.substring(0, 100) + '...',
          url: url
        }).catch(err => console.log('Error sharing:', err));
      } else {
        // Fallback: Copy link to clipboard
        navigator.clipboard.writeText(url);
        this.$toast.success('Link copied to clipboard!');
      }
    }
  }
};
</script>

<style scoped>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Modal Container */
.modal-container {
  background: white;
  border-radius: 16px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Modal Header */
.modal-header {
  padding: 30px;
  border-bottom: none;
  position: relative;
  overflow: hidden;
}

.header-urgent {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
}

.header-exam {
  background: linear-gradient(135deg, #ff922b 0%, #fd7e14 100%);
}

.header-academic {
  background: linear-gradient(135deg, #4dabf7 0%, #339af0 100%);
}

.header-event {
  background: linear-gradient(135deg, #51cf66 0%, #37b24d 100%);
}

.header-general {
  background: linear-gradient(135deg, #868e96 0%, #495057 100%);
}

.header-content {
  position: relative;
  z-index: 1;
}

.notice-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
}

.badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-red { background: rgba(255, 255, 255, 0.95); color: #c92a2a; }
.badge-orange { background: rgba(255, 255, 255, 0.95); color: #e8590c; }
.badge-blue { background: rgba(255, 255, 255, 0.95); color: #1864ab; }
.badge-green { background: rgba(255, 255, 255, 0.95); color: #2b8a3e; }
.badge-gray { background: rgba(255, 255, 255, 0.95); color: #495057; }

.badge-outline {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.8);
  color: white;
}

.badge-year {
  background: rgba(255, 255, 255, 0.95);
  color: #7950f2;
}

.badge-status-active { background: #d3f9d8; color: #2b8a3e; }
.badge-status-inactive { background: rgba(255, 255, 255, 0.8); color: #868e96; }
.badge-status-expired { background: #ffe0e0; color: #c92a2a; }
.badge-status-scheduled { background: #e0f2ff; color: #1864ab; }

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 28px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
}

/* Modal Body */
.modal-body {
  padding: 40px;
  overflow-y: auto;
  max-height: calc(90vh - 150px);
}

/* Notice Title */
.notice-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.3;
  margin: 0 0 30px 0;
}

/* Meta Grid */
.notice-meta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 40px;
}

.meta-card {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 3px solid #667eea;
}

.meta-icon {
  font-size: 28px;
  line-height: 1;
}

.meta-content {
  flex: 1;
}

.meta-label {
  font-size: 11px;
  text-transform: uppercase;
  color: #868e96;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.meta-value {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
}

.meta-subtext {
  font-size: 12px;
  color: #868e96;
  margin-top: 2px;
}

/* Content Section */
.notice-content-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #343a40;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #f1f3f5;
}

.notice-content {
  font-size: 16px;
  line-height: 1.8;
  color: #495057;
  background: #f8f9fa;
  padding: 24px;
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

/* Info Section */
.info-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e9ecef;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 14px;
  color: #868e96;
  font-weight: 500;
}

.info-value {
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-value.warning {
  color: #e8590c;
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.status-indicator.active {
  background: #51cf66;
  box-shadow: 0 0 0 2px rgba(81, 207, 102, 0.2);
}

.status-indicator.inactive {
  background: #adb5bd;
}

/* Action Section */
.action-section {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 24px;
  border-top: 2px solid #f1f3f5;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-edit {
  background: linear-gradient(135deg, #51cf66 0%, #37b24d 100%);
  color: white;
}

.btn-delete {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  color: white;
}

.btn-secondary {
  background: #f1f3f5;
  color: #495057;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Print Styles */
@media print {
  .modal-overlay {
    background: white;
    position: static;
  }

  .modal-container {
    box-shadow: none;
    max-width: 100%;
    max-height: none;
  }

  .close-btn,
  .action-section {
    display: none;
  }

  .modal-body {
    padding: 20px;
    max-height: none;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .modal-container {
    max-width: 100%;
    margin: 0;
    border-radius: 0;
    max-height: 100vh;
  }

  .modal-body {
    padding: 24px;
    max-height: calc(100vh - 150px);
  }

  .notice-title {
    font-size: 24px;
  }

  .notice-meta-grid {
    grid-template-columns: 1fr;
  }

  .action-section {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>