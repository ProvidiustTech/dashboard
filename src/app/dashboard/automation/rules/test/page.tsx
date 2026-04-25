import { Suspense } from "react";
import TestSimulatorPageContent from "./test-content";

export default function TestSimulatorPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">Loading...</div>}>
            <TestSimulatorPageContent />
        </Suspense>
    );
}
