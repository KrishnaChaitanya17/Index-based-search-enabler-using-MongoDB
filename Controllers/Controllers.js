const moviestructure=require('../Model/Structure')                                        //Making a link to the Model

//GET all Movies
const getallmovies = async (req,res) =>{                                                  //NOTE: it's req first then res (Maintain Order)
    const allmovies = await moviestructure.find({})                                       //using MongoDB's find() we get all Docs by passing empty argument '{}'
    res.status(200).json({allmovies})
} 

//GET a Single Movie based on 'field' and 'Value'
const getmovie = async (req,res) => {
    let results = []                                                                      //Empty Array (We will 'push' the follwing results into it)

    if(!await moviestructure.findOne(req.query))                                          //To Check if the Query We want to Search Exists
    {
        console.log('No such Documents Exist')
        return res.status(404).json({error: 'No Such Documents Exist'})                   //Use 'return' or else the remaining code within this block will be executed unnecessary
    }

    const movie = await moviestructure.find(req.query)                              //Based on the 'query' we type on Postman we get the Results, NOTE: Takes the Searched Document
    results.push(movie)

    const stats=await moviestructure.find(req.query).explain('executionStats')            //Gets the ExecutionStats of the Search Query
    results.push(stats)

    console.log(`Number of Documents examined: ${stats.executionStats.totalDocsExamined}`)
    console.log(`Number of Documents Found: ${stats.executionStats.nReturned}`)
    console.log(`Execution Time in MilliSeconds: ${stats.executionStats.executionTimeMillis}`)
    console.log(`Filter Method: ${stats.executionStats.executionStages.stage}`)
    res.status(200).json({results})
}

//POST a New Movies
const addmovie=async(req,res)=>
{
    const {plot,genres,runtime,cast,poster,title,fullplot,languages,released,directors,writers,rated,awards,lastupdated,year,imdb,countries,type,tomatoes,comments}=req.body            //Any Foreign fields won't be taken
    let emptyfields=[]                                                                     //Checks for any Missing Fields while Entering new Workout Doc
    if(!plot){emptyfields.push('plot')}
    if(!genres){emptyfields.push('genres')}
    if(!runtime){emptyfields.push('runtime')}
    if(!cast){emptyfields.push('cast')}
    if(!poster){emptyfields.push('poster')}
    if(!title){emptyfields.push('title')}
    if(!fullplot){emptyfields.push('fullplot')}
    //if(!languages){emptyfields.push('languages')}
    if(!released){emptyfields.push('released')}
    if(!directors){emptyfields.push('directors')}
    if(!writers){emptyfields.push('writers')}
    //if(!rated){emptyfields.push('rated')}
    //if(!awards){emptyfields.push('awards')}
    if(!lastupdated){emptyfields.push('lastupdated')}
    if(!year){emptyfields.push('year')}
    //if(!imdb){emptyfields.push('imdb')}
    if(!countries){emptyfields.push('countries')}
    //if(!type){emptyfields.push('type')}
    //if(!tomatoes){emptyfields.push('tomatoes')}
    //if(!comments){emptyfields.push('comments')}

    if(emptyfields.length != 0){
        console.log(`Please Fill in all Criterias based on their Data Types`)
        //Drops a message along will all the missing Fields to be Filled
        return res.status(400).json({error:'Please Fill in all Criterias based on their Data Types', emptyfields})
    }

    //Add a Movie Document to the DB 
    try{
        //Asynchronously Creates a new Movie Document with the followong fields
        const newmovie = await moviestructure.create({plot,genres,runtime,cast,poster,title,fullplot,languages,released,directors,writers,rated,awards,lastupdated,year,imdb,countries,type,tomatoes,comments})
        res.status(200).json(newmovie)                               //200 means it's functioning fine
        console.log(`New Movie "${newmovie.title}" Addition Success`)
    }
    catch(error){
        res.status(400).json({error: error.message})                //400 means an error
    }
}

//UPDATE a Movie Based on Movie Name
const updatemovie = async (req,res) => {
    const {title} = req.params
    try{
        const changemovie = await moviestructure.findOneAndUpdate({title:title},
            {
                ...req.body
            })
            if(!changemovie){
                console.log('Movie Does not Exists')
                return res.status(200).json({errror:'Movie Does not Exists'})
            }
            console.log(`"${title}" Movie Updation Success`)
            res.status(200).json(changemovie)
        }
        catch(error)
        {
            console.log('Movie Updation Failed')
            res.status(400).json({error: error.message})
        }
}

//DELETE a Movie Based on Movie Name, NOTE: if You DELETE without any query ALL docs will be DELETED
const deletemovie = async (req,res) => {
    const removemovie=await moviestructure.deleteMany(req.query)         //Can use deleteOne() to Delete One Documrent at a Time
    if(!removemovie.deletedCount)
    {
        console.log(`No such Movie Exists`)
        return res.status(400).json({error: 'No such Movie Exists'})     //Use 'return' or else the remaining code within this block will be executed unnecessary
    }
    console.log(`Deletion Success, Documents Deleted:`,removemovie.deletedCount)
    res.status(200).json(removemovie)
}

//GET all Indexes
const getallindexes = async (req,res) => {
    const showindex = await moviestructure.listIndexes()
    console.log('The Existing Indexes are :')
    console.table(showindex)
    res.status(200).json(showindex)
}

//POST an Index (Single or Compound along with your own index names)
const addindex = async (req,res) => {
    const indexes = req.body.indexes
    try
    {
        await moviestructure.collection.createIndexes(indexes)
        console.log('Index Creation Success')
        res.status(200).send("Index Creation Success")
    }
    catch(error)
    {
        console.log('Index Creation Failed')
        res.status(400).json({error: error.message})
    }
    }

//DELETE an Index (Based on Index names)
const deleteindex = async (req,res) => {
    const indexes = req.body.indexes
    try{
        for (let i=0; i < indexes.length; i++)                      //Can aslo make use of dropIndexes to avoid the use of loop
        {
            await moviestructure.collection.dropIndex(indexes[i])
            console.log(`The Index "${indexes[i]}" is Deleted`)
        }
        res.status(200).json({Deleted_Indexes:indexes})
    }
    catch(error){
        console.log(error.message)
        res.status(400).json({error: error.message})
    }
}


module.exports={
    getallmovies,
    getmovie,
    addmovie,
    deletemovie,
    updatemovie,
    addindex,
    getallindexes,
    deleteindex
}                                                     //Export Function to Routes as the main POST Function