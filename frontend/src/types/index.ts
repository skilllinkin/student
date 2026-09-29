export type PortalRole = 'candidate' | 'recruiter' | 'admin'
export type ApplicationStage = 'Applied' | 'Shortlisted' | 'Interview' | 'Offer' | 'Hired' | 'Rejected' | 'Withdrawn'

export interface Job {
  id: string
  title: string
  department: string
  location: string
  type: string
  lastDate: string
  openings: number
  status: 'Open' | 'Closed'
  description: string
  requirements: string[]
}

export interface Application {
  id: string
  candidate: string
  email: string
  initials: string
  jobId: string
  stage: ApplicationStage
  applied: string
  cv: string
  note: string
  interview?: string
  interviewStart?: string
}