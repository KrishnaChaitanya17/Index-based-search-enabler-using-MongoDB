const express=require('express')                          //To create an Instatnce to server.js
const router=express.Router()                             //To create an Instance to Router and thereby make Handlers
const {
    getallmovies,
    getmovie,
    addmovie,
    deletemovie,
    updatemovie,
    addindex,
    getallindexes,
    deleteindex
      }=require('../Controllers/Controllers')             //Makes a link to Controllers so as to use all Functions (GET,POST,DELETE,UPDATE,etc.)

//GET all Movies
router.get('/', getallmovies)

//GET Movies based on field:Value
router.get('/Search',getmovie)

//POST a New Movie
router.post('/AddMovie',addmovie)

//DELETE an Existing Movie
router.delete('/DeleteMovie',deletemovie)

//UPDATE an Existing Movie
router.patch('/ModMovie/:title',updatemovie)

//GET all Existing Indexes
router.get('/Index',getallindexes)

//POST a New Index
router.post('/AddIndex',addindex)

//DELETE an Existing Index
router.delete('/DeleteIndex',deleteindex)

module.exports=router                                     //To send back router to server, NOTE: similar to Function Call and Reference
