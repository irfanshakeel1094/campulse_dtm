import React from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="bg-background text-on-surface min-h-screen selection:bg-primary/30 bg-grid">
      {/* Atmospheric Background Layers */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-surface-container-low to-transparent">
        <div className="flex justify-between items-center px-6 py-8 w-full max-w-7xl mx-auto">
          <div className="text-2xl font-bold tracking-tighter text-primary font-headline">
            Campulse
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
              About the Pulse
            </button>
          </div>
        </div>
      </nav>

      <main className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full text-center mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-high mb-6 border border-outline-variant/15">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-tertiary">
              The Electric Nexus is Live
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-8 bg-gradient-to-br from-on-surface via-on-surface to-primary bg-clip-text text-transparent max-w-4xl mx-auto leading-[0.9] font-headline">
            Elevate your campus experience.
          </h1>

          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Connect with the pulse of your university. Whether you're hunting for the next big hackathon or organizing the semester's wildest gala, Campulse is your catalyst.
          </p>
        </section>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
          {/* Student Role Card */}
          <div className="group relative glass-panel rounded-[2rem] p-8 md:p-12 overflow-hidden transition-all duration-500 hover:translate-y-[-8px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-[120px] text-primary">school</span>
            </div>

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-primary-dim/20 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">rocket_launch</span>
              </div>

              <h2 className="text-3xl font-bold mb-4 tracking-tight font-headline">
                I am a Student
              </h2>

              <p className="text-on-surface-variant mb-10 leading-relaxed min-h-[4.5rem]">
                Discover exclusive events, track campus activities, and build your social network with the elite event hub for students.
              </p>

              <div className="flex flex-col gap-4">
                <Link
                  to="/register?role=student"
                  className="w-full bg-gradient-to-r from-primary to-primary-dim text-on-primary font-bold py-4 rounded-full transition-all hover:shadow-[0_0_20px_rgba(186,158,255,0.3)] active:scale-[0.98] text-center"
                >
                  Join the Pulse
                </Link>
                <Link
                  to="/login?role=student"
                  className="w-full py-4 text-on-surface font-medium border border-outline-variant/30 rounded-full hover:bg-surface-bright transition-colors text-center"
                >
                  Already a member? Log In
                </Link>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          </div>

          {/* Organizer Role Card */}
          <div className="group relative glass-panel rounded-[2rem] p-8 md:p-12 overflow-hidden transition-all duration-500 hover:translate-y-[-8px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-[120px] text-secondary">campaign</span>
            </div>

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-secondary text-3xl">electric_bolt</span>
              </div>

              <h2 className="text-3xl font-bold mb-4 tracking-tight font-headline">
                I am an Organizer
              </h2>

              <p className="text-on-surface-variant mb-10 leading-relaxed min-h-[4.5rem]">
                Host legendary experiences. Manage attendance, track engagement, and scale your influence across the entire campus ecosystem.
              </p>

              <div className="flex flex-col gap-4">
                <Link
                  to="/register?role=organizer"
                  className="w-full bg-gradient-to-r from-secondary to-secondary-dim text-on-secondary-container font-bold py-4 rounded-full transition-all hover:shadow-[0_0_20px_rgba(119,153,255,0.3)] active:scale-[0.98] text-center"
                >
                  Start Organizing
                </Link>
                <Link
                  to="/login?role=organizer"
                  className="w-full py-4 text-on-surface font-medium border border-outline-variant/30 rounded-full hover:bg-surface-bright transition-colors text-center"
                >
                  Organizer Dashboard
                </Link>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          </div>
        </div>

        {/* Footer Visual Section */}
        <section className="mt-24 w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 relative h-[300px] rounded-[2rem] overflow-hidden group">
            <img
              alt="Campus nightlife"
              className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOnQf48pYrZOFg8xn6KqXj625pgkz9-qe7STQJxVsSy_qlpJxFofwxHm2yr7ucgRLuwaMARt0FeSMMPQh-Wa4qRW1ie3aj0w2qIow1r-A4gwLIGEg_Vl5ABMNSxPkcNFfVxzZDPf2_xANe0N4vXWnyigWQL_gSNKe0j5CXJ2pSprErnU_x-nU6DYNHK7L9E_0HjTIVMptvC5H2C5OCfU9u5E4ribE1TXPJ9psb980vwTLvctidMvoGo6GsikWLszrBnw4ToMXakRc"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
            <div className="absolute bottom-8 left-8">
              <h3 className="text-2xl font-bold text-on-surface font-headline">Join 50,000+ Students</h3>
              <p className="text-on-surface-variant">Across top universities worldwide.</p>
            </div>
          </div>

          <div className="bg-surface-container rounded-[2rem] p-8 flex flex-col justify-center">
            <div className="flex -space-x-4 mb-6">
              <img alt="Student" className="w-12 h-12 rounded-full border-2 border-surface object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiRXQvi-8-TIvNwYK0jH6Q4Tt651PJwa-ZLdreiOupZD35ACGmvaid7yDPRQaqoEzFYg6D4UAsH3TOjz5stefJfcKPluqo-awJMBorWn0u0fnqrciv7hsSw7RhqOX4lltdrBYFQt7otVQjO7i2R6dMWH_ZtMKY3DErP7V5ZIYM9ocqFXG64RxnybwIr1cqff2qOsGDPfYhMFieIH_mzss-PdePvRNkAF4hZ-LKf7WOyn1eFFjbhnPOBOi8G-cshiBw89Cje03zJGo" />
              <img alt="Student" className="w-12 h-12 rounded-full border-2 border-surface object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUF29lJyC2Q5w3J60IgkewRR7e__keJrSCu-oXZjmV-xHeFAU2kCitpCHw5KdURpmRGpC9VloohPwE4ShmgW84Kmp13-4H0phgsdS-8ZZrEbpW69X0bKFVBN_e4GKs_mY9eDhlXS3lId4PYWeevm8YodXtz9Q5wWEcHMvw2iaGQ1xvOEoxrzAWOwJVmGeKLkSkk5v8nypt4s2iQgKl9mxjL8MmmKssl7rpgrcGhx68ByhfvoBkz69ZbQb6Uln3z3n2NOHW6YCeNjA" />
              <img alt="Student" className="w-12 h-12 rounded-full border-2 border-surface object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4vdkdqeSJFbteRow9_gtZ_WkTnY22hlZOe3wEVQuJbl57HtgRHjB7YBQBeqSTHU2YjxOFN3jlFWhVj4UqHBG2A4T55zL5CNNuSLDmnqPrKB7xc3NziZOey9j1_mDwWRljLnlw1eZkJHwqO17tTRC7-WetQ4zoI7QK3PNm75vIspHI-YyLLgKE9dvqEvvnq8aXMtw226DlvaPtCwl5QAsatyQSAez4nPm77cGtVFE46dms60UEqzjqhDz7a6IB_aZvw8w61f7X-fQ" />
              <div className="w-12 h-12 rounded-full border-2 border-surface bg-surface-bright flex items-center justify-center text-xs font-bold text-primary">
                +12k
              </div>
            </div>
            <p className="text-sm font-medium text-on-surface italic">
              "The only platform that truly understands how campus life moves."
            </p>
            <p className="text-xs text-on-surface-variant mt-2">— Marcus Chen, Event Lead</p>
          </div>
        </section>
      </main>

      {/* Decorative Bottom Gradient */}
      <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
    </div>
  );
}
