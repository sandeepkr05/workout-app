'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  
  // New state to prevent the login UI from flashing while checking local storage
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // PWA Cold Boot Fix: Check for an existing session on initial load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Session found in storage! Instantly redirect.
        router.push('/dashboard')
      } else {
        // No session found, let them see the login form.
        setIsCheckingAuth(false)
      }
    })
  }, [router])

  async function handleAuth() {
    setLoading(true)
    setError('')
    setMessage('')
    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      })
      if (error) {
        setError(error.message)
      } else {
        // Removed the artificial 1-second delay; it's generally unnecessary 
        // with the INITIAL_SESSION setup we added to the dashboard.
        router.push('/dashboard')
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setMessage('Account created! Please check your email to confirm, then log in.')
    }
    setLoading(false)
  }

  // Show a blank or loading screen while checking storage so the login form doesn't flicker
  if (isCheckingAuth) {
    return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0f0f0f',color:'#888'}}>Checking session...</div>
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem',background:'#0f0f0f'}}>
      <div style={{width:'100%',maxWidth:'400px',background:'#1a1a1a',borderRadius:'16px',padding:'2rem',border:'1px solid #2a2a2a'}}>
        <div style={{textAlign:'center',marginBottom:'2rem'}}>
  <img src="/logo.png" alt="Axis Fitness" style={{width:'180px',height:'180px',objectFit:'contain',marginBottom:'8px',borderRadius:'16px'}} />
  <h1 style={{fontSize:'24px',fontWeight:'600',color:'#f5f5f5'}}>Axis Fitness</h1>
  <p style={{fontSize:'14px',color:'#FF8C00',marginTop:'4px',fontWeight:'500'}}>Elevate Your Routine</p>
</div>

        <div style={{display:'flex',marginBottom:'1.5rem',background:'#0f0f0f',borderRadius:'8px',padding:'4px'}}>
          <button onClick={()=>setIsLogin(true)} style={{flex:1,padding:'8px',borderRadius:'6px',border:'none',cursor:'pointer',fontWeight:'500',fontSize:'14px',background:isLogin?'#7F77DD':'transparent',color:isLogin?'#fff':'#888',transition:'all .2s'}}>Login</button>
          <button onClick={()=>setIsLogin(false)} style={{flex:1,padding:'8px',borderRadius:'6px',border:'none',cursor:'pointer',fontWeight:'500',fontSize:'14px',background:!isLogin?'#7F77DD':'transparent',color:!isLogin?'#fff':'#888',transition:'all .2s'}}>Sign Up</button>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            style={{padding:'12px',borderRadius:'8px',border:'1px solid #2a2a2a',background:'#0f0f0f',color:'#f5f5f5',fontSize:'14px',outline:'none'}}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&handleAuth()}
            style={{padding:'12px',borderRadius:'8px',border:'1px solid #2a2a2a',background:'#0f0f0f',color:'#f5f5f5',fontSize:'14px',outline:'none'}}
          />
          {error && <p style={{fontSize:'13px',color:'#ff6b6b'}}>{error}</p>}
          {message && <p style={{fontSize:'13px',color:'#51cf66'}}>{message}</p>}
          <button
            onClick={handleAuth}
            disabled={loading}
            style={{padding:'12px',borderRadius:'8px',border:'none',background:'#7F77DD',color:'#fff',fontSize:'14px',fontWeight:'600',cursor:'pointer',opacity:loading?0.7:1}}
          >
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
          </button>
        </div>
      </div>
    </div>
  )
}