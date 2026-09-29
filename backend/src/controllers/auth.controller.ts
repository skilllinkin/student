import type { Request, Response } from 'express'
import { signIn, signUp, setPassword } from '../services/auth.service'
import { setPasswordSchema, signInSchema, signUpSchema } from '../validators/auth.validator'

export const signup = async (req: Request, res: Response) => res.status(201).json(await signUp(signUpSchema.parse(req.body)))
export const signin = async (req: Request, res: Response) => {
  const body = signInSchema.parse(req.body)
  res.json(await signIn(body.email, body.password))
}
export const setPasswordController = async (req: Request, res: Response) => {
  const body = setPasswordSchema.parse(req.body)
  res.json(await setPassword(body.token, body.password))
}