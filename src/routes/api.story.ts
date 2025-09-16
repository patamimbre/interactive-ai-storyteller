import { createServerFileRoute } from '@tanstack/react-start/server'
import { google } from '@ai-sdk/google'
import { streamObject } from 'ai'
import { z } from 'zod'
import {
  createInitialStoryPrompt,
  createContinuationPrompt,
} from '../lib/prompts'
import { DEFAULT_LANGUAGE } from '../lib/constants'

const StoryResponseSchema = z.object({
  description: z
    .string()
    .describe('The story description/scenario in the specified language'),
  suggestedActions: z
    .array(z.string())
    .describe(
      '3-4 suggested actions for the user to take next in the specified language',
    ),
  imagePrompt: z
    .string()
    .describe(
      'Detailed 8-bit/pixel art style prompt for image generation (always in English)',
    ),
})

export const ServerRoute = createServerFileRoute('/api/story').methods({
  POST: async ({ request }) => {
    try {
      const body = await request.json()
      const {
        topic,
        previousStory,
        userAction,
        language = DEFAULT_LANGUAGE,
      } = body

      const prompt = !previousStory
        ? createInitialStoryPrompt(topic, language)
        : createContinuationPrompt(previousStory, userAction, language)

      const result = streamObject({
        model: google('gemini-2.5-flash-lite'),
        schema: StoryResponseSchema,
        prompt,
      })

      return result.toTextStreamResponse()
    } catch (error) {
      console.error('Story generation error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to generate story' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }
  },
})
