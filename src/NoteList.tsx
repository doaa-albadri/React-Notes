import { useMemo, useState } from 'react'
import { Row, Col, Stack, Button, Form, Card, Badge, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import ReactSelect from 'react-select'
import { Tag } from './App'
import styles from "./NoteList.module.css"

type SimpleNote = {
    tags: Tag[]
    title: string
    id: string
}

type NoteListProps = {
    availableTags: Tag[]
    notes: SimpleNote[]
    onUpdateTag: (id: string, label: string) => void
    onDeleteTag: (id: string) => void
}

type EditTagsModalProps = {
    show: boolean
    availableTags: Tag[]
    handleClose: () => void
    onUpdateTag: (id: string, label: string) => void
    onDeleteTag: (id: string) => void
}


const NoteList = ({ availableTags, notes, onUpdateTag, onDeleteTag }: NoteListProps) => {
    const [selectedTags, setSelectedTags] = useState<Tag[]>([])
    const [title, setTitle] = useState<string>('')

    const [editModalOpen, setEditModalOpen] = useState(false)

    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
            return (title === "" || note.title.toLowerCase().includes(title.toLocaleLowerCase())) &&
                (selectedTags.length === 0 ||
                    selectedTags.every(tag => note.tags.some(noteTag => noteTag.id === tag.id)
                    ))
        })
    }, [title, selectedTags, notes])
    return (
        <>
            <Row className='align-items-center mb-4'>
                <Col>
                    <h1>Notes</h1>
                </Col>
                <Col xs="auto">
                    <Stack gap={2} direction="horizontal">
                        <Link to="/new">
                            <Button variant='primary'>
                                Create
                            </Button>
                        </Link>
                        <Button onClick={() => setEditModalOpen(true)} variant='outline-secondary'>
                            Edit Tags
                        </Button>
                    </Stack>
                </Col>
            </Row>
            <Form>
                <Row className='mb-4'>
                    <Col>
                        <Form.Group controlId='title'>
                            <Form.Label>
                                Title
                            </Form.Label>
                            <Form.Control placeholder='Search' type="text" value={title} onChange={e => setTitle(e.target.value)} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId='tags'>
                            <Form.Label>Tags</Form.Label>
                            <ReactSelect
                                value={selectedTags.map(tag => {
                                    return { label: tag.label, value: tag.id }
                                })}
                                options={availableTags.map(tag => {
                                    return { label: tag.label, value: tag.id }
                                })}
                                onChange={
                                    tags => {
                                        setSelectedTags(tags.map(tag => {
                                            return { label: tag.label, id: tag.value }
                                        }))
                                    }
                                }
                                isMulti />
                        </Form.Group></Col>
                </Row>
            </Form>
            <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
                {filteredNotes.map(note => (
                    <Col key={note.id}>
                        <NoteCard id={note.id} title={note.title} tags={note.tags} />
                    </Col>
                ))}
            </Row>
            <EditTagsModal
                onUpdateTag={onUpdateTag}
                onDeleteTag={onDeleteTag}
                availableTags={availableTags} show={editModalOpen} handleClose={() => setEditModalOpen(false)} />
        </>
    )
}

const NoteCard = ({ id, title, tags }: SimpleNote) => {
    return (
        <Card as={Link} to={`/${id}`} className={`h-100 text-reset text-decoration-none ${styles.card}`}>
            <Card.Body>
                <Stack gap={2} className="align-items-center justify-content-center h-100">
                    <span className='fs-5'>{title}</span>
                    {tags.length > 0 && (
                        <Stack gap={1} direction="horizontal"
                            className='justify-content-center flex-wrap'>
                            {tags.map(tag => (
                                <Badge className='tet-truncates' key={tag.id}>{tag.label}</Badge>
                            ))}
                        </Stack>
                    )}
                </Stack>
            </Card.Body>
        </Card>
    )
}

const EditTagsModal = ({ availableTags, handleClose, show, onUpdateTag, onDeleteTag }: EditTagsModalProps) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Edit Tags
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Stack gap={2}>
                        {availableTags.map(tag => (
                            <Row key={tag.id}>
                                <Col>
                                    <Form.Control
                                        onChange={e => onUpdateTag(tag.id, e.target.value)}
                                        type="text" value={tag.label} />
                                </Col>
                                <Col xs="auto">
                                    <Button
                                        onClick={() => onDeleteTag(tag.id)}
                                        variant='outline-danger'>
                                        &times;
                                    </Button>
                                </Col>
                            </Row>
                        )

                        )}
                    </Stack>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export default NoteList