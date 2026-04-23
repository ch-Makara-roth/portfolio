# Agent Team Workflow Guide

## Overview

This project uses a **multi-agent orchestration model** where specialized AI agents collaborate on tasks, each bringing domain expertise. The main AI acts as the orchestrator, routing tasks to the appropriate agents based on their descriptions and your prompts.

## Agent Roster

| Agent | Role | Trigger Keywords | Storage |
|-------|------|------------------|---------|
| **development-planner** | Project planning & task management | "plan", "break down", "estimate", "roadmap", "prioritize", "sprint" | `.qwen/agents/` |
| **architecture-agent** | System design & optimization | "architecture", "design", "optimize", "scalability", "performance", "algorithm" | `.qwen/agents/` |
| **ux-ui-designer** | UX/UI design & accessibility | "design", "UI", "UX", "accessible", "responsive", "animation", "theme" | `.qwen/agents/` |
| **senior-frontend-developer** | Code implementation | "implement", "create component", "write code", "fix bug", "refactor", "API route" | `.qwen/agents/` |
| **qa-testing-engineer** | Testing & quality assurance | "test", "write tests", "coverage", "accessibility test", "performance test" | `.qwen/agents/` |
| **security-auditor** | Security review & assessment | "audit", "security review", "vulnerability", "OWASP", "penetration test" | `.qwen/agents/` |
| **cybersecurity-specialist** | Security fixes & incident response | "fix security", "harden", "incident", "breach", "exploit", "patch vulnerability" | `.qwen/agents/` |

## Skill Roster

| Skill | Purpose | Trigger Keywords | Storage |
|-------|---------|------------------|---------|
| **architecture-and-algorithm** | Architecture guidelines & patterns | "architecture", "algorithm", "system design", "data flow" | `.qwen/skills/` |
| **ux-ui-design** | Design system & UX guidelines | "design system", "UX guidelines", "color palette", "typography" | `.qwen/skills/` |

## Agent Workflows

### Workflow 1: New Feature Development

```
User: "I want to add a blog filtering feature"
    ↓
1. development-planner
   - Breaks down feature into tasks
   - Creates implementation plan
   - Identifies dependencies
   - Estimates complexity
   - Creates todo list
    ↓
2. architecture-agent (if complex)
   - Designs data flow
   - Proposes architecture
   - Considers performance impact
   - Reviews scalability
    ↓
3. ux-ui-designer
   - Designs filter UI
   - Defines interaction patterns
   - Specifies responsive behavior
   - Ensures accessibility
    ↓
4. senior-frontend-developer
   - Implements API route for filtering
   - Creates filter UI component
   - Adds state management
   - Integrates with existing code
    ↓
5. qa-testing-engineer
   - Writes unit tests for filter logic
   - Tests component interactions
   - Validates accessibility
   - Checks edge cases
    ↓
6. security-auditor
   - Reviews API input validation
   - Checks for injection risks
   - Validates rate limiting
    ↓
User reviews completed feature
```

### Workflow 2: Bug Fix

```
User: "The contact form is submitting empty messages"
    ↓
1. development-planner
   - Creates bug fix plan
   - Identifies severity and priority
   - Lists affected files
   - Defines acceptance criteria
    ↓
2. senior-frontend-developer
   - Investigates root cause
   - Fixes validation logic
   - Adds Zod schema validation
   - Tests fix locally
    ↓
3. qa-testing-engineer
   - Writes regression test
   - Tests all form validation rules
   - Verifies error messages display
   - Tests edge cases
    ↓
4. security-auditor
   - Checks for injection vulnerabilities
   - Reviews input sanitization
   - Validates email header injection prevention
    ↓
User verifies bug is fixed
```

### Workflow 3: Security Incident

```
User: "Someone found a vulnerability in the admin route"
    ↓
1. development-planner
   - Creates incident response plan
   - Sets priority to P0 (Critical)
   - Identifies affected systems
   - Plans containment strategy
    ↓
2. security-auditor
   - Assesses vulnerability
   - Determines exploitability
   - Documents findings
   - Rates severity
    ↓
3. cybersecurity-specialist
   - Implements immediate containment
   - Develops and deploys fix
   - Adds monitoring for exploit attempts
   - Hardens affected system
    ↓
4. senior-frontend-developer
   - Implements secure code patterns
   - Updates authentication logic
   - Adds proper error handling
    ↓
5. qa-testing-engineer
   - Tests fix resolves vulnerability
   - Ensures no regressions
   - Adds security regression tests
    ↓
6. development-planner
   - Updates security debt tracking
   - Schedules post-incident review
   - Documents lessons learned
    ↓
User reviews incident resolution
```

### Workflow 4: Performance Optimization

```
User: "The site is loading slowly, optimize it"
    ↓
1. development-planner
   - Creates optimization plan
   - Prioritizes by impact
   - Sets performance budgets
   - Defines success metrics
    ↓
2. architecture-agent
   - Analyzes current architecture
   - Identifies bottlenecks
   - Proposes optimization strategies
   - Reviews bundle size
   - Suggests caching improvements
    ↓
3. senior-frontend-developer
   - Implements code splitting
   - Optimizes images
   - Adds lazy loading
   - Memoizes expensive computations
   - Optimizes API queries
    ↓
4. ux-ui-designer
   - Adds loading states
   - Implements skeleton screens
   - Optimizes perceived performance
   - Reviews animation performance
    ↓
5. qa-testing-engineer
   - Runs Lighthouse audit
   - Measures Core Web Vitals
   - Tests on slow devices
   - Verifies no regressions
    ↓
User reviews performance improvements
```

### Workflow 5: Redesign/UX Improvement

```
User: "Let's improve the mobile experience"
    ↓
1. development-planner
   - Breaks down mobile improvements
   - Prioritizes user pain points
   - Creates implementation phases
    ↓
2. ux-ui-designer
   - Audits current mobile UX
   - Designs mobile-optimized layouts
   - Defines touch targets
   - Specifies mobile navigation
   - Creates responsive breakpoints
    ↓
3. senior-frontend-developer
   - Implements responsive components
   - Optimizes mobile interactions
   - Adds touch-friendly UI
   - Tests on mobile devices
    ↓
4. qa-testing-engineer
   - Tests on mobile devices
   - Verifies touch targets (>= 44px)
   - Checks mobile keyboard handling
   - Tests mobile navigation
   - Validates mobile performance
    ↓
User reviews mobile experience
```

## How to Use Agents

### Automatic Invocation (Recommended)
Simply describe what you want using trigger keywords:

```
"Plan out a new project detail page with image gallery"
→ development-planner creates task breakdown

"Design a new hero section with gradient background"
→ ux-ui-designer creates design specifications

"Implement the project card component"
→ senior-frontend-developer writes the code

"Write tests for the contact form validation"
→ qa-testing-engineer creates test suite

"Audit the API routes for security vulnerabilities"
→ security-auditor reviews and reports

"Fix the XSS vulnerability in the comment system"
→ cybersecurity-specialist implements the fix
```

### Explicit Invocation
Name the agent directly:

```
"Have the development planner create a roadmap for Q2"
"Ask the security auditor to review the auth system"
"Let the QA engineer test the new checkout flow"
```

### Parallel Agent Execution
For independent tasks, agents can work in parallel:

```
"Test the UI components and audit the API security"
→ qa-testing-engineer AND security-auditor work simultaneously
```

## Agent Communication Patterns

### Sequential (Dependencies)
```
Agent A → Agent B → Agent C
(Design) → (Implement) → (Test)
```

### Parallel (Independent)
```
         → Agent B (Test UI)
Agent A 
         → Agent C (Audit API)
(Plan)
```

### Iterative (Feedback Loop)
```
Agent A → Agent B → Agent A → Agent B
(Design) → (Code) → (Revise) → (Fix)
```

## Best Practices

### 1. Start with Planning
Always involve `development-planner` first for complex features. They create the roadmap that other agents follow.

### 2. Use Skills for Reference
Skills provide detailed guidelines that agents reference:
- `architecture-and-algorithm` skill → referenced by `architecture-agent`
- `ux-ui-design` skill → referenced by `ux-ui-designer`

### 3. Specify Acceptance Criteria
When requesting work, define what "done" looks like:

```
"Create a contact form with:
- Name, email, message fields
- Real-time validation
- Success/error feedback
- Spam protection
- Mobile responsive"
```

### 4. Review Between Stages
Don't wait for all agents to finish. Review incrementally:

```
"After design is done, let me review before implementation starts"
```

### 5. Track Progress
The `development-planner` uses `todo_write` to track progress. Ask for updates:

```
"What's the status of the blog feature?"
"Show me the current todo list"
```

### 6. Handle Blockers Early
If an agent identifies a blocker, address it immediately:

```
"If the architecture agent finds a fundamental flaw, stop and fix that first"
```

## Project Structure for Agents

```
.qwen/
├── agents/                          # Agent configurations
│   ├── architecture-agent.md        # System design expert
│   ├── ux-ui-designer.md            # Design specialist
│   ├── development-planner.md       # Planning & management
│   ├── senior-frontend-developer.md # Implementation lead
│   ├── qa-testing-engineer.md       # Testing & QA
│   ├── security-auditor.md          # Security review
│   └── cybersecurity-specialist.md  # Security fixes
│
├── skills/                          # Reference guidelines
│   ├── architecture-and-algorithm/  # Architecture patterns
│   │   └── SKILL.md
│   └── ux-ui-design/                # Design system
│       └── SKILL.md
│
└── QWEN.md                          # Project context
```

## Agent Capabilities Matrix

| Agent | Read | Write | Edit | Search | Run Commands | Manage Todos |
|-------|------|-------|------|--------|--------------|--------------|
| development-planner | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| architecture-agent | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| ux-ui-designer | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| senior-frontend-developer | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| qa-testing-engineer | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| security-auditor | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ |
| cybersecurity-specialist | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |

## Troubleshooting

### Agent Not Activating
**Problem**: You mention a task but the specialist agent doesn't activate

**Solutions**:
1. Use more specific keywords from the agent's description
2. Explicitly name the agent: "Have the [agent-name] do X"
3. Check that the agent `.md` file exists in `.qwen/agents/`
4. Restart Qwen Code to reload agents

### Agent Doing Too Much
**Problem**: One agent is doing work meant for another

**Solutions**:
1. Be more specific in your prompt about which aspect to focus on
2. Explicitly delegate: "Now have the QA engineer test this"
3. Use development-planner to coordinate task distribution

### Conflicting Agent Outputs
**Problem**: Two agents produce conflicting recommendations

**Solutions**:
1. Have development-planner resolve conflicts
2. Ask agents to explain their reasoning
3. Make the final decision yourself based on project priorities

### Agent Missing Context
**Problem**: Agent doesn't understand project conventions

**Solutions**:
1. Point to relevant files: "See tailwind.config.js for our theme"
2. Reference skills: "Use the ux-ui-design skill guidelines"
3. Provide context in your prompt

## Example Conversations

### Example 1: Simple Feature
```
You: "Add a dark/light theme toggle to the navbar"

AI: "I'll have the ux-ui-designer design the toggle, then the 
     senior-frontend-developer will implement it."

[ux-ui-designer activates]
→ Designs toggle button, specifies colors for both themes

[senior-frontend-developer activates]
→ Implements ThemeContext, adds toggle component, updates navbar

AI: "Theme toggle implemented. Want me to have QA test it?"
```

### Example 2: Complex Feature
```
You: "I want to add a real-time chat widget to the portfolio"

AI: "This is a multi-phase feature. Let me have the development-planner 
     create a comprehensive plan."

[development-planner activates]
→ Creates phased plan: infrastructure → UI → integration → testing

AI: "Here's the plan. Phase 1 is setting up WebSocket infrastructure. 
     Should I have the architecture-agent design the data flow?"

You: "Yes, and also have the security-auditor review it since it'll 
     handle user messages"

AI: "Great call. I'll have architecture-agent design the WebSocket 
     architecture, then security-auditor will review for vulnerabilities."

[architecture-agent activates] → [security-auditor activates]
[senior-frontend-developer activates] → [qa-testing-engineer activates]
```

### Example 3: Security Issue
```
You: "The security-auditor should review our admin authentication"

[security-auditor activates]
→ Reviews middleware.ts, finds hardcoded token comparison
→ Reports: "CRITICAL: Admin auth uses simple string comparison, 
   vulnerable to timing attacks"

You: "Have the cybersecurity-specialist fix this immediately"

[cybersecurity-specialist activates]
→ Implements proper JWT authentication
→ Adds token expiration and refresh
→ Secures cookie settings

You: "Now have QA test the new auth flow"

[qa-testing-engineer activates]
→ Tests login flow, token expiration, invalid tokens
→ Verifies no regressions in admin functionality
```

## Metrics & KPIs

Track team effectiveness:
- **Task Completion Rate**: Tasks completed per session
- **Agent Activation Accuracy**: Correct agent chosen / total activations
- **Rework Rate**: Tasks that needed to be redone
- **Security Issues Found**: Vulnerabilities caught before production
- **Test Coverage**: Percentage of code covered by tests
- **Performance Budget**: Bundle size, LCP, CLS trends

## Continuous Improvement

After major features or incidents:
1. **Retrospective**: What worked well? What didn't?
2. **Update Agents**: Refine agent descriptions based on learnings
3. **Update Skills**: Add new patterns and anti-patterns
4. **Process Improvement**: Adjust workflows for efficiency
5. **Documentation**: Update this guide with new patterns

## Resources
- Agent configurations: `.qwen/agents/`
- Skill guidelines: `.qwen/skills/`
- Project context: `QWEN.md`
- Project structure: See `README.md`
- Deployment: See `DEPLOYMENT_SETUP.md`
