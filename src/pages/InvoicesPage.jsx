import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useInvoices } from '../hooks/useInvoices';
import { InvoiceList } from '../components/invoices/InvoiceList';

const Spinner = () => (
    <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
);

/**
 * Página de facturas del usuario (familia o niñera).
 * Ruta: /invoices
 */
export default function InvoicesPage() {
    const navigate = useNavigate();
    const { profile } = useAuth();
    const role = profile?.role;
    const { invoices, loading, error } = useInvoices(profile?.id);

    return (
        <div className="max-w-md mx-auto px-4 py-6 space-y-4">
            <div className="flex items-center gap-3">
                <button onClick={() => navigate(`/dashboard/${role}`)}
                    className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                    <ArrowLeft size={20} className="text-gray-600" />
                </button>
                <h1 className="font-bold text-gray-900 font-poppins text-lg">Mis facturas</h1>
            </div>

            {loading && <Spinner />}
            {error  && <p className="text-center text-red-500 py-4">{error}</p>}
            {!loading && !error && <InvoiceList invoices={invoices} />}
        </div>
    );
}
