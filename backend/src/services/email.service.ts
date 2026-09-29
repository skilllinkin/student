import nodemailer from 'nodemailer'
import { env } from '../config/env'
import { db } from '../config/db'

const transport = env.SMTP_HOST ? nodemailer.createTransport({ host: env.SMTP_HOST, port: env.SMTP_PORT, secure: env.SMTP_PORT === 465, ...(env.SMTP_USER ? { auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD } } : {}) }) : null

export async function sendTemplateEmail(recipient: string, template: string, subject: string, text: string) {
  try {
    if (!transport) throw new Error('SMTP is not configured')
    const result = await transport.sendMail({ from: env.MAIL_FROM, to: recipient, subject, text })
    await db.emailLog.create({ data: { recipient, template, status: 'sent', providerRef: result.messageId } })
  } catch (error) {
    await db.emailLog.create({ data: { recipient, template, status: 'failed' } }).catch(() => undefined)
    console.error('Email delivery failed', error)
  }
}