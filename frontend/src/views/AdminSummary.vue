<template>
  <div>
    <!-- Navbar component for navigation -->
    <Navbar />

    <div class="container my-5">
      <!-- Back to Dashboard Link -->
      <div class="mb-4">
        <!-- Router link to navigate back to the admin dashboard -->
        <router-link to="/admin/dashboard" class="text-decoration-none text-primary fw-semibold">
          <i class="bi bi-arrow-left-circle me-2"></i>Back to Admin Dashboard
        </router-link>
      </div>

      <!-- Page Header Section -->
      <section class="text-center mb-5">
        <h2 class="fw-bold">Admin Analytics</h2>
        <p class="text-muted">An overview of parking lot occupancy and performance.</p>
      </section>

      <!-- Loading and Error States -->
      <!-- Display a loading spinner while data is being fetched -->
      <div v-if="loading" class="text-center my-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 text-muted">Fetching parking lot data...</p>
      </div>
      <!-- Display an error message if data fetching fails -->
      <div v-else-if="error" class="alert alert-danger text-center my-5" role="alert">
        {{ error }}
      </div>

      <!-- Visualization Charts Section -->
      <!-- Only display charts if data has been successfully loaded and there are no errors -->
      <section v-else class="charts-section">
        <div class="row g-4">
          <!-- Parking Lot Occupancy (Bar Chart) -->
          <div class="col-lg-7">
            <div class="card p-4 h-100">
              <h5 class="fw-semibold mb-3">Parking Lot Occupancy</h5>
              <!-- Canvas element for the bar chart -->
              <canvas id="lotOccupancyChart"></canvas>
            </div>
          </div>
          <!-- Overall Spot Status (Doughnut Chart) -->
          <div class="col-lg-5">
            <div class="card p-4 h-100">
              <h5 class="fw-semibold mb-3">Overall Spot Status</h5>
              <!-- Canvas element for the doughnut chart -->
              <canvas id="spotStatusChart"></canvas>
            </div>
          </div>
        </div>
      </section>

    </div>

    <!-- Footer component -->
    <Footer />
  </div>
</template>

<script>
// Import necessary components and libraries
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
import Chart from 'chart.js/auto'; // Import Chart.js for data visualization

export default {
  name: 'AdminSummaryPage',
  components: {
    Navbar,
    Footer
  },
  data() {
    return {
      // parkingLotsData will store the data fetched from the API
      parkingLotsData: [],
      loading: true,   // Boolean to indicate if data is currently being loaded
      error: null,     // Stores any error message encountered during data fetching

      // Chart.js instances to manage the charts
      lotOccupancyChartInstance: null,
      spotStatusChartInstance: null,
    };
  },
  async mounted() {
    // This lifecycle hook is called after the component has been mounted to the DOM.
    // It's a good place to fetch initial data.
    await this.fetchParkingLotsData(); // Wait for data to be fetched

    // Only create charts if data was successfully loaded and no error occurred
    if (this.parkingLotsData.length > 0 && !this.error) {
      this.createLotOccupancyChart();
      this.createSpotStatusChart();
    }
  },
  beforeUnmount() {
    // This lifecycle hook is called just before the component is unmounted from the DOM.
    // It's important to destroy chart instances to prevent memory leaks.
    if (this.lotOccupancyChartInstance) {
      this.lotOccupancyChartInstance.destroy();
    }
    if (this.spotStatusChartInstance) {
      this.spotStatusChartInstance.destroy();
    }
  },
  methods: {
    // Asynchronous method to fetch parking lot data from the backend API
    async fetchParkingLotsData() {
      this.loading = true; // Set loading to true to show spinner
      this.error = null;   // Clear any previous errors
      try {
        // Retrieve the authentication token from local storage.
        // IMPORTANT: Ensure 'authToken' is the correct key used by your authentication system.
        const token = localStorage.getItem('authToken');

        // Log the token to the console for debugging purposes.
        // This helps verify if the token is being retrieved correctly.
        console.log('AdminSummaryPage: Retrieved token from localStorage:', token);

        // If no token is found, set an error message and stop loading.
        if (!token) {
          this.error = 'Authentication token not found. Please log in.';
          this.loading = false;
          return; // Exit the function early
        }

        // Make an API call to the /admin/stats endpoint
        const response = await fetch('http://127.0.0.1:5000/admin/stats', {
          method: 'GET', // HTTP GET request
          headers: {
            'Content-Type': 'application/json', // Specify content type
            'Authorization': `Bearer ${token}`  // Attach the bearer token for authentication
          }
        });

        // Check if the HTTP response was successful (status code 2xx)
        if (!response.ok) {
          // If not successful, parse the error message from the response body
          const errorData = await response.json();
          // Throw an error with a descriptive message
          throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON data from the successful response
        const data = await response.json();
        this.parkingLotsData = data; // Assign the fetched data to our component's data property
      } catch (error) {
        // Catch any errors that occur during the fetch operation (e.g., network issues, server errors)
        console.error('Error fetching parking lot data:', error);
        this.error = `Failed to load data: ${error.message}. Please try again later.`;
      } finally {
        // This block executes regardless of success or failure.
        // Set loading to false to hide the spinner.
        this.loading = false;
      }
    },

    // Method to create and render the Bar Chart for Parking Lot Occupancy
    createLotOccupancyChart() {
      // Get the canvas element by its ID
      const ctx = document.getElementById('lotOccupancyChart');
      if (!ctx) return; // If canvas element is not found, exit

      // Destroy any existing chart instance on this canvas before creating a new one
      // This is crucial for preventing multiple chart instances and memory leaks on re-renders.
      if (this.lotOccupancyChartInstance) {
        this.lotOccupancyChartInstance.destroy();
      }

      // Create a new Chart.js instance
      this.lotOccupancyChartInstance = new Chart(ctx, {
        type: 'bar', // Bar chart type
        data: {
          // Labels for the x-axis (parking lot names)
          labels: this.parkingLotsData.map(lot => lot.name),
          datasets: [
            {
              label: 'Occupied Spots',
              data: this.parkingLotsData.map(lot => lot.occupied), // Data for occupied spots
              backgroundColor: 'rgba(255, 99, 132, 0.6)', // Red color for occupied
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1
            },
            {
              label: 'Available Spots',
              // Calculate available spots (total - occupied)
              data: this.parkingLotsData.map(lot => lot.totalSpots - lot.occupied),
              backgroundColor: 'rgba(75, 192, 192, 0.6)', // Green color for available
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,           // Chart will resize with its container
          maintainAspectRatio: false, // Allows the chart to take up the full height of its container
          scales: {
            x: { stacked: true },     // Stack bars on the x-axis
            y: { stacked: true, beginAtZero: true } // Stack bars on the y-axis, start from zero
          }
        }
      });
    },

    // Method to create and render the Doughnut Chart for Overall Spot Status
    createSpotStatusChart() {
      // Get the canvas element by its ID
      const ctx = document.getElementById('spotStatusChart');
      if (!ctx) return; // If canvas element is not found, exit

      // Destroy any existing chart instance on this canvas before creating a new one
      if (this.spotStatusChartInstance) {
        this.spotStatusChartInstance.destroy();
      }

      // Calculate total occupied and available spots across all parking lots
      const totalOccupied = this.parkingLotsData.reduce((sum, lot) => sum + lot.occupied, 0);
      const totalSpots = this.parkingLotsData.reduce((sum, lot) => sum + lot.totalSpots, 0);
      const totalAvailable = totalSpots - totalOccupied;

      // Create a new Chart.js instance
      this.spotStatusChartInstance = new Chart(ctx, {
        type: 'doughnut', // Doughnut chart type
        data: {
          labels: ['Occupied', 'Available'], // Labels for the doughnut segments
          datasets: [{
            label: 'Spot Status',
            data: [totalOccupied, totalAvailable], // Data for occupied and available
            backgroundColor: [
              'rgba(255, 99, 132, 0.7)', // Color for occupied
              'rgba(75, 192, 192, 0.7)'  // Color for available
            ],
            hoverOffset: 4 // Offset when hovering over a segment
          }]
        },
        options: {
          responsive: true,           // Chart will resize with its container
          maintainAspectRatio: false, // Allows the chart to take up the full height of its container
        }
      });
    }
  }
};
</script>

<style scoped>
/* Scoped styles for this component */
.card {
  border-radius: 0.75rem; /* Rounded corners for cards */
  border: 1px solid #e9ecef; /* Light border */
}

/* Ensure charts take full height of their container in a flex layout */
.charts-section .col-lg-7,
.charts-section .col-lg-5 {
  display: flex; /* Use flexbox for column layout */
}
.charts-section .card {
  flex-grow: 1; /* Allow cards to grow and fill available space */
}

/* --- MODIFICATIONS START HERE --- */

/* Target the canvas elements specifically within the card */
.card canvas {
  max-height: 400px; /* Adjust this value as needed. For example, 300px, 400px, or 500px */
  width: 100% !important; /* Ensure width is 100% of its parent, !important to override inline styles if any */
  height: auto !important; /* Maintain aspect ratio within max-height, !important for overriding */
}

/* --- MODIFICATIONS END HERE --- */
</style>
