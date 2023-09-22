<template>
  <div class="header">
    <RouterLink to="/">
      <img src="../assets/gs-logo.svg" class="md:w-[120px] w-[100px]" />
    </RouterLink>
    <div class="col"></div>
    <div class="profile" @click="displayProfileMenu" ref="profile">
      <div>
        <div class="text-lg font-semibold text-graybrown">Tan Yi Peng</div>
        <div class="text-xs text-graybrown">Investment Advisor</div>
      </div>
      <img src="../assets/pfp.png"/>
      <i class="bi bi-chevron-down transition" :class="{ 'chevDown': isActive }"></i>
    </div>
  </div>
  <ul class="dropdown" :class="{ 'active': isActive }" ref="dropdown">
    <li class="option">
      <i class="bi bi-person-circle pr-2"></i>
      My Profile
    </li>
    <li class="option">
      <i class="bi bi-briefcase-fill pr-2"></i>
      My Portfolios
    </li>
    <hr/>
    <li class="option">
      <i class="bi bi-box-arrow-right pr-2"></i>
      Log out
    </li>
  </ul>
</template>

<script>
export default {
  name: 'HeaderBlock',
  data() {
    return {
      isActive: false,
    }
  },
  mounted() {
    document.addEventListener('click', (event) => {
      if (this.$refs.profile && !this.$refs.profile.contains(event.target) && !this.$refs.dropdown.contains(event.target)) {
        this.isActive = false;
      }
    });
  },
  methods: {
    displayProfileMenu() {
      this.isActive = !this.isActive;
    }
  },
}
</script>

<style scoped>
  .header {
    @apply
    grid
    grid-rows-1
    grid-cols-[auto,1fr,auto]
    gap-3
    items-center
    bg-[#fff]
    py-7
    px-12
  }
  .profile {
    @apply
    grid
    grid-cols-[auto,auto,auto]
    gap-3
    items-center
    hover:bg-gray-50
    -m-5
    p-5
    rounded-lg
    cursor-pointer
    relative
  }
  .chevDown {
    @apply
    rotate-180
  }
  .dropdown {
    @apply
    absolute
    px-4
    md:top-[108.938px]
    top-[101px]
    right-0
    w-[265px]
    bg-white;
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.2s ease-in-out, padding 0.2s ease-in-out, border 0.2s ease-in-out;
  }
  .dropdown.active {
    max-height: 200px;
    @apply
    py-4
    border
    border-gray-200;
  }
  .option {
    @apply
    p-4
    hover:bg-gray-100
    cursor-pointer
    rounded-md
  }
</style>