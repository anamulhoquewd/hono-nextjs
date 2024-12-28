"use client";

import OrderTable from "@/app/_components/orders";

function Orders() {
  return (
    <div key={"orders-page"} className="container md:px-6 mx-auto py-10">
      <OrderTable />
    </div>
  );
}

export default Orders;
