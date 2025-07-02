export default function Footer() {
  return (
    <footer className="footer">
      <div className="footerContent">
        <p className="footerCopyright">
          &copy; {new Date().getFullYear()} MAConsulting Srl. Tutti i diritti riservati.
        </p>
      </div>
    </footer>
  );
}
