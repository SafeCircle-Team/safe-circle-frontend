import '../styles/safecircle-theme.css'
import './Profile.css';


function Profile() {
  return (
    <div>
{/* Top App Bar (Shared Component Strategy) */}
  <header className="w-full top-0 sticky bg-surface z-50 flex justify-between items-center px-container-padding-mobile py-4 w-full">
    <button className="active:scale-95 transition-transform hover:opacity-80 transition-opacity">
      <span className="material-symbols-outlined text-primary">arrow_back</span>
    </button>
    <h1 className="font-headline-md text-headline-md text-primary font-bold">
      Resident Profile
    </h1>
    <button className="active:scale-95 transition-transform hover:opacity-80 transition-opacity">
      <span className="material-symbols-outlined text-primary">settings</span>
    </button>
  </header>
  <main className="px-container-padding-mobile space-y-stack-lg mt-6">
    {/* Profile Header Section */}

    <section className="flex flex-col items-center text-center space-y-4">
      <div className="relative">
        <div className="w-28 h-28 rounded-full border-4 border-surface-container-highest overflow-hidden elevation-level-2">
          <img
            className="w-full h-full object-cover"
            data-alt="A professional and friendly headshot of Alex Chen, a person in their late 20s with a warm smile, wearing a clean charcoal sweater. The background is a blurred high-end interior of a modern home with soft morning light, reflecting a premium, secure residential lifestyle in a high-fidelity digital interface style."
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeHsZcRU4YP_Q4t8fnI8irbypBWeMMJbMpqxdmDeZz_AXiy6SDQK_FY2-AdXvHWjPuSnREfzd5-X37NHEzdAHeA3zQrqns8pG0Bv8Jy6CeIv-ImdbWqoDhgTKbfuD2QJQHIvx9EwL45ueYCDRdi6sGc8o0ez7W1E76flqptAOSHPAkyAGINejrr3ydwSpmKwmXV32XmlSspa2LvNNyXADCubpBDU5O41REAGq5PCCGTUNyq2O4ouZU7lCNGiRBXMOdA8iVyEKO_A"
          />
        </div>
        <div className="absolute bottom-1 right-1 bg-black text-white p-1.5 rounded-full border-2 border-white flex items-center justify-center">
          <span
            className="material-symbols-outlined text-[16px]"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            verified
          </span>
        </div>
      </div>
      <div>
        <h2 className="font-display-lg-mobile text-display-lg-mobile text-on-background">
          Alex Chen
        </h2>
        <div className="inline-flex items-center px-3 py-1 mt-1 rounded-full bg-primary-fixed text-on-primary-fixed">
          <span className="font-label-bold text-label-bold uppercase">
            Verified Resident
          </span>
        </div>
      </div>
    </section>
    {/* Bento Grid Layout for Information */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
      {/* Personal Information Card */}
      <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined">person</span>
          <h3 className="font-headline-md text-headline-md">
            Personal Information
          </h3>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col">
            <span className="text-secondary font-label-md text-label-md">
              Full Name
            </span>
            <span className="font-body-base text-body-base text-on-background">
              Alex Chen
            </span>
          </div>
          <div className="flex flex-col border-t border-outline-variant/30 pt-3">
            <span className="text-secondary font-label-md text-label-md">
              Email
            </span>
            <span className="font-body-base text-body-base text-on-background">
              alex.chen@safecircle.io
            </span>
          </div>
          <div className="flex flex-col border-t border-outline-variant/30 pt-3">
            <span className="text-secondary font-label-md text-label-md">
              Phone Number
            </span>
            <span className="font-body-base text-body-base text-on-background">
              +1 (555) 012-3456
            </span>
          </div>
        </div>
      </div>
      {/* Estate Details Card */}
      <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined">home_work</span>
          <h3 className="font-headline-md text-headline-md">Estate Details</h3>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col">
            <span className="text-secondary font-label-md text-label-md">
              Community Name
            </span>
            <span className="font-body-base text-body-base text-on-background">
              Oakwood Estates
            </span>
          </div>
          <div className="flex flex-col border-t border-outline-variant/30 pt-3">
            <span className="text-secondary font-label-md text-label-md">
              Sector
            </span>
            <span className="font-body-base text-body-base text-on-background">
              Sector 4
            </span>
          </div>
          <div className="flex flex-col border-t border-outline-variant/30 pt-3">
            <span className="text-secondary font-label-md text-label-md">
              House Number
            </span>
            <span className="font-body-base text-body-base text-on-background">
              B-402
            </span>
          </div>
        </div>
      </div>
    </div>
    {/* Security & Settings List */}
    <section className="space-y-stack-md">
      <h3 className="font-label-bold text-label-bold text-secondary uppercase tracking-widest px-1">
        Security &amp; App Settings
      </h3>
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden elevation-level-2">
        {/* Security PIN */}
        <button className="w-full flex items-center justify-between p-4 hover:bg-secondary-container/30 transition-colors border-b border-outline-variant">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">lock_reset</span>
            </div>
            <div className="text-left">
              <p className="font-body-base text-body-base text-on-background">
                Security PIN
              </p>
              <p className="font-body-sm text-body-sm text-secondary">
                Manage your 6-digit SOS PIN
              </p>
            </div>
          </div>
          <span className="material-symbols-outlined text-outline-variant">
            chevron_right
          </span>
        </button>
        {/* Emergency Contacts */}
        <button className="w-full flex items-center justify-between p-4 hover:bg-secondary-container/30 transition-colors border-b border-outline-variant">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">
                contact_emergency
              </span>
            </div>
            <div className="text-left">
              <p className="font-body-base text-body-base text-on-background">
                Emergency Contacts
              </p>
              <p className="font-body-sm text-body-sm text-secondary">
                3 contacts added
              </p>
            </div>
          </div>
          <span className="material-symbols-outlined text-outline-variant">
            chevron_right
          </span>
        </button>
        {/* Notification Settings */}
        <button className="w-full flex items-center justify-between p-4 hover:bg-secondary-container/30 transition-colors border-b border-outline-variant">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">
                notifications_active
              </span>
            </div>
            <div className="text-left">
              <p className="font-body-base text-body-base text-on-background">
                Notification Settings
              </p>
              <p className="font-body-sm text-body-sm text-secondary">
                Manage alerts and sounds
              </p>
            </div>
          </div>
          <span className="material-symbols-outlined text-outline-variant">
            chevron_right
          </span>
        </button>
        {/* Privacy & Permissions */}
        <button className="w-full flex items-center justify-between p-4 hover:bg-secondary-container/30 transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">security</span>
            </div>
            <div className="text-left">
              <p className="font-body-base text-body-base text-on-background">
                Privacy &amp; Permissions
              </p>
              <p className="font-body-sm text-body-sm text-secondary">
                Manage data sharing
              </p>
            </div>
          </div>
          <span className="material-symbols-outlined text-outline-variant">
            chevron_right
          </span>
        </button>
      </div>
    </section>
    {/* Logout Action */}
    <div className="pt-stack-md">
      <button className="w-full py-4 rounded-xl bg-error text-on-error font-headline-md text-headline-md active:scale-95 transition-transform flex items-center justify-center gap-2">
        <span className="material-symbols-outlined">logout</span>
        Logout
      </button>
      <p className="text-center text-secondary font-label-md text-label-md mt-6 opacity-60">
        SafeCircle v2.4.1 (Stable Build)
      </p>
    </div>
  </main>
  {/* Bottom Navigation Bar (Shared Component Strategy) */}
  <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center h-16 px-4 bg-surface border-t border-outline-variant">
    {/* Home */}
    <div className="flex flex-col items-center justify-center text-secondary hover:bg-secondary-container/50 rounded-xl transition-colors px-4 py-1 active:scale-95 transition-transform">
      <span className="material-symbols-outlined">home</span>
      <span className="font-label-md text-label-md">Home</span>
    </div>
    {/* Security */}
    <div className="flex flex-col items-center justify-center text-secondary hover:bg-secondary-container/50 rounded-xl transition-colors px-4 py-1 active:scale-95 transition-transform">
      <span className="material-symbols-outlined">shield</span>
      <span className="font-label-md text-label-md">Security</span>
    </div>
    {/* Activity */}
    <div className="flex flex-col items-center justify-center text-secondary hover:bg-secondary-container/50 rounded-xl transition-colors px-4 py-1 active:scale-95 transition-transform">
      <span className="material-symbols-outlined">notifications</span>
      <span className="font-label-md text-label-md">Activity</span>
    </div>
    {/* Profile (ACTIVE) */}
    <div className="flex flex-col items-center justify-center text-primary font-bold hover:bg-secondary-container/50 rounded-xl transition-colors px-4 py-1 active:scale-95 transition-transform">
      <span
        className="material-symbols-outlined"
        style={{ fontVariationSettings: '"FILL" 1' }}
      >
        person
      </span>
      <span className="font-label-md text-label-md">Profile</span>
    </div>
  </nav>

  <div className="text-4xl">
  <span className="material-symbols-outlined">
    home
  </span>

  <span className="material-symbols-outlined">
    person
  </span>

  <span className="material-symbols-outlined">
    settings
  </span>
</div>

    </div>
  )
}

export default Profile
