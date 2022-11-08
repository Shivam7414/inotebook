import React, { useState } from "react";
import NoteContext from "./NoteContext";
const NoteState = (props) => {
    const host = "http://localhost:5000";
    const notesInitial = []
    const [notes, setNotes] = useState(notesInitial);

    //get all notes  a Note 
    const getNotes = async () => {
        //Api Call
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            }
        });
        const json = await response.json()
        setNotes(json)
    }

    //Add a Note 
    const addNote = async (title, description, tag) => {
        // TODO: API Call
        // API Call 
        const response = await fetch(`${host}/api/notes/addnotes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({ title, description, tag })
        });

        const note = await response.json();
        setNotes(notes.concat(note))
    }

    //Delete a Note
    const deleteNote = async (id) => {
        //Delete Note Api Call
        // eslint-disable-next-line
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {

            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            }
        });
        const newNote = notes.filter((note) => { return note._id !== id })
        setNotes(newNote)
    }

    //Edit a Note
    const editNote = async (id, title, description, tag) => {
        //Api Call
        // eslint-disable-next-line
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {

            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({ title, description, tag })
        });
        let newNote = JSON.parse(JSON.stringify(notes))
        //Logic For Edit Notes
        for (let index = 0; index < newNote.length; index++) {
            const element = newNote[index];
            if (element._id === id) {
                newNote[index].title = title;
                newNote[index].description = description;
                newNote[index].tag = tag;
                break;
            }

        }
        setNotes(newNote)

    }
    return (
        <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
            {props.children}
        </NoteContext.Provider>
    )

}
export default NoteState;