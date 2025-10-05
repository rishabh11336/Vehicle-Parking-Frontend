<template>
  <div>
    <Navbar />

    <div class="container my-5">
      <!-- Back to Dashboard Link -->
      <div class="mb-4">
        <router-link to="/admin/dashboard" class="text-decoration-none text-primary fw-semibold">
          <i class="bi bi-arrow-left-circle me-2"></i>Back to Admin Dashboard
        </router-link>
      </div>
      
      <!-- USERS LIST TABLE -->
      <section class="users-list">
        <div class="card p-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="fw-semibold mb-0">Registered Users</h4>
            <span v-if="!isLoading" class="badge bg-primary rounded-pill">{{ users.length }} Users Found</span>
          </div>

          <!-- Loading and Error States -->
          <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
          </div>
          <div v-else-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

          <div v-else class="table-responsive">
            <table class="table table-hover align-middle">
              <thead>
                <tr>
                  <th scope="col">User ID</th>
                  <th scope="col">Full Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Address</th>
                  <th scope="col">Pin Code</th>
                  <th scope="col">Registered On</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>#{{ user.id }}</td>
                  <td><strong>{{ user.full_name }}</strong></td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.phone || 'N/A' }}</td>
                  <td>{{ user.address || 'N/A' }}</td>
                  <td>{{ user.pin_code || 'N/A' }}</td>
                  <td>{{ formatDate(user.created_at) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

    </div>

    <Footer />
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import axios from 'axios';

export default {
  name: 'ViewUsersPage',
  components: {
    Navbar,
    Footer
  },
  data() {
    return {
      users: [],
      isLoading: false,
      errorMessage: ''
    };
  },
  methods: {
    async fetchUsers() {
      this.isLoading = true;
      this.errorMessage = '';
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          this.$router.push('/login');
          return;
        }

        const response = await axios.get('http://127.0.0.1:5000/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        this.users = response.data;

      } catch (error) {
        this.errorMessage = 'Failed to load user data. Please ensure you are logged in as an admin.';
        console.error("Error fetching users:", error);
      } finally {
        this.isLoading = false;
      }
    },
    formatDate(isoString) {
        if (!isoString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(isoString).toLocaleDateString(undefined, options);
    }
  },
  created() {
    this.fetchUsers();
  }
};
</script>

<style scoped>
.card {
  border-radius: 0.75rem;
  border: 1px solid #e9ecef;
}
.table {
    min-width: 1000px;
}
</style>
