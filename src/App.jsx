import { ThemeProvider } from './hooks/useTheme'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { Hero } from './components/sections/Hero'
import { About } from './components/sections/About'
import { Expertise } from './components/sections/Expertise'
import { Projects } from './components/sections/Projects'
import { Experience } from './components/sections/Experience'
import { Credentials } from './components/sections/Credentials'
import { Research } from './components/sections/Research'
import { Blog } from './components/sections/Blog'
import { Libraries } from './components/sections/Libraries'
import { Contact } from './components/sections/Contact'
import { BackToTop } from './components/ui/BackToTop'

export default function App() {
  return (
    <ThemeProvider>
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <About />
        <Expertise />
        <Projects />
        <Experience />
        <Credentials />
        <Research />
        <Blog />
        <Libraries />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </ThemeProvider>
  )
}
