# QuantumAI Live Voice Test Matrix

Run these checks in a deployed HTTPS environment with `GEMINI_API_KEY`, a valid Google Calendar configuration, and microphone access. Mark each case with the browser, device, language, result, and any transcript mismatch.

| # | Voice input or action | Expected result |
| --- | --- | --- |
| 1 | “Hi” | Brief, natural greeting; session remains active. |
| 2 | “Hi, I’m a hiring manager from IBM.” | Retains IBM and identifies a hiring context. |
| 3 | “I’m hiring a Java backend developer with 3+ years experience.” | Understands role requirements without opening booking. |
| 4 | “Before scheduling, is Prabhat suitable?” | Answers fit first, then optionally offers a meeting. |
| 5 | “Okay, now let’s schedule an interview.” | Opens the existing meeting flow only after explicit intent. |
| 6 | “My name is Vivek Sharma from ABC Technologies.” | Captures full name and company. |
| 7 | “My email is vivek@example.com and my phone is 9876543210.” | Captures contact details without re-asking known fields. |
| 8 | “I’m free this Sunday at 2 PM.” | Extracts the time request; asks only for genuine ambiguity. |
| 9 | 45–90 seconds of uninterrupted speech | One coherent turn; no truncation or premature response. |
| 10 | Pause for 1–2 seconds, then continue | Retains the entire utterance as one turn. |
| 11 | Speak while QuantumAI is replying | Playback stops immediately; no stale chunk resumes. |
| 12 | Hindi question | Hindi response and understandable transcript. |
| 13 | Hinglish question | Natural Hinglish response. |
| 14 | Switch Hindi to English mid-session | Follows the current dominant language. |
| 15 | Imperfect pronunciation | Uses context for known technical terms; clarifies uncertain names. |
| 16 | Java, Spring Boot, REST API, PostgreSQL, Gemini, Google Calendar | Technical terms remain intelligible in transcript and response. |
| 17 | Portfolio question | Gives a grounded, concise answer. |
| 18 | “How can I contact Prabhat?” | Answers in the current conversation context. |
| 19 | “I need an application for my clinic.” | Identifies client/business intent and asks a useful discovery question. |
| 20 | Long client requirement | Summarizes requirements without reading back a form. |
| 21 | Client explicitly asks to schedule | Opens existing meeting UI through the Live tool. |
| 22 | Choose a busy calendar slot | Existing scheduling flow reports real conflict and alternatives. |
| 23 | Choose a free calendar slot | Existing scheduling flow creates the calendar event and confirmation. |
| 24 | Provide all meeting fields in one sentence | Voice extraction fills all valid fields it can determine. |
| 25 | Correct a previously supplied name | Latest explicit correction is reflected in the meeting draft. |
| 26 | Say “hi” mid-conversation | Retains existing role/project context. |
| 27 | Interrupt during booking conversation | Stops audio; latest correction governs subsequent action. |
| 28 | Disconnect and reconnect network | Conversation and persisted meeting draft remain available after reconnect. |
| 29 | Close voice mode during playback | Mic, WebSocket, sources, and audio contexts are released. |
| 30 | Navigate away with mic active | Browser microphone indicator turns off; no background audio continues. |
| 31 | “Who are you?” after choosing Nova | Identifies itself as QuantumAI; explains Nova is only the selected voice style. |
| 32 | “Projects” | Gives a compact project overview; does not produce an ungrounded biography. |
| 33 | “Hi” mid-conversation | Continues the current context without restarting its introduction. |
| 34 | Give email, phone, project description, and time out of order | Preserves every valid detail and asks only for the next required field. |
| 35 | Ask for calendar availability before completing the form | States that availability is checked after required details and Save Request; never claims a submission. |
| 36 | Form progress is incomplete | Never says “sent”, “submitted”, “scheduled”, or “confirmed”. |
| 37 | Calendar request succeeds | States the meeting is confirmed only after the application returns a calendar event result. |
| 38 | Calendar request fails or conflicts | Clearly reports failure/conflict and leaves the draft available for correction. |
| 39 | Enter a past date or same-day past time | Date field shows a future-date/time error; Save Request remains disabled. |
| 40 | Change to a future date/time in another timezone | Validation updates immediately using that timezone and enables Save Request when all required fields are valid. |
| 41 | Expired Google refresh token | Shows an authorization-recovery error; no availability or booking success is claimed. |
