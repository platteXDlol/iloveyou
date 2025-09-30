<template>
    <div class="flex flex-col items-center justify-center text-center min-h-screen p-4 sm:p-6 md:p-8 bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100">
    <div class="max-w-2xl bg-white rounded-3xl shadow-2xl p-8 sm:p-12 border border-purple-100">
            <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold text-purple-500">
                Welcome to <span class="text-sky-500">I Love You</span>
            </h1>
            <p class="mt-6 text-lg text-gray-600">
                This is your special place to track relationship milestones, play games, and discover new adventures together. Keep the spark alive and celebrate your journey, one day at a time.
            </p>
            <div class="mt-10">
                <router-link 
                    to="/dashboard" 
                    class="py-3 px-8 bg-gradient-to-r from-purple-500 to-sky-500 text-white rounded-full text-lg font-bold hover:from-sky-500 hover:to-purple-500 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                    View Your Dashboard
                </router-link>
            </div>
        </div>
    </div>
</template>
