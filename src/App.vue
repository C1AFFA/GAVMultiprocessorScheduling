<script setup>
import GA from './components/GA.vue'
</script>

<template>
  <h2 class="title">Genetic Algorithm for Multiprocessor Scheduling</h2>
  <div id="description">
    <p>
      This simple web application allow to visualize the evolution of a <b>genetic algorithm</b> population applied to the <b>multiprocessor scheduling</b> optimization problem.
      The interface allows to set the problem and the algorithm parameters. It's possible to interact with the algorithm during the exectution, tuning the number of machines, the mutation rate and the selection split ratio.
    </p>
  </div>
  <GA />
</template>

<style scoped>
.title{
  background-color: #393939;
  margin: 15px 0px;
  padding: 5px 10px;
  color:#aaa;
}
#description{
  font-size:0.9em;
}
#description p{
  margin: 3px;
}
</style>
