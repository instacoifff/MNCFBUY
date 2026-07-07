/* eslint-disable */
// @ts-nocheck
import { LoginForm } from './LoginForm'
import styles from './login.module.css'

export default function AdminLogin() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>
          Moncef<span>Buy</span>
        </div>
        <p className={styles.subtitle}>Super Admin Dashboard Access</p>
        
        <LoginForm />
      </div>
    </div>
  )
}
