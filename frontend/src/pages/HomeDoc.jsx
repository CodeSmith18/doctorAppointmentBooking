import React, { useContext } from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'
import { AdminContext } from '../../../admin/src/context/AdminContext'
import { AppContext } from '../context/AppContext'
    

const HomeDoc = () => {
//    const { dToken } = useContext(DoctorContext)
  const { token } = useContext(AppContext)
    alert(token)
  return (
    <div>
      <h1>
        Hello Doctor
      </h1>
    </div>
  )
}

export default HomeDoc