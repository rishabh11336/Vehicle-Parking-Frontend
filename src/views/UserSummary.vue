<template>
  <div>
    <Navbar />

    <div class="container my-5">
      <section class="page-header text-center mb-5">
        <h2 class="fw-bold">Your Parking Summary</h2>
        <p class="text-muted">An overview of your recent parking activity and expenses.</p>
        <button class="btn btn-outline-primary mt-3" @click="downloadHistory" :disabled="exporting_csv">
          <span v-if="exporting_csv" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
          <i v-else class="bi bi-download me-2"></i>
          {{ exporting_csv ? 'Exporting...' : 'Download Full History' }}
        </button>
      </section>

      <section class="key-stats-cards mb-5">
        <div class="row gy-4">
          <div class="col-md-4">
            <div class="card p-3 text-center h-100 shadow-sm">
              <div class="card-body">
                <p class="text-muted mb-2">Total Spent (This Month)</p>
                <h3 class="fw-bold">₹{{ totalSpentThisMonth }}</h3>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card p-3 text-center h-100 shadow-sm">
              <div class="card-body">
                <p class="text-muted mb-2">Total Bookings (All Time)</p>
                <h3 class="fw-bold">{{ bookingHistory.length }}</h3>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card p-3 text-center h-100 shadow-sm">
              <div class="card-body">
                <p class="text-muted mb-2">Most Recent Booking</p>
                <h3 class="fw-bold">{{ mostRecentBookingLocation }}</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="charts-section">
        <div class="row g-4">
          <div class="col-lg-7">
            <div class="card p-4 h-100">
              <h5 class="fw-semibold mb-3">Monthly Spending</h5>
              <canvas id="monthlySpendingChart"></canvas>
            </div>
          </div>
          <div class="col-lg-5">
            <div class="card p-4 h-100">
              <h5 class="fw-semibold mb-3">Parking Lot Usage</h5>
              <canvas id="lotUsageChart"></canvas>
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
import Chart from 'chart.js/auto';

export default {
  name: 'UserReportsPage',
  components: {
    Navbar,
    Footer
  },
  data() {
    return {
      exporting_csv: false,
      bookingHistory: [], // Initialize as empty, data will be fetched and transformed
      monthlyChartInstance: null,
      lotUsageChartInstance: null,
    };
  },
  computed: {
    totalSpentThisMonth() {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      return this.bookingHistory
        .filter(booking => {
          // Ensure booking.date is a valid Date object before comparison
          const bookingDate = new Date(booking.date); 
          return !isNaN(bookingDate) && bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
        })
        .reduce((total, booking) => total + booking.amount, 0)
        .toFixed(2);
    },
    
    mostRecentBookingLocation() {
      if (this.bookingHistory.length === 0) return 'N/A';
      // Sort by booking date in descending order
      const sortedHistory = [...this.bookingHistory].sort((a, b) => new Date(b.date) - new Date(a.date));
      return sortedHistory[0].location;
    }
  },
  async mounted() {
    console.log('UserReportsPage mounted. Attempting to fetch user summary...');
    await this.fetchUserSummary(); // Fetch data when component is mounted
    console.log('fetchUserSummary completed. Proceeding with chart creation.');
    // Charts are now created/updated within fetchUserSummary after data transformation
  },
  beforeUnmount() {
    if (this.monthlyChartInstance) this.monthlyChartInstance.destroy();
    if (this.lotUsageChartInstance) this.lotUsageChartInstance.destroy();
  },
  methods: {
    async fetchUserSummary() {
      console.log('Entering fetchUserSummary method.');
      const token = localStorage.getItem('authToken'); // Get token from local storage
      console.log('Token retrieved from localStorage:', token ? 'Exists' : 'Does NOT exist'); // Log token presence

      if (!token) {
        console.error('Authentication token not found in local storage. API call aborted.');
        // Optionally redirect to login page or show an error
        return;
      }

      try {
        console.log('Token found. Attempting to fetch from http://127.0.0.1:5000/user_summary');
        const response = await fetch('http://127.0.0.1:5000/user_summary', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Fetch response received. Status:', response.status);

        if (!response.ok) {
          if (response.status === 401) {
            console.error('Unauthorized: Invalid or expired token. Please log in again.');
            // Clear token and redirect to login if necessary
            // localStorage.removeItem('authToken'); 
            // this.$router.push('/login'); 
          } else {
            console.error(`HTTP error! status: ${response.status}`, await response.text()); // Log full error text
          }
          this.bookingHistory = []; // Clear history on error
          return;
        }

        const data = await response.json();
        console.log('Raw data successfully fetched:', data);
        
        // --- TRANSFORM THE DATA HERE ---
        // Assuming 'data' from API is an array of booking objects
        this.bookingHistory = data.map(booking => ({
          id: booking.id,
          // Use booking_time or start_time for the date. booking_time seems more reliable for when it was recorded.
          date: booking.booking_time, 
          amount: booking.total_cost,
          // Concatenate lot_name and address for location, or just use lot_name
          location: booking.lot_info ? `${booking.lot_info.lot_name} (${booking.lot_info.address})` : 'Unknown Location',
          // Add any other properties you might need from the raw API response
          original_booking_data: booking // Keep the original data if needed elsewhere
        }));
        // --- END TRANSFORMATION ---

        console.log('Transformed bookingHistory:', this.bookingHistory);
        
        // Update charts after data is fetched and transformed
        this.updateCharts();

      } catch (error) {
        console.error('Network or parsing error during fetchUserSummary:', error);
        this.bookingHistory = []; // Clear history on network error
      }
    },

    updateCharts() {
      console.log('Updating charts with new data.');
      // Destroy existing chart instances before recreating to avoid memory leaks and rendering issues
      if (this.monthlyChartInstance) {
        this.monthlyChartInstance.destroy();
        this.monthlyChartInstance = null; // Clear reference
      }
      if (this.lotUsageChartInstance) {
        this.lotUsageChartInstance.destroy();
        this.lotUsageChartInstance = null; // Clear reference
      }
      this.createMonthlySpendingChart();
      this.createLotUsageChart();
    },

    createMonthlySpendingChart() {
      const ctx = document.getElementById('monthlySpendingChart');
      if (!ctx) {
        console.warn('monthlySpendingChart canvas element not found.');
        return;
      }
      console.log('Creating Monthly Spending Chart.');
      
      const spendingData = {
        'Jan': 0, 'Feb': 0, 'Mar': 0, 'Apr': 0, 'May': 0, 'Jun': 0, 
        'Jul': 0, 'Aug': 0, 'Sep': 0, 'Oct': 0, 'Nov': 0, 'Dec': 0
      };
      
      this.bookingHistory.forEach(booking => {
        const bookingDate = new Date(booking.date);
        // Check if bookingDate is valid
        if (!isNaN(bookingDate)) {
            const monthName = bookingDate.toLocaleString('default', { month: 'short' });
            // Aggregate for the current year. If you need multi-year data, adjust this logic.
            if (bookingDate.getFullYear() === new Date().getFullYear()) {
                spendingData[monthName] += booking.amount;
            }
        }
      });

      this.monthlyChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(spendingData),
          datasets: [{
            label: 'Total Spending (₹)',
            data: Object.values(spendingData),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: { y: { beginAtZero: true } }
        }
      });
    },

    createLotUsageChart() {
      const ctx = document.getElementById('lotUsageChart');
      if (!ctx) {
        console.warn('lotUsageChart canvas element not found.');
        return;
      }
      console.log('Creating Parking Lot Usage Chart.');

      const lotUsageData = this.bookingHistory.reduce((acc, booking) => {
        // Ensure booking.location exists before using it as a key
        if (booking.location) {
            acc[booking.location] = (acc[booking.location] || 0) + 1;
        }
        return acc;
      }, {});
      
      this.lotUsageChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(lotUsageData),
          datasets: [{
            label: 'Bookings',
            data: Object.values(lotUsageData),
            backgroundColor: [
              'rgba(255, 99, 132, 0.7)',
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(75, 192, 192, 0.7)',
              'rgba(153, 102, 255, 0.7)',
              'rgba(255, 159, 64, 0.7)'
            ],
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true
        }
      });
    },
    // DOWNLOAD BOOKING HISTORT AS CSV
    downloadHistory() {
      this.exporting_csv = true;
      console.log("Triggering CSV export...");

      setTimeout(() => {
        const headers = "Booking ID,Location,Date,Amount (INR)\n";
        const rows = this.bookingHistory.map(b => 
            // Ensure data is robust for CSV export
            `${b.id || ''},"${b.location || 'N/A'}","${new Date(b.date).toLocaleString() || 'N/A'}",${b.amount || 0}`
        ).join("\n");
        const csvContent = headers + rows;

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "full_booking_history.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.exporting_csv = false;
        console.log("CSV file generation complete.");
      }, 1000); 
    }
  }
};
</script>

<style scoped>
.card {
  border-radius: 0.75rem;
  border: 1px solid #e9ecef;
}

</style>