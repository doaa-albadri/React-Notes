import { useMemo, useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css"
import { Routes, Route, Navigate } from "react-router-dom"
import { Container } from 'react-bootstrap'
import NewNote from './NewNote'
import { useLocalStorage } from './useLocalStorage'
import { v4 as uuidV4 } from 'uuid'



export type Tag = {
  id: string
  label: string
}

export type RawNoteData = {
  title: string
  markdown: string
  tagIds: string[]
}

export type RawNote = {
  id: string
} & RawNoteData

export type NoteData = {
  title: string
  markdown: string
  tags: Tag[]
}

export type Note = {
  id: string
} & NoteData

function App() {
  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", [])
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", [])

  const notesWithTags = useMemo(() => {
    return notes.map(note => {
      return { ...note, tags: tags.filter(tag => note.tagIds.includes(tag.id)) }
    })
  }, [notes, tags])

  const onCreateNote = ({ tags, ...data }: NoteData) => {
    setNotes(prevNotes => {
      return [...prevNotes, { ...data, id: uuidV4(), tagIds: tags.map(tag => tag.id) }]
    })
  }

  const addTag = (tag: Tag) => {
    setTags(prev => [...prev, tag])
  }


  return (
    <Container className='my-4'>
      <Routes>
        <Route path='/' element={<h1>hii</h1>} />
        <Route path='/new' element={<NewNote onSubmit={onCreateNote} onAddTag={addTag} availableTags={tags} />} />
        <Route path='/:id'>
          <Route index element={<h1>Show</h1>} />
          <Route path='edit' element={<h1>Edit</h1>} />
        </Route>
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </Container>
  )
}

export default App
