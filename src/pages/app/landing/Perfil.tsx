import { useState, useEffect } from "react"
import type { ChangeEvent, CSSProperties } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { toast } from "react-toastify"

interface Usuario {
  nome: string
  email: string
  foto?: string
}

export default function Perfil() {
  const navigate = useNavigate()
  const location = useLocation()

  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [nome, setNome] = useState("")
  const [fotoPreview, setFotoPreview] = useState("")

  useEffect(() => {
    const data = localStorage.getItem("usuarioLogado")

    if (data) {
      try {
        const userStorage = JSON.parse(data)
        setUsuario(userStorage)
        setNome(userStorage.nome || "")
        setFotoPreview(userStorage.foto || "")
      } catch {
        localStorage.removeItem("usuarioLogado")
        navigate("/login", {
          state: { from: location, precisaLogin: true },
          replace: true,
        })
      }
    } else {
      navigate("/login", {
        state: { from: location, precisaLogin: true },
        replace: true,
      })
    }
  }, [navigate, location])

  const handleFoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Imagem muito grande! Máximo 2MB.")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result
      if (typeof base64 === "string") {
        setFotoPreview(base64)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSalvar = () => {
    if (!usuario) return

    const atualizado: Usuario = {
      ...usuario,
      nome: nome.trim(),
      foto: fotoPreview,
    }

    localStorage.setItem("usuarioLogado", JSON.stringify(atualizado))
    setUsuario(atualizado)

    window.dispatchEvent(new Event("userUpdated"))

    toast.success("Perfil atualizado com sucesso!")
  }

  if (!usuario) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        Carregando...
      </div>
    )
  }

  return (
    <div style={styles.container}>
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
          onClick={() => navigate("/app/projects")}
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

        <button style={styles.btnVerde} onClick={handleSalvar}>
          Salvar Alterações
        </button>
      </div>
    </div>
  )
}

const styles: Record<string, CSSProperties> = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    position: "relative",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#fff",
    borderRadius: "32px",
    padding: "40px",
    textAlign: "center",
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.03)",
    border: "1px solid #f1f5f9",
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
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
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
    border: "none",
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
    marginBottom: "10px",
  },
  divisor: {
    border: "0",
    borderTop: "1px solid #f1f5f9",
    margin: "25px 0",
  },
  campo: {
    textAlign: "left",
    marginBottom: "20px",
  },
  label: {
    fontSize: "11px",
    fontWeight: "800",
    color: "#94a3b8",
    textTransform: "uppercase",
  },
  input: {
    width: "100%",
    padding: "13px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    marginTop: "6px",
    outline: "none",
    fontSize: "15px",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  emailText: {
    margin: "8px 0",
    color: "#64748b",
    fontSize: "14px",
    fontWeight: "500",
  },
}