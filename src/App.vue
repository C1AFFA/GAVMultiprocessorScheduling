<script setup>
import GA from './components/GA.vue'
</script>

<template>
  <h2>Genetic Algorithm for Multiprocessor Scheduling</h2>
  <p>
    This simple web application allow to visualize the evolution of a genetic algorithm population applied to the multiprocessor scheduling optimization problem.
  </p>
  <p>
    The interface allow to set the problem and the algorithm parameter. It's possible to interact with the algorithm during the exectution, tuning the number of machines, the mutation rate and the selection split ratio.
  </p>
  <GA />
</template>

<style scoped>
</style>
