<template>
  <div class="footer">
    <div class="grid grid-cols-4 gap-y-10 gap-x-7 w-[190px]">
      <img src="../assets/gs-logo.svg" class="col-span-4 md:w-[160px] w-[140px]" />
      <img src="../assets/icons/instagram.svg" />
      <img src="../assets/icons/linkedin.svg" />
      <img src="../assets/icons/google.svg" />
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
    <div class="col-span-2 grid grid-cols-1 gap-y-10">
      <img src="../assets/gs-logo.svg" class="md:w-[160px] w-[140px] opacity-0" />
      <div class="text-xs text-graybrown justify-self-end">© 2023 IS442 G1T5</div>
    </div>
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
    grid-cols-5
    bg-[#f3f3f3]
    py-11
    px-12;
  }
</style>