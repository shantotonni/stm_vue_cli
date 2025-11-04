<template>
  <div class="academic-calendar">
    <div class="calendar-header">
      <div class="header-content">
        <h1><i class="fas fa-calendar-alt"></i> Academic Calendar</h1>
        <button class="btn-add" @click="showEventModal = true">
          <i class="fas fa-plus"></i> Add Event
        </button>
      </div>
    </div>

    <div class="filters-stats">
      <div class="filters">
        <select v-model="filters.academic_year_id" @change="loadEvents" class="filter-select">
          <option value="">All Years</option>
          <option v-for="year in academicYears" :key="year.id" :value="year.id">
            {{ year.year_name }}
          </option>
        </select>
        <select v-model="filters.department_id" @change="loadEvents" class="filter-select">
          <option value="">All Departments</option>
          <option v-for="dept in departments" :key="dept.id" :value="dept.id">
            {{ dept.name }}
          </option>
        </select>
        <select v-model="filters.event_type" @change="loadEvents" class="filter-select">
          <option value="">All Events</option>
          <option v-for="type in eventTypes" :key="type.value" :value="type.value">
            {{ type.label }}
          </option>
        </select>
      </div>

      <div class="stats-cards">
        <div class="stat-card" style="border-left-color: #3b82f6;">
          <div class="stat-value">{{ statistics.total_events || 0 }}</div>
          <div class="stat-label">Total</div>
        </div>
        <div class="stat-card" style="border-left-color: #ef4444;">
          <div class="stat-value">{{ statistics.exams || 0 }}</div>
          <div class="stat-label">Exams</div>
        </div>
        <div class="stat-card" style="border-left-color: #10b981;">
          <div class="stat-value">{{ statistics.holidays || 0 }}</div>
          <div class="stat-label">Holidays</div>
        </div>
      </div>
    </div>

    <div class="calendar-nav">
      <button class="nav-btn" @click="previousMonth"><i class="fas fa-chevron-left"></i></button>
      <h2>{{ currentMonthName }} {{ currentYear }}</h2>
      <button class="nav-btn" @click="nextMonth"><i class="fas fa-chevron-right"></i></button>
      <button class="today-btn" @click="goToToday">Today</button>
    </div>

    <div class="calendar-grid">
      <div class="weekdays">
        <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
      </div>
      <div class="days">
        <div v-for="(day, i) in calendarDays" :key="i" class="day"
             :class="{ 'other-month': !day.isCurrentMonth, 'today': day.isToday, 'has-events': day.events.length > 0 }"
             @click="selectDay(day)">
          <div class="day-number">{{ day.date }}</div>
          <div class="day-events">
            <div v-for="event in day.events.slice(0, 2)" :key="event.id" class="event-dot"
                 :style="{ backgroundColor: event.color }" @click.stop="viewEvent(event)">
              <span>{{ event.title }}</span>
            </div>
            <div v-if="day.events.length > 2" class="more-events">+{{ day.events.length - 2 }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showEventModal" class="modal" @click="closeEventModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ editingEvent ? 'Edit Event' : 'Create Event' }}</h3>
          <button @click="closeEventModal"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveEvent">
            <div class="form-group">
              <label>Title *</label>
              <input v-model="eventForm.title" class="form-control" required />
            </div>
            <div class="form-group">
              <label>Event Type *</label>
              <select v-model="eventForm.event_type" class="form-control" required>
                <option v-for="type in eventTypes" :key="type.value" :value="type.value">{{ type.label }}</option>
              </select>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Start Date *</label>
                <input type="date" v-model="eventForm.start_date" class="form-control" required />
              </div>
              <div class="form-group">
                <label>End Date *</label>
                <input type="date" v-model="eventForm.end_date" class="form-control" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Start Time</label>
                <input type="time" v-model="eventForm.start_time" class="form-control" />
              </div>
              <div class="form-group">
                <label>End Time</label>
                <input type="time" v-model="eventForm.end_time" class="form-control" />
              </div>
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea v-model="eventForm.description" class="form-control" rows="3"></textarea>
            </div>
            <div class="form-actions">
              <button type="button" class="btn-secondary" @click="closeEventModal">Cancel</button>
              <button type="submit" class="btn-primary" :disabled="saving">
                {{ saving ? 'Saving...' : 'Save' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div v-if="showViewModal && selectedEvent" class="modal" @click="closeViewModal">
      <div class="modal-content view-modal" @click.stop>
        <div class="modal-header" :style="{ borderColor: selectedEvent.color }">
          <div>
            <h3>{{ selectedEvent.title }}</h3>
            <span class="badge" :style="{ backgroundColor: selectedEvent.color }">
              {{ getEventTypeLabel(selectedEvent.event_type) }}
            </span>
          </div>
          <button @click="closeViewModal"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          <div class="event-info">
            <div class="info-item">
              <i class="fas fa-calendar"></i>
              <span>{{ formatDate(selectedEvent.start_date) }} - {{ formatDate(selectedEvent.end_date) }}</span>
            </div>
            <div class="info-item" v-if="selectedEvent.start_time">
              <i class="fas fa-clock"></i>
              <span>{{ selectedEvent.start_time }} - {{ selectedEvent.end_time }}</span>
            </div>
            <div class="info-item" v-if="selectedEvent.description">
              <i class="fas fa-align-left"></i>
              <span>{{ selectedEvent.description }}</span>
            </div>
          </div>
          <div class="form-actions">
            <button class="btn-danger" @click="deleteEvent(selectedEvent.id)">Delete</button>
            <button class="btn-primary" @click="editEvent(selectedEvent)">Edit</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="toast.show" class="toast" :class="toast.type">
      <i :class="toast.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'"></i>
      <span>{{ toast.message }}</span>
    </div>
  </div>
</template>

<script>

export default {
  name: 'AcademicCalendar',
  data() {
    return {
      loading: false,
      saving: false,
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      events: [],
      upcomingEvents: [],
      academicYears: [],
      departments: [],
      eventTypes: [],
      statistics: {},
      filters: { academic_year_id: '', department_id: '', event_type: '' },
      showEventModal: false,
      showViewModal: false,
      selectedEvent: null,
      editingEvent: null,
      eventForm: this.getEmptyForm(),
      weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      toast: { show: false, type: '', message: '' }
    };
  },
  computed: {
    currentMonthName() {
      return ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'][this.currentMonth];
    },
    calendarDays() {
      const days = [];
      const firstDay = new Date(this.currentYear, this.currentMonth, 1);
      const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
      const prevLastDay = new Date(this.currentYear, this.currentMonth, 0);

      for (let i = firstDay.getDay() - 1; i >= 0; i--) {
        days.push({ date: prevLastDay.getDate() - i, isCurrentMonth: false, isToday: false, events: [] });
      }

      for (let i = 1; i <= lastDay.getDate(); i++) {
        const fullDate = new Date(this.currentYear, this.currentMonth, i);
        const isToday = fullDate.toDateString() === new Date().toDateString();
        days.push({ date: i, isCurrentMonth: true, isToday, fullDate, events: this.getEventsForDate(fullDate) });
      }

      const remaining = 42 - days.length;
      for (let i = 1; i <= remaining; i++) {
        days.push({ date: i, isCurrentMonth: false, isToday: false, events: [] });
      }

      return days;
    }
  },
  mounted() {
    this.loadMasterData();
    this.loadEvents();
    this.loadStatistics();
  },
  methods: {
    async loadMasterData() {
      const res = await this.$api.get('/calendar/master-data');
      this.academicYears = res.data.data.academic_years;
      this.departments = res.data.data.departments;
      this.eventTypes = res.data.data.event_types;
    },
    async loadEvents() {
      this.loading = true;
      try {
        const res = await this.$api.get('/calendar/events', {
          params: { ...this.filters, month: this.currentMonth + 1, year: this.currentYear }
        });
        this.events = res.data.data;
      } finally {
        this.loading = false;
      }
    },
    async loadStatistics() {
      const res = await this.$api.get('/calendar/statistics');
      this.statistics = res.data.data;
    },
    getEventsForDate(date) {
      return this.events.filter(e => {
        const start = new Date(e.start_date);
        const end = new Date(e.end_date);
        return date >= start && date <= end;
      });
    },
    async saveEvent() {
      this.saving = true;
      try {
        if (this.editingEvent) {
          await this.$api.put(`/calendar/events/${this.editingEvent.id}`, this.eventForm);
          this.showToast('success', 'Event updated!');
        } else {
          await this.$api.post('/calendar/events', this.eventForm);
          this.showToast('success', 'Event created!');
        }
        this.closeEventModal();
        this.loadEvents();
        this.loadStatistics();
      } catch (error) {
        this.showToast('error', 'Failed to save event');
      } finally {
        this.saving = false;
      }
    },
    async deleteEvent(id) {
      if (!confirm('Delete this event?')) return;
      await this.$api.delete(`/calendar/events/${id}`);
      this.showToast('success', 'Event deleted!');
      this.closeViewModal();
      this.loadEvents();
      this.loadStatistics();
    },
    editEvent(event) {
      this.editingEvent = event;
      this.eventForm = { ...event };
      this.closeViewModal();
      this.showEventModal = true;
    },
    viewEvent(event) {
      this.selectedEvent = event;
      this.showViewModal = true;
    },
    selectDay(day) {
      if (day.events.length) console.log('Day events:', day.events);
    },
    previousMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
      this.loadEvents();
    },
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
      this.loadEvents();
    },
    goToToday() {
      this.currentMonth = new Date().getMonth();
      this.currentYear = new Date().getFullYear();
      this.loadEvents();
    },
    closeEventModal() {
      this.showEventModal = false;
      this.editingEvent = null;
      this.eventForm = this.getEmptyForm();
    },
    closeViewModal() {
      this.showViewModal = false;
      this.selectedEvent = null;
    },
    getEmptyForm() {
      return {
        title: '', description: '', event_type: '', start_date: '', end_date: '',
        start_time: '', end_time: '', department_id: '', year_level: '', color: '#667eea'
      };
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    },
    getEventTypeLabel(type) {
      const t = this.eventTypes.find(x => x.value === type);
      return t ? t.label : type;
    },
    showToast(type, message) {
      this.toast = { show: true, type, message };
      setTimeout(() => this.toast.show = false, 3000);
    }
  }
};
</script>

<style scoped>
.academic-calendar { background: #f5f7fa; min-height: 100vh; font-family: -apple-system, sans-serif; }
.calendar-header { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 1.5rem; }
.header-content { max-width: 1400px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
.header-content h1 { margin: 0; font-size: 1.75rem; font-weight: 700; display: flex; align-items: center; gap: 0.75rem; }
.btn-add { background: rgba(255,255,255,0.2); border: 2px solid white; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; gap: 0.5rem; }
.btn-add:hover { background: white; color: #667eea; }

.filters-stats { max-width: 1400px; margin: 1.5rem auto; padding: 0 1rem; display: flex; gap: 1.5rem; flex-wrap: wrap; }
.filters { flex: 1; display: flex; gap: 0.75rem; flex-wrap: wrap; }
.filter-select { flex: 1; min-width: 150px; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 8px; background: white; }
.stats-cards { display: flex; gap: 1rem; }
.stat-card { background: white; padding: 1rem; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-left: 4px solid; min-width: 100px; text-align: center; }
.stat-value { font-size: 1.75rem; font-weight: 700; color: #2d3748; }
.stat-label { font-size: 0.85rem; color: #718096; font-weight: 600; }

.calendar-nav { max-width: 1400px; margin: 0 auto 1.5rem; padding: 0 1rem; display: flex; align-items: center; gap: 1rem; }
.nav-btn { width: 40px; height: 40px; border: none; background: white; border-radius: 8px; cursor: pointer; color: #667eea; }
.nav-btn:hover { background: #667eea; color: white; }
.calendar-nav h2 { flex: 1; text-align: center; font-size: 1.5rem; margin: 0; color: #2d3748; }
.today-btn { padding: 0.75rem 1.5rem; background: white; border: 2px solid #667eea; color: #667eea; border-radius: 8px; font-weight: 600; cursor: pointer; }
.today-btn:hover { background: #667eea; color: white; }

.calendar-grid { max-width: 1400px; margin: 0 auto 2rem; padding: 0 1rem; background: white; border-radius: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); overflow: hidden; }
.weekdays { display: grid; grid-template-columns: repeat(7, 1fr); background: #f7fafc; border-bottom: 2px solid #e2e8f0; }
.weekday { padding: 1rem; text-align: center; font-weight: 700; color: #4a5568; }
.days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 1px; background: #e2e8f0; }
.day { background: white; min-height: 120px; padding: 0.75rem; cursor: pointer; }
.day:hover { background: #f7fafc; }
.day.other-month { opacity: 0.5; }
.day.today { background: #eef2ff; border: 2px solid #667eea; }
.day.has-events { background: linear-gradient(to bottom, white, #f0f9ff); }
.day-number { font-weight: 600; margin-bottom: 0.5rem; }
.day.today .day-number { background: #667eea; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
.day-events { display: flex; flex-direction: column; gap: 0.35rem; }
.event-dot { padding: 0.35rem 0.5rem; border-radius: 4px; font-size: 0.75rem; color: white; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.more-events { font-size: 0.7rem; color: #667eea; font-weight: 600; }

.modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1rem; }
.modal-content { background: white; border-radius: 16px; max-width: 600px; width: 100%; max-height: 90vh; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
.modal-header { padding: 1.5rem; border-bottom: 2px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
.modal-header h3 { margin: 0; font-size: 1.5rem; }
.modal-header button { width: 36px; height: 36px; border: none; background: #f7fafc; border-radius: 50%; cursor: pointer; }
.modal-body { padding: 1.5rem; overflow-y: auto; }
.form-group { margin-bottom: 1.25rem; }
.form-group label { display: block; font-weight: 600; color: #4a5568; margin-bottom: 0.5rem; }
.form-control { width: 100%; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 8px; }
.form-control:focus { outline: none; border-color: #667eea; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.form-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 2px solid #e2e8f0; }
.btn-primary, .btn-secondary, .btn-danger { padding: 0.75rem 1.5rem; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
.btn-primary { background: linear-gradient(135deg, #667eea, #764ba2); color: white; }
.btn-secondary { background: #e2e8f0; color: #4a5568; }
.btn-danger { background: #ef4444; color: white; }

.view-modal { max-width: 700px; }
.event-info { margin-bottom: 1.5rem; }
.info-item { display: flex; gap: 1rem; margin-bottom: 1rem; align-items: flex-start; }
.info-item i { width: 24px; color: #667eea; margin-top: 0.25rem; }
.badge { padding: 0.35rem 0.75rem; border-radius: 20px; font-size: 0.75rem; color: white; font-weight: 600; }

.toast { position: fixed; top: 2rem; right: 2rem; background: white; padding: 1rem 1.5rem; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.15); display: flex; gap: 0.75rem; z-index: 3000; font-weight: 600; }
.toast.success { border-left: 4px solid #10b981; color: #047857; }
.toast.error { border-left: 4px solid #ef4444; color: #b91c1c; }

@media (max-width: 768px) {
  .filters-stats { flex-direction: column; }
  .day { min-height: 80px; padding: 0.5rem; }
  .form-row { grid-template-columns: 1fr; }
}
</style>