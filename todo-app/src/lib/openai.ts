import OpenAI from 'openai'
import { Todo } from '@/types/todo'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function getChatResponse(
  message: string,
  todos: Todo[],
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  try {
    // Todo verilerini string'e çevir
    const todosText = todos.map(todo => 
      `- ${todo.title} (${todo.priority} öncelik, ${todo.status} durum, ${todo.due_date ? new Date(todo.due_date).toLocaleDateString('tr-TR') : 'tarih yok'})`
    ).join('\n')

    const systemPrompt = `Sen bir todo yönetim asistanısın. Kullanıcının todo'larına yardım ediyorsun.

Kullanıcının mevcut todo'ları:
${todosText}

Kurallar:
- Türkçe konuş
- Kısa ve net cevaplar ver
- Todo'ları önceliğe göre sırala
- Tarih kontrolü yap
- Önerilerde bulun
- Sadece mevcut todo'larla ilgili konuş`

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...conversationHistory,
      { role: 'user' as const, content: message }
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 500,
      temperature: 0.7,
    })

    return completion.choices[0]?.message?.content || 'Üzgünüm, bir hata oluştu.'
  } catch (error) {
    console.error('OpenAI API Error:', error)
    return 'Üzgünüm, şu anda chatbot kullanılamıyor. Lütfen daha sonra tekrar deneyin.'
  }
}
