# Prabhat Kumar - The Software Alchemist Portfolio

Welcome to the source code for my personal portfolio website, a showcase of my skills in software development, AI integration, and modern web technologies. This project is not just a portfolio; it's a demonstration of what's possible with a cutting-edge tech stack.

**Live Demo:** [prabhat.online](https://prabhat.online/)

<img width="1440" height="900" alt="Screenshot 2026-05-07 at 6 25 22 AM" src="https://github.com/user-attachments/assets/bd6ad7cb-e83a-420d-b039-21ebaf3f3504" />


<img width="1440" height="900" alt="Screenshot 2026-05-07 at 6 24 36 AM" src="https://github.com/user-attachments/assets/45621933-154c-406b-aa22-4a9134fe23cb" />


<img width="1440" height="900" alt="Screenshot 2026-05-07 at 6 21 21 AM" src="https://github.com/user-attachments/assets/d3fe7194-e6a9-466b-955b-025ee0bfeb01" />


<img width="1440" height="900" alt="Screenshot 2026-05-07 at 6 25 41 AM" src="https://github.com/user-attachments/assets/58c4a1ba-0438-40a3-b1dc-fa54b7f51df4" />


<img width="1440" height="900" alt="Screenshot 2026-05-07 at 6 25 56 AM" src="https://github.com/user-attachments/assets/c3f99ebb-8f3d-47ae-bb88-1119fd976d5a" />


## ✨ Core Features

This portfolio is built with a rich set of features designed to provide an engaging and interactive user experience.

- **Interactive UI/UX**:
  - **Smooth Scrolling**: Implemented with `Lenis` and synchronized with GSAP for a fluid browsing experience.
  - **Engaging Animations**: Sections animate into view on scroll using `GSAP` and `ScrollTrigger`. Interactive elements use `Framer Motion` for fluid feedback.
  - **Custom Cursor**: A unique cursor that enhances the visual experience and highlights interactive elements.
  - **Responsive Design**: Fully responsive and optimized for a seamless experience across desktops, tablets, and mobile devices.
  - **Dark/Light Mode**: A theme toggler for user preference.

- **🤖 AI-Powered Capabilities (built with Genkit)**:
  - **Sharma AI Assistant**: A conversational chatbot trained on my professional data. It can answer questions about my skills, experience, projects, and even my book, "The Inner Battle." It features:
    - **Voice Input**: Users can speak their questions directly to the assistant.
    - **Audio-Response**: The assistant's answers are converted to speech and played back.
  - **AI Search**: A full-screen, immersive search experience that allows users to have a conversation and ask in-depth questions.
  - **AI Resume Analyzer**:
    - **Autofill Contact Form**: Upload a resume, and the AI will parse it to automatically fill in the name and email fields.
    - **Improvement Suggestions**: The AI provides actionable feedback on how to improve the uploaded resume.
  - **AI-Powered Services Showcase**: A "Project Description Analyzer" tool in the Services section demonstrates my ability to build practical AI tools.
  - **Contact Form Spam Detection**: The backend uses an AI flow to intelligently detect and filter out spam submissions.

- **Modern Tech Stack**:
  - **Next.js 15**: Leveraging the App Router, Server Components, and Server Actions for a high-performance, modern React framework.
  - **TypeScript**: Ensuring type safety and improved developer experience.
  - **Tailwind CSS & ShadCN/UI**: For a utility-first styling approach and a set of beautifully designed, accessible, and reusable components.

## 🚀 Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS, ShadCN/UI
- **Animation**: GSAP (ScrollTrigger), Framer Motion
- **Smooth Scrolling**: Lenis
- **AI Integration**: Google Genkit, Google AI Platform
- **Form Handling**: React Hook Form, Zod (for validation), Resend
- **Deployment**: Vercel

## 🛠️ Getting Started

To get this project running locally, follow these steps:

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Hugs-4-Bugs/Prabhat-Kumar-Portfolio.git
    cd Prabhat-Kumar-Portfolio
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Copy `.env.example` to `.env.local` and populate the services you use.
    `GEMINI_API_KEY` is required for AI features; Resend, ElevenLabs, and Google
    Calendar variables are required only for their corresponding integrations.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

##  deploying on vercel

This project is configured for Vercel. Add the production values from
`.env.example` in Vercel Project Settings before deploying, then run `npm run
typecheck`, `npm run lint`, and `npm run build` in a Node.js 18+ environment.

Google Calendar OAuth setup is development-only: obtain the refresh token from a
protected development environment, then add it to Vercel as
`GOOGLE_CALENDAR_REFRESH_TOKEN`. The OAuth setup route is disabled in production.

## 🙏 Acknowledgements

- **ShadCN/UI** for the fantastic component library.
- **GreenSock (GSAP)** for the powerful animation platform.
- **Studio Freight** for the `Lenis` smooth-scroll library.
- **Google** for the Genkit framework that powers the AI features.

---

Made with ❤️ by Prabhat Kumar.
