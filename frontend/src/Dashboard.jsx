import { useState } from 'react'
import { generateBriefing } from './api/advisor.js'


import {
  Bell,
  BellRing,
  Search,
  LayoutDashboard,
  Users,
  Sparkles,
  FileText,
  Settings,
  LogOut,
  HelpCircle,
  ChevronDown,
  ArrowUpRight,
  ArrowRight,
  CircleAlert,
  CircleCheck,
  Clock3,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react'



import './Dashboard.css'

function Dashboard({ session }) {
  const [aiBriefing, setAiBriefing] = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')

  const handleBriefing = async (client) => {
    if (aiLoading) return

    setSelectedClient(client)
    setAiLoading(true)
    setAiError('')
    setAiBriefing(null)

  try {
    const data = await generateBriefing(client.id, session)
    setAiBriefing(data.briefing)
  } catch (err) {
    setAiError(err.message)
  } finally {
    setAiLoading(false)
  }
}
  const clients = [
      {
        id: 'client-001',
        name: 'Sarah Lee',
        initials: 'SL',
        status: 'Needs to be reviewed',
        focus: 'Retirement Planning',
        risk: 'Moderate',
        insight: 'Client is interested in exploring retirement options and wants to ensure a stable income post-retirement.' +
               'They have expressed concerns about market volatility and are looking for a balanced approach to their investment portfolio.',
        facts: [
            'Client Retirement Target: 65 years old',
            'Client risk tolerance recently changed',

        ],
        updated: '5 hours ago'

    },
    {
      id: 'client-002',
      name: 'Marcus Bennett',
      initials: 'MB',
      status: 'Reviewed',
        focus: 'Wealth Growth',
        risk: 'High',
        insight: 'Client is focused on aggressive growth strategies and is open to higher risk investments for potential higher returns.' +
                'They have a diversified portfolio but are looking for new opportunities in emerging markets.',
        facts: [
            'Recently changed employment status',
            'Income information updated',
            'Long-term investment strategy revised',
        ],
        updated: '2 days ago'
    },
    {
      id: 'client-003',
      name: 'Elena Rivera',
      initials: 'ER',
      status: 'Needs to be reviewed',
        focus: 'Estate Planning',
        risk: 'Low',
        insight: 'Client is interested in estate planning and ensuring their assets are distributed according to their wishes.' +
                'They have expressed interest in setting up trusts and exploring tax-efficient strategies for wealth transfer.',
        facts: [
            'Client has recently updated their will',
            'Trust fund established for children',
            'Estate planning documents need review'
        ],
        updated: 'yesterday'
    }
]

  return (
    <div className="dashboardPage">

        {/*sidebar goes here*/}

        <aside className="sidebar">

        <div className="sidebarLogo">
          <div className="logoMark">
            O
          </div>

          <span>Oriented</span>
        </div>

        <div className="sidebarSection">
          <span className="sidebarLabel">WORKSPACE</span>

          <button className="navItem active">
            <LayoutDashboard size={18} />
            <span>Overview</span>
          </button>

          <button className="navItem">
            <Users size={18} />
            <span>Clients</span>
            <span className="navBadge">12</span>
          </button>

          <button className="navItem">
            <Sparkles size={18} />
            <span>AI Briefings</span>
            <span className="navBadge">12</span>
          </button>

          <button className="navItem">
            <FileText size={18} />
            <span>Documents</span>
          </button>
        </div>

        <div className="sidebarBottom">

          <button className="navItem">
            <HelpCircle size={18} />
            <span>Help & Support</span>
          </button>

          <button className="navItem">
            <Settings size={18} />
            <span>Settings</span>
          </button>

          <button className="navItem">
            <LogOut size={18} />
            <span>Log out</span>
          </button>

          <div className="sidebarProfile">

            <div className="profileAvatar">
              JJ
            </div>

            <div className="profileText">
              <strong>Julia Lawrence</strong>
              <span>New Advisor</span>
            </div>

            <ChevronDown size={16} />

          </div>

        </div>

      </aside>

      {/* main content goes here */}

      
      <main className="dashboardContent">

        {/* top bar section goes here */}

        <header className="topBar">

          <div className="breadcrumb">
            Workspace
            <span>/</span>
            Overview
          </div>

          <div className="topActions">

            <div className="searchBox">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search clients..."
              />
              <span className="searchShortcut">
                ⌘ K
              </span>
            </div>

            <button className="notificationButton">
               <Bell className="bellIcon" size={15} />
               <BellRing className="bellRingIcon" size={15} />
               <span className="notificationDot"></span>
            </button>

          </div>

        </header>


        {/* the page content goes here */}

        <div className="pageContent">

          {/*advisor section*/}

          <section className="advisorSection">

            <div>

              <div className="advisorEyebrow">
                ADVISOR ONBOARDING
              </div>

              <h1>
                Good morning, Julia.
              </h1>

              <p>
                Your client onboarding overview is ready.
                Here's what's new since your last login:
              </p>

            </div>

            <div className="dateDisplay">
              <span>Friday, October 2</span>
              <strong>2026</strong>
            </div>

          </section>


          {/* AI integration  goes here*/}

          <section className="aiBanner">

            <div className="aiBannerIcon">
              <Sparkles size={22} />
            </div>

            <div className="aiBannerContent">

              <div className="aiBannerTitle">
                <span>AI onboarding complete</span>
                <span className="aiStatus">
                  <CircleCheck size={13} />
                  Ready
                </span>
              </div>

              <p>
                We've analyzed your 12 assigned clients and
                prepared personalized briefings to help you
                get up to speed faster.
              </p>

            </div>

            <button className="aiBannerButton">
              View briefings
              <ArrowRight size={16} />
            </button>

          </section>


          {/* client stats section is here */}

          <section className="statsGrid">

            <div className="statCard">

              <div className="statTop">
                <div className="statIcon blue">
                  <Users size={18} />
                </div>

                <span className="statTrend">
                  +12
                </span>
              </div>

              <span className="statLabel">
                Clients assigned
              </span>

              <strong>
                12
              </strong>

              <span className="statDescription">
                Clients assigned to you
              </span>

            </div>


            <div className="statCard">

              <div className="statTop">
                <div className="statIcon purple">
                  <Sparkles size={18} />
                </div>

                <span className="statTrend">
                  100%
                </span>
              </div>

              <span className="statLabel">
                AI briefings
              </span>

              <strong>
                12
              </strong>

              <span className="statDescription">
                Profiles analyzed
              </span>

            </div>


            <div className="statCard">

              <div className="statTop">
                <div className="statIcon green">
                  <CircleCheck size={18} />
                </div>

                <span className="statTrend">
                  50%
                </span>
              </div>

              <span className="statLabel">
                Reviewed
              </span>

              <strong>
                6
              </strong>

              <span className="statDescription">
                Half of onboarding completed
              </span>

            </div>


            <div className="statCard attentionCard">

              <div className="statTop">
                <div className="statIcon orange">
                  <CircleAlert size={18} />
                </div>

                <span className="attentionText">
                  Action needed
                </span>
              </div>

              <span className="statLabel">
                Need attention
              </span>

              <strong>
                4
              </strong>

              <span className="statDescription">
                Important changes detected
              </span>

            </div>

          </section>


          {/* client info section is here */}

          <section className="clientSection">

            <div className="sectionHeader">

              <div>

                <div className="sectionEyebrow">
                  PRIORITY CLIENTS
                </div>

                <h2>
                  Start your review
                </h2>

                <p>
                  AI identified these clients as the most
                  important to review first.
                </p>

              </div>

              <button className="viewAllButton">
                View all clients
                <ArrowRight size={15} />
              </button>

            </div>


            <div className="clientGrid">

              {clients.map((client) => (

                <article
                  className="clientCard"
                  key={client.name}
                >

                  <div className="clientCardTop">

                    <div className="clientIdentity">

                      <div className="clientAvatar">
                        {client.initials}
                      </div>

                      <div>

                        <h3>
                          {client.name}
                        </h3>

                        <div className="clientMeta">
                          <span>{client.focus}</span>
                          <span className="metaDot"></span>
                          <span>{client.risk} risk</span>
                        </div>

                      </div>

                    </div>

                    <span
                      className={`clientStatus ${
                        client.status === 'Reviewed'
                          ? 'reviewed'
                          : 'attention'
                      }`}
                    >

                      {client.status === 'Reviewed' ? (
                        <CircleCheck size={12} />
                      ) : (
                        <CircleAlert size={12} />
                      )}

                      {client.status}

                    </span>

                  </div>


                  {/* AI review is here */}

                  <div className="insightBox">

                    <div className="insightHeader">

                      <div className="insightIcon">
                        <Sparkles size={14} />
                      </div>

                      <span>
                        AI INSIGHT
                      </span>

                    </div>

                    <p>
                      {client.insight}
                    </p>

                  </div>


                  {/* Client Facts goes here */}

                  <div className="clientFacts">

                    {client.facts.map((fact) => (

                      <div
                        className="clientFact"
                        key={fact}
                      >

                        <span className="factCheck">
                          <CircleCheck size={12} />
                        </span>

                        {fact}

                      </div>

                    ))}

                  </div>


                  {/* Footer section is here */}

                  <div className="clientCardFooter">

                    <div className="updatedTime">
                      <Clock3 size={13} />
                      Updated {client.updated}
                    </div>

                  <button
                    className="briefingButton"
                    onClick={() => handleBriefing(client)}
                    disabled={aiLoading}
                  >
                    {aiLoading && selectedClient?.id === client.id
                    ? 'Generating...'
                    : 'View briefing'}

                    <ArrowUpRight size={15} />
                  </button>

                  </div>

                </article>

              ))}

            </div>
            {aiError && (
              <div className="ai-live-briefing">
                <p>{aiError}</p>
              </div>
            )}

            {aiBriefing && selectedClient && (
              <div className="ai-live-briefing">
                <div className="sectionEyebrow">LIVE AI BRIEFING</div>

              <h2>{selectedClient.name}</h2>

              <p>{aiBriefing.clientSummary}</p>

              <h3>Portfolio Highlights</h3>
              <ul>
                {aiBriefing.portfolioHighlights?.map((item, index) => (
                  <li key={index}>{item.finding}</li>
              ))}
            </ul>

            <h3>Needs Attention</h3>
            <ul>
              {aiBriefing.attentionItems?.map((item, index) => (
                <li key={index}>
                  <strong>{item.priority}:</strong> {item.finding}
                </li>
              ))}
            </ul>

            <h3>Questions for Client</h3>
            <ul>
              {aiBriefing.questionsForClient?.map((question, index) => (
                <li key={index}>{question}</li>
            ))}
          </ul>
        </div>
      )}
          </section>


          {/* Bottom grid of UI goes here */}

          <section className="bottomGrid">

            <div className="activityCard">

              <div className="smallCardHeader">

                <div>
                  <span className="sectionEyebrow">
                    ONBOARDING PROGRESS
                  </span>

                  <h3>
                    Your progress
                  </h3>
                </div>

                <TrendingUp size={18} />

              </div>

              <div className="progressRow">

                <div className="progressCircle">
                  50%
                </div>

                <div className="progressInfo">

                  <strong>
                    6 of 12 clients reviewed
                  </strong>

                  <span>
                    Keep going — you're halfway through!
                  </span>

                  <div className="progressBar">
                    <div className="progressFill"></div>
                  </div>

                </div>

              </div>

            </div>


            <div className="securityCard">

              <div className="securityIcon">
                <ShieldCheck size={20} />
              </div>

              <div>

                <span>
                  SECURE WORKSPACE
                </span>

                <strong>
                  Your client data is protected
                </strong>

                <p>
                  Oriented keeps sensitive client information
                  within your secure advisor workspace.
                </p>

              </div>

            </div>

          </section>

        </div>

      </main>

    </div>
  )
}

export default Dashboard
        






