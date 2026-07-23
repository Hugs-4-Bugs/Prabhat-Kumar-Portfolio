/**
 * Intent signal definitions.
 * Each definition contains regex patterns that match user language
 * and a weight (1–10) indicating how strongly it signals that intent.
 *
 * To add a new intent: append a new IntentDefinition here.
 * No other file needs to change.
 */

import type { IntentDefinition, IntentId } from "./intent-types";

export const INTENT_DEFINITIONS: IntentDefinition[] = [
  {
    id: "recruiter",
    label: "Recruiter",
    signals: [
      { patterns: [/\brecruit/i, /\bhiring\b/i, /\bopen\s+role/i, /\bjob\s+opening/i], weight: 9 },
      { patterns: [/\bposition\b/i, /\bopening\b/i, /\bvacancy/i], weight: 7 },
      { patterns: [/\btalent\b/i, /\bcandidate\b/i, /\bsource\b.*\bdev/i], weight: 6 },
      { patterns: [/\bresume/i, /\bcv\b/i], weight: 5 },
      { patterns: [/\blinkedin\b/i], weight: 4 },
    ],
    suggestTopics: ["Work Experience", "Skills & Expertise", "Resume Information", "Professional Background"],
  },
  {
    id: "hiring_manager",
    label: "Hiring Manager",
    signals: [
      { patterns: [/\bhiring\s+manager/i, /\bmanager.*hire/i], weight: 10 },
      { patterns: [/\bteam.*grow/i, /\bgrow.*team/i, /\badd.*engineer/i], weight: 8 },
      { patterns: [/\bfit.*team/i, /\bteam\s+fit/i, /\bculture\s+fit/i], weight: 7 },
      { patterns: [/\bcompensation/i, /\bsalary/i, /\bpackage/i], weight: 6 },
      { patterns: [/\bexperience.*year/i, /\byear.*experience/i], weight: 5 },
    ],
    suggestTopics: ["Work Experience", "Projects", "Technical Expertise", "Professional Background"],
  },
  {
    id: "hr",
    label: "HR",
    signals: [
      { patterns: [/\bhr\b/i, /\bhuman\s+resource/i, /\bpeople\s+ops/i], weight: 10 },
      { patterns: [/\bonboarding/i, /\bbackground\s+check/i, /\bverif/i], weight: 8 },
      { patterns: [/\bnoticep\s+period/i, /\bnotice\s+period/i, /\bavailability/i], weight: 7 },
      { patterns: [/\bcontract/i, /\boffer\s+letter/i], weight: 6 },
    ],
    suggestTopics: ["Professional Background", "Work Experience", "Contact Information"],
  },
  {
    id: "technical_interviewer",
    label: "Technical Interviewer",
    signals: [
      { patterns: [/\btechnical\s+interview/i, /\bcode\s+review/i, /\btest\b.*skill/i], weight: 10 },
      { patterns: [/\balgorithm/i, /\bdata\s+structure/i, /\bcoding\s+challenge/i], weight: 9 },
      { patterns: [/\bspring\s*boot/i, /\bmicroservice/i, /\bsystem\s+design/i], weight: 7 },
      { patterns: [/\bjava\b/i, /\baws\b/i, /\barchitecture/i], weight: 5 },
    ],
    suggestTopics: ["Technical Expertise", "Projects", "Skills & Expertise"],
  },
  {
    id: "engineering_manager",
    label: "Engineering Manager",
    signals: [
      { patterns: [/\bengineering\s+manager/i, /\bem\b/i], weight: 10 },
      { patterns: [/\blead.*team/i, /\bteam.*lead/i, /\bsenior.*eng/i], weight: 8 },
      { patterns: [/\barchitecture\s+decision/i, /\btech\s+lead/i], weight: 8 },
      { patterns: [/\bscalability/i, /\bperformance/i, /\bdelivery/i], weight: 5 },
    ],
    suggestTopics: ["Technical Expertise", "Work Experience", "Projects"],
  },
  {
    id: "startup_founder",
    label: "Startup Founder",
    signals: [
      { patterns: [/\bfounder/i, /\bco-?founder/i, /\bstartup/i], weight: 10 },
      { patterns: [/\bproduct.*vision/i, /\bvision.*product/i, /\bmvp/i], weight: 9 },
      { patterns: [/\bsaas/i, /\bproduct.*market\s+fit/i, /\btraction/i], weight: 8 },
      { patterns: [/\binvest/i, /\bfund/i, /\bcapital/i], weight: 6 },
      { patterns: [/\bbuil(d|ding)\s+(a|an)?\s*(product|company|startup)/i], weight: 9 },
    ],
    suggestTopics: ["Entrepreneurship", "Product Information", "Founder Vision", "Technical Expertise"],
  },
  {
    id: "potential_client",
    label: "Potential Client",
    signals: [
      { patterns: [/\bhire.*you/i, /\byour.*service/i, /\bengage/i], weight: 10 },
      { patterns: [/\bconsult/i, /\bcontract\s+work/i, /\bfreelance/i], weight: 9 },
      { patterns: [/\bproject\s+budget/i, /\brate\b/i, /\bhourly/i], weight: 8 },
      { patterns: [/\bwork.*together/i, /\btogether.*work/i], weight: 7 },
      { patterns: [/\bquote/i, /\bprice/i, /\bcost/i], weight: 6 },
    ],
    suggestTopics: ["Product Information", "Technical Expertise", "Contact Information"],
  },
  {
    id: "investor",
    label: "Investor",
    signals: [
      { patterns: [/\binvest/i, /\bvc\b/i, /\bventure/i], weight: 10 },
      { patterns: [/\broi\b/i, /\breturn.*invest/i, /\bgrowth\s+rate/i], weight: 9 },
      { patterns: [/\bmarket\s+size/i, /\btam\b/i, /\bscal/i], weight: 8 },
      { patterns: [/\bfunding\s+round/i, /\bseed\b/i, /\bseries/i], weight: 9 },
    ],
    suggestTopics: ["Founder Vision", "Product Information", "Entrepreneurship"],
  },
  {
    id: "collaboration_request",
    label: "Collaboration",
    signals: [
      { patterns: [/\bcollaborate/i, /\bcollaboration/i, /\bwork.*together/i], weight: 10 },
      { patterns: [/\bpartner/i, /\bjoint.*project/i, /\bteam\s*up/i], weight: 9 },
      { patterns: [/\bopen\s+source/i, /\bcontribute/i, /\bpr\b/i], weight: 6 },
    ],
    suggestTopics: ["Social Profiles", "Contact Information", "Projects"],
  },
  {
    id: "open_source_contributor",
    label: "Open Source Contributor",
    signals: [
      { patterns: [/\bgithub/i, /\bopen[\s-]source/i, /\bpull\s+request/i, /\bpr\b/i], weight: 9 },
      { patterns: [/\bfork/i, /\bcontribute/i, /\bcontribution/i], weight: 8 },
      { patterns: [/\brepository/i, /\brepo\b/i, /\bcommit/i], weight: 6 },
    ],
    suggestTopics: ["Social Profiles", "Projects", "Technical Expertise"],
  },
  {
    id: "student",
    label: "Student",
    signals: [
      { patterns: [/\bstudent/i, /\buniversity/i, /\bcollege/i, /\bdegree/i], weight: 10 },
      { patterns: [/\blearn.*from\b/i, /\bmentor/i, /\bguid/i], weight: 7 },
      { patterns: [/\binternship/i, /\bfresh.*grad/i, /\bentry.*level/i], weight: 8 },
      { patterns: [/\bassignment/i, /\bproject.*help/i], weight: 6 },
    ],
    suggestTopics: ["Education", "Skills & Expertise", "Career Journey"],
  },
  {
    id: "general_learner",
    label: "General Learner",
    signals: [
      { patterns: [/\bhow\s+do/i, /\bexplain/i, /\bwhat\s+is\b/i, /\bwhat\s+are\b/i], weight: 6 },
      { patterns: [/\blearn\b/i, /\bunderstand/i, /\bcurious/i], weight: 5 },
      { patterns: [/\bteach/i, /\btutorial/i, /\bguide/i], weight: 7 },
    ],
    suggestTopics: ["Technical Expertise", "Projects", "Career Journey"],
  },
  {
    id: "media_press",
    label: "Media / Press",
    signals: [
      { patterns: [/\bpress\b/i, /\bjournalist/i, /\barticle/i, /\binterview/i], weight: 10 },
      { patterns: [/\bfeature\b.*story/i, /\bprofile\b/i, /\bnewsletter/i], weight: 9 },
      { patterns: [/\bquote\b/i, /\bpublish/i, /\bpodcast/i], weight: 8 },
    ],
    suggestTopics: ["Professional Background", "Founder Vision", "Product Information", "Contact Information"],
  },
  {
    id: "general_visitor",
    label: "Portfolio Visitor",
    signals: [
      { patterns: [/\bportfolio/i, /\bprabhat/i, /\bwork\b/i, /\bproject/i], weight: 3 },
      { patterns: [/\bshow\s+me/i, /\btell\s+me/i], weight: 2 },
    ],
    suggestTopics: ["Professional Background", "Projects", "Skills & Expertise"],
  },
];

/** Returns the definition for a given intent id */
export function getIntentDefinition(id: IntentId): IntentDefinition | undefined {
  return INTENT_DEFINITIONS.find((d) => d.id === id);
}
