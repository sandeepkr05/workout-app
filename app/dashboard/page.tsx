'use client'
import AICoach from '../components/AICoach'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const DB: any = {
  exercises: {
    Chest: [
      {name:"Barbell Bench Press",sets:"4x8",cal:60,tip:"Foundation push compound"},
      {name:"Incline Barbell Press",sets:"4x8",cal:58,tip:"Upper chest mass"},
      {name:"Decline Barbell Press",sets:"3x10",cal:52,tip:"Lower chest emphasis"},
      {name:"Incline Dumbbell Press",sets:"3x10",cal:50,tip:"Upper chest + stabilisers"},
      {name:"Flat Dumbbell Press",sets:"3x10",cal:48,tip:"Greater range of motion"},
      {name:"Dumbbell Flye",sets:"3x12",cal:38,tip:"Chest stretch isolation"},
      {name:"Cable Crossover",sets:"3x15",cal:35,tip:"Constant tension peak"},
      {name:"Pec Deck Machine",sets:"3x15",cal:30,tip:"Controlled squeeze finisher"},
      {name:"Dumbbell Pullover",sets:"3x12",cal:35,tip:"Chest + serratus anterior"},
      {name:"Push-Up (Weighted)",sets:"4x15",cal:40,tip:"Bodyweight + added load"},
      {name:"Low Cable Fly",sets:"3x15",cal:32,tip:"Upper chest cable hit"},
      {name:"Smith Machine Press",sets:"3x10",cal:50,tip:"Safe heavy overload"},
    ],
    Back: [
      {name:"Deadlift",sets:"4x5",cal:90,tip:"King of all back builders"},
      {name:"Barbell Bent-Over Row",sets:"4x8",cal:70,tip:"Thickness and density"},
      {name:"Pull-Up",sets:"4x8",cal:55,tip:"Width and lat strength"},
      {name:"Chin-Up",sets:"3x10",cal:52,tip:"Bicep-assisted pulling"},
      {name:"T-Bar Row",sets:"4x8",cal:65,tip:"Mid-back mass"},
      {name:"Lat Pulldown",sets:"3x12",cal:45,tip:"Beginner-friendly width"},
      {name:"Seated Cable Row",sets:"3x12",cal:45,tip:"Mid-back thickness"},
      {name:"Single-Arm DB Row",sets:"3x10",cal:42,tip:"Unilateral imbalance fix"},
      {name:"Meadows Row",sets:"3x10",cal:48,tip:"Full lat stretch"},
      {name:"Rack Pull",sets:"4x5",cal:80,tip:"Upper back overload"},
      {name:"Face Pull",sets:"3x15",cal:28,tip:"Rear delt + rotator cuff"},
      {name:"Straight-Arm Pulldown",sets:"3x15",cal:35,tip:"Lat isolation"},
    ],
    Shoulders: [
      {name:"Barbell Overhead Press",sets:"4x8",cal:62,tip:"Overall shoulder mass"},
      {name:"Dumbbell Shoulder Press",sets:"4x10",cal:55,tip:"Full range press"},
      {name:"Arnold Press",sets:"3x10",cal:50,tip:"Full rotation all heads"},
      {name:"Lateral Raise",sets:"4x15",cal:30,tip:"Medial delt width"},
      {name:"Cable Lateral Raise",sets:"3x15",cal:28,tip:"Constant tension side delt"},
      {name:"Front Raise",sets:"3x12",cal:28,tip:"Anterior delt isolation"},
      {name:"Reverse Pec Deck",sets:"3x15",cal:28,tip:"Rear delt machine"},
      {name:"Upright Row",sets:"3x12",cal:40,tip:"Delt and trap tie-in"},
      {name:"Face Pull",sets:"3x15",cal:25,tip:"Rear delt + external rotation"},
      {name:"Seated DB Rear Delt Fly",sets:"3x15",cal:26,tip:"Posterior delt finisher"},
      {name:"Push Press",sets:"3x6",cal:65,tip:"Power + strength overload"},
    ],
    Legs: [
      {name:"Barbell Squat",sets:"4x8",cal:92,tip:"King of leg exercises"},
      {name:"Front Squat",sets:"3x8",cal:85,tip:"Quad dominant squat"},
      {name:"Romanian Deadlift",sets:"4x10",cal:72,tip:"Hamstring dominant hinge"},
      {name:"Leg Press",sets:"4x12",cal:65,tip:"Quad overload machine"},
      {name:"Bulgarian Split Squat",sets:"3x10",cal:62,tip:"Unilateral leg balance"},
      {name:"Hack Squat",sets:"3x10",cal:68,tip:"Quad sweep builder"},
      {name:"Leg Curl (Lying)",sets:"3x12",cal:40,tip:"Hamstring isolation"},
      {name:"Leg Curl (Seated)",sets:"3x12",cal:38,tip:"Different hamstring angle"},
      {name:"Leg Extension",sets:"3x15",cal:35,tip:"VMO quad isolation"},
      {name:"Walking Lunge",sets:"3x12",cal:55,tip:"Functional quad + glute"},
      {name:"Sumo Squat",sets:"3x12",cal:60,tip:"Inner thigh + glute"},
      {name:"Calf Raise (Standing)",sets:"4x20",cal:26,tip:"Gastrocnemius focus"},
      {name:"Calf Raise (Seated)",sets:"4x20",cal:22,tip:"Soleus deep calf"},
    ],
    Biceps: [
      {name:"Barbell Curl",sets:"4x10",cal:36,tip:"Classic mass builder"},
      {name:"EZ-Bar Curl",sets:"4x10",cal:34,tip:"Wrist-friendly curl"},
      {name:"Incline Dumbbell Curl",sets:"3x12",cal:30,tip:"Full stretch emphasis"},
      {name:"Hammer Curl",sets:"3x12",cal:30,tip:"Brachialis + brachioradialis"},
      {name:"Preacher Curl",sets:"3x12",cal:32,tip:"Peak contraction focus"},
      {name:"Concentration Curl",sets:"3x12",cal:28,tip:"Mind-muscle isolation"},
      {name:"Cable Curl",sets:"3x15",cal:26,tip:"Constant tension pump"},
      {name:"Spider Curl",sets:"3x12",cal:30,tip:"Short head emphasis"},
      {name:"Reverse Curl",sets:"3x12",cal:28,tip:"Brachioradialis + forearm"},
      {name:"Zottman Curl",sets:"3x10",cal:30,tip:"Full bicep + forearm"},
    ],
    Triceps: [
      {name:"Close-Grip Bench Press",sets:"4x8",cal:58,tip:"Heavy tricep mass builder"},
      {name:"Skull Crushers",sets:"4x10",cal:42,tip:"Long head stretch"},
      {name:"Overhead Tricep Extension",sets:"3x12",cal:36,tip:"Long head dominant"},
      {name:"Tricep Dips",sets:"3x12",cal:52,tip:"Compound bodyweight finisher"},
      {name:"Tricep Pushdown (Rope)",sets:"3x15",cal:30,tip:"Lateral head flare"},
      {name:"Tricep Pushdown (Bar)",sets:"3x15",cal:30,tip:"Medial head focus"},
      {name:"Overhead Cable Extension",sets:"3x15",cal:30,tip:"Long head constant tension"},
      {name:"Single-Arm DB Extension",sets:"3x12",cal:28,tip:"Unilateral isolation"},
      {name:"Kickback",sets:"3x15",cal:25,tip:"Full extension peak"},
      {name:"Dip Machine",sets:"3x12",cal:40,tip:"Safe weighted dip"},
    ],
    Core: [
      {name:"Plank",sets:"3x60s",cal:22,tip:"Deep core stability"},
      {name:"Side Plank",sets:"3x45s",cal:18,tip:"Oblique lateral stability"},
      {name:"Cable Crunch",sets:"3x15",cal:28,tip:"Loaded abdominal crunch"},
      {name:"Hanging Leg Raise",sets:"3x15",cal:32,tip:"Lower abs + hip flexor"},
      {name:"Russian Twist",sets:"3x20",cal:26,tip:"Rotational oblique work"},
      {name:"Ab Wheel Rollout",sets:"3x12",cal:30,tip:"Full anterior core"},
      {name:"Decline Sit-Up",sets:"3x15",cal:24,tip:"Upper ab emphasis"},
      {name:"Hollow Body Hold",sets:"3x30s",cal:20,tip:"Full core tension"},
      {name:"Dragon Flag",sets:"3x8",cal:35,tip:"Advanced full core"},
      {name:"Landmine Rotation",sets:"3x12",cal:28,tip:"Rotational power"},
      {name:"Dead Bug",sets:"3x10",cal:20,tip:"Anti-extension stability"},
      {name:"V-Up",sets:"3x15",cal:26,tip:"Upper + lower ab combo"},
    ],
    Glutes: [
      {name:"Hip Thrust (Barbell)",sets:"4x12",cal:58,tip:"Glute max primary builder"},
      {name:"Hip Thrust (Banded)",sets:"4x15",cal:45,tip:"Band adds peak tension"},
      {name:"Cable Kickback",sets:"3x15",cal:32,tip:"Glute isolation finisher"},
      {name:"Sumo Deadlift",sets:"4x8",cal:78,tip:"Glute + inner thigh power"},
      {name:"Glute Bridge",sets:"4x15",cal:38,tip:"Floor-based activation"},
      {name:"Step-Up",sets:"3x12",cal:48,tip:"Functional glute + quad"},
      {name:"Donkey Kick (Cable)",sets:"3x15",cal:28,tip:"Full extension glute"},
      {name:"Abductor Machine",sets:"3x20",cal:25,tip:"Glute med + hip abductor"},
    ],
  },
  warmup: {
    Chest:["Arm Circles (3x30s)","Band Pull-Apart (3x15)","Push-Up Holds (2x10)","Cat-Cow Stretch (2x10)","Chest Doorway Stretch (3x30s)"],
    Back:["Cat-Cow Stretch (3x10)","Band Pull-Apart (3x15)","Scapular Retraction (3x15)","Hip Hinge Drill (2x10)","Thoracic Rotation (2x10)"],
    Shoulders:["Arm Swings (3x30s)","Band External Rotation (3x15)","Wall Slides (2x10)","Neck Rolls (2x30s)","Shoulder Dislocations (2x10)"],
    Legs:["Leg Swings (3x15)","Bodyweight Squat (2x15)","Hip Circle (3x10)","Walking Lunge (2x10)","Quad Stretch (3x30s)"],
    Biceps:["Wrist Rotation (3x15)","Light Curl (2x15)","Shoulder Roll (2x30s)","Elbow Circle (3x15)","Forearm Stretch (3x30s)"],
    Triceps:["Tricep Stretch (3x30s)","Shoulder Roll (2x30s)","Light Push-Up (2x10)","Band Pushdown (2x15)","Wrist Flexor Stretch (3x30s)"],
    Core:["Pelvic Tilt (3x15)","Dead Bug (2x10)","Bird Dog (2x10)","Hip Flexor Stretch (3x30s)","Cat-Cow (3x10)"],
    Glutes:["Glute Bridge (3x15)","Clamshell (3x15)","Hip Circle (3x10)","Hip Flexor Stretch (3x30s)","Banded Walk (2x20)"],
  },
  cardio: [
    {name:"Treadmill Run",duration:"20 min",cal:200},
    {name:"Treadmill Incline Walk",duration:"25 min",cal:175},
    {name:"Jump Rope",duration:"15 min",cal:185},
    {name:"Stationary Bike",duration:"20 min",cal:162},
    {name:"Rowing Machine",duration:"15 min",cal:172},
    {name:"Stair Climber",duration:"15 min",cal:155},
    {name:"HIIT Sprints",duration:"12 min",cal:195},
    {name:"Elliptical",duration:"20 min",cal:145},
    {name:"Battle Ropes",duration:"10 min",cal:160},
    {name:"Box Jumps",duration:"10 min",cal:145},
    {name:"Burpees",duration:"10 min",cal:175},
  ],
  comboTips: {
    "Chest + Triceps":"Triceps are pre-fatigued by pressing. Start heavy on chest, finish with tricep isolation.",
    "Back + Biceps":"Biceps assist all pulling movements. Train back first while biceps are fresh, then curl.",
    "Legs + Abs":"Heavy squats and hinges already engage the core. Finish with targeted ab isolation.",
    "Shoulders + Triceps":"Both push. Overhead pressing pre-loads triceps — great superset potential.",
    "Chest + Back":"Classic antagonist pairing. Alternate push/pull for balanced upper body stimulus.",
    "Legs + Glutes":"Hip hinge and squat patterns overlap. Train quads first, glute isolation at the end.",
    "Push Day":"Chest → Shoulders → Triceps. Strength carries over perfectly in this sequence.",
    "Pull Day":"Back → Biceps → Core. Deadlifts or rows first, curls and core at the finish.",
    "Leg Day":"Squat → Hinge → Isolation → Core. Most demanding to least — follow the order.",
    "Upper Body":"Chest → Back → Shoulders. Balanced push-pull-overhead for full upper stimulus.",
  }
}

const COMBOS: any = {
  "Chest + Triceps": ["Chest","Triceps"],
  "Back + Biceps": ["Back","Biceps"],
  "Legs + Abs": ["Legs","Core"],
  "Shoulders + Triceps": ["Shoulders","Triceps"],
  "Chest + Back": ["Chest","Back"],
  "Legs + Glutes": ["Legs","Glutes"],
  "Push Day": ["Chest","Shoulders","Triceps"],
  "Pull Day": ["Back","Biceps","Core"],
  "Leg Day": ["Legs","Core","Glutes"],
  "Upper Body": ["Chest","Back","Shoulders"],
}

const s = (obj: any) => ({ ...obj })

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true) // Added loading state here
  const [screen, setScreen] = useState<'home'|'exercises'|'summary'>('home')
  const [tab, setTab] = useState<'single'|'combo'>('single')
  const [target, setTarget] = useState('')
  const [muscles, setMuscles] = useState<string[]>([])
  const [selWarmup, setSelWarmup] = useState<string[]>([])
  const [selMain, setSelMain] = useState<any[]>([])
  const [selCardio, setSelCardio] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Replaced the useEffect with the INITIAL_SESSION handler
  useEffect(() => {
    let mounted = true

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return

        if (event === 'INITIAL_SESSION') {
          if (!session) {
            router.push('/')
          } else {
            setUser(session.user)
            setIsLoading(false)
          }
        } else if (event === 'SIGNED_IN' && session) {
          setUser(session.user)
          setIsLoading(false)
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

  async function logout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  function selectTarget(name: string, ms: string[]) {
    setTarget(name); setMuscles(ms)
    setSelWarmup([]); setSelMain([]); setSelCardio(null)
    setScreen('exercises')
  }

  function toggleWarmup(w: string) {
    setSelWarmup(prev => prev.includes(w) ? prev.filter(x=>x!==w) : prev.length<3 ? [...prev,w] : prev)
  }

  function toggleMain(ex: any, muscle: string) {
    const key = muscle+'::'+ex.name
    setSelMain(prev => prev.find(x=>x.key===key) ? prev.filter(x=>x.key!==key) : prev.length<6 ? [...prev,{...ex,muscle,key}] : prev)
  }

  async function saveSession() {
    if (!user) return
    setSaving(true)
    const now = new Date()
    const warmupCal = selWarmup.length * 15
    const mainCal = selMain.reduce((s:number,e:any)=>s+e.cal,0)
    const cardioCal = selCardio ? selCardio.cal : 0
    const { error } = await (supabase.from('sessions') as any).insert({
      user_id: user.id,
      session_date: now.toISOString().split('T')[0],
      target,
      warmup: selWarmup,
      main_exercises: selMain,
      cardio: selCardio,
      total_calories: warmupCal + mainCal + cardioCal,
    })
    setSaving(false)
    setSaved(true)
  }

  const totalCal = selWarmup.length*15 + selMain.reduce((s:number,e:any)=>s+e.cal,0) + (selCardio?.cal||0)

  const btn = (onClick:any, children:any, primary=false, disabled=false) => (
    <button onClick={onClick} disabled={disabled} style={{display:'inline-flex',alignItems:'center',gap:'6px',padding:'10px 20px',borderRadius:'8px',border: primary?'none':'1px solid #2a2a2a',background:primary?'#7F77DD':'transparent',color:'#f5f5f5',fontSize:'14px',fontWeight:primary?'600':'400',cursor:'pointer',opacity:disabled?0.6:1}}>{children}</button>
  )

 const card = (onClick:any, label:string, meta:string, selected=false) => (
    <div key={label} onClick={onClick} style={{background:selected?'#1e1b3a':'#1a1a1a',border:selected?'2px solid #7F77DD':'1px solid #2a2a2a',borderRadius:'12px',padding:'14px 12px',cursor:'pointer',textAlign:'center'}}>
      <div style={{fontSize:'13px',fontWeight:'500',color:'#f5f5f5'}}>{label}</div>
      <div style={{fontSize:'11px',color:'#888',marginTop:'2px'}}>{meta}</div>
    </div>
  )

  const exItem = (ex:any, muscle:string) => {
    const key = muscle+'::'+ex.name
    const sel = !!selMain.find(x=>x.key===key)
    return (
      <div key={key} onClick={()=>toggleMain(ex,muscle)} style={{background:sel?'#1e1b3a':'#1a1a1a',border:sel?'2px solid #7F77DD':'1px solid #2a2a2a',borderRadius:'8px',padding:'10px 12px',cursor:'pointer',marginBottom:'8px',display:'flex',alignItems:'center',gap:'10px'}}>
        <div style={{width:'20px',height:'20px',borderRadius:'50%',border:sel?'none':'1.5px solid #444',background:sel?'#7F77DD':'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:'12px',color:'#fff'}}>{sel?'✓':''}</div>
        <div style={{flex:1}}>
          <div style={{fontSize:'13px',fontWeight:'500',color:'#f5f5f5'}}>{ex.name}</div>
          <div style={{fontSize:'11px',color:'#888',marginTop:'1px'}}>{ex.sets} · {ex.tip}</div>
        </div>
        <div style={{fontSize:'12px',color:'#7F77DD',fontWeight:'500'}}>{ex.cal} kcal</div>
      </div>
    )
  }

  // Updated the Loading check so it doesn't crash on initial load or empty user state
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
        <div style={{display:'flex',gap:'10px',alignItems:'center'}}>
          <button onClick={()=>router.push('/log')} style={{background:'transparent',border:'1px solid #2a2a2a',color:'#f5f5f5',padding:'6px 14px',borderRadius:'6px',cursor:'pointer',fontSize:'13px'}}>My Log</button>
          <button onClick={logout} style={{background:'transparent',border:'1px solid #2a2a2a',color:'#888',padding:'6px 14px',borderRadius:'6px',cursor:'pointer',fontSize:'13px'}}>Logout</button>
        </div>
      </div>

      <div style={{maxWidth:'680px',margin:'0 auto',padding:'1.5rem 1rem'}}>

        {/* HOME */}
        {screen==='home' && <>
          <h2 style={{fontSize:'20px',fontWeight:'600',marginBottom:'4px'}}>Today's Session</h2>
          <p style={{fontSize:'13px',color:'#888',marginBottom:'1.5rem'}}>{new Date().toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>

          <div style={{display:'flex',gap:'0',borderBottom:'1px solid #2a2a2a',marginBottom:'1.5rem'}}>
            {(['single','combo'] as const).map((t,i)=>(
              <div key={t} onClick={()=>setTab(t)} style={{padding:'10px 20px',fontSize:'13px',fontWeight:'500',cursor:'pointer',color:tab===t?'#7F77DD':'#888',borderBottom:tab===t?'2px solid #7F77DD':'2px solid transparent',marginBottom:'-1px'}}>{i===0?'Single Muscle':'Classic Combo'}</div>
            ))}
          </div>

          {tab==='single' && (
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:'10px'}}>
              {[['Chest',['Chest']],['Back',['Back']],['Shoulders',['Shoulders']],['Legs',['Legs']],['Arms',['Biceps','Triceps']],['Core',['Core']],['Glutes',['Glutes']],['Full Body',['Chest','Back','Legs','Core']]].map(([name,ms]:any)=>
                card(()=>selectTarget(name,ms), name, `${(ms as string[]).join(' + ')}`)
              )}
            </div>
          )}

          {tab==='combo' && (
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:'10px'}}>
              {Object.keys(COMBOS).map(name=>
                card(()=>selectTarget(name,COMBOS[name]), name, COMBOS[name].join(' + '))
              )}
            </div>
          )}
        </>}

        {/* EXERCISES */}
        {screen==='exercises' && <>
          {btn(()=>setScreen('home'),'← Back')}
          <h2 style={{fontSize:'20px',fontWeight:'600',margin:'1rem 0 4px'}}>{target}</h2>
          <p style={{fontSize:'13px',color:'#888',marginBottom:'1.5rem'}}>Build your session below</p>

          {DB.comboTips[target] && (
            <div style={{background:'#1a1a1a',borderLeft:'3px solid #7F77DD',borderRadius:'0 8px 8px 0',padding:'10px 14px',marginBottom:'1.5rem',fontSize:'12px',color:'#aaa'}}>
              <b style={{color:'#f5f5f5'}}>Combo tip:</b> {DB.comboTips[target]}
            </div>
          )}

          {/* WARMUP */}
          <div style={{fontSize:'14px',fontWeight:'500',margin:'0 0 8px',display:'flex',alignItems:'center',gap:'8px'}}>
            🔥 Warm-Up <span style={{fontSize:'10px',background:'#1e3a2a',color:'#51cf66',padding:'2px 8px',borderRadius:'20px'}}>Pick 2–3</span>
            <span style={{fontSize:'12px',color:'#888',marginLeft:'auto'}}>{selWarmup.length}/3</span>
          </div>
          {(() => {
            const all: string[] = []
            muscles.forEach(m => { if(DB.warmup[m]) DB.warmup[m].forEach((w:string)=>{ if(!all.includes(w)) all.push(w) }) })
            return all.map(w => (
              <div key={w} onClick={()=>toggleWarmup(w)} style={{background:selWarmup.includes(w)?'#1e1b3a':'#1a1a1a',border:selWarmup.includes(w)?'2px solid #7F77DD':'1px solid #2a2a2a',borderRadius:'8px',padding:'10px 12px',cursor:'pointer',marginBottom:'8px',display:'flex',alignItems:'center',gap:'10px'}}>
                <div style={{width:'20px',height:'20px',borderRadius:'50%',border:selWarmup.includes(w)?'none':'1.5px solid #444',background:selWarmup.includes(w)?'#7F77DD':'transparent',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',color:'#fff',flexShrink:0}}>{selWarmup.includes(w)?'✓':''}</div>
                <div style={{fontSize:'13px',fontWeight:'500',color:'#f5f5f5',flex:1}}>{w}</div>
                <div style={{fontSize:'12px',color:'#7F77DD',fontWeight:'500'}}>~15 kcal</div>
              </div>
            ))
          })()}

          {/* MAIN */}
          <div style={{fontSize:'14px',fontWeight:'500',margin:'1.5rem 0 8px',display:'flex',alignItems:'center',gap:'8px'}}>
            🏋️ Main Exercises <span style={{fontSize:'10px',background:'#1e1b3a',color:'#a59ff5',padding:'2px 8px',borderRadius:'20px'}}>Pick 4–6</span>
            <span style={{fontSize:'12px',color:'#888',marginLeft:'auto'}}>{selMain.length}/6</span>
          </div>
          {muscles.map(m => (
            <div key={m}>
              {muscles.length>1 && <div style={{fontSize:'11px',fontWeight:'600',color:'#7F77DD',marginBottom:'6px',marginTop:'12px',textTransform:'uppercase',letterSpacing:'.5px'}}>{m}</div>}
              {DB.exercises[m]?.map((ex:any) => exItem(ex, m))}
            </div>
          ))}

          {/* CARDIO */}
          <div style={{fontSize:'14px',fontWeight:'500',margin:'1.5rem 0 8px',display:'flex',alignItems:'center',gap:'8px'}}>
            ❤️ Cardio Finisher <span style={{fontSize:'10px',background:'#1a1a1a',color:'#888',padding:'2px 8px',borderRadius:'20px',border:'1px solid #2a2a2a'}}>Optional</span>
          </div>
          {[{name:'Skip Cardio',duration:'',cal:0},...DB.cardio].map((c:any) => {
            const sel = c.name==='Skip Cardio' ? !selCardio : selCardio?.name===c.name
            return (
              <div key={c.name} onClick={()=>setSelCardio(c.name==='Skip Cardio'?null:c)} style={{background:sel?'#1e1b3a':'#1a1a1a',border:sel?'2px solid #7F77DD':'1px solid #2a2a2a',borderRadius:'8px',padding:'10px 12px',cursor:'pointer',marginBottom:'8px',display:'flex',alignItems:'center',gap:'10px'}}>
                <div style={{width:'20px',height:'20px',borderRadius:'50%',border:sel?'none':'1.5px solid #444',background:sel?'#7F77DD':'transparent',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',color:'#fff',flexShrink:0}}>{sel?'✓':''}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:'13px',fontWeight:'500',color:'#f5f5f5'}}>{c.name}</div>
                  {c.duration && <div style={{fontSize:'11px',color:'#888',marginTop:'1px'}}>{c.duration}</div>}
                </div>
                {c.cal>0 && <div style={{fontSize:'12px',color:'#7F77DD',fontWeight:'500'}}>{c.cal} kcal</div>}
              </div>
            )
          })}

          <div style={{marginTop:'1.5rem'}}>
            {btn(()=>setScreen('summary'),'View Summary →', true)}
          </div>
        </>}

        {/* SUMMARY */}
        {screen==='summary' && <>
          {btn(()=>setScreen('exercises'),'← Edit Session')}
          <h2 style={{fontSize:'20px',fontWeight:'600',margin:'1rem 0 4px'}}>Session Summary</h2>
          <p style={{fontSize:'13px',color:'#888',marginBottom:'1.5rem'}}>{new Date().toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>

          {[
            {title:'🔥 Warm-Up', rows: selWarmup.map(w=>({name:w,right:'~15 kcal'}))},
            {title:'🏋️ Main Workout', rows: selMain.map(e=>({name:e.name,right:`${e.sets} · ${e.cal} kcal`}))},
            ...(selCardio?[{title:'❤️ Cardio',rows:[{name:selCardio.name,right:`${selCardio.duration} · ${selCardio.cal} kcal`}]}]:[])
          ].map(section=>(
            <div key={section.title} style={{background:'#1a1a1a',border:'1px solid #2a2a2a',borderRadius:'12px',padding:'14px 16px',marginBottom:'10px'}}>
              <div style={{fontSize:'13px',fontWeight:'600',marginBottom:'10px'}}>{section.title}</div>
              {section.rows.length ? section.rows.map(r=>(
                <div key={r.name} style={{display:'flex',justifyContent:'space-between',fontSize:'12px',padding:'4px 0',borderBottom:'1px solid #222'}}>
                  <span style={{color:'#f5f5f5'}}>{r.name}</span>
                  <span style={{color:'#888'}}>{r.right}</span>
                </div>
              )) : <div style={{fontSize:'12px',color:'#888'}}>None selected</div>}
            </div>
          ))}

          <div style={{background:'#1e1b3a',borderRadius:'12px',padding:'20px',textAlign:'center',margin:'1rem 0'}}>
            <div style={{fontSize:'36px',fontWeight:'700',color:'#7F77DD'}}>{totalCal}</div>
            <div style={{fontSize:'13px',color:'#888',marginTop:'4px'}}>estimated calories burned</div>
          </div>

          <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
            {btn(saveSession, saving?'Saving...':'💾 Save to Log', true, saving||saved)}
            {btn(()=>{setScreen('home');setSaved(false)},'+ New Session')}
          </div>
          {saved && <p style={{fontSize:'13px',color:'#51cf66',marginTop:'10px'}}>✅ Session saved to your log!</p>}
        </>}

      </div>
      <AICoach />
    </div>
  )
}