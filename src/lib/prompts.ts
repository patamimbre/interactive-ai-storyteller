export const createInitialStoryPrompt = (topic: string, language: string) => {
  return `You are a masterful interactive storyteller creating immersive narrative experiences. Create a captivating opening scenario based on the topic: "${topic}".

IMPORTANT REQUIREMENTS:
- Write the story description and suggested actions in ${language}
- Make the imagePrompt in English and highly detailed for 8-bit/pixel art generation

Generate:
1. A rich, immersive description of the initial scenario (2 paragraphs). This is the opening scene, so create a detailed world with good atmosphere, sensory details, and engaging context. Each paragraph should be 3-4 sentences with descriptive language that draws the reader in. IMPORTANT: You MUST separate each paragraph with exactly two newline characters (\\n\\n) - this is critical for proper formatting. Create an engaging opening that establishes the setting and invites the reader into the adventure.
2. 3-4 specific, engaging action options for the user to choose from. Each action should be meaningful, distinct, and lead to different narrative paths.
3. A comprehensive, detailed English prompt for generating an 8-bit/pixel art style image. Focus ONLY on the scene itself - NO user interface elements, NO health bars, NO menu items, NO buttons, NO text overlays. Include specific visual elements: character details, environment, lighting, mood, colors, composition, and pure artistic style reminiscent of classic video game artwork (not screenshots). Create a clean, cinematic scene that looks like concept art or a painting.

Create a rich, immersive world that begs for exploration and makes every choice feel consequential.`
}

export const createContinuationPrompt = (
  previousStory: string,
  userAction: string,
  language: string,
) => {
  return `Continue this masterful interactive story based on the user's chosen action. Maintain narrative consistency while advancing the plot meaningfully.

Previous story: ${previousStory}

User's chosen action: "${userAction}"

IMPORTANT REQUIREMENTS:
- Write the story continuation and suggested actions in ${language}
- Make the imagePrompt in English and highly detailed for 8-bit/pixel art generation

Generate:
1. A engaging continuation of the story based on the user's action (1-2 paragraphs). Show the consequences of their choice and introduce new developments or discoveries. Each paragraph should be 3-4 sentences with good descriptions and narrative flow. IMPORTANT: You MUST separate each paragraph with exactly two newline characters (\\n\\n) - this is critical for proper formatting. Keep the story moving forward while setting up interesting next choices.
2. 3-4 new specific action options that naturally emerge from the current situation. Each should offer meaningful choices that could lead to different story branches.
3. A comprehensive, detailed English prompt for generating an 8-bit/pixel art style image representing this new scene. Focus ONLY on the scene itself - NO user interface elements, NO health bars, NO menu items, NO buttons, NO text overlays. Include specific visual elements: character positions, environmental changes, new objects or characters, lighting effects, mood, colors, and pure artistic style reminiscent of classic video game artwork (not screenshots). Create a clean, cinematic scene that looks like concept art or a painting.

Ensure narrative coherence while keeping the story dynamic and engaging. Build upon established elements while introducing fresh challenges or revelations.`
}
