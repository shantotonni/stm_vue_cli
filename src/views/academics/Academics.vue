<template>
  <!-- Content Area -->
  <main class="content-area">
    <!-- Quick Actions -->
    <div class="quick-actions">
      <a href="#" class="action-card">
        <div class="action-icon blue">📊</div>
        <div class="action-label">Profile & Batch Info</div>
<!--        <div class="action-count">Today: Present</div>-->
      </a>
      <a href="#" class="action-card">
        <div class="action-icon green">📝</div>
        <div class="action-label">Timetable</div>
<!--        <div class="action-count">3 Pending</div>-->
      </a>
      <a href="#" class="action-card">
        <div class="action-icon purple">📚</div>
        <div class="action-label">Attendance</div>
<!--        <div class="action-count">2 This Week</div>-->
      </a>
      <a href="#" class="action-card">
        <div class="action-icon yellow">🏥</div>
        <div class="action-label">Course Materials / Syllabus</div>
<!--        <div class="action-count">Tomorrow 9 AM</div>-->
      </a>
      <a href="#" class="action-card">
        <div class="action-icon red">📖</div>
        <div class="action-label">Exams & Marks</div>
<!--        <div class="action-count">5 New Books</div>-->
      </a>
      <a href="#" class="action-card">
        <div class="action-icon indigo">🎯</div>
        <div class="action-label">Academic Progress</div>
<!--        <div class="action-count">View Grades</div>-->
      </a>
      <a href="#" class="action-card">
        <div class="action-icon indigo">🎯</div>
        <div class="action-label">Mentorship / Skill Logbooks</div>
        <!--        <div class="action-count">View Grades</div>-->
      </a>
      <a href="#" class="action-card">
        <div class="action-icon indigo">🎯</div>
        <div class="action-label">Notices / Academic Calendar</div>
        <!--        <div class="action-count">View Grades</div>-->
      </a>
    </div>
  </main>
</template>

<script>
export default {
  name: "AcademicsModule",
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
  mounted() {
    document.title = 'Academics | Survey';
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
