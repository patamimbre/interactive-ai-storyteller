import { createFileRoute } from '@tanstack/react-router'
import { InteractiveStoryteller } from '../components/InteractiveStoryteller'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-5xl font-black text-center mb-12 uppercase tracking-wider border-4 border-black bg-accent text-accent-foreground py-6 px-8 shadow-[8px_8px_0px_0px_#000000] transform rotate-1">
          AI Storyteller
        </h1>
        <InteractiveStoryteller />
      </div>

      {/* Footer */}
      <footer className="bg-card border-t-2 border-black p-4">
        <div className="container mx-auto text-center space-y-2">
          <a
            href="https://github.com/patamimbre/interactive-ai-storyteller"
            target="_blank"
            rel="noopener noreferrer"
            className="font-black uppercase tracking-wider text-sm hover:text-foreground transition-colors block"
          >
            VIEW SOURCE CODE
          </a>
          <a
            href="https://gecm.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="font-black uppercase tracking-wider text-xs hover:text-foreground transition-colors block text-muted-foreground"
          >
            BY GECM.DEV
          </a>
        </div>
      </footer>
    </div>
  )
}
