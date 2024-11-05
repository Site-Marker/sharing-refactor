import React from "react";
import ReactDOM from "react-dom/client";
import { Button } from "@/ui/button";
import { Loader2 } from "lucide-react";
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import Projects from "@/components/Projects";
import Project from "@/components/Project";
import Report from "@/components/Report";
import Document from "@/components/Document";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Icon from "@/components/shared/Icon";
import useFetchUser from "./api/useFetchUser";

const queryClient = new QueryClient()

const Index = () => <QueryClientProvider client={queryClient}>
    <LandingPage />
</QueryClientProvider>

const Loader = () => <div className="bg-gray-800 text-white flex items-center justify-center h-screen">
    <Loader2 className="animate-spin" />
</div>

const LandingPage = () => {

    const { isPending, data: user } = useFetchUser();

    if (isPending) return <Loader />;

    return user ? <App /> : <WelcomePage />
}

const App = () => {
    return <BrowserRouter>
        <Routes>
            <Route path="/" element={<Projects />} />
            <Route path="/projects/:id" element={<Project />} />
            <Route path="/reports/:id" element={<Report />} />
            <Route path="/documents/:id" element={<Document />} />
        </Routes>
    </BrowserRouter>
}

const WelcomePage = () => <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center justify-center p-4">
    <div className="text-center">
        <Icon className="w-20 h-20 text-gray-200 mx-auto mb-6" />
        <h1 className="text-4xl font-bold mb-2">Sharing</h1>
        <p className="text-xl text-gray-400 mb-8">Simplify your access management</p>

        <div className="space-y-4">
            <Button className="w-full max-w-xs" variant="default" onClick={() => window.location.href = '/users/sign_in'}>
                Sign In
            </Button>
            <Button className="w-full max-w-xs text-gray-900" variant="outline" onClick={() => window.location.href = '/users/sign_up'}>
                Sign Up
            </Button>
        </div>

        <p className="mt-8 text-sm text-gray-500">
            Share your resources. So your resources can be shared.
        </p>
    </div>
</div>


const root = document.getElementById('root') as HTMLElement;

if (root) {
    ReactDOM.createRoot(root).render(
        <React.StrictMode>
            <Index />
        </React.StrictMode>
    );
}
