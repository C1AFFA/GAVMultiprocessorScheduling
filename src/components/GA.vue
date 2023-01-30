<script setup>
import { ref, computed } from 'vue'
import { GeneticAlgorithm } from '../utils/genetic-algorithm';


const canvas = ref()
let display


const GA = GeneticAlgorithm()
let worstFitness =  null
GA.eventListener.on('status-updated',(status)=>{
  console.log("STATUS UPDATED: ", status)
  population.value = status.population
  jobs.value = status.jobDurations
  currentGeneration.value = status.currentIteration
  canvas.value.height = status.population.length * 20
  bestFitness.value = status.population[0]?.fit ?? 0
  commaJobs.value = status.jobDurations.join()
  algoStep.value = status.algoStep
  isRunning.value = status.running

  if(status.population.length > 0 && !worstFitness)
    worstFitness =  status.population[(status.population.length-1)].fit

  for( let m in status.population){
    let setY = 1 + 20*m
    let fit = (status.population[m].fit/worstFitness)*500 
    if(status.population[m].fit != bestFitness.value) 
      display.fillStyle = "#c1affa";
    else display.fillStyle = "#00FF00";

    
    display.fillRect(0, setY, fit, 18);
  }
  


})
.on("error",(err)=>{
 console.log("ERROR EMITTED", err)
})



const population = ref()
const jobs = ref()
const popSize = ref()
const jobsNumber = ref()
const machinesNumber = ref()
const generationNumber = ref()
const currentGeneration = ref(0)
const bestFitness = ref()
const mutationRate = ref(0.5)
const selectionSplit = ref(0.5)
const commaJobs = ref("")
const algoStep = ref()
const isRunning = ref()

const setMachines = () => {
  GA.setMachinesNumber(machinesNumber.value)
}

const setPopulation = () => {
  worstFitness = null
  display = canvas.value.getContext('2d')
  GA.initializeRandomPopulation(popSize.value)
}
const setGenerations = () => {
  GA.setNumberOfGeneration(generationNumber.value)
}
const setJobsNumber = () => {
  GA.setJobsNumber(jobsNumber.value)
}

const setMutationRate = () => {
  GA.setMutationRate(mutationRate.value)
}
const setSelectionSplit = () => {
  GA.setSelectionSplit(selectionSplit.value)
}
const setJobsDuration = () => {
  let jdString = commaJobs.value
  const checkValidity = /^[0-9]+(,[0-9]+)*$/g
  if(jdString.match(checkValidity)){
    let jd = jdString.split(",")
    GA.setJobDurations(jd)
  }
  
}


const run = () => {  
  GA.run()
}
const stop = () => {
  GA.stop()
}

const test = () => {
  worstFitness =  null
  machinesNumber.value = 5
  setMachines()
  generationNumber.value = 1000
  setGenerations()
  jobsNumber.value = 10
  setJobsNumber()
  popSize.value = 20
  setPopulation()
  mutationRate.value = 0.05
  GA.setMutationRate(mutationRate.value)
  selectionSplit.value = 0.5
  GA.setSelectionSplit(selectionSplit.value)
  GA.setJobDurations([ 5, 15, 15, 8, 2, 3, 18, 20, 16, 1 ])
}

const reset = () => {
  worstFitness = null
  machinesNumber.value = null
  jobsNumber.value = null
  generationNumber.value = null
  popSize.value = null
  GA.reset()
  
}
const durationValidity = computed(()=>{
  console.log("asdasdsa")
  const checkValidity = /^[0-9]+(,[0-9]+)*$/g
  if(commaJobs.value.match(checkValidity))
    return true
  return false
})
const disablePopulation = computed(()=>{
  if(jobsNumber.value > 0 && machinesNumber.value > 0 && !isRunning.value)
    return false
  
  return true
})

const runDisabled = computed(()=>{
  if(jobsNumber.value > 0 && 
    machinesNumber.value > 0 && 
    !isRunning.value &&
    durationValidity.value && 
    popSize.value > 0
    )
    return false
  
  return true
})

const stopDisabled = computed(()=>{
  if(isRunning.value)
    return false
  
  return true
})

const resetDisabled = computed(()=>{
  if(isRunning.value)
    return true
  
  return false
})

const isMemberSelected = (memberIndex)=>{
  return memberIndex < popSize.value*selectionSplit.value
}

</script>

<template>
  
  <div class="card">
    <div class="panel-step-1">     
      <div class="flex">
        <div class="mr">
          <p class="label"> Jobs quantity:</p>
          <input type="number" class ="input-ga" @input="setJobsNumber" v-model="jobsNumber" placeholder="job number" :disabled="isRunning"  min="0" max="1000">
          <!-- <span>{{jobs}}</span> -->
        </div>
        <div v-if="jobsNumber > 0">
          <p class="label"> Comma separated jobs durations:</p>
          <div>
            <input type="text" style="width:400px" class ="input-ga"  :class="{ invalid: !durationValidity }" @input="setJobsDuration" v-model="commaJobs" placeholder="comma separated jobs duration" :disabled="isRunning">
          </div>
        </div>
      </div> 
      <div class="flex justify">
        <div>
          <p class="label"> Machines quantity:</p>
          <input type="number" class ="input-ga" @input="setMachines" v-model="machinesNumber" placeholder="machines number">
        </div>
        <div>
          <p class="label"> Generations number:</p>
          <input type="number" class ="input-ga" @input="setGenerations" v-model="generationNumber" placeholder="generation number" :disabled="isRunning">
        </div>
        <div>
          <p class="label"> Population size:</p>
          <input type="number" class ="input-ga" @input="setPopulation" v-model="popSize" placeholder="population size" :disabled="disablePopulation">
        </div>
        <div>
          <p class="label"> Mutation rate: {{ mutationRate }}</p>
          <input type="range" @input="setMutationRate" v-model="mutationRate"  min="0" max="1" step="0.01">
        </div>
        <div>
          <p class="label selectedmember"> Selection split: {{ selectionSplit }}</p>
          <input type="range" @input="setSelectionSplit" v-model="selectionSplit"  min="0" max="1" step="0.01">
        </div>    
      </div>
    </div>
    <div class="flex justify">
      <div>
        <button class="btn-cmnd" type="button" @click="run" :disabled="runDisabled" >run</button>
        <button class="btn-cmnd" type="button" @click="stop" :disabled="stopDisabled">stop</button>
        <button class="btn-cmnd" type="button" @click="reset" :disabled="resetDisabled">reset</button>
      </div>
      <div>
        <button class="btn-cmnd" type="button" @click="test">test problem</button>
      </div>
    </div>


    <div class="details flex">
      <span>GA phase: {{ algoStep }}</span>
      <span>Current iteration: {{ currentGeneration }}</span>
      <span class="fitness">Best fitness score: {{ bestFitness }}</span>
    </div>
    <div class="displaypop">
      <div class="labels">
        <p v-for="(item, index) in population" :key="index"  :class="{selectedmember: isMemberSelected(index)}">
           {{ item.genes }}
        </p>  
      </div>
      <canvas id="population-display" ref="canvas" width="500">
      </canvas>
      <div class="labels">
        <p v-for="(item, index) in population">
           {{ item.fit }}
        </p>  
      </div>
    </div>
  </div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
#population-display{
  /* border: 1px solid black; */
  margin:0 8px;
}
.labels{
  margin-right:7px;
}
.labels p{
  text-align: right;
  height: 20px;
  margin:0;
}
.displaypop{
  display: flex;
  justify-content:center;
  margin-top: 10px;
  min-width: 600px;
}

.label{
  margin:0;
  padding:0;
  text-align: left;
}
.panel-step-1{
  text-align: left;
  margin: 15px 0px;
  min-width: 1000px;
}

.input-ga{
  margin-right: 7px;
}
.btn-cmnd{
  margin:3px;
}
.details span{
  margin: 7px;
}
.details{
  margin-top: 10px;
}
.fitness{
  color:#00ff00
}
.flex{
  display: flex;
}
.details.flex span{
  text-align: center;
  flex-basis: 33%;
}
.justify{
  justify-content: space-between;
}
input.invalid{
  border: solid 2px red;
  color:red;
}
.selectedmember{
  color: #f5a105;
}

.mr{
  margin-right: 15px;
}

input{
  border-radius: 5px;
}
</style>
