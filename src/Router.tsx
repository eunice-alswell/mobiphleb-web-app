import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";

import Pages from "./pages";
import { FullScreenLoader } from "./components/Loader";

export default function Router() {
    return (
        <Suspense fallback={<FullScreenLoader text="Loading page..." />}>
            <Routes>
                <Route path="/" element={<Pages.Home />} />
                {/* simple redirect alias for /home */}
                <Route path="/home" element={<Pages.Home />} />
                <Route path="/about" element={<Pages.About />} />
                <Route path="/individual-booking" element={<Pages.IndividualBooking />} />
                <Route path="/corporate-services" element={<Pages.CorporateServices />} />
                <Route path="/contact" element={<Pages.Contact />} />
                <Route path="/terms" element={<Pages.Terms />} />

                {/* catch-all not found route */}
                <Route path="*" element={<Pages.NotFound />} />
            </Routes>
        </Suspense>
    )
}
