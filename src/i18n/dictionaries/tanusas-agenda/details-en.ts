import type { AgendaDetails } from '@/config/tanusas-agenda';

export const detailsEn: AgendaDetails = {
  cenaJueves: {
    notes: ['Read about each participant’s experience and professional role beforehand to understand their perspectives and make the most of their knowledge.'],
  },
  raices: {
    objective: 'One real blocker and one necessary condition per person.',
    steps: [
      { title: 'The territory' },
      { title: 'Intention', body: 'Imagine and test a capital architecture for ecological integrity and integral territorial transformation towards BioProsperity. Validate the premises and develop or strengthen an operational hypothesis we can test.' },
      { title: 'Opening round', body: 'Why must we evolve the way we mobilise and connect capital with territories? In which direction? What must change for capital to enable more integral, resilient and long-term territorial transformation?' },
      { title: 'A question to sleep on', body: 'What must change for capital to truly enable systemic territorial transformation?' },
    ],
  },
  bloque1: {
    objective: 'An agreed shared problem.',
    hypotheses: [
      { n: 1, body: 'Supporting territorial transformation requires a different financial logic from financing individual projects or companies in isolation.' },
      { n: 2, title: 'Capital stacking, sequencing and orchestration', items: [
        { name: 'Capital stacking', body: 'Integral territorial transformation probably needs different forms of capital to finance different functions. Integral capital, beyond biodiversity alone.' },
        { name: 'Capital sequencing', body: 'Combining capital is not enough: it probably needs to enter and leave at different times as capabilities, risks and opportunities evolve.' },
        { name: 'Capital orchestration', body: 'If multiple actors and forms of capital must act over 10–20 years, a missing coordination function may be needed to make that sequence intentional and repeatable.' },
      ] },
      { n: 3, body: 'A coordination layer could add value without managing a principal pool of capital. It could connect intelligence, preparation, aggregation, access to capital, standards, data, evidence, technology and shared learning. Which functions are missing, which exist already and what architecture could fulfil them?' },
    ],
    notes: ['More money mobilised is not the final outcome of territorial transformation.', 'Not everything is blended finance. Some parts of BioProsperity should be financed as public goods, public budgets, philanthropy or commercial investment without blending.'],
    questions: ['Which of our three hypotheses have been strengthened, which need revision and what fourth hypothesis has emerged?', 'Is there a coordination function that nobody is adequately performing today?'],
  },
  bloque2: {
    objective: 'Functions an architecture must be able to finance or connect to support integral territorial transformation.',
    hypotheses: [
      { n: 4, body: 'Transformation must be managed integrally, even when capital is deployed modularly.' },
      { n: 5, title: 'Recirculation and continuity', body: 'Recirculation: part of the value returns to the system. Continuity: horizons longer than a project cycle. Are there other principles?' },
      { n: 6, body: 'BioProsperity does not necessarily aggregate all capital into one vehicle. It can aggregate the transformation logic that allows different capital to finance different parts of one territorial pathway.' },
      { n: 7, body: 'The aim is not necessarily to integrate all capital. It is to integrate the transformation pathway.' },
      { n: 8, body: 'The architecture does not need to turn everything into financial assets. It must allow different forms of value to coexist and reinforce one another within a single transformation pathway.' },
    ],
    questions: ['Can we have integral transformation without creating a single integral financial instrument?'],
    prompts: ['What do these different realities tell us about what a capital architecture must do that separate funding tracks for conservation, companies, communities and infrastructure cannot achieve?', 'How could a capital architecture start from territorial priorities and forms of organisation instead of asking territories to adapt to capital?', 'How do we avoid requiring territories to translate everything they value into something monetisable or investable?', 'How should capital be sequenced if capabilities take two years to mature, a company needs funding today and restoration needs twenty years?'],
  },
  bloque3: {
    hypotheses: [
      { n: 9, title: 'What capital should optimise', body: 'A capital architecture for BioProsperity should optimise not only financial returns or capital mobilised, but the strength and resilience of the territorial system it aims to enable.' },
      { n: 10, body: 'The main additionality of BioProsperity Systems may lie in honest broker, market architect or orchestrator functions, rather than in owning or directly managing capital.' },
      { n: 11, title: 'How we observe that strengthening', body: 'Systemic variables can show whether a territory is increasing its ability to generate, retain and recirculate value and sustain BioProsperity over time.', items: [
        { name: 'Territorial value retention and recirculation', body: 'The proportion of generated value that remains, returns or is reinvested in the territory rather than extracted.' },
        { name: 'Ecosystem integrity and functionality', body: 'The ability of natural systems to maintain or recover their functions, biodiversity and regenerative capacity.' },
        { name: 'Territorial adaptive capacity', body: 'The ability of actors, organisations and institutions to learn, innovate, respond to change and collectively adjust the system’s pathway.' },
        { name: 'Maturity of territorial governance', body: 'The ability to make legitimate decisions, coordinate actors, manage tensions, distribute responsibilities and sustain agreements.' },
        { name: 'Capital interoperability', body: 'The ability of capital sources, instruments and financial actors to complement, sequence and evolve around a shared pathway rather than act in isolation.' },
        { name: 'Territorial reciprocity and connectivity', body: 'The quality of value flows with cities, markets, institutions and networks, and whether these strengthen local capabilities and return value to the territory.' },
        { name: 'Cross-cutting property: territorial resilience', body: 'The ability to absorb shocks, adapt to change and maintain fundamental ecological, economic, social and cultural functions.' },
        { name: 'Outcome: BioProsperity', body: 'A territorial pathway that generates prosperity and wellbeing while strengthening its natural, cultural and social foundations. A systemic outcome of the other dimensions.' },
      ] },
    ],
    questions: ['Are these the right variables for understanding whether capital strengthens a territorial system?', 'Which are measurable, which can influence capital decisions and what are we missing?'],
    notes: ['A capital platform does not manage a principal pool of capital. It provides intelligence, preparation, aggregation, matching, standards, data and technology infrastructure, evidence, knowledge capture and open distribution; it connects existing capital.'],
  },
  bloque4: {
    objective: 'Architecture v.01: territorial, hybrid and regional functions, regionalisation criteria and three priority regional capabilities.',
    hypotheses: [
      { n: 12, title: 'Regional capital architecture', body: 'Regional architecture should not centralise territorial decisions or necessarily concentrate capital. It should share functions where infrastructure creates scale, reduces friction or expands access, while keeping purpose, priorities and value distribution under territorial governance.', groups: [
        { name: 'Remains territorial', items: ['Transformation purpose and priorities', 'Governance and decision-making', 'The local definition of value and BioProsperity', 'Selection and prioritisation of opportunities', 'Cultural and biocultural safeguards', 'Rights and decisions over assets, knowledge and data', 'Value distribution, retention and recirculation', 'Relationships with actors and territorial legitimacy'] },
        { name: 'Hybrid: regional infrastructure, territorial decisions', items: ['Opportunity preparation', 'Aggregation', 'Due diligence', 'Measurement and evidence', 'Data governance', 'Instrument design', 'Risk management'] },
        { name: 'Shared regional infrastructure', items: ['Pipeline intelligence and visibility', 'Project preparation', 'Shared methodologies, standards and tools', 'Reusable due diligence components', 'Aggregation where it creates scale', 'Capital matching and investor connections', 'Intelligence on capital sources, instruments and terms', 'Technology and data infrastructure', 'Evidence, measurement and comparative learning', 'Knowledge capture and distribution', 'Reusable financial instruments', 'Regional relationships with financial institutions and funds'] },
      ] },
      { n: 13, title: 'Regionalisation criteria', body: 'A function should move partly or wholly to regional infrastructure only when it adds demonstrable value compared with solving it territory by territory, without reducing territorial agency or unnecessarily displacing local capabilities.', listLabel: 'Additionality may come from', list: ['Lower cost, time or duplication', 'Higher quality or specialised capabilities', 'Greater access to capital or markets', 'Aggregation or scale', 'Learning and knowledge reuse across territories', 'Capabilities or infrastructure that would not be viable for a single territory'] },
    ],
  },
  bloque5: {
    objective: 'Regional architecture: a twelve-month MVP and a five-year ambition.',
    hypotheses: [{ n: 14, title: 'Coordination must create enough value for every actor', body: 'Regional architecture can sustain itself only if territories, financiers, companies, the public sector and other actors gain enough value from participating to prefer coordination over working separately.' }],
    prompts: ['What can we build and test in twelve months, and what should our five-year ambition be?', 'Where do existing platforms, funds or capabilities already fulfil these functions, and where would building something new add value?', 'What must a minimum architecture demonstrate in its first twelve months to justify evolving into something more sophisticated?', 'Who pays for this infrastructure and who maintains it?'],
    matrix: { head: ['12 months', '5 years'], rows: [
      ['Functions', 'What must exist?', 'What could exist?'], ['Capital', 'Must we manage it?', 'Could we need our own vehicle?'], ['Territories', 'Where do we test?', 'What scale do we seek?'], ['Partners', 'Who do we build with?', 'What ecosystem do we need?'], ['Economic model', 'Who finances the MVP?', 'Who sustains the infrastructure?'], ['Evidence', 'What must we demonstrate?', 'What would regional success mean?'],
    ] },
  },
  bloque6: { objective: 'Five to seven principles.' },
  bloque7: {
    objective: 'More clarity on who coordinates, who decides and who pays.',
    hypotheses: [{ n: 15, title: 'Governance of the architecture', body: 'Regional architecture must coordinate without unnecessarily concentrating power, be legitimate to territories and capital actors, define decision rights and accountability, and create incentives for independent actors to share capabilities, information and opportunities.', listLabel: 'Functions', list: ['Define purpose and priorities', 'Originate and select opportunities', 'Prepare', 'Define standards', 'Steward and govern data', 'Decide concessionality', 'Match', 'Deploy capital', 'Measure and learn', 'Account for results'] }],
    prompts: ['Where is institutional capture most likely and what minimum checks and balances are needed?', 'Does the architecture need an honest broker between territories and capital providers? What would make both sides see it as legitimate?', 'Can one actor coordinate, prepare, select opportunities and manage capital without conflicts of interest?', 'What must each actor gain to prefer coordination over acting alone?', 'Who gains enough to help sustain the infrastructure, and what part is market infrastructure or a public good?', 'What perverse incentives might emerge depending on who pays?'],
    round: 'One minute per person: from your position in the system, what would have to be true for you to trust, participate or put resources behind this architecture?',
  },
  bloque8: {
    objective: 'Two or three experiment briefs with a hypothesis, capital, partner, evidence and a decision gate, plus a viability dashboard.',
    hypotheses: [{ n: 16, title: 'Minimum model of regional viability', items: [
      { name: 'A. Reduced friction', body: 'Time and cost of preparing and connecting an opportunity compared with the baseline.' },
      { name: 'B. Pipeline', body: 'Number and value of opportunities with enough information to be evaluated.' },
      { name: 'C. Capital crowd-in', body: 'Capital committed and actually deployed by third parties.' },
      { name: 'D. Capital diversity', body: 'Number of sources and instruments, and participation of local capital.' },
      { name: 'E. Additionality', body: 'What happened because of the catalytic layer that would not otherwise have happened.' },
      { name: 'F. Territorial value retention', body: 'The proportion of economic value that remains or recirculates in the territory.' },
      { name: 'G. Reuse and replicability', body: 'Components reused across territories without rebuilding from scratch.' },
    ] }],
  },
};
