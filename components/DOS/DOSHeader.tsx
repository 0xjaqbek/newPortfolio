import BlockCursor from './BlockCursor';
import styles from './DOSHeader.module.css';

const ASCII_ART = `
     ██╗  ███████╗
     ██║  ██╔════╝
     ██║  ███████╗
██   ██║  ╚════██║
╚██████║  ███████║
 ╚═════╝  ╚══════╝`.replace(/^\n/, '').trimEnd();

export default function DOSHeader() {
  return (
    <div className={styles.header}>
      <pre className={styles.ascii} aria-hidden="true">{ASCII_ART}</pre>
      <div className={styles.info}>
        <div className={styles.name}>
          JAKUB SKWIERAWSKI<BlockCursor />
        </div>
        <div className={styles.title}>AI FULL-STACK DEVELOPER</div>
        <div className={styles.location}>Kościerzyna, Poland</div>
      </div>
    </div>
  );
}
