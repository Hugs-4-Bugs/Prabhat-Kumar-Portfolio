const fs = require('fs');
let code = fs.readFileSync('src/components/VoiceAgent.tsx', 'utf8');

// 1. Add hook import
code = code.replace(
  'import { getVisitorContextHint } from "@/lib/visitor/visitor-engine";',
  'import { getVisitorContextHint } from "@/lib/visitor/visitor-engine";\nimport { useMeetingEngine } from "@/lib/meeting/meeting-engine";\nimport { extractMeetingFieldsAction } from "@/app/actions";\nimport { useVisitorIntelligence } from "@/lib/visitor/use-visitor-intelligence";'
);

// 2. Add hook usage
code = code.replace(
  'const pendingTimeoutsRef = useRef<NodeJS.Timeout[]>([]);',
  `const pendingTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  
  const engine = useMeetingEngine();
  const { profile } = useVisitorIntelligence();`
);

// 3. Inject meeting context in handleUserSpeech
code = code.replace(
  'const result = await getVoiceAIResponse(',
  `      const isCollecting = engine.session && engine.session.state === 'collecting';
      let meetingContext = undefined;
      
      if (isCollecting) {
         // Extract fields from user message
         const extraction = await extractMeetingFieldsAction(input, engine.data);
         if (extraction.success && extraction.data) {
           Object.entries(extraction.data).forEach(([key, val]) => {
             if (val) engine.setField(key as any, val);
           });
         }
         
         const remaining = engine.getRemainingFields();
         if (remaining.length > 0) {
           const nextMsg = engine.nextQuestion();
           meetingContext = \`The user is scheduling a meeting. You must ask them for their missing info ONE BY ONE.
           Remaining missing fields: \${remaining.join(", ")}.
           Next question to ask: "\${nextMsg}".
           Acknowledge their answer briefly, then ask the next question naturally (spoken style).\`;
         } else {
           meetingContext = \`The user just provided the last piece of information!
           All fields collected. Tell the user you've got everything and the meeting request is ready to confirm on their screen.\`;
         }
      }

      const result = await getVoiceAIResponse(`
);

// 4. Update the arguments passed to getVoiceAIResponse
code = code.replace(
  /agentRef\.current\.id\n\s*\);/,
  `agentRef.current.id,
        undefined, // visitorContext
        meetingContext
      );`
);

fs.writeFileSync('src/components/VoiceAgent.tsx', code);
