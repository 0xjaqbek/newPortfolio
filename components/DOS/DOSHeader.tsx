import BlockCursor from './BlockCursor';
import styles from './DOSHeader.module.css';

const ASCII_ART = `
     ██╗  ███████╗
     ██║  ██╔════╝
     ██║  ███████╗
██   ██║  ╚════██║
╚██████╔╝ ███████║
 ╚═════╝  ╚══════╝`.trim();

export default function DOSHeader() {
  return (
    <div className={styles.header}>
      <pre className={styles.ascii} aria-hidden="true">{ASCII_ART}</pre>
      <div className={styles.info}>
        <div className={styles.name}>
          JAKUB SKWIERAWSKI<BlockCursor />
        </div>
        <div className={styles.title}>FULL-STACK DEVELOPER</div>
        <div className={styles.location}>Warsaw, Poland</div>
      </div>
    </div>
  );
}
