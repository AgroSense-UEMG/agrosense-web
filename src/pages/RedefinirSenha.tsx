import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function RedefinirSenha() {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const navigate = useNavigate();

  const handleTroca = (e: React.FormEvent) => {
    e.preventDefault();
    if (novaSenha !== confirmar) return toast.error("As senhas não coincidem!");
    if (novaSenha.length < 6) return toast.error("A senha deve ter pelo menos 6 dígitos.");

    const data = localStorage.getItem("usuarioLogado");
    if (data) {
        const user = JSON.parse(data);
        console.log("Senha alterada para o usuário:", user.email);
    }

    toast.success("Senha atualizada com sucesso! Faça login novamente.");
    navigate("/login", {
  state: {
    from: location,
    precisaLogin: true
  }
})
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleTroca} style={styles.form}>
        <div style={styles.iconArea}>🔐</div>
        <h2 style={styles.titulo}>Nova Senha</h2>
        <p style={styles.subtitulo}>Crie uma senha forte para proteger sua conta Agrosense.</p>
        
        <input 
          type="password" 
          placeholder="Nova Senha" 
          required
          style={styles.input}
          onChange={(e) => setNovaSenha(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Confirme a Nova Senha" 
          required
          style={styles.input}
          onChange={(e) => setConfirmar(e.target.value)}
        />
        
        <button type="submit" style={styles.btnVerde}>
          Atualizar Senha
        </button>
        
        <button 
          type="button" 
          onClick={() => navigate("/perfil")} 
          style={styles.btnCancelar}
        >
          Cancelar
        </button>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { 
    height: "100vh", 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#f8fafc",
    padding: "20px" 
  },
  form: { 
    width: "100%", 
    maxWidth: "400px", 
    backgroundColor: "#fff", 
    padding: "40px", 
    borderRadius: "32px", 
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.05)",
    textAlign: "center" as const,
    border: "1px solid #f1f5f9"
  },
  iconArea: { fontSize: "40px", marginBottom: "10px" },
  titulo: { fontSize: "24px", fontWeight: 900, color: "#1e293b", marginBottom: "10px" },
  subtitulo: { fontSize: "14px", color: "#64748b", marginBottom: "25px", lineHeight: "1.5" },
  input: { 
    width: "100%", 
    padding: "15px", 
    marginBottom: "15px", 
    borderRadius: "14px", 
    border: "1px solid #e2e8f0",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box"
  },
  btnVerde: { 
    width: "100%", 
    padding: "16px", 
    backgroundColor: "#1f7a3a", 
    color: "#fff", 
    border: "none", 
    borderRadius: "14px", 
    fontWeight: "bold", 
    fontSize: "16px",
    cursor: "pointer",
    boxShadow: "0 10px 15px -3px rgba(31, 122, 58, 0.2)",
    marginBottom: "10px"
  },
  btnCancelar: {
    background: "none",
    border: "none",
    color: "#94a3b8",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px"
  }
};