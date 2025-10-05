<template>
  <div>
    <Navbar />

    <div class="container my-5">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <h2 class="fw-bold mb-4 text-center">Secure Payment</h2>
          <div class="card p-4 shadow-sm">
            <div class="row g-4">
              <!-- PAYMENT FORM    -->
              <div class="col-md-7">
                <h5 class="fw-semibold mb-3">Enter Card Details</h5>
                <form @submit.prevent="processPayment">
                  <div class="mb-3">
                    <label for="cardNumber" class="form-label">Card Number</label>
                    <div class="input-group">
                       <span class="input-group-text"><i class="bi bi-credit-card-2-front"></i></span>
                       <input type="text" class="form-control" id="cardNumber" placeholder="0000 0000 0000 0000" required>
                    </div>
                  </div>
                   <div class="mb-3">
                    <label for="cardName" class="form-label">Cardholder Name</label>
                    <input type="text" class="form-control" id="cardName" placeholder="e.g., Rohan Kumar" required>
                  </div>
                  <div class="row">
                    <div class="col-6 mb-3">
                       <label for="expiryDate" class="form-label">Expiry Date</label>
                       <input type="text" class="form-control" id="expiryDate" placeholder="MM / YY" required>
                    </div>
                     <div class="col-6 mb-3">
                       <label for="cvv" class="form-label">CVV</label>
                       <input type="text" class="form-control" id="cvv" placeholder="123" required>
                    </div>
                  </div>
                  <hr>
                  <div class="d-grid">
                     <button type="submit" class="btn btn-primary btn-lg" :disabled="isProcessing">
                        <span v-if="isProcessing" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                        <span v-else>Pay ₹{{ bookingDetails.totalCost.toFixed(2) }}</span>
                    </button>
                  </div>
                </form>
              </div>
              <!--  ORDER SUMMARY SECTION  -->
              <div class="col-md-5">
                <div class="bg-light p-3 rounded h-100">
                  <h5 class="fw-semibold mb-3">Order Summary</h5>
                  <div class="d-flex justify-content-between mb-2">
                    <span class="text-muted">Parking Lot:</span>
                    <strong>{{ bookingDetails.location }}</strong>
                  </div>
                  <div class="d-flex justify-content-between mb-2">
                    <span class="text-muted">Vehicle No:</span>
                    <strong>{{ bookingDetails.vehicleNumber }}</strong>
                  </div>
                   <div class="d-flex justify-content-between mb-3">
                    <span class="text-muted">Duration:</span>
                    <strong>{{ bookingDetails.duration }}</strong>
                  </div>
                  <hr>
                  <div class="d-flex justify-content-between fw-bold fs-5">
                    <span>Total Amount:</span>
                    <span class="text-primary">₹{{ bookingDetails.totalCost.toFixed(2) }}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SUCCESS POPUP -->
    <div class="modal fade" id="paymentSuccessModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered text-center">
            <div class="modal-content">
                <div class="modal-body p-4">
                    <i class="bi bi-check-circle-fill text-success display-1 mb-3"></i>
                    <h3 class="fw-bold">Payment Successful!</h3>
                    <p class="text-muted">Your parking spot has been confirmed. You can view the details in your dashboard.</p>
                    <button type="button" class="btn btn-primary mt-2" @click="goToDashboard">Go to Dashboard</button>
                </div>
            </div>
        </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
// SUCCESS POPUP IMPORT FROM BOOTSTRAP
import { Modal } from 'bootstrap';

export default {
  name: 'DummyPaymentPage',
  components: {
    Navbar,
    Footer
  },
  data() {
    return {
      isProcessing: false,
      successModal: null, 
      bookingDetails: {
        location: 'Airport T1 Parking',
        vehicleNumber: 'MH 12 XY 5678',
        duration: '3.0 Hours',
        totalCost: 240.00
      }
    };
  },
  mounted() {
    const modalEl = document.getElementById('paymentSuccessModal');
    if (modalEl) {
        this.successModal = new Modal(modalEl, {
            keyboard: false, 
            backdrop: 'static' 
        });
    }
  },
  methods: {
    processPayment() {
      this.isProcessing = true;
      console.log("Processing payment...");

      // USE TIMEOUT TO MIMIC THE DELAY OF A REAL PAYMENT PROCESS.
      setTimeout(() => {
        this.isProcessing = false;
        console.log("Payment successful!");

        // AFTER THE PAYMENT IS SUCCESSFUL, WE SHOW THE SUCCESS POPUP.
        if (this.successModal) {
            this.successModal.show();
        }

      }, 2500); // 2.5 SECOND DELAY
    },
    goToDashboard() {
        if (this.successModal) {
            this.successModal.hide();
        }
        this.$router.push('/user-profile');
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