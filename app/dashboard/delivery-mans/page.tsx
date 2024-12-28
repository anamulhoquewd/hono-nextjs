"use client";

import DeliveryManTable from "@/app/_components/delivery-mans";

function DeliverMans() {
  return (
    <div key={"delivery-mans-page"} className="container md:px-6 mx-auto py-10">
      <DeliveryManTable />
    </div>
  );
}

export default DeliverMans;
