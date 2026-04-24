import { useState, useEffect } from "react"
import { supabase } from '../supabaseClient'
export function Login(){
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [repeatPassword,setRepeatPassword] = useState("")
    const [username,setUserName] = useState("")
    const [singout,setSingout] = useState(false)
    const [showModal, setShowModal] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    
    const handleRegister = async () => {
  const result = await register(username, email, password, repeatPassword);

  if (!result.ok) {
    setErrorMsg(result.message);
  } else {
    setErrorMsg("");
  }

  setShowModal(true);
};
    
useEffect(() => {
  if (showModal) {
    const timer = setTimeout(() => {
      setShowModal(false);
    }, 3000); 

    return () => clearTimeout(timer);
  }
}, [showModal]);
    
    if(!singout){
    return(
    <div className="flex flex-col justify-center items-center h-96">
       <h1 className="text-center text-purple-600 font-[fuente] text-4xl"> Login </h1>
       <div className="flex justify-center flex-col items-center">
       <div className="flex flex-col items-baseline  gap-4 mb-10 m-4">
       <input  value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="border-purple-600 border-4 p-3 bg-white rounded-2xl w-2xs " placeholder="Email" /> 
       <input value={password} type="password" onChange={(e) => setPassword(e.target.value)} type="password" className=" border-purple-600 border-4 rounded-2xl  p-3 bg-white w-2xs" placeholder="Password" />
       </div>
    <div className="flex gap-5">
    <p onClick={() => loginUser(email,password)} className="w-20 h-8 bg-purple-700 text-white rounded-lg hover:bg-white hover:text-purple-700 transition-all duration-1000 border-2 border-black cursor-pointer text-center" > Login </p> 
    <p onClick={() => setSingout(true)} className="w-20 h-8 bg-purple-700 text-white rounded-lg hover:bg-white hover:text-purple-700 transition-all duration-1000 border-2 border-black cursor-pointer text-center"> Sing out</p>
    </div>
    </div>
    </div>
    )
    }
    else{
        return(
       <div className="flex flex-col justify-center items-center h-96 mt-5">
       <h1 className="text-center text-purple-600 font-[fuente] text-4xl"> Sing out </h1>
       <div className="flex justify-center flex-col items-center">
       <div className="flex flex-col items-baseline  gap-4 mb-10 m-4">
       <input value={username} onChange={(e) => setUserName(e.target.value)} className="border-purple-600 border-4 p-3 bg-white rounded-2xl w-2xs " placeholder="UserName" /> 
       <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" className="border-purple-600 border-4 p-3 bg-white rounded-2xl w-2xs " placeholder="Email" /> 
       <input value={password} type="password" onChange={(e) => setPassword(e.target.value)} className=" border-purple-600 border-4 rounded-2xl  p-3 bg-white w-2xs" placeholder="Password" />
       <input value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)}type="password" className=" border-purple-600 border-4 rounded-2xl  p-3 bg-white w-2xs" placeholder="Repeat Password" />
       </div>
    <div className="flex gap-5">
    <p className="w-20 h-8 bg-purple-700 text-white rounded-lg hover:bg-white hover:text-purple-700 transition-all duration-1000 border-2 border-black cursor-pointer text-center" onClick={handleRegister}> Sing out </p> 
    <p onClick={() => setSingout(false)} className="w-20 h-8 bg-purple-700 text-white rounded-lg hover:bg-white hover:text-purple-700 transition-all duration-1000 border-2 border-black cursor-pointer text-center"> Login</p>
    {showModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
    <div className="bg-white p-8 rounded-2xl border-purple-600 border-4 shadow-xl text-center">
      <h2 className="text-purple-600 text-xl font-bold mb-2">
        {errorMsg ? "Error" : "Confirm your email"}
      </h2>

      <p className="text-purple-600">
        {errorMsg
          ? errorMsg
          : "check your email y confirm your account"}
      </p>
    </div>
  </div>
)}
    </div>
    </div>
    </div>
        )
    }
}
async function register(userName, email, password, repeatPassword) {
  if (password !== repeatPassword) {
    return { ok: false, message: "Passwords do not match" };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        user_name: userName,
      },
    },
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true };
}
async function loginUser(email,password){
  const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
})
 if (error) {
    console.log("Error al iniciar sesión:", error.message)
    return null
  }
  else{
  const user = data.user
await supabase
  .from('Users')
  .insert([
    {
      id: user.id,
      email: user.email
    }
  ], {
    onConflict: 'id',
    ignoreDuplicates: true
  })
  }
}