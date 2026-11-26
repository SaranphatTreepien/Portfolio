import OceanBackground from "@/components/site/OceanBackground";
import { DesktopSidebar, MobileBar } from "@/components/site/Sidebar";
import { DayFavicon } from "@/components/site/DayAvatar";

// Every visitor-facing page: the sea behind, then one centred row of sidebar + page, like a notebook.
// /live (full-screen demos) and /admin stay outside this group.
export default function SiteLayout({ children }) {
    return (
        <>
            <OceanBackground />
            <DayFavicon />
            <MobileBar />
            <div className="mx-auto lg:flex lg:max-w-[1340px]">
                <DesktopSidebar />
                <div className="min-h-screen min-w-0 flex-1 lg:pl-4">{children}</div>
            </div>
        </>
    );
}
