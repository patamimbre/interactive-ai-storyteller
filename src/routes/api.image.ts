import { createServerFileRoute } from '@tanstack/react-start/server'
import { google } from '@ai-sdk/google'
import { generateText } from 'ai'

export const ServerRoute = createServerFileRoute('/api/image').methods({
  POST: async ({ request }) => {
    try {
      const body = await request.json()
      const { imagePrompt } = body

      if (!imagePrompt) {
        return new Response(JSON.stringify({ error: 'Image prompt is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      const enhancedPrompt = `Create a high-quality 8-bit pixel art style image with vibrant colors and clear details. ${imagePrompt}. The image should have a retro video game aesthetic with distinct pixels, limited color palette typical of 8-bit games, and clear, readable visual elements.`

      const result = await generateText({
        model: google('gemini-2.5-flash-image-preview'),
        prompt: enhancedPrompt,
      })

      // Extract the generated image from the files
      const imageFile = result.files?.find(file => file.mediaType.startsWith('image/'))

      if (!imageFile) {
        return new Response(JSON.stringify({ error: 'No image generated' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      return new Response(JSON.stringify({ image: imageFile }), {
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (error) {
      console.error('Image generation error:', error)
      return new Response(JSON.stringify({ error: 'Failed to generate image' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  },
})