import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function MainLayout({children}: {children: React.ReactNode}) {
  return (
    <div>
        <Navbar />
        <main>
            {children}
        </main>
        <Footer />
    </div>
  )
}
