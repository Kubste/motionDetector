import { LoginForm } from "@/components/login-form"
import TopBar from "@/components/UniversalComponents/TopBar.jsx";
export default function Page() {
    return (
        <div className="flex flex-col overflow-hidden h-screen">    {/*preventing the site from scrolling*/}
            <TopBar />
            <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}