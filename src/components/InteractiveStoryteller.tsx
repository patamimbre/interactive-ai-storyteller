import { useState } from 'react'
import { experimental_useObject as useObject } from '@ai-sdk/react'
import { z } from 'zod'
import { EXAMPLE_TOPICS, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '../lib/constants'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

const StoryResponseSchema = z.object({
  description: z.string().describe('The story description/scenario'),
  suggestedActions: z.array(z.string()).describe('3-4 suggested actions for the user to take next'),
  imagePrompt: z.string().describe('Detailed 8-bit/pixel art style prompt for image generation'),
})

interface StoryState {
  topic: string | null
  image: string | null
  isGeneratingImage: boolean
}

export function InteractiveStoryteller() {
  const [storyState, setStoryState] = useState<StoryState>({
    topic: null,
    image: null,
    isGeneratingImage: false,
  })
  const [topicInput, setTopicInput] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState<string>(DEFAULT_LANGUAGE)

  const { object, submit, isLoading } = useObject({
    api: '/api/story',
    schema: StoryResponseSchema,
    onFinish: async (result) => {
      if (result.object?.imagePrompt) {
        await generateImage(result.object.imagePrompt)
      }
    },
  })

  const generateImage = async (imagePrompt: string) => {
    setStoryState(prev => ({ ...prev, isGeneratingImage: true }))

    try {
      const response = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagePrompt }),
      })

      const result = await response.json()
      if (result.image?.base64Data) {
        setStoryState(prev => ({
          ...prev,
          image: `data:${result.image.mediaType};base64,${result.image.base64Data}`,
          isGeneratingImage: false
        }))
      }
    } catch (error) {
      console.error('Failed to generate image:', error)
      setStoryState(prev => ({ ...prev, isGeneratingImage: false }))
    }
  }

  const startStory = () => {
    if (!topicInput.trim()) return

    setStoryState({
      topic: topicInput,
      image: null,
      isGeneratingImage: false,
    })

    submit({
      topic: topicInput,
      previousStory: null,
      userAction: null,
      language: selectedLanguage
    })
  }

  const continueStory = (action: string) => {
    setStoryState(prev => ({ ...prev, image: null }))

    submit({
      topic: storyState.topic,
      previousStory: object?.description || '',
      userAction: action,
      language: selectedLanguage
    })
  }

  const resetStory = () => {
    setStoryState({
      topic: null,
      image: null,
      isGeneratingImage: false,
    })
    setTopicInput('')
  }

  // Initial state - topic input
  if (!storyState.topic) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-8">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-black uppercase tracking-wider">
              START ADVENTURE
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div>
              <label htmlFor="topic" className="block font-bold mb-3 uppercase tracking-wide">
                Topic or Theme:
              </label>
              <Input
                id="topic"
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && startStory()}
                placeholder="space exploration, medieval fantasy..."
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {EXAMPLE_TOPICS.map((example) => (
                <Button
                  key={example}
                  variant="outline"
                  size="sm"
                  onClick={() => setTopicInput(example)}
                  className="text-xs h-auto py-2 px-3 whitespace-normal text-center"
                >
                  {example}
                </Button>
              ))}
            </div>

            <div>
              <label htmlFor="language" className="block font-bold mb-3 uppercase tracking-wide">
                Language:
              </label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_LANGUAGES.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={startStory}
              disabled={!topicInput.trim()}
              className="w-full"
              size="lg"
            >
              Begin Adventure
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Story interface
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-row items-center justify-between bg-card border-2 border-black p-6 shadow-[8px_8px_0px_0px_#000000]">
        <h2 className="text-xl font-black uppercase tracking-wider">
          {storyState.topic}
        </h2>
        <Button
          onClick={resetStory}
          variant="destructive"
          size="sm"
        >
          New Story
        </Button>
      </div>

      {/* Story Content */}
      <div className="grid md:grid-cols-[2fr_1fr] gap-8">
        {/* Story Text */}
        <div className="min-h-[300px] bg-secondary border-2 border-black p-6 shadow-[4px_4px_0px_0px_#000000]">
          {isLoading && (
            <div className="font-bold animate-pulse uppercase tracking-wide">
              ✨ Crafting your story...
            </div>
          )}

          {object?.description && (
            <div className="font-mono leading-relaxed space-y-4">
              {object.description.split(/\n\s*\n/).filter(p => p.trim()).map((paragraph, index) => (
                <p key={index} className="font-bold">{paragraph.trim()}</p>
              ))}
            </div>
          )}
        </div>

        {/* Image */}
        <div className="w-80 h-80 bg-secondary border-2 border-black shadow-[4px_4px_0px_0px_#000000] flex items-center justify-center relative overflow-hidden">
          {storyState.image ? (
            <img
              src={storyState.image}
              alt="Story scene"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="font-black uppercase tracking-wider text-center">
              GENERATING...
            </div>
          )}
        </div>
      </div>

      {/* Separator */}
      {object?.suggestedActions && object.suggestedActions.length > 0 && !isLoading && (
        <div className="h-1 bg-black shadow-[4px_4px_0px_0px_#000000] mx-8"></div>
      )}

      {/* Action Section */}
      {object?.suggestedActions && object.suggestedActions.length > 0 && !isLoading && (
        <div className="space-y-6">
          {/* Section Header */}
          <h3 className="font-black uppercase tracking-wider text-lg bg-accent text-accent-foreground border-2 border-black p-4 shadow-[4px_4px_0px_0px_#000000]">
            What do you do next?
          </h3>

          {/* Custom Action Input */}
          <Input
            type="text"
            placeholder="Describe what you want to do..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                const customAction = e.currentTarget.value
                e.currentTarget.value = ''
                submit({
                  topic: storyState.topic,
                  previousStory: object?.description || '',
                  userAction: customAction,
                  language: selectedLanguage
                })
              }
            }}
          />

          {/* Suggested Actions */}
          <div className="space-y-4">
            <p className="font-bold uppercase tracking-wide text-sm">Or choose suggestion:</p>
            <div className="grid md:grid-cols-2 gap-4">
              {object.suggestedActions
                .filter((action): action is string => typeof action === 'string')
                .map((action, index) => (
                  <Button
                    key={index}
                    onClick={() => continueStory(action)}
                    disabled={isLoading}
                    variant="outline"
                    className="p-6 text-left h-auto whitespace-normal"
                  >
                    {action}
                  </Button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}