<template>
  <div class="footer">
    <div class="grid grid-cols-4 md:gap-y-10 gap-x-5 md:w-[160px] w-[190px] text-2xl">
      <img src="../assets/gs-logo.svg" class="col-span-4 md:w-[150px] w-[140px]" />
      <a href="https://www.linkedin.com/company/goldman-sachs/" target="_blank">
        <i class="bi bi-linkedin hidden md:block socials"></i>
      </a>
      <a href="https://www.instagram.com/goldmansachs/" target="_blank">
        <i class="bi bi-instagram hidden md:block socials"></i>
      </a>
      <a href="https://twitter.com/goldmansachs" target="_blank">
        <i class="bi bi-twitter hidden md:block socials"></i>
      </a>
      <a href="https://www.youtube.com/user/GoldmanSachs" target="_blank">
        <i class="bi bi-youtube hidden md:block socials"></i>
      </a>
    </div>
    <div class="text-sm">
      <div class="font-bold">USEFUL LINKS</div>
      <div>Pricing</div>
      <div>New to Investing?</div>
      <div>Legal Disclaimer</div>
      <div>Client Agreement</div>
      <div>Licensing and Regulations</div>
    </div>
    <div class="text-sm">
      <div class="font-bold">ABOUT</div>
      <div>Company Profile</div>
      <div>FAQ</div>
      <div>Contact Us</div>
    </div>
    <div class="hidden md:grid lg:col-span-2 grid-cols-1 gap-y-10">
      <img src="../assets/gs-logo.svg" class="md:w-[160px] w-[140px] opacity-0" />
      <div class="text-xs text-graybrown justify-self-end">© 2023 IS442 G1T5</div>
    </div>
    <div class="flex w-[170px] gap-4 md:hidden text-3xl">
      <a href="https://www.linkedin.com/company/goldman-sachs/" target="_blank">
        <i class="bi bi-linkedin socials"></i>
      </a>
      <a href="https://www.instagram.com/goldmansachs/" target="_blank">
        <i class="bi bi-instagram socials"></i>
      </a>
      <a href="https://twitter.com/goldmansachs" target="_blank">
        <i class="bi bi-twitter socials"></i>
      </a>
      <a href="https://www.youtube.com/user/GoldmanSachs" target="_blank">
        <i class="bi bi-youtube socials"></i>
      </a>
    </div>
    <div class="text-xs text-graybrown md:hidden">© 2023 IS442 G1T5</div>
  </div>
</template>

<script>
export default {
  name: 'FooterBlock',
}
</script>

<style scoped>
  .footer {
    @apply
    grid
    lg:grid-cols-5
    md:grid-cols-[1fr,1fr,1fr,auto]
    bg-[#f3f3f3]
    py-11
    px-12
    md:gap-y-0
    gap-y-12
  }
  .socials {
    @apply
    hover:opacity-50
  }
</style>