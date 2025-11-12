import { useState } from 'react';
import axiosInstance from '../../../app/axiosInstance'; // Usamos tu instancia de axios
import { toast } from 'react-toastify';

const Reportes = () => {
    const [loadingPdf, setLoadingPdf] = useState<boolean>(false);
    const [loadingExcel, setLoadingExcel] = useState<boolean>(false);
    const [topError, setTopError] = useState('');

    // Función para generar el PDF de asistencia
    const handleGeneratePdf = async () => {
        setTopError('');

        setLoadingPdf(true);
        try {
            const response = await axiosInstance.post('/asistencia-docentes/pdf', {
                from_date: '2023-01-01',  // Usa las fechas adecuadas
                to_date: '2023-12-31',
                responseType: 'blob', // Importante para manejar el archivo binario
            });

            // Crear un enlace de descarga y hacer que se descargue el archivo PDF
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'asistencia_docentes.pdf'); // Nombre del archivo
            document.body.appendChild(link);
            link.click();
        } catch (error: any) {
            console.error('Error completo:', error);

            if (error.response) {
                const { status, data } = error.response;

                // Error 422: Errores de validación
                if (status === 422 && data.errors) {
                    setTopError(JSON.stringify(data.errors, null, 2));
                    toast.error('Error de validación. Revisa los campos.');
                }
                // Error 500: Error del servidor
                else if (status === 500) {
                    const errorMessage = data.message || data.error || 'Error interno del servidor';
                    setTopError(`Error del servidor: ${errorMessage}`);
                    toast.error('Error en el servidor. Contacta al administrador.');
                }
                // Otros errores con respuesta
                else {
                    const errorMsg = data.message || data.error || 'Error desconocido';
                    setTopError(errorMsg);
                    toast.error(errorMsg);
                }
            } else if (error.request) {
                // Error de red (sin respuesta del servidor)
                setTopError('No se pudo conectar con el servidor');
                toast.error('Error de conexión. Verifica tu internet.');
            } else {
                // Otro tipo de error
                setTopError(error.message || 'Error inesperado');
                toast.error('Error inesperado');
            }
        } finally {
            setLoadingPdf(false);
        }
    };

    // Función para generar el reporte Excel
    const handleGenerateExcel = async () => {
        setLoadingExcel(true);
        setTopError('');

        try {
            const response = await axiosInstance.post('/asistencia-docentes/report', {
                from_date: '2023-01-01',  // Usa las fechas adecuadas
                to_date: '2023-12-31',
                responseType: 'blob', // Importante para manejar el archivo binario
            });

            // Crear un enlace de descarga y hacer que se descargue el archivo Excel
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'asistencia_docentes.xlsx'); // Nombre del archivo
            document.body.appendChild(link);
            link.click();
        } catch (error: any) {

            if (error.response) {
                const { status, data } = error.response;

                // Error 422: Errores de validación
                if (status === 422 && data.errors) {
                    setTopError(JSON.stringify(data.errors, null, 2));
                    toast.error('Error de validación. Revisa los campos.');
                }
                // Error 500: Error del servidor
                else if (status === 500) {
                    const errorMessage = data.message || data.error || 'Error interno del servidor';
                    setTopError(`Error del servidor: ${errorMessage}`);
                    toast.error('Error en el servidor. Contacta al administrador.');
                }
                // Otros errores con respuesta
                else {
                    const errorMsg = data.message || data.error || 'Error desconocido';
                    setTopError(errorMsg);
                    toast.error(errorMsg);
                }
            } else if (error.request) {
                // Error de red (sin respuesta del servidor)
                setTopError('No se pudo conectar con el servidor');
                toast.error('Error de conexión. Verifica tu internet.');
            } else {
                // Otro tipo de error
                setTopError(error.message || 'Error inesperado');
                toast.error('Error inesperado');
            }
        } finally {
            setLoadingExcel(false);
        }
    };

    return (
        <div className="container">
            <h1 className="text-2xl font-bold mb-4">Generar Reportes de Asistencia</h1>
            {topError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                                Error al procesar la solicitud
                            </h3>
                            <div className="mt-2 text-sm text-red-700">
                                <pre className="whitespace-pre-wrap">{topError}</pre>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="space-x-4">
                <button
                    onClick={handleGeneratePdf}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    disabled={loadingPdf}
                >
                    {loadingPdf ? 'Generando PDF...' : 'Generar PDF'}
                </button>
                <button
                    onClick={handleGenerateExcel}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    disabled={loadingExcel}
                >
                    {loadingExcel ? 'Generando Excel...' : 'Generar Excel'}
                </button>
            </div>
        </div>
    );
};

export default Reportes;
