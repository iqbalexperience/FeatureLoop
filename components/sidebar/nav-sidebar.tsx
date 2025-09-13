"use client"

import {
    ChartNoAxesCombined,
    ClockFading,
    Infinity,
    Kanban,
    KanbanIcon,
    LayoutDashboard,
    LayoutList,
    Lightbulb,
    MessageSquareWarning,
    UserCog,
    Users,
} from "lucide-react"

import { NavMain } from "./nav-primary"
import { NavSecondary } from "./nav-secondary"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { saasMeta } from "@/lib/appMeta/meta"
import { NavBottom } from "./nav-bottom"
import { authClient, useSession } from "@/lib/auth-client"
import { Button } from "../ui/button"
import { UserButton } from "@daveyplate/better-auth-ui"

export const navPaths = {
    navPrimary: [
        {
            title: "Feedback",
            url: "/feedback",
            icon: MessageSquareWarning,
        },
        {
            title: "Tasks",
            url: "/board",
            icon: KanbanIcon,
        },
        {
            title: "Changelog",
            url: "/changelog",
            icon: ClockFading,
        },
    ],
    navSecondary: [
        {
            title: "Dashboard",
            url: "/",
            icon: ChartNoAxesCombined,
        },
        {
            title: "Topics",
            url: "/topics",
            icon: Lightbulb,
        },


    ],
    navBottom: [
        {
            title: "Admin Dashboard",
            url: "/admin/dashboard",
            icon: LayoutDashboard
        },
        {
            title: "Manage Users",
            url: "/admin/users",
            icon: Users,
        },
    ],

}

export function NavSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { data: session } = useSession()
    const isAuthorized = session?.user && ["admin", "developer"].includes(session.user.role as string);

    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="/">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                                    {/* <img src={saasMeta.logo} alt={saasMeta.name} /> */}
                                    <Infinity className="size-8 " />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium font-mono tracking-wider">{saasMeta.name}</span>
                                    <span className="truncate text-xs">{saasMeta.description}</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {session?.session?.impersonatedBy && <Button variant={"destructive"}
                    onClick={async () => {
                        await authClient.admin.stopImpersonating();
                        window.location.reload();
                    }}>
                    <UserCog />
                    Stop Impersonating
                </Button>}
                {/* <div className="pl-3 pr-2 w-full">
                    <OrganizationSwitcherClient />
                </div> */}
                <NavMain items={navPaths.navPrimary} />
                {isAuthorized && <NavSecondary projects={navPaths.navSecondary} />}
                {/* <NavColections /> */}
                {isAuthorized && <NavBottom items={navPaths.navBottom} className="mt-auto" />}
            </SidebarContent>
            <SidebarFooter>
                <UserButton size={"default"} className="bg-secondary text-secondary-foreground hover:bg-secondary/50 " />
                {/* <OrganizationSwitcherClient size={"default"} /> */}
            </SidebarFooter>
        </Sidebar>
    )
}
