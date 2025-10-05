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
        </div>

        <div class="menu-section">
          <div class="menu-item cursor-pointer" @click="toggleDropdown('skills-cases')">
            <span class="menu-icon">💉</span>
            <span class="menu-label">Skills & Cases</span>
            <span class="ml-auto" :class="{ 'rotate-180': openMenu === 'skills-cases' }">▼</span>
          </div>

          <!-- Dropdown Submenu -->
          <transition name="fade">
            <div v-if="openMenu === 'skills-cases'" class="pl-6 flex flex-col space-y-2 mt-2">
              <a href="#" class="submenu-item" @click="showSection('skills')">
                🩺 Skills Assessment
              </a>
              <a href="#" class="submenu-item" @click="showSection('case-studies')">
                📋 Case Studies
              </a>
            </div>
          </transition>
        </div>

<!--        <div class="menu-section">-->
<!--          <div class="menu-item cursor-pointer" @click="toggleDropdown('resources')">-->
<!--            <span class="menu-icon">💉</span>-->
<!--            <span class="menu-label">Resources</span>-->
<!--            <span class="ml-auto" :class="{ 'rotate-180': openMenu === 'resources' }">▼</span>-->
<!--          </div>-->

<!--          &lt;!&ndash; Dropdown Submenu &ndash;&gt;-->
<!--          <transition name="fade">-->
<!--            <div v-if="openMenu === 'resources'"  class="pl-6 flex flex-col space-y-2 mt-2">-->
<!--              <a href="#" class="submenu-item" @click="showSection('skills')">-->
<!--                📖 E-Library-->
<!--              </a>-->
<!--              <a href="#" class="submenu-item" @click="showSection('case-studies')">-->
<!--                🔬 Research Papers-->
<!--              </a>-->
<!--            </div>-->
<!--          </transition>-->
<!--        </div>-->

<!--        <div class="menu-section">-->
<!--          <div class="menu-title">Resources</div>-->
<!--          <router-link to="/e-learning" class="menu-item" @click="showSection('library')">-->
<!--            <span class="menu-icon">📖</span>-->
<!--            <span class="menu-label">E-Library</span>-->
<!--          </router-link>-->
<!--          <a href="#" class="menu-item" @click="showSection('research')">-->
<!--            <span class="menu-icon">🔬</span>-->
<!--            <span class="menu-label">Research Papers</span>-->
<!--          </a>-->
<!--&lt;!&ndash;          <a href="#" class="menu-item" @click="showSection('videos')">&ndash;&gt;-->
<!--&lt;!&ndash;            <span class="menu-icon">🎥</span>&ndash;&gt;-->
<!--&lt;!&ndash;            <span class="menu-label">Video Lectures</span>&ndash;&gt;-->
<!--&lt;!&ndash;          </a>&ndash;&gt;-->
<!--        </div>-->

<!--        <div class="menu-section">-->
<!--          <div class="menu-title">Student Services</div>-->
<!--          <a href="#" class="menu-item" @click="showSection('fees')">-->
<!--            <span class="menu-icon">💳</span>-->
<!--            <span class="menu-label">Fee Management</span>-->
<!--          </a>-->
<!--          <a href="#" class="menu-item" @click="showSection('hostel')">-->
<!--            <span class="menu-icon">🏠</span>-->
<!--            <span class="menu-label">Hostel</span>-->
<!--          </a>-->
<!--          <a href="#" class="menu-item" @click="showSection('health')">-->
<!--            <span class="menu-icon">🏥</span>-->
<!--            <span class="menu-label">Health Records</span>-->
<!--          </a>-->
<!--          <a href="#" class="menu-item" @click="showSection('documents')">-->
<!--            <span class="menu-icon">📄</span>-->
<!--            <span class="menu-label">Documents</span>-->
<!--          </a>-->
<!--        </div>-->

<!--        <div class="menu-section">-->
<!--          <div class="menu-title">Communication</div>-->
<!--          <a href="#" class="menu-item" @click="showSection('announcements')">-->
<!--            <span class="menu-icon">📢</span>-->
<!--            <span class="menu-label">Announcements</span>-->
<!--          </a>-->
<!--          <a href="#" class="menu-item" @click="showSection('forums')">-->
<!--            <span class="menu-icon">💭</span>-->
<!--            <span class="menu-label">Forums</span>-->
<!--          </a>-->
<!--          <a href="#" class="menu-item" @click="showSection('support')">-->
<!--            <span class="menu-icon">🆘</span>-->
<!--            <span class="menu-label">Support</span>-->
<!--          </a>-->
<!--        </div>-->

<!--        <div class="menu-section">-->
<!--          <div class="menu-title">Settings</div>-->
<!--          <router-link to="/change-password" class="menu-item" @click="showSection('changepassword')">-->
<!--            <span class="menu-icon">@</span>-->
<!--            <span class="menu-label">Change Password</span>-->
<!--          </router-link>-->
<!--        </div>-->

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
import { mapGetters, mapActions } from 'vuex'
export default {
  name: "StudentLayout",
  data() {
    return {
      studentName: "Demo Student",
      isSidebarOpen: false,
      openMenu: null,
      collapsed: false
    };
  },
  computed: {
    ...mapGetters(["currentUser","userMenus"]),
    canShowSidebar() {
      let is_change_password = localStorage.getItem("is_change_password")
      return is_change_password === "Y"
    },
    menus() {
      return this.$store.getters.userMenus
    },
    user() {
      return this.$store.getters.currentUser;
    },
  },
  created() {
    this.fetchUserMenus()
    this.loadUser()
  },
  mounted() {
    //this.loadScript()
  },
  methods: {
    ...mapActions(['fetchUserMenus','loadUser']),
    toggleSidebar() {
      const sidebar = document.getElementById('sidebar');
      sidebar.classList.toggle('active');
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.setItem('is_change_password', '');
      this.$router.push({ name: 'Login' });
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
   },
    toggleDropdown(menuKey) {
      this.openMenu = this.openMenu === menuKey ? null : menuKey;
    },
},
}
</script>

<style scoped>
.menu-item {
  display: flex;
  align-items: center;
  padding: 8px;
  font-weight: 600;
  border-radius: 8px;
  transition: background 0.3s;
}

.submenu-item {
  display: block;
  padding: 8px 40px;
  border-radius: 6px;
  transition: background 0.3s;
}
.submenu-item:hover {
  background: #e5e7eb;
}

/* Simple fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

</style>
