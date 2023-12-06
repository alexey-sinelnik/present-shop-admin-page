import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Navigation from "@/components/navigation";
import LogoComponent from "@/components/logo";
import { PropsType } from "@/common/types";

export default function Layout({ children }: PropsType) {
    const { data: session } = useSession();
    const [showNavigation, setShowNavigation] = useState(false);
    if (!session) {
        return (
            <div className="bg-bgGray w-screen h-screen flex items-center">
                <div className="text-center w-full">
                    <button
                        onClick={() => signIn("google")}
                        className="bg-white p-4 rounded-lg"
                    >
                        Login with Google
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-bgGray min-h-screen">
            <div className="md:hidden flex items-center p-4">
                <button onClick={() => setShowNavigation(!showNavigation)}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                        />
                    </svg>
                </button>
                <div className="flex grow justify-center mr-6">
                    <LogoComponent />
                </div>
            </div>
            <div className=" flex">
                <Navigation showNavigation={showNavigation} />
                <div className="flex-grow p-4">{children}</div>
            </div>
        </div>
    );
}
