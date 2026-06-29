'use client'
import { createContext, useCallback, useContext, useState } from "react";

const ThemeContext = createContext({
    isDark: false,
    toggleTheme: () => { }
})


const ModalContext = createContext({
    modal: { isOpen: false, title: '', content: null },
    openModal: () => { },
    closeModal: () => { },
})

const ToastContext = createContext({
    toasts: [],
    showToast: () => { },
})

export function AppProvider({ children }) {
    const [isDark, setIsDark] = useState(false)
    const [modal, setModal] = useState({ isOpen: false, title: '', content: null })
    const [toasts, setToasts] = useState([])


    const toggleTheme = useCallback(() => {
        setIsDark((d) => !d)
    }, [])

    const openModal = useCallback((title, content) => {
        setModal({ isOpen: true, title, content })
    }, [])

    const closeModal = useCallback(() => {
        setModal({ isOpen: false, title: '', content: null })
    }, [])

    const showToast = useCallback((message, type = 'success') => {
        const id = Date.now()

        setToasts((prev) => [...prev, { id, message, type }])

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id))
        }, 3000)
    }, [])

    return (<>
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            <ModalContext.Provider value={{ modal, openModal, closeModal }}>
                <ToastContext.Provider value={{ toasts, showToast }}>
                    {children}

                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2">
                        {toasts.map((toast) => (
                            <div
                                key={toast.id}
                                className={`px-5 py-3 rounded-full text-white text-sm font-semibold shadow-lg animate-bounce-in
                  ${toast.type === 'success' ? 'bg-gray-900' : ''}
                  ${toast.type === 'error' ? 'bg-red-500' : ''}
                  ${toast.type === 'info' ? 'bg-blue-500' : ''}
                `}
                            >
                                {toast.message}
                            </div>
                        ))}
                    </div>


                    {modal.isOpen && (
                        <div
                            className="fixed inset-0 bg-black/50 z-[9998] flex items-center justify-center p-4"
                            onClick={closeModal}
                        >
                            <div
                                className="bg-white rounded-2xl p-6 max-w-md w-full"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-bold">{modal.title}</h2>
                                    <button
                                        onClick={closeModal}
                                        className="text-gray-400 hover:text-gray-700 text-xl"
                                    >
                                        ✕
                                    </button>
                                </div>
                                {modal.content}
                            </div>
                        </div>
                    )}
                </ToastContext.Provider>
            </ModalContext.Provider>
        </ThemeContext.Provider>

    </>

    )
}

export const useTheme = () => useContext(ThemeContext)
export const useModal = () => useContext(ModalContext)
export const useToast = () => useContext(ToastContext) 