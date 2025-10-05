<template>
  <div>
    <Navbar />

    <div class="container my-5">
      <div class="mb-4">
        <router-link to="/admin/dashboard" class="text-decoration-none text-primary fw-semibold">
          <i class="bi bi-arrow-left-circle me-2"></i>Back to Admin Dashboard
        </router-link>
      </div>

      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 text-muted">Fetching Lot Details...</p>
      </div>
      <div v-else-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>

      <div v-else>
        <section class="mb-5">
          <h2 class="fw-bold">{{ lotDetails.lot_name }}</h2>
          <p class="text-muted">{{ lotDetails.address }}</p>

          <div class="row gy-3 mt-3">
            <div class="col-md-3">
              <div class="card p-2 text-center shadow-sm">
                  <p class="text-muted mb-1 small">Total Spots</p>
                  <h5 class="fw-bold mb-0">{{ lotDetails.total_spots }}</h5>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card p-2 text-center shadow-sm">
                  <p class="text-muted mb-1 small">Available</p>
                  <h5 class="fw-bold mb-0 text-success">{{ availableSpots }}</h5>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card p-2 text-center shadow-sm">
                  <p class="text-muted mb-1 small">Occupied</p>
                  <h5 class="fw-bold mb-0 text-danger">{{ occupiedSpots }}</h5>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card p-2 text-center shadow-sm">
                  <p class="text-muted mb-1 small">Occupancy</p>
                  <h5 class="fw-bold mb-0 text-info">{{ occupancyPercentage }}%</h5>
              </div>
            </div>
          </div>
        </section>

        <section class="parking-spots-grid">
          <div class="card p-4">
              <h4 class="fw-semibold mb-3">Parking Spot Status</h4>
              <hr>
              <div v-if="!parkingSpots.length" class="alert alert-secondary">This parking lot has no spots to display.</div>
              <div v-else class="row g-3">
                  <div v-for="spot in parkingSpots" :key="spot.id" class="col-6 col-sm-4 col-md-3 col-lg-2">
                      <div
                          class="spot-box text-center p-3 rounded"
                          :class="{
                              'bg-success-subtle text-success-emphasis': spot.status === 'available',
                              'bg-danger-subtle text-danger-emphasis': spot.status === 'occupied'
                          }"
                          @click="showSpotDetails(spot)"
                      >
                          <strong class="spot-id">{{ spot.spot_number }}</strong>
                          <small class="d-block spot-status text-capitalize">{{ spot.status }}</small>
                      </div>
                  </div>
              </div>
          </div>
        </section>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000';

export default {
  name: 'LotDetailsPage',
  components: {
    Navbar,
    Footer
  },
  data() {
    return {
      isLoading: false,
      errorMessage: '',
      lotDetails: {}, // Will be filled by API
      parkingSpots: []  // Will be filled by API
    };
  },
  computed: {
    availableSpots() {
      if (!this.parkingSpots) return 0;
      return this.parkingSpots.filter(s => s.status === 'available').length;
    },
    occupiedSpots() {
      if (!this.parkingSpots) return 0;
      return this.parkingSpots.filter(s => s.status === 'occupied').length;
    },
    occupancyPercentage() {
        if (!this.lotDetails.total_spots) return 0;
        return ((this.occupiedSpots / this.lotDetails.total_spots) * 100).toFixed(0);
    }
  },
  methods: {
    getAuthHeaders() {
      const token = localStorage.getItem('authToken');
      return token ? { 'Authorization': `Bearer ${token}` } : {};
    },
    async fetchLotAndSpotDetails(lotId) {
        this.isLoading = true;
        this.errorMessage = '';
        try {
            const headers = this.getAuthHeaders();
            if (!headers.Authorization) {
                this.$router.push('/login');
                return;
            }

            // Create promises for both API calls
            const lotDetailsPromise = axios.get(`${API_BASE_URL}/admin/parking_lots/${lotId}`, { headers });
            const spotStatusPromise = axios.get(`${API_BASE_URL}/admin/all_spot/${lotId}`, { headers });

            // Wait for both promises to resolve
            const [lotResponse, spotResponse] = await Promise.all([lotDetailsPromise, spotStatusPromise]);

            // Assign the data from the responses
            this.lotDetails = lotResponse.data;
            this.parkingSpots = spotResponse.data;

        } catch (error) {
            console.error("Failed to fetch lot details:", error);
            this.errorMessage = error.response?.data?.msg || "An error occurred while loading lot details.";
        } finally {
            this.isLoading = false;
        }
    },
    showSpotDetails(spot) {
      if (spot.status === 'occupied') {
        // Corrected: Access Vehicle and User directly from the spot object
        const vehicle = spot.Vehicle || 'N/A';
        const user = spot.User || 'N/A';
        alert(`Spot: ${spot.spot_number}\nStatus: Occupied\nVehicle: ${vehicle}\nUser: ${user}`);
      } else {
        alert(`Spot: ${spot.spot_number}\nStatus: Available`);
      }
    }
  },
  created() {
    const lotId = this.$route.params.id;
    if (lotId) {
      this.fetchLotAndSpotDetails(lotId);
    } else {
      this.errorMessage = "No parking lot specified.";
    }
  }
};
</script>

<style scoped>
.card {
  border-radius: 0.75rem;
  border: 1px solid #e9ecef;
}
.spot-box {
    border: 1px solid;
    cursor: pointer;
    transition: transform 0.2s ease, filter 0.2s ease;
}
.spot-box:hover {
    transform: scale(1.05);
    filter: brightness(0.95);
}
.spot-id {
    font-size: 1.2rem;
}
.spot-status {
    font-size: 0.8rem;
}
</style>