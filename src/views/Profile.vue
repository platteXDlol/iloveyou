<template>
    <div class="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-pink-100">
        <div class="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 w-full max-w-4xl border border-purple-100">
            <div class="flex flex-col md:flex-row md:gap-12">
                <!-- Avatar Section -->
                <div class="relative flex flex-col items-center md:w-1/3 gap-2">
                    <input type="file" ref="fileInput" @change="onFileChange" class="hidden" accept="image/*" />
                    <img :src="user.avatar" @click="openFileInput" alt="User Avatar" class="w-40 h-40 rounded-full object-cover shadow-xl border-4 border-purple-400 cursor-pointer transition-transform duration-200 hover:scale-105" />
                    <div class="font-bold text-2xl text-purple-500 mt-4 tracking-wide">@username</div>
                </div>

                <!-- Form Section -->
                <form class="w-full md:w-2/3 flex flex-col gap-6 mt-8 md:mt-0" @submit.prevent="changeSettings">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div class="flex flex-col gap-1">
                            <label for="fullName" class="text-purple-500 font-medium">Name</label>
                            <input type="text" id="fullName" v-model="user.name" placeholder="Full Name" class="p-3 rounded-xl border border-gray-300 focus:border-purple-500 outline-none transition-colors" />
                        </div>
                        <div class="flex flex-col gap-1">
                            <label for="birthdate" class="text-purple-500 font-medium">Birthdate</label>
                            <input type="date" id="birthdate" v-model="user.birthdate" class="p-3 rounded-xl border border-gray-300 focus:border-purple-500 outline-none transition-colors" />
                        </div>
                    </div>
                    <div class="flex flex-col gap-1">
                        <label for="email" class="text-purple-500 font-medium">Email</label>
                        <input type="email" id="email" v-model="user.email" placeholder="your@email.com" class="p-3 rounded-xl border border-gray-300 focus:border-purple-500 outline-none transition-colors" />
                    </div>
                    <div class="flex flex-col gap-1">
                        <label for="phone" class="text-purple-500 font-medium">Phone</label>
                        <input type="tel" id="phone" v-model="user.phone" placeholder="+123456789" class="p-3 rounded-xl border border-gray-300 focus:border-purple-500 outline-none transition-colors" />
                    </div>
                    <div class="flex flex-col gap-1">
                        <label for="address" class="text-purple-500 font-medium">Address</label>
                        <input type="text" id="address" v-model="user.address" placeholder="123 Love St, City" class="p-3 rounded-xl border border-gray-300 focus:border-purple-500 outline-none transition-colors" />
                    </div>
                    <div class="flex flex-col gap-1">
                        <label for="bio" class="text-purple-500 font-medium">Bio</label>
                        <textarea id="bio" v-model="user.bio" rows="3" placeholder="Tell us something about you..." class="p-3 rounded-xl border border-gray-300 focus:border-purple-500 outline-none transition-colors"></textarea>
                    </div>
                    <button type="submit" class="w-full py-3 bg-gradient-to-r from-purple-500 to-sky-500 text-white rounded-xl text-lg font-bold hover:from-sky-500 hover:to-purple-500 transition-all shadow-lg hover:shadow-2xl mt-4">Save Changes</button>
                </form>
            </div>
        </div>
    </div>
</template>



<script>
export default {
    name: 'Profile',
    data() {
        return {
            user: {
                name: '',
                birthdate: '',
                email: '',
                phone: '',
                address: '',
                bio: '',
                avatar: 'https://i.pinimg.com/736x/8c/14/9b/8c149bfad0dfc0366e70b97f679bd170.jpg'
            }
        }
    },
    methods: {
        changeSettings() {
            alert('Profile updated!');
        },
        openFileInput() {
            this.$refs.fileInput.click();
        },
        onFileChange(e) {
            const file = e.target.files[0];
            if (file) {
                this.user.avatar = URL.createObjectURL(file);
            }
        }
    }
}
</script>