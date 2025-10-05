<template>
  <div>
    <Navbar />
    <div class="about-us-page">
      <!--  HERO BANNER SECTION   -->
      <section class="hero-banner-container">  
        <img src="../assets/car-3.jpg" class="hero-image" alt="Parking lot banner">
      </section>     
      <!-- WHO WE ARE SECTION         -->
      <section class="who-we-are py-5">
        <div class="container">
          <div class="row align-items-center gy-4">
            <div class="col-lg-6">
              <img src="../assets/park-3.jpg" class="img-fluid rounded shadow" alt="Parking lot image showing our story">
            </div>
            <div class="col-lg-6">
              <h2 class="fw-bold mb-3">Who We Are</h2>
              <p class="text-muted">Our Vehicle Parking App started with a simple idea to solve the problem of parking in busy cities using technology. We are a dedicated team working to give you the best and easiest parking experience.</p>
              <ul class="list-unstyled mt-4">
                <li class="d-flex align-items-start mb-2">
                  <i class="bi bi-check-circle-fill text-primary me-2 mt-1"></i>
                  <span><strong>Reliability:</strong> A service that is always available and trustworthy.</span>
                </li>
                <li class="d-flex align-items-start mb-2">
                  <i class="bi bi-check-circle-fill text-primary me-2 mt-1"></i>
                  <span><strong>Innovation:</strong> Adding new features to make parking smarter.</span>
                </li>
                <li class="d-flex align-items-start">
                  <i class="bi bi-check-circle-fill text-primary me-2 mt-1"></i>
                  <span><strong>Customer First:</strong> Your convenience is our first priority.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <!--  WHAT WE OFFER SECTION  -->
      <section class="what-we-offer bg-light py-5">
        <div class="container">
          <div class="text-center mb-5">
            <h2 class="fw-bold">What We Offer</h2>
            <p class="text-muted">Our services are designed to make your parking experience better.</p>
          </div>
          <div class="row text-center">
            <!-- BOX 1 -->
            <div class="col-md-4 mb-4">
              <div class="card h-100 p-4 border-0 shadow-sm">
                <div class="feature-icon text-primary mb-3">
                  <i class="bi bi-search-heart fs-1"></i>
                </div>
                <h5 class="fw-bold">Easy Spot Finding</h5>
                <p class="text-muted">Search for available parking spots near you in real time.</p>
              </div>
            </div>
            <!-- BOX 2 -->
            <div class="col-md-4 mb-4">
              <div class="card h-100 p-4 border-0 shadow-sm">
                <div class="feature-icon text-primary mb-3">
                  <i class="bi bi-calendar-check fs-1"></i>
                </div>
                <h5 class="fw-bold">Pre-Booking</h5>
                <p class="text-muted">Reserve your parking spot before you go and stay stress free.</p>
              </div>
            </div>
            <!-- BOX 3 -->
            <div class="col-md-4 mb-4">
              <div class="card h-100 p-4 border-0 shadow-sm">
                <div class="feature-icon text-primary mb-3">
                  <i class="bi bi-credit-card fs-1"></i>
                </div>
                <h5 class="fw-bold">Secure Payments</h5>
                <p class="text-muted">Use our easy and safe online payment options.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!--  OUR GUIDING PRINCIPLES SECTION        -->
      
      <section class="our-mission-vision py-5">
        <div class="container">
          <div class="text-center mb-5">
            <h2 class="fw-bold">Our Guiding Principles</h2>
            <p class="text-muted">Our work is based on these core values.</p>
          </div>
          <div class="row gy-4 justify-content-center">
            <!-- OUR MISSION BOX -->
            <div class="col-lg-5 col-md-6">
              <div class="card text-center p-4 h-100 border-0 shadow-sm">
                <div class="mb-3">
                  <i class="bi bi-bullseye fs-2 text-primary"></i>
                </div>
                <h4 class="fw-bold">Our Mission</h4>
                <p class="text-muted mb-0">
                  Our mission is to make parking a smooth and positive experience. We want to build technology that not only saves your time but also helps in the development of smart cities.
                </p>
              </div>
            </div>
            <!-- OUR VISION BOX-->
            <div class="col-lg-5 col-md-6">
              <div class="card text-center p-4 h-100 border-0 shadow-sm">
                <div class="mb-3">
                  <i class="bi bi-binoculars-fill fs-2 text-info"></i>
                </div>
                <h4 class="fw-bold">Our Vision</h4>
                <p class="text-muted mb-0">
                  We see a future where parking is never a problem. Through technology, we want to make every journey easy and stress free.
                </p>
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
import Footer from '../components/Footer.vue';
import Navbar from '../components/Navbar.vue';

export default {
  name: 'AboutUsPage',
  components: {
    Navbar,
    Footer
  }
};
</script>

<style scoped>

.hero-banner-container {
  line-height: 0;  /* PREVENTS EXTRA SPACES BELOW THE IMAGE */
}
.hero-image {
  width: 100%;
  height: 40vh;
  min-height: 250px;
  object-fit: cover; /* ENSURES THE IMAGE COVERS THE AREA WITHOUT DISTORTION */
}


</style>