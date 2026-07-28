<template>
  <div class="not-found d-flex align-items-center justify-content-center" style="min-height:80vh; text-align:center;">
    <div>
      <div style="font-size:120px; font-weight:700; color:#1e4356; opacity:0.8; line-height:1;">404</div>
      <h1 style="color:#1e4356;">Page Not Found</h1>
      <p class="text-muted">The page you're looking for doesn't exist or has been moved.</p>
      <RouterLink to="/" class="btn btn-success mt-3">
        <i class="bi bi-house me-2"></i>Back to Home
      </RouterLink>
    </div>
  </div>
</template>
