
import {EventEmitter} from 'eventemitter3' 



export const GeneticAlgorithm = () => {
    
    let jobsNumber = 0
    let jobDurations = []
    let population = []
    let matingPool = []
    let children = []
    let populationSize = 0
    let machinesNumber = 0
    let generations = 0
    let currentIteration = 0
    let mutationRate = 0.05
    let selectionSplit = 0.5
    let running = false
    let stopFlag = false
    let algoStep = "Initialization..."
    const eventListener = new EventEmitter();

    const statusToEmit = () =>{
        return {
            populationSize,
            machinesNumber,
            generations,
            jobsNumber,
            jobDurations,
            population,
            matingPool,
            mutationRate,
            selectionSplit,
            children,
            currentIteration,
            running,
            algoStep
        }
    }

    const reset = ()=>{
        jobsNumber = 0
        jobDurations = []
        population = []
        matingPool = []
        children = []
        populationSize = 0
        machinesNumber = 0
        generations = 0
        currentIteration = 0
        mutationRate = 0.05
        selectionSplit = 0.5
        running = false
        stopFlag = false
        algoStep = "Initialization..."
        statusUpdated()
    }
    const statusUpdated = () => {
        eventListener.emit("status-updated", statusToEmit())
    }
    const emitError = (err) => {
        eventListener.emit("serror", err)
    }
    const initializeRandomPopulation = (size)=>{
        try{
            populationSize = size
            population = []
            matingPool = []
            children = []
            for(let i = 0; i < size; i += 1){

                const popMember = getRandomInitializatedMember()
                population.push(popMember)

            }
            population.sort(function(a, b) {
                return a.fit - b.fit;
            });
            statusUpdated()
            
        }
        catch(err){
            emitError(err)
        }
    }
    
    const setJobsNumber = (jn) =>{
        if(jn){
            jobsNumber = jn
            jobDurations = []
            for(let i=0; i<jobsNumber;i+=1){
                jobDurations.push(Math.round(Math.random()*20 + 1))
            }
            statusUpdated()
        }
    }

    const setJobDurations = (jd) =>{
        jobDurations = []
        if(jd){
            for(let d of jd){
                let parsedDuration = parseInt(d)
                jobDurations.push(parsedDuration)
            }
            jobsNumber = jd.length
            statusUpdated()
        }
    }

    const setMachinesNumber = (mn) =>{
        if(mn) machinesNumber = mn
        statusUpdated()
    }
    const setMutationRate = (mr) =>{
        const parsedMR = parseFloat(mr)
        if(parsedMR) mutationRate = parseFloat(parsedMR)
        statusUpdated()
    }
    const setSelectionSplit = (ss) =>{
        const parsedss = parseFloat(ss)
        if(parsedss) selectionSplit = parseFloat(parsedss)
        statusUpdated()
    }
    const setNumberOfGeneration = (gn) => {
        if(gn) generations = gn
        statusUpdated()
    }


    const run = async ()=>{
        running = true
        for( let gen = 0 ; gen <= generations; gen += 1){
            currentIteration = gen

            selection()
            statusUpdated()
            await sleep(50)
            reproduction()
            statusUpdated()
            await sleep(50)
            discard()
            statusUpdated()
            await sleep(50)
            if(stopFlag) break
        }
        currentIteration = 0
        stopFlag = false
        running = false
        matingPool = []
        children = []
        statusUpdated()
    }

    const stop = ()=>{
        stopFlag = true
    }
    const sleep = (time) => {
        return new Promise((resolve) => setTimeout(resolve, time))
    }

    const getRandomInitializatedMember = ()=>{                        

        const genes = []
        let fit = 0
        for(let j in jobDurations){
            let mAssignement = Math.round(Math.random()*(machinesNumber-1))
            genes.push(mAssignement)
        }

        fit = calculateFitness(genes)

        return {
            fit,
            genes
        }

    }

    const calculateFitness = (genes) =>{
        const fitArrayCounter = new Array(machinesNumber).fill(0);
        for(let g in genes){        
            fitArrayCounter[genes[g]] += jobDurations[g]
        }
        return Math.max.apply(null,fitArrayCounter)
    }

    const orderByFitness = () =>{
        population.sort(function(a, b) {
            return a.fit - b.fit;
        });
        const tempPop = [...population]
        population = tempPop

        statusUpdated()
    }


    const selection = ()=>{
        algoStep = "selection"
        statusUpdated()
        orderByFitness()
        const numberOfSelectedForMating = Math.round(population.length*selectionSplit)
        for(let m = 0; m < numberOfSelectedForMating; m+=1){
            matingPool.push(population[m])
        }       
    }
    const reproduction = ()=>{
        while(matingPool.length > 2){
            const p1 = matingPool.splice(Math.floor(Math.random()*matingPool.length), 1)[0];
            const p2 = matingPool.splice(Math.floor(Math.random()*matingPool.length), 1)[0];
            const childGenes = []
            for( let g in p1.genes){
                algoStep = "crossover"
                statusUpdated()
                //Crossover with equiprobaility
                if(Math.random() > 0.5) childGenes.push(p1.genes[g])
                else childGenes.push(p2.genes[g])
                
                
                //Mutation with rate
                if(Math.random() < mutationRate){
                    algoStep = "mutation"
                    statusUpdated()
                    childGenes[g] = Math.round(Math.random()*(machinesNumber-1))
                }   
            }
            
            const child = {
                genes: childGenes,
                fit: calculateFitness(childGenes)
            }
    
            children.push(child)
        }  
    }

    const discard = ()=>{
        algoStep = "discard"
        statusUpdated()
        population = population.concat(children)
        orderByFitness()
        population = population.slice(0, populationSize);
        children = []
        matingPool = []

    }

    return {
        eventListener,
        initializeRandomPopulation,
        setJobDurations,
        setMachinesNumber,
        setNumberOfGeneration,
        setJobsNumber,
        setMutationRate,
        setSelectionSplit,
        orderByFitness,
        run,
        reset,
        stop
    }

}
