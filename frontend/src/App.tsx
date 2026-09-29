import { useState } from 'react'
import {
  ArrowDownRight, ArrowRight, Bell, BriefcaseBusiness, CalendarDays, Check,
  ChevronDown, ChevronRight, CircleHelp, Clock3, FileText, Filter, LayoutDashboard,
  Menu, MessageSquareText, MoreHorizontal, Plus, Search,
  ShieldCheck, Sparkles, UserRoundPlus, Users, X,
} from 'lucide-react'
import type { Application, ApplicationStage, Job, PortalRole } from './types'

const initialJobs: Job[] = [
  { id: 'J-104', title: 'Product Designer', department: 'Design', location: 'Islamabad · Hybrid', type: 'Full-time', lastDate: '2026-10-18', openings: 2, status: 'Open', description: 'Shape clear, accessible product experiences for teams building digital services.', requirements: ['3+ years product design', 'Figma and prototyping', 'Strong portfolio'] },
  { id: 'J-103', title: 'Frontend Engineer', department: 'Engineering', location: 'Islamabad · Hybrid', type: 'Full-time', lastDate: '2026-10-24', openings: 1, status: 'Open', description: 'Build fast, dependable interfaces with a small cross-functional team.', requirements: ['React and TypeScript', 'Accessibility fundamentals', 'API integration'] },
  { id: 'J-102', title: 'People Operations Associate', department: 'People', location: 'Remote · Pakistan', type: 'Full-time', lastDate: '2026-10-30', openings: 1, status: 'Open', description: 'Make the moments around joining, growing, and collaborating feel thoughtful.', requirements: ['People operations experience', 'Clear written communication', 'Organized and discreet'] },
  { id: 'J-101', title: 'Data Analyst', department: 'Data', location: 'Nowshera · On-site', type: 'Full-time', lastDate: '2026-10-12', openings: 0, status: 'Closed', description: 'Turn operational data into practical insights for product and delivery teams.', requirements: ['SQL and dashboards', 'Statistical reasoning', 'Stakeholder communication'] },
]

const initialApplications: Application[] = [
  { id: 'A-2084', candidate: 'Ayesha Khan', email: 'ayesha.khan@email.com', initials: 'AK', jobId: 'J-104', stage: 'Interview', applied: 'Sep 24, 2026', cv: 'Ayesha_Khan_CV.pdf', note: 'Strong systems thinking; ask about design handoff.', interview: 'Oct 02 · 10:00 AM', interviewStart: '2026-10-02T10:00:00' },
  { id: 'A-2083', candidate: 'Hamza Malik', email: 'hamza.m@email.com', initials: 'HM', jobId: 'J-103', stage: 'Shortlisted', applied: 'Sep 23, 2026', cv: 'Hamza_Malik_CV.pdf', note: 'Great React fundamentals. Review accessibility examples.' },
  { id: 'A-2082', candidate: 'Sara Ahmed', email: 'sara.ahmed@email.com', initials: 'SA', jobId: 'J-104', stage: 'Applied', applied: 'Sep 22, 2026', cv: 'Sara_Ahmed_CV.pdf', note: '' },
  { id: 'A-2081', candidate: 'Zain Raza', email: 'zain.raza@email.com', initials: 'ZR', jobId: 'J-102', stage: 'Offer', applied: 'Sep 20, 2026', cv: 'Zain_Raza_CV.pdf', note: 'References checked; waiting on response.' },
]

const stageOrder: ApplicationStage[] = ['Applied', 'Shortlisted', 'Interview', 'Offer', 'Hired']
const roleTitles: Record<PortalRole, string> = { candidate: 'Candidate portal', recruiter: 'Recruiter workspace', admin: 'Hiring overview' }

function loadDemo<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) as T : fallback
  } catch {
    return fallback
  }
}

function App() {
  const [role, setRole] = useState<PortalRole>(() => loadDemo('nd-role', 'admin'))
  const [jobs, setJobs] = useState<Job[]>(() => loadDemo('nd-jobs', initialJobs))
  const [applications, setApplications] = useState<Application[]>(() => loadDemo('nd-applications', initialApplications))
  const [activeNav, setActiveNav] = useState('Overview')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [modal, setModal] = useState<'job' | 'recruiter' | 'interview' | null>(null)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [notice, setNotice] = useState('')
  const [noteDraft, setNoteDraft] = useState('')
  const [interviewDate, setInterviewDate] = useState('')
  const [interviewTime, setInterviewTime] = useState('10:00')
  const [newJobTitle, setNewJobTitle] = useState('')

  const saveJobs = (next: Job[]) => { setJobs(next); localStorage.setItem('nd-jobs', JSON.stringify(next)) }
  const saveApplications = (next: Application[]) => { setApplications(next); localStorage.setItem('nd-applications', JSON.stringify(next)) }
  const changeRole = (next: PortalRole) => { setRole(next); localStorage.setItem('nd-role', JSON.stringify(next)); setActiveNav('Overview'); setSelectedId(null) }
  const selected = applications.find((app) => app.id === selectedId) ?? null
  const filteredJobs = jobs.filter((job) => `${job.title} ${job.department}`.toLowerCase().includes(search.toLowerCase()))
  const filteredApps = applications.filter((app) => `${app.candidate} ${app.id} ${jobs.find((job) => job.id === app.jobId)?.title}`.toLowerCase().includes(search.toLowerCase()))
  const openJobs = jobs.filter((job) => job.status === 'Open')
  const activeApps = applications.filter((app) => !['Rejected', 'Hired', 'Withdrawn'].includes(app.stage))
  const jobName = (id: string) => jobs.find((job) => job.id === id)?.title ?? 'Role removed'

  const showNotice = (message: string) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2800)
  }
  const apply = (job: Job) => {
    if (applications.some((app) => app.jobId === job.id && app.email === 'you@example.com' && !['Rejected', 'Withdrawn'].includes(app.stage))) {
      showNotice('You already have an active application for this role.')
      return
    }
    const next = [{ id: `A-${Date.now().toString().slice(-4)}`, candidate: 'You', email: 'you@example.com', initials: 'YO', jobId: job.id, stage: 'Applied' as const, applied: 'Today', cv: 'Your_CV.pdf', note: '' }, ...applications]
    saveApplications(next)
    showNotice(`Application sent for ${job.title}.`)
  }
  const advance = (app: Application, nextStage: ApplicationStage) => {
    const currentIndex = stageOrder.indexOf(app.stage)
    if (nextStage === 'Rejected' || stageOrder.indexOf(nextStage) === currentIndex + 1) {
      saveApplications(applications.map((item) => item.id === app.id ? { ...item, stage: nextStage } : item))
      showNotice(nextStage === 'Rejected' ? 'Application rejected. Candidate notified.' : `Moved to ${nextStage}.`)
    } else showNotice('Stages move forward one step at a time.')
  }
  const withdraw = (app: Application) => {
    saveApplications(applications.map((item) => item.id === app.id ? { ...item, stage: 'Withdrawn' } : item))
    showNotice('Application withdrawn.')
  }
  const addNote = () => {
    if (!selected || !noteDraft.trim()) return
    saveApplications(applications.map((app) => app.id === selected.id ? { ...app, note: noteDraft.trim() } : app))
    setNoteDraft('')
    showNotice('Private recruiter note saved.')
  }
  const scheduleInterview = () => {
    if (!selected || !interviewDate || !interviewTime) return
    const startsAt = new Date(`${interviewDate}T${interviewTime}`)
    if (startsAt <= new Date()) { showNotice('Choose a future interview time.'); return }
    const conflict = applications.some((app) => {
      if (app.id === selected.id || !app.interviewStart) return false
      const existingStart = new Date(app.interviewStart).getTime()
      return existingStart < startsAt.getTime() + 60 * 60 * 1000 && existingStart + 60 * 60 * 1000 > startsAt.getTime()
    })
    if (conflict) { showNotice('That time conflicts with another interview.'); return }
    const displayDate = startsAt.toLocaleDateString('en', { month: 'short', day: '2-digit' })
    const displayTime = startsAt.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })
    saveApplications(applications.map((app) => app.id === selected.id ? { ...app, stage: 'Interview', interview: `${displayDate} · ${displayTime}`, interviewStart: startsAt.toISOString() } : app))
    setModal(null)
    showNotice('One-hour interview scheduled. Invitation queued.')
  }
  const addJob = () => {
    if (!newJobTitle.trim()) return
    const nextJob: Job = { id: `J-${Date.now().toString().slice(-3)}`, title: newJobTitle.trim(), department: 'General', location: 'Islamabad · Hybrid', type: 'Full-time', lastDate: '2026-11-15', openings: 1, status: 'Open', description: 'A new opportunity at Nowshera Digital.', requirements: ['Relevant experience', 'Clear communication'] }
    saveJobs([nextJob, ...jobs])
    setNewJobTitle('')
    setModal(null)
    showNotice('Job published to the candidate portal.')
  }

  const navItems = role === 'candidate' ? ['Overview', 'Browse jobs', 'My applications'] : role === 'recruiter' ? ['Overview', 'My jobs', 'Applications'] : ['Overview', 'Jobs', 'Recruiters', 'Applications']
  const isJobList = activeNav === 'Jobs' || activeNav === 'My jobs' || activeNav === 'Browse jobs'
  const isAppList = activeNav === 'Applications' || activeNav === 'My applications'
  const pageTitle = activeNav === 'Overview' ? roleTitles[role] : activeNav

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
        <div className="brand"><div className="brand-mark">N<span>.</span></div><div className="brand-name">nowshera<span>digital</span></div><button className="icon-button sidebar-close" onClick={() => setMobileMenu(false)} aria-label="Close navigation"><X size={18} /></button></div>
        <div className="workspace-label">WORKSPACE</div>
        <button className="workspace-switch"><span className="workspace-icon"><BriefcaseBusiness size={16} /></span><span><b>Nowshera Digital</b><small>Hiring team</small></span><ChevronDown size={15} /></button>
        <div className="nav-label">MENU</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item === 'Overview' ? LayoutDashboard : item.includes('job') || item === 'Jobs' ? BriefcaseBusiness : item === 'Recruiters' ? UserRoundPlus : Users
            return <button key={item} className={`nav-item ${activeNav === item ? 'nav-active' : ''}`} onClick={() => { setActiveNav(item); setSelectedId(null); setMobileMenu(false) }}><Icon size={18} /><span>{item}</span>{item === 'Applications' && <span className="nav-count">{activeApps.length}</span>}</button>
          })}
        </nav>
        <div className="sidebar-bottom"><div className="support-box"><div className="support-icon"><CircleHelp size={17} /></div><div><strong>Need a hand?</strong><small>Contact your workspace admin</small></div><ChevronRight size={15} /></div><button className="profile-switch" onClick={() => changeRole(role === 'admin' ? 'recruiter' : role === 'recruiter' ? 'candidate' : 'admin')}><div className="avatar avatar-green">{role === 'candidate' ? 'YO' : role === 'recruiter' ? 'FA' : 'ND'}</div><span><b>{role === 'candidate' ? 'Your profile' : role === 'recruiter' ? 'Fatima A.' : 'Nowshera Admin'}</b><small>{role} demo account</small></span><MoreHorizontal size={18} /></button></div>
      </aside>

      <main className="main-area">
        <header className="topbar"><div className="topbar-left"><button className="icon-button mobile-menu" onClick={() => setMobileMenu(true)} aria-label="Open navigation"><Menu size={19} /></button><div className="breadcrumb">Workspace <ChevronRight size={14} /> <strong>{pageTitle}</strong></div></div><div className="topbar-actions"><label className="search-box"><Search size={16} /><input aria-label="Search" placeholder="Search anything..." value={search} onChange={(event) => setSearch(event.target.value)} /><kbd>⌘ K</kbd></label><button className="icon-button notification-button" aria-label="Notifications"><Bell size={18} /><i /></button><div className="top-divider" /><label className="role-picker"><span>View as</span><select aria-label="Select demo portal" value={role} onChange={(event) => changeRole(event.target.value as PortalRole)}><option value="admin">Admin</option><option value="recruiter">Recruiter</option><option value="candidate">Candidate</option></select><ChevronDown size={14} /></label></div></header>

        <div className="page-wrap">
          <div className="page-heading"><div><div className="eyebrow">{role === 'candidate' ? 'YOUR CAREER JOURNEY' : role === 'recruiter' ? 'TALENT OPERATIONS' : 'HIRING OPERATIONS'}</div><h1>{pageTitle}</h1><p>{role === 'candidate' ? 'Find your next opportunity and keep track of every step.' : role === 'recruiter' ? 'A focused view of your assigned roles and candidates.' : 'A clear view of your hiring pipeline, from role to offer.'}</p></div><div className="heading-actions">{role === 'admin' && <button className="button button-primary" onClick={() => setModal('job')}><Plus size={16} /> Create job</button>}{role === 'recruiter' && <button className="button button-secondary" onClick={() => setActiveNav('Applications')}><Users size={16} /> Review candidates</button>}</div></div>

          {activeNav === 'Overview' && role === 'admin' && <AdminOverview jobs={jobs} applications={applications} onGo={setActiveNav} onCreate={() => setModal('job')} />}
          {activeNav === 'Overview' && role === 'recruiter' && <RecruiterOverview applications={applications} jobs={jobs} onSelect={(id) => { setSelectedId(id); setActiveNav('Applications') }} />}
          {activeNav === 'Overview' && role === 'candidate' && <CandidateOverview applications={applications.filter((app) => app.email === 'you@example.com')} jobs={openJobs} onBrowse={() => setActiveNav('Browse jobs')} onApply={apply} />}

          {isJobList && <JobsView role={role} jobs={filteredJobs} applications={applications} onApply={apply} onToggle={(job) => saveJobs(jobs.map((item) => item.id === job.id ? { ...item, status: item.status === 'Open' ? 'Closed' : 'Open' } : item))} />}
          {activeNav === 'Recruiters' && <RecruitersView onInvite={() => setModal('recruiter')} />}
          {isAppList && !selected && <ApplicationsView role={role} applications={filteredApps} jobs={jobs} onSelect={(id) => setSelectedId(id)} />}
          {isAppList && selected && <ApplicationDetail role={role} application={selected} jobTitle={jobName(selected.jobId)} onBack={() => setSelectedId(null)} onAdvance={(stage) => advance(selected, stage)} onWithdraw={() => withdraw(selected)} noteDraft={noteDraft} onNoteChange={setNoteDraft} onSaveNote={addNote} onSchedule={() => setModal('interview')} />}
        </div>
        <footer className="footer"><span>© 2026 Nowshera Digital</span><span><ShieldCheck size={14} /> Private hiring workspace</span><button onClick={() => showNotice('Demo workspace. No real emails or files are sent.')}>Demo environment</button></footer>
      </main>

      {modal && <Modal title={modal === 'job' ? 'Create a job' : modal === 'recruiter' ? 'Invite a recruiter' : 'Schedule interview'} onClose={() => setModal(null)}>{modal === 'job' ? <div className="form-stack"><label>Job title<input autoFocus placeholder="e.g. Senior Product Designer" value={newJobTitle} onChange={(event) => setNewJobTitle(event.target.value)} /></label><label>Department<select defaultValue="Design"><option>Design</option><option>Engineering</option><option>People</option><option>Data</option></select></label><label>Last date<input type="date" defaultValue="2026-11-15" /></label><button className="button button-primary full-button" onClick={addJob}>Publish job <ArrowRight size={16} /></button></div> : modal === 'recruiter' ? <div className="form-stack"><p className="modal-copy">A secure invite link will be sent to the recruiter's work email.</p><label>Full name<input placeholder="e.g. Ali Raza" /></label><label>Work email<input type="email" placeholder="name@nowsheradigital.com" /></label><label>Assigned jobs<select><option>Choose jobs...</option>{openJobs.map((job) => <option key={job.id}>{job.title}</option>)}</select></label><button className="button button-primary full-button" onClick={() => { setModal(null); showNotice('Recruiter invite created (demo).') }}>Send invite <ArrowRight size={16} /></button></div> : <div className="form-stack"><p className="modal-copy">Interviews are reserved for one hour. Recruiter availability is checked before confirmation.</p><label>Date<input type="date" min={new Date().toISOString().slice(0, 10)} value={interviewDate} onChange={(event) => setInterviewDate(event.target.value)} /></label><label>Start time<input type="time" value={interviewTime} onChange={(event) => setInterviewTime(event.target.value)} /></label><label>Location or meeting link<input placeholder="Meeting room or video call URL" /></label><button className="button button-primary full-button" onClick={scheduleInterview}>Schedule interview <CalendarDays size={16} /></button></div>}</Modal>}
      {notice && <div className="toast"><span><Check size={15} /></span>{notice}<button aria-label="Dismiss" onClick={() => setNotice('')}><X size={15} /></button></div>}
    </div>
  )
}

function AdminOverview({ jobs, applications, onGo, onCreate }: { jobs: Job[]; applications: Application[]; onGo: (nav: string) => void; onCreate: () => void }) {
  const active = applications.filter((app) => !['Rejected', 'Hired', 'Withdrawn'].includes(app.stage)).length
  return <>
    <section className="metric-grid"><Metric label="Open positions" value={jobs.filter((job) => job.status === 'Open').length.toString().padStart(2, '0')} delta="Across 4 departments" icon={<BriefcaseBusiness size={18} />} tone="green" /><Metric label="Active applicants" value={active.toString().padStart(2, '0')} delta="↑ 12% this month" icon={<Users size={18} />} tone="blue" /><Metric label="Interviews this week" value={applications.filter((app) => app.stage === 'Interview').length.toString().padStart(2, '0')} delta="2 awaiting feedback" icon={<CalendarDays size={18} />} tone="orange" /><Metric label="Time to hire" value="18d" delta="↓ 3 days vs last month" icon={<Clock3 size={18} />} tone="violet" /></section>
    <div className="dashboard-grid"><section className="panel pipeline-panel"><div className="panel-head"><div><h2>Hiring pipeline</h2><p>Applications by current stage</p></div><button className="text-button" onClick={() => onGo('Applications')}>View applications <ArrowRight size={15} /></button></div><div className="pipeline-total"><strong>{active}</strong><span>active applications</span><span className="trend-pill"><ArrowDownRight size={13} /> 8.4%</span></div><div className="pipeline-bars">{stageOrder.slice(0, 4).map((stage, index) => { const count = applications.filter((app) => app.stage === stage).length; const widths = ['100%', '62%', '44%', '23%']; return <div className="pipeline-row" key={stage}><span>{stage}</span><div className="bar-track"><div className={`bar-fill bar-${index}`} style={{ width: widths[index] }} /></div><b>{count.toString().padStart(2, '0')}</b></div> })}</div><div className="pipeline-footer"><span><i className="legend-dot" /> Applications received</span><span>Last 30 days <ChevronDown size={14} /></span></div></section>
      <section className="panel source-panel"><div className="panel-head"><div><h2>Hiring snapshot</h2><p>September 2026</p></div><button className="icon-button subtle-icon" aria-label="More snapshot options"><MoreHorizontal size={18} /></button></div><div className="snapshot-circle"><div><strong>74<span>%</span></strong><small>roles on track</small></div></div><div className="snapshot-legend"><span><i className="legend-dot dot-green" /> On track <b>7 roles</b></span><span><i className="legend-dot dot-soft" /> Needs attention <b>2 roles</b></span></div><div className="snapshot-note"><Sparkles size={15} /><span>2 roles have had no new applicants in 7 days.</span></div></section></div>
    <section className="panel table-panel"><div className="panel-head"><div><h2>Open positions</h2><p>Roles currently accepting applications</p></div><div className="head-controls"><button className="filter-button" onClick={() => onGo('Jobs')}><Filter size={15} /> All jobs <ChevronDown size={13} /></button><button className="button button-small button-secondary" onClick={onCreate}><Plus size={15} /> Add role</button></div></div><JobsTable jobs={jobs.filter((job) => job.status === 'Open').slice(0, 3)} /></section>
  </>
}

function RecruiterOverview({ applications, jobs, onSelect }: { applications: Application[]; jobs: Job[]; onSelect: (id: string) => void }) {
  const active = applications.filter((app) => !['Rejected', 'Hired', 'Withdrawn'].includes(app.stage))
  return <><section className="metric-grid"><Metric label="Assigned roles" value="03" delta="Across Design & Product" icon={<BriefcaseBusiness size={18} />} tone="green" /><Metric label="Candidates to review" value={active.filter((app) => app.stage === 'Applied').length.toString().padStart(2, '0')} delta="Your review is needed" icon={<Users size={18} />} tone="blue" /><Metric label="Upcoming interviews" value={applications.filter((app) => app.interview).length.toString().padStart(2, '0')} delta="Next: Oct 02, 10:00 AM" icon={<CalendarDays size={18} />} tone="orange" /><Metric label="Awaiting your feedback" value="01" delta="Interview completed" icon={<MessageSquareText size={18} />} tone="violet" /></section><section className="panel table-panel"><div className="panel-head"><div><h2>Needs your attention</h2><p>Applications in your assigned roles</p></div><span className="quiet-badge">{active.length} active</span></div><ApplicationsTable applications={active.slice(0, 4)} jobs={jobs} onSelect={onSelect} /></section></>
}

function CandidateOverview({ applications, jobs, onBrowse, onApply }: { applications: Application[]; jobs: Job[]; onBrowse: () => void; onApply: (job: Job) => void }) {
  return <><section className="candidate-welcome"><div className="welcome-mark"><Sparkles size={21} /></div><div><div className="eyebrow">WELCOME TO YOUR NEXT CHAPTER</div><h2>Good things start with a first step.</h2><p>Explore open roles and find a place where your work can make an impact.</p></div><button className="button button-primary" onClick={onBrowse}>Explore open roles <ArrowRight size={16} /></button></section><section className="metric-grid candidate-metrics"><Metric label="Applications" value={applications.length.toString().padStart(2, '0')} delta="Your active applications" icon={<FileText size={18} />} tone="green" /><Metric label="In progress" value={applications.filter((app) => !['Rejected', 'Hired', 'Withdrawn'].includes(app.stage)).length.toString().padStart(2, '0')} delta="We’ll keep you updated" icon={<Clock3 size={18} />} tone="blue" /><Metric label="Interviews" value={applications.filter((app) => app.interview).length.toString().padStart(2, '0')} delta="Check your application timeline" icon={<CalendarDays size={18} />} tone="orange" /></section><section className="panel table-panel"><div className="panel-head"><div><h2>Roles you might like</h2><p>Open opportunities at Nowshera Digital</p></div><button className="text-button" onClick={onBrowse}>Browse all roles <ArrowRight size={15} /></button></div><JobCards jobs={jobs.slice(0, 3)} applications={applications} onApply={onApply} /></section></>
}

function JobsView({ role, jobs, applications, onApply, onToggle }: { role: PortalRole; jobs: Job[]; applications: Application[]; onApply: (job: Job) => void; onToggle: (job: Job) => void }) {
  const visibleJobs = role === 'candidate' ? jobs.filter((job) => job.status === 'Open') : jobs
  return <section className="panel table-panel standalone-panel"><div className="panel-head"><div><h2>{role === 'candidate' ? 'Open opportunities' : 'All job postings'}</h2><p>{visibleJobs.length} roles · Updated just now</p></div><button className="filter-button"><Filter size={15} /> Filter <ChevronDown size={13} /></button></div>{role === 'candidate' ? <JobCards jobs={visibleJobs} applications={applications.filter((app) => app.email === 'you@example.com')} onApply={onApply} /> : <JobsTable jobs={visibleJobs} onToggle={role === 'admin' ? onToggle : undefined} />}</section>
}

function RecruitersView({ onInvite }: { onInvite: () => void }) {
  const recruiters = [{ name: 'Fatima Ali', email: 'fatima.ali@nowsheradigital.com', initials: 'FA', roles: 'Product Designer, UX Researcher', status: 'Active' }, { name: 'Usman Tariq', email: 'usman.tariq@nowsheradigital.com', initials: 'UT', roles: 'Frontend Engineer', status: 'Active' }, { name: 'Hira Shah', email: 'hira.shah@nowsheradigital.com', initials: 'HS', roles: 'People Operations Associate', status: 'Invited' }]
  return <section className="panel table-panel standalone-panel"><div className="panel-head"><div><h2>Recruiter access</h2><p>Manage team members and assigned roles</p></div><button className="button button-small button-primary" onClick={onInvite}><UserRoundPlus size={15} /> Invite recruiter</button></div><div className="recruiter-list">{recruiters.map((person) => <div className="recruiter-row" key={person.email}><div className="avatar">{person.initials}</div><div className="recruiter-name"><b>{person.name}</b><small>{person.email}</small></div><div className="recruiter-jobs"><span>Assigned roles</span><b>{person.roles}</b></div><span className={`status-chip ${person.status === 'Active' ? 'status-open' : 'status-applied'}`}>{person.status}</span><button className="icon-button subtle-icon" aria-label={`Options for ${person.name}`}><MoreHorizontal size={18} /></button></div>)}</div></section>
}

function ApplicationsView({ role, applications, jobs, onSelect }: { role: PortalRole; applications: Application[]; jobs: Job[]; onSelect: (id: string) => void }) {
  const visible = role === 'candidate' ? applications.filter((app) => app.email === 'you@example.com') : applications
  return <section className="panel table-panel standalone-panel"><div className="panel-head"><div><h2>{role === 'candidate' ? 'Your applications' : 'All applications'}</h2><p>{visible.length} applications · Sorted by recent activity</p></div><button className="filter-button"><Filter size={15} /> Stage <ChevronDown size={13} /></button></div><ApplicationsTable applications={visible} jobs={jobs} onSelect={onSelect} /></section>
}

function ApplicationDetail({ role, application, jobTitle, onBack, onAdvance, onWithdraw, noteDraft, onNoteChange, onSaveNote, onSchedule }: { role: PortalRole; application: Application; jobTitle: string; onBack: () => void; onAdvance: (stage: ApplicationStage) => void; onWithdraw: () => void; noteDraft: string; onNoteChange: (value: string) => void; onSaveNote: () => void; onSchedule: () => void }) {
  const currentIndex = stageOrder.indexOf(application.stage)
  return <div className="detail-view"><button className="back-link" onClick={onBack}>← Back to applications</button><div className="detail-heading"><div className="avatar avatar-large">{application.initials}</div><div className="detail-person"><div className="eyebrow">APPLICATION {application.id}</div><h2>{application.candidate}</h2><p>{application.email} <span>·</span> {jobTitle}</p></div><StageBadge stage={application.stage} /><button className="icon-button subtle-icon detail-more" aria-label="More actions"><MoreHorizontal size={19} /></button></div><div className="detail-grid"><div className="detail-main"><section className="panel detail-panel"><div className="panel-head"><div><h2>Application progress</h2><p>Applied {application.applied}</p></div></div><div className="stage-track">{stageOrder.map((stage, index) => <div className={`stage-step ${index <= currentIndex && currentIndex >= 0 ? 'stage-complete' : ''}`} key={stage}><span>{index < currentIndex ? <Check size={13} /> : index + 1}</span><small>{stage}</small></div>)}</div>{application.stage === 'Interview' && <div className="interview-banner"><CalendarDays size={17} /><span><b>Interview scheduled</b><small>{application.interview ?? 'Details to be confirmed'} · 1 hour</small></span><button className="text-button">View details <ArrowRight size={14} /></button></div>}{role === 'candidate' && application.stage !== 'Withdrawn' && <button className="text-button withdraw-button" onClick={onWithdraw}>Withdraw application</button>}{role !== 'candidate' && !['Hired', 'Rejected'].includes(application.stage) && <div className="detail-actions">{application.stage === 'Shortlisted' && <button className="button button-secondary" onClick={onSchedule}><CalendarDays size={15} /> Schedule interview</button>}<button className="button button-primary" onClick={() => onAdvance(stageOrder[currentIndex + 1] ?? 'Hired')}>{application.stage === 'Offer' ? 'Mark as hired' : `Move to ${stageOrder[currentIndex + 1]}`} <ArrowRight size={15} /></button><button className="text-button reject-button" onClick={() => onAdvance('Rejected')}>Reject</button></div>}</section><section className="panel detail-panel"><div className="panel-head"><div><h2>Resume</h2><p>Submitted with this application</p></div><button className="text-button"><FileText size={15} /> Preview CV</button></div><div className="cv-file"><div className="pdf-icon"><FileText size={19} /></div><span><b>{application.cv}</b><small>PDF document · Private</small></span><button className="icon-button subtle-icon" aria-label="Download CV"><ArrowDownRight size={17} /></button></div></section></div><aside className="detail-aside">{role !== 'candidate' && <><section className="panel detail-panel"><div className="panel-head"><div><h2>AI CV summary</h2><p>Generated from candidate CV</p></div><span className="ai-pill"><Sparkles size={12} /> AI</span></div><div className="ai-summary"><div className="ai-section"><b>Profile</b><ul><li>Product designer with 4 years of experience</li><li>Strong user research and prototyping skills</li></ul></div><div className="ai-section"><b>Requirements mentioned</b><p>Figma, design systems, accessibility</p></div><div className="ai-section"><b>Consider exploring</b><p>Ask about collaboration with engineering teams.</p></div><button className="text-button">View full summary <ArrowRight size={14} /></button></div><p className="ai-disclaimer">AI-generated. Use as a reading aid only. No scoring or hiring decisions.</p></section><section className="panel detail-panel notes-panel"><div className="panel-head"><div><h2>Private notes</h2><p>Visible to assigned recruiters and admins</p></div><MessageSquareText size={16} /></div>{application.note ? <div className="saved-note">“{application.note}”<small>Fatima Ali · Sep 25, 2026</small></div> : <p className="empty-note">No notes yet. Add context for your hiring team.</p>}<textarea value={noteDraft} onChange={(event) => onNoteChange(event.target.value)} placeholder="Add a private note..." rows={3} /><button className="button button-secondary button-small" onClick={onSaveNote}>Save note</button></section></>}</aside></div></div>
}

function JobsTable({ jobs, onToggle }: { jobs: Job[]; onToggle?: (job: Job) => void }) {
  return <div className="table-scroll"><table><thead><tr><th>POSITION</th><th>DEPARTMENT</th><th>APPLICANTS</th><th>LAST DATE</th><th>STATUS</th>{onToggle && <th />}</tr></thead><tbody>{jobs.map((job, index) => <tr key={job.id}><td><div className="job-cell"><span className={`job-icon job-icon-${index % 4}`}><BriefcaseBusiness size={16} /></span><span><b>{job.title}</b><small>{job.location}</small></span></div></td><td><span className="department-text">{job.department}</span></td><td><span className="applicant-count">{[12, 8, 6, 4][index % 4]} <small>applicants</small></span></td><td>{new Date(`${job.lastDate}T00:00:00`).toLocaleDateString('en', { month: 'short', day: '2-digit' })}, 2026</td><td><StatusChip status={job.status} /></td>{onToggle && <td><button className="text-button table-action" onClick={() => onToggle(job)}>{job.status === 'Open' ? 'Close' : 'Reopen'}</button></td>}</tr>)}</tbody></table>{jobs.length === 0 && <EmptyState title="No matching jobs" detail="Try changing your search or filters." />}</div>
}

function ApplicationsTable({ applications, jobs, onSelect }: { applications: Application[]; jobs: Job[]; onSelect: (id: string) => void }) {
  return <div className="table-scroll"><table><thead><tr><th>CANDIDATE</th><th>POSITION</th><th>APPLIED</th><th>STAGE</th><th /></tr></thead><tbody>{applications.map((app) => <tr key={app.id} onClick={() => onSelect(app.id)} className="clickable-row"><td><div className="person-cell"><div className="avatar">{app.initials}</div><span><b>{app.candidate}</b><small>{app.email}</small></span></div></td><td>{jobs.find((job) => job.id === app.jobId)?.title ?? 'Role removed'}</td><td>{app.applied}</td><td><StageBadge stage={app.stage} /></td><td><button className="icon-button row-arrow" aria-label={`Open ${app.candidate} application`} onClick={() => onSelect(app.id)}><ChevronRight size={17} /></button></td></tr>)}</tbody></table>{applications.length === 0 && <EmptyState title="No applications yet" detail="New applications will appear here." />}</div>
}

function JobCards({ jobs, applications, onApply }: { jobs: Job[]; applications: Application[]; onApply: (job: Job) => void }) {
  return <div className="job-card-list">{jobs.map((job, index) => { const alreadyApplied = applications.some((app) => app.jobId === job.id && !['Rejected', 'Withdrawn'].includes(app.stage)); return <article className="job-card" key={job.id}><span className={`job-icon job-icon-${index % 4}`}><BriefcaseBusiness size={17} /></span><div className="job-card-content"><div className="job-card-top"><span className="department-text">{job.department}</span><span className="job-posted">Posted 3 days ago</span></div><h3>{job.title}</h3><div className="job-meta"><span>{job.location}</span><span>{job.type}</span><span>{job.openings} {job.openings === 1 ? 'opening' : 'openings'}</span></div><p>{job.description}</p></div><button className={`button ${alreadyApplied ? 'button-applied' : 'button-secondary'} job-apply`} disabled={alreadyApplied} onClick={() => onApply(job)}>{alreadyApplied ? 'Applied' : 'Apply now'} {alreadyApplied ? <Check size={15} /> : <ArrowRight size={15} />}</button></article>})}{jobs.length === 0 && <EmptyState title="No open roles right now" detail="Check back soon for new opportunities." />}</div>
}

function Metric({ label, value, delta, icon, tone }: { label: string; value: string; delta: string; icon: React.ReactNode; tone: string }) {
  return <div className="metric-card"><div className={`metric-icon metric-${tone}`}>{icon}</div><span className="metric-label">{label}</span><strong className="metric-value">{value}</strong><span className="metric-delta">{delta}</span></div>
}

function StageBadge({ stage }: { stage: ApplicationStage }) {
  const label = stage === 'Shortlisted' ? 'Shortlisted' : stage
  return <span className={`stage-badge stage-${stage.toLowerCase()}`}><i />{label}</span>
}

function StatusChip({ status }: { status: string }) { return <span className={`status-chip ${status === 'Open' ? 'status-open' : 'status-closed'}`}><i />{status}</span> }

function EmptyState({ title, detail }: { title: string; detail: string }) { return <div className="empty-state"><Search size={19} /><b>{title}</b><span>{detail}</span></div> }

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-header"><h2 id="modal-title">{title}</h2><button className="icon-button subtle-icon" onClick={onClose} aria-label="Close dialog"><X size={18} /></button></div>{children}</section></div>
}

export default App