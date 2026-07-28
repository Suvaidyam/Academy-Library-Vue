<template>
  <div>
    <div class="page-title page-about">
      <div class="container position-relative">
        <h1 class="title-gradient">About IGGAARL</h1>
        <nav class="breadcrumbs">
          <ol></ol>
        </nav>
      </div>
    </div>

    <section id="about" class="section about">
      <div class="container">

        <div class="row g-4 align-items-start features-item">
          <div class="col-md-7 pt-3" data-aos="fade-up" data-aos-delay="200">
            <h2>About</h2>
            <p>Established in 2022, the Indo-German Global Academy for Agroecology Research and Learning
              (IGGAARL) is a collaborative initiative between the Government of Andhra Pradesh and the Government of
              Germany to advance agroecology research and learning. IGGAARL serves as a global hub for
              knowledge exchange, capacity building, and innovation in agroecology, with a focus on sustainable farming practices
              and climate resilience. IGGAARL is dedicated to advancing agroecological approaches
              that strengthen biodiversity conservation and climate resilience. By fostering collaboration among
              farmers, researchers, and policymakers, IGGAARL seeks to enable sustainable transformation in
              agriculture and support sustainable livelihoods.</p>
          </div>
          <div class="col-md-5" data-aos="zoom-out">
            <img src="/img/history.jpg" class="img-fluid" alt="About IGGAARL" />
          </div>
        </div>

        <div class="row g-4 align-items-start about-content section">
          <div class="row g-4 align-items-start">

            <div class="col-md-6">
              <div class="research-card p-3 vision-mission">
                <div class="row mb-2 justify-content-start">
                  <div class="col-md-2">
                    <i><img src="/img/vision.svg" alt="Vision Icon" /></i>
                  </div>
                  <h4 class="col-md-6 pt-3">Vision</h4>
                </div>
                <p>IGGAARL is envisioned to evolve as a global learning and knowledge hub for agroecology and Natural Farming.</p>
              </div>
            </div>

            <div class="col-md-6">
              <div class="research-card p-3 vision-mission">
                <div class="row mb-2 justify-content-start">
                  <div class="col-md-2">
                    <i><img src="/img/objective.svg" alt="Aim Icon" /></i>
                  </div>
                  <h4 class="col-md-8 pt-3">Aim &amp; Focus Areas</h4>
                </div>
                <p>The aim of IGGAARL is to establish itself as an economically self-reliant global centre of excellence, advancing a farmer-centric approach to agroecology, agriculture-based livelihoods, value chains, and related domains within Natural Farming systems.</p>

                <div class="read-more-content pt-0" :style="{ display: showMore ? 'block' : 'none' }">
                  <p>IGGAARL is being developed as a lighthouse centre and knowledge hub for agroecology, generating scientific evidence and promoting both traditional knowledge and innovative agroecological and Natural Farming practices. Its key focus areas include:</p>
                  <ol>
                    <li>Research, Development and Innovation</li>
                    <li>Academics, Learning and Education</li>
                    <li>Knowledge Management and Upscaling</li>
                  </ol>
                </div>

                <p class="read-more">
                  <a href="javascript:void(0);" class="readMore-text" @click="showMore = !showMore">
                    {{ showMore ? 'Read Less' : 'Read More' }}
                  </a>
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const showMore = ref(false)
</script>
