import express from 'express'
import protect from '../utils/auth.js'
import Task from '../models/Task.js'
import Project from '../models/Porject.js'

const router = express.Router()
router.use(protect)

/**
 * POST api/projects/:projectId/tasks
 * @description task creation route
 */
router.post('/projects/:projectId/tasks', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)

    if (!project) {
      return res.status(404).json({ message: 'Project cannot be found' })
    }

    if (!project.user.equals(req.user._id)) {
      return res.status(404).json({
        message: 'User is not permitted to update tasks for this project'
      })
    }

    const task = await Task.create({
      ...req.body,
      project: project._id
    })
    res.status(201).json(task)
  } catch (err) {
    console.error(err)
    res.status(400).json(err)
  }
})

/**
 * PUT api/tasks/:taskId
 * @description route to update task by id
 */
router.put('/tasks/:taskId', async (req, res) => {
  try {
    const taskUpdate = await Task.findById(req.params.taskId).populate(
      'project'
    )

    if (!taskUpdate) {
      return res
        .status(404)
        .json({ message: 'Task not found under this id for this project' })
    }

    if (!taskUpdate.project.user.equals(req.user._id)) {
      return res
        .status(403)
        .json({
          message: 'User is not authorized to update tasks on this project'
        })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json(err)
  }
})

/**
 * GET api/projects/:projectId/task
 * @description route to retrieve tasks by project id
 */
router.get('/projects/:projectId/tasks', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)

    if (!project) {
      return res.status(404).json({ message: 'Project cannot be found' })
    }

    if (!project.user.equals(req.user._id)) {
      return res.status(404).json({
        message: 'User is not permitted to view the tasks for this project'
      })
    }

    const tasks = await Task.find({ project: project._id })
    res.status(201).json(tasks)
  } catch (err) {
    console.error(err)
    res.status(400).json(err)
  }
})

/**
 * DELETE api/tasks/:taskId
 * @description route to delete tasks
 */
router.delete('/task/:taskId', async (req, res) => {
  try {
    const taskDelete = await Task.findByIdAndDelete(req.params.id)

    if (!taskDelete) {
      return res.status(404).json({ message: 'Task not found' })
    }

    if (!taskDelete.user.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: 'User is not authorized to delete this content' })
    }

    await taskDelete.deleteOne()
    res.json({ message: 'Task deleted from project' })
  } catch (err) {
    console.error(err)
    res.status(500).json(err)
  }
})
