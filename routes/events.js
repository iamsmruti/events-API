import express from 'express'
const router = express.Router()

import { getEvents , createEvent, updateEvent, deleteEvent } from '../controllers/events.js'

router.get('/', getEvents)
router.post('/', createEvent)
router.put('/:id', updateEvent)
router.delete('/:id', deleteEvent)

export default router