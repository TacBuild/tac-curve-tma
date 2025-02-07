<script setup lang="ts">
const { status } = defineProps<{ status?: 'success' | 'error' | 'pending' }>()
</script>

<template>
  <svg
    v-if="status === 'success'"
    width="19"
    height="18"
    viewBox="0 0 19 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_1_17)">
      <path
        d="M18.2461 9C18.2461 13.6944 14.4405 17.5 9.74609 17.5C5.05167 17.5 1.24609 13.6944 1.24609 9C1.24609 4.30558 5.05167 0.5 9.74609 0.5C14.4405 0.5 18.2461 4.30558 18.2461 9Z"
        fill="#39B93A"
        stroke="#39B93A"
      />
      <path
        d="M5.96875 8.96919L8.56012 11.5605L13.7096 6.56055"
        stroke="white"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_17">
        <rect
          width="19"
          height="18"
          fill="white"
        />
      </clipPath>
    </defs>
  </svg>

  <svg
    v-else-if="status === 'error'"
    width="19"
    height="18"
    viewBox="0 0 19 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_1_2)">
      <path
        d="M17.8699 9C17.8699 13.5287 14.1987 17.2 9.66992 17.2C5.14119 17.2 1.46992 13.5287 1.46992 9C1.46992 4.47126 5.14119 0.8 9.66992 0.8C14.1987 0.8 17.8699 4.47126 17.8699 9Z"
        stroke="#D10000"
        stroke-width="1.6"
      />
      <path
        d="M7.09473 11.5L12.2442 6.5"
        stroke="#D10000"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M12.2441 11.5L7.09465 6.5"
        stroke="#D10000"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_2">
        <rect
          width="19"
          height="18"
          fill="white"
        />
      </clipPath>
    </defs>
  </svg>

  <svg
    v-else
    width="19"
    height="18"
    viewBox="0 0 19 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M9.69531 18C14.6659 18 18.6953 13.9706 18.6953 9C18.6953 4.02944 14.6659 0 9.69531 0C4.72475 0 0.695312 4.02944 0.695312 9C0.695312 13.9706 4.72475 18 9.69531 18Z"
      fill="#8E8E93"
    />
    <path
      d="M5.91797 8.96919L8.50934 11.5605L13.6588 6.56055"
      stroke="white"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>
