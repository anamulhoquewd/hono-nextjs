"use client";

import Information from "@/app/_components/dashboard";

function Dashboard() {
  return (
    <div key={"dashboard-page"} className="container mx-auto my-10">
      <h1 className="text-3xl ml-4 md:ml-0 md:px-6 font-bold mb-6">
        Dashboard
      </h1>
      <Information />
    </div>
  );
}

export default Dashboard;
