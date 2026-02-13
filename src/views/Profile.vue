<template>
    <div class="min-h-screen bg-gray-100 p-6">
        <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
            <h2 class="text-2xl font-bold mb-4">My Profile</h2>
            <form @submit.prevent="updateProfile" class="space-y-4">
                <div>
                    <label class="block font-medium mb-1">Email</label>
                    <input v-model="profile.email" type="email"
                        class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-orange-300" />
                </div>
                <div>
                    <label class="block font-medium mb-1">Role</label>
                    <input v-model="profile.role" type="text" disabled
                        class="w-full px-3 py-2 border rounded-md bg-gray-100" />
                </div>
                <button type="submit"
                    class="w-full bg-orange-400 text-white py-2 rounded-md hover:bg-orange-500 transition">
                    Update Profile
                </button>
                <p v-if="message" class="text-green-500 mt-2">{{ message }}</p>
                <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
            </form>
        </div>
    </div>
</template>

<script >
import { reactive, ref, onMounted } from "vue";
import API from "@/api/axios";

export default {
    setup() {
        const profile = reactive({ email: "", role: "" });
        const message = ref("");
        const errorMessage = ref("");

        const fetchProfile = async () => {
            try {
                const res = await API.get("/profile/");
                profile.email = res.data.email;
                profile.role = res.data.role;
            } catch (err) {
                errorMessage.value = err.response?.data?.error || "Failed to load profile";
            }
        };

        const updateProfile = async () => {
            try {
                await API.put("/profile/", { email: profile.email });
                message.value = "Profile updated successfully!";
                errorMessage.value = "";
            } catch (err) {
                errorMessage.value = err.response?.data?.error || "Update failed";
                message.value = "";
            }
        };

        onMounted(fetchProfile);

        return { profile, message, errorMessage, updateProfile };
    },
};
</script>
