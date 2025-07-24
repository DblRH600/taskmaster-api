import express from 'express'
import { authMiddleware as protect } from '../utils/auth.js'
import Project from '../models/Project.js'

const router = express.Router()
router.use(protect)

/**
 * POST api/projects
 * @description route for project creation
 */
router.post('/', async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      user: req.user._id
    })
    res.status(201).json(project)
  } catch (err) {
    console.error(err)
    res.status(400).json({ message: err.message })
  }
})

/**
 * PUT api/projects/:id
 * @description route for updating project data
 */
router.put('/:id', async (req, res) => {
  try {
    const projectUpdate = await Project.findById(req.params.id)

    if (!projectUpdate) {
      return res
        .status(404)
        .json({ message: 'Project not found under this id' })
    }

    if (!projectUpdate.user.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: 'Updates to this project are authorized by the user' })
    }

    await projectUpdate.set(req.body).save()

    res.json(projectUpdate)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
})

/**
 * GET api/projects
 * @description route for retrieving all projects
 */
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id })
    res.json(projects)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
})

/**
 * GET api/projects/:id
 * @description route for retrieving a project by id
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const project = await Project.findById(id)

    if (!project) {
      return res.status(404).json({ message: 'The project is not found' })
    }

    if (!project.user.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: 'The user is not authorized to view this project' })
    }

    res.json(project)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
})

/**
 * DELETE api/projects/:id
 * @description route for project deletion
 */
router.delete('/:id', async (req, res) => {
  try {
    const projectDelete = await Project.findByIdAndDelete(req.params.id)
    if (!projectDelete) {
      return res
        .status(404)
        .json({ message: 'Project not found under this id' })
    }

    if (!projectDelete.user.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: 'This user is not authorized to delete this content' })
    }

    await projectDelete.deleteOne()
    res.json({ message: 'Project has been deleted!' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
})

export default router
