"use client";

import AuthenticatedOnlyFeature from "@templates/Authenticated/authenticated";
import Navbar from "@containers/Navbar/navbar";
import useAuth from "@/hooks/useAuth";
import useBarberShop from "@/hooks/queries/useBarberShop";
import { storageGet } from "@/store/services/storage";
import { BarberShopEntity } from "@/common/entities/barberShopEntity";
import { LogoutOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useState } from "react";
import ResponsiveNavbar from "@/containers/ResponsiveNavbar/ResponsiveNavbar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import useProfile from "@/hooks/queries/useProfile";
import { useQueryClient } from "@tanstack/react-query";

const authMenuItems = [
  {
    label: "Home",
    href: "/home"
  },
  {
    label: "Profile",
    href: "/profile"
  }
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { logoutUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: barber, isLoading } = useBarberShop(
    storageGet("uid") as string
  );
  const { data: user } = useProfile(storageGet("uid") as string);

  return (
    <AuthenticatedOnlyFeature>
      <>
        <Navbar data={(barber as BarberShopEntity) || user} />

        <div className="w-full gap-5 pl-0 xl:min-h-screen xl:pl-[16vw]">
          <header className="flex h-16 items-center justify-between border-b-2 border-primary-light-gray px-10 py-4 shadow-md xl:justify-end">
            <div
              className="block text-xl font-bold text-primary-amber xl:hidden"
              onClick={() => setIsOpen(true)}
            >
              <MenuUnfoldOutlined />
            </div>

            <button
              className="text-xl text-primary-amber"
              onClick={() => setIsDialogOpen(true)}
            >
              <LogoutOutlined />
            </button>

            <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
              <DialogContent className="w-60 bg-white">
                <DialogHeader>
                  <DialogTitle>Deseja sair da sua conta?</DialogTitle>
                  <div className="mt-2 flex justify-center gap-2 md:justify-end">
                    <button
                      className="rounded-full bg-primary-amber px-2 py-1 hover:bg-primary-amber/70"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      className="py-1hover:bg-primary-light-gray/70 rounded-full bg-primary-light-gray px-2"
                      onClick={() => {
                        logoutUser();
                        queryClient.clear();
                      }}
                    >
                      Sair
                    </button>
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            <ResponsiveNavbar
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              data={(barber as BarberShopEntity) || user}
            />
          </header>
          <main className="p-5 md:p-10">{children}</main>
        </div>
      </>
    </AuthenticatedOnlyFeature>
  );
}
