import React, { createContext, useState, useEffect } from 'react'


export const AuthContext = createContext()


const STORAGE_KEY = 'econsult_auth'


function seedUsers(){
const u = [
{ id: 'u-admin', name: 'Admin User', email: 'admin@econsult.com', password: 'admin123', role: 'admin' },
{ id: 'u-staff', name: 'Staff User', email: 'staff@econsult.com', password: 'staff123', role: 'staff' },
{ id: 'u-patient', name: 'Patient User', email: 'patient@econsult.com', password: 'patient123', role: 'patient' }
]
localStorage.setItem('econsult_users', JSON.stringify(u))
}


export function AuthProvider({ children }){
const [user, setUser] = useState(null)


useEffect(()=>{
const raw = localStorage.getItem(STORAGE_KEY)
if(raw) setUser(JSON.parse(raw))
// seed small dataset if no users present
if(!localStorage.getItem('econsult_users')) seedUsers()
},[])


const login = (email, password) =>{
const users = JSON.parse(localStorage.getItem('econsult_users') || '[]')
const found = users.find(u => u.email === email && u.password === password)
if(found){
localStorage.setItem(STORAGE_KEY, JSON.stringify(found))
setUser(found)
return { ok:true }
}
return { ok:false, error: 'Invalid credentials' }
}


const logout = ()=>{
localStorage.removeItem(STORAGE_KEY)
setUser(null)
}


const updateProfile = (changes)=>{
if(!user) return
const users = JSON.parse(localStorage.getItem('econsult_users')||'[]')
const idx = users.findIndex(u => u.id === user.id)
if(idx>=0){
users[idx] = { ...users[idx], ...changes }
localStorage.setItem('econsult_users', JSON.stringify(users))
const updated = users[idx]
localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
setUser(updated)
}
}


return (
<AuthContext.Provider value={{ user, login, logout, updateProfile }}>
{children}
</AuthContext.Provider>
)
}