// import React from "react";
// import { useRouter } from "next/router";
// import ClassInfo from "../components/ClassInfo";
// import AssignmentList from "../components/AssignmentList";
// import AssistantPanel from "../components/AssistantPanel";
// import StudentView from "../components/StudentView";
// import { useAuth } from "../../lib/auth";

// const PraktikumPage = () => {
//   const router = useRouter();
//   const { id } = router.query;
//   const { user } = useAuth(); // Assuming useAuth provides user info
//   const isAssistant = user?.role === "assistant";

//   // Fetch class and assignment data based on the ID
//   // This is a placeholder for your data fetching logic
//   const classData = {}; // Replace with actual data fetching
//   const assignments = []; // Replace with actual data fetching

//   return (
//     <div className="p-4">
//       <ClassInfo classData={classData} />
//       <h2 className="text-xl font-bold mt-4">Assignments</h2>
//       <AssignmentList assignments={assignments} />
//       {isAssistant && <AssistantPanel assignments={assignments} />}
//       {!isAssistant && <StudentView assignments={assignments} />}
//     </div>
//   );
// };

// export default PraktikumPage;
