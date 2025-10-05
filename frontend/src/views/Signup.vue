<template>
  <div>
    <Navbar />
    <div class="d-flex align-items-center justify-content-center py-5 bg-light">
      <div class="card p-4 shadow-sm" style="width: 450px;">
        <h3 class="text-center fw-bold mb-4">Create Your Account</h3>
        
        <form @submit.prevent="registerUser">
          <!-- Full Name -->
          <div class="mb-3">
            <label for="fullName" class="form-label">Full Name</label>
            <input type="text" id="fullName" v-model="form.fullName" class="form-control" required />
          </div>

          <!-- Email -->
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" id="email" v-model="form.email" class="form-control" required />
          </div>

          <!-- Phone Number -->
          <div class="mb-3">
            <label for="phone" class="form-label">Phone Number</label>
            <input type="tel" id="phone" v-model="form.phone" class="form-control" required />
          </div>

          <!-- Address -->
          <div class="mb-3">
            <label for="address" class="form-label">Address</label>
            <textarea id="address" v-model="form.address" class="form-control" rows="2" required></textarea>
          </div>

          <!-- Pin Code -->
          <div class="mb-3">
            <label for="pinCode" class="form-label">Pin Code</label>
            <input type="text" id="pinCode" v-model="form.pinCode" class="form-control" required />
          </div>

          <!-- Password -->
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input type="password" id="password" v-model="form.password" class="form-control" required />
          </div>

          <!-- Error Message Display -->
          <div v-if="errorMessage" class="alert alert-danger small p-2">
            {{ errorMessage }}
          </div>

          <!-- Submit Button -->
          <div class="d-grid mt-4">
            <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
              <span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
              <span v-else>Register</span>
            </button>
          </div>
        </form>
        <p class="text-center mt-3 mb-0">
          Already have an account? <router-link to="/login">Login here</router-link>
        </p>
      </div>
    </div>

    <!-- ============================================= -->
    <!-- SUCCESS MODAL (Popup)                       -->
    <!-- ============================================= -->
    <div class="modal fade" id="registerSuccessModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered text-center">
            <div class="modal-content">
                <div class="modal-body p-4">
                    <button type="button" class="btn-close position-absolute top-0 end-0 m-3" data-bs-dismiss="modal" aria-label="Close"></button>
                    <i class="bi bi-check-circle-fill text-success display-1 mb-3"></i>
                    <h3 class="fw-bold">Registration Successful!</h3>
                    <p class="text-muted">Your account has been created. Please proceed to login.</p>
                    <button type="button" class="btn btn-primary mt-2" @click="goToLogin">Go to Login</button>
                </div>
            </div>
        </div>
    </div>

  </div>
</template>

<script>
// Make sure you have axios and bootstrap installed: 
// npm install axios bootstrap
import Navbar from '../components/Navbar.vue';
import axios from 'axios';
import { Modal } from 'bootstrap';

export default {
  name: "RegisterPage",
  components: {
    Navbar
  },
  data() {
    return {
      form: {
        fullName: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        pinCode: ""
      },
      isLoading: false,
      errorMessage: "",
      successModal: null, // To hold the Bootstrap Modal instance
    };
  },
  mounted() {
    // Initialize the Bootstrap Modal when the component is ready
    const modalEl = document.getElementById('registerSuccessModal');
    if (modalEl) {
        this.successModal = new Modal(modalEl);
    }
  },
  methods: {
    async registerUser() {
      this.isLoading = true;
      this.errorMessage = "";

      try {
        const payload = {
          full_name: this.form.fullName,
          email: this.form.email,
          password: this.form.password,
          phone: this.form.phone,
          address: this.form.address,
          pin_code: this.form.pinCode,
          role: "user"
        };

        const response = await axios.post("http://127.0.0.1:5000/register", payload);

        if (response.status === 201) {
            console.log("Registration successful:", response.data.message);
            // Instead of redirecting, show the success modal
            if (this.successModal) {
                this.successModal.show();
            }
        }

      } catch (err) {
        if (err.response && err.response.data) {
          this.errorMessage = err.response.data.error || "Registration failed. Please try again.";
        } else {
          this.errorMessage = "An unknown error occurred.";
        }
        console.error("Registration failed:", err);
      } finally {
        this.isLoading = false;
      }
    },
    goToLogin() {
        // This function hides the modal and then redirects to the login page
        if (this.successModal) {
            this.successModal.hide();
        }
        this.$router.push("/login");
    }
  },
};
</script>

<style scoped>
.card {
  border: none;
  border-radius: 0.75rem;
}
</style>
