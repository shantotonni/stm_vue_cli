<template>
  <div class="specimen-card">
    <div class="card-header">
      <div class="specimen-badge" :class="availabilityClass">
        <i :class="availabilityIcon"></i>
        {{ specimen.is_available ? 'Available' : 'Not Available' }}
      </div>
      <div class="card-actions">
        <button @click="$emit('edit', specimen)" class="action-btn edit-btn" title="Edit">
          <i class="fas fa-edit"></i>
        </button>
        <button @click="$emit('delete', specimen)" class="action-btn delete-btn" title="Delete">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>

    <div class="card-body">
      <div class="specimen-number">
        <i class="fas fa-hashtag"></i>
        {{ specimen.specimen_number }}
      </div>

      <h3 class="specimen-name">{{ specimen.specimen_name }}</h3>

      <div class="specimen-details">
        <div class="detail-item" v-if="specimen.specimen_type">
          <i class="fas fa-tag"></i>
          <span>{{ specimen.specimen_type }}</span>
        </div>

        <div class="detail-item" v-if="specimen.department">
          <i class="fas fa-building"></i>
          <span>{{ specimen.department.name }}</span>
        </div>

        <div class="detail-item" v-if="specimen.location">
          <i class="fas fa-map-marker-alt"></i>
          <span>{{ specimen.location }}</span>
        </div>
      </div>

      <div v-if="specimen.notes" class="specimen-notes">
        <i class="fas fa-sticky-note"></i>
        <p>{{ truncateNotes(specimen.notes) }}</p>
      </div>
    </div>

    <div class="card-footer">
      <div class="timestamp">
        <i class="fas fa-clock"></i>
        Updated {{ formatDate(specimen.updated_at) }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SpecimenCard',
  props: {
    specimen: {
      type: Object,
      required: true
    }
  },
  computed: {
    availabilityClass() {
      return this.specimen.is_available ? 'badge-success' : 'badge-danger';
    },
    availabilityIcon() {
      return this.specimen.is_available ? 'fas fa-check-circle' : 'fas fa-times-circle';
    }
  },
  methods: {
    truncateNotes(notes) {
      return notes.length > 100 ? notes.substring(0, 100) + '...' : notes;
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  }
};
</script>

<style scoped>
.specimen-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.specimen-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

.card-header {
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
}

.specimen-badge {
  padding: 0.4rem 0.85rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.badge-success {
  background: #d4edda;
  color: #155724;
}

.badge-danger {
  background: #f8d7da;
  color: #721c24;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  font-size: 0.9rem;
}

.edit-btn {
  background: #e6f2ff;
  color: #0066cc;
}

.edit-btn:hover {
  background: #0066cc;
  color: white;
}

.delete-btn {
  background: #ffe6e6;
  color: #cc0000;
}

.delete-btn:hover {
  background: #cc0000;
  color: white;
}

.card-body {
  padding: 1.25rem;
  flex: 1;
}

.specimen-number {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #f7fafc;
  padding: 0.4rem 0.85rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.75rem;
}

.specimen-number i {
  color: #667eea;
}

.specimen-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 1rem 0;
  line-height: 1.4;
}

.specimen-details {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.9rem;
  color: #4a5568;
}

.detail-item i {
  color: #a0aec0;
  width: 16px;
}

.specimen-notes {
  background: #f7fafc;
  padding: 0.85rem;
  border-radius: 8px;
  border-left: 3px solid #667eea;
  margin-top: 1rem;
}

.specimen-notes i {
  color: #667eea;
  margin-right: 0.5rem;
}

.specimen-notes p {
  margin: 0;
  font-size: 0.85rem;
  color: #4a5568;
  line-height: 1.5;
}

.card-footer {
  padding: 1rem 1.25rem;
  background: #f7fafc;
  border-top: 1px solid #e2e8f0;
}

.timestamp {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #718096;
}

.timestamp i {
  color: #a0aec0;
}
</style>