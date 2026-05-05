# Prabhat Kumar - The Software Alchemist Portfolio

Welcome to the source code for my personal portfolio website, a showcase of my skills in software development, AI integration, and modern web technologies. This project is not just a portfolio; it's a demonstration of what's possible with a cutting-edge tech stack.

**Live Demo:** [prabhat.online](https://prabhat.online/)


<img width="1440" height="900" alt="Screenshot 2025-12-08 at 6 09 56 PM" src="https://github.com/user-attachments/assets/e09c10a4-6aae-4f52-a906-55d7de6b30f4" />


<img width="1440" height="900" alt="Screenshot 2025-12-08 at 6 09 20 PM" src="https://github.com/user-attachments/assets/6a41da9e-d6b1-457b-a5bd-afe8eed17efb" />



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
- **Form Handling**: React Hook Form, Zod (for validation), FormSubmit.co
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
    Create a `.env` file in the root of the project and add your Google AI API key.
    ```
    GEMINI_API_KEY=your_google_ai_api_key_here
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:9002`.

##  deploying on vercel

This project is configured for easy deployment on Vercel. Simply connect your GitHub repository to a new Vercel project, and it will automatically build and deploy the application. The `vercel.json` file is already included.

## 🙏 Acknowledgements

- **ShadCN/UI** for the fantastic component library.
- **GreenSock (GSAP)** for the powerful animation platform.
- **Studio Freight** for the `Lenis` smooth-scroll library.
- **Google** for the Genkit framework that powers the AI features.

---

Made with ❤️ by Prabhat Kumar.
