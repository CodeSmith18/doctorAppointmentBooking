import React from 'react'
import { useContext, useEffect,useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets';
  const fend = "";



const DoctorAppointments = () => {

  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)
   const [appointment, setAppointment] = useState([]);

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])

  // useEffect(() => {
  //   const getUserAppointments = async () => {
  //       try {

  //           const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
  //           setAppointment(data.appointments.reverse());
  //           console.log(data);

  //       } catch (error) {
  //           console.log(error)
  //           toast.error(error.message)
  //       }
  //   };
  //    getUserAppointments();
  // },[])

  return (
    <div className='w-full max-w-6xl m-5 '>

      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
        <div className='max-sm:hidden grid grid-cols-[0.5fr_1.3fr_1fr_1fr_1.5fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Meeting Link</p>
        </div>
        {appointments.map((item, index) => (
          
  <div
    className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_1.3fr_1fr_1fr_1.6fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50'
    key={index}
  >
    <p className='max-sm:hidden'>{index}</p>

    {/* Name + Image */}
    <div className='flex items-center gap-2'>
      <img src={item.userData.image} className='w-8 rounded-full' alt="" />
      <p>{item.userData.name}</p>
    </div>

    {/* Payment Type */}
    <div>
      <p className='text-xs inline border border-primary px-2 rounded-full'>
        {item.payment ? 'Online' : 'CASH'}
      </p>
    </div>

    {/* Age */}
    <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>

    {/* Date & Time */}
    <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>

    {/* Amount */}
    <p>{currency}{item.amount}</p>

    {/* ✅ Separate Meeting Link Column */}
    <p>
      <a
  href={fend + item.meetingLink}
  target="_blank"
  rel="noopener noreferrer"
  className='text-blue-500 underline text-sm'
  onClick={() => console.log("Meeting link clicked:", fend+item.meetingLink)}
>
  Meeting Link
</a>

    </p>

    {/* Status / Actions */}
    {item.cancelled ? (
      <p className='text-red-400 text-xs font-medium'>Cancelled</p>
    ) : item.isCompleted ? (
      <p className='text-green-500 text-xs font-medium'>Completed</p>
    ) : (
      <div className='flex'>
        <img
          onClick={() => cancelAppointment(item._id)}
          className='w-10 cursor-pointer'
          src={assets.cancel_icon}
          alt=""
        />
        <img
          onClick={() => completeAppointment(item._id)}
          className='w-10 cursor-pointer'
          src={assets.tick_icon}
          alt=""
        />
      </div>
    )}
  </div>
))}

      </div>

    </div>
  )
}

export default DoctorAppointments