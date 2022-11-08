const express = require('express');
const router = express.Router();
const fetchUser = require('../Middleware/fetchUser');
const Note = require('../models/Note')
const { body, validationResult } = require('express-validator');
const { findByIdAndUpdate } = require('../models/Note');
//Route 1 :Get all notes using :GET "api/auth/getuser".login required
router.get('/fetchallnotes', fetchUser, async (req, res) => {

    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.log(error.message);
        res.status(500).send("some error occured");
    }

})

//Route 2 :Get all notes using :POST "api/auth/getuser".login required
router.post('/addnotes', fetchUser, [
    body('title', 'Enter a valid title').isLength({ min: 5 }),
    body('description', 'Description must be alleast 5 Character').isLength({ min: 5 }),
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        //if there are error ,return bad request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id

        })
        const saveNote = await note.save()
        res.json(saveNote)
    } catch (error) {
        console.log(error.message);
        res.status(500).send("some error occured");
    }

})
//Route 3 :Update an existing notes using :Post "api/auth/updatenotes".login required
router.put('/updatenote/:id', fetchUser, async (req, res) => {
    const { title, description, tag } = req.body;
    const newNote = {};
    if (title) { newNote.title = title };
    if (description) { newNote.description = description };
    if (tag) { newNote.tag = tag };

    //find the note to be updated and update it
    let note = await Note.findById(req.params.id)
    if (!note) { return res.status(404).send("Not found") }
    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed")
    }

    note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
    res.json(note)
})

//Route 4 :Delete an existing notes using :Post "api/auth/deletenotes".login required
router.delete('/deletenote/:id', fetchUser, async (req, res) => {
    const { title, description, tag } = req.body;
    const newNote = {};
    if (title) { newNote.title = title };
    if (description) { newNote.description = description };
    if (tag) { newNote.tag = tag };

    //find the note to be updated and update it
    let note = await Note.findById(req.params.id)
    if (!note) { return res.status(404).send("Not found") }
    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not Allowed")
    }

    note = await Note.findByIdAndDelete(req.params.id)
    res.json({ "Success": "Note has been deleted", note: note })
})
module.exports = router