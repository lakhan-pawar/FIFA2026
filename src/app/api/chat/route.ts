import { NextResponse } from 'next/server';
import { getAgentById } from '@/lib/agents/agent-config';
import Groq from 'groq-sdk';

const apiKey = process.env.GROQ_API_KEY;
const isPlaceholderKey =
  !apiKey || apiKey.includes('your_') || apiKey === 'fallback';

const groq = !isPlaceholderKey ? new Groq({ apiKey }) : null;

export async function POST(request: Request) {
  try {
    const { agentId, messages } = await request.json();

    if (!agentId || !messages) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const agent = getAgentById(agentId);
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    if (!groq || isPlaceholderKey) {
      console.warn(
        'GROQ_API_KEY is missing or placeholder. Falling back to mock response.'
      );
      return NextResponse.json({
        reply: `[MOCK RESPONSE - Add GROQ_API_KEY to .env.local] As ${agent.name}, I would say: I am currently offline. Please configure my Groq API key so I can help you with FIFA World Cup 2026!`,
      });
    }

    // Format the prompt with the agent's persona
    const systemPrompt = `You are ${agent.name}, a ${agent.role}. 
Your personality relates to this description: ${agent.description}
    
${agent.systemPrompt}

You are chatting with a user on "KickoffTo", a football intelligence platform for the 2026 FIFA World Cup.
Your responses should be written exactly in your character's voice. Be concise, engaging, and do not use generic AI phrasing like "As an AI...". Keep responses short and conversational unless asked for a detailed analysis.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((m: any) => ({
          role: m.role,
          content: m.content,
        })),
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024,
    });

    const reply = chatCompletion.choices[0]?.message?.content || '';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({
      reply:
        'I am having a bit of trouble connecting to my tactical database right now. Let me check my notes and get back to you! (Check your GROQ_API_KEY)',
    });
  }
}
