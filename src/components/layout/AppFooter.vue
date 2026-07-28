<template>
  <footer id="footer" class="footer dark-background">
    <div class="container footer-top">
      <div class="row gy-4">
        <!-- About Column -->
        <div class="col-lg-4 col-md-6 footer-about">
          <a href="/" class="d-flex align-items-center">
            <span class="sitename">Academy</span>
          </a>
          <div class="footer-contact pt-3">
            <p>
              Indo-German Global Academy for Agroecology Research and Learning (IGGAARL),
            </p>
            <div class="d-flex align-items-start">
              <i class="bi bi-geo-alt pr-2"></i>
              <div>
                Block 3A, 1st floor, Administrative Building, <br />APCARL Campus,
                Pulivendula YSR Kadapa,<br />Andhra Pradesh - 516390 - INDIA
              </div>
            </div>
            <p class="mt-2"><i class="bi bi-envelope pr-2"></i>iggaarl@ryss.ap.gov.in</p>
          </div>
        </div>

        <!-- Donors & Research Partners -->
        <div class="col-lg-3 col-md-3 footer-links">
          <h4>Donors</h4>
          <ul>
            <li>
              <i class="bi bi-chevron-right"></i>
              <a href="https://www.kfw-entwicklungsbank.de/International-financing/KfW-Entwicklungsbank/" target="_blank">KfW Development Bank</a>
            </li>
          </ul>
          <h4 class="pt-3 pb-0">Research Partners</h4>
          <ul>
            <li><i class="bi bi-chevron-right"></i><a href="https://icar.org.in/" target="_blank">ICAR</a></li>
            <li><i class="bi bi-chevron-right"></i><a href="https://www.wur.nl/en.htm" target="_blank">Wageningen University &amp; Research</a></li>
            <li><i class="bi bi-chevron-right"></i><a href="https://www.reading.ac.uk/" target="_blank">University of Reading</a></li>
            <li><i class="bi bi-chevron-right"></i><a href="https://www.pik-potsdam.de/en/home" target="_blank">Potsdam Institute for Climate Impact Research</a></li>
          </ul>
        </div>

        <!-- Important Links -->
        <div class="col-lg-3 col-md-3 footer-links">
          <h4>Important Links</h4>
          <ul>
            <li><i class="bi bi-chevron-right"></i><a href="https://apcnf.in/" target="_blank">APCNF</a></li>
            <li><i class="bi bi-chevron-right"></i><a href="https://www.apagrisnet.gov.in/" target="_blank">Department Of Agriculture, AP</a></li>
            <li><i class="bi bi-chevron-right"></i><a href="https://naturalfarming.dac.gov.in/" target="_blank">NMNF</a></li>
          </ul>
          <h4 class="pt-3 pb-0">Quick Links</h4>
          <ul>
            <li><i class="bi bi-chevron-right"></i><a href="#">RTI</a></li>
            <li><i class="bi bi-chevron-right"></i><RouterLink to="/webinar">Webinar</RouterLink></li>
          </ul>
        </div>

        <!-- Social Media -->
        <div class="col-lg-2 col-md-12">
          <h4>Follow Us</h4>
          <p>Join the conversation.</p>
          <div class="social-links d-flex">
            <a href="https://x.com/iggaarl" target="_blank"><i class="bi bi-twitter-x"></i></a>
            <a href="https://www.instagram.com/iggaarl" target="_blank"><i class="bi bi-instagram"></i></a>
            <a href="https://linkedin.com/company/iggaarl" target="_blank"><i class="bi bi-linkedin"></i></a>
          </div>
        </div>
      </div>
    </div>

    <div class="container copyright mt-4 d-md-flex d-sm-flex justify-content-between">
      <p>&copy; Copyright <strong class="px-1 sitename">IGGAARL</strong> All Rights Reserved</p>
      <div class="footer-links">
        <RouterLink to="/disclaimers">Disclaimers</RouterLink>
        <RouterLink to="/terms-conditions">Terms and Conditions</RouterLink>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
