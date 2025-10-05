<template>
  <div>
    <Navbar />

    <div class="container my-5">
      <!-- PAGE HEADER & SEARCH BAR -->
      <section class="text-center mb-5">
        <h2 class="fw-bold">Find Your Perfect Parking Spot</h2>
        <p class="text-muted">Search for parking lots by name or location.</p>
        <div class="row mt-4">
          <div class="col-md-8 mx-auto">
            <div class="input-group">
              <span class="input-group-text bg-light border-0"><i class="bi bi-search"></i></span>
              <input 
                type="text" 
                class="form-control form-control-lg border-0" 
                placeholder="E.g., Airport, Station, or City Center"
                v-model="searchQuery"
              >
            </div>
          </div>
        </div>
      </section>
      
      <!-- PARKING LOTS LIST -->
      <section class="parking-lots-list">
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>

        <!-- Error State -->
        <div v-else-if="errorMessage" class="alert alert-danger text-center">
            {{ errorMessage }}
        </div>

        <!-- Data Display -->
        <div v-else class="row gy-4">
          <div v-if="filteredLots.length === 0" class="col-12 text-center py-5">
            <p class="text-muted fs-5">Sorry, no parking lots found.</p>
          </div>
          <div v-for="lot in filteredLots" :key="lot.id" class="col-lg-4 col-md-6">
            <div class="card h-100 parking-lot-card">
              <!-- Using a placeholder image for now -->
              <img :src="lot.image_url" class="card-img-top" :alt="'Image of ' + lot.name">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title fw-bold">{{ lot.name }}</h5>
                <p class="card-text text-muted small flex-grow-1"><i class="bi bi-geo-alt-fill me-1"></i>{{ lot.address }}</p>
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <!-- Using 'price' from the API response -->
                  <span class="fw-bold fs-5 text-primary">₹{{ lot.price }}/hr</span>
                  <!-- Using 'available_spots' from the API response -->
                  <span 
                    :class="lot.available_spots > 0 ? 'text-success' : 'text-danger'"
                    class="fw-semibold"
                  >
                    {{ lot.available_spots > 0 ? `${lot.available_spots} spots available` : 'Full' }}
                  </span>
                </div>
                <button 
                  class="btn btn-primary w-100 mt-auto" 
                  :disabled="lot.available_spots === 0"
                  @click="goToBookingPage(lot.id)"
                >
                  Book Now
                </button>
              </div>
            </div>
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
// Import axios to make API calls
import axios from 'axios';

export default {
  name: 'ParkingLotsPage',
  components: {
    Navbar,
    Footer
  },
  data() {
    return {
      searchQuery: '',
      // The parkingLots array will now be filled with data from the API
      parkingLots: [],
      // These properties help manage the UI during the API call
      isLoading: false,
      errorMessage: ''
    };
  },
  computed: {
    filteredLots() {
      if (!this.searchQuery) {
        return this.parkingLots;
      }
      const lowerCaseQuery = this.searchQuery.toLowerCase();
      return this.parkingLots.filter(lot => 
        lot.name.toLowerCase().includes(lowerCaseQuery) ||
        lot.address.toLowerCase().includes(lowerCaseQuery)
      );
    }
  },
  methods: {
    // --- Viva Explanation Point 1: Fetching Data from API ---
    // This method is responsible for getting the list of parking lots
    // from your Flask backend.
    async fetchParkingLots() {
      this.isLoading = true;
      this.errorMessage = '';
      try {
        // Get the auth token from localStorage
        const token = localStorage.getItem('authToken');
        // We use axios.get to send a GET request to the /parking_lots endpoint with Authorization header.
        const response = await axios.get('http://127.0.0.1:5000/parking_lots', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        // If the request is successful, we store the data from the response
        // in our component's parkingLots array.
        this.parkingLots = response.data;
      } catch (error) {
        // If there's an error (e.g., network issue or server error),
        // we catch it and set an error message to show the user.
        this.errorMessage = 'Failed to load parking lots. Please try again later.';
        console.error("Error fetching parking lots:", error);
      } finally {
        // This block runs no matter what, and we use it to hide the loading spinner.
        this.isLoading = false;
      }
    },
    // --- Viva Explanation Point 2: Navigating with Parameters ---
    // This method is called when a user clicks the "Book Now" button.
    // It takes the ID of the selected lot as an argument.
    goToBookingPage(lotId) {
      // We use Vue Router to navigate to the booking page.
      // We pass the lot's ID in the URL, so the booking page knows
      // which lot the user wants to book.
      this.$router.push(`/user/booking/${lotId}`);
    }
  },
  // --- Viva Explanation Point 3: Using the mounted() Hook ---
  // The mounted() hook is a special function in Vue that runs automatically
  // as soon as the component is loaded onto the page. This is the perfect
  // place to call our fetchParkingLots() method to get the initial data.
  mounted() {
    this.fetchParkingLots();
  }
};
</script>

<style scoped>
.parking-lot-card {
  border: 1px solid #e9ecef;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-radius: 0.75rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.parking-lot-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.card-img-top {
  height: 200px;
  object-fit: cover;
}

.input-group .form-control {
  box-shadow: none;
}
.input-group .form-control:focus {
  border-color: #dee2e6;
}
</style>