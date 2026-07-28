<script setup>
import { ref } from 'vue'

const expandedLeaders = ref({})

function toggleReadMore(key) {
  expandedLeaders.value[key] = !expandedLeaders.value[key]
}

const leaders = [
  {
    key: 'cm',
    img: 'https://apcnf.in/wp-content/uploads/2024/06/CN.jpg',
    name: 'H.E. Mr. Nara Chandrababu Naidu',
    title: 'Chief Minister, Andhra Pradesh',
    shortBio: 'H.E. Mr. N. Chandrababu Naidu is a visionary leader and a transformative figure in Indian politics, with over four decades of public service. He is widely recognized for advancing reforms in technology, infrastructure, and governance, positioning Andhra Pradesh as a leading destination for investment and innovation.',
    fullBio: [
      'As Chief Minister, Mr. Naidu has leveraged technology to strengthen governance, improve decision-making, and enhance public service delivery. His initiatives in education have contributed to strengthening human capital development in the state.',
      'A strong advocate of rural development and inclusive growth, he has promoted women\'s empowerment and poverty reduction through community-based institutions such as self-help groups. His focus on agriculture, livelihoods, health, and employment has supported the socio-economic advancement of farmers and marginalized communities.',
      'His contributions have been widely recognized through several national and international honours, including IT Indian of the Millennium and Business Person of the Year by The Economic Times. Oracle\'s Profit magazine also listed him among the "Hidden Seven" global leaders driving transformational change through innovation.',
    ],
    colClass: 'col-lg-7 col-md-7',
    solo: true,
  },
  {
    key: 'atchannaidu',
    img: 'https://apcnf.in/wp-content/uploads/2024/07/KA-03.jpg',
    name: 'Sri. Kinjarapu Atchannaidu',
    title: 'Hon. Minister of Agriculture',
    shortBio: 'Sri. Kinjarapu Atchannaidu is a senior legislator, currently serving as the Minister for Agriculture, Cooperation, Marketing, and Animal Husbandry in the Government of Andhra Pradesh. He has played a key role in strengthening farmer-centric policies and agricultural governance in the state.',
    fullBio: [
      'Known for his focus on improving market linkages, institutional support systems, and welfare measures for farmers, he has contributed to enhancing agricultural productivity and resilience.',
      'Under his leadership, efforts have been directed towards promoting sustainable agricultural practices, improving access to inputs and credit, and strengthening value chains.',
    ],
    colClass: 'col-lg-5 col-md-5',
  },
  {
    key: 'rajasekhar',
    img: 'https://apcnf.in/wp-content/uploads/2026/05/rajasekhar.jpg',
    name: 'Sri. Budithi Rajasekhar, IAS',
    title: 'Special Chief Secretary to Government (Agriculture, Sericulture, Cooperation & Marketing)',
    shortBio: 'A Mechanical Engineering graduate from Andhra University, Sri Rajsekhar Budithi holds a Post Graduate Diploma in Management from IIM Ahmedabad and a Master\'s in Public Administration from Harvard Kennedy School. He joined the Indian Administrative Service in 1992, Andhra Pradesh Cadre, serving across rural development, tribal welfare, poverty alleviation, and governance reform.',
    fullBio: [
      'Notably, as Chief Executive Officer of the Society for Elimination of Rural Poverty, he was instrumental in providing leadership in organising 10 million rural poor women into 900,000 Self Help Groups, establishing the programme as the National Resource Organisation for the Government of India\'s flagship National Rural Livelihoods Mission.',
      'Before his current role, he has held several key portfolios, including Special Chief Secretary for Panchayat Raj & Rural Development and School Education, Principal Secretary for Agriculture & Marketing, Commissioner of Civil Supplies, and District Collector of Nellore and Anantapur districts.',
      'Currently serving as Special Chief Secretary for Agriculture & Cooperation and Animal Husbandry, Dairy Development & Fisheries (FAC), he continues to provide strategic leadership to strengthen agricultural systems and rural livelihoods across Andhra Pradesh.',
    ],
    colClass: 'col-lg-5 col-md-5',
  },
  {
    key: 'vijaykumar',
    img: 'https://apcnf.in/wp-content/uploads/2024/06/evc.png',
    name: 'Mr. Thallam Vijay Kumar, IAS (Retd.)',
    title: 'Executive Vice-Chairman',
    shortBio: 'As the Executive Vice Chairman of Rythu Sadhikara Samstha (RySS) and Advisor to the Government of Andhra Pradesh on Natural Farming, he brings over four decades of public service dedicated to rural development and community empowerment.',
    fullBio: [
      'A Physics (Honours) graduate with an MBA from the University of Delhi, he joined the Indian Administrative Service in 1983 and served extensively in tribal development, community mobilization, livelihood enhancement, and women\'s collectives.',
      'As Chief Executive Officer of the Society for Elimination of Rural Poverty (2000-2010), he supported the mobilization of 11.5 million rural women through self-help groups. He later served as the first Mission Director of the National Rural Livelihoods Mission (NRLM), contributing to the mobilization of over 100 million women across India.',
      'Since 2015, he has spearheaded the Andhra Pradesh Community Managed Natural Farming (APCNF) initiative, reaching over 1.8 million farmers. Under his leadership, APCNF received the 2024 Gulbenkian Prize for Humanity.',
    ],
    colClass: 'col-lg-5 col-md-5',
  },
  {
    key: 'ramarao',
    img: 'https://apcnf.in/wp-content/uploads/2024/06/CEO-Sir.jpeg',
    name: 'Mr. B. Rama Rao, IAS (Retd.)',
    title: 'Chief Executive Officer & Executive Director',
    shortBio: 'Mr. B. Rama Rao is a senior civil servant with an accomplished academic background and over 39 years of distinguished service in government.',
    fullBio: [
      'Throughout his career, he has worked with commitment and integrity to promote inclusive development and support the socio-economic advancement of vulnerable and marginalized communities.',
      'Known for his professionalism, transparency, and problem-solving approach, he has handled multiple administrative responsibilities with practical insight and a strong focus on public service outcomes. His leadership and contributions across sectors have earned him wide recognition and several awards for his service to society.',
    ],
    colClass: 'col-lg-5 col-md-5',
  },
  {
    key: 'muralidhar',
    img: '/img/team/team-4.jpg',
    name: 'Mr. G. Muralidhar',
    title: 'Senior Advisor',
    shortBio: 'Mr. G. Muralidhar is a distinguished alumnus of the Institute of Rural Management Anand (IRMA) and the National Institute of Technology (NIT), Warangal. A National Talent Scholar and Mathematical Olympian, he brings over four decades of experience in poverty reduction, social entrepreneurship, and participatory governance.',
    fullBio: [
      'He has played a key role in strengthening women\'s self-help group movements, designing livelihood strategies, and working with governments, civil society organizations, and development partners to support the socio-economic advancement of marginalized communities.',
      'He has held leadership positions in large-scale rural development initiatives, including serving as Chief Executive Officer of the Society for Elimination of Rural Poverty (SERP) and as Mission Director of the National Rural Livelihoods Mission (NRLM), contributing to the mobilization and strengthening of women\'s collectives at scale.',
      'He continues to provide strategic guidance on community-led development, livelihoods, and Natural Farming initiatives, supporting efforts to advance sustainable and inclusive rural transformation.',
    ],
    colClass: 'col-lg-5 col-md-5',
  },
  {
    key: 'raidu',
    img: '/img/team/team-6.jpg',
    name: 'Mr. D. V. Raidu, IAS (Retd.)',
    title: 'Advisor',
    shortBio: 'Mr. D. V. Raidu is a senior civil servant with expertise in soil science and extensive experience in the agriculture sector. He has over 17 years of experience in advancing Community Managed Natural Farming and agroecological approaches.',
    fullBio: [
      'His work focuses on strengthening women-led community-based organizations to support sustainable livelihoods, ecological agriculture, and climate resilience.',
      'A practicing Natural Farmer in Telangana, he manages an eight-acre food forest with diverse crops including oil palm, guava, and vegetables, demonstrating regenerative farming practices with a focus on certification and carbon outcomes. He currently serves as Advisor on Natural Farming science to Rythu Sadhikara Samstha (RySS) under the APCNF programme.',
    ],
    colClass: 'col-lg-5 col-md-5',
  },
  {
    key: 'varaprasad',
    img: '/img/team/team-5.jpg',
    name: 'Dr. K. S. Varaprasad',
    title: 'Director - Research, Rythu Sadhikara Samstha',
    shortBio: 'Dr. K. S. Varaprasad, former Director of ICAR-Indian Institute of Oilseeds Research, currently serves as Director (Research), RySS–IGGAARL. He also serves as Advisor on Biosecurity and Bio-resources to APAARI and Chair of the Working Group on Seed Systems.',
    fullBio: [
      'He completed his M.Sc. and Ph.D. from the Indian Agricultural Research Institute (IARI), New Delhi, and taught postgraduate students for six years. He later served for over two and a half decades as Head of the National Bureau of Plant Genetic Resources (NBPGR) Regional Station, Hyderabad, facilitating plant quarantine and genetic resource services for more than 50 public, private, and international institutions across the region.',
      'Dr. Varaprasad has authored over 126 research and review publications and has received several national and international recognitions for his contributions to agricultural science. His major honours include the UNDP–India Biodiversity Award and the Lifetime International Agricultural Research Award (2024).',
    ],
    colClass: 'col-lg-6 col-md-6',
  },
]
</script>

<template>
  <div>
    <section id="team" class="team section">
      <div class="container">
        <div class="row gap-5 d-flex justify-content-center">
          <!-- First leader (CM) - full width row -->
          <div
            :class="leaders[0].colClass + ' member'"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div class="member-img">
              <img :src="leaders[0].img" class="img-fluid rounded_leader" :alt="leaders[0].name" />
              <div class="social">
                <a href="#"><i class="bi bi-twitter-x"></i></a>
                <a href="#"><i class="bi bi-facebook"></i></a>
                <a href="#"><i class="bi bi-instagram"></i></a>
                <a href="#"><i class="bi bi-linkedin"></i></a>
              </div>
            </div>
            <div class="member-info text-center">
              <h4>{{ leaders[0].name }}</h4>
              <span>{{ leaders[0].title }}</span>
              <p>{{ leaders[0].shortBio }}</p>
              <div v-show="expandedLeaders[leaders[0].key]" class="read-more-content" data-aos="fade-up" data-aos-delay="200">
                <p v-for="(para, i) in leaders[0].fullBio" :key="i">{{ para }}</p>
              </div>
              <p class="read-more leaders-readmore">
                <a href="javascript:void(0);" class="readMore-text" @click="toggleReadMore(leaders[0].key)">
                  {{ expandedLeaders[leaders[0].key] ? 'Read Less' : 'Read More' }}
                </a>
              </p>
            </div>
          </div>

          <!-- Remaining leaders in pairs -->
          <div class="row gap-5 justify-content-center d-flex">
            <template v-for="leader in leaders.slice(1)" :key="leader.key">
              <div
                :class="leader.colClass + ' member'"
                data-aos="fade-up"
                data-aos-delay="100"
              >
                <div class="member-img">
                  <img :src="leader.img" class="img-fluid rounded_leader" :alt="leader.name" />
                  <div class="social">
                    <a href="#"><i class="bi bi-twitter-x"></i></a>
                    <a href="#"><i class="bi bi-facebook"></i></a>
                    <a href="#"><i class="bi bi-instagram"></i></a>
                    <a href="#"><i class="bi bi-linkedin"></i></a>
                  </div>
                </div>
                <div class="member-info text-center">
                  <h4>{{ leader.name }}</h4>
                  <span>{{ leader.title }}</span>
                  <p>{{ leader.shortBio }}</p>
                  <div v-show="expandedLeaders[leader.key]" class="read-more-content" data-aos="fade-up" data-aos-delay="200">
                    <p v-for="(para, i) in leader.fullBio" :key="i">{{ para }}</p>
                  </div>
                  <p class="read-more leaders-readmore">
                    <a href="javascript:void(0);" class="readMore-text" @click="toggleReadMore(leader.key)">
                      {{ expandedLeaders[leader.key] ? 'Read Less' : 'Read More' }}
                    </a>
                  </p>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
