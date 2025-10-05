<template>
  <footer class="app-footer bg-dark text-white pt-5 pb-4">
    <div class="container text-center text-md-start">
      <div class="row gy-4">
        <div class="col-lg-4 col-md-6">
          <h6 class="text-uppercase fw-bold mb-3">About Parking</h6>
          <p class="text-white-50 small-text">
            Suspendisse interdum, nisi nec efficitur auctor, odio congue ligula, se sodales tortor turpis at elit. Aliquam iaculis ipsum ut odio varius.
          </p>
        </div>
        <div class="col-lg-2 col-md-6">
          <h6 class="text-uppercase fw-bold mb-3">Services</h6>
          <ul class="list-unstyled footer-list">
            <li class="mb-2">
              <router-link to="/services/parking" class="footer-link">Parking</router-link>
            </li>
            <li class="mb-2">
              <router-link to="/services/self-parking" class="footer-link">Self Parking</router-link>
            </li>
            <li class="mb-2">
              <router-link to="/services/valet" class="footer-link">Valet Parking</router-link>
            </li>
          </ul>
        </div>
        <div class="col-lg-2 col-md-6">
          <h6 class="text-uppercase fw-bold mb-3">Quick Links</h6>
          <ul class="list-unstyled footer-list">
            <li class="mb-2">
              <router-link to="/" class="footer-link">Home</router-link>
            </li>
            <li class="mb-2">
              <router-link to="/user/dashboard" class="footer-link">Dashboard</router-link>
            </li>
            <li class="mb-2">
              <router-link to="/user/parking" class="footer-link">Parkings</router-link>
            </li>
            <li class="mb-2">
              <router-link to="/user/search" class="footer-link">Search</router-link>
            </li>
            <li class="mb-2">
              <router-link to="/user/summary" class="footer-link">Summary</router-link>
            </li>
            <li class="mb-2">
              <router-link to="/user/about" class="footer-link">About</router-link>
            </li>
          </ul>
        </div>
        <div class="col-lg-4 col-md-6">
          <h6 class="text-uppercase fw-bold mb-3">Contact Info</h6>
          <div class="text-white-50 small-text">
            <p class="mb-2">Street 238, 52 tempor Donec, Pune, MH 411001</p>
            <p class="mb-2">
              <span class="fw-bold text-white">Phone:</span> +01 23 456 7890
            </p>
            <p class="mb-2">
              <span class="fw-bold text-white">Email:</span> contact@vparking.com
            </p>
          </div>
        </div>
      </div>

      <hr class="my-4">
      <!-- BOTTOM SECTION FOR COPYRIGHT -->
      <div class="row align-items-center">
        <div class="col-md-12 text-center">
          <p class="small mb-0 text-white-50">&copy; {{ currentYear }} Vehicle Parking App. All Rights Reserved. Made with ❤️.</p>
        </div>
      </div>

    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  data() {
    return {
      currentYear: new Date().getFullYear()
    }
  }
};
</script>

<style scoped>
.app-footer {
  background-color: #1c1c1c; 
  font-family: Arial, sans-serif; 
}

.small-text {
  font-size: 0.9rem; 
  line-height: 1.6;
}

.footer-list .footer-link {
  color: #adb5bd; 
  text-decoration: none;
  transition: color 0.3s ease; 
  font-size: 0.9rem;
}

.footer-list .footer-link:hover,
.footer-list .footer-link:focus {
  color: #ffffff; 
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 4px;
}

.app-footer .contact-info p {
  margin-bottom: 0.5rem;
}
</style>
