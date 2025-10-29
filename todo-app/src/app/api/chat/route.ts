import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { message, todos, conversationHistory } = await request.json()

    // API key kontrolü
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      return NextResponse.json({
        message: 'Chatbot özelliği şu anda kullanılamıyor. OpenAI API key gerekli.'
      })
    }

    // Todo verilerini string'e çevir
    const todosText = todos.map((todo: any) => 
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
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages as any,
      max_tokens: 500,
      temperature: 0.7,
    })

    return NextResponse.json({
      message: completion.choices[0]?.message?.content || 'Üzgünüm, bir hata oluştu.'
    })
  } catch (error) {
    console.error('OpenAI API Error:', error)
    return NextResponse.json(
      { 
        error: 'Chatbot şu anda kullanılamıyor.',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
