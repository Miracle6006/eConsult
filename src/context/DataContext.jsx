import React, { createContext, useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'


export const DataContext = createContext()


const STORAGE = 'econsult_data_v1'


function defaultData(){
return {
roles: [
{ id: 'r-accountant', name: 'Accountant', access: ['billing'] },
{ id: 'r-doctor', name: 'Doctor', access: ['patients','appointments'] },
{ id: 'r-pharmacist', name: 'Pharmacist', access: ['prescriptions'] }
],
patients: [],
appointments: [],
invoices: []
}
}


export function DataProvider({ children }){
const [data, setData] = useState(()=>{
const raw = localStorage.getItem(STORAGE)
return raw ? JSON.parse(raw) : defaultData()
})


useEffect(()=>{
localStorage.setItem(STORAGE, JSON.stringify(data))
},[data])


const addRole = (name, access=[]) =>{
setData(d => ({ ...d, roles: [...d.roles, { id: uuid(), name, access }] }))
}


const updateRole = (id, changes) =>{
setData(d => ({ ...d, roles: d.roles.map(r => r.id===id?{...r,...changes}:r) }))
}


const removeRole = (id) =>{
setData(d => ({ ...d, roles: d.roles.filter(r => r.id!==id) }))
}


const addPatient = (p)=>{
const newP = { id: uuid(), ...p }
setData(d => ({ ...d, patients: [newP, ...d.patients] }))
return newP
}


const updatePatient = (id, changes)=>{
setData(d => ({ ...d, patients: d.patients.map(p => p.id===id?{...p,...changes}:p) }))
}


const addAppointment = (a)=>{
const newA = { id: uuid(), createdAt: new Date().toISOString(), ...a }
setData(d => ({ ...d, appointments: [newA, ...d.appointments] }))
return newA
}


const addInvoice = (inv)=>{
const newI = { id: uuid(), createdAt: new Date().toISOString(), ...inv }
setData(d => ({ ...d, invoices: [newI, ...d.invoices] }))
return newI
}


return (
<DataContext.Provider value={{ data, addRole, updateRole, removeRole, addPatient, updatePatient, addAppointment, addInvoice }}>
{children}
</DataContext.Provider>
)
}