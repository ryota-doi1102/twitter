import Image from 'next/image';
import styles from 'styles/organisms/footer.module.scss';

export const Footer: React.FC = () => (
  <footer className={styles.footer}>
    <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">
      Powered by <Image src="/vercel.svg" alt="Vercel Logo" layout="fill" />
    </a>
  </footer>
);
