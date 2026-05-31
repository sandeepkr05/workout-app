'use client'
import { useState } from 'react'

export default function AICoach() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<{role:string,content:string}[]>([
    {role:'assistant',content:"Hi! I'm your AI Coach 💪 Ask me anything about exercises, form, muscles, or injuries!"}
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function sendMessage(text?: string) {
    const msg = text || input
    if (!msg.trim()) return
    setInput('')
    setLoading(true)

    const newMessages = [...messages, {role:'user',content:msg}]
    setMessages(newMessages)

    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({messages: newMessages})
      })
      const data = await response.json()
      setMessages([...newMessages, {role:'assistant',content:data.reply}])
    } catch(e) {
      setMessages([...newMessages, {role:'assistant',content:"Sorry, I couldn't connect. Please try again!"}])
    }
    setLoading(false)
  }

  return (
    <>
      {/* FLOATING BUTTON */}
      <button
        onClick={()=>setOpen(!open)}
        style={{
          position:'fixed',bottom:'20px',right:'20px',
          width:'56px',height:'56px',borderRadius:'50%',
          background:'linear-gradient(135deg,#FF8C00,#FF6000)',
          border:'none',cursor:'pointer',
          display:'flex',alignItems:'center',justifyContent:'center',
          fontSize:'24px',boxShadow:'0 4px 20px rgba(255,140,0,0.4)',
          zIndex:1000,transition:'transform .2s'
        }}
        title="AI Coach"
      >
        {open ? '✕' : '🤖'}
      </button>

      {/* CHAT BOX */}
      {open && (
        <div style={{
          position:'fixed',bottom:'90px',right:'20px',
          width:'320px',maxWidth:'calc(100vw - 40px)',
          background:'#1a1a1a',border:'1px solid #2a2a2a',
          borderRadius:'16px',overflow:'hidden',
          boxShadow:'0 8px 40px rgba(0,0,0,0.5)',zIndex:999,
          display:'flex',flexDirection:'column',height:'420px'
        }}>
          {/* HEADER */}
          <div style={{
            background:'linear-gradient(135deg,#FF8C00,#FF6000)',
            padding:'12px 16px',display:'flex',alignItems:'center',gap:'10px'
          }}>
            <span style={{fontSize:'20px'}}>🤖</span>
            <div>
              <div style={{fontSize:'14px',fontWeight:'600',color:'#fff'}}>AI Coach</div>
              <div style={{fontSize:'11px',color:'rgba(255,255,255,0.8)'}}>Powered by Claude AI</div>
            </div>
          </div>

          {/* MESSAGES */}
          <div style={{
            flex:1,overflowY:'auto',padding:'12px',
            display:'flex',flexDirection:'column',gap:'8px'
          }}>
            {messages.map((m,i)=>(
              <div key={i} style={{
                display:'flex',justifyContent:m.role==='user'?'flex-end':'flex-start'
              }}>
                <div style={{
                  maxWidth:'80%',padding:'8px 12px',borderRadius:'12px',
                  background:m.role==='user'?'#FF8C00':'#2a2a2a',
                  color:'#f5f5f5',fontSize:'13px',lineHeight:'1.4'
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{display:'flex',justifyContent:'flex-start'}}>
                <div style={{
                  padding:'8px 12px',borderRadius:'12px',
                  background:'#2a2a2a',color:'#888',fontSize:'13px'
                }}>
                  Thinking...
                </div>
              </div>
            )}
          </div>

          {/* QUICK QUESTIONS */}
          <div style={{padding:'8px 12px',display:'flex',gap:'6px',flexWrap:'wrap',borderTop:'1px solid #2a2a2a'}}>
            {['Proper form?','Muscles worked?','Beginner tips?','Common mistakes?'].map(q=>(
              <button key={q} onClick={()=>sendMessage(q)} style={{
                fontSize:'10px',padding:'4px 8px',borderRadius:'20px',
                border:'1px solid #FF8C00',background:'transparent',
                color:'#FF8C00',cursor:'pointer'
              }}>{q}</button>
            ))}
          </div>

          {/* INPUT */}
          <div style={{
            padding:'12px',borderTop:'1px solid #2a2a2a',
            display:'flex',gap:'8px'
          }}>
            <input
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&sendMessage()}
              placeholder="Ask your coach..."
              style={{
                flex:1,padding:'8px 12px',borderRadius:'8px',
                border:'1px solid #2a2a2a',background:'#0f0f0f',
                color:'#f5f5f5',fontSize:'13px',outline:'none'
              }}
            />
            <button
              onClick={()=>sendMessage()}
              disabled={loading}
              style={{
                padding:'8px 12px',borderRadius:'8px',border:'none',
                background:'#FF8C00',color:'#fff',cursor:'pointer',
                fontSize:'16px',opacity:loading?0.6:1
              }}
            >➤</button>
          </div>
        </div>
      )}
    </>
  )
}