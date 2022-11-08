import React, { useContext } from 'react'
import { useState } from 'react';
import noteContext from '../context/Notes/NoteContext'
const Addnote = (props) => {
    const context = useContext(noteContext);
    const { addNote } = context
    const [note, setNote] = useState({ title: "", description: "", tag: "" })
    const handleAddNote = (e) => {
        e.preventDefault();
        addNote(note.title, note.description, note.tag)
        setNote({ title: "", description: "", tag: "" })
        props.showAlert("Notes Added Successfully", "success")
    }
    const onchange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    }
    return (
        <div className='container'>
            <h1 className='my-3'>Add a Note</h1>
            <form>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" value={note.title} name='title' id="title" aria-describedby="emailHelp" onChange={onchange} minLength={5} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input type="text" className="form-control" id="description" name='description' value={note.description} onChange={onchange} minLength={5} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" className="form-label">Tag</label>
                    <input type="text" className="form-control" id="tag" value={note.tag} name='tag' onChange={onchange} />
                </div>
                <button disabled={note.title.length < 5 || note.description.length < 5} type="submit" className="btn btn-primary" onClick={handleAddNote}>Submit</button>
            </form>
        </div>
    )
}

export default Addnote
