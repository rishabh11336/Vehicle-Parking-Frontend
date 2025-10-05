<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
    <div class="container">
      <router-link to="/" class="navbar-brand">
        <i class="bi bi-p-circle-fill me-2"></i>Vehicle Parking App
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navItems"
        aria-controls="navItems"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navItems">
        <ul v-if="isLoggedIn" class="navbar-nav ms-auto align-items-lg-center">
          <li class="nav-item">
            <router-link to="/" class="nav-link">Home</router-link>
          </li>
          
          <template v-if="userRole === 'user'">
            <li class="nav-item"><router-link to="/user/dashboard" class="nav-link">Dashboard</router-link></li>
            <li class="nav-item"><router-link to="/user/parking" class="nav-link">Parkings</router-link></li>
            <li class="nav-item"><router-link to="/user/search" class="nav-link">Search</router-link></li>
            <li class="nav-item"><router-link to="/user/summary" class="nav-link">Summary</router-link></li>
            <li class="nav-item"><router-link to="/user/about" class="nav-link">About</router-link></li>
          </template>

          <template v-else-if="userRole === 'admin'">
            <li class="nav-item"><router-link to="/admin/dashboard" class="nav-link">Admin Dashboard</router-link></li>
            <li class="nav-item"><router-link to="/user/parking" class="nav-link">Parkings</router-link></li>
            <li class="nav-item"><router-link to="/admin/users" class="nav-link">View Users</router-link></li>
            <li class="nav-item"><router-link to="/admin/summary" class="nav-link">Admin Summary</router-link></li>
          </template>
          
          <li class="nav-item ms-lg-3 mt-2 mt-lg-0">
            <button class="btn btn-outline-danger btn-sm" @click="logout">Logout</button>
          </li>
        </ul>

        <ul v-else class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link to="/" class="nav-link">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/login" class="nav-link">Login</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/signup" class="nav-link">Signup</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
  computed: {
    // --- Viva Explanation Point 3: Computed Properties for State ---
    // A computed property automatically updates when its dependencies change.
    // Here, we check localStorage to see if a token exists.
    isLoggedIn() {
      // If 'authToken' exists in localStorage, the user is logged in.
      return !!localStorage.getItem('authToken');
    },
    userRole() {
      // We get the user's role, which we saved during login.
      return localStorage.getItem('userRole');
    }
  },
  methods: {
    logout() {
      // --- Viva Explanation Point 4: Logout Logic ---
      // When the user logs out, we must remove the token and role
      // from localStorage and redirect them to the login page.
      console.log("User is logging out...");
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      
      // Redirect to the login page
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.navbar {
  padding-top: 1rem;
  padding-bottom: 1rem;
  position: relative;
}

.navbar-brand {
  font-weight: bold;
  font-size: 1.25rem;
}

.nav-link {
  font-weight: 500;
  transition: color 0.2s ease-in-out;
}

.nav-link.router-link-exact-active {
  color: #ffffff !important;
  font-weight: bold;
}

.btn-outline-danger {
    padding: 0.4rem 1rem;
}

@media (max-width: 991.98px) {
  .navbar-collapse {
    position: absolute;
    top: 100%; 
    left: 0;
    right: 0;
    z-index: 1000; 
    
    background-color: #212529; 
    padding: 1rem;
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
  .nav-item {
      text-align: center;
      margin-bottom: 0.5rem;
  }
  .nav-item:last-child {
      margin-bottom: 0;
  }
}
</style>
