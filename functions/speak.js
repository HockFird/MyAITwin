export async function onRequestPost(context) {
  const { text } = await context.request.json();
  if (!text) return new Response('Missing text', { status: 400 });

  const ELEVEN_API_KEY = context.env.ELEVEN_API_KEY;
  const VOICE_ID = 'hpXycFJpLaX9eoCCszJz';

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVEN_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.5, similarity_boost: 0.85, speed: 0.95 }
      })
    });

    if (!response.ok) throw new Error('ElevenLabs error');

    const audio = await response.arrayBuffer();

    return new Response(audio, {
      headers: { 'Content-Type': 'audio/mpeg' }
    });
  } catch (err) {
    return new Response('Error generating speech', { status: 500 });
  }
}
