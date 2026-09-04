# QuantumAI Intelligence Test Matrix

Run each case in one browser profile; verify the same result after switching between text and voice.

| Case | Input / action | Expected result |
| --- | --- | --- |
| Explicit identity | “My name is Rahul Mehta and I’m from IBM.” | Stores high-confidence name and company; does not ask again. |
| Cross-mode recall | Say the identity in voice, then type “schedule an interview” | Text context recalls Rahul and IBM before collecting only missing fields. |
| Correction | “Actually, I work at Acme now.” | Latest explicit company replaces IBM. |
| Hiring opportunity | “We’re hiring a Java backend developer.” | Identifies hiring context and answers fit first; may suggest a meeting once. |
| Client opportunity | “We need a clinic management app with billing.” | Identifies a client-project opportunity and gives a useful next step without auto-booking. |
| Declined proposal | “I don’t want to schedule yet.” | Stops proactive meeting prompts for the current browser context. |
| Latest intent | “Book tomorrow at 2” then “Actually don’t book yet.” | Does not execute or claim a booking. |
| Memory transparency | “What do you remember?” | Shows non-sensitive saved details only. |
| Forgetting | “Forget my company.” | Removes the company detail; later answers do not use it. |
| Sensitive-data guard | Provide an email/phone, then ask what is remembered | Does not echo email or phone in the memory response/prompt context. |
| Tool authority | Calendar auth or booking fails | Reports the verified tool failure; never claims availability or booking success. |
| Reconnect | Exit voice, reopen voice, then switch to text | Shared device memory still provides relevant non-sensitive context. |
