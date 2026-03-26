import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../hooks/useWallet';
import { EarningsSummary } from '../components/wallet/EarningsSummary';
import { EarningsHistoryList } from '../components/wallet/EarningsHistoryList';
import { WalletReviewItem } from '../components/wallet/WalletReviewItem';
import { Card } from '../components/ui/Card';

const Spinner = () => (
    <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
);

/**
 * Billetera de la niñera: ganancias, historial de servicios y reseñas recibidas.
 */
export default function WalletPage() {
    const navigate = useNavigate();
    const { profile } = useAuth();
    const { data, loading, error } = useWallet(profile?.id);

    return (
        <div className="max-w-md mx-auto px-4 py-6 space-y-4">
            <div className="flex items-center gap-3">
                <button onClick={() => navigate('/dashboard/nanny')}
                    className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <h1 className="font-bold text-gray-900 font-poppins text-lg">Mi billetera</h1>
            </div>

            {loading && <Spinner />}

            {error && <p className="text-center text-red-500 py-4">{error}</p>}

            {!loading && data && (
                <>
                    <EarningsSummary data={data} />
                    <EarningsHistoryList history={data.history ?? []} />

                    {(data.reviews?.length > 0) && (
                        <Card className="p-5">
                            <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-3">
                                Reseñas recibidas
                            </p>
                            {data.reviews.map((r) => (
                                <WalletReviewItem key={r.id} review={r} />
                            ))}
                        </Card>
                    )}
                </>
            )}
        </div>
    );
}
