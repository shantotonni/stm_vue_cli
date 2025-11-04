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
        <div v-for="menu in menus" :key="menu.id" class="menu-section">

          <!-- Menu with children -->
          <template v-if="menu.has_children">
            <div
                class="menu-item cursor-pointer"
                @click="toggleDropdown(menu.id)"
            >
              <span class="menu-icon"><i :class="menu.icon"></i></span>
              <span class="menu-label">{{ menu.title }}</span>
              <span class="ml-auto" :class="{ 'rotate-180': openMenu === menu.id }">▼</span>
            </div>

            <transition name="fade">
              <div v-if="openMenu === menu.id" class="pl-6 flex flex-col space-y-2 mt-2">
                <router-link v-for="child in menu.children" :key="child.id" :to="child.url" class="submenu-item" style="font-weight: bold;color: black;text-decoration: auto;}">
                  <i :class="child.icon"></i> {{ child.title }}
                </router-link>
              </div>
            </transition>
          </template>

          <!-- Menu without children -->
          <router-link v-else :to="menu.route" class="menu-item" :class="{ active: $route.path === menu.url }">
            <span class="menu-icon"><i :class="menu.icon"></i></span>
            <span class="menu-label">{{ menu.title }}</span>
          </router-link>
        </div>

        <!-- Logout -->
        <div class="menu-section">
          <a href="#" class="menu-item" @click="logout()">
            <span class="menu-icon"><i class="fas fa-sign-out-alt"></i></span>
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
  async created() {

    //await this.loadUser()
  },
  mounted() {
     setTimeout(()=>{
       this.fetchUserMenus()
     },1000)
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
