<template>
  <!-- Content Area -->
  <main class="content-area">
    <!-- Alert -->
    <div class="alert alert-warning">
      <div class="alert-icon">📢 ️</div>
      <div class="alert-content">
        <div class="alert-title">Survey Pending</div>
        <div class="alert-message">You have not attended the survey yet. Please complete your survey.</div>
      </div>
      <router-link to="/survey" class="btn btn-primary rounded-pill px-4 py-2 mt-3">
        Go to Survey
      </router-link>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <a href="#" class="action-card">
        <div class="action-icon blue">📊</div>
        <div class="action-label">Mark Attendance</div>
        <div class="action-count">Today: Present</div>
      </a>
      <a href="#" class="action-card">
        <div class="action-icon green">📝</div>
        <div class="action-label">Assignments</div>
        <div class="action-count">3 Pending</div>
      </a>
      <a href="#" class="action-card">
        <div class="action-icon purple">📚</div>
        <div class="action-label">Upcoming Exams</div>
        <div class="action-count">2 This Week</div>
      </a>
      <a href="#" class="action-card">
        <div class="action-icon yellow">🏥</div>
        <div class="action-label">Clinical Duty</div>
        <div class="action-count">Tomorrow 9 AM</div>
      </a>
      <a href="#" class="action-card">
        <div class="action-icon red">📖</div>
        <div class="action-label">E-Library</div>
        <div class="action-count">5 New Books</div>
      </a>
      <a href="#" class="action-card">
        <div class="action-icon indigo">🎯</div>
        <div class="action-label">Results</div>
        <div class="action-count">View Grades</div>
      </a>
    </div>

    <!-- Stats Overview -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-info">
            <h3>Overall Attendance</h3>
            <div class="stat-value">92.5%</div>
            <div class="stat-change positive">
              ↗ 2.3% from last month
            </div>
          </div>
          <div class="stat-icon">📅</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-info">
            <h3>Current CGPA</h3>
            <div class="stat-value">8.7</div>
            <div class="stat-change positive">
              ↗ 0.3 from last sem
            </div>
          </div>
          <div class="stat-icon">🎓</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-info">
            <h3>Clinical Hours</h3>
            <div class="stat-value">246</div>
            <div class="stat-change positive">
              84% Complete
            </div>
          </div>
          <div class="stat-icon">⏰</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-content">
          <div class="stat-info">
            <h3>Patient Cases</h3>
            <div class="stat-value">38</div>
            <div class="stat-change positive">
              12 This Month
            </div>
          </div>
          <div class="stat-icon">👥</div>
        </div>
      </div>
    </div>

    <!-- Schedule & Calendar -->
    <div class="schedule-layout">
      <div class="section-card">
        <div class="card-header">
          <h3 class="card-title">Today's Schedule</h3>
          <a href="#" class="view-all">View Full Schedule →</a>
        </div>
        <div class="schedule-list">
          <div class="schedule-item">
            <div class="schedule-time">8:00 AM</div>
            <div class="schedule-details">
              <h4>Anatomy Lecture</h4>
              <p>Dr. Sarah Johnson • Room 201</p>
            </div>
            <span class="schedule-type type-lecture">Lecture</span>
          </div>
          <div class="schedule-item">
            <div class="schedule-time">10:00 AM</div>
            <div class="schedule-details">
              <h4>Clinical Rotation - Cardiology</h4>
              <p>Dr. Michael Chen • Ward B</p>
            </div>
            <span class="schedule-type type-clinical">Clinical</span>
          </div>
          <div class="schedule-item">
            <div class="schedule-time">2:00 PM</div>
            <div class="schedule-details">
              <h4>Pathology Lab</h4>
              <p>Prof. Emily Rodriguez • Lab 3</p>
            </div>
            <span class="schedule-type type-lab">Lab</span>
          </div>
          <div class="schedule-item">
            <div class="schedule-time">4:00 PM</div>
            <div class="schedule-details">
              <h4>Internal Medicine Quiz</h4>
              <p>Dr. James Wilson • Exam Hall A</p>
            </div>
            <span class="schedule-type type-exam">Exam</span>
          </div>
        </div>
      </div>

      <div class="section-card">
        <div class="card-header">
          <h3 class="card-title">September 2025</h3>
        </div>
        <div class="mini-calendar">
          <div class="cal-header">S</div>
          <div class="cal-header">M</div>
          <div class="cal-header">T</div>
          <div class="cal-header">W</div>
          <div class="cal-header">T</div>
          <div class="cal-header">F</div>
          <div class="cal-header">S</div>

          <div class="cal-day"></div>
          <div class="cal-day">1</div>
          <div class="cal-day">2</div>
          <div class="cal-day">3</div>
          <div class="cal-day">4</div>
          <div class="cal-day">5</div>
          <div class="cal-day">6</div>
          <div class="cal-day">7</div>
          <div class="cal-day">8</div>
          <div class="cal-day">9</div>
          <div class="cal-day">10</div>
          <div class="cal-day event">11</div>
          <div class="cal-day">12</div>
          <div class="cal-day">13</div>
          <div class="cal-day">14</div>
          <div class="cal-day event">15</div>
          <div class="cal-day">16</div>
          <div class="cal-day">17</div>
          <div class="cal-day">18</div>
          <div class="cal-day">19</div>
          <div class="cal-day today">20</div>
          <div class="cal-day">21</div>
          <div class="cal-day event">22</div>
          <div class="cal-day">23</div>
          <div class="cal-day">24</div>
          <div class="cal-day">25</div>
          <div class="cal-day">26</div>
          <div class="cal-day">27</div>
          <div class="cal-day">28</div>
          <div class="cal-day">29</div>
          <div class="cal-day">30</div>
        </div>
      </div>
    </div>

    <!-- Academic Progress -->
    <div class="section-card">
      <div class="card-header">
        <h3 class="card-title">Academic Progress - Current Semester</h3>
        <a href="#" class="view-all">View Transcript →</a>
      </div>
      <div class="semester-tabs">
        <button class="semester-tab active">Semester 5</button>
        <button class="semester-tab">Semester 4</button>
        <button class="semester-tab">Semester 3</button>
        <button class="semester-tab">All Semesters</button>
      </div>
      <div class="subjects-grid">
        <div class="subject-card">
          <div class="subject-header">
            <span class="subject-name">Pathology</span>
            <span class="subject-grade">A+</span>
          </div>
          <div class="subject-details">
            <div class="detail-row">
              <span class="detail-label">Credits:</span>
              <span class="detail-value">4</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Attendance:</span>
              <span class="detail-value">94%</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Internal Score:</span>
              <span class="detail-value">42/45</span>
            </div>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: 93%"></div>
          </div>
        </div>
        <div class="subject-card">
          <div class="subject-header">
            <span class="subject-name">Pharmacology</span>
            <span class="subject-grade">A</span>
          </div>
          <div class="subject-details">
            <div class="detail-row">
              <span class="detail-label">Credits:</span>
              <span class="detail-value">3</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Attendance:</span>
              <span class="detail-value">88%</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Internal Score:</span>
              <span class="detail-value">38/45</span>
            </div>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: 84%"></div>
          </div>
        </div>
        <div class="subject-card">
          <div class="subject-header">
            <span class="subject-name">Microbiology</span>
            <span class="subject-grade">A+</span>
          </div>
          <div class="subject-details">
            <div class="detail-row">
              <span class="detail-label">Credits:</span>
              <span class="detail-value">3</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Attendance:</span>
              <span class="detail-value">92%</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Internal Score:</span>
              <span class="detail-value">41/45</span>
            </div>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: 91%"></div>
          </div>
        </div>
        <div class="subject-card">
          <div class="subject-header">
            <span class="subject-name">Forensic Medicine</span>
            <span class="subject-grade">B+</span>
          </div>
          <div class="subject-details">
            <div class="detail-row">
              <span class="detail-label">Credits:</span>
              <span class="detail-value">2</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Attendance:</span>
              <span class="detail-value">85%</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Internal Score:</span>
              <span class="detail-value">35/45</span>
            </div>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: 78%"></div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: "DashboardView",
  data() {
    return {
      is_today_submitted: false,
      today_submitted_count: 0,
      total_survey: 0,
      today_survey: [],
      last_seven_surveys: [],
      loading: true,
    };
  },
  computed : {
    user() {
      return this.$store.getters.currentUser;
    },
  },
  async created() {
    //console.log(this.user)
    // if (this.user) {
    //   await this.loadDashboard();
    // }
  },
  mounted() {
    document.title = `Dashboard | ${process.env.VUE_APP_PROJECT_NAME}`;
    this.loadScript();
    //this.loadDashboard();
  },
  methods: {
    async loadDashboard() {
      try {
        const res = await this.$api.get("dashboard");
        this.is_today_submitted = res.data.is_today_submitted;
        this.today_submitted_count = res.data.today_submitted_count;
        this.total_survey = res.data.total_survey;
        this.today_survey = res.data.today_survey;
        this.last_seven_surveys = res.data.last_seven_surveys;
        this.loading = false;
      } catch (err) {
        console.error("Error fetching survey questions:", err);
        this.loading = false;
      }
    },
    loadScript(){
      // Close sidebar when clicking outside on mobile
      document.addEventListener('click', function(event) {
        const sidebar = document.getElementById('sidebar');
        const menuToggle = document.querySelector('.menu-toggle');

        if (window.innerWidth <= 1024) {
          if (sidebar && menuToggle && !sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
            sidebar.classList.remove('active');
          }
        }
      });

      // Animate elements on load
      document.addEventListener('DOMContentLoaded', function() {
        // Animate stat cards
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, index * 100);
        });

        // Animate action cards
        const actionCards = document.querySelectorAll('.action-card');
        actionCards.forEach((card, index) => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, index * 80 + 200);
        });

        // Animate progress bars
        setTimeout(() => {
          document.querySelectorAll('.progress-fill').forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
              bar.style.width = width;
            }, 100);
          });
        }, 800);
      });

      // Semester Tab Switching
      document.querySelectorAll('.semester-tab').forEach(tab => {
        tab.addEventListener('click', function() {
          document.querySelectorAll('.semester-tab').forEach(t => t.classList.remove('active'));
          this.classList.add('active');
          console.log('Loading semester:', this.textContent);
        });
      });

      // Calendar day clicks
      document.querySelectorAll('.cal-day').forEach(day => {
        if (day.textContent) {
          day.addEventListener('click', function() {
            console.log('Calendar day clicked:', this.textContent);
          });
        }
      });

      // Enhanced mobile responsiveness
      window.addEventListener('resize', function() {
        if (window.innerWidth > 1024) {
          document.getElementById('sidebar').classList.remove('active');
        }
      });

    }
  },
}
</script>

<style scoped>

</style>
