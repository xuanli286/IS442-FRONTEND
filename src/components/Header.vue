<template>
  <div class="header">
    <img src="../assets/gs-logo.svg" class="md:w-[120px] w-[100px]" />
    <div class="col"></div>
    <div>
      <div class="text-lg font-semibold text-graybrown">Tan Yi Peng</div>
      <div class="text-xs text-graybrown">Investment Advisor</div>
    </div>
    <img src="../assets/pfp.png"/>
    <img src="../assets/icons/chevron-down-s.svg"/>
  </div>
</template>

<script>
export default {
  name: 'HeaderBlock',
}
</script>

<style scoped>
  .header {
    @apply
    grid
    grid-rows-1
    grid-cols-[auto,1fr,auto,auto,auto]
    gap-3
    items-center
    bg-[#fff]
    py-7
    px-12
  }
</style>