<template>
    <nav class="main-header">
        <div class="header-left">
            <span class="ily-text">ily</span>
        </div>
        <div class="header-center">
            <router-link to="/" class="nav-link">Home</router-link>
            <router-link to="/game" class="nav-link">Game</router-link>
            <router-link to="/profile" class="nav-link">Profile</router-link>
            <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
        </div>
        <div class="header-right">
            <button class="profile-btn" aria-label="Profile"></button>
        </div>
    </nav>
</template>

<style scoped>
.main-header {
  width: 100%;
  min-height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  background: linear-gradient(90deg, #7f5af0 0%, #0ea5e9 100%);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.header-left {
  flex: 1;
  display: flex;
  align-items: center;
}
.ily-text {
  font-family: 'Montserrat', Arial, sans-serif;
  font-size: 1.7rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.1em;
}
.header-center {
  flex: 2;
  display: flex;
  justify-content: center;
  gap: 2.5rem;
}
.nav-link {
  color: #fff;
  font-family: 'Montserrat', Arial, sans-serif;
  font-size: 1.1rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: background 0.2s, color 0.2s;
}
.nav-link:hover {
  background: rgba(255,255,255,0.12);
  color: #0ea5e9;
}
.header-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.profile-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7f5af0 60%, #0ea5e9 100%);
  border: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  cursor: pointer;
  transition: box-shadow 0.2s;
}
.profile-btn:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}
@media (max-width: 700px) {
  .main-header {
    flex-direction: column;
    padding: 0.5rem 0.5rem;
    min-height: 80px;
  }
  .header-center {
    gap: 1rem;
    font-size: 1rem;
  }
  .ily-text {
    font-size: 1.2rem;
  }
  .profile-btn {
    width: 32px;
    height: 32px;
  }
}
</style>