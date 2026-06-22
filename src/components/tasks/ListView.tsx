import arrowLeft from '../../assets/arrowleft.png';
import arrowRight from '../../assets/arrowRight.png'

export default function ListView() {
  return (
    <div className='overflow-x-auto'>
        <table className="min-w-225 w-full text-center  border-separate border-spacing-0">
            <thead className='font-extrabold text-secondary bg-background uppercase'>
                <tr >
                    <th className="py-4 font-extrabold">Task ID</th>
                    <th className="py-4 font-extrabold">Title</th>
                    <th className="py-4 font-extrabold">Status</th>
                    <th className="py-4 font-extrabold">Due Date</th>
                    <th className="py-4 font-extrabold">Assignee</th>
                    <th className="py-4 font-extrabold"></th>
                </tr>
            </thead>
            
            <tbody className='font-medium'>
                <tr className='bg-white'>
                    <td className="py-4">TASK-125</td>
                    <td className="py-4">Develop responsive bento grid components</td>
                    <td className="py-4">IN PROGRESS</td>
                    <td className="py-4">25 Oct 2025</td>
                    <td className="py-4">John Doe</td>
                    <td className="py-4"><button>⋯</button></td>
                </tr>
            
            </tbody>

            <tfoot>
                <tr>
                    <td colSpan={6}>
                        <div className="flex justify-between bg-white p-4 items-center w-full">
                            <p className="font-bold text-secondary">
                                Showing 5 of 24 tasks
                            </p>
                            <div className="flex items-center gap-2">
                                <button className="w-8 h-8 border flex items-center justify-center">
                                    <img src={arrowLeft} className="w-1 h-2" />
                                </button>
                                <button className="w-8 h-8 border flex items-center justify-center">
                                    <img src={arrowRight} className="w-1 h-2" />
                                </button>
                            </div>
                        </div>
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>
  )
}



// import arrowLeft from '../../assets/arrowleft.png';
// import arrowRight from '../../assets/arrowRight.png'

// export default function ListView() {
//   return (
//     <div>
//         <table className="w-full text-center  border-separate border-spacing-y-8 ">
//             <thead  className='font-bold text-secondary bg-background '>
//                 <tr>
//                     <th>Task ID</th>
//                     <th>Title</th>
//                     <th>Status</th>
//                     <th>Due Date</th>
//                     <th>Assignee</th>
//                     <th></th>
//                 </tr>
//             </thead>
            
//             <tbody className='font-medium bg-white '>
//                 <tr className='bg-white'>
//                     <td>TASK-125</td>
//                     <td>Develop responsive bento grid components</td>
//                     <td>IN PROGRESS</td>
//                     <td>25 Oct 2025</td>
//                     <td>John Doe</td>
//                     <td><button>⋯</button></td>
//                 </tr>
                
                
//             </tbody>
//             <tfoot>
//   <tr>
//     <td colSpan="6">
//       <div className="flex justify-between bg-white p-4 items-center w-full">
//         <p className="font-bold text-secondary">
//           Showing 5 of 24 tasks
//         </p>

//         <div className="flex items-center gap-2">
//           <button className="w-8 h-8 border flex items-center justify-center">
//             <img src={arrowLeft} className="w-1 h-2" />
//           </button>

//           <button className="w-8 h-8 border flex items-center justify-center">
//             <img src={arrowRight} className="w-1 h-2" />
//           </button>
//         </div>
//       </div>
//     </td>
//   </tr>
// </tfoot>
//         </table>
//     </div>
//   )
// }
