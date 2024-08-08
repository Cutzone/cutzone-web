"use client";

import AdminInfoPage from "@/components/organisms/AdminInfoPage";
import useAllBarberShops from "@/hooks/queries/useAllBarberShops";
import { columns } from "./columns";

const Barbearias = () => {
  const { data, isLoading, dataUpdatedAt, refetch, isFetching } =
    useAllBarberShops();
  const createdBarberShops = data?.filter(
    (barberShop) => barberShop.aproved === true && barberShop.rejected === false
  );
  return (
    <AdminInfoPage
      columns={columns}
      data={createdBarberShops || []}
      isLoading={isLoading}
      title="Barbearias"
      isFetching={isFetching}
      dataUpdatedAt={dataUpdatedAt}
      onRefetch={refetch}
    />
  );
};

export default Barbearias;
