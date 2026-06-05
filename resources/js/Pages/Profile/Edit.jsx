import MarketplaceLayout from '@/Layouts/MarketplaceLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head } from '@inertiajs/react';

export default function Edit({ auth, mustVerifyEmail, status }) {
    return (
        <MarketplaceLayout auth={auth}>
            <Head title="Pengaturan Keamanan" />

            <div className="bg-[#FAFAFA] min-h-screen font-['Poppins']">
                <div className="max-w-[1100px] mx-auto px-6 py-12 md:py-20">
                    <div className="mb-12 ml-4">
                        <h2 className="text-4xl font-black text-zinc-900 uppercase leading-none">Keamanan Akun</h2>
                        <p className="text-zinc-400 text-[11px] font-bold uppercase mt-3">Update password dan kelola privasi anda</p>
                    </div>

                    <div className="space-y-10">
                        {/* UPDATE PASSWORD SECTION */}
                        <div className="bg-white rounded-xl p-10 border border-zinc-100 shadow-sm">
                            <UpdatePasswordForm className="max-w-xl" />
                        </div>

                        {/* DELETE ACCOUNT SECTION */}
                        <div className="bg-white rounded-xl p-10 border border-zinc-100 shadow-sm">
                            <DeleteUserForm className="max-w-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </MarketplaceLayout>
    );
}
