import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const LoginDoc = () => {
  const [state, setState] = useState('Sign Up')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [speciality, setSpeciality] = useState('General Physician')
  const [degree, setDegree] = useState('')
  const [address, setAddress] = useState('')
  const [experience, setExperience] = useState('1 Year')
  const [fees, setFees] = useState('')
  const [about, setAbout] = useState('')

  const navigate = useNavigate()
  const { backendUrl, token, setToken } = useContext(AppContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/doctor/register', {
          name, email, password, speciality, degree, experience, about, fees, address
        })

        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast("success");
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/doctor/login', {
          email,
          password
        })

        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/DoctorHome')
    }
  }, [token])

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
        <p>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book appointment</p>

        {state === 'Sign Up' && (
          <>
            <div className='flex gap-10'>
              <div className='w-full'>
                <p>Full Name</p>
                <input onChange={(e) => setName(e.target.value)} value={name} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="text" required />
              </div>
              <div className='w-full'>
                <p>Speciality</p>
                <input onChange={(e) => setSpeciality(e.target.value)} value={speciality} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="text" required />
              </div>
            </div>
            <div className='flex gap-10 mt-2 w-full'>
              <div className='w-full'>
                <p>Degree</p>
                <input onChange={(e) => setDegree(e.target.value)} value={degree} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="text" required />
              </div>
              <div className='w-full'>
                <p>Experience</p>
                <select onChange={(e) => setExperience(e.target.value)} value={experience} className='border border-[#DADADA] rounded w-full p-2 mt-1'>
                  <option>1 Year</option>
                  <option>2 Years</option>
                  <option>3 Years</option>
                  <option>5+ Years</option>
                </select>
              </div>
            </div>
            <div className='flex gap-10 mt-2'>
              <div className='w-full'>
              <p>Address</p>
              <input onChange={(e) => setAddress(e.target.value)} value={address} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="text" required />
            </div>
            
            <div className='w-full'>
              <p>Consultation Fees</p>
              <input onChange={(e) => setFees(e.target.value)} value={fees} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="number" required />
            </div>
            </div>
            <div className='w-full'>
              <p>About</p>
              <textarea onChange={(e) => setAbout(e.target.value)} value={about} className='border border-[#DADADA] rounded w-full p-2 mt-1' rows="3" required />
            </div>
          </>
        )}

        <div className='w-full'>
          <p>Email</p>
          <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />
        </div>

        <div className='w-full'>
          <p>Password</p>
          <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required />
        </div>

        <button className='bg-primary text-white w-full py-2 my-2 rounded-md text-base'>
          {state === 'Sign Up' ? 'Create account' : 'Login'}
        </button>

        {state === 'Sign Up' ? (
          <p>Already have an account? <span onClick={() => setState('Login')} className='text-primary underline cursor-pointer'>Login here</span></p>
        ) : (
          <p>Create a new account? <span onClick={() => setState('Sign Up')} className='text-primary underline cursor-pointer'>Click here</span></p>
        )}
      </div>
    </form>
  )
}

export default LoginDoc
