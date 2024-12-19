import styles from './Mensagem.module.css'
import { useEffect, useState } from "react";

function Mensagem({ type, msg }) {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if (msg) {
            setVisible(true)
            const timer = setTimeout(() => {
                setVisible(false)
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [msg])

    return (
        <>
            {visible && (
                <div className={`${styles.Mensagem} ${styles[type]}`}>
                    <p>{msg}</p>
                </div>
            )}
        </>
    )
}

export default Mensagem
