"use client";

import { Separator } from "@/components/ui/separator";
import useProfile from "@/hooks/queries/useProfile";
import { errorToast } from "@/hooks/useAppToast";
import useAuth from "@/hooks/useAuth";
import { storageGet } from "@/store/services/storage";
import {
  CalendarOutlined,
  PullRequestOutlined,
  ScissorOutlined,
  TeamOutlined
} from "@ant-design/icons";
import AdministratorOnlyFeature from "@templates/Administrator/administrator";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const items = [
  {
    label: "Usuários",
    icon: <TeamOutlined />,
    url: "/admin/usuarios"
  },
  {
    label: "Barbearias",
    icon: <ScissorOutlined />,
    url: "/admin/barbearias"
  },
  {
    label: "Agendamentos",
    icon: <CalendarOutlined />,
    url: "/admin/agendamentos"
  },
  {
    label: "Solicitações",
    icon: <PullRequestOutlined />,
    url: "/admin/solicitacoes"
  }
];

const NavItem = ({
  icon,
  label,
  url
}: {
  label: string;
  icon: any;
  url: string;
}) => {
  const router = useRouter();
  const currentRoute = usePathname();

  return (
    <li
      className={`flex cursor-pointer items-center gap-4 rounded p-2  ${
        (currentRoute.startsWith(url) && url !== "/admin") ||
        currentRoute === url
          ? "bg-primary-amber/70 hover:bg-primary-amber/90"
          : "hover:bg-gray-400/80"
      }`}
      onClick={() => router.push(url)}
    >
      {icon} <span className="mt-1">{label}</span>
    </li>
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const { logoutUser } = useAuth();
  const { data: user } = useProfile(storageGet("uid") as string);
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== "admin") {
      logoutUser();
      router.push("/");
      errorToast("Você não tem permissão para acessar essa página");
    }
  }, [user, logoutUser, router]);

  return (
    <AdministratorOnlyFeature>
      <div>
        <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-300 p-5 shadow">
          <h1 className="text-xl font-medium">Painel do Admin</h1>
          <h2 className="text-primary-amber">{user?.name}</h2>
          <Separator className="my-4 bg-black" />
          <ul className="flex flex-col gap-4">
            {items.map((item, index) => (
              <NavItem
                key={index}
                icon={item.icon}
                label={item.label}
                url={item.url}
              />
            ))}
          </ul>
          <div
            className="absolute bottom-6 left-6 cursor-pointer"
            onClick={logoutUser}
          >
            {"<-"} Sair
          </div>
        </aside>
        <main className="ml-64 p-10">{children}</main>
      </div>
    </AdministratorOnlyFeature>
  );
}
