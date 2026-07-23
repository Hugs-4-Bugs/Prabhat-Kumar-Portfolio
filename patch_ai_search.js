const fs = require('fs');
let code = fs.readFileSync('src/components/ai-search.tsx', 'utf8');

// 1. Add hook import
code = code.replace(
  'import { useVisitorIntelligence } from "@/lib/visitor/use-visitor-intelligence";',
  'import { useVisitorIntelligence } from "@/lib/visitor/use-visitor-intelligence";\nimport { useMeetingEngine } from "@/lib/meeting/meeting-engine";\nimport { extractMeetingFieldsAction } from "@/app/actions";'
);

// 2. Remove preFillRef
code = code.replace(
  /.*const preFillRef.*(\n.*const preFillRef.*)?\n/,
  ''
);
// Remove extractFieldsFromMessage invocation
code = code.replace(
  /\/\/ Phase 7: accumulate field values extracted from natural language[\s\S]*?preFillRef\.current = \{[\s\S]*?\};\n/,
  ''
);
// 3. Add engine
code = code.replace(
  'const { analyse: analyseVisitor, reset: resetVisitorProfile } = useVisitorIntelligence();',
  'const { analyse: analyseVisitor, reset: resetVisitorProfile, profile } = useVisitorIntelligence();\n  const engine = useMeetingEngine();'
);

// 4. Update handleSubmit
code = code.replace(
  /const wantsMeeting = hasMeetingIntent\(currentQuery\);[\s\S]*?if \(wantsMeeting\) \{[\s\S]*?setTimeout\(\(\) => setIsSchedulingOpen\(true\), 400\);[\s\S]*?\}/,
  `const isMeetingLikely = profile.meetingProbability > 60 || profile.meetingSignalDetected;
      const wantsMeeting = hasMeetingIntent(currentQuery) && isMeetingLikely;

      const isCollecting = engine.session && engine.session.state === 'collecting';
      
      let meetingContext = undefined;
      
      if (wantsMeeting && !engine.session) {
        // Open the meeting engine!
        engine.open();
        setIsSchedulingOpen(true);
      }
      
      if (engine.session && engine.session.state === 'collecting') {
         // Extract fields from user message
         const extraction = await extractMeetingFieldsAction(currentQuery, engine.data);
         if (extraction.success && extraction.data) {
           Object.entries(extraction.data).forEach(([key, val]) => {
             if (val) engine.setField(key as any, val);
           });
         }
         
         // Build a prompt injection so QuantumAI asks for the next missing field!
         const remaining = engine.getRemainingFields();
         if (remaining.length > 0) {
           const nextMsg = engine.nextQuestion();
           meetingContext = \`The user is currently scheduling a meeting. You must ask the user for their missing information ONE BY ONE.
           Missing fields remaining: \${remaining.join(", ")}.
           Next question you must ask: "\${nextMsg}".
           Acknowledge their answer briefly, then ask the next question.\`;
         } else {
           meetingContext = \`The user just provided the last piece of information for the meeting schedule! 
           All required fields collected. Tell the user you have compiled their meeting request and please review the meeting panel on the screen to confirm submission.\`;
         }
      }

      const response = wantsMeeting && !engine.session
        ? { success: true, answer: getMeetingIntentReply() }
        : await getAISearchResponse(currentQuery, history, undefined, meetingContext);

      if (response.success && response.answer) {
        console.log('[AISearch] Assistant response received, appending once');
        setConversation(prev => {
          const updated = [...prev, { role: 'model' as const, content: response.answer as string }];
          updateIntent(currentQuery, updated);
          analyseVisitor(currentQuery, updated);
          return updated;
        });
      }`
);

// Remove the placeholder function at the bottom
code = code.replace(
  /function extractFieldsFromMessage[\s\S]*?\}\n/,
  ''
);

fs.writeFileSync('src/components/ai-search.tsx', code);
