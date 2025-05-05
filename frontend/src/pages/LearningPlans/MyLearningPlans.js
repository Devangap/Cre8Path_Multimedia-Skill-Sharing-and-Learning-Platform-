// import React, { useEffect, useState } from 'react';

// const MyLearningPlans = () => {
//   const [plans, setPlans] = useState([]);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch('http://localhost:8080/learning-plans/my-plans', {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       credentials: 'include'
//     })
//       .then(async response => {
//         const text = await response.text();
//         if (!response.ok) {
//           throw new Error('Error: ' + response.status + ' - ' + text);
//         }
  
//         try {
//           const json = JSON.parse(text);
//           setPlans(json);
//         } catch (e) {
//           throw new Error('Server did not return valid JSON: ' + text);
//         }
//       })
//       .catch(err => {
//         console.error("Failed to fetch learning plans:", err);
//         setError(err.message); // <-- This was missing
//       });
//   }, []);
  
// //   useEffect(() => {
// //     fetch('http://localhost:8080/learning-plans/my-plans', {
// //       method: 'GET',
// //       headers: {
// //         'Content-Type': 'application/json',
// //         // Uncomment if using token-based auth
// //         // 'Authorization': 'Bearer ' + localStorage.getItem('token')
// //       },
// //       credentials: 'include' // IMPORTANT: Required for session-based auth
// //     })
// //         .then(async response => {
// //             const text = await response.text(); // Read the raw response body
// //             if (!response.ok) {
// //             throw new Error('Error: ' + response.status + ' - ' + text);
// //             }

// //             try {
// //                 const json = JSON.parse(text); // Parse JSON manually
// //                 setPlans(json);
// //               } catch (e) {
// //                 throw new Error('Server did not return valid JSON: ' + text);
// //               }
// //             });
// //     }, []);   
 


//   return (
//     <div style={{ padding: '2rem' }}>
//       <h2>My Learning Plans</h2>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {plans.length === 0 ? (
//         <p>No learning plans found.</p>
//       ) : (
//         <ul>
//           {plans.map(plan => (
//             <li key={plan.id}>
//               <strong>{plan.title}</strong><br />
//               <small>{plan.description}</small>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default MyLearningPlans;

import React, { useEffect, useState } from 'react';

const MyLearningPlans = () => {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLearningPlans = async () => {
      try {
        const response = await fetch('http://localhost:8080/learning-plans/my-plans', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Important for session-based authentication
        });

        const text = await response.text();

        if (!response.ok) {
          throw new Error('Error: ' + response.status + ' - ' + text);
        }

        try {
          const json = JSON.parse(text);
          setPlans(json);
        } catch (err) {
          throw new Error('Invalid JSON: ' + text);
        }
      } catch (err) {
        console.error('Failed to fetch learning plans:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLearningPlans();
  }, []);

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">My Learning Plans</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && plans.length === 0 && !error && (
        <p>No learning plans found.</p>
      )}

      {!loading && plans.length > 0 && (
        <ul className="space-y-4">
          {plans.map((plan) => (
            <li key={plan.id} className="p-4 border border-gray-300 rounded">
              <h3 className="text-lg font-semibold">{plan.title}</h3>
              <p className="text-gray-600">{plan.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyLearningPlans;
