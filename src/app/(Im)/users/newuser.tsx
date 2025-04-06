// const AddUserModal = ({ isOpen, onClose, onAdd }: AddUserModalProps) => {
//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState<UserFormData>({
//     name: '',
//     email: '',
//     phone: '',
//     address: '',
//     role: 'Stock Keeper',
//     sendSetupEmail: true
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onAdd(formData);
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-lg w-[600px] max-h-[90vh] overflow-y-auto">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold text-gray-800">Add New User</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//             <span className="sr-only">Close</span>
//             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         {/* Progress Steps */}
//         <div className="mb-8">
//           <div className="flex justify-between">
//             {[1, 2, 3, 4].map((num) => (
//               <div key={num} className={`flex items-center ${num < step ? 'text-blue-500' : 'text-gray-400'}`}>
//                 <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
//                   num <= step ? 'border-blue-500 text-blue-500' : 'border-gray-300'
//                 }`}>
//                   {num}
//                 </div>
//                 {num < 4 && <div className={`flex-1 h-1 mx-2 ${num < step ? 'bg-blue-500' : 'bg-gray-300'}`} />}
//               </div>
//             ))}
//           </div>
//         </div>

//         <form onSubmit={handleSubmit}>
//           {/* Step 1: Personal Details */}
//           {step === 1 && (
//             <div className="space-y-4">
//               <input
//                 type="text"
//                 placeholder="Full Name"
//                 className="w-full px-4 py-2 border rounded-lg"
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                 required
//               />
//               <input
//                 type="email"
//                 placeholder="Email"
//                 className="w-full px-4 py-2 border rounded-lg"
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                 required
//               />
//               <input
//                 type="tel"
//                 placeholder="Phone Number"
//                 className="w-full px-4 py-2 border rounded-lg"
//                 value={formData.phone}
//                 onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                 required
//               />
//               <textarea
//                 placeholder="Address"
//                 className="w-full px-4 py-2 border rounded-lg"
//                 value={formData.address}
//                 onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//                 required
//               />
//             </div>
//           )}

//           {/* Step 2: Role Assignment */}
//           {step === 2 && (
//             <div className="space-y-4">
//               <select
//                 className="w-full px-4 py-2 border rounded-lg"
//                 value={formData.role}
//                 onChange={(e) => setFormData({ ...formData, role: e.target.value as UserFormData['role'] })}
//               >
//                 <option value="Stock Keeper">Stock Keeper</option>
//                 <option value="Cashier">Cashier</option>
//                 <option value="Production">Production</option>
//                 <option value="Admin">Admin</option>
//               </select>
//             </div>
//           )}

//           {/* Step 3: Password Setup */}
//           {step === 3 && (
//             <div className="space-y-4">
//               <div className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   id="setupEmail"
//                   checked={formData.sendSetupEmail}
//                   onChange={(e) => setFormData({ ...formData, sendSetupEmail: e.target.checked })}
//                 />
//                 <label htmlFor="setupEmail">Send setup email to user</label>
//               </div>
//               {!formData.sendSetupEmail && (
//                 <input
//                   type="password"
//                   placeholder="Set Initial Password"
//                   className="w-full px-4 py-2 border rounded-lg"
//                   value={formData.password || ''}
//                   onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                   required
//                 />
//               )}
//             </div>
//           )}

//           {/* Step 4: Review */}
//           {step === 4 && (
//             <div className="space-y-4">
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <h3 className="font-bold mb-2">Review User Details</h3>
//                 <p><span className="font-semibold">Name:</span> {formData.name}</p>
//                 <p><span className="font-semibold">Email:</span> {formData.email}</p>
//                 <p><span className="font-semibold">Phone:</span> {formData.phone}</p>
//                 <p><span className="font-semibold">Role:</span> {formData.role}</p>
//                 <p><span className="font-semibold">Setup Method:</span> {formData.sendSetupEmail ? 'Email Setup Link' : 'Manual Password'}</p>
//               </div>
//             </div>
//           )}

//           <div className="flex justify-between mt-6">
//             {step > 1 && (
//               <button
//                 type="button"
//                 onClick={() => setStep(step - 1)}
//                 className="px-4 py-2 border rounded-lg hover:bg-gray-50"
//               >
//                 Previous
//               </button>
//             )}
//             {step < 4 ? (
//               <button
//                 type="button"
//                 onClick={() => setStep(step + 1)}
//                 className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//               >
//                 Next
//               </button>
//             ) : (
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
//               >
//                 Create User
//               </button>
//             )}
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };