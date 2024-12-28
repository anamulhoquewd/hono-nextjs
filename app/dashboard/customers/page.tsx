"use client";

import CustomersTable from "@/app/_components/customers/customerList";

function Customers() {
  return (
    <div key={"customers-page"} className="container md:px-6 mx-auto py-10">
      <CustomersTable />
    </div>
  );
}

export default Customers;
