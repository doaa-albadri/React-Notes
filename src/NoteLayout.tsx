import { useParams, Navigate, Outlet, useOutletContext } from "react-router-dom"
import { Note } from "./App"

type NoteLayoutProps = {
    notes: Note[]
}

const NoteLayout = ({ notes }: NoteLayoutProps) => {
    const { id } = useParams()
    const note = notes.find(n => n.id === id)

    if (note == null) {
        return (
            <Navigate to='/' replace />
        )
    }

    return (
        <Outlet context={note} />
    )

}

export const useNote = () => {
    return useOutletContext<Note>()
}

export default NoteLayout