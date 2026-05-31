'use client'
import AICoach from '../components/AICoach'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Log() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true) // Added loading state for auth verification
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true) // This is for your data fetching
  const [selected, setSelected] = useState<any>(null)

  useEffect(() => {
    let mounted = true

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return

        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
          if (!session) {
            router.push('/')
          } else {
            setUser(session.user)
            fetchSessions(session.user.id) // Fetch sessions only when auth is confirmed
            setIsLoading(false)
          }
        } else if (event === 'SIGNED_OUT') {
          router.push('/')
        } else if (event === 'TOKEN_REFRESHED' && session) {
          setUser(session.user)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [router])

  async function fetchSessions(uid: string) {
    const { data } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', uid)
      .order('session_date', { ascending: false })
    setSessions(data || [])
    setLoading(false)
  }

  async function deleteSession(id: string) {
    await supabase.from('sessions').delete().eq('id', id)
    setSessions(prev => prev.filter(s => s.id !== id))
    setSelected(null)
  }

  const btn = (onClick: any, children: any, primary = false) => (
    <button onClick={onClick} style={{display:'inline-flex',alignItems:'center',gap:'6px',padding:'10px 20px',borderRadius:'8px',border:primary?'none':'1px solid #2a2a2a',background:primary?'#7F77DD':'transparent',color:'#f5f5f5',fontSize:'14px',fontWeight:primary?'600':'400',cursor:'pointer'}}>{children}</button>
  )

  // Updated to include isLoading check to prevent premature renders or redirects
  if (isLoading || !user) {
    return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'#888'}}>Loading...</div>
  }

  return (
    <div style={{minHeight:'100vh',background:'#0f0f0f',color:'#f5f5f5'}}>
      {/* NAV */}
      <div style={{background:'#1a1a1a',borderBottom:'1px solid #2a2a2a',padding:'12px 1.5rem',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
  <img src="/logo.png" alt="Axis Fitness" style={{width:'36px',height:'36px',objectFit:'contain',borderRadius:'6px'}} />
  <span style={{fontWeight:'700',fontSize:'16px',color:'#FF8C00'}}>Axis Fitness</span>
</div>
        <div style={{display:'flex',gap:'10px'}}>
          <button onClick={()=>router.push('/dashboard')} style={{background:'transparent',border:'1px solid #2a2a2a',color:'#f5f5f5',padding:'6px 14px',borderRadius:'6px',cursor:'pointer',fontSize:'13px'}}>Dashboard</button>
          <button onClick={async()=>{await supabase.auth.signOut();router.push('/')}} style={{background:'transparent',border:'1px solid #2a2a2a',color:'#888',padding:'6px 14px',borderRadius:'6px',cursor:'pointer',fontSize:'13px'}}>Logout</button>
        </div>
      </div>

      <div style={{maxWidth:'680px',margin:'0 auto',padding:'1.5rem 1rem'}}>

        {/* DETAIL VIEW */}
        {selected ? <>
          {btn(()=>setSelected(null),'← Back to Log')}
          <h2 style={{fontSize:'20px',fontWeight:'600',margin:'1rem 0 4px'}}>{selected.target}</h2>
          <p style={{fontSize:'13px',color:'#888',marginBottom:'1.5rem'}}>
            {new Date(selected.session_date).toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}
          </p>

          {[
            {title:'🔥 Warm-Up', rows:(selected.warmup||[]).map((w:string)=>({name:w,right:'~15 kcal'}))},
            {title:'🏋️ Main Workout', rows:(selected.main_exercises||[]).map((e:any)=>({name:e.name,right:`${e.sets} · ${e.cal} kcal`}))},
            ...(selected.cardio?[{title:'❤️ Cardio',rows:[{name:selected.cardio.name,right:`${selected.cardio.duration} · ${selected.cardio.cal} kcal`}]}]:[])
          ].map(section=>(
            <div key={section.title} style={{background:'#1a1a1a',border:'1px solid #2a2a2a',borderRadius:'12px',padding:'14px 16px',marginBottom:'10px'}}>
              <div style={{fontSize:'13px',fontWeight:'600',marginBottom:'10px'}}>{section.title}</div>
              {section.rows.length ? section.rows.map((r:any)=>(
                <div key={r.name} style={{display:'flex',justifyContent:'space-between',fontSize:'12px',padding:'4px 0',borderBottom:'1px solid #222'}}>
                  <span style={{color:'#f5f5f5'}}>{r.name}</span>
                  <span style={{color:'#888'}}>{r.right}</span>
                </div>
              )) : <div style={{fontSize:'12px',color:'#888'}}>None</div>}
            </div>
          ))}

          <div style={{background:'#1e1b3a',borderRadius:'12px',padding:'20px',textAlign:'center',margin:'1rem 0'}}>
            <div style={{fontSize:'36px',fontWeight:'700',color:'#7F77DD'}}>{selected.total_calories}</div>
            <div style={{fontSize:'13px',color:'#888',marginTop:'4px'}}>total calories burned</div>
          </div>

          <button onClick={()=>deleteSession(selected.id)} style={{background:'transparent',border:'1px solid #ff6b6b',color:'#ff6b6b',padding:'10px 20px',borderRadius:'8px',cursor:'pointer',fontSize:'14px'}}>
            🗑️ Delete Session
          </button>
        </>

        /* LIST VIEW */
        : <>
          <h2 style={{fontSize:'20px',fontWeight:'600',marginBottom:'4px'}}>My Workout Log</h2>
          <p style={{fontSize:'13px',color:'#888',marginBottom:'1.5rem'}}>All your saved sessions</p>

          {loading && <div style={{textAlign:'center',padding:'3rem',color:'#888'}}>Loading sessions...</div>}

          {!loading && sessions.length===0 && (
            <div style={{textAlign:'center',padding:'3rem',color:'#888'}}>
              <div style={{fontSize:'40px',marginBottom:'12px'}}>📋</div>
              <p>No sessions saved yet.</p>
              <p style={{fontSize:'13px',marginTop:'4px'}}>Complete a session on the dashboard and save it!</p>
              <div style={{marginTop:'1rem'}}>{btn(()=>router.push('/dashboard'),'Go to Dashboard',true)}</div>
            </div>
          )}

          {/* STATS */}
          {!loading && sessions.length>0 && (
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px',marginBottom:'1.5rem'}}>
              {[
                {label:'Total Sessions',val:sessions.length},
                {label:'Total Calories',val:sessions.reduce((s:number,x:any)=>s+x.total_calories,0)},
                {label:'This Month',val:sessions.filter((x:any)=>new Date(x.session_date).getMonth()===new Date().getMonth()).length},
              ].map(stat=>(
                <div key={stat.label} style={{background:'#1a1a1a',border:'1px solid #2a2a2a',borderRadius:'12px',padding:'14px',textAlign:'center'}}>
                  <div style={{fontSize:'22px',fontWeight:'700',color:'#7F77DD'}}>{stat.val}</div>
                  <div style={{fontSize:'11px',color:'#888',marginTop:'4px'}}>{stat.label}</div>
                </div>
              ))}
            </div>
          )}

          {!loading && sessions.map((s:any)=>(
            <div key={s.id} onClick={()=>setSelected(s)} style={{background:'#1a1a1a',border:'1px solid #2a2a2a',borderRadius:'12px',padding:'14px 16px',marginBottom:'10px',cursor:'pointer',transition:'border-color .15s'}}
              onMouseEnter={e=>(e.currentTarget.style.borderColor='#7F77DD')}
              onMouseLeave={e=>(e.currentTarget.style.borderColor='#2a2a2a')}>
              <div style={{fontSize:'12px',color:'#888'}}>
                {new Date(s.session_date).toLocaleDateString('en-IN',{weekday:'short',year:'numeric',month:'short',day:'numeric'})}
              </div>
              <div style={{fontSize:'15px',fontWeight:'600',color:'#f5f5f5',margin:'4px 0'}}>{s.target}</div>
              <div style={{fontSize:'12px',color:'#7F77DD'}}>{s.main_exercises?.length || 0} exercises · {s.total_calories} kcal burned</div>
            </div>
          ))}
        </>}

      </div>
      <AICoach />
    </div>
  )
}