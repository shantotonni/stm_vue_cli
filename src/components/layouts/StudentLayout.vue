<template>
  <div>
    <!-- Top Navigation -->
    <nav class="top-nav" v-if="canShowSidebar">
      <div class="nav-container">
        <div class="logo-section">
          <button class="menu-toggle" @click="toggleSidebar">☰</button>
          <div class="logo">M</div>
          <div class="brand-name">
            <span><img style="width: 115px" src="../../assets/images/logo.png" alt="logo"/></span>
          </div>
        </div>

        <div class="nav-actions">
          <button class="nav-btn" @click="showNotifications()">
            🔔
            <span class="badge">5</span>
          </button>
          <button class="nav-btn" @click="showMessages()">
            💬
            <span class="badge">3</span>
          </button>
          <div class="user-menu" @click="toggleUserMenu()">
            <div class="user-avatar">{{ srtName(currentUser) }}</div>
            <div class="user-info">
              <div class="name">{{ currentUser?.name }}</div>
              <div class="role">MBBS Year 3</div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Layout -->
    <div class="main-layout">
      <!-- Sidebar -->
      <aside class="sidebar" id="sidebar" v-if="canShowSidebar" style="width: 300px;">
        <div class="menu-section">
          <div class="menu-title">Main Menu</div>
          <router-link to="/dashboard" class="menu-item active" @click="showSection('dashboard')">
            <span class="menu-icon">📊</span>
            <span class="menu-label">Dashboard</span>
          </router-link>
          <router-link to="/survey" class="menu-item" @click="showSection('survey')">
            <span class="menu-icon">📚</span>
            <span class="menu-label">Teachers Evaluation</span>
          </router-link>
          <router-link to="/academics" class="menu-item" @click="showSection('academics')">
            <span class="menu-icon">📚</span>
            <span class="menu-label">Academics</span>
          </router-link>
<!--          <a href="#" class="menu-item" @click="showSection('attendance')">-->
<!--            <span class="menu-icon">📅</span>-->
<!--            <span class="menu-label">Attendance</span>-->
<!--          </a>-->
<!--          <a href="#" class="menu-item" @click="showSection('examinations')">-->
<!--            <span class="menu-icon">📝</span>-->
<!--            <span class="menu-label">Examinations</span>-->
<!--          </a>-->
        </div>

<!--        <div class="menu-section">-->
<!--          <div class="menu-title">Clinical</div>-->
<!--          <a href="#" class="menu-item" @click="showSection('skills')">-->
<!--            <span class="menu-icon">💉</span>-->
<!--            <span class="menu-label">Skills Assessment</span>-->
<!--          </a>-->
<!--          <a href="#" class="menu-item" @click="showSection('case-studies')">-->
<!--            <span class="menu-icon">📋</span>-->
<!--            <span class="menu-label">Case Studies</span>-->
<!--          </a>-->
<!--        </div>-->

        <div class="menu-section">
          <div class="menu-title">Resources</div>
          <router-link to="/e-learning" class="menu-item" @click="showSection('library')">
            <span class="menu-icon">📖</span>
            <span class="menu-label">E-Library</span>
          </router-link>
          <a href="#" class="menu-item" @click="showSection('research')">
            <span class="menu-icon">🔬</span>
            <span class="menu-label">Research Papers</span>
          </a>
<!--          <a href="#" class="menu-item" @click="showSection('videos')">-->
<!--            <span class="menu-icon">🎥</span>-->
<!--            <span class="menu-label">Video Lectures</span>-->
<!--          </a>-->
        </div>

        <div class="menu-section">
          <div class="menu-title">Student Services</div>
          <a href="#" class="menu-item" @click="showSection('fees')">
            <span class="menu-icon">💳</span>
            <span class="menu-label">Fee Management</span>
          </a>
          <a href="#" class="menu-item" @click="showSection('hostel')">
            <span class="menu-icon">🏠</span>
            <span class="menu-label">Hostel</span>
          </a>
          <a href="#" class="menu-item" @click="showSection('health')">
            <span class="menu-icon">🏥</span>
            <span class="menu-label">Health Records</span>
          </a>
          <a href="#" class="menu-item" @click="showSection('documents')">
            <span class="menu-icon">📄</span>
            <span class="menu-label">Documents</span>
          </a>
        </div>

        <div class="menu-section">
          <div class="menu-title">Communication</div>
          <a href="#" class="menu-item" @click="showSection('announcements')">
            <span class="menu-icon">📢</span>
            <span class="menu-label">Announcements</span>
          </a>
          <a href="#" class="menu-item" @click="showSection('forums')">
            <span class="menu-icon">💭</span>
            <span class="menu-label">Forums</span>
          </a>
          <a href="#" class="menu-item" @click="showSection('support')">
            <span class="menu-icon">🆘</span>
            <span class="menu-label">Support</span>
          </a>
        </div>

        <div class="menu-section">
          <div class="menu-title">Settings</div>
          <router-link to="/change-password" class="menu-item" @click="showSection('changepassword')">
            <span class="menu-icon">@</span>
            <span class="menu-label">Change Password</span>
          </router-link>
        </div>

        <div class="menu-section">
          <a href="#" class="menu-item" @click="logout()">
            <span class="menu-icon">🚪</span>
            <span class="menu-label">Logout</span>
          </a>
        </div>
      </aside>

      <router-view />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "StudentLayout",
  data() {
    return {
      studentName: "Demo Student",
      isSidebarOpen: false,
    };
  },
  computed: {
    ...mapGetters(["currentUser"]),
    canShowSidebar() {
      let is_change_password = localStorage.getItem("is_change_password")
      return is_change_password === "Y"
    },
    user() {
      return this.$store.getters.currentUser;
    },
  },
  mounted() {
    //this.loadScript()
  },
  methods: {
    toggleSidebar() {
      const sidebar = document.getElementById('sidebar');
      sidebar.classList.toggle('active');
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.setItem("is_change_password", "");
      this.$router.push({ name: "Login" });
    },
   showSection(section) {
      document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
      });

      event.target.closest('.menu-item').classList.add('active');

      if (window.innerWidth <= 1024) {
        document.getElementById('sidebar').classList.remove('active');
      }
     console.log('Loading section:', section);
    },
   showNotifications() {
      alert('Notifications:\n\n1. Assignment due tomorrow - Pathology\n2. Clinical rotation schedule updated\n3. New announcement from Dean\n4. Library book return reminder\n5. Exam results published - Microbiology');
    },
   showMessages() {
      alert('Messages:\n\n1. Dr. Sarah Johnson: "Please submit your case report"\n2. Study Group: "Meeting at 5 PM today"\n3. Academic Office: "Fee payment reminder"');
    },
   toggleUserMenu() {
      console.log('User menu clicked');
    },
    srtName(currentUser){
      if (!currentUser || !currentUser.name) return "";
      return currentUser.name
          .trim()
          .split(" ")
          .filter(word => word.length > 0)
          .map(word => word[0].toUpperCase())
          .join("");
    }
},
}
</script>

<style scoped>

</style>
