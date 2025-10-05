<template>
  <div>
    <Navbar />

    <div class="container my-5">
      <section class="page-header mb-5">
        <h2 class="fw-bold">Admin Dashboard</h2>
        <p class="text-muted">Manage parking lots, view stats, and oversee operations.</p>
      </section>
      
      <section class="key-stats-cards mb-5">
        <div class="row gy-4">
          <div class="col-md-3">
            <div class="card p-3 text-center h-100 shadow-sm">
              <div class="card-body">
                <i class="bi bi-p-circle-fill fs-2 text-primary mb-2"></i>
                <p class="text-muted mb-1">Total Lots</p>
                <h4 class="fw-bold">{{ parkingLots.length }}</h4>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card p-3 text-center h-100 shadow-sm">
              <div class="card-body">
                <i class="bi bi-car-front-fill fs-2 text-info mb-2"></i>
                <p class="text-muted mb-1">Total Spots</p>
                <h4 class="fw-bold">{{ totalSpots }}</h4>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card p-3 text-center h-100 shadow-sm">
              <div class="card-body">
                <i class="bi bi-cone-striped fs-2 text-danger mb-2"></i>
                <p class="text-muted mb-1">Occupied Spots</p>
                <h4 class="fw-bold">{{ occupiedSpots }}</h4>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card p-3 text-center h-100 shadow-sm">
              <div class="card-body">
                <i class="bi bi-wallet2 fs-2 text-success mb-2"></i>
                <p class="text-muted mb-1">Total Users</p>
                <h4 class="fw-bold">{{ totalUsers }}</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="manage-lots">
        <div class="card p-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="fw-semibold mb-0">Manage Parking Lots</h4>
            <button class="btn btn-primary" @click="goToManageLotPage(null)">
              <i class="bi bi-plus-circle me-2"></i>Add New Lot
            </button>
          </div>

          <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
          </div>
          <div v-else-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
          
          <div v-else class="table-responsive">
            <table class="table table-hover align-middle">
              <thead>
                <tr>
                  <th scope="col">Lot Name</th>
                  <th scope="col">Location</th>
                  <th scope="col">Total Spots</th>
                  <th scope="col">Price/Hour</th>
                  <th scope="col" class="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="lot in parkingLots" :key="lot.id">
                  <td><strong>{{ lot.name }}</strong></td>
                  <td>{{ lot.address }}</td>
                  <td>{{ lot.total_spots }}</td>
                  <td>₹{{ lot.price }}</td>
                  <td class="text-end">
                    <button class="btn btn-sm btn-outline-secondary me-2" @click="viewLotDetails(lot.id)">
                      <i class="bi bi-eye"></i> View
                    </button>
                    <button class="btn btn-sm btn-outline-primary me-2" @click="goToManageLotPage(lot.id)">
                      <i class="bi bi-pencil"></i> Update
                    </button>
                    <button class="btn btn-sm btn-outline-danger" @click="deleteLot(lot.id)">
                      <i class="bi bi-trash"></i> Delete
                    </button>
                  </td>
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
  name: 'AdminDashboard',
  components: {
    Navbar,
    Footer
  },
  data() {
    return {
      isLoading: false,
      errorMessage: '',
      totalUsers: 0, // Initialize to 0, will be fetched from the API
      parkingLots: []
    };
  },
  computed: {
    totalSpots() {
      // Calculates the total spots from all parking lots
      return this.parkingLots.reduce((total, lot) => total + lot.total_spots, 0);
    },
    occupiedSpots() {
      // Calculates occupied spots by subtracting available from total
      return this.parkingLots.reduce((total, lot) => total + (lot.total_spots - lot.available_spots), 0);
    }
  },
  methods: {
    // --- Viva Explanation Point 1: Fetching Data on Page Load ---
    // This method gets the list of all parking lots from the backend.
    async fetchParkingLots() {
      this.isLoading = true;
      this.errorMessage = '';
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          this.$router.push('/login');
          return;
        }

        const response = await axios.get('http://127.0.0.1:5000/parking_lots', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        // The API response keys match the frontend's expected keys, so we can directly assign it.
        this.parkingLots = response.data;

      } catch (error) {
        this.errorMessage = 'Failed to load parking lots.';
        console.error("Error fetching parking lots:", error);
      } finally {
        this.isLoading = false;
      }
    },

    // New method to fetch total users from the /admin/count_users API
    async fetchTotalUsers() {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          this.$router.push('/login');
          return;
        }

        const response = await axios.get('http://127.0.0.1:5000/admin/count_users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        // Assuming the Flask API returns {"count": <number_of_users>}
        this.totalUsers = response.data.count;

      } catch (error) {
        // Handle specific errors like unauthorized access if needed
        if (error.response && error.response.status === 401) {
          console.error("Unauthorized to fetch user count. Please ensure admin login.");
          // Optionally, redirect to login or show a specific message
        } else {
          console.error("Error fetching total users:", error);
        }
        this.totalUsers = 'N/A'; // Set to N/A or a default error value on failure
      }
    },
    
    // --- Viva Explanation Point 2: Navigating for Add/Edit ---
    // This single method handles both "Add New" and "Edit" actions.
    goToManageLotPage(lotId) {
      if (lotId) {
        // If a lotId is provided, it means we are editing.
        // We navigate to a route like /admin/update_lots/1
        this.$router.push(`/admin/update_lots/${lotId}`);
      } else {
        // If no lotId, it means we are adding a new lot.
        this.$router.push('/admin/add_lots');
      }
    },

    // --- Viva Explanation Point 3: Deleting a Lot ---
    // This method handles the deletion of a parking lot.
    async deleteLot(lotId) {
      // We ask for confirmation before deleting to prevent accidents.
      if (!window.confirm("Are you sure you want to delete this parking lot? This action cannot be undone.")) {
        return;
      }

      try {
        const token = localStorage.getItem('authToken');
        // We send a DELETE request to the specific endpoint for the lot.
        await axios.delete(`http://127.0.0.1:5000/admin/delete_lots/${lotId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        // After successful deletion, we refresh the list of parking lots
        // to show the updated list on the page.
        this.fetchParkingLots();

      } catch (error) {
        this.errorMessage = 'Failed to delete the parking lot.';
        console.error("Error deleting lot:", error);
      }
    },

    // This method navigates to the detailed view of a lot's spots
    viewLotDetails(lotId) {
        this.$router.push(`/admin/lot_details/${lotId}`);
    }
  },
  // The mounted() hook calls fetchParkingLots() and fetchTotalUsers() as soon as the page is loaded.
  mounted() {
    this.fetchParkingLots();
    this.fetchTotalUsers(); // Call the new method to get total users
  }
};
</script>

<style scoped>
.card {
  border-radius: 0.75rem;
  border: 1px solid #e9ecef;
}
.table {
    min-width: 800px; 
}
</style>