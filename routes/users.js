import express from 'express'
import User from '../models/User.js'
import { signToken } from '../utils/auth.js'

const router = express.Router()

/**
 * POST api/user/register
 * @description route to create new user
 */
router.post('/register', async (req, res) => {
  try {
    const user = await User.create(req.body)
    const token = signToken(user)
    res.status(201).json({ token, user })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

/**
 * POST api/users/login
 * @description authentication & token route
 */
router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    return res.status(400).json({ message: 'Cannot find User' })
  }

  const correctPw = await user.isCorrectPassword(req.body.password)

  if (!correctPw) {
    return res.status(400).json({ message: 'Incorrect password!' })
  }

  const token = signToken(user)
  res.json({ token, user })
})


export default router;