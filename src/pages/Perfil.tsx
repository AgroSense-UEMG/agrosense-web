import { useState, useEffect, ChangeEvent, CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import emailjs from '@emailjs/browser';

interface Usuario {
  nome: string;
  email: string;
  foto?: string;
}

export default function Perfil() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [nome, setNome] = useState("");
  const [fotoPreview, setFotoPreview] = useState("");
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("usuarioLogado");
    if (data) {
      const userStorage = JSON.parse(data);
      setUsuario(userStorage);
      setNome(userStorage.nome || "");
      setFotoPreview(userStorage.foto || "");
    } else {
      navigate("/login", {
  state: {
    from: location,
    precisaLogin: true
  }
})
    }
  }, [navigate]);

  const handleFoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Imagem muito grande! Máximo 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        if (typeof base64 === "string") setFotoPreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSalvar = () => {
    if (!usuario) return;
    const atualizado = { ...usuario, nome: nome.trim(), foto: fotoPreview };
    localStorage.setItem("usuarioLogado", JSON.stringify(atualizado));
    setUsuario(atualizado);
    
    window.dispatchEvent(new Event("userUpdated"));
    toast.success("Perfil atualizado com sucesso!");
  };

  const handleEnviarLinkSenha = () => {
    const emailDestino = usuario?.email;

    if (emailDestino && emailDestino.includes("@")) {
      const baseUrl = window.location.origin;

      const templateParams = {
        to_name: usuario?.nome || "Usuário",
        email: emailDestino, 
        mensage: `${baseUrl}/redefinir-senha`,
      };

      emailjs.send(
        'service_5wgg6wi',
        'template_oefgybr',
        templateParams,
        '80IGB1cd01jBETeR-'
      )
      .then(() => {
        toast.success(`📧 Link enviado para ${emailDestino}`);
        setMenuAberto(false);
      })
      .catch((err) => {
        toast.error("Erro ao enviar e-mail. Verifique a conexão.");
        console.error("Erro EmailJS:", err);
      });
    } else {
      toast.error("Erro: E-mail não encontrado no cadastro.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("usuarioLogado");
    window.dispatchEvent(new Event("userUpdated"));
   navigate("/login", {
  state: {
    from: location,
    precisaLogin: true
  }
})
  };

  if (!usuario) return <div style={{ textAlign: "center", padding: "50px" }}>Carregando...</div>;

  return (
    <div style={styles.container}>
      
      {/* BOTÃO ENGRENAGEM (TOP RIGHT) */}
      <div style={styles.areaConfig}>
        <button 
          style={styles.btnEngrenagem} 
          onClick={() => setMenuAberto(!menuAberto)}
          title="Configurações"
        >
          ⚙️
        </button>

        {menuAberto && (
          <div style={styles.dropdown}>
            <button style={styles.dropItem} onClick={() => { navigate("/gerenciar-pesquisas"); setMenuAberto(false); }}>
              ✏️ Gerenciar Pesquisas
            </button>
            <button style={styles.dropItem} onClick={handleEnviarLinkSenha}>
              📧 Alterar Senha
            </button>
            <div style={{ borderTop: "1px solid #f1f5f9", margin: "4px 0" }}></div>
            <button style={{ ...styles.dropItem, color: "#ef4444" }} onClick={handleLogout}>
              🚪 Sair da Conta
            </button>
          </div>
        )}
      </div>

      <div style={styles.card}>
        {/* Avatar */}
        <div style={styles.avatar}>
          {fotoPreview ? (
            <img src={fotoPreview} alt="avatar" style={styles.img} />
          ) : (
            <span style={{ textTransform: "uppercase" }}>
              {nome ? nome.charAt(0) : usuario.email.charAt(0)}
            </span>
          )}
        </div>

        <label style={styles.uploadBtn}>
          📷 Trocar Foto
          <input type="file" accept="image/*" onChange={handleFoto} hidden />
        </label>

        {/* BOTÃO MINHAS PESQUISAS */}
        <button 
          onClick={() => navigate("/minhas-pesquisas")} 
          style={styles.btnVerde}
        >
          🔍 Minhas Pesquisas
        </button>

        <hr style={styles.divisor} />

        <div style={styles.campo}>
          <label style={styles.label}>Nome de Exibição</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.campo}>
          <label style={styles.label}>E-mail</label>
          <p style={styles.emailText}>{usuario.email}</p>
        </div>

        {/* BOTÃO SALVAR */}
        <button style={styles.btnVerde} onClick={handleSalvar}>
          Salvar Alterações
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    position: "relative",
    padding: "20px"
  },
  areaConfig: {
    position: "absolute",
    top: "25px",
    right: "25px",
    zIndex: 999
  },
  btnEngrenagem: {
    fontSize: "24px",
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "10px",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    transition: "transform 0.2s ease"
  },
  dropdown: {
    position: "absolute",
    top: "55px",
    right: "0",
    backgroundColor: "#fff",
    minWidth: "220px",
    borderRadius: "16px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.12)",
    border: "1px solid #f1f5f9",
    padding: "8px",
    display: "flex",
    flexDirection: "column",
    zIndex: 1000
  },
  dropItem: {
    textAlign: "left",
    padding: "12px 15px",
    background: "none",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    color: "#475569",
    cursor: "pointer",
    transition: "background 0.2s"
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#fff",
    borderRadius: "32px",
    padding: "40px",
    textAlign: "center",
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.03)",
    border: "1px solid #f1f5f9"
  },
  avatar: {
    width: "110px",
    height: "110px",
    borderRadius: "50%",
    backgroundColor: "#1f7a3a",
    margin: "0 auto 15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    fontSize: "40px",
    color: "#fff",
    fontWeight: "900",
    border: "4px solid #f0fdf4",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
  },
  img: { width: "100%", height: "100%", objectFit: "cover" },
  uploadBtn: {
    display: "inline-block",
    padding: "8px 16px",
    backgroundColor: "#f0fdf4",
    color: "#1f7a3a",
    borderRadius: "15px",
    cursor: "pointer",
    marginBottom: "25px",
    fontSize: "12px",
    fontWeight: "bold",
    border: "none"
  },
  btnVerde: {
    width: "100%",
    padding: "15px",
    backgroundColor: "#1f7a3a",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
    boxShadow: "0 10px 15px -3px rgba(31, 122, 58, 0.2)",
    marginTop: "10px",
    marginBottom: "10px"
  },
  divisor: { border: "0", borderTop: "1px solid #f1f5f9", margin: "25px 0" },
  campo: { textAlign: "left", marginBottom: "20px" },
  label: { fontSize: "11px", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase" },
  input: {
    width: "100%",
    padding: "13px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    marginTop: "6px",
    outline: "none",
    fontSize: "15px",
    boxSizing: "border-box",
    transition: "border-color 0.2s"
  },
  emailText: { margin: "8px 0", color: "#64748b", fontSize: "14px", fontWeight: "500" }
};