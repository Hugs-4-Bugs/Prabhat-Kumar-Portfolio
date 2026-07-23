const fs = require('fs');
let code = fs.readFileSync('src/components/ai-search.tsx', 'utf8');

code = code.replace(
  '      let meetingContext = undefined;',
  `      const isMeetingLikely = profile.meetingProbability > 60 || profile.meetingSignalDetected;
      let meetingContext = undefined;
      
      if (!engine.session && isMeetingLikely) {
         meetingContext = "Visitor Intelligence indicates this user might want a meeting. Proactively and politely suggest they can schedule a meeting with Prabhat if they'd like. Keep it natural.";
      }`
);

code = code.replace(
  'const isMeetingLikely = profile.meetingProbability > 60 || profile.meetingSignalDetected;', // remove duplicate
  ''
);

fs.writeFileSync('src/components/ai-search.tsx', code);
